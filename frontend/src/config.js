// Backend URL comes from the environment so it is never committed to source.
// Set VITE_API_BASE in Vercel (production) or in frontend/.env.local (local dev).
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
