//https://codepen.io/palma99/pen/OJLwxaE
//https://editor.p5js.org/tjames@packer.edu/sketches/TtdpLh_H8

class Ball{

}
let xpos,ypos;
let xspeed = 2.8;
let yspeed = 2.2;
let xdirection = 1;
let ydirection=1;


function setup() {
    var clientHeight = document.getElementById('body').clientHeight;
    var clientWidth = document.getElementById('body').clientWidth;

    var cnv = createCanvas(clientWidth, clientHeight);
    cnv.parent("body");
    rectMode(CENTER);
    ellipseMode(CENTER);
    frameRate(60);

    xpos = clientWidth/2;
    ypos = 5*clientHeight/6;
}

function draw() {
    var clientHeight = document.getElementById('body').clientHeight;
    var clientWidth = document.getElementById('body').clientWidth;
    background(0);

    xpos = xpos + xspeed*xdirection;
    ypos = ypos + yspeed*ydirection;
    if(xpos >= mouseX - (50+10) && xpos <= mouseX + (50+10) || ypos == clientHeight - 10){
        xdirection *= -1;
        ydirection *= -1;
    }
    if(xpos > clientWidth - 10 || xpos < 10){
        xdirection *= -1;
    }
    if(ypos > clientHeight - 10 || ypos < 10){
        ydirection *= -1;
    }   
    
    let c = color(0,204,0);
    fill(c);
    rect(mouseX, clientHeight - 20, 100, 20, 20);
    c = color(255,255,255);
    fill(c);
    ellipse(xpos,ypos,20,20);
}