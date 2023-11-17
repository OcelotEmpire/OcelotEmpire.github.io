/* Written by Adam Klassen (2023)
 * For Dr. Agnes Vojta
 * Missouri S&T Physics Department
 */

const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const stepBackButton = document.getElementById('step-back');
const stepForwardButton = document.getElementById('step-forward');
const resetButton = document.getElementById('reset');

function disableButton(button) {
    button.disabled = true;
}
function enableButton(button) {
    button.removeAttribute('disabled');
}

const width = 1920, height = 1080;
const canvas = document.getElementById('display');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
var running = false;
var time = 0;

function clear(){
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


const gridCount = 12;
const gridMargin = 0.05;
const gridSize = Math.floor((width - 2*gridMargin) / gridCount);
const gridOffset = width * 0.05;
function drawGrid() {
    ctx.lineWidth = 5;
    ctx.beginPath();
    for(let i=0; i<gridCount; i++){
        ctx.strokeStyle = '#c1c1c1';
        ctx.moveTo(i*gridSize + gridOffset, 0);
        ctx.lineTo(i*gridSize + gridOffset, height);
        ctx.moveTo(0, i*gridSize + gridOffset);
        ctx.lineTo(width, i*gridSize + gridOffset);
    }
    ctx.stroke();

}
const numTransverse = 80
const transverseSpacing = gridSize / 10;
const transverseStartX = 2, transverseStartY = 2;
const amplitude = 1, wavelength = 4;
const k= 2 * Math.PI / (gridSize * wavelength), v=1000, omega = v*k;
function drawTransverse() {
    let r= 0.07*gridSize;
    for(let i=0; i<numTransverse; i++){

        if(i == 10) ctx.fillStyle = 'black';
        else if(i == 15) ctx.fillStyle = 'green';
        else if(i == 20) ctx.fillStyle = 'blue';
        else if(i == 50) ctx.fillStyle = 'black';
        else ctx.fillStyle = 'red';

        let x = transverseStartX*gridSize + gridOffset;
        let y = transverseStartY*gridSize + gridOffset;
        x += transverseSpacing * i;
        //y += (amplitude*gridSize) * Math.sin(k * x) * Math.cos(omega * time/1000);
        y += (amplitude*gridSize) * Math.sin(k * x - omega * time/1000)
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI);
        ctx.fill();
    }
    
}
function drawLongitudinal() {

}
function drawWaves() {
    drawTransverse();
    drawLongitudinal();
}
function drawHud() {
    ctx.fillStyle = '#000000';
    ctx.font = 'Bold 48pt Calibri';
    ctx.textBaseline = 'top';
    ctx.fillText(`Time:   ${time / 1000}`, 10, 10);
}
function draw() {
    clear();
    drawGrid();
    drawWaves();
    drawHud();
}
function update() {
    //console.log('updated:', time);
}

const frameTime = 50;
var run = function() {
    update();
    draw();
    time += frameTime
    if(running){
        setTimeout(run, frameTime);
    }
}

function start() {
    if(!running){
        disableButton(startButton);
        enableButton(pauseButton);
        
        disableButton(stepBackButton);
        disableButton(stepForwardButton);
        running = true;
        console.log('starting...');
        run();
    }
}
function pause() {
    if(running){
        enableButton(startButton);
        disableButton(pauseButton);
        
        enableButton(stepBackButton);
        enableButton(stepForwardButton);
        running = false;
        console.log('stopping...')
    }

}
var stepSize = 500
function stepForward() {
    time += stepSize;
}
function stepBack() {
    time -= stepSize;
}
function reset() {
    running = false;
    time = 0;
    enableButton(startButton);
    disableButton(pauseButton);
    
    enableButton(stepBackButton);
    enableButton(stepForwardButton);

    draw();
}

startButton.onclick = start;
pauseButton.onclick = pause;
stepBackButton.onclick = stepBack;
stepForwardButton.onclick = stepForward;
resetButton.onclick = reset;

pauseButton.disabled = true;

draw();