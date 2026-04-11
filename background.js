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
  // Path ending with /nl or /NL (no trailing slash), e.g. coolblue.be/nl
  try {
    const parsed = new URL(url);
    if (/\/nl$/i.test(parsed.pathname)) {
      const newPath = parsed.pathname.replace(/\/nl$/i, "/fr");
      return url.replace(parsed.pathname, newPath);
    }
    // Subdomain: nl.example.be → fr.example.be, benl.example.be → befr.example.be
    if (parsed.hostname.startsWith("nl.") && parsed.hostname.endsWith(".be")) {
      return url.replace(parsed.hostname, parsed.hostname.replace(/^nl\./, "fr."));
    }
  } catch {
    // not a valid URL, skip
  }
  return null;
}

// Track tabs we've already redirected to avoid infinite loops
const redirectedTabs = new Set();

// Intercept navigation before the page starts loading
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  // Only handle top-level navigation (not iframes)
  if (details.frameId !== 0) return;

  // Skip if we just redirected this tab (avoid redirect loop)
  if (redirectedTabs.has(details.tabId)) {
    redirectedTabs.delete(details.tabId);
    return;
  }

  const frenchUrl = getFrenchUrl(details.url);
  if (!frenchUrl || frenchUrl === details.url) return;

  // Mark this tab as redirected, then switch to the French URL
  redirectedTabs.add(details.tabId);
  chrome.tabs.update(details.tabId, { url: frenchUrl });
  // Update badge to indicate a switch happened
  chrome.action.setBadgeText({ text: "FR", tabId: details.tabId });
  chrome.action.setBadgeBackgroundColor({ color: "#0055A4", tabId: details.tabId });
});
