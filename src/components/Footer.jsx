import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-hearts">
        💖 💕 💖
      </div>

      <p className="footer-text">
        Happy Birthday, Shagun! 🎂
      </p>

      <p className="footer-sub">
        May every day of your life be as magical as today ✨
      </p>

      <p className="footer-sub" style={{ marginTop: '0.4rem', fontSize: '0.75rem' }}>
        With love & best wishes 🌸 | {year}
      </p>

      <div className="footer-decorations">
        {['🌸', '🦋', '💕', '✨', '🌺', '💫', '🎀', '🌷', '⭐'].map((em, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              animation: `float ${2.5 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {em}
          </span>
        ))}
      </div>

      {/* Signature — subtle, bottom right */}
      <div className="footer-signature" title="Made with ❤️ by Hariom">
        made by Hariom
      </div>
    </footer>
  );
}
