// Web Audio API - HAPPY HARDCORE / DnB Synthesizer
// 170 BPM of pure late-90s rave energy!
// Uses lookahead scheduling for gapless playback

let audioContext = null;
let isPlaying = false;
let masterGain = null;
let compressor = null;
let schedulerTimer = null;
let nextLoopTime = 0;

const BPM = 170;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const BARS = 8;
const LOOP_DUR = BARS * BAR;

// Reusable noise buffer (created once)
let noiseBuffer = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -15;
        compressor.knee.value = 10;
        compressor.ratio.value = 6;
        compressor.attack.value = 0.005;
        compressor.release.value = 0.15;
        compressor.connect(audioContext.destination);

        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.45;
        masterGain.connect(compressor);

        // Pre-generate noise buffer
        noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.2, audioContext.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
}

function midiToFreq(n) { return 440 * Math.pow(2, (n - 69) / 12); }

// === KICK ===
function kick(t) {
    const o = audioContext.createOscillator();
    const g = audioContext.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.1);
    g.gain.setValueAtTime(1.0, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + 0.25);
}

// === SNARE ===
function snare(t) {
    const src = audioContext.createBufferSource();
    const g = audioContext.createGain();
    const f = audioContext.createBiquadFilter();
    src.buffer = noiseBuffer;
    f.type = 'bandpass'; f.frequency.value = 3500; f.Q.value = 1;
    g.gain.setValueAtTime(0.6, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    src.connect(f); f.connect(g); g.connect(masterGain);
    src.start(t); src.stop(t + 0.12);

    const body = audioContext.createOscillator();
    const bg = audioContext.createGain();
    body.type = 'triangle'; body.frequency.value = 180;
    bg.gain.setValueAtTime(0.4, t);
    bg.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    body.connect(bg); bg.connect(masterGain);
    body.start(t); body.stop(t + 0.06);
}

// === HI-HAT ===
function hihat(t, open) {
    const src = audioContext.createBufferSource();
    const g = audioContext.createGain();
    const f = audioContext.createBiquadFilter();
    const dur = open ? 0.1 : 0.03;
    src.buffer = noiseBuffer;
    f.type = 'highpass'; f.frequency.value = 8000;
    g.gain.setValueAtTime(open ? 0.18 : 0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(masterGain);
    src.start(t); src.stop(t + dur);
}

// === BASS - Thick detuned saw ===
function bass(t, note, dur) {
    const freq = midiToFreq(note);
    [-7, 0, 7].forEach(det => {
        const o = audioContext.createOscillator();
        const g = audioContext.createGain();
        const f = audioContext.createBiquadFilter();
        o.type = 'sawtooth'; o.frequency.value = freq; o.detune.value = det;
        f.type = 'lowpass'; f.frequency.value = 400; f.Q.value = 4;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.15, t + 0.01);
        g.gain.setValueAtTime(0.15, t + dur - 0.02);
        g.gain.linearRampToValueAtTime(0, t + dur);
        o.connect(f); f.connect(g); g.connect(masterGain);
        o.start(t); o.stop(t + dur + 0.01);
    });
}

// === SUPERSAW LEAD ===
function lead(t, note, dur) {
    const freq = midiToFreq(note);
    [-20, -8, 0, 8, 20].forEach(det => {
        const o = audioContext.createOscillator();
        const g = audioContext.createGain();
        o.type = 'sawtooth'; o.frequency.value = freq; o.detune.value = det;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.005);
        g.gain.setValueAtTime(0.05, t + dur * 0.8);
        g.gain.linearRampToValueAtTime(0, t + dur);
        o.connect(g); g.connect(masterGain);
        o.start(t); o.stop(t + dur + 0.01);
    });
}

// === STAB CHORD ===
function stab(t, notes, dur) {
    notes.forEach(n => {
        const o = audioContext.createOscillator();
        const g = audioContext.createGain();
        const f = audioContext.createBiquadFilter();
        o.type = 'square'; o.frequency.value = midiToFreq(n);
        f.type = 'lowpass';
        f.frequency.setValueAtTime(3000, t);
        f.frequency.exponentialRampToValueAtTime(500, t + dur);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(f); f.connect(g); g.connect(masterGain);
        o.start(t); o.stop(t + dur + 0.01);
    });
}

// === SCHEDULE ONE FULL LOOP ===
function scheduleLoop(t0) {
    // -- DRUMS --
    for (let bar = 0; bar < BARS; bar++) {
        const bt = t0 + bar * BAR;

        // Kicks: every beat
        for (let b = 0; b < 4; b++) kick(bt + b * BEAT);

        // Snare on 2 and 4, ghost on odd bars
        snare(bt + BEAT);
        snare(bt + BEAT * 3);
        if (bar % 2 === 1) snare(bt + BEAT * 3.5);

        // Hi-hats: every 8th note, open on offbeats
        for (let i = 0; i < 8; i++) {
            hihat(bt + i * BEAT / 2, i % 2 === 1);
        }
    }

    // -- BASS (pumping 8th notes) --
    const bassSeq = [
        [36, 0, 2], [33, 2, 2], [29, 4, 2], [31, 6, 2]
    ];
    bassSeq.forEach(([note, startBar, numBars]) => {
        const pulses = numBars * 8;
        for (let i = 0; i < pulses; i++) {
            bass(t0 + startBar * BAR + i * BEAT / 2, note, BEAT / 2 * 0.7);
        }
    });

    // -- MELODY --
    const mel = [
        [72, 0, 0.5], [74, 0.5, 0.5], [76, 1, 1], [79, 2, 1], [76, 3, 0.5], [74, 3.5, 0.5],
        [72, 4, 1], [76, 5, 0.5], [79, 5.5, 0.5], [84, 6, 2],
        [81, 8, 0.5], [79, 8.5, 0.5], [76, 9, 1], [74, 10, 1], [72, 11, 1],
        [69, 12, 1], [72, 13, 1], [74, 14, 2],
        [65, 16, 0.5], [69, 16.5, 0.5], [72, 17, 1], [74, 18, 0.5], [76, 18.5, 0.5], [77, 19, 1],
        [79, 20, 1], [77, 21, 0.5], [76, 21.5, 0.5], [79, 22, 2],
        [79, 24, 0.5], [83, 24.5, 0.5], [84, 25, 1], [83, 26, 0.5], [79, 26.5, 0.5], [84, 27, 1],
        [83, 28, 1], [79, 29, 1], [76, 30, 1], [72, 31, 1],
    ];
    mel.forEach(([note, beat, dur]) => {
        lead(t0 + beat * BEAT, note, dur * BEAT);
    });

    // -- STAB CHORDS (offbeat) --
    const chords = [
        { n: [60, 64, 67, 72], bar: 0, bars: 2 },
        { n: [57, 60, 64, 69], bar: 2, bars: 2 },
        { n: [53, 57, 60, 65], bar: 4, bars: 2 },
        { n: [55, 59, 62, 67], bar: 6, bars: 2 },
    ];
    chords.forEach(({ n, bar, bars }) => {
        for (let b = 0; b < bars * 4; b++) {
            stab(t0 + bar * BAR + b * BEAT + BEAT * 0.5, n, BEAT * 0.25);
        }
    });
}

// === LOOKAHEAD SCHEDULER ===
function scheduler() {
    if (!isPlaying) return;

    // Schedule loops ahead of time so there's never a gap
    while (nextLoopTime < audioContext.currentTime + 1.0) {
        scheduleLoop(nextLoopTime);
        nextLoopTime += LOOP_DUR;
    }

    schedulerTimer = setTimeout(scheduler, 200);
}

function startMusic() {
    initAudio();
    if (audioContext.state === 'suspended') audioContext.resume();
    if (!isPlaying) {
        isPlaying = true;
        nextLoopTime = audioContext.currentTime + 0.05;
        scheduler();
    }
}

function stopMusic() {
    isPlaying = false;
    if (schedulerTimer) { clearTimeout(schedulerTimer); schedulerTimer = null; }
    // Kill all sound immediately
    if (audioContext) {
        masterGain.gain.setValueAtTime(0, audioContext.currentTime);
        setTimeout(() => { masterGain.gain.setValueAtTime(0.45, audioContext.currentTime); }, 100);
    }
}

window.toggleMidi = function() {
    const btn = document.getElementById('muteBtn');
    if (!isPlaying) {
        startMusic();
        btn.textContent = 'MUTE';
        btn.style.background = '#FF0000';
    } else {
        stopMusic();
        btn.textContent = 'PLAY';
        btn.style.background = '#00FF00';
    }
};

console.log('%c🎵 HAPPY HARDCORE ENGINE v2 LOADED!', 'color: #FF00FF; font-size: 16px; font-weight: bold;');
console.log('%c170 BPM • Lookahead scheduler • Zero gaps!', 'color: #00FFFF; font-size: 12px;');
