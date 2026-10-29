import {
  BALL_RADIUS,
  BALL_SPEED,
  MAX_BOUNCE_ANGLE,
} from "./config";
import {
  createBlocks,
  resetGameState,
  type GameState,
} from "./gameState";
import { drawGame } from "./renderer";

type Position = { x: number; y: number };

export function startGame(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  home: HTMLElement,
  state: GameState,
): void {
  if (state.phase !== "home") return;

  resetGameState(state, canvas);
  canvas.classList.remove("hidden");
  home.classList.add("hidden");
  state.phase = "ready";
  requestAnimationFrame(() => runFrame(canvas, context, home, state));
}

export function resumeGame(state: GameState): void {
  if (state.phase === "paused") {
    state.phase = "playing";
  }
}

export function returnToHome(
  canvas: HTMLCanvasElement,
  home: HTMLElement,
  state: GameState,
): void {
  state.phase = "home";
  canvas.classList.add("hidden");
  home.classList.remove("hidden");
}

function runFrame(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  home: HTMLElement,
  state: GameState,
): void {
  if (state.phase === "home") return;

  const gameOver =
    state.phase === "playing" && updateGame(canvas, state);
  if (gameOver) {
    returnToHome(canvas, home, state);
    return;
  }

  drawGame(context, canvas, state);
  requestAnimationFrame(() => runFrame(canvas, context, home, state));
}

function updateGame(canvas: HTMLCanvasElement, state: GameState): boolean {
  const previousPosition = { x: state.ball.x, y: state.ball.y };
  state.ball.x += state.ball.speedX;
  state.ball.y += state.ball.speedY;

  if (!bounceOffWalls(canvas, state)) return true;
  movePaddle(canvas, state);
  bounceOffPaddle(state);
  hitBlock(state, previousPosition);

  if (state.blocks.length === 0) {
    state.blocks.push(...createBlocks());
  }

  return false;
}

function bounceOffWalls(canvas: HTMLCanvasElement, state: GameState): boolean {
  const { ball } = state;

  if (ball.x > canvas.width - BALL_RADIUS) {
    ball.speedX *= -1;
    ball.x = canvas.width - BALL_RADIUS;
  }
  if (ball.x < BALL_RADIUS) {
    ball.speedX *= -1;
    ball.x = BALL_RADIUS;
  }
  if (ball.y > canvas.height - BALL_RADIUS) {
    state.phase = "home";
    return false;
  }
  if (ball.y < BALL_RADIUS) {
    ball.speedY *= -1;
    ball.y = BALL_RADIUS;
  }

  return true;
}

function movePaddle(canvas: HTMLCanvasElement, state: GameState): void {
  const { paddle, keys } = state;
  if (keys.ArrowLeft || keys.KeyA) paddle.x -= paddle.speed;
  if (keys.ArrowRight || keys.KeyD) paddle.x += paddle.speed;
  paddle.x = Math.max(0, Math.min(paddle.x, canvas.width - paddle.width));
}

function bounceOffPaddle(state: GameState): void {
  const { ball, paddle } = state;
  const overlapsX =
    ball.x + BALL_RADIUS >= paddle.x &&
    ball.x - BALL_RADIUS <= paddle.x + paddle.width;
  const overlapsY =
    ball.y + BALL_RADIUS >= paddle.y &&
    ball.y - BALL_RADIUS <= paddle.y + paddle.height;
  if (!overlapsX || !overlapsY) return;

  const cameFromAbove =
    ball.speedY > 0 && ball.y - ball.speedY + BALL_RADIUS <= paddle.y;

  if (cameFromAbove) {
    const hitPosition =
      (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    const limitedHitPosition = Math.max(-1, Math.min(1, hitPosition));
    const bounceAngle = limitedHitPosition * MAX_BOUNCE_ANGLE;
    ball.speedX = BALL_SPEED * Math.sin(bounceAngle);
    ball.speedY = -BALL_SPEED * Math.cos(bounceAngle);
    ball.y = paddle.y - BALL_RADIUS;
    return;
  }

  if (ball.y <= paddle.y + paddle.height) {
    const hitFromLeft = ball.x < paddle.x + paddle.width / 2;
    ball.speedX = hitFromLeft
      ? -Math.abs(ball.speedX)
      : Math.abs(ball.speedX);
    ball.x = hitFromLeft
      ? paddle.x - BALL_RADIUS
      : paddle.x + paddle.width + BALL_RADIUS;
  }
}

function hitBlock(state: GameState, previousPosition: Position): void {
  const { ball, blocks } = state;

  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (!block) continue;

    const nearestX = Math.max(block.x, Math.min(ball.x, block.x + block.width));
    const nearestY = Math.max(block.y, Math.min(ball.y, block.y + block.height));
    const distanceX = ball.x - nearestX;
    const distanceY = ball.y - nearestY;
    if (distanceX * distanceX + distanceY * distanceY > BALL_RADIUS ** 2) {
      continue;
    }

    bounceOffBlock(ball, block, previousPosition);
    block.hp--;
    if (block.hp <= 0) blocks.splice(index, 1);
    break;
  }
}

function bounceOffBlock(
  ball: GameState["ball"],
  block: GameState["blocks"][number],
  previousPosition: Position,
): void {
  if (previousPosition.y + BALL_RADIUS <= block.y) {
    ball.speedY = -Math.abs(ball.speedY);
    ball.y = block.y - BALL_RADIUS;
  } else if (previousPosition.y - BALL_RADIUS >= block.y + block.height) {
    ball.speedY = Math.abs(ball.speedY);
    ball.y = block.y + block.height + BALL_RADIUS;
  } else if (previousPosition.x + BALL_RADIUS <= block.x) {
    ball.speedX = -Math.abs(ball.speedX);
    ball.x = block.x - BALL_RADIUS;
  } else if (previousPosition.x - BALL_RADIUS >= block.x + block.width) {
    ball.speedX = Math.abs(ball.speedX);
    ball.x = block.x + block.width + BALL_RADIUS;
  } else if (
    block.width / 2 - Math.abs(ball.x - (block.x + block.width / 2)) <=
    block.height / 2 - Math.abs(ball.y - (block.y + block.height / 2))
  ) {
    const hitFromLeft = ball.x < block.x + block.width / 2;
    ball.speedX = hitFromLeft
      ? -Math.abs(ball.speedX)
      : Math.abs(ball.speedX);
    ball.x = hitFromLeft
      ? block.x - BALL_RADIUS
      : block.x + block.width + BALL_RADIUS;
  } else {
    const hitFromAbove = ball.y < block.y + block.height / 2;
    ball.speedY = hitFromAbove
      ? -Math.abs(ball.speedY)
      : Math.abs(ball.speedY);
    ball.y = hitFromAbove
      ? block.y - BALL_RADIUS
      : block.y + block.height + BALL_RADIUS;
  }
}
