# `postMessage` iframe demo

Live demo: https://mhulse.github.io/postmessage-demo/

## What this demonstrates

A parent page communicating with an embedded iframe using the browser’s `postMessage` API. The parent sends configuration updates and the iframe renders them instantly without reloading.

## Why `postMessage` instead of URL params?

Changing an iframe’s `src` (even just query params) causes the iframe to fully reload, destroying any internal state and causing visible flicker. `postMessage` delivers data directly to the iframe’s JavaScript context, so it updates instantly with no reload.

## How it works

1. `index.html` embeds `preview.html` in an iframe
2. When the user adds/removes items, `index.html` calls `iframe.contentWindow.postMessage(data, '*')`
3. `preview.html` listens via `window.addEventListener('message', ...)` and re-renders

## Message format

The message sent via `postMessage`:

```json
{
  "type": "PREVIEW",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJpYXQiOjE2MDk0NjAwMDAsIml0ZW1zIjpbLi4uXX0.demo-signature"
}
```

The JWT payload (decoded) contains:

```json
{
  "sub": "demo-user",
  "iat": 1609460000,
  "items": [
    { "id": 1, "label": "Item One" },
    { "id": 2, "label": "Item Two" }
  ]
}
```

- `type`: Message type identifier
- `jwt`: JSON Web Token containing the data payload
  - `sub`: Subject (user identifier)
  - `iat`: Issued at (timestamp)
  - `items`: Array of items to display (your custom data)

### Why use a type field?

The `type` field identifies the message purpose, which is essential when:
- **Multiple message types** exist (e.g., `PREVIEW`, `CONFIG_UPDATE`, `STATUS_CHECK`)
- **Different handlers** process different message types
- **Validation** ensures only expected message types are processed

Example with multiple types:
```javascript
if (data.type === 'PREVIEW') {
  // Handle preview data
} else if (data.type === 'CONFIG_UPDATE') {
  // Handle config changes
}
```

### Why encode data in the JWT?

**Security benefits:**
1. **Tamper-proof**: The JWT signature ensures data hasn't been modified in transit
2. **Self-contained**: All necessary data travels in one secure package
3. **Verification**: The receiver can verify the token's authenticity (signature check)

**How it works:**
1. Sender encodes data into JWT payload using base64url encoding
2. JWT is sent via `postMessage` with origin validation
3. Receiver validates the origin and decodes the JWT to extract data

**Note**: This demo uses a fake signature for illustration. In production, use a proper JWT library and verify signatures server-side or with a shared secret.

## Browser support

`postMessage` is supported on all modern browsers:

- ✅ **Last 2 versions of Chrome, Firefox, Safari, Edge**
- ✅ iOS Safari
- ✅ Chrome Mobile
- ✅ IE 8+

See [caniuse: postMessage](https://caniuse.com/mdn-api_window_postmessage) for detailed compatibility info.
