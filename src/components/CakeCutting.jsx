import React, { useState, useCallback } from 'react';

/* ---- Confetti burst helper ---- */
const CONFETTI_COLORS = [
  '#ff6bb5', '#c77dff', '#ffd700', '#ff9fd4', '#7fff7f',
  '#ff9f50', '#64dfdf', '#ffc0cb', '#e040fb', '#40c4ff',
];

function createConfettiPieces(count = 120) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 10 + 6}px`,
    height: `${Math.random() * 6 + 4}px`,
    delay: `${Math.random() * 1.5}s`,
    duration: `${Math.random() * 2 + 2}s`,
    rotate: `${Math.random() * 360}deg`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  }));
}

/* ---- Cake SVG Component ---- */
function BirthdayCake({ blownOut, sliced }) {
  return (
    <svg
      className="cake-svg"
      viewBox="0 0 280 300"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Birthday cake"
    >
      {/* Plate */}
      <ellipse cx="140" cy="265" rx="120" ry="14" fill="#3d2785" opacity="0.5" />

      {/* Cake base - bottom tier */}
      <rect x="30" y="190" width="220" height="70" rx="12" fill="#9d4edd" />
      <rect x="30" y="190" width="220" height="18" rx="4" fill="#c77dff" opacity="0.4" />
      {/* Dots on bottom tier */}
      {[60, 100, 140, 180, 220].map((x, i) => (
        <circle key={i} cx={x} cy="225" r="7" fill="rgba(255,215,0,0.5)" />
      ))}
      <rect x="30" y="252" width="220" height="8" rx="4" fill="#ff6bb5" opacity="0.5" />

      {/* Cake middle tier */}
      <rect x="55" y="120" width="170" height="74" rx="10" fill="#c77dff" />
      <rect x="55" y="120" width="170" height="16" rx="4" fill="#e0a0ff" opacity="0.5" />
      {/* Swirls on middle */}
      {[85, 140, 195].map((x, i) => (
        <path key={i} d={`M${x-10},148 Q${x},138 ${x+10},148 Q${x},158 ${x-10},148`} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      ))}
      <rect x="55" y="187" width="170" height="7" rx="3" fill="#ff6bb5" opacity="0.6" />

      {/* Cake top tier */}
      <rect x="85" y="65" width="110" height="59" rx="8" fill="#ff6bb5" />
      <rect x="85" y="65" width="110" height="14" rx="4" fill="#ff9fd4" opacity="0.5" />
      {/* Hearts on top tier */}
      <text x="140" y="100" textAnchor="middle" fontSize="18" fill="rgba(255,255,255,0.4)">💕</text>
      <rect x="85" y="118" width="110" height="6" rx="3" fill="#ffd700" opacity="0.7" />

      {/* Frosting drips */}
      <path d="M85,65 Q90,55 95,65" fill="white" opacity="0.3" />
      <path d="M120,65 Q126,52 132,65" fill="white" opacity="0.3" />
      <path d="M155,65 Q161,54 167,65" fill="white" opacity="0.3" />
      <path d="M180,65 Q185,57 190,65" fill="white" opacity="0.3" />

      {/* Candles */}
      {[115, 140, 165].map((x, i) => (
        <g key={i}>
          {/* Candle body */}
          <rect x={x - 5} y={blownOut ? 30 : 25} width="10" height={blownOut ? 35 : 40} rx="3"
            fill={['#ff6bb5', '#c77dff', '#ffd700'][i]} />
          {/* Candle stripe */}
          <rect x={x - 5} y={blownOut ? 42 : 37} width="10" height="4" rx="1"
            fill="rgba(255,255,255,0.4)" />

          {/* Flame or smoke */}
          {!blownOut ? (
            <g>
              {/* Flame */}
              <ellipse
                cx={x}
                cy={18}
                rx="5"
                ry="8"
                fill="#ffd700"
                style={{ animation: 'candle-flame 0.8s ease-in-out infinite' }}
              />
              <ellipse cx={x} cy={20} rx="3" ry="5" fill="#ff9f00" opacity="0.8" />
              <ellipse cx={x} cy={22} rx="1.5" ry="3" fill="white" opacity="0.6" />
            </g>
          ) : (
            /* Smoke wisps */
            <g>
              <ellipse cx={x} cy={22} rx="3" ry="4" fill="rgba(200,200,220,0.2)" style={{ animation: `smokeRise 1.5s ease-out ${i * 0.2}s infinite` }} />
              <ellipse cx={x + 3} cy={15} rx="2" ry="3" fill="rgba(200,200,220,0.15)" style={{ animation: `smokeRise 1.8s ease-out ${i * 0.3 + 0.3}s infinite` }} />
            </g>
          )}
        </g>
      ))}

      {/* Slice overlay when cut */}
      {sliced && (
        <g>
          <polygon
            points="140,65 155,260 125,260"
            fill="rgba(255,107,181,0.3)"
            stroke="#ffd700"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <line x1="140" y1="65" x2="125" y2="260" stroke="#ffd700" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
          <line x1="140" y1="65" x2="155" y2="260" stroke="#ffd700" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
        </g>
      )}

      {/* Decorative stars */}
      <text x="40" y="80" fontSize="14" opacity="0.4">✨</text>
      <text x="230" y="75" fontSize="12" opacity="0.3">⭐</text>
      <text x="25" y="175" fontSize="10" opacity="0.3">💫</text>
      <text x="242" y="170" fontSize="11" opacity="0.3">✨</text>
    </svg>
  );
}

/* ---- Confetti Layer ---- */
function ConfettiLayer({ pieces }) {
  if (!pieces.length) return null;
  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            background: p.color,
            borderRadius: p.borderRadius,
            transform: `rotate(${p.rotate})`,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ---- Main Cake Section ---- */
export default function CakeCutting() {
  const [phase, setPhase] = useState('idle'); // idle | blown | sliced | done
  const [confetti, setConfetti] = useState([]);

  const handleCakeClick = useCallback(() => {
    if (phase === 'idle') {
      setPhase('blown');
      setTimeout(() => setPhase('sliced'), 1000);
      setTimeout(() => {
        setPhase('done');
        setConfetti(createConfettiPieces(150));
        setTimeout(() => setConfetti([]), 5000);
      }, 2000);
    } else if (phase === 'done') {
      // Reset for fun
      setPhase('idle');
      setConfetti([]);
    }
  }, [phase]);

  const blownOut = phase === 'blown' || phase === 'sliced' || phase === 'done';
  const sliced = phase === 'sliced' || phase === 'done';

  return (
    <>
      <ConfettiLayer pieces={confetti} />

      <section className="cake-section" id="cake-section">
        <h2 className="section-title">Make a Wish! 🕯️</h2>
        <p className="section-subtitle">Click the cake to cut it and celebrate! 🎂</p>

        <div className="cake-container">
          <div
            id="birthday-cake"
            className="cake-wrapper"
            onClick={handleCakeClick}
            role="button"
            tabIndex={0}
            aria-label="Click to cut the birthday cake"
            onKeyDown={(e) => e.key === 'Enter' && handleCakeClick()}
          >
            <BirthdayCake blownOut={blownOut} sliced={sliced} />
          </div>

          {phase === 'idle' && (
            <p className="cake-instruction">
              🎂 Tap the cake to blow out the candles! 🎂
            </p>
          )}
          {phase === 'blown' && (
            <p className="cake-instruction" style={{ color: 'var(--pink-light)' }}>
              💨 The candles are out! Cutting the cake...
            </p>
          )}
          {phase === 'sliced' && (
            <p className="cake-instruction" style={{ color: 'var(--gold)' }}>
              🔪 Cake is cut! Here's your slice! 🍰
            </p>
          )}
          {phase === 'done' && (
            <div>
              <p className="cake-wish-text">🌟 Your Wish is Granted! 🌟</p>
              <p className="cake-instruction" style={{ marginTop: '0.5rem', color: 'var(--pink-light)' }}>
                May all your dreams come true, Shagun! 💕
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                (Click cake again to reset ✨)
              </p>
            </div>
          )}

          {/* Decorative sparkles around cake */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '1.5rem', opacity: 0.6 }}>
            {['🌸', '💕', '✨', '💫', '🌺'].map((em, i) => (
              <span key={i} style={{
                animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
                display: 'inline-block',
              }}>{em}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
