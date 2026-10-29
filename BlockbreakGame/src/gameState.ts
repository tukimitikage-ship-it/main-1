import {
  BALL_SPEED,
  BALL_START_ANGLE,
  BLOCK_GAP,
  BLOCK_HEIGHT,
  BLOCK_LEFT,
  BLOCK_TOP,
  BLOCK_WIDTH,
  LEVEL,
  PADDLE_BOTTOM_OFFSET,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_WIDTH,
} from "./config";

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Block = Rectangle & {
  type: "normal" | "hard";
  hp: number;
};

export type GameState = {
  ball: {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
  };
  paddle: Rectangle & { speed: number };
  blocks: Block[];
  keys: Record<string, boolean>;
  isRunning: boolean;
};

export function createGameState(canvas: HTMLCanvasElement): GameState {
  const state: GameState = {
    ball: { x: 0, y: 0, speedX: 0, speedY: 0 },
    paddle: {
      x: 0,
      y: 0,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      speed: PADDLE_SPEED,
    },
    blocks: [],
    keys: {},
    isRunning: false,
  };

  resetGameState(state, canvas);
  return state;
}

export function resetGameState(
  state: GameState,
  canvas: HTMLCanvasElement,
): void {
  state.ball.x = canvas.width / 2;
  state.ball.y = canvas.height - 70;
  state.ball.speedX = BALL_SPEED * Math.sin(BALL_START_ANGLE);
  state.ball.speedY = -BALL_SPEED * Math.cos(BALL_START_ANGLE);

  state.paddle.x = (canvas.width - state.paddle.width) / 2;
  state.paddle.y =
    canvas.height - state.paddle.height - PADDLE_BOTTOM_OFFSET;

  for (const key of Object.keys(state.keys)) {
    delete state.keys[key];
  }

  state.blocks.length = 0;
  state.blocks.push(...createBlocks());
}

export function createBlocks(): Block[] {
  const blocks: Block[] = [];

  for (const [row, cells] of LEVEL.entries()) {
    for (const [column, cell] of cells.entries()) {
      if (cell !== 1) continue;

      const isHard = row === 0;
      blocks.push({
        x: BLOCK_LEFT + column * (BLOCK_WIDTH + BLOCK_GAP),
        y: BLOCK_TOP + row * (BLOCK_HEIGHT + BLOCK_GAP),
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        type: isHard ? "hard" : "normal",
        hp: isHard ? 2 : 1,
      });
    }
  }

  return blocks;
}
