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
}