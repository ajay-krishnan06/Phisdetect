# 🛡️ PhisDetect

PhisDetect is a lightweight **Chrome extension** that helps users detect and avoid phishing websites.  
It uses a **hybrid detection method** that combines:
- ✅ Rule-based checks (blacklist, SSL status, domain similarity)
- 🧠 A machine learning model trained to spot phishing patterns

The goal: keep users safe online, without slowing down browsing.

---

## 🌟 Features

- Detects suspicious websites in real time
- Highlights known phishing domains from a blacklist
- Checks if the domain closely resembles popular brands (Google, Amazon, etc.)
- Verifies if the website uses HTTPS / SSL
- Calculates URL entropy & other features to spot suspicious patterns
- Shows clear **alerts** and **badges** if a site is suspicious
- Allows whitelisting of well-known trusted sites

---

## 📦 Project Structure

Phisdetect/
├── background.js # Main logic & ML prediction
├── content.js # Collects info like presence of password fields
├── popup.html # Extension popup interface
├── popup.js # Logic for popup display
├── model/
│ └── phishing_model.json # Lightweight decision tree model
├── icons/
│ ├── icon16.png
│ ├── icon48.png
│ └── icon128.png
└── manifest.json # Chrome extension manifest file


---

## ⚙️ How It Works

1. When you visit a website, PhisDetect automatically:
   - Checks the domain against a blacklist
   - Compares it with popular brand domains using Levenshtein distance
   - Checks for SSL (https)
   - Collects features: URL length, number of dots, entropy, presence of password fields, suspicious words, etc.
2. These features go into a **decision tree model** stored in `model/phishing_model.json`
3. The extension shows:
   - ✅ “Safe” badge if everything looks okay
   - ⚠️ Warning badge & notification if the site looks suspicious
4. Results are saved locally so you can see them in the popup

---

## 🔧 Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** → Select the `Phisdetect` folder
5. Done! The extension will now scan sites as you browse

---

## 🧠 Machine Learning Model

- Built as a small decision tree in Python
- Trained on features like:
  - URL length
  - Number of dots
  - Entropy of the URL
  - Presence of suspicious words
  - Whether the page has password fields
- Stored as JSON so it runs directly in JavaScript

> ⚠️ Note: For real-world use, you should train the model on a **larger, real phishing dataset** and keep it updated.

---

## ✅ Whitelist

To reduce false positives, PhisDetect includes a whitelist of trusted domains, like:
- google.com
- amazon.in
- github.com
- paypal.com

These domains are always marked as **safe**.

---

## 📜 License

This project is created for **educational purposes**.  
Feel free to modify, use, and improve it!

---

## ✨ Author

Made by:
- Ajay Krishnan [@ajay-krishnan06](https://github.com/ajay-krishnan06)

---

> ⚠️ Disclaimer: This is a **demo / educational project**. It should not be used as a fully production-ready security tool without further improvements and testing.
![safesite](https://github.com/user-attachments/assets/6d8bf295-fb0a-4cc2-902f-97c21756248b)
![suspicioussite](https://github.com/user-attachments/assets/23bf1812-654f-4934-91a2-59f1d1dbeffa)

