import React, { useEffect, useRef, useState } from 'react';

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 4,
  duration: Math.random() * 2 + 2,
}));

const EMOJI_FLOATS = ['🌸', '🦋', '💕', '✨', '🌺', '🌟', '💫', '🎀', '🌷', '💗'];

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const sparkleId = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = sparkleId.current++;
    const emojis = ['✨', '💖', '🌸', '⭐', '💫', '🦋'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    setSparkles(prev => [...prev, { id, x, y, emoji }]);
    setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 1000);
  };

  return (
    <section className="hero" id="hero" onClick={handleClick}>
      {/* Stars */}
      <div className="hero-stars">
        {STARS.map(s => (
          <div
            key={s.id}
            className="star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              '--duration': `${s.duration}s`,
              '--delay': `${s.delay}s`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Balloons */}
      <div className="balloon" style={{ left: '4%', top: '15%', animationDelay: '0s' }}>🎈</div>
      <div className="balloon" style={{ right: '4%', top: '20%', animationDelay: '0.7s' }}>🎈</div>
      <div className="balloon" style={{ left: '8%', top: '60%', animationDelay: '1.4s', fontSize: '1.8rem' }}>🎀</div>
      <div className="balloon" style={{ right: '8%', top: '55%', animationDelay: '0.4s', fontSize: '1.8rem' }}>🎀</div>

      {/* Floating corner emojis */}
      {EMOJI_FLOATS.slice(0, 5).map((em, i) => (
        <div key={i} className="balloon" style={{
          left: `${Math.random() * 15 + 2}%`,
          top: `${Math.random() * 70 + 10}%`,
          fontSize: '1.4rem',
          animationDelay: `${i * 0.5}s`,
          opacity: 0.5,
        }}>{em}</div>
      ))}

      {/* Sparkles on click */}
      {sparkles.map(s => (
        <div key={s.id} className="sparkle" style={{ left: s.x, top: s.y }}>
          {s.emoji}
        </div>
      ))}

      {/* Main Content */}
      <div className={`hero-content ${visible ? 'visible' : ''}`}>
        <div className="birthday-badge">🎉 Today is Special! 🎉</div>

        <h2 className="happy-birthday-text">Happy Birthday</h2>

        <div className="name-letters">
          {'SHAGUN'.split('').map((letter, i) => (
            <span
              key={i}
              className="name-letter"
              style={{
                animationDelay: `${i * 0.12 + 0.8}s`,
                '--letter-index': i,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <p className="hero-subtitle">
          🌸 Wishing you a day as beautiful and bright as you are! 🌸
        </p>

        <div className="hero-emojis">
          {['🎂', '🌺', '✨', '💕', '🎁', '🦋', '🌸'].map((em, i) => (
            <span key={i}>{em}</span>
          ))}
        </div>

        <button
          id="hero-celebrate-btn"
          className="scroll-btn"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById('cake-section').scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Let's Celebrate! ↓
        </button>
      </div>
    </section>
  );
}
