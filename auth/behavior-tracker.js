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


//function to  draw all shapes
function drawAll(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    challangeShapes.forEach(drawShape);
}

//function to draw a single shape
function drawShape(shape){
    ctx.fillStyle = shape.color;

    switch(shape.shape){
        case 'circle':
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.size/2,  0, Math.PI * 2);
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


//mouse interaction functions
function setupEventListeners(){
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
}


//select shape if mouse is down on it
function onMouseDown(e){
    const {x, y} = getMousePos(e);

    for ( let shape of challangeShapes){
        if (isInsideShape(x, y, shape)){
            selectShape = shape;
            offsetX = x - shape.x;
            offsetY = y - shape.y;
            shape.isDrawing = true;
            break;
        }
    }
}


//move shape with mouse
function onMouseMove(e){
    if(!sekectedShape) return;

    const {x, y} = getMousePos(e);
    selectedShape.x = x - offsetX;
    selectedShape.y = y - offsetY;

    drawAll();
}

//drop shape
function onMouseUp(e){
    if(selectShape){
        selectShape.isDrawing = false;
        selectShape = null;
    }
}


//utility check if point is inside a shape
function isInsideShape(x,y,shape){
    const dx = x- shape.x;
    const dy = y - shape.y;
    const distacne= Math.sqrt(dx * dx + dy * dy);


    switch(shape.shape){
        case 'circle':
            return distacne <= shape.size /2;

        case 'square':
        case ' triangle':
            return(
                x >= shape.x - shape.size / 2 &&
                x <= shape.x + shape.size / 2 &&
                y >= shape.y - shape.size / 2 &&
                y <= shape.y + shape.size / 2
            );
            default:
            return false;
    }
}


//utility mouse position relative to canvas
function getMousePos(e){
    const rect = canvas.getBoundingClientRect();
    return{
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    }
}