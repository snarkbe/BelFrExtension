# BelFr — Auto-switch Belgian websites from Dutch to French

[![Chrome](https://img.shields.io/badge/Chrome-supported-brightgreen?logo=googlechrome)](https://developer.chrome.com/docs/extensions/)
[![Edge](https://img.shields.io/badge/Edge-supported-brightgreen?logo=microsoftedge)](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)

> **Automatically redirect Belgian Dutch (NL) web pages to their French (FR) equivalent.**
> Perfect for French-speaking users browsing Belgian websites that default to Dutch.

## Features

- **Automatic language switching** — detects Dutch locale segments in URLs and switches to French
- **Smart redirect** — verifies the French page exists before redirecting (no broken pages)
- **Zero configuration** — install and forget, it just works
- **Lightweight** — runs as a background service worker, no content scripts injected into pages
- **Privacy-friendly** — no data collection, no tracking, no external services

### Supported URL patterns

| Detected in URL | Replaced with | Example |
|-----------------|---------------|---------|
| `be-nl`         | `be-fr`       | `example.com/be-nl/product` → `example.com/be-fr/product` |
| `nl-be`         | `fr-be`       | `example.com/nl-be/page` → `example.com/fr-be/page` |
| `/nl/`          | `/fr/`        | `example.com/nl/home` → `example.com/fr/home` |

Matching is case-insensitive. A blue **FR** badge appears on the extension icon when a switch occurs.

## Installation

1. Open `edge://extensions/` (Edge) or `chrome://extensions/` (Chrome)
2. Enable **Developer mode**
3. Click **Load unpacked** and select this folder
4. Pin the extension for quick access to the popup

## How it works

1. Monitors page navigation via a Manifest V3 background service worker
2. Checks if the URL contains a Dutch-Belgian locale segment (`be-nl`, `nl-be`, `/nl/`)
3. Constructs the French alternative URL
4. Sends a HEAD request (falls back to GET) to verify the French URL exists — 5-second timeout
5. Redirects only if the French page returns a successful response

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

## Keywords

Belgian websites, Dutch to French redirect, language switcher, be-nl to be-fr, nl-be to fr-be, Belgium locale, browser extension, Chrome extension, Edge extension, Chromium extension, automatic translation redirect, Belgian French, Wallonia, Flanders, multilingual Belgium
