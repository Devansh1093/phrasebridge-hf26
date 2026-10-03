# Architecture

PhraseBridge is a small Python standard-library HTTP server and static browser app. It has no database or frontend build step.

- `app.py`: HTTP server, input validation, AI chat request, and static-file serving.
- `index.html`, `styles.css`, `app.js`: single-page chat interface and in-memory conversation state.
- OpenRouter settings come from `CHAT_API_URL`, `CHAT_API_KEY`, and `CHAT_MODEL`; the application uses the OpenAI-compatible chat completions API with model `google/gemma-4-26b-a4b-it`.
- `tests/test_app.py`: request validation, configured chat request, static HTTP routes, and health endpoint checks.

The browser posts the selected language, situation, correction preference, recent conversation turns, and current message to `/api/chat`. The server bounds and validates the request, maps it to the OpenAI-compatible chat completions format, and sends it to `https://openrouter.ai/api/v1/chat/completions` with model `google/gemma-4-26b-a4b-it`. Render hosts the public Python application; OpenRouter provides access to the model for inference. The app does not persist or log conversation content. OpenRouter processes submitted text; users should avoid sending sensitive personal information. Browser history exists only in page memory and is cleared on reset or reload.

`GET /api/health` reports whether the web process is responding. It intentionally does not depend on provider availability, so platform health checks can succeed independently of inference.

## Limits

Provider uptime, privacy terms, model availability, and inference quality depend on the configured service. The model can produce incorrect language advice; PhraseBridge offers practice suggestions, not qualified instruction.
