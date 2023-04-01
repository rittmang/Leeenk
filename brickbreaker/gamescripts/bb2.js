let ball, paddle, bricks, brickSound;

function setup() {
var clientHeight = document.getElementById('body').clientHeight;
var clientWidth = document.getElementById('body').clientWidth;
  createCanvas(clientWidth, clientHeight);
  ball = { x: 500, y: 500, r: 10, xs: 0, ys: -5 };
  paddle = { x: width / 2 - 40, y: height - 20, w: 100, h: 20, s: 20 };
  bricks = getBricks();
  brickSound = new Audio('sounds/stop-13692.mp3');
  brickSound.volume = 0.2;
  background(0,0,0,0);
}

function draw() {
  clear();
  clearInterval()
  moveBall();
  movePaddle();
  checkCollisions();
  drawBricks();
  let c = color(pagestyle.defaultLinkColor);
  fill(c);
  ellipse(ball.x, ball.y, ball.r * 2);
  c = color(pagestyle.highlightLinkColor);
  fill(c);
  rect(paddle.x, paddle.y, paddle.w, paddle.h, paddle.s);
}

function moveBall() {
  ball.x += ball.xs;
  ball.y += ball.ys;
}

function movePaddle() {
  paddle.x = constrain(mouseX - paddle.w / 2, 0, width - paddle.w);
}

function checkCollisions() {
    if (ball.x - ball.r < 0 || ball.x + ball.r > width) ball.xs *= -1;
    if (ball.y - ball.r < 0) ball.ys *= -1;
    if (ball.y + ball.r > height - paddle.h && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
      ball.ys *= -1;
      ball.xs = map(ball.x - paddle.x, 0, paddle.w, -5, 5);
    }
    bricks.forEach((b) => {
      if (b.s == 1) {
        if (collideRectCircle(b.x, b.y, b.w, b.h, ball.x, ball.y, ball.r * 2)) {
          let dx = abs(ball.x - b.x - b.w / 2);
          let dy = abs(ball.y - b.y - b.h / 2);
          if (dx > b.w / 2 + ball.r) {
            ball.xs *= -1;
          } else if (dy > b.h / 2 + ball.r) {
            ball.ys *= -1;
          } else {
            ball.xs *= -1;
            ball.ys *= -1;
          }
          b.s = 0;
          brickSound.play();
          if (b.element) {
            b.element.remove();
          }
          bricks = getBricks();
        }
      }
    });
  }

function drawBricks() {
  bricks.forEach((b) => {
    if (b.s == 1) {
      fill(255, 255, 255, 40);
      rect(b.x, b.y, b.w, b.h, b.r);
      fill(255);
    }
  });
}

function getBricks() {
    let brickElements = document.querySelectorAll('.link');
    let bricks = [];
    brickElements.forEach((brickElement) => {
      let rect = brickElement.getBoundingClientRect();
      let brick = {
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
        r: 20,
        s: 1,
        element:brickElement
      };
      bricks.push(brick);
    });
    return bricks;
  }
  
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    bricks = getBricks();
  }