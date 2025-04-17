let l, c, g = [], d = null, x = 0, M = 0, u = {
  mouseMovements: [],
  clickPatterns: [],
  hesitations: [],
  completionTime: 0
}, v = null, y = null;
function k(t) {
  l = t, c = l.getContext("2d"), l.width = l.offsetWidth, l.height = l.offsetHeight, A();
}
function b(t = 5) {
  l.width = l.offsetWidth || 600, l.height = l.offsetHeight || 400;
  const e = ["circle", "square", "triangle"], i = ["#ff4b5c", "#0077ff", "#2ecc71", "#f39c12", "#8e44ad"];
  g = [];
  for (let s = 0; s < t; s++) {
    const n = e[Math.floor(Math.random() * e.length)], o = i[Math.floor(Math.random() * i.length)], h = 50;
    g.push({
      id: s,
      shape: n,
      color: o,
      x: Math.random() * (l.width - h * 2) + h,
      y: Math.random() * (l.height - h * 2) + h,
      size: h,
      isDragging: !1
    });
  }
  return D(), p(), g;
}
function p() {
  u = {
    mouseMovements: [],
    clickPatterns: [],
    hesitations: [],
    completionTime: 0
  }, y = Date.now(), v = null;
}
function z() {
  return u.completionTime = Date.now() - y, u;
}
function D() {
  c.clearRect(0, 0, l.width, l.height), g.forEach(E);
}
function E(t) {
  switch (c.fillStyle = t.color, t.shape) {
    case "circle":
      c.beginPath(), c.arc(t.x, t.y, t.size / 2, 0, Math.PI * 2), c.fill();
      break;
    case "square":
      c.fillRect(t.x - t.size / 2, t.y - t.size / 2, t.size, t.size);
      break;
    case "triangle":
      c.beginPath(), c.moveTo(t.x, t.y - t.size / 2), c.lineTo(t.x + t.size / 2, t.y + t.size / 2), c.lineTo(t.x - t.size / 2, t.y + t.size / 2), c.closePath(), c.fill();
      break;
  }
}
function A() {
  l.addEventListener("mousedown", T), l.addEventListener("mousemove", C), l.addEventListener("mouseup", S);
}
function T(t) {
  const { x: e, y: i } = w(t);
  for (let s of g)
    if (I(e, i, s)) {
      d = s, x = e - s.x, M = i - s.y, s.isDragging = !0;
      break;
    }
  q(t);
}
function C(t) {
  const { x: e, y: i } = w(t);
  d && (d.x = e - x, d.y = i - M, D()), P(t);
}
function S() {
  d && (d.isDragging = !1, d = null);
}
function I(t, e, i) {
  const s = t - i.x, n = e - i.y, o = Math.sqrt(s * s + n * n);
  switch (i.shape) {
    case "circle":
      return o <= i.size / 2;
    case "square":
    case "triangle":
      return t >= i.x - i.size / 2 && t <= i.x + i.size / 2 && e >= i.y - i.size / 2 && e <= i.y + i.size / 2;
    default:
      return !1;
  }
}
function w(t) {
  const e = l.getBoundingClientRect();
  return {
    x: t.clientX - e.left,
    y: t.clientY - e.top
  };
}
function P(t) {
  const { x: e, y: i } = w(t), s = Date.now();
  if (v !== null) {
    const n = u.mouseMovements[u.mouseMovements.length - 1], o = s - n.timestamp;
    Math.sqrt((e - n.x) ** 2 + (i - n.y) ** 2) / o < 0.05 && o > 300 && u.hesitations.push({ x: e, y: i, duration: o, timestamp: s });
  }
  u.mouseMovements.push({ x: e, y: i, timestamp: s }), v = s;
}
function q(t) {
  const { x: e, y: i } = w(t);
  u.clickPatterns.push({
    x: e,
    y: i,
    timestamp: Date.now(),
    pressure: t.pressure || 1
  });
}
function O(t) {
  return {
    averageSpeed: L(t.mouseMovements),
    hesitationCount: t.hesitations.length,
    averageHesitationDuration: j(t.hesitations),
    clickInterval: B(t.clickPatterns),
    movementVariability: H(t.mouseMovements),
    // normalize to seconds
    completionTime: t.completionTime / 1e3
  };
}
function L(t) {
  if (t.length < 2)
    return 0;
  let e = 0, i = 0;
  for (let s = 1; s < t.length; s++) {
    const n = t[s - 1], o = t[s], h = o.x - n.x, f = o.y - n.y, m = o.timestamp - n.timestamp;
    e += Math.sqrt(h * h + f * f), i += m;
  }
  return i > 0 ? e / i : 0;
}
function j(t) {
  return t.length === 0 ? 0 : t.reduce((i, s) => i + s.duration, 0) / t.length;
}
function B(t) {
  if (t.length < 2)
    return 0;
  let e = 0;
  for (let i = 1; i < t.length; i++)
    e += t[i].timestamp - t[i - 1].timestamp;
  return e / (t.length - 1);
}
function H(t) {
  const e = t.map((n) => n.x + n.y);
  if (e.length < 2)
    return 0;
  const i = e.reduce((n, o) => n + o, 0) / e.length, s = e.reduce((n, o) => n + Math.pow(o - i, 2), 0) / e.length;
  return Math.sqrt(s);
}
class W {
  constructor(e, i = 8, s = 1) {
    this.inputSize = e, this.hiddenSize = i, this.outputSize = s, this.weights1 = this.initWeights(e, i), this.bias1 = new Array(i).fill(0), this.weights2 = this.initWeights(i, s), this.bias2 = new Array(s).fill(0);
  }
  // Initialize random weights
  initWeights(e, i) {
    return Array.from(
      { length: e },
      () => Array.from({ length: i }, () => Math.random() * 2 - 1)
    );
  }
  // Sigmoid activation
  sigmoid(e) {
    return 1 / (1 + Math.exp(-e));
  }
  // Derivative of sigmoid
  sigmoidDerivative(e) {
    const i = this.sigmoid(e);
    return i * (1 - i);
  }
  // Forward pass
  forward(e) {
    return this.input = e, this.hiddenInput = this.dot(e, this.weights1, this.bias1), this.hiddenOutput = this.hiddenInput.map(this.sigmoid), this.finalInput = this.dot(this.hiddenOutput, this.weights2, this.bias2), this.finalOutput = this.finalInput.map(this.sigmoid), this.finalOutput;
  }
  // Train using one sample (Stochastic Gradient Descent)
  train(e, i, s = 0.1) {
    const n = this.forward(e), o = n.map((r, a) => i[a] - r), h = n.map((r, a) => o[a] * this.sigmoidDerivative(this.finalInput[a]));
    for (let r = 0; r < this.weights2.length; r++)
      for (let a = 0; a < this.weights2[0].length; a++)
        this.weights2[r][a] += s * h[a] * this.hiddenOutput[r], this.bias2[a] += s * h[a];
    const f = new Array(this.hiddenSize).fill(0);
    for (let r = 0; r < this.hiddenSize; r++)
      for (let a = 0; a < this.outputSize; a++)
        f[r] += h[a] * this.weights2[r][a];
    const m = f.map((r, a) => r * this.sigmoidDerivative(this.hiddenInput[a]));
    for (let r = 0; r < this.weights1.length; r++)
      for (let a = 0; a < this.weights1[0].length; a++)
        this.weights1[r][a] += s * m[a] * e[r];
    for (let r = 0; r < this.bias1.length; r++)
      this.bias1[r] += s * m[r];
  }
  // Utility to perform dot product and add bias
  dot(e, i, s) {
    const n = new Array(i[0].length).fill(0);
    for (let o = 0; o < i[0].length; o++) {
      for (let h = 0; h < e.length; h++)
        n[o] += e[h] * i[h][o];
      n[o] += s[o];
    }
    return n;
  }
  // Save and load weights for user profiles
  getModel() {
    return {
      weights1: this.weights1,
      weights2: this.weights2,
      bias1: this.bias1,
      bias2: this.bias2
    };
  }
  setModel(e) {
    this.weights1 = e.weights1, this.weights2 = e.weights2, this.bias1 = e.bias1, this.bias2 = e.bias2;
  }
}
class N extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.user = this.getAttribute("username") || "guest", this.mode = this.getAttribute("mode") || "login", this.network = new W(6), this.trainingData = [], this.trained = !1;
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        canvas { border: 1px dashed #0077ff; border-radius: 8px; width: 100%; height: 300px; background: #f9f9f9; }
        button { margin-top: 10px; padding: 8px 16px; border: none; border-radius: 8px; background: #0077ff; color: white; cursor: pointer; }
      </style>
      <canvas id="challenge"></canvas>
      <button id="submit">${this.mode === "register" ? "Train" : "Authenticate"}</button>
    `, this.canvas = this.shadowRoot.querySelector("#challenge"), this.submitBtn = this.shadowRoot.querySelector("#submit"), this.canvas && this.submitBtn ? (k(this.canvas), b(), p(), this.submitBtn.addEventListener("click", () => this.finish())) : console.error("Canvas or submit button not found in NAP Auth component.");
  }
  finish() {
    const e = z(), i = O(e);
    if (this.mode === "register")
      this.trainingData.push(i), this.trainingData.length >= 5 ? (this.trainingData.forEach((s) => this.network.train(Object.values(s), [1])), this.trained = !0, this.dispatchEvent(new CustomEvent("auth-success", { detail: { user: this.user, status: "trained" } }))) : (b(), p(), this.dispatchEvent(new CustomEvent("auth-progress", { detail: { remaining: 5 - this.trainingData.length } })));
    else if (this.mode === "login") {
      const s = this.network.forward(Object.values(i))[0], n = s >= 0.8, o = { user: this.user, success: n, confidence: s };
      this.dispatchEvent(new CustomEvent(n ? "auth-success" : "auth-fail", { detail: o }));
    }
  }
}
customElements.define("nap-auth", N);
export {
  N as NapAuth
};
