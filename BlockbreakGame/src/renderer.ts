import { BALL_RADIUS, PADDLE_BOTTOM_OFFSET } from "./config";
import type { GameState } from "./gameState";

const crackPatterns: Array<Array<Array<[number, number]>>> = [
  [
    [[0.46, 0], [0.38, 0.3], [0.54, 0.48], [0.4, 0.72], [0.43, 1]],
    [[0.52, 0.48], [0.7, 0.58], [0.76, 0.92]],
    [[0.39, 0.3], [0.2, 0.24]],
  ],
  [
    [[0.58, 0], [0.52, 0.25], [0.35, 0.43], [0.55, 0.66], [0.48, 1]],
    [[0.35, 0.43], [0.16, 0.54], [0.1, 0.82]],
    [[0.55, 0.66], [0.78, 0.72]],
  ],
  [
    [[0.34, 0], [0.44, 0.22], [0.28, 0.48], [0.48, 0.7], [0.4, 1]],
    [[0.44, 0.22], [0.67, 0.3], [0.84, 0.16]],
    [[0.48, 0.7], [0.72, 0.82], [0.8, 1]],
  ],
  [
    [[0.64, 0], [0.56, 0.28], [0.73, 0.46], [0.55, 0.7], [0.62, 1]],
    [[0.56, 0.28], [0.34, 0.38], [0.24, 0.18]],
    [[0.73, 0.46], [0.9, 0.54]],
    [[0.55, 0.7], [0.32, 0.84], [0.2, 1]],
  ],
];

export function drawGame(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: GameState,
): void {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(context, state);
  drawPaddle(context, state);

  for (const block of state.blocks) {
    drawBlock(context, block, state.boardRevealProgress);
  }
  if (state.cheatMode) {
    drawCheatBar(context, canvas);
  }
  drawParticles(context, state);

  if (state.phase === "ready") {
    drawStartHint(context, canvas);
  }
}

function drawCheatBar(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
): void {
  const paddleBottom = canvas.height - PADDLE_BOTTOM_OFFSET;
  const gameOverBoundary = canvas.height - BALL_RADIUS;
  const y = (paddleBottom + gameOverBoundary) / 2;
  const height = 4;

  context.save();
  context.shadowColor = "#a78bfa";
  context.shadowBlur = 10;
  const gradient = context.createLinearGradient(0, y, 0, y + height);
  gradient.addColorStop(0, "#ede9fe");
  gradient.addColorStop(0.45, "#8b5cf6");
  gradient.addColorStop(1, "#5b21b6");
  context.fillStyle = gradient;
  context.fillRect(0, y, canvas.width, height);
  context.shadowBlur = 0;
  context.fillStyle = "rgba(237, 233, 254, 0.9)";
  context.fillRect(0, y, canvas.width, 1);
  context.restore();
}

function drawParticles(
  context: CanvasRenderingContext2D,
  state: GameState,
): void {
  for (const particle of state.particles) {
    context.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    context.fillStyle = particle.color;
    context.fillRect(
      particle.x - particle.size / 2,
      particle.y - particle.size / 2,
      particle.size,
      particle.size,
    );
  }
  context.globalAlpha = 1;
}

function drawStartHint(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
): void {
  const width = 280;
  const height = 48;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  context.fillStyle = "rgba(15, 23, 42, 0.88)";
  context.fillRect(x, y, width, height);
  context.fillStyle = "#e0f2fe";
  context.font = "16px system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(
    "クリックかスペースでスタート",
    canvas.width / 2,
    canvas.height / 2,
  );
}

function drawBall(
  context: CanvasRenderingContext2D,
  state: GameState,
): void {
  const { ball } = state;
  const gradient = context.createRadialGradient(
    ball.x - BALL_RADIUS / 3,
    ball.y - BALL_RADIUS / 3,
    BALL_RADIUS / 6,
    ball.x,
    ball.y,
    BALL_RADIUS,
  );
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(1, "#bfdbfe");

  context.beginPath();
  context.fillStyle = gradient;
  context.shadowColor = "#93c5fd";
  context.shadowBlur = 2;
  context.arc(ball.x, ball.y, BALL_RADIUS, 0, 2 * Math.PI);
  context.fill();
  context.shadowBlur = 0;
}

function drawPaddle(
  context: CanvasRenderingContext2D,
  state: GameState,
): void {
  const { paddle } = state;
  const fillGradient = context.createLinearGradient(
    paddle.x,
    paddle.y,
    paddle.x,
    paddle.y + paddle.height,
  );
  fillGradient.addColorStop(0, "#4ade80");
  fillGradient.addColorStop(0.5, "#22c55e");
  fillGradient.addColorStop(1, "#16a34a");

  context.fillStyle = fillGradient;
  context.shadowColor = "#22c55e";
  context.shadowBlur = 2;
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  const borderGradient = context.createLinearGradient(
    paddle.x,
    paddle.y,
    paddle.x + paddle.width,
    paddle.y + paddle.height,
  );
  borderGradient.addColorStop(0, "#86efac");
  borderGradient.addColorStop(0.5, "#22c55e");
  borderGradient.addColorStop(1, "#15803d");
  context.strokeStyle = borderGradient;
  context.lineWidth = 2;
  context.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
  context.shadowBlur = 0;
}

function drawBlock(
  context: CanvasRenderingContext2D,
  block: GameState["blocks"][number],
  revealProgress: number,
): void {
  if (revealProgress <= 0) return;

  const easedProgress =
    revealProgress * revealProgress * (3 - 2 * revealProgress);
  const centerX = block.x + block.width / 2;
  const centerY = block.y + block.height / 2;
  context.save();
  context.globalAlpha *= easedProgress;
  context.translate(centerX, centerY);
  context.scale(easedProgress, easedProgress);
  context.translate(-centerX, -centerY);

  const isHard = block.type === "hard";
  const isUnbreakable = block.type === "unbreakable";
  context.fillStyle = isUnbreakable
    ? "#64748b"
    : isHard
      ? "#f59e0b"
      : "#38bdf8";
  context.fillRect(block.x, block.y, block.width, block.height);

  const borderGradient = context.createLinearGradient(
    block.x,
    block.y,
    block.x + block.width,
    block.y + block.height,
  );
  if (isUnbreakable) {
    borderGradient.addColorStop(0, "#e2e8f0");
    borderGradient.addColorStop(0.5, "#64748b");
    borderGradient.addColorStop(1, "#334155");
    context.shadowColor = "#94a3b8";
  } else if (isHard) {
    borderGradient.addColorStop(0, "#fff7ad");
    borderGradient.addColorStop(0.5, "#fb923c");
    borderGradient.addColorStop(1, "#b45309");
    context.shadowColor = "#f59e0b";
  } else {
    borderGradient.addColorStop(0, "#e0f2fe");
    borderGradient.addColorStop(0.5, "#38bdf8");
    borderGradient.addColorStop(1, "#1d4ed8");
    context.shadowColor = "#38bdf8";
  }

  context.strokeStyle = borderGradient;
  context.lineWidth = 2;
  context.shadowBlur = 2;
  context.strokeRect(block.x, block.y, block.width, block.height);
  context.shadowBlur = 0;

  if (isHard && block.hp === 1) {
    drawCracks(context, block);
  }
  context.restore();
}

function drawCracks(
  context: CanvasRenderingContext2D,
  block: GameState["blocks"][number],
): void {
  const pattern = crackPatterns[block.crackPattern] ?? crackPatterns[0];
  if (!pattern) return;

  context.beginPath();
  for (const crack of pattern) {
    const [first, ...rest] = crack;
    if (!first) continue;

    context.moveTo(
      block.x + first[0] * block.width,
      block.y + first[1] * block.height,
    );
    for (const [x, y] of rest) {
      context.lineTo(block.x + x * block.width, block.y + y * block.height);
    }
  }

  context.strokeStyle = "#000000";
  context.lineWidth = 3;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();
}
