import { initCanvas, generateChallenge } from './auth/behavior-tracker.js';

document.addEventListener('DOMContentLoaded', () => {
// Set up canvas and interaction
  initCanvas();                          
  // Create challenge shapes
  const challenge = generateChallenge(); 
});
