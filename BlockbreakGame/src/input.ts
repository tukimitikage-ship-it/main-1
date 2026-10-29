import type { GameState } from "./gameState";

export function setupInput(
  canvas: HTMLCanvasElement,
  state: GameState,
): void {
  window.addEventListener("keydown", (event) => {
    state.keys[event.code] = true;

    if (event.repeat) return;

    if (state.phase === "ready" && event.code === "Space") {
      event.preventDefault();
      state.phase = "playing";
    } else if (
      state.phase === "playing" &&
      (event.code === "KeyW" || event.code === "ArrowUp")
    ) {
      event.preventDefault();
      state.phase = "paused";
      state.mouseControlEnabled = false;
      clearKeys(state);
    }
  });

  window.addEventListener("keyup", (event) => {
    state.keys[event.code] = false;
  });

  window.addEventListener("mousemove", (event) => {
    if (state.phase !== "playing" || !state.mouseControlEnabled) return;

    movePaddleToPointer(canvas, state, event.clientX);
  });

  canvas.addEventListener("click", (event) => {
    if (state.phase === "ready") {
      state.phase = "playing";
    }

    if (state.phase === "playing" && !state.mouseControlEnabled) {
      state.mouseControlEnabled = true;
      movePaddleToPointer(canvas, state, event.clientX);
    }
  });

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (state.phase === "playing") {
      state.phase = "paused";
      state.mouseControlEnabled = false;
      clearKeys(state);
    }
  });
}

function movePaddleToPointer(
  canvas: HTMLCanvasElement,
  state: GameState,
  clientX: number,
): void {
  const bounds = canvas.getBoundingClientRect();
  const mouseX = (clientX - bounds.left) * (canvas.width / bounds.width);
  state.paddle.x = Math.max(
    -state.paddle.width / 2,
    Math.min(mouseX - state.paddle.width / 2, canvas.width - state.paddle.width / 2),
  );
}

function clearKeys(state: GameState): void {
  for (const key of Object.keys(state.keys)) {
    delete state.keys[key];
  }
}
