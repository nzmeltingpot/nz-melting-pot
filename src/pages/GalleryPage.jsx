import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import usePageMeta from '../hooks/usePageMeta';
import Gallery from '../components/Gallery';

const showcaseImages = [
{ src: '/images/talent-showcase/showcase-01.webp', alt: 'Musical Talent Showcase performance', wide: true },
{ src: '/images/talent-showcase/showcase-02.webp', alt: 'Vocalist on stage at the Talent Showcase' },
{ src: '/images/talent-showcase/showcase-03.webp', alt: 'Instrumentalist performing at the showcase' },
{ src: '/images/talent-showcase/showcase-04.webp', alt: 'Audience enjoying the Talent Showcase' },
{ src: '/images/talent-showcase/showcase-05.webp', alt: 'Trio performing at the Musical Talent Showcase', wide: true },
{ src: '/images/talent-showcase/showcase-06.webp', alt: 'Solo performer at the showcase' },
{ src: '/images/talent-showcase/showcase-07.webp', alt: 'Audience watching performances at the Musical Talent Showcase' },
{ src: '/images/talent-showcase/showcase-08.webp', alt: 'Behind the scenes at the Talent Showcase' },
{ src: '/images/talent-showcase/showcase-09.webp', alt: 'Young performer on stage' },
{ src: '/images/talent-showcase/showcase-10.webp', alt: 'Performers on stage together at the Musical Talent Showcase', wide: true },
{ src: '/images/talent-showcase/showcase-11.webp', alt: 'Audience applauding performers' },
{ src: '/images/talent-showcase/showcase-12.webp', alt: 'Guitarist at the Talent Showcase' },
{ src: '/images/talent-showcase/showcase-13.webp', alt: 'Stage setup for the showcase' },
{ src: '/images/talent-showcase/showcase-14.webp', alt: 'Award presentation at the showcase' },
{ src: '/images/talent-showcase/showcase-15.webp', alt: 'Community celebration at the event' },
{ src: '/images/talent-showcase/showcase-16.webp', alt: 'Final performance at the Talent Showcase' }];


const ensembleImages = [
{ src: '/images/musical-ensemble/ensemble-01.webp', alt: 'Musicians at the Musical Ensemble event', wide: true },
{ src: '/images/musical-ensemble/ensemble-02.webp', alt: 'Collaborative music session' },
{ src: '/images/musical-ensemble/ensemble-03.webp', alt: 'Ensemble participants playing together' },
{ src: '/images/musical-ensemble/ensemble-04.webp', alt: 'Community music making at the ensemble' },
{ src: '/images/musical-ensemble/ensemble-05.webp', alt: 'Diverse group of musicians', wide: true },
{ src: '/images/musical-ensemble/ensemble-06.webp', alt: 'Learning and sharing music' },
{ src: '/images/musical-ensemble/ensemble-07.webp', alt: 'Ensemble gathering' },
{ src: '/images/musical-ensemble/ensemble-08.webp', alt: 'Musicians of all ages at the ensemble' },
{ src: '/images/musical-ensemble/ensemble-09.webp', alt: 'Group performance at the Musical Ensemble' }];


export default function GalleryPage() {
  useScrollReveal();
  usePageMeta({
    title: 'Gallery — NZ Melting Pot Events',
    description: 'Browse photos from NZ Melting Pot events including the Musical Talent Showcase and Musical Ensemble in Auckland.',
    path: '/gallery'
  });

  const [activeTab, setActiveTab] = useState('showcase');

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__content reveal">
            <p className="text-accent">Our Memories</p>
            <h1>Event Gallery</h1>
            <p className="page-hero__subtitle">
              Moments captured from our community music events. Every photo tells a story of unity, passion, and celebration.
            </p>
          </div>
        </div>
        <div className="divider divider--bottom">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-cream)">
            <path d="M0,20 C480,60 960,10 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Gallery Tabs */}
      <section className="gallery-section">
        <div className="container">
          <div className="gallery-tabs reveal">
            <button
              className={`gallery-tab ${activeTab === 'showcase' ? 'active' : ''}`}
              onClick={() => setActiveTab('showcase')}>

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Talent Showcase
            </button>
            <button
              className={`gallery-tab ${activeTab === 'ensemble' ? 'active' : ''}`}
              onClick={() => setActiveTab('ensemble')}>

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="5.5" cy="17.5" r="2.5" />
                <circle cx="17.5" cy="15.5" r="2.5" />
                <path d="M8 17V5l12-2v12" />
              </svg>
              Musical Ensemble
            </button>
          </div>

          <div className="reveal" data-delay="150">
            {activeTab === 'showcase' ?
            <Gallery images={showcaseImages} /> :

            <Gallery images={ensembleImages} />
            }
          </div>
        </div>
      </section>
    </>);

}