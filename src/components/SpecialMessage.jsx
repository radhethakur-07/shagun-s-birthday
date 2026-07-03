import React from 'react';

export default function SpecialMessage() {
  return (
    <section className="message-section" id="message">
      <h2 className="section-title">A Special Message 💌</h2>
      <p className="section-subtitle">From a friend who is glad to have you 🌸</p>

      <div className="message-card">
        {/* Corner decorations */}
        <div className="message-card-deco tl">🌸</div>
        <div className="message-card-deco tr">✨</div>
        <div className="message-card-deco bl">💫</div>
        <div className="message-card-deco br">🌺</div>

        <p className="message-from">✦ A heartfelt note just for you ✦</p>

        <p className="message-text">
          Hey <span className="highlight">Shagun</span>! 🌸
          <br /><br />
          On this beautiful day, I just want you to know how truly{' '}
          <span className="highlight">special</span> you are.
          From the very first moment we met, I knew you were someone
          worth knowing — your{' '}
          <span className="highlight">smile, your laugh, your warmth</span>{' '}
          — everything about you is absolutely wonderful.
          <br /><br />
          You're not just a <span className="highlight">new friend</span>;
          you're already someone who makes ordinary moments feel brighter
          just by being around. The world is a genuinely better place
          with you in it, and I feel so lucky our paths crossed. 💕
          <br /><br />
          On your birthday, I hope the universe gives you back every
          bit of <span className="highlight">joy and kindness</span> you
          pour into others — because you deserve it all and so much more!
          May this year bring you endless adventures, beautiful
          memories, and all the happiness your heart can hold. 🌟
          <br /><br />
          Here's to you, Shagun — the girl with the
          <span className="highlight"> golden heart</span>. 🎂✨
        </p>

        <div className="message-signature">
          — Your friend, always 🌸
        </div>

        <div className="message-hearts">
          💖 &nbsp; 💕 &nbsp; 💗 &nbsp; 💖 &nbsp; 💕
        </div>
      </div>

      {/* Floating petals around message */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '3rem', fontSize: '2rem', opacity: 0.4 }}>
        {['🌷', '🦋', '🌸', '🦋', '🌷'].map((em, i) => (
          <span key={i} style={{
            display: 'inline-block',
            animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}>{em}</span>
        ))}
      </div>
    </section>
  );
}
