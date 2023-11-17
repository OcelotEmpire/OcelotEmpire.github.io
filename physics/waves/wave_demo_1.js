/* Written by Adam Klassen (2023)
 * For Dr. Agnes Vojta
 * Missouri S&T Physics Department
 */

const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');

function clear(){
    ctx.fillStyle = '#f1f1f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function draw(){
    clear();
}