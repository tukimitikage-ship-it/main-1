export type Language = "ja" | "en" | "zh";

export type GameSettings = {
  language: Language;
  doubleSpeed: boolean;
  cheatMode: boolean;
};

const SETTINGS_KEY = "blockbreakgame.settings";
const DEFAULT_SETTINGS: GameSettings = {
  language: "ja",
  doubleSpeed: false,
  cheatMode: false,
};

export function isLanguage(value: string): value is Language {
  return value === "ja" || value === "en" || value === "zh";
}

export function loadSettings(): GameSettings {
  const savedSettings = localStorage.getItem(SETTINGS_KEY);
  if (savedSettings === null) return { ...DEFAULT_SETTINGS };

  let parsed: unknown;
  try {
    parsed = JSON.parse(savedSettings);
  } catch (error) {
    throw new Error("保存された設定を読み込めません。", { cause: error });
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("language" in parsed) ||
    !("doubleSpeed" in parsed) ||
    typeof parsed.language !== "string" ||
    !isLanguage(parsed.language) ||
    typeof parsed.doubleSpeed !== "boolean" ||
    ("cheatMode" in parsed && typeof parsed.cheatMode !== "boolean")
  ) {
    throw new Error("保存された設定の形式が正しくありません。");
  }

  const cheatMode = "cheatMode" in parsed ? parsed.cheatMode : false;
  if (typeof cheatMode !== "boolean") {
    throw new Error("保存された設定の形式が正しくありません。");
  }

  return {
    language: parsed.language,
    doubleSpeed: parsed.doubleSpeed,
    cheatMode,
  };
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
