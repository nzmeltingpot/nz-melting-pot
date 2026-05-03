import { useEffect, useState } from 'react';

const images = [
{ src: '/images/talent-showcase/showcase-03.webp', alt: 'Performer at Musical Talent Showcase' },
{ src: '/images/talent-showcase/showcase-07.webp', alt: 'Community gathering at NZ Melting Pot' },
{ src: '/images/musical-ensemble/ensemble-02.webp', alt: 'Musical Ensemble performance' },
{ src: '/images/talent-showcase/showcase-12.webp', alt: 'Artist on stage' },
{ src: '/images/musical-ensemble/ensemble-05.webp', alt: 'Ensemble musicians' }];


const musicalNotes = ['♪', '♫', '♬', '𝄞'];

export default function HeroMosaic() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`hero-mosaic ${loaded ? 'hero-mosaic--loaded' : ''}`} aria-hidden="true">
      {/* Floating musical notes */}
      <span className="hero-mosaic__note hero-mosaic__note--1">♪</span>
      <span className="hero-mosaic__note hero-mosaic__note--2">♫</span>
      <span className="hero-mosaic__note hero-mosaic__note--3">𝄞</span>
      <span className="hero-mosaic__note hero-mosaic__note--4">♬</span>
      <span className="hero-mosaic__note hero-mosaic__note--5">♪</span>

      {/* Image tiles - creative uneven arrangement */}
      <div className="hero-mosaic__tile hero-mosaic__tile--1">
        <img src={images[0].src} alt={images[0].alt} loading="eager" />
      </div>
      <div className="hero-mosaic__tile hero-mosaic__tile--2">
        <img src={images[1].src} alt={images[1].alt} loading="eager" />
      </div>
      <div className="hero-mosaic__tile hero-mosaic__tile--3">
        <img src={images[2].src} alt={images[2].alt} loading="eager" />
      </div>
      <div className="hero-mosaic__tile hero-mosaic__tile--4">
        <img src={images[3].src} alt={images[3].alt} loading="eager" />
      </div>
      <div className="hero-mosaic__tile hero-mosaic__tile--5">
        <img src={images[4].src} alt={images[4].alt} loading="eager" />
      </div>

      {/* Decorative connector lines */}
      <svg className="hero-mosaic__lines" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 100 Q100 150 80 220" stroke="var(--color-ember)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
        <path d="M300 80 Q250 180 320 280" stroke="var(--color-maroon)" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
        <circle cx="80" cy="220" r="3" fill="var(--color-amber)" opacity="0.5" />
        <circle cx="320" cy="280" r="4" fill="var(--color-ember)" opacity="0.4" />
      </svg>
    </div>);

}