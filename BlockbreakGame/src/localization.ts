import type { Language } from "./settings";

export type TextKey =
  | "gameTitle"
  | "highScore"
  | "start"
  | "settings"
  | "currentScore"
  | "pauseHint"
  | "pauseTitle"
  | "resume"
  | "home"
  | "resultTitle"
  | "resultScore"
  | "settingsTitle"
  | "language"
  | "speedMode"
  | "cheatMode"
  | "nextGameNote"
  | "save"
  | "back"
  | "languageStatus"
  | "speedStatus"
  | "normalSpeed"
  | "doubleSpeedStatus"
  | "normalHighScore"
  | "doubleHighScore";

const translations: Record<Language, Record<TextKey, string>> = {
  ja: {
    gameTitle: "ブロック崩し",
    highScore: "ハイスコア",
    start: "スタート",
    settings: "設定",
    currentScore: "スコア",
    pauseHint: "一時停止: 右クリック / W / ↑",
    pauseTitle: "一時停止",
    resume: "つづける",
    home: "ホームへ戻る",
    resultTitle: "ゲーム終了",
    resultScore: "スコア",
    settingsTitle: "設定",
    language: "言語",
    speedMode: "倍速モード",
    cheatMode: "チートモード",
    nextGameNote: "変更は次のゲームから反映されます。",
    save: "保存",
    back: "戻る",
    languageStatus: "言語",
    speedStatus: "速度",
    normalSpeed: "通常",
    doubleSpeedStatus: "2倍速",
    normalHighScore: "通常ハイスコア",
    doubleHighScore: "倍速ハイスコア",
  },
  en: {
    gameTitle: "Block Breaker",
    highScore: "High score",
    start: "Start",
    settings: "Settings",
    currentScore: "Score",
    pauseHint: "Pause: right-click / W / ↑",
    pauseTitle: "Paused",
    resume: "Resume",
    home: "Back to Home",
    resultTitle: "Game Over",
    resultScore: "Score",
    settingsTitle: "Settings",
    language: "Language",
    speedMode: "Double-speed mode",
    cheatMode: "Cheat mode",
    nextGameNote: "Changes take effect in the next game.",
    save: "Save",
    back: "Back",
    languageStatus: "Language",
    speedStatus: "Speed",
    normalSpeed: "Normal",
    doubleSpeedStatus: "2x",
    normalHighScore: "Normal high score",
    doubleHighScore: "Double-speed high score",
  },
  zh: {
    gameTitle: "打砖块",
    highScore: "最高分",
    start: "开始",
    settings: "设置",
    currentScore: "得分",
    pauseHint: "暂停：右键 / W / ↑",
    pauseTitle: "已暂停",
    resume: "继续",
    home: "返回主页",
    resultTitle: "游戏结束",
    resultScore: "得分",
    settingsTitle: "设置",
    language: "语言",
    speedMode: "双倍速度模式",
    cheatMode: "作弊模式",
    nextGameNote: "更改将在下一局生效。",
    save: "保存",
    back: "返回",
    languageStatus: "语言",
    speedStatus: "速度",
    normalSpeed: "普通",
    doubleSpeedStatus: "2倍速",
    normalHighScore: "普通模式最高分",
    doubleHighScore: "双倍速度模式最高分",
  },
};

export function translate(language: Language, key: TextKey): string {
  return translations[language][key];
}

export function isTextKey(value: string): value is TextKey {
  return value in translations.ja;
}

export function languageName(language: Language): string {
  if (language === "en") return "English";
  if (language === "zh") return "中文";
  return "日本語";
}

export function localeFor(language: Language): string {
  if (language === "en") return "en";
  if (language === "zh") return "zh-CN";
  return "ja";
}
