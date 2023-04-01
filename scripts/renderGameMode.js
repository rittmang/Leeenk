// var p5Script = document.createElement('script');
// p5Script.type = 'text/javascript';
// p5Script.src = 'https://cdn.jsdelivr.net/npm/p5@1.5.0/lib/p5.js';
// document.head.appendChild(p5Script);

var canvasStyle = document.createElement('style');
canvasStyle.textContent = 'canvas{position:absolute;left:0;top:0;z-index:-1;}';
document.head.appendChild(canvasStyle);


var collideScript = document.createElement('script');
collideScript.type = 'text/javascript';
collideScript.src =  'brickbreaker/gamescripts/p5.collide2d.js';
document.head.appendChild(collideScript);

var brickBreakScript = document.createElement('script');
brickBreakScript.type = 'text/javascript';
brickBreakScript.src =  'brickbreaker/gamescripts/bb2.js';
document.body.appendChild(brickBreakScript);
