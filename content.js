chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getPageInfo") {
    const hasPwd = document.querySelectorAll("input[type='password']").length > 0;
    sendResponse({ has_password_field: hasPwd ? 1 : 0 });
  }
});
