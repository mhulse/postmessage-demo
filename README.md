# postMessage Iframe Demo

Live demo: https://mhulse.github.io/postmessage-demo/

## What this demonstrates

A parent page communicating with an embedded iframe using the browser's `postMessage` API. The parent sends configuration updates and the iframe renders them in real-time — without reloading.

## Why postMessage instead of URL params?

Changing an iframe's `src` (even just query params) causes the iframe to fully reload, destroying any internal state and causing visible flicker. `postMessage` delivers data directly to the iframe's JavaScript context, so it updates instantly with no reload.

## How it works

1. `index.html` embeds `preview.html` in an iframe
2. When the user adds/removes items, `index.html` calls `iframe.contentWindow.postMessage(data, '*')`
3. `preview.html` listens via `window.addEventListener('message', ...)` and re-renders

## Production considerations

- **Origin validation**: The sender should specify the target origin instead of `'*'`. The receiver should check `event.origin`.
- **Message schema**: Define a versioned message type so both sides can evolve independently.
