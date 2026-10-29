const LEGACY_HIGH_SCORE_KEY = "blockbreakgame.highScore";
const NORMAL_HIGH_SCORE_KEY = "blockbreakgame.highScore.normal";
const DOUBLE_HIGH_SCORE_KEY = "blockbreakgame.highScore.double";

export function loadHighScore(doubleSpeed: boolean): number {
  const key = doubleSpeed ? DOUBLE_HIGH_SCORE_KEY : NORMAL_HIGH_SCORE_KEY;
  const savedScore =
    localStorage.getItem(key) ??
    (doubleSpeed ? null : localStorage.getItem(LEGACY_HIGH_SCORE_KEY));
  if (savedScore === null) return 0;

  const highScore = Number(savedScore);
  if (!Number.isSafeInteger(highScore) || highScore < 0) {
    throw new Error("保存されたハイスコアの値が不正です。");
  }

  return highScore;
}

export function saveHighScore(score: number, doubleSpeed: boolean): void {
  if (!Number.isSafeInteger(score) || score < 0) {
    throw new Error("ハイスコアには0以上の整数を指定してください。");
  }

  const key = doubleSpeed ? DOUBLE_HIGH_SCORE_KEY : NORMAL_HIGH_SCORE_KEY;
  localStorage.setItem(key, String(score));
}
