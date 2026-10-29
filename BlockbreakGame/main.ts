const gamePanel = document.querySelector(".game") as HTMLCanvasElement;
const ctx = gamePanel.getContext("2d")!;
const home = document.querySelector(".home")!;
const startButton = document.querySelector(".start")!;
const radius = 8;
const maxAngle = Math.PI / 3;
let game = false;
const blockWidth = 48;
const blockHeight = 16;
const blockgap = 6;
const blocktop = 30;
const blockleft = 27;
const keys: { [key: string]: boolean } = {};
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});
const settings = {
  ballSpeed: 4,
};
const angle = Math.PI / 6;
const ball = {
  x: 240,
  y: 250,
  speedX: settings.ballSpeed * Math.sin(angle),
  speedY: -settings.ballSpeed * Math.cos(angle),
};
const paddle = {
  x: (gamePanel.width - 75) / 2,
  y: gamePanel.height - 10 - 30,
  width: 75,
  height: 10,
  speed: 6,
};
window.addEventListener("mousemove", (e) => {
  if (!game) return;
  const rect = gamePanel.getBoundingClientRect();
  const mouseX = (e.clientX - rect.left) * (gamePanel.width / rect.width);
  paddle.x = mouseX - paddle.width / 2;
});
type Rect = { x: number; y: number; width: number; height: number };
type Block = Rect & {
  type: "normal" | "hard";
  hp: number;
  anime: number;
};
const level: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];
let levelIndex = 0;
const blocks: Block[] = [];
const createBlocks = () => {
  blocks.length = 0;
  for (const [row, cells] of level.entries()) {
    for (const [col, cell] of cells.entries()) {
      if (cell === 1) {
        const hard = row === 0;
        blocks.push({
          x: blockleft + col * (blockWidth + blockgap),
          y: blocktop + row * (blockHeight + blockgap),
          width: blockWidth,
          height: blockHeight,
          type: hard ? "hard" : "normal",
          hp: hard ? 2 : 1,
          anime: 0,
        });
      }
    }
  }
};
const draw = () => {
  ctx.clearRect(0, 0, gamePanel.width, gamePanel.height);
  ctx.beginPath();
  const ballGradient = ctx.createRadialGradient(
    ball.x - radius / 3,
    ball.y - radius / 3,
    radius / 6,
    ball.x,
    ball.y,
    radius,
  );
  ballGradient.addColorStop(0, "#ffffff");
  ballGradient.addColorStop(1, "#bfdbfe");
  ctx.fillStyle = ballGradient;
  ctx.shadowColor = "#93c5fd";
  ctx.shadowBlur = 2;
  ctx.arc(ball.x, ball.y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.shadowBlur = 0;
  const paddleGradient = ctx.createLinearGradient(
    paddle.x,
    paddle.y,
    paddle.x,
    paddle.y + paddle.height,
  );
  paddleGradient.addColorStop(0, "#4ade80");
  paddleGradient.addColorStop(0.5, "#22c55e");
  paddleGradient.addColorStop(1, "#16a34a");
  ctx.fillStyle = paddleGradient;
  ctx.shadowColor = "#22c55e";
  ctx.shadowBlur = 2;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  const paddleBorder = ctx.createLinearGradient(
    paddle.x,
    paddle.y,
    paddle.x + paddle.width,
    paddle.y + paddle.height,
  );
  paddleBorder.addColorStop(0, "#86efac");
  paddleBorder.addColorStop(0.5, "#22c55e");
  paddleBorder.addColorStop(1, "#15803d");
  ctx.strokeStyle = paddleBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.shadowBlur = 0;
  for (const b of blocks) {
    ctx.fillStyle = b.type === "hard" ? "#f59e0b" : "#38bdf8";
    ctx.fillRect(b.x, b.y, b.width, b.height);
    const borderGradient = ctx.createLinearGradient(
      b.x,
      b.y,
      b.x + b.width,
      b.y + b.height,
    );
    if (b.type === "hard") {
      borderGradient.addColorStop(0, "#fff7ad");
      borderGradient.addColorStop(0.5, "#fb923c");
      borderGradient.addColorStop(1, "#b45309");
      ctx.shadowColor = "#f59e0b";
    } else {
      borderGradient.addColorStop(0, "#e0f2fe");
      borderGradient.addColorStop(0.5, "#38bdf8");
      borderGradient.addColorStop(1, "#1d4ed8");
      ctx.shadowColor = "#38bdf8";
    }
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 2;
    ctx.strokeRect(b.x, b.y, b.width, b.height);
    ctx.shadowBlur = 0;
  }
};
const update = () => {
  const previousX = ball.x;
  const previousY = ball.y;
  ball.x += ball.speedX;
  ball.y += ball.speedY;
  if (ball.x > gamePanel.width - radius) {
    ball.speedX *= -1;
    ball.x = gamePanel.width - radius;
  }
  if (ball.x < radius) {
    ball.speedX *= -1;
    ball.x = radius;
  }
  if (ball.y > gamePanel.height - radius) {
    ball.speedY *= -1;
    ball.y = gamePanel.height - radius;
  }
  if (ball.y < radius) {
    ball.speedY *= -1;
    ball.y = radius;
  }
  if (keys.ArrowLeft || keys.KeyA) paddle.x -= paddle.speed;

  if (keys.ArrowRight || keys.KeyD) paddle.x += paddle.speed;
  paddle.x = Math.max(0, Math.min(paddle.x, gamePanel.width - paddle.width));
  const overlapX =
    ball.x + radius >= paddle.x && ball.x - radius <= paddle.x + paddle.width;
  const overlapY =
    ball.y + radius >= paddle.y && ball.y - radius <= paddle.y + paddle.height;
  if (overlapX && overlapY) {
    const fromAbove =
      ball.speedY > 0 && ball.y - ball.speedY + radius <= paddle.y;

    if (fromAbove) {
      const hit = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      const rangeObserver = Math.max(-1, Math.min(1, hit));
      const returnAngle = rangeObserver * maxAngle;
      ball.speedX = settings.ballSpeed * Math.sin(returnAngle);
      ball.speedY = -settings.ballSpeed * Math.cos(returnAngle);
      ball.y = paddle.y - radius;
    } else if (ball.y <= paddle.y + paddle.height) {
      const side = ball.x < paddle.x + paddle.width / 2 ? -1 : 1;
      ball.speedX = side * Math.abs(ball.speedX);
      if (side === -1) {
        ball.x = paddle.x - radius;
      } else {
        ball.x = paddle.x + paddle.width + radius;
      }
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (!block) continue;
    const closestX = Math.max(block.x, Math.min(ball.x, block.x + block.width));
    const closestY = Math.max(
      block.y,
      Math.min(ball.y, block.y + block.height),
    );
    const distanceX = ball.x - closestX;
    const distanceY = ball.y - closestY;

    if (distanceX * distanceX + distanceY * distanceY > radius * radius) {
      continue;
    }

    if (previousY + radius <= block.y) {
      ball.speedY = -Math.abs(ball.speedY);
      ball.y = block.y - radius;
    } else if (previousY - radius >= block.y + block.height) {
      ball.speedY = Math.abs(ball.speedY);
      ball.y = block.y + block.height + radius;
    } else if (previousX + radius <= block.x) {
      ball.speedX = -Math.abs(ball.speedX);
      ball.x = block.x - radius;
    } else if (previousX - radius >= block.x + block.width) {
      ball.speedX = Math.abs(ball.speedX);
      ball.x = block.x + block.width + radius;
    } else if (
      radius +
        block.width / 2 -
        Math.abs(ball.x - (block.x + block.width / 2)) <=
      radius +
        block.height / 2 -
        Math.abs(ball.y - (block.y + block.height / 2))
    ) {
      const fromLeft = ball.x < block.x + block.width / 2;
      ball.speedX = fromLeft ? -Math.abs(ball.speedX) : Math.abs(ball.speedX);
      ball.x = fromLeft ? block.x - radius : block.x + block.width + radius;
    } else {
      const fromAbove = ball.y < block.y + block.height / 2;
      ball.speedY = fromAbove ? -Math.abs(ball.speedY) : Math.abs(ball.speedY);
      ball.y = fromAbove ? block.y - radius : block.y + block.height + radius;
    }

    block.hp--;
    if (block.hp <= 0) {
      blocks.splice(i, 1);
    }
    break;
  }
  if (blocks.length === 0) {
  createBlocks();
}
};
const loop = () => {
  update();
  draw();
  requestAnimationFrame(loop);
};
startButton.addEventListener("click", () => {
  gamePanel.classList.remove("hidden");
  home.classList.add("hidden");
  game = true;
  createBlocks();
  loop();
});
