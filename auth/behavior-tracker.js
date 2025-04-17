let canvas, ctx;
let challengeShapes = [];
let selectedShape = null;
let offsetX = 0;
let offsetY = 0;

// Setup canvas and context
export function initCanvas(canvasId = 'challenge-canvas') {
  canvas = document.getElementById(canvasId);
  ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  setupEventListeners();
}

// Generate randomized challenge
export function generateChallenge(count = 5) {
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
  return challengeShapes;
}

// Draw all shapes
function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  challengeShapes.forEach(drawShape);
}

// Draw single shape
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

// Mouse interaction events
function setupEventListeners() {
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
}

// Select shape if mouse is down on it
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
}

// Move shape with mouse
function onMouseMove(e) {
  if (!selectedShape) return;

  const { x, y } = getMousePos(e);
  selectedShape.x = x - offsetX;
  selectedShape.y = y - offsetY;

  drawAll();
}

// Drop shape
function onMouseUp() {
  if (selectedShape) {
    selectedShape.isDragging = false;
    selectedShape = null;
  }
}

// Utility: check if point is inside a shape
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

// Utility: mouse position relative to canvas
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}
