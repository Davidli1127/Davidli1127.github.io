import { z } from 'zod';
import knowledge from '../content/knowledge.json' with { type: 'json' };
import persona from '../content/persona.json' with { type: 'json' };
import { createGemini, AgentError } from './model.mjs';
import { createInterviewGraph } from './graph.mjs';

const Input = z.object({
  question: z.string().trim().min(1).max(2000),
  history: z.array(z.object({ role: z.enum(['user','assistant']), content: z.string().max(6500) })).max(8).default([]),
  language: z.enum(['zh','en']).default('zh')
}).strict();
const localLimits = new Map();
const compiledGraphs = new WeakMap();
export function allowedOrigin(request, env) {
  // Same-origin GETs do not carry Origin in browsers. Only the loopback dev
  // server may use its own URL as the fallback; production remains explicit.
  const origin = request.headers.get('Origin') || (env.ENVIRONMENT === 'development' ? new URL(request.url).origin : null);
  const allowed = (env.ALLOWED_ORIGINS || 'https://davidli1127.github.io').split(',').map(s => s.trim());
  return origin && allowed.includes(origin) ? origin : null;
}
function headers(origin) {
  return { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept' };
}
export async function consumeQuota(env, ip, now = Date.now()) {
  const day = new Date(now).toISOString().slice(0, 10);
  const daily = Math.min(200, Math.max(1, Number(env.DAILY_CHAT_LIMIT) || 60));
  if (env.ENVIRONMENT === 'development') {
    const bucket = Math.floor(now / 60000), key = `${ip}:${bucket}`;
    if (localLimits.size > 200) localLimits.clear();
    const count = (localLimits.get(key) || 0) + 1;
    localLimits.set(key, count);
    if (count > 20) throw new AgentError('rate_limited', 429);
    return;
  }
  if (!env.DB) throw new AgentError('quota_store_missing');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${day}:${ip}`));
  const hash = [...new Uint8Array(digest)].slice(0, 16).map(b => b.toString(16).padStart(2,'0')).join('');
  const expire = now + 86400000;
  const increment = async (key, limit) => env.DB.prepare(
    'INSERT INTO quotas (key, count, expires) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < ? RETURNING count'
  ).bind(key, expire, limit).first();
  await env.DB.prepare('DELETE FROM quotas WHERE expires < ?').bind(now).run();
  if (!await increment(`ip:${hash}:${Math.floor(now / 600000)}`, 8)) throw new AgentError('rate_limited', 429);
  if (!await increment(`day:${day}`, daily)) throw new AgentError('daily_limit', 429);
}
export async function runInterview(input, env, { onStep, signal, ask, corpus = knowledge, voice = persona } = {}) {
  const parsed = Input.safeParse(input);
  if (!parsed.success) throw new AgentError('invalid_request', 400);
  let cached = compiledGraphs.get(corpus);
  if (!cached || cached.voice !== voice) {
    cached = { voice, graph: createInterviewGraph({ knowledge: corpus, persona: voice }) };
    compiledGraphs.set(corpus, cached);
  }
  // The graph is reusable; provider credentials and progress callbacks remain
  // request-scoped so simultaneous visitors cannot share state or credentials.
  const result = await cached.graph.invoke(parsed.data, { recursionLimit: 8, configurable: { ask: ask || createGemini(env, { signal }), onStep } });
  return result.result;
}
export async function readJson(request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw new AgentError('invalid_request', 400);
  if (Number(request.headers.get('Content-Length') || 0) > 32000) throw new AgentError('request_too_large', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new AgentError('invalid_request', 400);
  const chunks = []; let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if ((bytes += value.length) > 32000) { await reader.cancel(); throw new AgentError('request_too_large', 413); }
    chunks.push(value);
  }
  const joined = new Uint8Array(bytes); let offset = 0;
  for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(joined)); } catch { throw new AgentError('invalid_request', 400); }
}
export async function handleRequest(request, env, overrides = {}) {
  const origin = allowedOrigin(request, env);
  const path = new URL(request.url).pathname;
  if (!origin) return Response.json({ error: 'origin_not_allowed' }, { status: 403 });
  const common = headers(origin);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: common });
  if (path === '/health' && request.method === 'GET') return Response.json({ ready: Boolean(env.GEMINI_API_KEY && env.FREE_TIER_CONFIRMED === '1' && (env.DB || env.ENVIRONMENT === 'development')), version: knowledge.version }, { headers: common });
  if (path !== '/chat' || request.method !== 'POST') return Response.json({ error: 'not_found' }, { status: 404, headers: common });
  const fail = error => ({ error: error instanceof AgentError ? error.code : 'service_unavailable',
    ...(error instanceof AgentError && Number.isInteger(error.providerStatus) ? { providerStatus: error.providerStatus } : {}) });
  try {
    const input = await readJson(request);
    if (!Input.safeParse(input).success) throw new AgentError('invalid_request', 400);
    if (!overrides.ask) createGemini(env);
    await consumeQuota(env, request.headers.get('CF-Connecting-IP') || 'local');
    if (!request.headers.get('Accept')?.includes('text/event-stream')) {
      const result = await runInterview(input, env, { ...overrides, signal: request.signal });
      return Response.json(result, { headers: common });
    }
    const abort = new AbortController();
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const send = data => { if (!abort.signal.aborted) controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)); };
        runInterview(input, env, { ...overrides, signal: AbortSignal.any([abort.signal, request.signal]), onStep: stage => send({ type: 'status', stage }) })
          .then(result => send({ type: 'result', result }))
          .catch(error => send({ type: 'error', ...fail(error) }))
          .finally(() => { if (!abort.signal.aborted) controller.close(); });
      },
      cancel() { abort.abort(); }
    });
    return new Response(stream, { headers: { ...common, 'Content-Type': 'text/event-stream; charset=utf-8' } });
  } catch (error) {
    return Response.json(fail(error), { status: error instanceof AgentError ? error.status : 503, headers: common });
  }
}

export { knowledge, persona };
