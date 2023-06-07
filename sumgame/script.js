// Aim Trainer kinda

// retrieve canvas from html
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// size and radius of the squares and circles
const squareSize = 30;
const circleRadius = 15;

// store the objects
let squares = [];
let circles = [];

// track stuff
let score = 0;
let clicked = 0;
let missed = 0;
let accuracy = 0;

// make sure the game is active
let isGameActive = false;

// display the stuff
const scoreElement = document.getElementById('score');
const clickedElement = document.getElementById('clicked');
const missedElement = document.getElementById('missed');
const accuracyElement = document.getElementById('accuracy');

// spawn the shapes on the canvas
function spawnShapes() {
  squares = [];
  circles = [];
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * (canvas.width - squareSize);
    const y = Math.random() * (canvas.height - squareSize);
    const speedX = Math.random() * 2 - 1;
    const speedY = Math.random() * 2 - 1;
    squares.push({ x, y, speedX, speedY });
  }

  const numCircles = Math.floor(squares.length / 5) * 2; // 2 circles for every 5 squares
  for (let i = 0; i < numCircles; i++) {
    const x = Math.random() * (canvas.width - circleRadius * 2) + circleRadius;
    const y = Math.random() * (canvas.height - circleRadius * 2) + circleRadius;
    const speedX = Math.random() * 2 - 1;
    const speedY = Math.random() * 2 - 1;
    circles.push({ x, y, speedX, speedY });
  }
}

// rendering the objects on the canvas, and for showing the other stuff like score 
function drawShapes() {
  for (const square of squares) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(square.x, square.y, squareSize, squareSize);
  }
  for (const circle of circles) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circleRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  scoreElement.textContent = `Score: ${score}`;
  clickedElement.textContent = `Clicked: ${clicked}`;
  missedElement.textContent = `Missed: ${missed}`;
  accuracyElement.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
}

// check if an object is clicked
function handleMouseClick(event) {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  let isSquareClicked = false;
  for (let i = 0; i < squares.length; i++) {
    const square = squares[i];

    if (x >= square.x && x <= square.x + squareSize && y >= square.y && y <= square.y + squareSize) {
      squares.splice(i, 1); // Remove clicked square
      score++;
      clicked++;
      isSquareClicked = true;
      break;
    }
  }
  if (!isSquareClicked) {
    missed++;
  }
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    const distance = Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2));

    if (distance <= circleRadius) {
      gameOver();
      break;
    }
  }
}

// update positions of the shapes, move them
function updateShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShapes();

  for (const square of squares) {
    square.x += square.speedX;
    square.y += square.speedY;
    if (square.x <= 0 || square.x + squareSize >= canvas.width) {
      square.speedX *= -1; // Reverse horizontal direction
    }
    if (square.y <= 0 || square.y + squareSize >= canvas.height) {
      square.speedY *= -1; // Reverse vertical direction
    }
  }
  for (const circle of circles) {
    circle.x += circle.speedX;
    circle.y += circle.speedY;

    if (circle.x <= circleRadius || circle.x >= canvas.width - circleRadius) {
      circle.speedX *= -1; // Reverse horizontal direction
    }
    if (circle.y <= circleRadius || circle.y >= canvas.height - circleRadius) {
      circle.speedY *= -1; // Reverse vertical direction
    }
  }
  accuracy = (score / (score + missed)) * 100 || 0; // calculate accuracy (avoid division by zero)
  requestAnimationFrame(updateShapes);
}

function gameOver() {
  isGameActive = false;
 document.removeEventListener('click', handleMouseClick);
  document.addEventListener('keydown', handleRestart);
}

// restart the game
function handleRestart(event) {
  if (event.code === 'Space') {
    document.removeEventListener('keydown', handleRestart);
    startGame();
  }
}

// click on the canvas to start
function startGame() {
  if (!isGameActive) {
    isGameActive = true;
    score = 0;
    clicked = 0;
    missed = 0;
    accuracy = 0;
    document.removeEventListener('keydown', handleRestart);
    document.addEventListener('click', handleMouseClick);
    spawnShapes();
    updateShapes();
  }
}

// fill the canvas with the "click to start"
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'white';
ctx.font = '40px Arial';
ctx.fillText('Click to Start', canvas.width / 2 - 120, canvas.height / 2 - 20);
document.addEventListener('click', startGame);