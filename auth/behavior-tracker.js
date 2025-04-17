//----------------------------------
//|Canvas Setup and Challange Logic|
//----------------------------------

let canvas, ctx;
let challangeShapes = [];
let selectShape = null;
let offsetX = 0;
let offsetY = 0;

//setup canvas and context
export function initCanvas(canvasId = 'challange-canvas'){
    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidthl
    canvas.height = canvas.offsetHeight;

    // Set the background color
    setupEventListeners();
}


//generate random challange
export function generateChallange(count = 5){
    const shapes = ['circle', 'square', 'triangle'];
    const colors = ['#ff4b5c', '#0077ff', '#2ecc71', '#f39c12', '#8e44ad'];
    const size = 50;

    challangeShapes.push({
        id:i,
        shape,
        color,
        x: Math.random() *(canvas.width - size * 2) + size,
        y: Math.random() *(canvas.height - size * 2) + size,
        size,
        isDrawing: false,
    });

    drawAll();
    return challangeShapes;
}