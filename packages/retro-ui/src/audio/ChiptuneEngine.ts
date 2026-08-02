import {
  HAPPY_HARDCORE,
  midiToFrequency,
  type ChiptunePattern,
} from './patterns';

export interface ChiptuneEngineOptions {
  pattern?: ChiptunePattern;
  /** Master volume, 0–1. */
  volume?: number;
  /** Seconds of audio scheduled ahead of the playhead. */
  lookahead?: number;
  /** Milliseconds between scheduler ticks. */
  tickInterval?: number;
}

/**
 * A Web Audio happy-hardcore engine: kick, snare, hi-hats, detuned saw bass,
 * five-oscillator supersaw lead and square stab chords.
 *
 * Rebuilt from the original site's synth, which kept its entire state in
 * module-level `let` bindings — one AudioContext, one playing flag, one
 * scheduler timer, all global. That made two players on a page impossible and
 * left the context running forever after "stop". This is an instance you can
 * create, start, stop and `dispose()`.
 *
 * Timing uses lookahead scheduling: a `setTimeout` loop queues notes onto the
 * audio clock ahead of time, because `setTimeout` alone is far too jittery to
 * sequence music.
 */
export class ChiptuneEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private nextLoopTime = 0;
  private playing = false;
  private disposed = false;
  private active = new Set<AudioScheduledSourceNode>();

  readonly pattern: ChiptunePattern;
  private volume: number;
  private readonly lookahead: number;
  private readonly tickInterval: number;

  constructor({
    pattern = HAPPY_HARDCORE,
    volume = 0.45,
    lookahead = 1,
    tickInterval = 200,
  }: ChiptuneEngineOptions = {}) {
    this.pattern = pattern;
    this.volume = volume;
    this.lookahead = lookahead;
    this.tickInterval = tickInterval;
  }

  get isPlaying(): boolean {
    return this.playing;
  }

  /** Seconds per beat, derived from the pattern's tempo. */
  private get beat(): number {
    return 60 / this.pattern.bpm;
  }

  private get bar(): number {
    return this.beat * 4;
  }

  private get loopDuration(): number {
    return this.pattern.bars * this.bar;
  }

  /**
   * Whether Web Audio is available. Returns false during SSR and in test
   * environments, so callers can degrade instead of throwing.
   */
  static get isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      (typeof window.AudioContext !== 'undefined' ||
        typeof (window as { webkitAudioContext?: unknown }).webkitAudioContext !==
          'undefined')
    );
  }

  private ensureContext(): AudioContext | null {
    if (this.disposed) return null;
    if (this.context) return this.context;
    if (!ChiptuneEngine.isSupported) return null;

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const context = new Ctor();

    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -15;
    compressor.knee.value = 10;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.15;
    compressor.connect(context.destination);

    const master = context.createGain();
    master.gain.value = this.volume;
    master.connect(compressor);

    // One shared noise buffer feeds every snare and hi-hat, rather than
    // regenerating 200ms of random samples on each of the ~1,900 hits per loop.
    const noiseBuffer = context.createBuffer(
      1,
      Math.floor(context.sampleRate * 0.2),
      context.sampleRate,
    );
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    this.context = context;
    this.compressor = compressor;
    this.master = master;
    this.noiseBuffer = noiseBuffer;
    return context;
  }

  /** Tracks sources so `dispose` can stop anything still ringing out. */
  private track(node: AudioScheduledSourceNode, stopAt: number): void {
    this.active.add(node);
    node.onended = () => this.active.delete(node);
    node.stop(stopAt);
  }

  private kick(at: number): void {
    const ctx = this.context!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, at);
    osc.frequency.exponentialRampToValueAtTime(40, at + 0.1);
    gain.gain.setValueAtTime(1, at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + 0.25);
    osc.connect(gain);
    gain.connect(this.master!);
    osc.start(at);
    this.track(osc, at + 0.25);
  }

  private snare(at: number): void {
    const ctx = this.context!;

    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const bandpass = ctx.createBiquadFilter();
    noise.buffer = this.noiseBuffer;
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 3500;
    bandpass.Q.value = 1;
    noiseGain.gain.setValueAtTime(0.6, at);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, at + 0.12);
    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(this.master!);
    noise.start(at);
    this.track(noise, at + 0.12);

    // A short pitched thump under the noise, so it reads as a drum rather
    // than a burst of static.
    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = 'triangle';
    body.frequency.value = 180;
    bodyGain.gain.setValueAtTime(0.4, at);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, at + 0.06);
    body.connect(bodyGain);
    bodyGain.connect(this.master!);
    body.start(at);
    this.track(body, at + 0.06);
  }

  private hihat(at: number, open: boolean): void {
    const ctx = this.context!;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    const highpass = ctx.createBiquadFilter();
    const duration = open ? 0.1 : 0.03;

    source.buffer = this.noiseBuffer;
    highpass.type = 'highpass';
    highpass.frequency.value = 8000;
    gain.gain.setValueAtTime(open ? 0.18 : 0.1, at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
    source.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.master!);
    source.start(at);
    this.track(source, at + duration);
  }

  /** Three detuned saws through a resonant lowpass — the rave bass. */
  private bass(at: number, note: number, duration: number): void {
    const ctx = this.context!;
    const frequency = midiToFrequency(note);

    for (const detune of [-7, 0, 7]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lowpass = ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.value = frequency;
      osc.detune.value = detune;
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 400;
      lowpass.Q.value = 4;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.15, at + 0.01);
      gain.gain.setValueAtTime(0.15, at + duration - 0.02);
      gain.gain.linearRampToValueAtTime(0, at + duration);
      osc.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(this.master!);
      osc.start(at);
      this.track(osc, at + duration + 0.01);
    }
  }

  /** Five detuned saws — the supersaw lead. */
  private lead(at: number, note: number, duration: number): void {
    const ctx = this.context!;
    const frequency = midiToFrequency(note);

    for (const detune of [-20, -8, 0, 8, 20]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = frequency;
      osc.detune.value = detune;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.05, at + 0.005);
      gain.gain.setValueAtTime(0.05, at + duration * 0.8);
      gain.gain.linearRampToValueAtTime(0, at + duration);
      osc.connect(gain);
      gain.connect(this.master!);
      osc.start(at);
      this.track(osc, at + duration + 0.01);
    }
  }

  /** Square-wave chord with a fast filter sweep — the offbeat stab. */
  private stab(at: number, notes: readonly number[], duration: number): void {
    const ctx = this.context!;

    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lowpass = ctx.createBiquadFilter();
      osc.type = 'square';
      osc.frequency.value = midiToFrequency(note);
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(3000, at);
      lowpass.frequency.exponentialRampToValueAtTime(500, at + duration);
      gain.gain.setValueAtTime(0.12, at);
      gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
      osc.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(this.master!);
      osc.start(at);
      this.track(osc, at + duration + 0.01);
    }
  }

  private scheduleLoop(startTime: number): void {
    const { beat, bar } = this;
    const { bars, melody, bass, chords } = this.pattern;

    for (let barIndex = 0; barIndex < bars; barIndex += 1) {
      const barStart = startTime + barIndex * bar;

      for (let b = 0; b < 4; b += 1) this.kick(barStart + b * beat);

      this.snare(barStart + beat);
      this.snare(barStart + beat * 3);
      // Ghost note on odd bars, so the loop does not feel like a metronome.
      if (barIndex % 2 === 1) this.snare(barStart + beat * 3.5);

      for (let i = 0; i < 8; i += 1) {
        this.hihat(barStart + (i * beat) / 2, i % 2 === 1);
      }
    }

    for (const [note, startBar, barCount] of bass) {
      const pulses = barCount * 8;
      for (let i = 0; i < pulses; i += 1) {
        this.bass(
          startTime + startBar * bar + (i * beat) / 2,
          note,
          (beat / 2) * 0.7,
        );
      }
    }

    for (const [note, atBeat, duration] of melody) {
      this.lead(startTime + atBeat * beat, note, duration * beat);
    }

    for (const { notes, startBar, bars: chordBars } of chords) {
      for (let b = 0; b < chordBars * 4; b += 1) {
        this.stab(
          startTime + startBar * bar + b * beat + beat * 0.5,
          notes,
          beat * 0.25,
        );
      }
    }
  }

  private tick = (): void => {
    if (!this.playing || !this.context) return;

    while (this.nextLoopTime < this.context.currentTime + this.lookahead) {
      this.scheduleLoop(this.nextLoopTime);
      this.nextLoopTime += this.loopDuration;
    }

    this.timer = setTimeout(this.tick, this.tickInterval);
  };

  /**
   * Starts playback. Must be called from a user gesture — browsers refuse to
   * start an AudioContext otherwise, which is precisely the autoplay ban the
   * original site's "auto-play MIDI" was trying to sneak past.
   */
  async start(): Promise<void> {
    if (this.playing || this.disposed) return;
    const context = this.ensureContext();
    if (!context) return;

    if (context.state === 'suspended') {
      await context.resume();
    }

    this.playing = true;
    this.master!.gain.setValueAtTime(this.volume, context.currentTime);
    this.nextLoopTime = context.currentTime + 0.05;
    this.tick();
  }

  /** Stops playback and silences anything already scheduled. */
  stop(): void {
    this.playing = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (!this.context || !this.master) return;

    // Scheduled notes cannot be un-scheduled, so the master gain is dropped to
    // zero and every live source is stopped outright.
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.setValueAtTime(0, this.context.currentTime);
    for (const node of this.active) {
      try {
        node.stop();
      } catch {
        // Already stopped — nothing to do.
      }
    }
    this.active.clear();
  }

  /** Sets master volume, 0–1. Takes effect immediately. */
  setVolume(volume: number): void {
    this.volume = Math.min(1, Math.max(0, volume));
    if (this.master && this.context && this.playing) {
      this.master.gain.setValueAtTime(this.volume, this.context.currentTime);
    }
  }

  /**
   * Releases the AudioContext. Call on unmount — browsers cap the number of
   * contexts a page may create, and leaking them eventually breaks all audio.
   */
  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.stop();
    this.disposed = true;

    // Unhook the graph before closing, so nothing is left referencing the
    // destination node while the context tears down.
    this.master?.disconnect();
    this.compressor?.disconnect();

    const context = this.context;
    this.context = null;
    this.master = null;
    this.compressor = null;
    this.noiseBuffer = null;

    if (context && context.state !== 'closed') {
      try {
        await context.close();
      } catch {
        // Closing a context that is already tearing down is not an error.
      }
    }
  }
}
