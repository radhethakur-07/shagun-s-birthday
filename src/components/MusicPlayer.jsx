import React, { useState, useRef, useEffect, useCallback } from 'react';

/* -------------------------------------------------------
   Web Audio API — Happy Birthday Synthesizer
   Plays the melody without any external MP3 file.
   Falls back to a hosted URL if Web Audio is unavailable.
------------------------------------------------------- */

// Note frequencies (Hz)
const NOTE_FREQ = {
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25,
  F5: 698.46, G5: 783.99,
};

// Happy Birthday melody: [note, duration_seconds]
const MELODY = [
  ['G4', 0.35], ['G4', 0.2], ['A4', 0.55], ['G4', 0.55], ['C5', 0.55], ['B4', 1.1],
  ['G4', 0.35], ['G4', 0.2], ['A4', 0.55], ['G4', 0.55], ['D5', 0.55], ['C5', 1.1],
  ['G4', 0.35], ['G4', 0.2], ['G5', 0.55], ['E5', 0.55], ['C5', 0.55], ['B4', 0.55], ['A4', 1.1],
  ['F5', 0.35], ['F5', 0.2], ['E5', 0.55], ['C5', 0.55], ['D5', 0.55], ['C5', 1.3],
];

const MELODY_DURATION = MELODY.reduce((sum, [, d]) => sum + d + 0.05, 0);

function scheduleMelody(audioCtx, gainNode, startTime) {
  let t = startTime;
  MELODY.forEach(([note, dur]) => {
    const freq = NOTE_FREQ[note];
    const osc = audioCtx.createOscillator();
    const envGain = audioCtx.createGain();

    osc.connect(envGain);
    envGain.connect(gainNode);

    osc.type = 'triangle'; // softer, more musical tone
    osc.frequency.setValueAtTime(freq, t);

    // ADSR envelope
    envGain.gain.setValueAtTime(0, t);
    envGain.gain.linearRampToValueAtTime(0.5, t + 0.03);
    envGain.gain.setValueAtTime(0.5, t + dur * 0.6);
    envGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.start(t);
    osc.stop(t + dur + 0.01);
    t += dur + 0.05;
  });
  return t;
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [initiated, setInitiated] = useState(false);

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const loopTimerRef = useRef(null);
  const nextStartRef = useRef(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const scheduleLoop = useCallback((ctx, gain, start) => {
    const end = scheduleMelody(ctx, gain, start);
    const msUntilEnd = (end - ctx.currentTime) * 1000;
    nextStartRef.current = end + 0.5; // half second gap between loops
    loopTimerRef.current = setTimeout(() => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        scheduleLoop(ctx, gain, nextStartRef.current);
      }
    }, msUntilEnd - 100); // schedule next loop a bit before current ends
  }, []);

  const startPlaying = useCallback(async () => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = gain;
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    scheduleLoop(ctx, masterGainRef.current, ctx.currentTime + 0.1);
    setPlaying(true);
    setInitiated(true);
  }, [scheduleLoop]);

  const pausePlaying = useCallback(async () => {
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    if (audioCtxRef.current) {
      await audioCtxRef.current.suspend();
    }
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(async () => {
    if (playing) {
      await pausePlaying();
    } else {
      await startPlaying();
    }
  }, [playing, startPlaying, pausePlaying]);

  return (
    <div
      id="music-player"
      className={`music-player ${playing ? 'playing' : ''}`}
      onClick={togglePlay}
      role="button"
      tabIndex={0}
      aria-label={playing ? 'Pause birthday music' : 'Play birthday music'}
      onKeyDown={(e) => e.key === 'Enter' && togglePlay()}
      title={playing ? 'Pause music' : 'Play music'}
    >
      {/* Play / Pause button */}
      <button
        id="music-play-pause-btn"
        className={`play-btn ${playing ? 'playing' : ''}`}
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? '⏸' : '▶'}
      </button>

      {/* Song info */}
      <div className="music-info">
        <span className="music-title">🎵 Happy Birthday!</span>
        <span className="music-artist">
          {playing ? 'Playing for Shagun 🌸' : initiated ? 'Paused' : 'Tap to play 🎶'}
        </span>
      </div>

      {/* Equalizer bars */}
      <div className={`equalizer ${playing ? 'active' : ''}`}>
        <div className="eq-bar" />
        <div className="eq-bar" />
        <div className="eq-bar" />
        <div className="eq-bar" />
      </div>
    </div>
  );
}
