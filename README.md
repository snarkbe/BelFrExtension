# BelFr

A browser extension (Chrome & Edge) that automatically redirects Belgian Dutch pages to their French equivalent.

## What it does

When you navigate to a page whose URL contains a Dutch-Belgian locale segment, BelFr builds the French alternative and **verifies it exists** before redirecting.

| Detected in URL | Replaced with |
|-----------------|---------------|
| `be-nl`         | `be-fr`       |
| `nl-be`         | `fr-be`       |
| `/nl/`          | `/fr/`        |

Matching is case-insensitive. A blue **FR** badge appears on the extension icon when a switch occurs.

## Installation

1. Open `edge://extensions/` (Edge) or `chrome://extensions/` (Chrome)
2. Enable **Developer mode**
3. Click **Load unpacked** and select this folder
4. Pin the extension for quick access to the popup

## How it works

- Runs as a Manifest V3 background service worker — no content scripts injected
- Sends a HEAD request (falls back to GET) to verify the French URL exists before redirecting
- 5-second timeout on existence checks to avoid hanging

## Testing

### With a real site

Visit any Belgian website that uses `be-nl`, `nl-be`, or `/nl/` locale segments (e.g. IKEA, Proximus, Colruyt). The extension redirects automatically if a French version exists.

### With a local test server

```js
// test-server.js
const http = require("http");
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Page: " + req.url);
}).listen(8080, () => console.log("http://localhost:8080"));
```

```sh
node test-server.js
```

Navigate to `http://localhost:8080/be-nl/test` — it should redirect to `http://localhost:8080/be-fr/test`.

### Debugging

Go to `edge://extensions/`, find BelFr, and click the **service worker** link to open DevTools for the background script.
