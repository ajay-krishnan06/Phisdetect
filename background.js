let phishingModel = null;

// Load model JSON at startup
fetch(chrome.runtime.getURL("model/phishing_model.json"))
  .then(response => response.json())
  .then(model => {
    phishingModel = model;
    console.log("✅ Model loaded:", phishingModel);
  });

// Whitelist of popular trusted sites and search engines
const whitelist = [
  "google.com", "youtube.com", "amazon.in", "amazon.com", "amazon-adsystem.com",
  "facebook.com", "twitter.com", "microsoft.com", "apple.com", "linkedin.com",
  "instagram.com", "wikipedia.org", "yahoo.com", "bing.com", "duckduckgo.com",
  "reddit.com", "whatsapp.com", "netflix.com", "adobe.com", "paypal.com",
  "flipkart.com", "snapdeal.com", "hotmail.com", "outlook.com", "live.com",
  "github.com", "stackoverflow.com", "webstore.com", "search.yahoo.com",
  "newtab"
];

// Recursive predict function
function predict(node, features) {
  if ('value' in node) return node.value;
  if (features[node.feature] <= node.threshold)
    return predict(node.left, features);
  else
    return predict(node.right, features);
}

// Utility functions
function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1))
        matrix[i][j] = matrix[i - 1][j - 1];
      else
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
    }
  }
  return matrix[b.length][a.length];
}

function calcEntropy(str) {
  const set = new Set(str);
  return set.size > 0 ? (Math.log2(set.size) * str.length) / str.length : 0;
}

// Main detection logic
chrome.webNavigation.onCompleted.addListener(async (details) => {
  const urlObj = new URL(details.url);
  const domain = urlObj.hostname.replace(/^www\./, "");
  console.log("🌐 URL:", details.url);

  // Prepare features
  const features = {
    url_length: details.url.length,
    dots: (details.url.match(/\./g) || []).length,
    entropy: calcEntropy(details.url),
    has_password_field: 0,
    suspicious_words: 0
  };
  console.log("🔍 Features before ML:", features);

  // Whitelist logic
  if (whitelist.includes(domain)) {
    chrome.action.setBadgeText({ text: "✔", tabId: details.tabId });
    chrome.action.setBadgeBackgroundColor({ color: "green", tabId: details.tabId });

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "PhisDetect",
      message: "✅ This site is verified and secure"
    });

    console.log("✅ Whitelisted site detected, badge and secure notification shown");
    return;
  }

  // Ask content script if page has password field
  chrome.tabs.sendMessage(details.tabId, { action: "getPageInfo" }, response => {
    if (response && response.has_password_field)
      features.has_password_field = response.has_password_field ? 1 : 0;

    let mlResult = false;
    if (phishingModel) {
      mlResult = predict(phishingModel, features) === 1;
      console.log("🧠 ML prediction:", mlResult);
    } else {
      console.warn("⚠️ Model not loaded yet");
    }

    if (mlResult) {
      chrome.action.setBadgeText({ text: "⚠", tabId: details.tabId });
      chrome.action.setBadgeBackgroundColor({ color: "red", tabId: details.tabId });

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "PhisDetect Warning",
        message: "⚠ Be careful! This site might be risky"
      });
      console.log("⚠️ Badge & notification shown for suspicious site");
    } else {
      chrome.action.setBadgeText({ text: "✔", tabId: details.tabId });
      chrome.action.setBadgeBackgroundColor({ color: "green", tabId: details.tabId });
      console.log("✅ Cleared badge (site seems safe)");
    }

    // Save detection result
    chrome.storage.local.set({
      last_result: {
        url: details.url,
        ml_phish: mlResult,
        features
      }
    });
    console.log("✅ Detection result saved:", { url: details.url, ml_phish: mlResult, features });
  });
});
