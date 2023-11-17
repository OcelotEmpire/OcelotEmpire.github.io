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

const width = 1920, height = 740;
const waveCanvas = document.getElementById('wave-display');
const graphCanvas = document.getElementById('graph-display');
waveCanvas.width = width;
waveCanvas.height = height;
graphCanvas.width = width;
graphCanvas.height = height;
const waveCtx = waveCanvas.getContext('2d');
const graphCtx = graphCanvas.getContext('2d');

var running = false;
var time = 0;

const clearColor = '#ffffff'
function clear(ctx){
    ctx.fillStyle = clearColor;
    ctx.fillRect(0, 0, width, height);
}
const gridCount = 6;
const gridMargin = 0.05; //grid
const gridSize = Math.floor((width - 2*gridMargin) / gridCount); //px
const gridOffset = width * 0.03; //px
function drawGrid(ctx) {
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

const totalWaves = 2
const numTransverse = 80;
const transverseSpacing = gridSize / 10 / totalWaves; //px
const transverseStartX = 1, transverseStartY = 1; //grid
const amplitude = 0.5, wavelength = 2*gridSize; //grid
const k= 2 * Math.PI / wavelength, v=-500, omega = v*k;

const pointRadius = 0.05*gridSize;
function drawWave(ctx) {
    for(let i=numTransverse-1; i>=0; i--){ 
        if(i == 0) ctx.fillStyle = "blue";
        else ctx.fillStyle = 'red';

        let x = transverseStartX*gridSize + gridOffset;
        let y = transverseStartY*gridSize + gridOffset;
        x += transverseSpacing * i;
        y += (amplitude*gridSize) * Math.sin(k * (transverseSpacing * i) - omega * time/1000);
        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, 2*Math.PI);
        ctx.fill();
    }   
}
function drawWaveHud(ctx) {
    ctx.fillStyle = '#000000';
    ctx.font = 'Bold 48pt Calibri';
    ctx.textBaseline = 'top';
    ctx.fillText(`Time:   ${(time / 1000).toFixed(2)}`, 10, 10);
}

const graphRows = 6, graphCols = 9;
const graphOffsetX = 200, graphOffsetY = 30;
const graphWidth = width - 250, graphHeight = height - 150;
const graphMajorTick = 50, graphMinorTick = 30;
const samplingFrequency = 10; //per graph column
function drawGraph(ctx) {
    ctx.lineWidth = 5;
    ctx.beginPath();
    let graphSizeX = graphWidth / graphCols;
    let graphSizeY = graphHeight / graphRows;

    if(time/1000 > graphCols/2){
        pause();
        time = graphCols/2 * 1000;
    }
    let timeOffset = time/1000*2 > graphCols ? (time/1000*2*graphSizeX) % graphSizeX : 0; //unused -- stop before continuing
    ctx.strokeStyle = 'pink';

    //graph ----------------------------------------------
    // horizontal lines
    for(let i=0; i<graphRows+1; i++){
        ctx.moveTo(graphOffsetX, i*graphSizeY + graphOffsetY);
        ctx.lineTo(graphOffsetX+graphWidth, i*graphSizeY + graphOffsetY);
    }
    // vertical lines
    for(let i=1; i<graphCols+1; i++){
        ctx.moveTo(i*graphSizeX + graphOffsetX - timeOffset, graphOffsetY);
        ctx.lineTo(i*graphSizeX + graphOffsetX  - timeOffset, graphOffsetY+graphHeight);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'black';

    ctx.moveTo(graphOffsetX, graphOffsetY);
    ctx.lineTo(graphOffsetX, graphHeight + graphOffsetY);
    
    // vertical ticks
    for(let i=0; i<graphRows+1; i++){
        ctx.moveTo(graphOffsetX, graphOffsetY + graphSizeY*i);
        ctx.lineTo(graphOffsetX+(i%2 == 0 ? graphMinorTick: graphMajorTick), graphOffsetY + graphSizeY*i);
    }
    // horizontal ticks
    for(let i=1; i<graphCols+1; i++){
        ctx.moveTo(graphOffsetX+graphSizeX*i - timeOffset, graphOffsetY+graphHeight);
        ctx.lineTo(graphOffsetX+graphSizeX*i - timeOffset, graphOffsetY+graphHeight-(i%2 == 0 ? graphMajorTick: graphMinorTick));
    }
    ctx.stroke();

    //wave -------------------------------------------
    let graphPointRadius = graphSizeX * 0.04;
    let graphSpacing = graphSizeX / samplingFrequency;
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'blue';
    ctx.moveTo(graphOffsetX, graphHeight/1 + graphOffsetY);
    ctx.beginPath();
    for(let i=0; i<Math.min(samplingFrequency*graphCols, time/1000 *2*samplingFrequency); i++){
        let x = graphOffsetX +  graphSpacing * i;
        let y = graphHeight/2 + graphOffsetY;
        //calculate t in pixels
        let t = i*graphSpacing;// + Math.max(0, graphWidth - time/1000* 2 * graphSpacing);
        //convert t to seconds
        t /= 2*graphSizeX;
        y += (amplitude*graphSizeY*4) * Math.sin(-omega * t);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, graphPointRadius, 0, 2*Math.PI);
        ctx.fill();
        ctx.moveTo(x, y);
    }

}
function drawGraphHud(ctx) {
    ctx.fillStyle = '#000000';
    ctx.font = 'Bold 40pt Times New Roman';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center'
    ctx.fillText("Displacement vs. Time", graphWidth/2 + graphOffsetX, graphOffsetY+10);
    ctx.fillText("time", graphWidth/2 + graphOffsetX, graphOffsetY+graphHeight + 40);

    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("displacement", -(graphOffsetY + graphHeight/2), 100);
    ctx.restore();
}
function draw() {
    clear(waveCtx)
    clear(graphCtx)

    drawGrid(waveCtx);
    drawWave(waveCtx);
    drawWaveHud(waveCtx);
    
    drawGraph(graphCtx);
    drawGraphHud(graphCtx);
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
var stepSize = 50;
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