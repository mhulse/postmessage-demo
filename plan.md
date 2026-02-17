# postMessage iframe Demo — Implementation Plan

## Goal

Create a generic vanilla HTML/JS demo in a GitHub repo with GitHub Pages that demonstrates the postMessage technique for live parent-to-iframe communication. This is meant to show another team how a parent page can send configuration updates to an embedded iframe without reloading it.

The demo should be completely generic — no product-specific naming or references. It demonstrates the *pattern*, not a specific feature.

---

## Repo structure

```
postmessage-demo/
├── index.html      ← Parent page with config controls + embedded iframe
├── preview.html    ← Iframe page that receives and renders config
└── README.md       ← Explanation of the technique
```

---

## File specifications

### `index.html` — Parent page

A single HTML file (no build step, no dependencies) that acts as the "config" side.

**Layout**: Split screen — left side has controls, right side has the iframe.

**Controls:**
- Text input for "Label" with an "Add Item" button
- List of added items, each with a remove button
- Items should be split into two groups: "Primary" and "Secondary" (use a radio toggle or dropdown when adding)
- Every time the list changes, immediately send a `postMessage` to the iframe

**Iframe:**
- `<iframe src="preview.html">` — static src, never changes
- Styled to look like a preview panel (border, fixed height ~400px)

**Message format sent via postMessage:**
```json
{
  "type": "CONFIG_UPDATE",
  "payload": {
    "primary": [
      { "id": 1, "label": "Item One" }
    ],
    "secondary": [
      { "id": 2, "label": "Item Two" }
    ]
  }
}
```

**Visible payload display:**
- Below the controls, show a `<pre>` block with the JSON payload being sent on each update
- This makes the data flow transparent to someone viewing the demo

**Comments in code:**
- Add a comment where `postMessage(data, '*')` is called noting: `// In production, replace '*' with the specific target origin`

### `preview.html` — Iframe page

A standalone HTML page that listens for messages and renders them.

**Behavior:**
- On load, shows "Waiting for configuration..." message
- Listens for `message` events with `type === 'CONFIG_UPDATE'`
- Renders received items as styled cards/buttons in two sections: "Primary" and "Secondary"
- Shows a "Messages received: N" counter
- Shows the raw JSON payload in a `<pre>` block

**Comments in code:**
- Add a comment in the message listener noting: `// In production, validate event.origin here`

**Styling:** Clean, minimal — use system fonts, light background, simple card styles. Should look presentable but clearly a demo.

### `README.md`

Short and focused:

```markdown
# postMessage Iframe Demo

Live demo: https://<username>.github.io/postmessage-demo/

## What this demonstrates

A parent page communicating with an embedded iframe using the browser's
`postMessage` API. The parent sends configuration updates and the iframe
renders them in real-time — without reloading.

## Why postMessage instead of URL params?

Changing an iframe's `src` (even just query params) causes the iframe to
fully reload, destroying any internal state and causing visible flicker.
`postMessage` delivers data directly to the iframe's JavaScript context,
so it updates instantly with no reload.

## How it works

1. `index.html` embeds `preview.html` in an iframe
2. When the user adds/removes items, `index.html` calls
   `iframe.contentWindow.postMessage(data, '*')`
3. `preview.html` listens via `window.addEventListener('message', ...)`
   and re-renders

## Production considerations

- **Origin validation**: The sender should specify the target origin
  instead of `'*'`. The receiver should check `event.origin`.
- **Message schema**: Define a versioned message type so both sides
  can evolve independently.
```

---

## Steps to implement

1. Create a new directory called `postmessage-demo`
2. Create all three files as specified above
3. Initialize a git repo: `git init && git add -A && git commit -m "initial demo"`
4. Create a GitHub repo on your personal account
5. Push: `git remote add origin <url> && git push -u origin main`
6. Enable GitHub Pages: repo Settings → Pages → Source: "Deploy from a branch" → Branch: main → Save
7. Share the Pages URL with the team

---

## Design notes

- Keep the code dead simple — no frameworks, no CSS libraries, no bundlers
- Use inline `<style>` blocks in each HTML file (self-contained)
- Target < 100 lines per file
- The demo should be understandable by reading the source in under 2 minutes
