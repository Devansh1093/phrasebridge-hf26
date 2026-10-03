const $ = (selector) => document.querySelector(selector);
const state = { history: [], correction: false, busy: false };
const language = $('#language');
const scenario = $('#scenario');
const chat = $('#chat');
const message = $('#message');

function selectedScenario() {
  return scenario.value === 'custom' ? ($('#custom-scenario').value.trim() || 'a friendly everyday conversation') : scenario.value;
}

function syncHeading() {
  const labels = { 'meeting a friend at a café': 'At a café', 'introducing yourself to someone new': 'Meeting someone new', 'asking for directions while exploring a city': 'Finding your way', 'a relaxed chat about hobbies and your week': 'Everyday conversation', 'ordering food at a restaurant': 'At a restaurant' };
  const title = labels[scenario.value] || (scenario.value === 'custom' ? ($('#custom-scenario').value.trim() || 'Your situation') : 'Your situation');
  $('#conversation-title').innerHTML = `${escapeHtml(title)} <span>·</span> ${escapeHtml(language.value)}`;
  message.placeholder = `Write a reply in ${language.value}…`;
  const greetings = { Spanish: 'Hola', French: 'Bonjour', Italian: 'Ciao', German: 'Hallo', Portuguese: 'Olá', Japanese: 'こんにちは', Korean: '안녕하세요', English: 'Hello' };
  const welcome = $('.welcome-card');
  if (welcome) {
    welcome.querySelector('h3').textContent = `${greetings[language.value] || 'Hello'}, friend.`;
    welcome.querySelector('p').textContent = `I’m here for ${title.toLowerCase()}. Try a greeting in ${language.value}, or tell me how your day is going.`;
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function recentContext() {
  let characters = 0;
  const recent = [];
  for (const turn of state.history.slice(-20).reverse()) {
    const content = turn.content.slice(-2_000);
    if (characters + content.length > 4_000) break;
    recent.unshift({ role: turn.role, content });
    characters += content.length;
  }
  return recent;
}

function addBubble(role, text, label = '') {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  wrapper.append(bubble);
  if (label) {
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    meta.textContent = label;
    wrapper.append(meta);
  }
  chat.append(wrapper);
  chat.scrollTop = chat.scrollHeight;
  return wrapper;
}

async function refreshHealth() {
  try {
    const response = await fetch('/api/health');
    const info = await response.json();
    $('#model-label').textContent = info.ok ? 'Ready to chat' : 'Service unavailable';
  } catch {
    $('#model-label').textContent = 'Service status unknown';
  }
}

scenario.addEventListener('change', () => {
  $('#custom-scenario').classList.toggle('hidden', scenario.value !== 'custom');
  syncHeading();
});
language.addEventListener('change', syncHeading);
$('#custom-scenario').addEventListener('input', syncHeading);
$('#correction-toggle').addEventListener('click', (event) => {
  state.correction = !state.correction;
  event.currentTarget.setAttribute('aria-pressed', String(state.correction));
  event.currentTarget.textContent = state.correction ? '✓ Correction requested' : '✦ Ask for a correction';
});
$('#new-session').addEventListener('click', () => {
  state.history = [];
  state.correction = false;
  $('#correction-toggle').setAttribute('aria-pressed', 'false');
  $('#correction-toggle').textContent = '✦ Ask for a correction';
  chat.innerHTML = '<div class="welcome-card"><div class="welcome-spark">✳</div><h3>Hola, friend.</h3><p>We’re ready for a fresh start. Say hello, or tell me how your day is going.</p><span class="welcome-caption">YOUR PARTNER IS WAITING</span></div>';
  syncHeading();
  $('#error').classList.add('hidden');
  message.focus();
});

$('#composer').addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = message.value.trim();
  if (!text || state.busy) return;
  $('#error').classList.add('hidden');
  const userTurn = addBubble('user', text);
  message.value = '';
  state.busy = true;
  $('#send').disabled = true;
  const typing = addBubble('assistant typing', 'Thinking of a reply…');
  try {
    const response = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: language.value, scenario: selectedScenario(), style: $('#style').value, ask_correction: state.correction, history: recentContext(), message: text }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'The practice partner could not reply.');
    typing.remove();
    addBubble('assistant', result.reply, 'PHRASEBRIDGE · OPEN MODEL');
    state.history.push({ role: 'user', content: text }, { role: 'assistant', content: result.reply });
    state.history = state.history.slice(-20);
    state.correction = false;
    $('#correction-toggle').setAttribute('aria-pressed', 'false');
    $('#correction-toggle').textContent = '✦ Ask for a correction';
  } catch (error) {
    typing.remove();
    $('#error').textContent = `${error.message} Your message is still here in the conversation; you can send it again.`;
    $('#error').classList.remove('hidden');
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    meta.textContent = 'NOT SENT · RETRY BELOW';
    userTurn.append(meta);
    message.value = text;
  } finally {
    state.busy = false;
    $('#send').disabled = false;
    message.focus();
  }
});

message.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    $('#composer').requestSubmit();
  }
});

syncHeading();
refreshHealth();
