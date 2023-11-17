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
const k= 2 * Math.PI / (gridSize * wavelength), v=800, omega = v*k;

const pointRadius = 0.08*gridSize;
function drawTransverse() {
    for(let i=0; i<numTransverse; i++){

        if(i == 10) ctx.fillStyle = 'black';
        else if(i == 15) ctx.fillStyle = '#00ff00';
        else if(i == 20) ctx.fillStyle = '#0000ff';
        else if(i == 50) ctx.fillStyle = 'black';
        else ctx.fillStyle = 'red';

        let x = transverseStartX*gridSize + gridOffset;
        let y = transverseStartY*gridSize + gridOffset;
        x += transverseSpacing * i;
        //y += (amplitude*gridSize) * Math.sin(k * x) * Math.cos(omega * time/1000);
        y += (amplitude*gridSize) * Math.sin(k * x - omega * time/1000)
        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, 2*Math.PI);
        ctx.fill();
    }
    
}
const numLongitudinal = 40
const numRowsLongitudinal = 5;
const longitudinalSpacingX = gridSize / 5, longitudinalSpacingY = gridSize * 0.2;
const longitudinalStartX = 2, longitudinalStartY = 4.5;
const longitudinalStretch = 0.4;
function drawLongitudinal() {
    for(let row=0; row<numRowsLongitudinal; row++){
        for(let i=0; i<numLongitudinal; i++){

            if(i == 5) ctx.fillStyle = 'black';
            else if(i == 10) ctx.fillStyle = '#00ff00';
            else if(i == 15) ctx.fillStyle = '#0000ff';
            else if(i == 25) ctx.fillStyle = 'black';
            else ctx.fillStyle = 'magenta';
    
            let x = longitudinalStartX*gridSize + gridOffset + longitudinalSpacingX*i;
            let y = longitudinalStartY*gridSize + gridOffset + longitudinalSpacingY*row;
            x += (longitudinalStretch*gridSize) * Math.sin(k * x - omega * time/1000)
            ctx.beginPath();
            ctx.arc(x, y, pointRadius, 0, 2*Math.PI);
            ctx.fill();
        }
    }
    
}
function drawWaves() {
    drawTransverse();
    drawLongitudinal();
}
function drawHud() {
    ctx.fillStyle = '#000000';
    ctx.font = 'Bold 48pt Calibri';
    ctx.textBaseline = 'top';
    ctx.fillText(`Time:   ${(time / 1000).toFixed(2)}`, 10, 10);
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
    //update();
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

        draw();
    }

}
var stepSize = 20
function stepForward() {
    time += stepSize;
    draw();
}
function stepBack() {
    time -= stepSize;
    draw();
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