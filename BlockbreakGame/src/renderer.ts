import { BALL_RADIUS } from "./config";
import type { GameState } from "./gameState";

export function drawGame(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: GameState,
): void {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(context, state);
  drawPaddle(context, state);

  for (const block of state.blocks) {
    drawBlock(context, block);
  }
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
): void {
  const isHard = block.type === "hard";
  context.fillStyle = isHard ? "#f59e0b" : "#38bdf8";
  context.fillRect(block.x, block.y, block.width, block.height);

  const borderGradient = context.createLinearGradient(
    block.x,
    block.y,
    block.x + block.width,
    block.y + block.height,
  );
  if (isHard) {
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
}
