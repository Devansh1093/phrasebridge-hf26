# DEV submission draft — not published

Uses the official [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01) requirements. Complete every bracketed field with accurate details and recheck the live challenge page before publishing.

## What I Built

PhraseBridge is a language practice partner I built for my sister, who enjoys learning new languages. It gives her a way to practise languages through AI conversation and request corrections when she wants them. I have not included feedback or claims that she has used the deployed version.

## Demo

[Add a working deployed demo URL or short video.]

## Code

[Add the public code repository URL.]

## How I Built It

PhraseBridge is a small Python web server with a browser chat interface. Render is configured to host the public application. It sends validated chat turns to OpenRouter's OpenAI-compatible chat completions endpoint with model `google/gemma-4-26b-a4b-it`; inference is accessed through OpenRouter. The server does not store chat history, but OpenRouter processes submitted text. Render hosts the web application and does not provide AI inference. No live Render deployment has been verified yet.

## Why Does Open Innovation Matter?

[Describe why open model access matters to this friend's actual need. Discuss the model and deployment choices accurately, including that inference goes to the configured provider and that model advice can be wrong.]

## My Agent Session

Optional. Add a session link only if one was actually captured.

## Prize Categories

**Prize Categories:** Best Use of Gemma. Gemma 4 (`google/gemma-4-26b-a4b-it`) generates the app's tutoring replies through OpenRouter's OpenAI-compatible chat completions endpoint. PhraseBridge does not claim Best Use of Render: ordinary hosting of this app does not meet the category's stated AI runtime, agent front-end, Hermes, or OpenClaw criteria.

## Tags

`devchallenge` `weekendchallenge` `hf26challenge`

---

Not published. Working demo URL, code URL, and final open-model/provider details remain to be supplied. No feedback or deployed-version use by my sister is claimed. The official entry window is listed as October 2, 2026 02:00 UTC to October 5, 2026 06:59 UTC. Recheck the official submission interface; the challenge page and hub have shown differing status labels.
