let audioContext: AudioContext | null = null;

export function enableGameAudio(): void {
  if (typeof AudioContext === "undefined") return;
  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") {
    void audioContext.resume().catch((error: unknown) => {
      console.error("ゲーム音声を開始できませんでした。", error);
    });
  }
}

export function playBlockSound(isHard: boolean, isBreaking: boolean): void {
  if (!audioContext || audioContext.state !== "running") return;

  const startTime = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();
  const startFrequency = isBreaking ? (isHard ? 520 : 760) : 340;

  oscillator.type = isBreaking ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(startFrequency, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    isBreaking ? startFrequency * 0.55 : 220,
    startTime + 0.09,
  );
  volume.gain.setValueAtTime(0.0001, startTime);
  volume.gain.exponentialRampToValueAtTime(
    isBreaking ? 0.12 : 0.07,
    startTime + 0.008,
  );
  volume.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.1);

  oscillator.connect(volume);
  volume.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.11);
}

export function playPaddleSound(): void {
  if (!audioContext || audioContext.state !== "running") return;

  const startTime = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();

  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, startTime);

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(140, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(90, startTime + 0.09);
  volume.gain.setValueAtTime(0.0001, startTime);
  volume.gain.exponentialRampToValueAtTime(0.12, startTime + 0.004);
  volume.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.1);

  oscillator.connect(filter);
  filter.connect(volume);
  volume.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.11);
}

export function playLaserSound(): void {
  if (!audioContext || audioContext.state !== "running") return;

  const startTime = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(1100, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(240, startTime + 0.16);
  volume.gain.setValueAtTime(0.0001, startTime);
  volume.gain.exponentialRampToValueAtTime(0.08, startTime + 0.006);
  volume.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.17);

  oscillator.connect(volume);
  volume.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.18);
}
