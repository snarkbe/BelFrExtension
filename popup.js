const statusEl = document.getElementById("status");

function hasDutchLocale(url) {
  const lower = url.toLowerCase();
  return lower.includes("be-nl") || lower.includes("nl-be");
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (!tab || !tab.url) {
    statusEl.textContent = "Cannot access this page.";
    return;
  }

  if (hasDutchLocale(tab.url)) {
    statusEl.className = "status match";
    statusEl.textContent = "Dutch Belgian URL detected — switching to French if available.";
  } else if (tab.url.toLowerCase().includes("be-fr") || tab.url.toLowerCase().includes("fr-be")) {
    statusEl.className = "status match";
    statusEl.textContent = "Already on a French Belgian URL.";
  } else {
    statusEl.className = "status no-match";
    statusEl.textContent = "No Belgian locale detected in this URL.";
  }
});
