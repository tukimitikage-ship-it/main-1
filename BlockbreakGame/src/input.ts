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
      clearKeys(state);
    }
  });

  window.addEventListener("keyup", (event) => {
    state.keys[event.code] = false;
  });

  window.addEventListener("mousemove", (event) => {
    if (state.phase !== "playing") return;

    const bounds = canvas.getBoundingClientRect();
    const mouseX =
      (event.clientX - bounds.left) * (canvas.width / bounds.width);
    state.paddle.x = mouseX - state.paddle.width / 2;
  });

  canvas.addEventListener("click", () => {
    if (state.phase === "ready") {
      state.phase = "playing";
    }
  });

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (state.phase === "playing") {
      state.phase = "paused";
      clearKeys(state);
    }
  });
}

function clearKeys(state: GameState): void {
  for (const key of Object.keys(state.keys)) {
    delete state.keys[key];
  }
}
