const statusEl = document.getElementById("status");

const DUTCH_PATTERNS = [
  { dutch: "benl.", french: "befr.", label: "benl. → befr. (subdomain)" },
  { dutch: "be-nl", french: "be-fr", label: "be-nl → be-fr" },
  { dutch: "nl-be", french: "fr-be", label: "nl-be → fr-be" },
  { dutch: "nl_be", french: "fr_be", label: "nl_be → fr_be" },
  { dutch: "/nl/", french: "/fr/", label: "/nl/ → /fr/" },
  { dutch: "/ned/", french: "/fr/", label: "/ned/ → /fr/" },
  { dutch: "lang=nl", french: "lang=fr", label: "lang=nl → lang=fr" },
  { dutch: "language=nl", french: "language=fr", label: "language=nl → language=fr" },
  { dutch: "locale=nl", french: "locale=fr", label: "locale=nl → locale=fr" },
  { dutch: "lng=nl", french: "lng=fr", label: "lng=nl → lng=fr" },
  { dutch: "hl=nl", french: "hl=fr", label: "hl=nl → hl=fr" },
];

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (!tab || !tab.url) {
    statusEl.textContent = "Cannot access this page.";
    return;
  }

  const lower = tab.url.toLowerCase();

  // Check if already on a French URL
  const frenchPatterns = ["befr.", "be-fr", "fr-be", "fr_be", "/fr/", "lang=fr", "language=fr", "locale=fr", "lng=fr", "hl=fr"];
  const onFrench = frenchPatterns.find(p => lower.includes(p));
  if (onFrench) {
    statusEl.className = "status match";
    statusEl.textContent = `Already on a French URL (contains "${onFrench}").`;
    return;
  }

  // Check for Dutch patterns
  const matched = DUTCH_PATTERNS.find(p => lower.includes(p.dutch));
  if (matched) {
    statusEl.className = "status match";
    statusEl.textContent = `Dutch URL detected (${matched.label}) — switching to French if available.`;
  } else {
    statusEl.className = "status no-match";
    statusEl.textContent = "No Dutch/French locale detected in this URL.";
  }
});
