import React, { useState, useCallback, useEffect, useRef } from 'react';

/* ============================================================
   CANVAS CONFETTI ENGINE — physics-based particles
============================================================ */
function ConfettiCanvas({ active }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      '#ff6bb5','#c77dff','#ffd700','#ff9fd4',
      '#7fff9f','#64dfdf','#ff9f50','#ffc0cb',
      '#e040fb','#40c4ff','#ffee58','#a5d6a7',
    ];

    // burst from centre-ish
    const cx = canvas.width  * 0.5;
    const cy = canvas.height * 0.42;

    const drawStar = (ctx, r) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? r : r * 0.45;
        const angle  = (i * Math.PI) / 5 - Math.PI / 2;
        ctx[i === 0 ? 'moveTo' : 'lineTo'](
          Math.cos(angle) * radius,
          Math.sin(angle) * radius
        );
      }
      ctx.closePath();
      ctx.fill();
    };

    const particles = Array.from({ length: 200 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 4;
      return {
        x:    cx + (Math.random() - 0.5) * 40,
        y:    cy + (Math.random() - 0.5) * 40,
        vx:   Math.cos(angle) * speed,
        vy:   Math.sin(angle) * speed - 6,
        gravity: 0.28 + Math.random() * 0.15,
        color: colors[i % colors.length],
        size:  Math.random() * 11 + 5,
        rot:   Math.random() * 360,
        rotV:  (Math.random() - 0.5) * 9,
        opacity: 1,
        shape: i % 4, // 0=rect 1=circle 2=triangle 3=star
      };
    });

    let startTime = null;
    const DURATION = 5000;

    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        if (p.opacity <= 0.01) return;
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += p.gravity;
        p.rot += p.rotV;
        p.opacity = Math.max(0, 1 - elapsed / DURATION);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle   = p.color;

        switch (p.shape) {
          case 0:
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            break;
          case 1:
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 2:
            ctx.beginPath();
            ctx.moveTo(0, -p.size / 2);
            ctx.lineTo(p.size / 2, p.size / 2);
            ctx.lineTo(-p.size / 2, p.size / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case 3:
            drawStar(ctx, p.size / 2);
            break;
        }
        ctx.restore();
      });

      if (elapsed < DURATION) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 1000,
        display: active ? 'block' : 'none',
      }}
    />
  );
}

/* ============================================================
   TEDDY BEAR SVG — 4 poses driven by `pose` prop
   poses: 'idle' | 'blowing' | 'excited' | 'celebrating'
============================================================ */
function TeddyBear({ pose }) {
  const isBlowing     = pose === 'blowing';
  const isExcited     = pose === 'excited';
  const isCelebrating = pose === 'celebrating';

  /* dynamic mouth path */
  const mouthD = isBlowing
    ? 'M 82 112 Q 100 107 118 112'     // pursed blow
    : isCelebrating
    ? 'M 79 107 Q 100 126 121 107'     // huge smile
    : isExcited
    ? 'M 81 109 Q 100 123 119 109'     // excited smile
    : 'M 83 111 Q 100 122 117 111';    // gentle smile

  /* arm rotation */
  const leftArmRot  = isCelebrating ? -55 : isBlowing ? -18 : -22;
  const rightArmRot = isCelebrating ?  55 : isBlowing ?  12 :  22;

  /* eye ry (squish when blowing) */
  const eyeRY = isBlowing ? 5.5 : 9;

  /* animation on wrapper */
  const wrapperAnim = isCelebrating
    ? 'teddyCelebrate 0.75s ease-in-out infinite'
    : 'teddyBounce 2.2s ease-in-out infinite';

  return (
    <svg
      viewBox="0 0 200 285"
      style={{
        width: '100%',
        animation: wrapperAnim,
        filter: 'drop-shadow(0 8px 22px rgba(255, 107, 181, 0.35))',
        overflow: 'visible',
      }}
      aria-label="Teddy bear character"
    >
      {/* ---- Shadow ---- */}
      <ellipse cx="100" cy="278" rx="54" ry="7" fill="rgba(0,0,0,0.18)" />

      {/* ---- Gradient defs ---- */}
      <defs>
        <radialGradient id="tBodyGrad" cx="40%" cy="35%">
          <stop offset="0%"   stopColor="#d99444" />
          <stop offset="100%" stopColor="#a05c1e" />
        </radialGradient>
        <radialGradient id="tTummyGrad" cx="40%" cy="30%">
          <stop offset="0%"   stopColor="#f0c880" />
          <stop offset="100%" stopColor="#d4934a" />
        </radialGradient>
        <radialGradient id="tHeadGrad" cx="38%" cy="32%">
          <stop offset="0%"   stopColor="#d99444" />
          <stop offset="100%" stopColor="#9e561a" />
        </radialGradient>
        <radialGradient id="tEarInner" cx="38%" cy="38%">
          <stop offset="0%"   stopColor="#f0b06a" />
          <stop offset="100%" stopColor="#c47830" />
        </radialGradient>
        <filter id="tShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>

      {/* ---- BODY ---- */}
      <ellipse cx="100" cy="198" rx="53" ry="60" fill="url(#tBodyGrad)" filter="url(#tShadow)" />
      {/* Tummy */}
      <ellipse cx="100" cy="208" rx="34" ry="40" fill="url(#tTummyGrad)" opacity="0.75" />
      <ellipse cx="100" cy="208" rx="26" ry="30" fill="none" stroke="#d4934a" strokeWidth="1.2" opacity="0.3" />

      {/* ---- LEGS ---- */}
      <ellipse cx="73"  cy="252" rx="25" ry="19" fill="#b06c20" />
      <ellipse cx="127" cy="252" rx="25" ry="19" fill="#b06c20" />
      {/* Paw pads */}
      <ellipse cx="73"  cy="262" rx="14" ry="8" fill="#e8b87a" opacity="0.85" />
      <ellipse cx="127" cy="262" rx="14" ry="8" fill="#e8b87a" opacity="0.85" />
      <circle cx="66"  cy="260" r="3"  fill="#c4843c" opacity="0.5" />
      <circle cx="73"  cy="263" r="3"  fill="#c4843c" opacity="0.5" />
      <circle cx="80"  cy="260" r="3"  fill="#c4843c" opacity="0.5" />
      <circle cx="120" cy="260" r="3"  fill="#c4843c" opacity="0.5" />
      <circle cx="127" cy="263" r="3"  fill="#c4843c" opacity="0.5" />
      <circle cx="134" cy="260" r="3"  fill="#c4843c" opacity="0.5" />

      {/* ---- LEFT ARM ---- */}
      <g style={{ transformOrigin: '50px 145px', transform: `rotate(${leftArmRot}deg)`, transition: 'transform 0.45s ease' }}>
        <ellipse cx="46" cy="178" rx="21" ry="36" fill="#c4843c" />
        <ellipse cx="36" cy="207" rx="14" ry="10" fill="#b06c20" />
        {/* Paw claws */}
        <circle cx="30" cy="204" r="2.5" fill="#9e561a" opacity="0.5" />
        <circle cx="36" cy="210" r="2.5" fill="#9e561a" opacity="0.5" />
        <circle cx="42" cy="206" r="2.5" fill="#9e561a" opacity="0.5" />
      </g>

      {/* ---- RIGHT ARM ---- */}
      <g style={{ transformOrigin: '150px 145px', transform: `rotate(${rightArmRot}deg)`, transition: 'transform 0.45s ease' }}>
        <ellipse cx="154" cy="178" rx="21" ry="36" fill="#c4843c" />
        <ellipse cx="164" cy="207" rx="14" ry="10" fill="#b06c20" />
        {/* Paw claws */}
        <circle cx="158" cy="204" r="2.5" fill="#9e561a" opacity="0.5" />
        <circle cx="164" cy="210" r="2.5" fill="#9e561a" opacity="0.5" />
        <circle cx="170" cy="206" r="2.5" fill="#9e561a" opacity="0.5" />
      </g>

      {/* ---- HEAD ---- */}
      <circle cx="100" cy="88" r="60" fill="url(#tHeadGrad)" filter="url(#tShadow)" />

      {/* ---- EARS ---- */}
      <circle cx="50"  cy="42" r="25" fill="#c4843c" />
      <circle cx="150" cy="42" r="25" fill="#c4843c" />
      <circle cx="50"  cy="42" r="15" fill="url(#tEarInner)" />
      <circle cx="150" cy="42" r="15" fill="url(#tEarInner)" />

      {/* ---- BIRTHDAY HAT ---- */}
      <polygon points="100,5 68,52 132,52" fill="#ff6bb5" />
      <rect x="68" y="47" width="64" height="9" rx="4.5" fill="#ffd700" />
      {/* hat polka dots */}
      {[[82,28],[95,18],[108,30],[100,40],[88,38]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="rgba(255,255,255,0.6)" />
      ))}
      {/* hat star */}
      <text x="100" y="22" textAnchor="middle" fontSize="13" style={{ userSelect:'none' }}>⭐</text>
      {/* hat ribbon */}
      <path d="M80,48 Q100,42 120,48" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

      {/* ---- EYES ---- */}
      <ellipse cx="78"  cy="82" rx="11" ry={eyeRY} fill="#1a0808" style={{ transition: 'ry 0.3s' }} />
      <ellipse cx="122" cy="82" rx="11" ry={eyeRY} fill="#1a0808" style={{ transition: 'ry 0.3s' }} />
      {/* eye shine */}
      {!isBlowing && (
        <>
          <circle cx="83"  cy="77" r="4" fill="white" />
          <circle cx="127" cy="77" r="4" fill="white" />
          <circle cx="80"  cy="82" r="1.5" fill="white" opacity="0.5" />
          <circle cx="124" cy="82" r="1.5" fill="white" opacity="0.5" />
        </>
      )}
      {/* celebrating sparkles near eyes */}
      {isCelebrating && (
        <>
          <text x="62"  y="70" fontSize="13" style={{ animation: 'sparkleAppear 0.9s ease-in-out infinite', userSelect:'none' }}>✨</text>
          <text x="112" y="70" fontSize="12" style={{ animation: 'sparkleAppear 0.9s 0.3s ease-in-out infinite', userSelect:'none' }}>⭐</text>
        </>
      )}

      {/* ---- BLUSH ---- */}
      <ellipse cx="58"  cy="98" rx="13" ry="8" fill="#ff9fd4" opacity={isBlowing ? 0.9 : 0.5} style={{ transition: 'opacity 0.4s' }} />
      <ellipse cx="142" cy="98" rx="13" ry="8" fill="#ff9fd4" opacity={isBlowing ? 0.9 : 0.5} style={{ transition: 'opacity 0.4s' }} />

      {/* ---- NOSE ---- */}
      <ellipse cx="100" cy="101" rx="9" ry="6.5" fill="#d4526a" />
      <ellipse cx="99"  cy="99"  rx="4" ry="2.5" fill="rgba(255,255,255,0.45)" />

      {/* ---- MOUTH ---- */}
      <path d={mouthD} stroke="#7a3020" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ transition: 'd 0.35s' }} />

      {/* ---- BLOW BUBBLES (only when blowing) ---- */}
      {isBlowing && (
        <g>
          <circle cx="128" cy="112" r="5"  fill="rgba(180,220,255,0.35)" style={{ animation: 'blowBubble 0.85s ease-out infinite' }} />
          <circle cx="143" cy="107" r="8"  fill="rgba(180,220,255,0.22)" style={{ animation: 'blowBubble 0.85s ease-out 0.22s infinite' }} />
          <circle cx="160" cy="103" r="6"  fill="rgba(180,220,255,0.15)" style={{ animation: 'blowBubble 0.85s ease-out 0.44s infinite' }} />
        </g>
      )}

      {/* ---- BOW TIE ---- */}
      <polygon points="87,142 100,149 87,156" fill="#ff6bb5" />
      <polygon points="113,142 100,149 113,156" fill="#ff6bb5" />
      <circle cx="100" cy="149" r="5.5" fill="#c77dff" />
      <circle cx="100" cy="149" r="2.5" fill="rgba(255,255,255,0.5)" />

      {/* ---- CELEBRATING STARS around body ---- */}
      {isCelebrating && (
        <>
          <text x="16"  y="82"  fontSize="15" style={{ animation: 'sparkleAppear 1s ease-in-out infinite', userSelect:'none' }}>✨</text>
          <text x="165" y="78"  fontSize="13" style={{ animation: 'sparkleAppear 1s 0.4s ease-in-out infinite', userSelect:'none' }}>💫</text>
          <text x="20"  y="165" fontSize="12" style={{ animation: 'sparkleAppear 1s 0.8s ease-in-out infinite', userSelect:'none' }}>⭐</text>
          <text x="163" y="162" fontSize="12" style={{ animation: 'sparkleAppear 1s 1.2s ease-in-out infinite', userSelect:'none' }}>✨</text>
        </>
      )}
    </svg>
  );
}

/* ============================================================
   BIRTHDAY CAKE SVG — gorgeous 3-tier cake
============================================================ */
function BirthdayCake({ phase }) {
  const blownOut = phase !== 'idle';
  const isSliced = phase === 'sliced' || phase === 'done';
  const isDone   = phase === 'done';

  const candles = [
    { x: 108, color: '#ff6bb5', stripe: '#ff9fd4' },
    { x: 138, color: '#c77dff', stripe: '#ddb0ff' },
    { x: 168, color: '#ffd700', stripe: '#ffe880' },
  ];

  return (
    <svg
      viewBox="0 0 280 330"
      style={{
        width: '100%',
        filter: 'drop-shadow(0 12px 30px rgba(255, 107, 181, 0.4))',
        cursor: phase === 'idle' ? 'pointer' : 'default',
        overflow: 'visible',
      }}
      aria-label="Birthday cake — click to celebrate"
    >
      <defs>
        {/* Tier gradients */}
        <linearGradient id="t1G" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c77dff" />
          <stop offset="100%" stopColor="#6b21d6" />
        </linearGradient>
        <linearGradient id="t2G" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ff80c0" />
          <stop offset="100%" stopColor="#cc2d7a" />
        </linearGradient>
        <linearGradient id="t3G" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffe566" />
          <stop offset="100%" stopColor="#e09000" />
        </linearGradient>
        {/* Plate gradient */}
        <radialGradient id="plateG" cx="50%" cy="40%">
          <stop offset="0%"   stopColor="#ddd0f0" />
          <stop offset="100%" stopColor="#9080b8" />
        </radialGradient>
        {/* Blade gradient */}
        <linearGradient id="bladeG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#cccccc" />
          <stop offset="45%"  stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#999999" />
        </linearGradient>
        <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── PLATE ── */}
      <ellipse cx="140" cy="308" rx="118" ry="15" fill="url(#plateG)" />
      <ellipse cx="140" cy="305" rx="110" ry="9"  fill="rgba(255,255,255,0.15)" />

      {/* ── BOTTOM TIER ── */}
      <rect x="22"  y="212" width="236" height="88" rx="16" fill="url(#t1G)" />
      {/* top frosting */}
      <rect x="22"  y="207" width="236" height="11" rx="5.5" fill="rgba(255,255,255,0.92)" />
      {/* drips */}
      {[36,56,76,96,116,136,156,176,196,216,236].map((x, i) => (
        <ellipse key={i} cx={x+4} cy="213" rx="8" ry="11" fill="rgba(255,255,255,0.88)" />
      ))}
      {/* horizontal band */}
      <rect x="22" y="244" width="236" height="8" rx="0" fill="rgba(255,255,255,0.15)" />
      {/* gold dots */}
      {[52,90,130,170,210,250].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="268" r="9"   fill="rgba(255,215,0,0.55)" />
          <circle cx={x} cy="268" r="4.5" fill="rgba(255,255,255,0.55)" />
        </g>
      ))}
      {/* bottom stripe */}
      <rect x="22" y="292" width="236" height="8" rx="4" fill="rgba(255,107,181,0.55)" />

      {/* ── MIDDLE TIER ── */}
      <rect x="52"  y="132" width="176" height="84" rx="14" fill="url(#t2G)" />
      <rect x="52"  y="127" width="176" height="10" rx="5" fill="rgba(255,255,255,0.92)" />
      {[62,80,98,116,134,152,170,188,206].map((x, i) => (
        <ellipse key={i} cx={x+4} cy="133" rx="7" ry="10" fill="rgba(255,255,255,0.88)" />
      ))}
      {/* "Happy Birthday" banner */}
      <text x="140" y="172" textAnchor="middle" fontSize="11.5"
        fill="rgba(255,255,255,0.92)" fontFamily="Dancing Script, cursive" fontWeight="bold"
        style={{ userSelect:'none' }}>
        Happy Birthday!
      </text>
      {/* swirl decorations */}
      {[82,140,198].map((x, i) => (
        <path key={i} d={`M${x-10},192 Q${x},182 ${x+10},192 Q${x},202 ${x-10},192`}
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" />
      ))}
      {/* flower emojis */}
      <text x="80"  y="205" textAnchor="middle" fontSize="15" style={{ userSelect:'none' }}>💕</text>
      <text x="140" y="205" textAnchor="middle" fontSize="15" style={{ userSelect:'none' }}>🌸</text>
      <text x="200" y="205" textAnchor="middle" fontSize="15" style={{ userSelect:'none' }}>💕</text>
      <rect x="52" y="208" width="176" height="8" rx="4" fill="rgba(255,215,0,0.55)" />

      {/* ── TOP TIER ── */}
      <rect x="90"  y="68" width="100" height="68" rx="12" fill="url(#t3G)" />
      <rect x="90"  y="63" width="100" height="10" rx="5" fill="rgba(255,255,255,0.92)" />
      {[95,107,119,131,143,155,167,179].map((x, i) => (
        <ellipse key={i} cx={x+3} cy="69" rx="5" ry="8" fill="rgba(255,255,255,0.88)" />
      ))}
      {/* flower topper */}
      <text x="140" y="115" textAnchor="middle" fontSize="22" style={{ userSelect:'none' }}>🌺</text>
      <rect x="90" y="128" width="100" height="8" rx="4" fill="rgba(255,107,181,0.65)" />

      {/* ── CANDLES ── */}
      {candles.map((c, i) => (
        <g key={i}>
          <rect x={c.x - 6} y={blownOut ? 34 : 28} width="12" height={blownOut ? 35 : 40} rx="4" fill={c.color} />
          <rect x={c.x - 6} y={blownOut ? 46 : 40} width="12" height="5" rx="1.5" fill={c.stripe} opacity="0.85" />
          <rect x={c.x - 2} y={blownOut ? 36 : 30} width="3"  height={blownOut ? 29 : 35} rx="1.5" fill="rgba(255,255,255,0.4)" />

          {!blownOut ? (
            /* Flame */
            <g filter="url(#glow2)">
              <ellipse cx={c.x} cy={17} rx="6.5" ry="12"
                fill="#ffcc00"
                style={{ animation: `candle-flame ${0.7 + i * 0.15}s ease-in-out infinite`, transformOrigin: `${c.x}px 29px` }} />
              <ellipse cx={c.x} cy={19} rx="4.5" ry="9"  fill="#ff9f00" opacity="0.9" />
              <ellipse cx={c.x} cy={21} rx="2.5" ry="5.5" fill="#fffacc" opacity="0.85" />
              <ellipse cx={c.x} cy={20} rx="11"  ry="14"  fill="#ffcc00" opacity="0.12"
                style={{ animation: `flameGlow ${0.9 + i * 0.1}s ease-in-out infinite` }} />
            </g>
          ) : (
            /* Smoke wisps */
            [0, 0.28, 0.56].map((delay, j) => (
              <ellipse key={j}
                cx={c.x + (j - 1) * 3}
                cy={24 - j * 8}
                rx={3 - j * 0.4}
                ry={4 - j * 0.5}
                fill={`rgba(200,200,225,${0.3 - j * 0.08})`}
                style={{ animation: `smokeRise ${1 + j * 0.3}s ease-out ${i * 0.22 + delay}s infinite` }} />
            ))
          )}
        </g>
      ))}

      {/* ── CUT LINES (sliced) ── */}
      {isSliced && (
        <g style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
          <line x1="140" y1="63" x2="115" y2="300" stroke="#ffd700" strokeWidth="2"   strokeDasharray="6 3" opacity="0.9" />
          <line x1="140" y1="63" x2="165" y2="300" stroke="#ffd700" strokeWidth="2"   strokeDasharray="6 3" opacity="0.9" />
          <polygon points="140,63 115,300 165,300" fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.25)" strokeWidth="1" />
          {/* inner cream layers visible on cut */}
          <line x1="140" y1="130" x2="124" y2="300" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
          <line x1="140" y1="212" x2="128" y2="300" stroke="rgba(255,215,0,0.15)"  strokeWidth="6" />
        </g>
      )}

      {/* ── SPARKLES on done ── */}
      {isDone && (
        <>
          <text x="30"  y="95"  fontSize="14" style={{ animation: 'sparkleAppear 1.1s ease-in-out infinite',       userSelect:'none' }}>✨</text>
          <text x="228" y="88"  fontSize="12" style={{ animation: 'sparkleAppear 1.1s 0.45s ease-in-out infinite',  userSelect:'none' }}>⭐</text>
          <text x="22"  y="195" fontSize="10" style={{ animation: 'sparkleAppear 1.1s 0.9s ease-in-out infinite',   userSelect:'none' }}>💫</text>
          <text x="236" y="190" fontSize="11" style={{ animation: 'sparkleAppear 1.1s 1.35s ease-in-out infinite',  userSelect:'none' }}>✨</text>
        </>
      )}
    </svg>
  );
}

/* ============================================================
   KNIFE SVG
============================================================ */
function CuttingKnife({ phase }) {
  const show    = phase === 'cutting' || phase === 'sliced' || phase === 'done';
  const wobble  = phase === 'sliced' || phase === 'done';
  if (!show) return null;

  return (
    <div
      className={`knife-wrap ${wobble ? 'idle-knife' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 56 190" style={{ width: '100%', filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.55))' }}>
        <defs>
          <linearGradient id="bladeGradK" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#b8b8b8" />
            <stop offset="48%"  stopColor="#f8f8f8" />
            <stop offset="100%" stopColor="#909090" />
          </linearGradient>
        </defs>
        {/* Handle */}
        <rect x="20" y="96" width="16" height="84" rx="8" fill="#6B3A1F" />
        <rect x="24" y="101" width="6"  height="74" rx="3" fill="#8B5E3C" opacity="0.55" />
        {/* Handle rivets */}
        <circle cx="28" cy="115" r="3" fill="#c4843c" opacity="0.7" />
        <circle cx="28" cy="135" r="3" fill="#c4843c" opacity="0.7" />
        <circle cx="28" cy="155" r="3" fill="#c4843c" opacity="0.7" />
        {/* Guard */}
        <rect x="14" y="90" width="28" height="10" rx="5" fill="#C0C0C0" />
        <rect x="14" y="90" width="28" height="4"  rx="2" fill="rgba(255,255,255,0.3)" />
        {/* Blade body */}
        <polygon points="28,90 22,10 34,90" fill="url(#bladeGradK)" />
        {/* Blade edge highlight */}
        <polygon points="28,90 22,10 28,90" fill="rgba(255,255,255,0.4)" />
        {/* Blade spine */}
        <line x1="28" y1="14" x2="28" y2="88" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
        {/* Blade reflection glint */}
        <line x1="26" y1="30" x2="30" y2="75" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
        {/* Tip */}
        <polygon points="22,10 28,2 34,10" fill="#e0e0e0" />
      </svg>
    </div>
  );
}

/* ============================================================
   PHASE LABEL COMPONENT
============================================================ */
const PHASE_INFO = {
  idle:     { text: '🎂 Tap the cake to celebrate with Teddy!', color: 'var(--text-muted)' },
  blowing:  { text: '💨 Teddy is blowing out the candles…',     color: 'var(--pink-light)' },
  cutting:  { text: '🔪 Now cutting the cake!',                  color: 'var(--gold)' },
  sliced:   { text: '🍰 The slice is ready!',                    color: 'var(--purple)' },
  done:     { text: '🎉 Your wish is granted, Shagun!',           color: 'var(--gold)' },
};

/* ============================================================
   MAIN EXPORTED COMPONENT
============================================================ */
export default function CakeCutting() {
  const [phase,       setPhase]       = useState('idle');
  const [teddyPose,   setTeddyPose]   = useState('idle');
  const [confetti,    setConfetti]    = useState(false);
  const [msgKey,      setMsgKey]      = useState(0); // force re-animation on msg change

  const handleCakeClick = useCallback(() => {
    if (phase !== 'idle') return;

    // 1 — Blowing (0 → 1.6s)
    setPhase('blowing');
    setTeddyPose('blowing');
    setMsgKey(k => k + 1);

    // 2 — Cutting (1.6 → 3.2s)
    setTimeout(() => {
      setPhase('cutting');
      setTeddyPose('excited');
      setMsgKey(k => k + 1);
    }, 1600);

    // 3 — Sliced (3.2 → 4.4s)
    setTimeout(() => {
      setPhase('sliced');
      setMsgKey(k => k + 1);
    }, 3200);

    // 4 — Done! (4.4s+)
    setTimeout(() => {
      setPhase('done');
      setTeddyPose('celebrating');
      setConfetti(true);
      setMsgKey(k => k + 1);
      // Stop confetti after 5.5s but keep done phase
      setTimeout(() => setConfetti(false), 5500);
    }, 4400);
  }, [phase]);

  const handleReset = useCallback(() => {
    setPhase('idle');
    setTeddyPose('idle');
    setConfetti(false);
    setMsgKey(k => k + 1);
  }, []);

  const { text: msgText, color: msgColor } = PHASE_INFO[phase];

  return (
    <>
      <ConfettiCanvas active={confetti} />

      <section className="cake-section" id="cake-section">
        <h2 className="section-title">Make a Wish! 🕯️</h2>
        <p className="section-subtitle">Teddy wants to celebrate with you! 🧸✨</p>

        {/* ── STAGE ── */}
        <div className="cake-stage">

          {/* Teddy column */}
          <div className="teddy-col">
            <TeddyBear pose={teddyPose} />
            {/* Speech bubble */}
            <div style={{
              background: 'rgba(255,107,181,0.15)',
              border: '1px solid rgba(255,107,181,0.35)',
              borderRadius: '14px',
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              color: 'var(--pink-light)',
              marginTop: '0.5rem',
              textAlign: 'center',
              maxWidth: '130px',
              backdropFilter: 'blur(8px)',
              animation: 'fadeSlideUp 0.5s ease both',
              lineHeight: 1.4,
            }}>
              {phase === 'idle'      && '🧸 Let\'s party!'}
              {phase === 'blowing'   && '💨 Phew!! 🎂'}
              {phase === 'cutting'   && '🔪 Yay yay yay!'}
              {phase === 'sliced'    && '🍰 Ooh tasty!'}
              {phase === 'done'      && '🎉 HURRAY!! 🎉'}
            </div>
          </div>

          {/* Cake + knife column */}
          <div
            className="cake-col"
            data-idle={phase === 'idle' ? 'true' : 'false'}
            onClick={phase === 'idle' ? handleCakeClick : undefined}
            role={phase === 'idle' ? 'button' : undefined}
            tabIndex={phase === 'idle' ? 0 : undefined}
            aria-label="Click to cut the birthday cake"
            onKeyDown={(e) => e.key === 'Enter' && phase === 'idle' && handleCakeClick()}
          >
            <CuttingKnife phase={phase} />
            <BirthdayCake phase={phase} />
          </div>
        </div>

        {/* ── BOTTOM MESSAGES ── */}
        <div className="cake-stage-bottom">
          <p
            key={msgKey}
            className="phase-msg"
            style={{ color: msgColor }}
          >
            {msgText}
          </p>

          {phase === 'done' && (
            <div style={{ animation: 'fadeSlideUp 0.6s ease both' }}>
              <p className="cake-wish-text">🌟 Happy Birthday Shagun! 🌟</p>
              <p style={{ color: 'var(--pink-light)', fontSize: '0.92rem', marginTop: '0.4rem' }}>
                May every dream of yours come true! 💕
              </p>
              <button
                id="cake-reset-btn"
                className="reset-btn"
                onClick={handleReset}
              >
                🔄 Celebrate Again!
              </button>
            </div>
          )}
        </div>

        {/* ── BOTTOM DECO ── */}
        <div style={{ display:'flex', justifyContent:'center', gap:'2rem', marginTop:'2rem', fontSize:'1.35rem', opacity:0.5 }}>
          {['🌸','💕','✨','💫','🌺'].map((em, i) => (
            <span key={i} style={{
              display:'inline-block',
              animation:`float ${2.2 + i * 0.3}s ease-in-out infinite`,
              animationDelay:`${i * 0.4}s`,
            }}>{em}</span>
          ))}
        </div>
      </section>
    </>
  );
}
