import { resumeGame, returnToHome, startGame } from "./game";
import { enableGameAudio } from "./audio";
import { createGameState } from "./gameState";
import { loadHighScore, saveHighScore } from "./highScore";
import { setupInput } from "./input";
import {
  isTextKey,
  languageName,
  localeFor,
  translate,
} from "./localization";
import {
  isLanguage,
  loadSettings,
  saveSettings,
  type GameSettings,
} from "./settings";

const canvas = document.querySelector<HTMLCanvasElement>(".game");
const gameArea = document.querySelector<HTMLElement>(".game-area");
const pauseHint = document.querySelector<HTMLElement>(".pause-hint");
const home = document.querySelector<HTMLElement>(".home");
const startButton = document.querySelector<HTMLButtonElement>(".start");
const pauseMenu = document.querySelector<HTMLElement>(".pause-menu");
const resumeButton = document.querySelector<HTMLButtonElement>(".resume");
const pauseHomeButton =
  document.querySelector<HTMLButtonElement>(".pause-home");
const resultPanel = document.querySelector<HTMLElement>(".result");
const resultScore = document.querySelector<HTMLElement>(".result-score");
const currentScore = document.querySelector<HTMLElement>(".current-score");
const normalHighScoreDisplay =
  document.querySelector<HTMLElement>(".normal-high-score");
const doubleHighScoreDisplay =
  document.querySelector<HTMLElement>(".double-high-score");
const resultHomeButton =
  document.querySelector<HTMLButtonElement>(".result-home");
const configButton = document.querySelector<HTMLButtonElement>(".config");
const settingsPanel = document.querySelector<HTMLElement>(".settings");
const languageSelect = document.querySelector<HTMLSelectElement>(".language-select");
const doubleSpeedInput =
  document.querySelector<HTMLInputElement>(".double-speed");
const cheatModeInput =
  document.querySelector<HTMLInputElement>(".cheat-mode");
const settingsSaveButton =
  document.querySelector<HTMLButtonElement>(".settings-save");
const settingsBackButton =
  document.querySelector<HTMLButtonElement>(".settings-back");
const homeLanguage = document.querySelector<HTMLElement>(".home-language");
const homeSpeed = document.querySelector<HTMLElement>(".home-speed");
const gameLanguage = document.querySelector<HTMLElement>(".game-language");
const gameSpeed = document.querySelector<HTMLElement>(".game-speed");

if (
  !canvas ||
  !gameArea ||
  !pauseHint ||
  !home ||
  !startButton ||
  !pauseMenu ||
  !resumeButton ||
  !pauseHomeButton ||
  !resultPanel ||
  !resultScore ||
  !currentScore ||
  !normalHighScoreDisplay ||
  !doubleHighScoreDisplay ||
  !resultHomeButton ||
  !configButton ||
  !settingsPanel ||
  !languageSelect ||
  !doubleSpeedInput ||
  !cheatModeInput ||
  !settingsSaveButton ||
  !settingsBackButton ||
  !homeLanguage ||
  !homeSpeed ||
  !gameLanguage ||
  !gameSpeed
) {
  throw new Error("ゲーム画面に必要なHTML要素が見つかりません。");
}

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("Canvas 2D contextを取得できません。");
}

const state = createGameState(canvas);
let settings: GameSettings = loadSettings();
let normalHighScore = loadHighScore(false);
let doubleHighScore = loadHighScore(true);
languageSelect.value = settings.language;
doubleSpeedInput.checked = settings.doubleSpeed;
cheatModeInput.checked = settings.cheatMode;
applyLanguage(settings.language, languageSelect);
updateHighScoreDisplays(
  settings.language,
  normalHighScore,
  doubleHighScore,
  normalHighScoreDisplay,
  doubleHighScoreDisplay,
);
updateModeStatus(
  settings,
  homeLanguage,
  homeSpeed,
  gameLanguage,
  gameSpeed,
);
setupInput(canvas, state);

configButton.addEventListener("click", () => {
  languageSelect.value = settings.language;
  doubleSpeedInput.checked = settings.doubleSpeed;
  cheatModeInput.checked = settings.cheatMode;
  home.classList.add("hidden");
  settingsPanel.classList.remove("hidden");
});

settingsSaveButton.addEventListener("click", () => {
  if (!isLanguage(languageSelect.value)) {
    throw new Error("選択された言語が正しくありません。");
  }

  settings = {
    language: languageSelect.value,
    doubleSpeed: doubleSpeedInput.checked,
    cheatMode: cheatModeInput.checked,
  };
  saveSettings(settings);
  applyLanguage(settings.language, languageSelect);
  updateHighScoreDisplays(
    settings.language,
    normalHighScore,
    doubleHighScore,
    normalHighScoreDisplay,
    doubleHighScoreDisplay,
  );
  updateModeStatus(
    settings,
    homeLanguage,
    homeSpeed,
    gameLanguage,
    gameSpeed,
  );
  settingsPanel.classList.add("hidden");
  home.classList.remove("hidden");
});

settingsBackButton.addEventListener("click", () => {
  settingsPanel.classList.add("hidden");
  home.classList.remove("hidden");
});

startButton.addEventListener("click", () => {
  enableGameAudio();
  startGame(
    canvas,
    gameArea,
    pauseHint,
    context,
    home,
    pauseMenu,
    resultPanel,
    resultScore,
    currentScore,
    (score) => {
      if (settings.cheatMode) return;
      const currentHighScore = settings.doubleSpeed
        ? doubleHighScore
        : normalHighScore;
      if (score <= currentHighScore) return;

      saveHighScore(score, settings.doubleSpeed);
      if (settings.doubleSpeed) {
        doubleHighScore = score;
      } else {
        normalHighScore = score;
      }
      updateHighScoreDisplays(
        settings.language,
        normalHighScore,
        doubleHighScore,
        normalHighScoreDisplay,
        doubleHighScoreDisplay,
      );
    },
    settings.doubleSpeed ? 2 : 1,
    settings.cheatMode,
    state,
  );
});

resumeButton.addEventListener("click", () => {
  resumeGame(state);
});

pauseHomeButton.addEventListener("click", () => {
  returnToHome(gameArea, pauseHint, home, pauseMenu, resultPanel, state);
});

resultHomeButton.addEventListener("click", () => {
  returnToHome(gameArea, pauseHint, home, pauseMenu, resultPanel, state);
});

function applyLanguage(
  language: GameSettings["language"],
  selectElement: HTMLSelectElement,
): void {
  document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  document.title = translate(language, "gameTitle");
  selectElement.setAttribute("aria-label", translate(language, "language"));
  for (const element of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
    const key = element.dataset.i18n;
    if (key && isTextKey(key)) {
      element.textContent = translate(language, key);
    }
  }
}

function updateModeStatus(
  currentSettings: GameSettings,
  homeLanguageDisplay: HTMLElement,
  homeSpeedDisplay: HTMLElement,
  gameLanguageDisplay: HTMLElement,
  gameSpeedDisplay: HTMLElement,
): void {
  const selectedLanguage = languageName(currentSettings.language);
  const selectedSpeed = translate(
    currentSettings.language,
    currentSettings.doubleSpeed ? "doubleSpeedStatus" : "normalSpeed",
  );
  homeLanguageDisplay.textContent = selectedLanguage;
  gameLanguageDisplay.textContent = selectedLanguage;
  homeSpeedDisplay.textContent = selectedSpeed;
  gameSpeedDisplay.textContent = selectedSpeed;
}

function updateHighScoreDisplays(
  language: GameSettings["language"],
  normalScore: number,
  doubleScore: number,
  normalDisplay: HTMLElement,
  doubleDisplay: HTMLElement,
): void {
  const formatter = new Intl.NumberFormat(localeFor(language));
  normalDisplay.textContent = formatter.format(normalScore);
  doubleDisplay.textContent = formatter.format(doubleScore);
}
