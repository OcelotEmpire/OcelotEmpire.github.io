/* Written by Adam Klassen (2023)
 * For Dr. Agnes Vojta
 * Missouri S&T Physics Department
 */

const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const stepBackButton = document.getElementById('step-back');
const stepForwardButton = document.getElementById('step-forward');
const resetButton = document.getElementById('reset');

const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');
var running = false;
var time = 0.0;

function clear(){
    ctx.fillStyle = '#f1f1f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function draw(){
    clear();
}

var run = function() {
    update();
    draw();
    time += 0.1
    if(running){
        setTimeout(run, 100);
    }
}

function start(){
    if(!running){
        startButton.disabled = true;
        pauseButton.diabled = false;
        stepBackButton.disabled = true;
        stepForwardButton.disabled = true;
        running = true;
        console.log('starting...');
    }
}
function pause(){
    if(running){
        startButton.disabled = false;
        pauseButton.disabled = true;
        stepBackButton.disabled = true;
        stepForwardButton.disabled = true;
        running = false;
        console.log('stopping...')
    }

}
startButton.onclick = start;
pauseButton.onclick = pause;
pauseButton.disabled = true;