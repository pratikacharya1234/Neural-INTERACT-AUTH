// Import canvas and tracking functions
import {initCanvas,generateChallenge,resetBehaviorData,finalizeBehaviorData} from './auth/behavior-tracker.js';
  
// Import feature extractor function 
import { extractFeatures } from './auth/feature-extractor.js';
  
  let behaviorSample = null;
  
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas and challenge
    initCanvas();
    generateChallenge();
    // Start tracking behavior
    resetBehaviorData(); 
  });
  
  // ✅ Call this when user completes the challenge
  function endChallenge() {
    behaviorSample = finalizeBehaviorData();
    const featureVector = extractFeatures(behaviorSample);
    console.log('🧠 Feature vector:', featureVector);
  
    // TODO: Send featureVector to my neural network model for scoring
  }
  