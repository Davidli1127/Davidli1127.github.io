export class AgentError extends Error {
  constructor(code, status = 503) { super(code); this.code = code; this.status = status; }
}

export const FREE_MODELS = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

// API keys are opaque credentials. Google now issues authorization keys as well
// as standard keys; neither a historical prefix nor length is a validity check.
export function normalizeGeminiKey(value) {
  const key = typeof value === 'string' ? value.trim() : '';
  if (!key || key.length > 8192 || /[^\x21-\x7e]/.test(key)) {
    throw new AgentError('invalid_key_format', 400);
  }
  return key;
}

async function providerError(response) {
  let error;
  try { error = (await response.json()).error; } catch { /* Non-JSON error bodies stay private. */ }
  const reasons = Array.isArray(error?.details) ? error.details.map(d => d.reason) : [];
  // Only return our fixed codes, never Google's message, metadata, or key value.
  if (response.status === 429) return new AgentError('quota_exhausted', 429);
  if (response.status === 401 || reasons.includes('API_KEY_INVALID')) return new AgentError('key_rejected');
  if (reasons.some(r => typeof r === 'string' && /^API_KEY_.*_BLOCKED$/.test(r))) return new AgentError('key_restricted');
  if (response.status === 403) return new AgentError('permission_denied');
  if (response.status === 404) return new AgentError('model_unavailable');
  if (response.status === 400) return new AgentError('upstream_invalid_request');
  const failure = new AgentError('upstream_unavailable');
  failure.providerStatus = response.status;
  return failure;
}

export function createGemini(env, { fetchImpl = fetch, signal } = {}) {
  const model = env.GEMINI_MODEL || FREE_MODELS[0];
  if (!env.GEMINI_API_KEY) throw new AgentError('not_configured');
  if (env.FREE_TIER_CONFIRMED !== '1') throw new AgentError('free_tier_unconfirmed');
  if (!FREE_MODELS.includes(model)) throw new AgentError('model_not_allowed');
  const apiKey = normalizeGeminiKey(env.GEMINI_API_KEY);
  let calls = 0, retriesRemaining = 1;
  return async function ask({ system, input, schema, maxTokens = 2400, thinkingLevel = 'low' }) {
    if (++calls > 3) throw new AgentError('call_budget_exceeded');
    let response;
    for (;;) {
     const timeout = AbortSignal.timeout(45000);
     try {
      response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: JSON.stringify(input) }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            thinkingConfig: { thinkingLevel },
            responseMimeType: 'application/json', responseJsonSchema: schema
          }
        })
      });
     } catch { throw new AgentError(signal?.aborted ? 'cancelled' : 'upstream_timeout'); }
     if ([500, 502, 503, 504].includes(response.status) && retriesRemaining > 0 && !signal?.aborted) {
       retriesRemaining--;
       await response.body?.cancel();
       await new Promise(resolve => setTimeout(resolve, 650));
       continue;
     }
     break;
    }
    if (!response.ok) {
      throw await providerError(response);
    }
    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (!candidate || candidate.finishReason === 'SAFETY') throw new AgentError('unable_to_answer', 422);
    const text = candidate.content?.parts?.filter(p => !p.thought).map(p => p.text || '').join('');
    if (!text || candidate.finishReason === 'MAX_TOKENS') throw new AgentError('incomplete_response');
    try { return JSON.parse(text); } catch { throw new AgentError('invalid_model_response'); }
  };
}
