# Submission checklist

Recheck the official challenge page and actual DEV submission interface before entering. Challenge rules change; this checklist records the official pages checked October 3, 2026.

## Official requirements

| Requirement | Status | Evidence / remaining work |
| --- | --- | --- |
| New project built during entry period; no existing-project PR | PENDING final repository evidence | Workspace project directory is dated Oct 3, during the Oct 2–5 entry window. Ensure the public repository is new and document any post-deadline changes. |
| Open-source AI at the core | CONFIGURED, LIVE INFERENCE PENDING | PhraseBridge uses the open-weight `google/gemma-4-26b-a4b-it` model through the OpenRouter OpenAI-compatible API. Local provider-backed inference has been verified; a live Render deployment and browser conversation are still pending. |
| Solves a real problem for a friend/loved one | CONTEXT RECORDED; NO USE/FEEDBACK CLAIM | PhraseBridge was built for the builder's sister, who enjoys learning languages. It offers AI conversation practice and optional corrections. No claim is made that she has used the deployed version, and no feedback is invented. |
| Explain why open innovation matters | PENDING final narrative | README and draft cover model choice and open model access; tailor the final explanation to the sister's language-learning context without attributing unprovided feedback or experience. |
| DEV submission post using template and `#hf26challenge` | PENDING | User submits manually; confirm the submission interface is open. |
| Demo link (deployed app or video) | PENDING | Deploy and test the Render service, then add its URL or provide a video. |
| Code link | PENDING | Add public repository URL after final audit and publication. |

## Build checks

| Check | Status | Evidence |
| --- | --- | --- |
| Unit and HTTP tests | PASS | `python3 -m unittest discover -s tests -v` — 8 passed, including validation, configured chat request, static routes, and `/api/health`. |
| Python compile check | PASS | `python3 -m py_compile app.py`. |
| Render configuration | READY FOR DEPLOYMENT | Render hosts the public application; server binds to `0.0.0.0` and reads platform `PORT`. Google, not Render, serves Gemma inference. Deployment itself remains unverified. |
| Best Use of Gemma category evidence | MODEL INTEGRATION CONFIGURED | Gemma 4 `gemma-4-26b-a4b-it` is the configured model behind tutoring responses; verify a live response before final entry. |
| Best Use of Render category evidence | NOT CLAIMED | Render hosts this public web app. The category description specifies Render as an AI runtime, agent front-end host, or host for Hermes/OpenClaw; ordinary hosting here is not represented as satisfying that criterion. |
| Provider-backed browser conversation | PENDING | Configure credentials/model and make a real chat request after deployment. |
| Security review | PASS (source review) | See `docs/SECURITY_REVIEW.md`; no secret or live deployment audit has been performed. |

## Official sources checked October 3, 2026

- [Challenge page](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)
- [Contest rules](https://dev.to/page/hacktoberfest-weekend-challenge-26-10-01-contest-rules)
- [HF26 hub](https://dev.to/challenges/hf26/)

The contest rules list an entry period of October 2, 2026 02:00 UTC through October 5, 2026 06:59 UTC and require a new project with open-source AI at its core, a real friend/loved-one problem, why open-source AI matters, a demo, code link, and DEV post using the provided template and `#hf26challenge`. Judging lists writing quality (weighted most heavily), relevance, creativity, technical execution, and partner technology for partner category entries. The hub currently lists the Weekend Challenge as live while the detail page has displayed “Live Ended”; confirm the submission interface before entry.

## Final disposition

Do not claim a complete eligible entry until friend evidence, open-weight provider setup, demo, code URL, and current submission availability are confirmed. Do not create or push a repository before final audit. DEV submission remains manual.
