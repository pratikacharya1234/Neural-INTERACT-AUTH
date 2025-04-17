// Import canvas and  tracking functions
import {initCanvas,generateChallenge,resetBehaviorData,finalizeBehaviorData} from './auth/behavior-tracker.js';
  
  let behaviorSample = null;
  
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas and challenge
    initCanvas();
    generateChallenge();
    // Start tracking behavior
    resetBehaviorData(); 
  });
  
  //Call this function when the user finishes the challenge
  function endChallenge() {
    behaviorSample = finalizeBehaviorData();
    console.log('✅ Behavior data collected:', behaviorSample);
  }
  