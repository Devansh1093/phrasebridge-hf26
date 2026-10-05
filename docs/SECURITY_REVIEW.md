# Security review

## Findings

- The application has no committed AI credential. `.env.example` contains placeholders; `.env` is ignored by Git.
- The web server binds to `0.0.0.0` and uses the platform-provided `PORT`, which permits Render's web service health checks.
- OpenRouter endpoint, API key, and model are read from `CHAT_API_URL`, `CHAT_API_KEY`, and `CHAT_MODEL`. Requests use the OpenAI-compatible chat completions format with `google/gemma-4-26b-a4b-it`; the API key is sent as a bearer token.
- `/api/health` only checks the web process and does not expose credentials or provider details.

## Risks and limits

- OpenRouter processes conversation text and receives the API key as a bearer token. Review OpenRouter's privacy and security terms, keep the key private, and avoid entering sensitive content. Render hosts the Python application but does not provide AI inference.
- The model may produce incorrect language suggestions. The app is a practice aid, not a source of authoritative language instruction.
