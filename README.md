# postMessage Iframe Demo

Live demo: https://mhulse.github.io/postmessage-demo/

## What this demonstrates

A parent page communicating with an embedded iframe using the browser’s `postMessage` API. The parent sends configuration updates and the iframe renders them instantly without reloading.

## Why postMessage instead of URL params?

Changing an iframe’s `src` (even just query params) causes the iframe to fully reload, destroying any internal state and causing visible flicker. `postMessage` delivers data directly to the iframe’s JavaScript context, so it updates instantly with no reload.

## How it works

1. `index.html` embeds `preview.html` in an iframe
2. When the user adds/removes items, `index.html` calls `iframe.contentWindow.postMessage(data, '*')`
3. `preview.html` listens via `window.addEventListener('message', ...)` and re-renders

### Message Format

Messages are simple and flat:

```json
{
  "items": [
    { "id": 1, "label": "Item One" },
    { "id": 2, "label": "Item Two" }
  ]
}
```

If you need to evolve the format later (add fields, change structure), add a `version` field like an API (`/api/v1`, `/api/v2`) to handle multiple formats gracefully.

## Browser Support

`postMessage` is supported on all modern browsers:

- ✅ **Last 2 versions of Chrome, Firefox, Safari, Edge**
- ✅ iOS Safari
- ✅ Chrome Mobile
- ✅ IE 8+

See [caniuse: postMessage](https://caniuse.com/mdn-api_window_postmessage) for detailed compatibility info.
