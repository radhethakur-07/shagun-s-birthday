import React, { useEffect, useRef } from 'react';

/* ----------------------------------------------------------
   Floating cute elements layered over the whole page:
   - Animated emoji petals falling down
   - Floating hearts and butterflies drifting across
   - Sparkle bursts at random positions
---------------------------------------------------------- */

const PETAL_COLORS = [
  '#ff6bb5', '#c77dff', '#ffd700', '#ff9fd4',
  '#ffb3d9', '#e0a0ff', '#ffe066', '#ff80c0',
];

// Pre-generate random petal data
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  color: PETAL_COLORS[i % PETAL_COLORS.length],
  size: Math.random() * 10 + 6,
  delay: `${Math.random() * 8}s`,
  duration: `${Math.random() * 6 + 8}s`,
  borderRadius: Math.random() > 0.5 ? '50%' : '50% 0 50% 0',
}));

// Floating emoji elements that drift across the screen
const DRIFTERS = [
  { emoji: '🌸', top: '15%', delay: '0s', duration: '22s' },
  { emoji: '🦋', top: '35%', delay: '4s', duration: '28s' },
  { emoji: '💕', top: '55%', delay: '8s', duration: '20s' },
  { emoji: '✨', top: '25%', delay: '12s', duration: '25s' },
  { emoji: '🌺', top: '70%', delay: '2s', duration: '30s' },
  { emoji: '💫', top: '80%', delay: '16s', duration: '18s' },
  { emoji: '🎀', top: '45%', delay: '6s', duration: '24s' },
  { emoji: '🌷', top: '60%', delay: '10s', duration: '26s' },
  { emoji: '⭐', top: '20%', delay: '18s', duration: '22s' },
  { emoji: '🦋', top: '85%', delay: '14s', duration: '20s' },
];

export default function FloatingElements() {
  return (
    <div className="floating-layer" aria-hidden="true">
      {/* Falling petals */}
      {PETALS.map(p => (
        <div
          key={p.id}
          className="petal-el"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.borderRadius,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Drifting emoji elements */}
      {DRIFTERS.map((d, i) => (
        <div
          key={i}
          className="float-el"
          style={{
            top: d.top,
            left: '-80px',
            fontSize: '1.5rem',
            animationDelay: d.delay,
            animationDuration: d.duration,
            opacity: 0.55,
          }}
        >
          {d.emoji}
        </div>
      ))}
    </div>
  );
}
