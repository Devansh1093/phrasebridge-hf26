# PhraseBridge

PhraseBridge is a low-pressure language practice chat. Choose a language and everyday situation, practice a reply, and ask for a gentle, balanced, or detailed correction when you want one. The AI keeps the role-play moving with a follow-up question. Chat history stays in the current browser page and clears when you reset or reload.

## AI and privacy

The server sends the learner's selected language, scenario, correction preference, and recent messages to OpenRouter's OpenAI-compatible chat completions endpoint, using `google/gemma-4-26b-a4b-it`. Render hosts the public Python web application; OpenRouter provides access to the model for inference. The app does not store chat history, but the configured provider processes submitted text; avoid entering sensitive information. AI corrections can be wrong and are suggestions, not authoritative instruction.

## Run locally

Requires Python 3.10+ and an OpenRouter API key for hosted Gemma inference. There are no Python package dependencies.

```sh
cp .env.example .env
# Edit .env with your OpenRouter API key. Keep the key secret.
set -a && . ./.env && set +a
python3 app.py
```

Open < https://phrasebridge-hf26.onrender.com>. 

| Variable | Required | Purpose |
| --- | --- | --- |
| `CHAT_API_URL` | Yes for chat | OpenRouter OpenAI-compatible chat completions endpoint: `https://openrouter.ai/api/v1/chat/completions`. |
| `CHAT_API_KEY` | Yes for chat | OpenRouter API key, stored as a secret and sent as a bearer token. |
| `CHAT_MODEL` | Yes for chat | `google/gemma-4-26b-a4b-it`. |
| `PORT` | No | Web server port; Render supplies this automatically. Defaults to `8000` locally. |

`GET /api/health` returns `{"ok": true}` when the web process is serving requests. It does not test the external AI provider. Chat requests return a clear service error if the AI settings are missing or the provider is unavailable.

## Deploy on Render

1. Create a **Web Service** from the public GitHub repository, using this project directory as the repository root. The included `render.yaml` defines the Python service, build/start commands, and health check.
2. In the Render service's Environment settings, set `CHAT_API_URL` to `https://openrouter.ai/api/v1/chat/completions`, `CHAT_MODEL` to `google/gemma-4-26b-a4b-it`, and add `CHAT_API_KEY` as a secret. Do not commit the key. Render hosts the Python web application; model inference is accessed through OpenRouter.
3. Deploy, then check `/api/health` on the generated `onrender.com` URL and try a chat. Add that working URL here as the demo link before submission.

The app binds to `0.0.0.0` and the `PORT` supplied by Render. The `render.yaml` is deployment configuration only; no live deployment has been performed or verified. A provider API key and any required provider quota/billing setup are the operator's responsibility; this project creates no provider account and makes no inference-cost guarantee.

## Challenge fit: Hacktoberfest Weekend Challenge

The active [official challenge page](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01) calls this round **Build for a Friend**. The [official contest rules](https://dev.to/page/hacktoberfest-weekend-challenge-26-10-01-contest-rules) require a new project built during the entry period, open-source AI at its core, a real problem for a friend or loved one, an explanation of why open-source AI matters, a demo (deployed link or video), project code, and a DEV post using the provided template and `#hf26challenge` tag. The listed entry period is October 2, 2026 02:00 UTC through October 5, 2026 06:59 UTC. The [official HF26 hub](https://dev.to/challenges/hf26/) states the shared prompt: build something with open-source AI at its core and tell readers why open innovation matters. It lists writing quality (weighted most heavily), relevance to prompt/theme, creativity, technical execution, and partner technology for partner-category entries as judging criteria.

PhraseBridge uses the open-weight `google/gemma-4-26b-a4b-it` model through OpenRouter's OpenAI-compatible chat completions endpoint. Render hosts the public Python application; inference is provided through OpenRouter, not Render. This demonstrates Gemma usage for the **Best Use of Gemma** category. Render is used as the public app host; the challenge's Render category description calls out Render as an AI runtime, an agent front end host, or a host for Hermes/OpenClaw, so do not claim **Best Use of Render** eligibility based only on ordinary web-app hosting. The project is designed to help a friend practice a language with low-pressure scenarios and optional corrections. **The builder must still identify the friend and document their real need and feedback truthfully.** The deployed demo URL and code URL, plus the manually published DEV post, must be added to the submission. Recheck the official page and submission interface before entering.

## Checks

```sh
python3 -m unittest discover -s tests -v
python3 -m py_compile app.py
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the request flow and data handling. The DEV draft is [docs/DEV_SUBMISSION.md](docs/DEV_SUBMISSION.md); it must be completed with real friend, demo, and code details before use.
