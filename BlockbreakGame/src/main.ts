import { startGame } from "./game";
import { createGameState } from "./gameState";
import { setupInput } from "./input";

const canvas = document.querySelector<HTMLCanvasElement>(".game");
const home = document.querySelector<HTMLElement>(".home");
const startButton = document.querySelector<HTMLButtonElement>(".start");

if (!canvas || !home || !startButton) {
  throw new Error("ゲーム画面に必要なHTML要素が見つかりません。");
}

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("Canvas 2D contextを取得できません。");
}

const state = createGameState(canvas);
setupInput(canvas, state);

startButton.addEventListener("click", () => {
  startGame(canvas, context, home, state);
});
