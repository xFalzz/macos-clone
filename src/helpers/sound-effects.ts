/** Web Audio API sound effects for macOS interactions */
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export type SoundName = 'notification' | 'trash' | 'screenshot' | 'volumeChange' | 'click' | 'error';

export function playSound(name: SoundName) {
  switch (name) {
    case 'notification':
      // Two-tone chime (macOS notification)
      playTone(880, 0.15, 'sine', 0.12);
      setTimeout(() => playTone(1175, 0.2, 'sine', 0.1), 120);
      break;

    case 'trash':
      // Crumple-like descending tones
      playTone(600, 0.08, 'triangle', 0.1);
      setTimeout(() => playTone(400, 0.08, 'triangle', 0.08), 60);
      setTimeout(() => playTone(250, 0.15, 'triangle', 0.06), 120);
      break;

    case 'screenshot':
      // Camera shutter click
      playTone(1200, 0.05, 'square', 0.08);
      setTimeout(() => playTone(800, 0.08, 'square', 0.06), 50);
      break;

    case 'volumeChange':
      // Pop sound
      playTone(1000, 0.08, 'sine', 0.12);
      break;

    case 'click':
      // Subtle UI click
      playTone(1400, 0.03, 'sine', 0.06);
      break;

    case 'error':
      // Error boop (two low tones)
      playTone(300, 0.12, 'sine', 0.1);
      setTimeout(() => playTone(250, 0.2, 'sine', 0.1), 150);
      break;
  }
}
