// lib/aiModels.js
// Shared allowlist of AI models.
// These are the models offered by the AI assistant UI
// (components/AIAssistantModal.jsx). The API routes /api/generate and
// /api/generate-global reject any model outside this list with 400,
// so the UI and the server must use the same single source of truth.
// Safe to import from both client and server code (plain data, no secrets).

export const ALLOWED_AI_MODELS = [
  'google/gemini-2.5-flash',
  'google/gemini-flash-1.5',
  'meta-llama/llama-3-8b-instruct:free',
  'openai/gpt-4o-mini',
  'anthropic/claude-3.5-sonnet',
];

// Fallback used when the request does not specify a model.
export const DEFAULT_AI_MODEL = 'google/gemini-flash-1.5';
