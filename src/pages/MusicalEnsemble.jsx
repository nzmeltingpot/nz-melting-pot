import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import usePageMeta from '../hooks/usePageMeta';
import Gallery from '../components/Gallery';
import VideoLightbox from '../components/VideoLightbox';
import Breadcrumbs from '../components/Breadcrumbs';
import AnimatedIcon from '../components/AnimatedIcon';
import { OrganizationSchema, EnsembleEventSchema } from '../components/SchemaOrg';

/* Unique alt text for every gallery image */
const ensembleAlts = [
'Musicians gathered for the NZ Melting Pot Musical Ensemble in Auckland',
'Collaborative music session during the annual Musical Ensemble event',
'Violinist playing alongside other musicians at the ensemble gathering in Auckland',
'Community members jamming together at the NZ Melting Pot Musical Ensemble',
'Group rehearsal at the Auckland Musical Ensemble community event',
'Guitarist and keyboardist collaborating at the NZ Melting Pot Musical Ensemble',
'Diverse musicians sharing music at the NZ Melting Pot community ensemble event',
'Acoustic jam session at the annual Musical Ensemble gathering in Auckland',
'Musicians of all ages playing together at the NZ Melting Pot ensemble'];


const ensembleImages = Array.from({ length: 9 }, (_, i) => ({
  src: `/images/musical-ensemble/ensemble-${String(i + 1).padStart(2, '0')}.webp`,
  alt: ensembleAlts[i],
  wide: i === 0 || i === 4
}));

/* Google Photos album URL for ensemble videos */
const ENSEMBLE_ALBUM_URL = 'https://photos.app.goo.gl/8UoKkD92Mtbq5WJp7';

/* Video data for the ensemble gallery */
const ensembleVideos = [
{
  thumb: '/images/musical-ensemble/ensemble-01.webp',
  alt: 'Video clip from the 2024 Musical Ensemble — opening jam session with all musicians',
  title: 'Opening Jam Session',
  url: ENSEMBLE_ALBUM_URL
},
{
  thumb: '/images/musical-ensemble/ensemble-02.webp',
  alt: 'Video clip from the 2024 Musical Ensemble — community musicians performing together',
  title: 'Community Performance',
  url: ENSEMBLE_ALBUM_URL
},
{
  thumb: '/images/musical-ensemble/ensemble-03.webp',
  alt: 'Video clip from the 2024 Musical Ensemble — acoustic guitar and violin duet',
  title: 'Guitar & Violin Duet',
  url: ENSEMBLE_ALBUM_URL
},
{
  thumb: '/images/musical-ensemble/ensemble-04.webp',
  alt: 'Video clip from the 2024 Musical Ensemble — group jam session in Auckland',
  title: 'Group Jam Session',
  url: ENSEMBLE_ALBUM_URL
},
{
  thumb: '/images/musical-ensemble/ensemble-05.webp',
  alt: 'Video clip from the 2024 Musical Ensemble — keyboard and percussion collaboration',
  title: 'Keyboard & Percussion',
  url: ENSEMBLE_ALBUM_URL
},
{
  thumb: '/images/musical-ensemble/ensemble-06.webp',
  alt: 'Video clip from the 2024 Musical Ensemble — collaborative music making finale',
  title: 'Ensemble Finale',
  url: ENSEMBLE_ALBUM_URL
}];



export default function MusicalEnsemble() {
  useScrollReveal();
  usePageMeta({
    title: 'Musical Ensemble — NZ Melting Pot Auckland Community Jam',
    description:
    'Join the NZ Melting Pot Musical Ensemble in Auckland. No auditions, no competition — musicians of all ages and skill levels come together to play, learn, and make music as a group. All welcome.',
    path: '/musical-ensemble'
  });

  return (
    <>
      <OrganizationSchema />
      <EnsembleEventSchema />

      {/* Page Hero */}
      <section className="page-hero page-hero--ensemble">
        <div className="container">
          <p className="text-accent page-hero__tag">Annual Community Event</p>
          <h1>Musical<br />Ensemble</h1>
          <p>No auditions. No competition. Just musicians from across Auckland playing, learning, and making something special.</p>
        </div>
        <div className="divider divider--bottom divider--tall">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" fill="var(--color-white)">
            <path d="M0,30 C240,80 600,10 900,55 C1100,75 1300,25 1440,40 L1440,90 L0,90 Z" />
          </svg>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Musical Ensemble', to: '/musical-ensemble' }]} />

      {/* Event Info */}
      <section className="event-info">
        <div className="container">
          <div className="event-info__grid">
            <div className="event-info__text reveal-left">
              <p className="text-accent">About the Ensemble</p>
              <h2>Play together, grow together</h2>
              <p>Where the Talent Showcase is about performing on stage, the Ensemble is about sitting down with other musicians and making music as a group. It's the more relaxed side of what we do.</p>

              <div className="info-highlights">
                <div className="info-highlight reveal" data-delay="100">
                  <div className="info-highlight__icon">
                    <AnimatedIcon name="door" />
                  </div>
                  <div>
                    <strong>No Auditions Needed</strong>
                    <p>Classically trained or self-taught from YouTube — everyone is welcome, no questions asked.</p>
                  </div>
                </div>
                <div className="info-highlight reveal" data-delay="180">
                  <div className="info-highlight__icon">
                    <AnimatedIcon name="guitar" />
                  </div>
                  <div>
                    <strong>Every Instrument Welcome</strong>
                    <p>Guitar, violin, drums, piano, or something else entirely — if you play it, bring it along.</p>
                  </div>
                </div>
                <div className="info-highlight reveal" data-delay="260">
                  <div className="info-highlight__icon">
                    <AnimatedIcon name="heart" />
                  </div>
                  <div>
                    <strong>Connected by Music</strong>
                    <p>An afternoon of playing, learning, and connecting through what we all share — a love of making music.</p>
                  </div>
                </div>
                <div className="info-highlight reveal" data-delay="340">
                  <div className="info-highlight__icon">
                    <AnimatedIcon name="calendar" />
                  </div>
                  <div>
                    <strong>Annual Event</strong>
                    <p>Organised each year through our community networks. Follow this page for details on the next one.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="event-info__sidebar reveal-right" data-delay="150">
              <h3>Event Details</h3>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                <div><strong>When</strong><span>Annual event — next on 28/11/2026</span></div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <div><strong>Where</strong><span className="">Blockhouse Bay Community Centre, Auckland</span></div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <div><strong>Who</strong><span>All ages and skill levels welcome</span></div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="5.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="15.5" r="2.5" /><path d="M8 17V5l12-2v12" /></svg>
                <div><strong>Bring</strong><span>Your instrument and yourself</span></div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
                <div><strong>Cost</strong><span className="">A small participation fee — please get in touch for details</span></div>
              </div>
              <div className="event-info__sidebar-cta">
                <a href="mailto:info@nzmeltingpot.com" className="btn btn--primary event-info__sidebar-btn">Get in Touch</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery-section" id="gallery">
        <div className="divider divider--top">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-white)">
            <path d="M0,30 C360,0 720,55 1080,15 C1260,5 1380,25 1440,20 L1440,0 L0,0 Z" />
          </svg>
        </div>
        <div className="container container--wide">
          <div className="gallery-section__header reveal">
            <p className="text-accent">About the Ensemble</p>
            <h2>Gallery</h2>
            <p>No auditions. No competition. Just musicians from across Auckland playing, learning, and making something special.</p>
          </div>
          <div className="reveal" data-delay="100">
            <Gallery images={ensembleImages} className="gallery-grid--trio" />
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="video-section">
        <div className="container">
          <div className="video-section__header reveal">
            <h3>Videos from the Ensemble</h3>
            <p className="text-small">Clips from the 2024 gathering. Click to watch.</p>
          </div>
          <div className="reveal" data-delay="100">
            <VideoLightbox videos={ensembleVideos} />
          </div>
          <p className="text-small" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a href={ENSEMBLE_ALBUM_URL} target="_blank" rel="noopener noreferrer">
              View the full video collection on Google Photos &rarr;
            </a>
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="tickets-section tickets-section--dark">
        <div className="divider divider--top">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-sand)">
            <path d="M0,45 C480,5 960,50 1440,10 L1440,0 L0,0 Z" />
          </svg>
        </div>
        <div className="container cross-promo">
          <div className="reveal">
            <p className="text-accent cross-promo__tag">Looking to Perform?</p>
            <h2>The Talent Showcase is Open for Registration</h2>
            <div className="cross-promo__features">
              <span className="cross-promo__pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                Solo &amp; Group Acts
              </span>
              <span className="cross-promo__pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></svg>
                All Ages
              </span>
              <span className="cross-promo__pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /></svg>
                All Welcome
              </span>
            </div>
            <Link to="/musical-talent-showcase" className="btn btn--primary btn--large">Register for the Showcase</Link>
          </div>
        </div>
      </section>
    </>);

}