import { SimpleNeuralNetwork } from './auth/neural-network.js';
import { initCanvas, generateChallenge, resetBehaviorData, finalizeBehaviorData } from './auth/behavior-tracker.js';
import { extractFeatures } from './auth/feature-extractor.js';

export class NapAuth extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.user = this.getAttribute('username') || 'guest';
      this.mode = this.getAttribute('mode') || 'login';
      this.network = new SimpleNeuralNetwork(6);
      this.trainingData = [];
      this.trained = false;
      this.requiredTrainingSamples = 5; //  Configurable training rounds
    }
  
    static get observedAttributes() {
      return ['mode'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'mode') {
        this.mode = newValue;
        if (this.submitBtn) {
          this.submitBtn.textContent = this.mode === 'register' ? 'Train' : 'Authenticate';
        }
      }
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
  
      if (this.canvas && this.submitBtn) {
        initCanvas(this.canvas);
        generateChallenge();
        resetBehaviorData();
  
        this.submitBtn.addEventListener('click', () => this.finish());
      } else {
        console.error("Canvas or submit button not found in NAP Auth component.");
      }
    }
  
    finish() {
      const data = finalizeBehaviorData();
      const features = extractFeatures(data);
  
      if (this.mode === 'register') {
        this.trainingData.push(features);
        if (this.trainingData.length >= this.requiredTrainingSamples) {
          this.trainingData.forEach(f => this.network.train(Object.values(f), [1]));
          this.trained = true;
          this.dispatchEvent(new CustomEvent('auth-success', {
            detail: { user: this.user, status: 'trained' }
          }));
        } else {
          generateChallenge();
          resetBehaviorData();
          this.dispatchEvent(new CustomEvent('auth-progress', {
            detail: { remaining: this.requiredTrainingSamples - this.trainingData.length }
          }));
        }
      } else if (this.mode === 'login') {
        const confidence = this.network.forward(Object.values(features))[0];
        const success = confidence >= 0.8;
        this.dispatchEvent(new CustomEvent(success ? 'auth-success' : 'auth-fail', {
          detail: { user: this.user, success, confidence }
        }));
      }
    }
  }
  
  customElements.define('nap-auth', NapAuth);
