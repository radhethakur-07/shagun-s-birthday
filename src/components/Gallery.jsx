import React, { useState } from 'react';
import { photos } from '../data/photos';

const PLACEHOLDER_ITEMS = [
  { icon: '🌸', label: 'Add a photo here!' },
  { icon: '💕', label: 'Add a photo here!' },
  { icon: '✨', label: 'Add a photo here!' },
  { icon: '🌺', label: 'Add a photo here!' },
  { icon: '🦋', label: 'Add a photo here!' },
  { icon: '💫', label: 'Add a photo here!' },
];

function PlaceholderGallery() {
  return (
    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
      <div className="gallery-placeholder">
        <div className="gallery-placeholder-icon">📸</div>
        <h3>Shagun's Photo Gallery</h3>
        <p>
          Add beautiful photos of Shagun here! Simply:
        </p>
        <p>
          1. Create a <code>public/photos/</code> folder in the project<br />
          2. Add your photos (e.g., <code>photo1.jpg</code>)<br />
          3. Edit <code>src/data/photos.js</code> and uncomment the entries
        </p>
      </div>

      {/* Decorative placeholder cards */}
      <div className="gallery-grid" style={{ marginTop: '2rem' }}>
        {PLACEHOLDER_ITEMS.map((item, i) => (
          <div
            key={i}
            className="gallery-item"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,181,0.08), rgba(199,125,255,0.08))',
              border: '2px dashed rgba(255,107,181,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: i % 2 === 0 ? '180px' : '140px',
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>{item.icon}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotoGrid({ photos, onPhotoClick }) {
  return (
    <div className="gallery-grid">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className="gallery-item"
          style={{ animationDelay: `${i * 0.08}s` }}
          onClick={() => onPhotoClick(photo)}
          role="button"
          tabIndex={0}
          aria-label={`View photo: ${photo.caption || 'Gallery photo'}`}
          onKeyDown={(e) => e.key === 'Enter' && onPhotoClick(photo)}
        >
          <img
            src={photo.src}
            alt={photo.caption || `Shagun photo ${photo.id}`}
            loading="lazy"
            style={{ minHeight: photo.span === 2 ? '280px' : '160px', objectFit: 'cover' }}
          />
          {photo.caption && (
            <div className="gallery-overlay">
              <p className="gallery-caption">{photo.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Lightbox({ photo, onClose }) {
  if (!photo) return null;
  return (
    <div
      className="lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      <button
        id="lightbox-close-btn"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        ✕
      </button>
      <img
        src={photo.src}
        alt={photo.caption || 'Gallery photo'}
        onClick={(e) => e.stopPropagation()}
      />
      {photo.caption && (
        <p className="lightbox-caption">{photo.caption}</p>
      )}
    </div>
  );
}

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const hasPhotos = photos.length > 0;

  return (
    <section className="gallery-section" id="gallery">
      <h2 className="section-title">Shagun's Gallery 📸</h2>
      <p className="section-subtitle">
        {hasPhotos
          ? 'Tap any photo to view it ✨'
          : 'Memories waiting to be added 🌸'}
      </p>

      {hasPhotos
        ? <PhotoGrid photos={photos} onPhotoClick={setSelectedPhoto} />
        : <PlaceholderGallery />
      }

      <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />

      {/* Bottom decoration */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        fontSize: '1.5rem',
        opacity: 0.4,
        letterSpacing: '1rem',
      }}>
        🌸 💕 🌟 💕 🌸
      </div>
    </section>
  );
}
