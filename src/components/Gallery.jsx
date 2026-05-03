import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/*
  images: [{ src: '/images/...', alt: '...', wide?: boolean }]
  className: extra class on the grid (e.g. 'gallery-grid--trio')
*/
export default function Gallery({ images, className = '' }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  const open = (i) => {
    setCurrentIndex(i);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  });

  const lightboxContent = lightboxOpen ?
  <div
    className="lightbox open"
    role="dialog"
    aria-label="Image viewer"
    onClick={(e) => e.target === e.currentTarget && close()}
    onTouchStart={(e) => {touchStartX.current = e.changedTouches[0].screenX;}}
    onTouchEnd={(e) => {
      const diff = e.changedTouches[0].screenX - touchStartX.current;
      if (Math.abs(diff) > 50) {diff > 0 ? prev() : next();}
    }}>

        <button className="lightbox__close" aria-label="Close" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <button className="lightbox__nav lightbox__prev" aria-label="Previous image" onClick={(e) => {e.stopPropagation();prev();}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <img className="lightbox__img" src={images[currentIndex].src} alt={images[currentIndex].alt} onClick={close} />
        <button className="lightbox__nav lightbox__next" aria-label="Next image" onClick={(e) => {e.stopPropagation();next();}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
        <span className="lightbox__counter">{currentIndex + 1} / {images.length}</span>
      </div> :
  null;

  return (
    <>
      <div className={`gallery-grid ${className}`}>
        {images.map((img, i) =>
        <div
          key={i}
          className={`gallery-item${img.wide ? ' gallery-item--wide' : ''}`}
          onClick={() => open(i)}>

            <img src={img.src} alt={img.alt} width={img.wide ? 800 : 600} height={400} loading="lazy" decoding="async" />
          </div>
        )}
      </div>

      {createPortal(lightboxContent, document.body)}
    </>);

}