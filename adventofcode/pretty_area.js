const display = document.getElementById("display");
    
var output = "";
var grid = [];
var timeStep = 0;
var printStep = 2500;
var running = true;
const lookup = {
    '|':'║',
    '-':'═',
    'F':'╔',
    '7':'╗',
    'L':'╚',
    'J':'╝',
    '.':' '
}
const numToPipe = {
    0b0101:'║',
    0b1010:'═',
    0b0110:'╔',
    0b1100:'╗',
    0b0011:'╚',
    0b1001:'╝',
    0b0000:' ',
    0b1111:'S',
}
const pipeToNum = {
    '║':0b0101,
    '═':0b1010,
    '╔':0b0110,
    '╗':0b1100,
    '╚':0b0011,
    '╝':0b1001,
    ' ':0b0000,
    'S':0b1111,
} 
const color = "blue";

function initGrid() {
    let lines = output.split('\n');
    for(let y = 0; y < lines.length; y++) {
        let line = lines[y];
        let row = [];
        for(let x=0; x<line.length; x++) {
            row.push(new Tile(x*2, y*2, line[x]));
            if(x != line.length-1)
                row.push(new Tile(x*2 + 1, y*2, ' '));
        }
        grid.push(row);
        if(y != lines.length-1){
            let emptyRow = row.map((el, x) => new Tile(x, y*2 + 1, ' '));
            grid.push(emptyRow);
        }
    }
    for(let row=0; row<grid.length; row++) { // generate new pipes
        for(let col=0; col<grid[0].length; col++) {
            if(row%2 == 0 && col%2 == 1) { // ==
                let left = grid[row][col-1];
                let right = grid[row][col+1];
                if(pipeToNum[left.symbol] >> 1 & 1 && pipeToNum[right.symbol] >> 3 & 1) {
                    grid[row][col].symbol = numToPipe[0b1010];
                }
            } else if(row%2 == 1 && col%2 == 0) { // ||
                let above = grid[row-1][col];
                let below = grid[row+1][col];
                if(pipeToNum[above.symbol] >> 2 & 1 && pipeToNum[below.symbol] >> 0 & 1) {
                    grid[row][col].symbol = numToPipe[0b0101];
                }
            }
        }
    }
    //printGrid();
    //console.log(grid);
}
function initSmallGrid() {
    let lines = output.split('\n');
    for(let y = 0; y < lines.length; y++) {
        let line = lines[y];
        let row = [];
        for(let x=0; x<line.length; x++) {
            row.push(new Tile(x, y, line[x]));
        }
        grid.push(row);
    }
}
function printGrid() {
    output = "";
    for(const row of grid) {
        output += "<pre>";
        let inSpan = false;
        for(const tile of row) {
            if(tile.wet) {
                if(!inSpan) {
                    inSpan = true;
                    output += '<span class="wet">'
                }
            } else {
                if(inSpan) {
                    inSpan = false;
                    output += "</span>"
                }
            }
            output += tile.symbol;
        }
        output += "</pre>";
    }
    output = output.replaceAll('\r', '');
    display.innerHTML = output;
    //console.log(output);
}
function printInterval() {
    printGrid();
    if(running) {
        setTimeout(printInterval, printStep);
    }
}
function Tile(x, y, symbol) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.wet = false;
    this.filled = false;
    this.next = () => {
        let myNum = pipeToNum[this.symbol];
        if(myNum == 0) return false;
        let next;
        if(myNum >> 0 & 1 && this.y > 0) { // going up
            next = grid[this.y-1][this.x];
            if(! next.wet && (pipeToNum[next.symbol] >> 2 & 1)) return next;
        } 
        if(myNum >> 1 & 1 && this.x < grid[0].length-1) { //going right
            next = grid[this.y][this.x+1];
            if(! next.wet && (pipeToNum[next.symbol] >> 3 & 1)) return next;
        }
        if(myNum >> 2 & 1 && this.y < grid.length-1) { //going down
            next = grid[this.y+1][this.x];
            if(! next.wet && (pipeToNum[next.symbol] >> 0 & 1)) return next;
        }
        if(myNum >> 3 & 1 && this.x > 0) { //going left
            next = grid[this.y][this.x-1];
            if(!next.wet && (pipeToNum[next.symbol] >> 1 & 1)) return next;
        }
        return false;
    }
}
function fillPipe(start, distance) {
    start.wet = true;
    let nextPipe = start.next();
    //console.log(nextPipe);
    //printGrid();
    if(nextPipe) {
        setTimeout(fillPipe, timeStep, nextPipe, distance + 1);
    } else {
        console.log(distance);
        setTimeout(manualFill, 100);
    }
}
var area = 0;
function floodFill(queue) {
    if(queue.length != 0) {
        let current = queue.shift();
        current.filled = true;
        current.wet = true;
        current.symbol = '▓';
        area ++;
        if(current.y > 0) { // above
            let next = grid[current.y-1][current.x];
            if(!next.wet) {
                next.wet = true;
                queue.push(next);
            }
        }
        if(current.x < grid[0].length-1) { // right
            let next = grid[current.y][current.x+1];
            if(!next.wet) {
                next.wet = true;
                queue.push(next);
            }
        }
        if(current.y < grid.length-1) { // below
            let next = grid[current.y+1][current.x];
            if(!next.wet) {
                next.wet = true;
                queue.push(next);
            }
        }
        if(current.x > 0) { // left
            let next = grid[current.y][current.x-1];
            if(!next.wet) {
                next.wet = true;
                queue.push(next);
            }
        }
        setTimeout(floodFill, timeStep, queue);
    } else  {
        console.log(area);
        manualAreaCount();
    }
}
function manualFill(){
    let queue = [];
        queue.push(grid[34][167]);
        floodFill(queue);
}
function manualAreaCount() {
    let areasum = 0;
    for(let row=0; row<grid.length; row++) {
        for(let col=0; col<grid[0].length; col++) {
            if(row%2 == 0 && col%2 == 0) {
                if(grid[row][col].filled) {
                    areasum ++;
                }
            }
        }
    }
    console.log(areasum);
    running = false;
}

window.onload = () => {
    fetch("input.txt").then((file) => file.text()).then((text) => {
        console.log("initializing...");
        output = text;
        Object.keys(lookup).forEach(key => {
            output = output.replaceAll(key, lookup[key]);
        });
        initGrid();
        //initSmallGrid();
        printGrid();
        fillPipe(grid[34][166], 0); // S is at (x=166, y=34)
        
        printInterval();

        //fillPipe(grid[16][83], 0); // S is at (x=166, y=34)
        // let queue = [];
        // queue.push(grid[34][165]);
        // floodFill(queue);
        //printGrid();
    }).catch((e) => console.error(e));
}