/** A note: `[midiNote, startBeat, durationInBeats]`. */
export type NoteEvent = readonly [note: number, beat: number, duration: number];

/** A bassline segment: `[midiNote, startBar, barCount]`. */
export type BassEvent = readonly [note: number, startBar: number, bars: number];

export interface ChordEvent {
  /** MIDI notes sounded together. */
  notes: readonly number[];
  startBar: number;
  bars: number;
}

export interface ChiptunePattern {
  name: string;
  bpm: number;
  bars: number;
  melody: readonly NoteEvent[];
  bass: readonly BassEvent[];
  chords: readonly ChordEvent[];
}

/**
 * The house pattern: 170 BPM happy hardcore, eight bars, four-on-the-floor.
 *
 * Transcribed note for note from the original site's synth. It is exactly as
 * relentless as it sounds.
 */
export const HAPPY_HARDCORE: ChiptunePattern = {
  name: 'Happy Hardcore',
  bpm: 170,
  bars: 8,
  melody: [
    [72, 0, 0.5], [74, 0.5, 0.5], [76, 1, 1], [79, 2, 1], [76, 3, 0.5], [74, 3.5, 0.5],
    [72, 4, 1], [76, 5, 0.5], [79, 5.5, 0.5], [84, 6, 2],
    [81, 8, 0.5], [79, 8.5, 0.5], [76, 9, 1], [74, 10, 1], [72, 11, 1],
    [69, 12, 1], [72, 13, 1], [74, 14, 2],
    [65, 16, 0.5], [69, 16.5, 0.5], [72, 17, 1], [74, 18, 0.5], [76, 18.5, 0.5], [77, 19, 1],
    [79, 20, 1], [77, 21, 0.5], [76, 21.5, 0.5], [79, 22, 2],
    [79, 24, 0.5], [83, 24.5, 0.5], [84, 25, 1], [83, 26, 0.5], [79, 26.5, 0.5], [84, 27, 1],
    [83, 28, 1], [79, 29, 1], [76, 30, 1], [72, 31, 1],
  ],
  bass: [
    [36, 0, 2],
    [33, 2, 2],
    [29, 4, 2],
    [31, 6, 2],
  ],
  chords: [
    { notes: [60, 64, 67, 72], startBar: 0, bars: 2 },
    { notes: [57, 60, 64, 69], startBar: 2, bars: 2 },
    { notes: [53, 57, 60, 65], startBar: 4, bars: 2 },
    { notes: [55, 59, 62, 67], startBar: 6, bars: 2 },
  ],
};

/** Converts a MIDI note number to frequency in Hz. A4 (69) = 440 Hz. */
export function midiToFrequency(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}
