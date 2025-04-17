# 🧠 nap-auth

> A lightweight behavioral authentication Web Component that uses neural interaction patterns — identify users based on how they interact, not just what they do.

---

## 📦 Installation

```bash
npm install nap-auth
```

---

## 🚀 Usage

### 1. Import the Component
```js
import 'nap-auth';
```

### 2. Add to HTML
```html
<nap-auth username="demo" mode="register"></nap-auth>
```

### 3. Listen for Events
```js
document.querySelector('nap-auth').addEventListener('auth-success', e => {
  console.log('✅ Auth Success:', e.detail);
});

document.querySelector('nap-auth').addEventListener('auth-fail', e => {
  console.log('❌ Auth Fail:', e.detail);
});

document.querySelector('nap-auth').addEventListener('auth-progress', e => {
  console.log('⏳ Training Progress:', e.detail);
});
```

---

## 🧠 Features

- ✔️ Built with **Vanilla JS** + **Web Components API**
- 🖱️ Tracks user behavior (mouse speed, hesitations, interaction rhythm)
- 🧬 Simple neural network built-in
- 🔐 No passwords, no biometrics — just how you behave
- 🎯 Emits standard events: `auth-success`, `auth-fail`, `auth-progress`

---

## ⚙️ Attributes

| Attribute | Type     | Description                                |
|----------|----------|--------------------------------------------|
| `username` | `string` | Unique ID for the user                     |
| `mode`     | `string` | `register` to train, `login` to authenticate |

---

## 🧱 Project Structure
```
nap-auth/
├── src/
│   ├── nap-auth.js              # <nap-auth> component
│   └── auth/                    # Neural engine + behavior tracking
│       ├── behavior-tracker.js
│       ├── feature-extractor.js
│       ├── neural-network.js
│       └── anti-spoofing.js
├── dist/
│   └── nap-auth.mjs             # Compiled output (ES module)
├── vite.config.js               # Vite build config
├── package.json
└── README.md
```

---

## 📜 License

MIT © [Pratik Acharya](https://github.com/pratikacharya1234)

---

## 🧪 Development

```bash
git clone https://github.com/yourusername/nap-auth
cd nap-auth
npm install
npm run build
```

> For local preview testing:
```bash
npm run preview
```

---

## 📣 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---

## 📌 Related Tags
`web-component` `neural-auth` `passwordless` `behavioral-auth` `biometrics` `custom-elements`

---

Made with ❤️ by [@pratikacharya1234](https://github.com/pratikacharya1234)
