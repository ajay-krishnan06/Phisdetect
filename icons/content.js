chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getPageInfo") {
    const hasPasswordField = !!document.querySelector('input[type="password"]');
    sendResponse({ has_password_field: hasPasswordField });
  }
});

