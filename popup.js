const statusEl = document.getElementById("status");

const DUTCH_PATTERNS = [
  { dutch: "be-nl", french: "be-fr", label: "be-nl → be-fr" },
  { dutch: "nl-be", french: "fr-be", label: "nl-be → fr-be" },
  { dutch: "/nl/", french: "/fr/", label: "/nl/ → /fr/" },
];

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (!tab || !tab.url) {
    statusEl.textContent = "Cannot access this page.";
    return;
  }

  const lower = tab.url.toLowerCase();

  // Check if already on a French URL
  const frenchPatterns = ["be-fr", "fr-be", "/fr/"];
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
