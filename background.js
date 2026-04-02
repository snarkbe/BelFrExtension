// Mapping of Dutch-Belgian URL segments to French-Belgian equivalents
const REPLACEMENTS = [
  // Fused subdomain prefix (e.g. benl.ebay.be → befr.ebay.be)
  { from: "benl.", to: "befr." },
  { from: "BENL.", to: "BEFR." },
  // Locale codes with hyphen (e.g. Accept-Language style)
  { from: "be-nl", to: "be-fr" },
  { from: "nl-be", to: "fr-be" },
  { from: "BE-NL", to: "BE-FR" },
  { from: "NL-BE", to: "FR-BE" },
  // Locale codes with underscore (e.g. Magento, Drupal, WooCommerce)
  { from: "nl_BE", to: "fr_BE" },
  { from: "nl_be", to: "fr_be" },
  { from: "NL_BE", to: "FR_BE" },
  // Path segments
  { from: "/nl/", to: "/fr/" },
  { from: "/NL/", to: "/FR/" },
  { from: "/ned/", to: "/fr/" },
  { from: "/NED/", to: "/FR/" },
  // Query parameters: ?lang=nl, ?language=nl, ?locale=nl, ?lng=nl, ?hl=nl
  { from: "lang=nl", to: "lang=fr" },
  { from: "language=nl", to: "language=fr" },
  { from: "locale=nl", to: "locale=fr" },
  { from: "lng=nl", to: "lng=fr" },
  { from: "hl=nl", to: "hl=fr" },
];

/**
 * Check if a URL contains a Belgian Dutch locale segment
 * and return the French-Belgian alternative URL.
 * Returns null if no match is found.
 */
function getFrenchUrl(url) {
  for (const { from, to } of REPLACEMENTS) {
    if (url.includes(from)) {
      return url.replace(from, to);
    }
  }
  // Subdomain: nl.example.be → fr.example.be, benl.example.be → befr.example.be
  try {
    const parsed = new URL(url);
    if (parsed.hostname.startsWith("nl.") && parsed.hostname.endsWith(".be")) {
      return url.replace(parsed.hostname, parsed.hostname.replace(/^nl\./, "fr."));
    }
  } catch {
    // not a valid URL, skip
  }
  return null;
}

/**
 * Check if a URL exists by making a HEAD request.
 * Returns true if the server responds with a success status (2xx or 3xx).
 */
async function urlExists(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    // If HEAD fails (some servers block it), try GET
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Listen for tab updates (page navigation)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only act when the page finishes loading
  if (changeInfo.status !== "complete" || !tab.url) return;

  const frenchUrl = getFrenchUrl(tab.url);
  if (!frenchUrl || frenchUrl === tab.url) return;

  // Check if the French URL exists before redirecting
  const exists = await urlExists(frenchUrl);
  if (exists) {
    chrome.tabs.update(tabId, { url: frenchUrl });
    // Update badge to indicate a switch happened
    chrome.action.setBadgeText({ text: "FR", tabId });
    chrome.action.setBadgeBackgroundColor({ color: "#0055A4", tabId });
  }
});
