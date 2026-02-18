// dom
const itemInput = document.getElementById('item-label');
const addBtn = document.getElementById('add-btn');
const itemsContainer = document.getElementById('items-container');
const payloadDisplay = document.getElementById('payload-display');
const encodedDisplay = document.getElementById('encoded-display');
const previewFrame = document.getElementById('preview-frame');

// state
let nextId = 1;
const state = { items: [] };

// jwt helpers
function base64urlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function createJwt(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signature = 'demo-signature';
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// actions
function addItem() {
  const label = itemInput.value.trim();
  if (!label) return;
  
  state.items.push({ id: nextId++, label });
  itemInput.value = '';
  itemInput.focus();
  render();
}

function deleteItem(id) {
  state.items = state.items.filter(item => item.id !== id);
  render();
}

// render
function render() {
  renderUI();
  sendMessage();
}

function renderUI() {
  const itemGroup = itemsContainer.querySelector('.items__group');
  itemGroup.innerHTML = '<h3 class="items__group-title">Items</h3>';

  state.items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <span class="item__label">${item.label}</span>
      <button class="item__button">Remove</button>
    `;
    div.querySelector('button').addEventListener('click', () => deleteItem(item.id));
    itemGroup.appendChild(div);
  });

  const payload = { sub: 'demo-user', iat: 1609460000, items: state.items };
  const jwt = createJwt(payload);
  
  payloadDisplay.textContent = JSON.stringify(payload, null, 2);
  encodedDisplay.textContent = JSON.stringify({ type: 'PREVIEW', jwt }, null, 2);
}

function sendMessage() {
  // SECURITY: specify the target origin to match the iframe's domain
  const targetOrigin = 'https://mhulse.github.io';
  
  const jwt = createJwt({ sub: 'demo-user', iat: 1609460000, items: state.items });
  previewFrame.contentWindow.postMessage({ type: 'PREVIEW', jwt }, targetOrigin);
}

// events
addBtn.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addItem();
});

// initial display
render();
