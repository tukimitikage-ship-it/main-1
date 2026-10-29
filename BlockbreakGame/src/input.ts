import type { GameState } from "./gameState";

export function setupInput(
  canvas: HTMLCanvasElement,
  state: GameState,
): void {
  window.addEventListener("keydown", (event) => {
    state.keys[event.code] = true;
  });

  window.addEventListener("keyup", (event) => {
    state.keys[event.code] = false;
  });

  window.addEventListener("mousemove", (event) => {
    if (!state.isRunning) return;

    const bounds = canvas.getBoundingClientRect();
    const mouseX =
      (event.clientX - bounds.left) * (canvas.width / bounds.width);
    state.paddle.x = mouseX - state.paddle.width / 2;
  });
}
