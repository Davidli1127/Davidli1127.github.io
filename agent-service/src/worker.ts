import { handleRequest } from './service.mjs';
interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
  FREE_TIER_CONFIRMED: string;
  ALLOWED_ORIGINS: string;
  DAILY_CHAT_LIMIT: string;
  ENVIRONMENT: string;
  DB: D1Database;
}
export default { fetch(request: Request, env: Env) { return handleRequest(request, env); } } satisfies ExportedHandler<Env>;
