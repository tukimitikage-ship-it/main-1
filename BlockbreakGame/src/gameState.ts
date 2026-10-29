import {
  BALL_SPEED,
  BALL_START_ANGLE,
  BOARD_PATTERNS,
  BLOCK_COLUMNS,
  BLOCK_GAP,
  BLOCK_HEIGHT,
  BLOCK_LEFT,
  BLOCK_ROWS,
  BLOCK_TOP,
  BLOCK_WIDTH,
  PADDLE_BOTTOM_OFFSET,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_WIDTH,
} from "./config";
export type GamePhase = "home" | "ready" | "playing" | "paused" | "result";

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Block = Rectangle & {
  type: "normal" | "hard" | "unbreakable";
  hp: number;
  crackPattern: number;
};

export type Particle = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
};

export type GameState = {
  ball: {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
  };
  boardRevealProgress: number;
  paddle: Rectangle & { speed: number };
  blocks: Block[];
  particles: Particle[];
  keys: Record<string, boolean>;
  phase: GamePhase;
  score: number;
  cheatMode: boolean;
  mouseControlEnabled: boolean;
  speedMultiplier: number;
};

export function createGameState(canvas: HTMLCanvasElement): GameState {
  const state: GameState = {
    ball: { x: 0, y: 0, speedX: 0, speedY: 0 },
    boardRevealProgress: 1,
    paddle: {
      x: 0,
      y: 0,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      speed: PADDLE_SPEED,
    },
    blocks: [],
    particles: [],
    keys: {},
    phase: "home",
    score: 0,
    cheatMode: false,
    mouseControlEnabled: false,
    speedMultiplier: 1,
  };

  resetGameState(state, canvas);
  return state;
}

export function resetGameState(
  state: GameState,
  canvas: HTMLCanvasElement,
  speedMultiplier = 1,
  cheatMode = false,
): void {
  state.score = 0;
  state.cheatMode = cheatMode;
  state.boardRevealProgress = 1;
  state.mouseControlEnabled = false;
  state.speedMultiplier = speedMultiplier;
  state.ball.x = canvas.width / 2;
  state.ball.y = canvas.height - 70;
  state.ball.speedX =
    BALL_SPEED * speedMultiplier * Math.sin(BALL_START_ANGLE);
  state.ball.speedY =
    -BALL_SPEED * speedMultiplier * Math.cos(BALL_START_ANGLE);

  state.paddle.x = (canvas.width - state.paddle.width) / 2;
  state.paddle.y =
    canvas.height - state.paddle.height - PADDLE_BOTTOM_OFFSET;

  for (const key of Object.keys(state.keys)) {
    delete state.keys[key];
  }

  state.blocks.length = 0;
  state.blocks.push(...createBlocks());
  state.particles.length = 0;
}

export function createBlocks(): Block[] {
  const blocks: Block[] = [];
  const pattern =
    BOARD_PATTERNS[Math.floor(Math.random() * BOARD_PATTERNS.length)]!;

  for (let row = 0; row < BLOCK_ROWS; row++) {
    for (let column = 0; column < BLOCK_COLUMNS; column++) {
      const tile = pattern[row]?.[column];
      if (!tile || tile === "0") continue;

      const type =
        tile === "2" ? "hard" : tile === "3" ? "unbreakable" : "normal";
      blocks.push({
        x: BLOCK_LEFT + column * (BLOCK_WIDTH + BLOCK_GAP),
        y: BLOCK_TOP + row * (BLOCK_HEIGHT + BLOCK_GAP),
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        type,
        hp: type === "hard" ? 2 : type === "normal" ? 1 : Infinity,
        crackPattern: Math.floor(Math.random() * 4),
      });
    }
  }

  return blocks;
}
