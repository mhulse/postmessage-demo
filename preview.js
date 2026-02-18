// dom
const waitingEl = document.getElementById('waiting');
const contentEl = document.getElementById('content');
const messageCountEl = document.getElementById('message-count');
const itemsListEl = document.getElementById('items-list');
const encodedEl = document.getElementById('encoded-display');
const payloadEl = document.getElementById('payload-display');

// state
let messageCount = 0;

// jwt helpers
function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

function decodeJwt(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(base64urlDecode(parts[1]));
    return payload;
  } catch (e) {
    return null;
  }
}

// receive message from parent
window.addEventListener('message', (event) => {
  // SECURITY: validate the message origin to match the parent's domain
  if (event.origin !== 'https://mhulse.github.io') return;

  const data = event.data;
  
  if (data && data.type === 'PREVIEW' && data.jwt) {
    const payload = decodeJwt(data.jwt);
    if (payload && Array.isArray(payload.items)) {
      handleMessage({ ...data, payload });
    }
  }
});

// handle incoming message
function handleMessage(data) {
  messageCount++;
  messageCountEl.textContent = messageCount;

  // show content, hide waiting state
  waitingEl.style.display = 'none';
  contentEl.style.display = 'block';

  render(data);
}

// render
function render(data) {
  renderItems(data.payload.items);
  renderPayload(data);
}

function renderItems(items) {
  itemsListEl.innerHTML = '';

  if (items.length === 0) {
    itemsListEl.innerHTML = '<div class="empty">No items</div>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.textContent = item.label;
    itemsListEl.appendChild(card);
  });
}

function renderPayload(data) {
  encodedEl.textContent = JSON.stringify({ type: data.type, jwt: data.jwt }, null, 2);
  payloadEl.textContent = JSON.stringify(data.payload, null, 2);
}
