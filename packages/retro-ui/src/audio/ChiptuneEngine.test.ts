import { describe, expect, it } from 'vitest';

import { ChiptuneEngine } from './ChiptuneEngine';
import { HAPPY_HARDCORE, midiToFrequency } from './patterns';

describe('midiToFrequency', () => {
  it('anchors A4 at 440 Hz', () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 5);
  });

  it('doubles every octave', () => {
    expect(midiToFrequency(81)).toBeCloseTo(880, 5);
    expect(midiToFrequency(57)).toBeCloseTo(220, 5);
  });
});

describe('ChiptuneEngine', () => {
  it('reports Web Audio as unavailable in jsdom rather than throwing', () => {
    expect(ChiptuneEngine.isSupported).toBe(false);
  });

  it('degrades quietly when there is no audio to play', async () => {
    const engine = new ChiptuneEngine();
    await expect(engine.start()).resolves.toBeUndefined();
    expect(engine.isPlaying).toBe(false);
  });

  it('is safe to stop and dispose without ever starting', async () => {
    const engine = new ChiptuneEngine();
    expect(() => engine.stop()).not.toThrow();
    await expect(engine.dispose()).resolves.toBeUndefined();
    // Disposing twice must also be harmless — React runs cleanups twice in
    // StrictMode.
    await expect(engine.dispose()).resolves.toBeUndefined();
  });

  it('keeps each instance independent, unlike the module globals it replaced', () => {
    const a = new ChiptuneEngine();
    const b = new ChiptuneEngine({ pattern: { ...HAPPY_HARDCORE, bpm: 200 } });

    expect(a.pattern.bpm).toBe(170);
    expect(b.pattern.bpm).toBe(200);
  });
});
