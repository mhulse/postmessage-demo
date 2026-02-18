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

### Message Format

Messages use versioning to allow independent evolution of both sides:

```json
{
  "version": 1,
  "items": [
    { "id": 1, "label": "Item One" },
    { "id": 2, "label": "Item Two" }
  ]
}
```

**Version 1** includes: `version`, `items`

In the future, Version 2 could add new fields (e.g., `metadata`) without breaking existing receivers that check the version number.

## Browser Support

`postMessage` is supported on all modern browsers:

- ✅ **Last 2 versions of Chrome, Firefox, Safari, Edge**
- ✅ iOS Safari
- ✅ Chrome Mobile
- ✅ IE 8+

See [caniuse: postMessage](https://caniuse.com/mdn-api_window_postmessage) for detailed compatibility info.

## Production considerations

- **Origin validation**: The sender should specify the target origin instead of `'*'`. The receiver should check `event.origin`.
- **Message versioning**: Already demonstrated in the code. Define versions so both sides can evolve independently.
