## DEV submission

Uses the official [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01) requirements. Complete every bracketed field with accurate details and recheck the live challenge page before publishing.

## What I Built

PhraseBridge is a language practice partner I built for my friend, who enjoys learning new languages. It gives her a way to practise languages through AI conversation and request corrections when she wants them. I have not included feedback or claims that she has used the deployed version.

## Demo

[https://phrasebridge-hf26.onrender.com/]

## Code

[https://github.com/Devansh1093/phrasebridge-hf26]

## How I Built It

PhraseBridge is a small Python web server with a browser chat interface. Render is configured to host the public application. It sends validated chat turns to OpenRouter's OpenAI-compatible chat completions endpoint with model `google/gemma-4-26b-a4b-it`; inference is accessed through OpenRouter. The server does not store chat history, but OpenRouter processes submitted text. Render hosts the web application and does not provide AI inference. No live Render deployment has been verified yet.

## Why Does Open Innovation Matter?
PhraseBridge was inspired by my friend, who genuinely enjoys learning new languages and discovering different cultures. I wanted to give him a more natural and engaging way to practise conversations while learning. By using open-source AI, PhraseBridge can help others in learning new languages with just a text conversation.


## Prize Categories

**Prize Categories:** Best Use of Gemma. Gemma 4 (`google/gemma-4-26b-a4b-it`) generates the app's tutoring replies through OpenRouter's OpenAI-compatible chat completions endpoint. PhraseBridge does not claim Best Use of Render: ordinary hosting of this app does not meet the category's stated AI runtime, agent front-end, Hermes, or OpenClaw criteria.

## Tags

`devchallenge` `weekendchallenge` `hf26challenge`

---

