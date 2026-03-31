// Mapping of Dutch-Belgian URL segments to French-Belgian equivalents
const REPLACEMENTS = [
  { from: "be-nl", to: "be-fr" },
  { from: "nl-be", to: "fr-be" },
  { from: "/nl/", to: "/fr/" },
  { from: "BE-NL", to: "BE-FR" },
  { from: "NL-BE", to: "FR-BE" },
  { from: "/NL/", to: "/FR/" },
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
  // Also handle mixed case via case-insensitive check
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("be-nl")) {
    return url.replace(/be-nl/gi, "be-fr");
  }
  if (lowerUrl.includes("nl-be")) {
    return url.replace(/nl-be/gi, "fr-be");
  }
  if (lowerUrl.includes("/nl/")) {
    return url.replace(/\/nl\//gi, "/fr/");
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
