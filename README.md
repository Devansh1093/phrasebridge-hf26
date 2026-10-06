# PhraseBridge

PhraseBridge is a AI language practice chat built for my friend, who enjoys learning new languages. Choose a language and an everyday situation, practise a reply, and ask for a gentle, balanced, or detailed correction whenever you want one. The AI keeps the role-play moving with a follow-up question.

Chat history stays only in the current browser session and is cleared when the page is reset or reloaded.

## Live Demo

**https://phrasebridge-hf26.onrender.com/**


## How It Works

```text
User
  ↓
PhraseBridge browser interface
  ↓
Python web server
  ↓
OpenRouter API
  ↓
Gemma 4 (`google/gemma-4-26b-a4b-it`)
  ↓
AI language-practice response
  ↓
Browser
