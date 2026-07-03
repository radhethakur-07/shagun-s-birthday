import React from 'react';
import Hero from './components/Hero';
import CakeCutting from './components/CakeCutting';
import SpecialMessage from './components/SpecialMessage';
import Gallery from './components/Gallery';
import FloatingElements from './components/FloatingElements';
import MusicPlayer from './components/MusicPlayer';
import Footer from './components/Footer';

export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Global floating layer (petals + drifting emojis) */}
      <FloatingElements />

      {/* Floating music player — fixed bottom-left */}
      <MusicPlayer />

      {/* Page sections */}
      <main>
        <Hero />
        <CakeCutting />
        <SpecialMessage />
        <Gallery />
        <Footer />
      </main>
    </div>
  );
}
