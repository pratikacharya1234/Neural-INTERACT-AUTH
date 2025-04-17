// Simple Neural Network
export class SimpleNeuralNetwork {
  constructor(inputSize, hiddenSize = 8, outputSize = 1) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;

    this.weights1 = this.initWeights(inputSize, hiddenSize);
    this.bias1 = new Array(hiddenSize).fill(0);

    this.weights2 = this.initWeights(hiddenSize, outputSize);
    this.bias2 = new Array(outputSize).fill(0);
  }

  // Initialize random weights
  initWeights(rows, cols) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 2 - 1)
    );
  }

  // Sigmoid activation
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  // Derivative of sigmoid
  sigmoidDerivative(x) {
    const fx = this.sigmoid(x);
    return fx * (1 - fx);
  }

  // Forward pass
  forward(input) {
    this.input = input;

    this.hiddenInput = this.dot(input, this.weights1, this.bias1);
    this.hiddenOutput = this.hiddenInput.map(this.sigmoid);

    this.finalInput = this.dot(this.hiddenOutput, this.weights2, this.bias2);
    this.finalOutput = this.finalInput.map(this.sigmoid);

    return this.finalOutput;
  }

  // Train using one sample (Stochastic Gradient Descent)
  train(input, target, learningRate = 0.1) {
    const output = this.forward(input);

    // Calculate output error
    const outputError = output.map((o, i) => target[i] - o);

    // Backpropagation - Output to Hidden
    const dOutput = output.map((o, i) => outputError[i] * this.sigmoidDerivative(this.finalInput[i]));
    for (let i = 0; i < this.weights2.length; i++) {
      for (let j = 0; j < this.weights2[0].length; j++) {
        this.weights2[i][j] += learningRate * dOutput[j] * this.hiddenOutput[i];
        this.bias2[j] += learningRate * dOutput[j];
      }
    }

    // Hidden layer error
    const hiddenError = new Array(this.hiddenSize).fill(0);
    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.outputSize; j++) {
        hiddenError[i] += dOutput[j] * this.weights2[i][j];
      }
    }

    // Backpropagation - Hidden to Input
    const dHidden = hiddenError.map((e, i) => e * this.sigmoidDerivative(this.hiddenInput[i]));
    for (let i = 0; i < this.weights1.length; i++) {
      for (let j = 0; j < this.weights1[0].length; j++) {
        this.weights1[i][j] += learningRate * dHidden[j] * input[i];
      }
    }

    for (let i = 0; i < this.bias1.length; i++) {
      this.bias1[i] += learningRate * dHidden[i];
    }
  }

  // Utility to perform dot product and add bias
  dot(input, weights, bias) {
    const result = new Array(weights[0].length).fill(0);
    for (let j = 0; j < weights[0].length; j++) {
      for (let i = 0; i < input.length; i++) {
        result[j] += input[i] * weights[i][j];
      }
      result[j] += bias[j];
    }
    return result;
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

  setModel(model) {
    this.weights1 = model.weights1;
    this.weights2 = model.weights2;
    this.bias1 = model.bias1;
    this.bias2 = model.bias2;
  }
}
