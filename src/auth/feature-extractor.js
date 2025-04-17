// Extract numeric features from raw behavioral data
export function extractFeatures(behaviorData) {
    const features = {
      averageSpeed: calculateAverageSpeed(behaviorData.mouseMovements),
      hesitationCount: behaviorData.hesitations.length,
      averageHesitationDuration: calculateAverageDuration(behaviorData.hesitations),
      clickInterval: calculateClickInterval(behaviorData.clickPatterns),
      movementVariability: calculateMovementVariability(behaviorData.mouseMovements),
      // normalize to seconds
      completionTime: behaviorData.completionTime / 1000, 
    };
  
    return features;
  }
  
  // Calculate average speed from mouse path
  function calculateAverageSpeed(movements) {
    if (movements.length < 2) return 0;
    let totalDistance = 0;
    let totalTime = 0;
  
    for (let i = 1; i < movements.length; i++) {
      const prev = movements[i - 1];
      const curr = movements[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const dt = curr.timestamp - prev.timestamp;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
      totalTime += dt;
    }
  
    return totalTime > 0 ? totalDistance / totalTime : 0;
  }
  
  // Calculate average hesitation duration
  function calculateAverageDuration(hesitations) {
    if (hesitations.length === 0) return 0;
    const total = hesitations.reduce((sum, h) => sum + h.duration, 0);
    return total / hesitations.length;
  }
  
  // Calculate average time between clicks
  function calculateClickInterval(clicks) {
    if (clicks.length < 2) return 0;
    let totalInterval = 0;
    for (let i = 1; i < clicks.length; i++) {
      totalInterval += clicks[i].timestamp - clicks[i - 1].timestamp;
    }
    return totalInterval / (clicks.length - 1);
  }
  
  // Calculate variability in mouse movement (standard deviation)
  function calculateMovementVariability(movements) {
    const values = movements.map(p => p.x + p.y);
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
  