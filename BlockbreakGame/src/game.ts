import {
  BALL_RADIUS,
  BALL_SPEED,
  HARD_BLOCK_SCORE,
  MAX_BOUNCE_ANGLE,
  NORMAL_BLOCK_SCORE,
} from "./config";
import {
  playBlockSound,
  playLaserSound,
  playPaddleSound,
} from "./audio";
import {
  createBlocks,
  resetGameState,
  type GameState,
} from "./gameState";
import { drawGame } from "./renderer";

type Position = { x: number; y: number };

export function startGame(
  canvas: HTMLCanvasElement,
  gameArea: HTMLElement,
  pauseHint: HTMLElement,
  context: CanvasRenderingContext2D,
  home: HTMLElement,
  pauseMenu: HTMLElement,
  resultPanel: HTMLElement,
  resultScore: HTMLElement,
  currentScore: HTMLElement,
  onGameOver: (score: number) => void,
  speedMultiplier: number,
  cheatMode: boolean,
  state: GameState,
): void {
  if (state.phase !== "home") return;

  resetGameState(state, canvas, speedMultiplier, cheatMode);
  gameArea.classList.remove("hidden");
  pauseHint.classList.remove("visible");
  currentScore.textContent = state.score.toLocaleString();
  home.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  resultPanel.classList.add("hidden");
  state.phase = "ready";
  requestAnimationFrame((timestamp) => {
    runFrame(
      timestamp,
      null,
      canvas,
      gameArea,
      pauseHint,
      context,
      pauseMenu,
      resultPanel,
      resultScore,
      currentScore,
      onGameOver,
      state,
    );
  });
}

export function resumeGame(state: GameState): void {
  if (state.phase === "paused") {
    state.phase = "playing";
    state.mouseControlEnabled = true;
  }
}

export function returnToHome(
  gameArea: HTMLElement,
  pauseHint: HTMLElement,
  home: HTMLElement,
  pauseMenu: HTMLElement,
  resultPanel: HTMLElement,
  state: GameState,
): void {
  state.phase = "home";
  state.mouseControlEnabled = false;
  state.particles.length = 0;
  gameArea.classList.add("hidden");
  pauseHint.classList.remove("visible");
  pauseMenu.classList.add("hidden");
  resultPanel.classList.add("hidden");
  home.classList.remove("hidden");
}

function runFrame(
  timestamp: number,
  previousTimestamp: number | null,
  canvas: HTMLCanvasElement,
  gameArea: HTMLElement,
  pauseHint: HTMLElement,
  context: CanvasRenderingContext2D,
  pauseMenu: HTMLElement,
  resultPanel: HTMLElement,
  resultScore: HTMLElement,
  currentScore: HTMLElement,
  onGameOver: (score: number) => void,
  state: GameState,
): void {
  if (state.phase === "home") return;
  if (state.phase === "result") return;

  const frameScale =
    previousTimestamp === null
      ? 1
      : Math.min((timestamp - previousTimestamp) / (1000 / 60), 2);

  pauseMenu.classList.toggle("hidden", state.phase !== "paused");
  pauseHint.classList.toggle(
    "visible",
    state.phase === "ready" || state.phase === "playing",
  );

  const gameOver =
    state.phase === "playing" && updateGame(canvas, state, frameScale);
  if (state.phase === "playing") {
    updateParticles(state, frameScale);
  }
  currentScore.textContent = state.score.toLocaleString();
  if (gameOver) {
    gameArea.classList.add("hidden");
    pauseHint.classList.remove("visible");
    resultPanel.classList.remove("hidden");
    resultScore.textContent = state.score.toLocaleString();
    onGameOver(state.score);
    return;
  }

  drawGame(context, canvas, state);
  requestAnimationFrame((nextTimestamp) => {
    runFrame(
      nextTimestamp,
      timestamp,
      canvas,
      gameArea,
      pauseHint,
      context,
      pauseMenu,
      resultPanel,
      resultScore,
      currentScore,
      onGameOver,
      state,
    );
  });
}

function updateGame(
  canvas: HTMLCanvasElement,
  state: GameState,
  frameScale: number,
): boolean {
  const previousPosition = { x: state.ball.x, y: state.ball.y };
  state.ball.x += state.ball.speedX * frameScale;
  state.ball.y += state.ball.speedY * frameScale;

  if (state.cheatMode) bounceOffCheatWall(canvas, state, previousPosition);
  if (!bounceOffWalls(canvas, state)) return true;
  movePaddle(canvas, state, frameScale);
  bounceOffPaddle(state, previousPosition);
  hitBlock(state, previousPosition);

  if (state.boardRevealProgress < 1) {
    state.boardRevealProgress = Math.min(
      1,
      state.boardRevealProgress + frameScale / 36,
    );
  }

  const allTargetsCleared = !state.blocks.some(
    (block) => block.type !== "unbreakable",
  );
  const ballMovingUp = state.ball.speedY < 0;
  if (allTargetsCleared && state.blocks.length > 0 && ballMovingUp) {
    clearUnbreakableBlocks(state);
  }

  const ballReachedLowerBoard =
    state.ball.speedY > 0 && state.ball.y >= canvas.height * 0.65;

  if (allTargetsCleared && ballReachedLowerBoard) {
    state.blocks.length = 0;
    state.blocks.push(...createBlocks());
    state.boardRevealProgress = 0;
  }

  return false;
}

function clearUnbreakableBlocks(state: GameState): void {
  for (let index = state.blocks.length - 1; index >= 0; index--) {
    const block = state.blocks[index];
    if (block?.type !== "unbreakable") continue;

    createBlockParticles(state, block);
    state.blocks.splice(index, 1);
  }
}

function bounceOffCheatWall(
  canvas: HTMLCanvasElement,
  state: GameState,
  previousPosition: Position,
): void {
  const { ball } = state;
  const paddleBottom = state.paddle.y + state.paddle.height;
  const gameOverBoundary = canvas.height - BALL_RADIUS;
  const wallSurfaceY = (paddleBottom + gameOverBoundary) / 2;
  const wallY = wallSurfaceY - BALL_RADIUS;
  if (
    ball.speedY > 0 &&
    previousPosition.y <= wallY &&
    ball.y >= wallY
  ) {
    ball.y = wallY;
    ball.speedY = -Math.abs(ball.speedY);
    nudgeBallTrajectory(ball);
    playLaserSound();
  }
}

function bounceOffWalls(canvas: HTMLCanvasElement, state: GameState): boolean {
  const { ball } = state;

  if (ball.x > canvas.width - BALL_RADIUS) {
    ball.speedX *= -1;
    ball.x = canvas.width - BALL_RADIUS;
    nudgeBallTrajectory(ball);
  }
  if (ball.x < BALL_RADIUS) {
    ball.speedX *= -1;
    ball.x = BALL_RADIUS;
    nudgeBallTrajectory(ball);
  }
  if (ball.y > canvas.height - BALL_RADIUS) {
    if (state.cheatMode) {
      ball.y = canvas.height - BALL_RADIUS;
      ball.speedY = -Math.abs(ball.speedY);
      nudgeBallTrajectory(ball);
      return true;
    }
    state.phase = "result";
    return false;
  }
  if (ball.y < BALL_RADIUS) {
    ball.speedY *= -1;
    ball.y = BALL_RADIUS;
    nudgeBallTrajectory(ball);
  }

  return true;
}

function movePaddle(
  canvas: HTMLCanvasElement,
  state: GameState,
  frameScale: number,
): void {
  const { paddle, keys } = state;
  if (keys.ArrowLeft || keys.KeyA) {
    paddle.x -= paddle.speed * frameScale * state.speedMultiplier;
  }
  if (keys.ArrowRight || keys.KeyD) {
    paddle.x += paddle.speed * frameScale * state.speedMultiplier;
  }
  paddle.x = Math.max(
    -paddle.width / 2,
    Math.min(paddle.x, canvas.width - paddle.width / 2),
  );
}

function bounceOffPaddle(
  state: GameState,
  previousPosition: Position,
): void {
  const { ball, paddle } = state;
  const overlapsX =
    ball.x + BALL_RADIUS >= paddle.x &&
    ball.x - BALL_RADIUS <= paddle.x + paddle.width;
  const overlapsY =
    ball.y + BALL_RADIUS >= paddle.y &&
    ball.y - BALL_RADIUS <= paddle.y + paddle.height;
  if (!overlapsX || !overlapsY) return;
  playPaddleSound();

  const cameFromAbove =
    ball.speedY > 0 &&
    previousPosition.y + BALL_RADIUS <= paddle.y;
  const cameFromBelow =
    ball.speedY < 0 &&
    previousPosition.y - BALL_RADIUS >= paddle.y + paddle.height;

  if (cameFromAbove) {
    const hitPosition =
      (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    const limitedHitPosition = Math.max(-1, Math.min(1, hitPosition));
    const bounceAngle = limitedHitPosition * MAX_BOUNCE_ANGLE;
    ball.speedX = BALL_SPEED * state.speedMultiplier * Math.sin(bounceAngle);
    ball.speedY = -BALL_SPEED * state.speedMultiplier * Math.cos(bounceAngle);
    ball.y = paddle.y - BALL_RADIUS;
    nudgeBallTrajectory(ball);
    return;
  }

  if (cameFromBelow) {
    ball.speedY = Math.abs(ball.speedY);
    ball.y = paddle.y + paddle.height + BALL_RADIUS;
    nudgeBallTrajectory(ball);
    return;
  }

  const hitFromLeft = previousPosition.x < paddle.x;
  ball.speedX = hitFromLeft
    ? -Math.abs(ball.speedX)
    : Math.abs(ball.speedX);
  ball.x = hitFromLeft
    ? paddle.x - BALL_RADIUS
    : paddle.x + paddle.width + BALL_RADIUS;
  nudgeBallTrajectory(ball);
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
    nudgeBallTrajectory(ball);
    if (block.type === "unbreakable") {
      playBlockSound(false, false);
    } else {
      block.hp--;
      const isBreaking = block.hp <= 0;
      playBlockSound(block.type === "hard", isBreaking);
      if (isBreaking) {
        state.score +=
          block.type === "hard" ? HARD_BLOCK_SCORE : NORMAL_BLOCK_SCORE;
        createBlockParticles(state, block);
        blocks.splice(index, 1);
      }
    }
    break;
  }
}

function nudgeBallTrajectory(ball: GameState["ball"]): void {
  const speed = Math.hypot(ball.speedX, ball.speedY);
  if (speed === 0) return;

  const angle = Math.atan2(ball.speedY, ball.speedX);
  const tinyAngleOffset = Math.random() < 0.5 ? -0.012 : 0.012;
  ball.speedX = Math.cos(angle + tinyAngleOffset) * speed;
  ball.speedY = Math.sin(angle + tinyAngleOffset) * speed;
}

function createBlockParticles(
  state: GameState,
  block: GameState["blocks"][number],
): void {
  const color =
    block.type === "unbreakable"
      ? "#94a3b8"
      : block.type === "hard"
        ? "#fb923c"
        : "#7dd3fc";
  const centerX = block.x + block.width / 2;
  const centerY = block.y + block.height / 2;
  const particleCount = block.type === "unbreakable" ? 16 : 10;

  for (let index = 0; index < particleCount; index++) {
    const angle =
      (Math.PI * 2 * index) / particleCount + Math.random() * 0.3;
    const speed = 1 + Math.random() * (block.type === "unbreakable" ? 3 : 2);
    const life = 0.35 + Math.random() * 0.2;
    state.particles.push({
      x: centerX,
      y: centerY,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed - 1,
      size: 2 + Math.random() * 3,
      color,
      life,
      maxLife: life,
    });
  }
}

function updateParticles(state: GameState, frameScale: number): void {
  for (let index = state.particles.length - 1; index >= 0; index--) {
    const particle = state.particles[index];
    if (!particle) continue;

    particle.x += particle.speedX * frameScale;
    particle.y += particle.speedY * frameScale;
    particle.speedY += 0.08 * frameScale;
    particle.life -= frameScale / 60;

    if (particle.life <= 0) {
      state.particles.splice(index, 1);
    }
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
