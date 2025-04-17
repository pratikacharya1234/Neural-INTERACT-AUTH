import {initCanvas,generateChallenge,resetBehaviorData,finalizeBehaviorData
} from './auth/behavior-tracker.js';
  
  import { extractFeatures } from './auth/feature-extractor.js';
  import { NeuralAuthSystem } from './auth/authentication.js';
  import { AntiSpoofingSystem } from './auth/anti-spoofing.js';
  
  // Initialize core systems
  const authSystem = new NeuralAuthSystem();
  const antiSpoofing = new AntiSpoofingSystem();
  
  let currentUser = null;
  let currentSession = null;
  let currentChallengeId = null;
  
  // On load, set up canvas
  document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    setupUIEvents();
  });
  
  function setupUIEvents() {
    document.getElementById('register-btn').addEventListener('click', () => {
      const user = getUsername();
      if (!user) return;
  
      currentUser = user;
      authSystem.registerUser(user);
      startChallenge();
    });
  
    document.getElementById('login-btn').addEventListener('click', () => {
      const user = getUsername();
      if (!user) return;
  
      currentUser = user;
      startChallenge();
    });
  
    document.getElementById('logout-btn')?.addEventListener('click', logoutUser);
  }
  
  function getUsername() {
    const input = document.getElementById('username');
    return input?.value.trim();
  }
  
  function startChallenge() {
    resetBehaviorData();
    const challenge = generateChallenge();
    currentChallengeId = antiSpoofing.generateChallenge(currentUser, challenge);
    document.getElementById('challenge-container').style.display = 'block';
    document.getElementById('login-container').style.display = 'none';
  }
  
  // Called after user finishes challenge
  window.endChallenge = function () {
    const behaviorSample = finalizeBehaviorData();
    const featureVector = extractFeatures(behaviorSample);
  
    // Anti-spoofing validation
    const valid = antiSpoofing.verifyChallenge(currentUser, currentChallengeId, behaviorSample.completionTime);
    if (!valid) return showMessage('Challenge validation failed. Try again.');
  
    const profile = authSystem.userProfiles[currentUser];
    if (profile && profile.trained) {
      // Authentication mode
      const result = authSystem.authenticate(currentUser, behaviorSample);
      showMessage(result.message + ` (confidence: ${result.confidence.toFixed(2)})`);
  
      if (result.success) {
        currentSession = Date.now().toString(36);
        antiSpoofing.startSession(currentUser, currentSession);
        showSecureArea();
      } else {
        showLoginArea();
      }
    } else {
      // Registration mode
      const msg = authSystem.addTrainingSample(currentUser, behaviorSample);
      showMessage(msg);
  
      if (authSystem.userProfiles[currentUser].trained) {
        showLoginArea();
      } else {
        setTimeout(startChallenge, 1500);
      }
    }
  };
  
  function showMessage(msg) {
    const div = document.getElementById('message-area');
    div.textContent = msg;
    div.style.display = 'block';
    setTimeout(() => (div.style.display = 'none'), 4000);
  }
  
  function showLoginArea() {
    document.getElementById('challenge-container').style.display = 'none';
    document.getElementById('secure-area').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
  }
  
  function showSecureArea() {
    document.getElementById('challenge-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('secure-area').style.display = 'block';
  }
  
  function logoutUser() {
    currentSession = null;
    currentUser = null;
    showLoginArea();
  }
  