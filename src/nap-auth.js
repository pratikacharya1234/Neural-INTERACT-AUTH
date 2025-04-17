import { initCanvas, generateChallenge, resetBehaviorData, finalizeBehaviorData } from './auth/behavior-tracker.js';
import { extractFeatures } from './auth/feature-extractor.js';
import { SimpleNeuralNetwork } from './auth/neural-network.js';

export class NapAuth extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.user = this.getAttribute('username') || 'guest';
    this.mode = this.getAttribute('mode') || 'login';
    this.network = new SimpleNeuralNetwork(6); // 6 extracted features
    this.trainingData = [];
    this.trained = false;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        canvas { border: 1px dashed #0077ff; border-radius: 8px; width: 100%; height: 300px; background: #f9f9f9; }
        button { margin-top: 10px; padding: 8px 16px; border: none; border-radius: 8px; background: #0077ff; color: white; cursor: pointer; }
      </style>
      <canvas id="challenge"></canvas>
      <button id="submit">${this.mode === 'register' ? 'Train' : 'Authenticate'}</button>
    `;

    this.canvas = this.shadowRoot.querySelector('#challenge');
    this.submitBtn = this.shadowRoot.querySelector('#submit');

    initCanvas(this.canvas.id);
    generateChallenge();
    resetBehaviorData();

    this.submitBtn.addEventListener('click', () => this.finish());
  }

  finish() {
    const data = finalizeBehaviorData();
    const features = extractFeatures(data);

    if (this.mode === 'register') {
      this.trainingData.push(features);
      if (this.trainingData.length >= 5) {
        this.trainingData.forEach(f => this.network.train(Object.values(f), [1]));
        this.trained = true;
        this.dispatchEvent(new CustomEvent('auth-success', { detail: { user: this.user, status: 'trained' } }));
      } else {
        generateChallenge();
        resetBehaviorData();
        this.dispatchEvent(new CustomEvent('auth-progress', { detail: { remaining: 5 - this.trainingData.length } }));
      }
    } else if (this.mode === 'login') {
      const confidence = this.network.forward(Object.values(features))[0];
      const success = confidence >= 0.8;
      const detail = { user: this.user, success, confidence };

      this.dispatchEvent(new CustomEvent(success ? 'auth-success' : 'auth-fail', { detail }));
    }
  }
}

customElements.define('nap-auth', NapAuth);
