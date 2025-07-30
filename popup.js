chrome.storage.local.get("last_result", ({ last_result }) => {
  if (last_result) {
    document.getElementById('blacklisted').textContent = last_result.blacklisted
      ? "🚨 Site is blacklisted!"
      : "✅ Not blacklisted";

    document.getElementById('similar').textContent = last_result.similar
      ? "⚠️ Domain similar to known brand"
      : "✅ Domain looks fine";

    document.getElementById('ssl').textContent = last_result.ssl
      ? "✅ Site uses SSL (https)"
      : "⚠️ Site does not use SSL";

    document.getElementById('ml_phish').textContent = last_result.ml_phish
      ? "⚠️ ML model flagged as suspicious"
      : "✅ ML model says site is safe";
  } else {
    document.body.textContent = "No scan data available yet.";
  }
});
