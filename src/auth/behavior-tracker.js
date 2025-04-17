// Canvas Setup & Challenge Logic
let canvas, ctx;
let challengeShapes = [];
let selectedShape = null;
let offsetX = 0;
let offsetY = 0;

// Behavior tracking variables
let behaviorData = {
  mouseMovements: [],
  clickPatterns: [],
  hesitations: [],
  completionTime: 0,
};
let lastMoveTimestamp = null;
let challengeStartTime = null;

// Public: Setup canvas and start tracking
export function initCanvas(canvasId = 'challenge-canvas') {
  canvas = document.getElementById(canvasId);
  ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  setupEventListeners();
}

// Public: Generate randomized challenge
export function generateChallenge(count = 5) {
  canvas.width = canvas.offsetWidth || 600;
  canvas.height = canvas.offsetHeight || 400;

  const shapes = ['circle', 'square', 'triangle'];
  const colors = ['#ff4b5c', '#0077ff', '#2ecc71', '#f39c12', '#8e44ad'];

  challengeShapes = [];

  for (let i = 0; i < count; i++) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 50;

    challengeShapes.push({
      id: i,
      shape,
      color,
      x: Math.random() * (canvas.width - size * 2) + size,
      y: Math.random() * (canvas.height - size * 2) + size,
      size,
      isDragging: false,
    });
  }

  drawAll();
  // Track from challenge start
  resetBehaviorData(); 
  return challengeShapes;
}

// Public: Reset behavior tracking
export function resetBehaviorData() {
  behaviorData = {
    mouseMovements: [],
    clickPatterns: [],
    hesitations: [],
    completionTime: 0,
  };
  challengeStartTime = Date.now();
  lastMoveTimestamp = null;
}

// Public: Finalize and return behavior sample
export function finalizeBehaviorData() {
  behaviorData.completionTime = Date.now() - challengeStartTime;
  return behaviorData;
}

// Draw all shapes
function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  challengeShapes.forEach(drawShape);
}

// Draw a single shape
function drawShape(shape) {
  ctx.fillStyle = shape.color;

  switch (shape.shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'square':
      ctx.fillRect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y - shape.size / 2);
      ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size / 2);
      ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size / 2);
      ctx.closePath();
      ctx.fill();
      break;
  }
}

// Event Listeners
function setupEventListeners() {
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
}

function onMouseDown(e) {
  const { x, y } = getMousePos(e);

  for (let shape of challengeShapes) {
    if (isInsideShape(x, y, shape)) {
      selectedShape = shape;
      offsetX = x - shape.x;
      offsetY = y - shape.y;
      shape.isDragging = true;
      break;
    }
  }

  trackClick(e);
}

function onMouseMove(e) {
  const { x, y } = getMousePos(e);

  if (selectedShape) {
    selectedShape.x = x - offsetX;
    selectedShape.y = y - offsetY;
    drawAll();
  }

  trackMouseMove(e);
}

function onMouseUp() {
  if (selectedShape) {
    selectedShape.isDragging = false;
    selectedShape = null;
  }
}

// Shape collision detection
function isInsideShape(x, y, shape) {
  const dx = x - shape.x;
  const dy = y - shape.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  switch (shape.shape) {
    case 'circle':
      return distance <= shape.size / 2;
    case 'square':
    case 'triangle':
      return (
        x >= shape.x - shape.size / 2 &&
        x <= shape.x + shape.size / 2 &&
        y >= shape.y - shape.size / 2 &&
        y <= shape.y + shape.size / 2
      );
    default:
      return false;
  }
}

// Get mouse position relative to canvas
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

// Behavioral Data Tracking
function trackMouseMove(e) {
  const { x, y } = getMousePos(e);
  const timestamp = Date.now();

  if (lastMoveTimestamp !== null) {
    const lastPoint = behaviorData.mouseMovements[behaviorData.mouseMovements.length - 1];
    const timeDiff = timestamp - lastPoint.timestamp;
    const distance = Math.sqrt((x - lastPoint.x) ** 2 + (y - lastPoint.y) ** 2);
    const speed = distance / timeDiff;

    if (speed < 0.05 && timeDiff > 300) {
      behaviorData.hesitations.push({ x, y, duration: timeDiff, timestamp });
    }
  }

  behaviorData.mouseMovements.push({ x, y, timestamp });
  lastMoveTimestamp = timestamp;
}

function trackClick(e) {
  const { x, y } = getMousePos(e);
  behaviorData.clickPatterns.push({
    x,
    y,
    timestamp: Date.now(),
    pressure: e.pressure || 1.0,
  });
}
