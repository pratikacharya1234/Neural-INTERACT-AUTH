# 🧠 NAP Auth

> A lightweight, customizable behavioral authentication Web Component that authenticates users based on how they interact with a drag-and-drop challenge using mouse behavior and neural pattern recognition.

---

## 📦 Installation

Install via npm:

```bash
npm install nap-auth
```

Or include the built version manually:

```html
<script type="module" src="./dist/nap-auth.mjs"></script>
```

---

## 🚀 Usage

### 🔐 Basic HTML Example
```html
<nap-auth username="demo" mode="register"></nap-auth>
```

### 🔁 Toggle Between Register/Login
```html
<select id="mode">
  <option value="register">Register</option>
  <option value="login">Login</option>
</select>
<nap-auth id="auth" username="demo" mode="register"></nap-auth>

<script type="module">
  import 'nap-auth';

  const auth = document.getElementById('auth');
  document.getElementById('mode').addEventListener('change', e => {
    auth.setAttribute('mode', e.target.value);
  });

  auth.addEventListener('auth-success', e => console.log('✅ Success:', e.detail));
  auth.addEventListener('auth-fail', e => console.log('❌ Fail:', e.detail));
  auth.addEventListener('auth-progress', e => console.log('⏳ Progress:', e.detail));
</script>
```

---

## ✨ Features
- ✅ Fully self-contained Web Component
- 🎯 Tracks unconscious behavior:
  - Mouse movement speed
  - Hesitations (pauses)
  - Click pressure (if supported)
  - Time between interactions
- 🧠 Built-in neural network (no external AI libs)
- 🔐 Continuous and passive authentication
- 📡 Emits customizable events

---

## 🔍 Events
- `auth-success` — fired when authentication is successful
- `auth-fail` — fired when behavior does not match
- `auth-progress` — registration mode, shows training progress

---

## 🧪 How It Works
1. On registration, users complete a behavioral drag-and-drop challenge 5 times.
2. The system collects timing, movement, and hesitation metrics.
3. A neural network model is trained on the fly.
4. On login, new interaction is scored and compared to the saved profile.

> This method resists spoofing because it relies on how users behave, not what they input.

---

## 🧱 File Structure
```
nap-auth/
├── src/
│   ├── nap-auth.js                # Main component class
│   └── auth/
│       ├── behavior-tracker.js   # Tracks real-time interaction
│       ├── feature-extractor.js  # Generates feature vectors
│       ├── neural-network.js     # Simple backprop-based NN
├── dist/
│   └── nap-auth.mjs              # Compiled output for distribution
├── public/index.html             # Demo/testing entry point
├── package.json
├── vite.config.js
├── README.md
```

---

## 🛠️ Technologies Used
- **Vanilla JavaScript** (framework-free)
- **Web Components API** (custom elements, Shadow DOM)
- **Canvas API** (UI challenge interface)
- **Custom-built neural network** (no TensorFlow)
- **Vite** (build + preview)

---

## 🧑‍💻 How to Customize
You can easily modify the system for different use cases:

| What to Change                     | Where                                          |
|-----------------------------------|-------------------------------------------------|
| Confidence Threshold              | `nap-auth.js` → `confidence >= 0.8`            |
| Training Rounds                   | `nap-auth.js` → default is 5 samples           |
| Challenge Shapes                  | `behavior-tracker.js` → `generateChallenge()`  |
| Neural Net Size                   | `neural-network.js` → hidden layer config      |
| UI Design                         | Inside `nap-auth.js` Shadow DOM template       |

You can also fork and export it as a React/Vue wrapper if desired.

---

## 🧪 Run Locally
```bash
npm install
npm run dev      # development mode
npm run build    # compile Web Component to dist/
npm run preview  # test production output
```

To test the output:
```bash
cd public
vite preview
```

Then visit http://localhost:4173 or the printed URL.

---

## 🧰 Build and Publish (optional)
```bash
npm run build
npm publish --access public
```
Ensure `package.json` points to `dist/nap-auth.mjs` as the module entry.

---

## 📄 License
MIT License

Built with ❤️ by [Pratik Acharya](https://github.com/pratikacharya1234)

> Feel free to open issues, suggest improvements, or fork this project!
