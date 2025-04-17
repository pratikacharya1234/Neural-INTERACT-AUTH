// Simple neural network-based authentication system
import { SimpleNeuralNetwork } from './neural-network.js';
import { extractFeatures } from './feature-extractor.js';

export class NeuralAuthSystem {
  constructor(inputSize = 6, trainingIterations = 5, threshold = 0.8) {
    this.inputSize = inputSize;
    this.trainingIterations = trainingIterations;
    this.confidenceThreshold = threshold;
    this.userProfiles = {}; // Stores { userId: { network, trainingData, trained } }
  }

  // Start user registration
  registerUser(userId) {
    this.userProfiles[userId] = {
      network: new SimpleNeuralNetwork(this.inputSize),
      trainingData: [],
      trained: false,
    };
    return ` Registration started for ${userId}. Complete ${this.trainingIterations} interactions.`;
  }

  // Add a training sample (features from behavior)
  addTrainingSample(userId, behaviorData) {
    const features = extractFeatures(behaviorData);
    const profile = this.userProfiles[userId];

    if (!profile) return ' User not registered.';

    profile.trainingData.push(features);

    if (profile.trainingData.length >= this.trainingIterations) {
      this.trainModel(userId);
      profile.trained = true;
      return ' Registration complete. You can now log in.';
    } else {
      const remaining = this.trainingIterations - profile.trainingData.length;
      return ` Training recorded. ${remaining} more to go.`;
    }
  }

  // Internal: Train the user's model
  trainModel(userId) {
    const profile = this.userProfiles[userId];
    const net = profile.network;

    profile.trainingData.forEach(data => {
      const input = Object.values(data);
      // 1 = correct user
      net.train(input, [1]); 

      // Add a few negative samples (fake data)
      for (let i = 0; i < 2; i++) {
        const fake = this.generateNegativeSample(data);
        // 0 = imposter
        net.train(Object.values(fake), [0]); 
      }
    });
  }

  // Create fake data for negative training
  generateNegativeSample(real) {
    const fake = {};
    for (const key in real) {
      const multiplier = 0.5 + Math.random() * 1.5;
      fake[key] = real[key] * multiplier;
    }
    return fake;
  }

  // Authenticate a user
  authenticate(userId, behaviorData) {
    const profile = this.userProfiles[userId];
    if (!profile || !profile.trained) return { success: false, message: ' Profile not ready.' };

    const features = extractFeatures(behaviorData);
    const input = Object.values(features);
    const confidence = profile.network.forward(input)[0];

    if (confidence >= this.confidenceThreshold) {
      return { success: true, confidence, message: ' Authentication successful!' };
    } else {
      return { success: false, confidence, message: ' Authentication failed.' };
    }
  }

  // Save and load models (for localStorage, session, etc.)
  exportUserModel(userId) {
    const profile = this.userProfiles[userId];
    return profile ? profile.network.getModel() : null;
  }

  importUserModel(userId, model) {
    this.userProfiles[userId] = {
      network: new SimpleNeuralNetwork(this.inputSize),
      trainingData: [],
      trained: true,
    };
    this.userProfiles[userId].network.setModel(model);
  }
}