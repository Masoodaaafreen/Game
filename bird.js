const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird = {
  x: 50,
  y: canvas.height / 2,
  vy: 0,
  size: 30,
  jumpForce: -6,
  gravity: 0
};

let pipes = [];
let score = 0;
let gameOver = false;

// Pipe variables
const pipeWidth = 80;
const pipeGap = 300;
const pipeSpeed = 2;

// Event listeners
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    bird.vy = bird.jumpForce;
  }
});

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update bird
  bird.y += bird.vy;
  bird.vy += bird.gravity;

  // Prevent bird from going off-screen
  if (bird.y + bird.size > canvas.height) {
    bird.y = canvas.height - bird.size;
    bird.vy = 0;
  }

  if (bird.y < 0) {
    bird.y = 0;
    bird.vy = 0;
  }

  // Draw bird
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

  // Update pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= pipeSpeed;

    // Draw pipe
    ctx.fillStyle = '#3E8E41';
    ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].y);
    ctx.fillRect(pipes[i].x, pipes[i].y + pipeGap, pipeWidth, canvas.height);

    // Collision detection
    if (checkCollision(bird, pipes[i])) {
      gameOver = true;
    }

    // Remove pipe if off-screen
    if (pipes[i].x < -pipeWidth) {
      pipes.splice(i, 1);
      score++;
    }
  }

  // Add new pipe
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - pipeWidth * 2) {
    const pipeY = Math.random() * (canvas.height - pipeGap);
    pipes.push({ x: canvas.width, y: pipeY });
  }

  // Draw score
  ctx.font = '24px Arial';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${score}`, 10, 10);

  // Game over screen
  if (gameOver) {
    ctx.font = '48px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(update);
}

// Collision detection
function checkCollision(bird, pipe) {
  if (bird.x + bird.size > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.y || bird.y + bird.size > pipe.y + pipeGap)) {
    return true;
  }
  return false;
}

update();



