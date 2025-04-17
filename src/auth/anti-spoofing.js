// Anti-spoofing system for user authentication
export class AntiSpoofingSystem {
    constructor() {
    // Stores challenge metadata per user
      this.challengeHistory = {};  
    // Tracks user sessions for continuous auth
      this.sessionMonitoring = {}; 
    }
  
    // Generate unique challenge ID and metadata
    generateChallenge(userId, challengeData) {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  
      if (!this.challengeHistory[userId]) {
        this.challengeHistory[userId] = [];
      }
  
      this.challengeHistory[userId].push({
        id,
        timestamp: Date.now(),
        challenge: challengeData,
      });
  
      // Keep history manageable
      if (this.challengeHistory[userId].length > 10) {
        this.challengeHistory[userId].shift();
      }
  
      return id;
    }
  
    // Verify that the challenge response is valid (not spoofed)
    verifyChallenge(userId, challengeId, completionTime) {
      const history = this.challengeHistory[userId];
      if (!history) return false;
  
      const record = history.find(c => c.id === challengeId);
      if (!record) return false;
  
      // Less than 500ms = suspicious
      const tooFast = completionTime < 500; 
      // Over 5 min = expired
      const tooOld = Date.now() - record.timestamp > 5 * 60 * 1000; 
  
      return !tooFast && !tooOld;
    }
  
    // Start session monitoring
    startSession(userId, sessionId) {
      if (!this.sessionMonitoring[userId]) {
        this.sessionMonitoring[userId] = {};
      }
  
      this.sessionMonitoring[userId][sessionId] = {
        startTime: Date.now(),
        recentSamples: [],
        lastActivity: Date.now(),
      };
    }
  
    // Add live behavior during session
    recordSessionBehavior(userId, sessionId, behaviorSample) {
      const session = this.sessionMonitoring[userId]?.[sessionId];
      if (!session) return false;
  
      session.recentSamples.push(behaviorSample);
      session.lastActivity = Date.now();
  
      // Limit history
      if (session.recentSamples.length > 10) {
        session.recentSamples.shift();
      }
  
      return this.detectBehaviorShift(session.recentSamples);
    }
  
    // Detect behavior anomalies
    detectBehaviorShift(samples) {
      if (samples.length < 3) return false;
  
      const extract = sample => {
        return [
          sample.averageSpeed,
          sample.hesitationCount,
          sample.averageHesitationDuration,
          sample.clickInterval,
          sample.movementVariability,
          sample.completionTime
        ];
      };
  
      const recent = extract(samples[samples.length - 1]);
      const previous = extract(samples[samples.length - 2]);
  
      let variance = 0;
      for (let i = 0; i < recent.length; i++) {
        const a = recent[i], b = previous[i];
        const diff = Math.abs(a - b) / ((a + b) / 2 || 1);
        variance += diff;
      }
  
      const avgVariance = variance / recent.length;
      return avgVariance > 0.5; // >50% behavioral shift triggers alert
    }
  }
  