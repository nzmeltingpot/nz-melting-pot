import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import usePageMeta from '../hooks/usePageMeta';
import RegistrationForm from '../components/RegistrationForm';
import Gallery from '../components/Gallery';
import Breadcrumbs from '../components/Breadcrumbs';
import AnimatedIcon from '../components/AnimatedIcon';
import { OrganizationSchema, TalentShowcaseEventSchema } from '../components/SchemaOrg';

/* Unique alt text for every gallery image */
const showcaseAlts = [
'Performers lined up on stage at the NZ Melting Pot Musical Talent Showcase in Auckland',
'Solo vocalist performing under stage lights at the annual Auckland talent showcase',
'Instrumentalist playing a guitar piece during the Musical Talent Showcase event',
'Audience watching a live music performance at the NZ Melting Pot showcase',
'Young musician performing a solo at the community talent showcase in Auckland',
'Group performance on stage at the Auckland Musical Talent Showcase event',
'Judge panel evaluating performers at the NZ Melting Pot Musical Talent Showcase',
'Drummer performing an energetic solo at the NZ Melting Pot talent event',
'Guitarist on stage at the annual Musical Talent Showcase in Auckland',
'Duo performing together at the NZ Melting Pot community talent showcase',
'Full stage view of the Musical Talent Showcase performance venue in Auckland',
'Vocalist receiving feedback from judges at the annual talent showcase',
'Band performing live at the Auckland community music event',
'Audience applauding after a performance at the NZ Melting Pot showcase',
'Pianist performing a classical piece at the Musical Talent Showcase',
'Award ceremony moment at the annual NZ Melting Pot Musical Talent Showcase'];


const showcaseImages = Array.from({ length: 16 }, (_, i) => ({
  src: `/images/talent-showcase/showcase-${String(i + 1).padStart(2, '0')}.webp`,
  alt: showcaseAlts[i],
  wide: i === 0 || i === 5 || i === 10
}));

export default function TalentShowcase() {
  const location = useLocation();

  useScrollReveal();
  usePageMeta({
    title: 'Musical Talent Showcase 2026 — NZ Melting Pot Auckland',
    description:
    "Register for Auckland's annual Musical Talent Showcase. Solo vocalists, instrumentalists, groups, and duets — all ages welcome. Live judges, Saturday 18 July 2026. Performer fee from $10 NZD per participant.",
    path: '/musical-talent-showcase'
  });

  // Scroll to hash on page load (e.g., #register from Terms page)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Focus on the first input in the form
          const firstInput = element.querySelector('input, select, textarea');
          if (firstInput) {
            firstInput.focus();
          }
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <>
      <OrganizationSchema />
      <TalentShowcaseEventSchema />

      {/* Page Hero */}
      <section className="page-hero page-hero--showcase">
        <div className="container">
          <p className="text-accent page-hero__tag">Saturday 18 July 2026</p>
          <h1>Musical Talent<br />Showcase</h1>
          <p>Auckland's annual stage for solo artists, instrumentalists, and groups. Sign up, show up, and let your music do the talking.</p>
        </div>
        <div className="divider divider--bottom divider--tall">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" fill="var(--color-white)">
            <path d="M0,56 C320,90 640,10 960,50 C1150,70 1340,30 1440,20 L1440,90 L0,90 Z" />
          </svg>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Musical Talent Showcase', to: '/musical-talent-showcase' }]} />

      {/* Event Info */}
      <section className="event-info">
        <div className="container">
          <div className="event-info__grid">
            <div className="event-info__text reveal-left">
              <p className="text-accent">About the Event</p>
              <h2>Your turn on stage</h2>
              <p>The Musical Talent Showcase is our flagship annual event — performers from across Auckland take the stage in front of a live audience and a panel of judges.</p>

              <div className="info-highlights">
                <div className="info-highlight reveal" data-delay="100">
                  <div className="info-highlight__icon">
                    <AnimatedIcon name="star" />
                  </div>
                  <div>
                    <strong>Open Stage</strong>
                    <p>First time or hundredth time — it doesn't matter. If you want to perform, there's a spot for you.</p>
                  </div>
                </div>
                <div className="info-highlight reveal" data-delay="180">
                  <div className="info-highlight__icon">
                    <AnimatedIcon name="grid" />
                  </div>
                  <div>
                    <strong>Multiple Categories</strong>
                    <p>Vocalists, instrumentalists, groups, duets, and more — plus age groups from under 12 to open.</p>
                  </div>
                </div>
                <div className="info-highlight reveal" data-delay="260">
                  <div className="info-highlight__icon">
                    <AnimatedIcon name="feedback" />
                  </div>
                  <div>
                    <strong>Live Judging &amp; Feedback</strong>
                    <p>Judges provide real feedback, the audience cheers you on, and we celebrate the best performances at the end of the day.</p>
                  </div>
                </div>
                <div className="info-highlight reveal" data-delay="340">
                  <div className="info-highlight__icon">
                    <AnimatedIcon name="handshake" />
                  </div>
                  <div>
                    <strong>Competitive, But Community</strong>
                    <p>It's a competition, sure. But everyone in the room showed up because they care about the same thing you do.</p>
                  </div>
                </div>
              </div>

              <ul className="categories-list" aria-label="Performance categories">
                <li>Vocal Solo</li><li>Instrumental</li><li>Group</li><li>Duet</li>
                <li>Under 12</li><li>12 – 17</li><li>18+</li><li>Open / Mixed</li>
              </ul>
            </div>

            <div className="event-info__sidebar reveal-right" data-delay="150">
              <h3>Event Details</h3>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                <div><strong>Date</strong><span>Saturday, 18 July 2026</span></div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                <div><strong>Time</strong><span className="">Doors open TBA</span></div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <div><strong>Venue</strong><span>Blockhouse Bay Community Centre, 524 Blockhouse Bay Road, Blockhouse Bay, Auckland 0600</span></div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
                <div><strong>Performer Fee</strong><span>$10 early bird (until 01/06/2026) · $15 thereafter</span></div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01" /></svg>
                <div><strong>Audience Tickets</strong><span>$10 per ticket · up to 10 per booking</span></div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <div><strong>Who</strong><span>Open to all ages and skill levels</span></div>
              </div>
              <div className="event-info__sidebar-cta" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="#register" className="btn btn--primary event-info__sidebar-btn" onClick={(e) => {e.preventDefault();document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });}}>Register to Perform</a>
                <Link to="/book-tickets" className="btn btn--outline event-info__sidebar-btn">Book Audience Tickets</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="register-section" id="register">
        <div className="divider divider--top">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-white)">
            <path d="M0,40 C480,0 960,55 1440,15 L1440,0 L0,0 Z" />
          </svg>
        </div>
        <div className="container container--narrow">
          <div className="register-section__header reveal">
            <p className="text-accent">Registrations Open</p>
            <h2>Sign Up for 2026</h2>
            <p>Fill in your details below and we'll confirm your spot. Performer fee: $10 (Early Bird) / $15 (Standard) per participant — see pricing details on the form below.</p>
          </div>
          <div className="reveal" data-delay="150">
            <RegistrationForm idPrefix="tsc" />
          </div>
        </div>
        <div className="divider divider--bottom">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-sand)">
            <path d="M0,10 C360,55 900,0 1440,35 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery-section" id="gallery">
        <div className="container container--wide">
          <div className="gallery-section__header reveal">
            <p className="text-accent">From Previous Years</p>
            <h2>Gallery</h2>
            <p>Moments from the stage — performers, judges, and the crowd that makes it all happen.</p>
          </div>
          <div className="reveal" data-delay="100">
            <Gallery images={showcaseImages} />
          </div>
        </div>
      </section>

      {/* Cross-Promo — links to Musical Ensemble */}
      <section className="tickets-section tickets-section--dark">
        <div className="divider divider--top">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-sand)">
            <path d="M0,45 C480,5 960,50 1440,10 L1440,0 L0,0 Z" />
          </svg>
        </div>
        <div className="container cross-promo">
          <div className="reveal">
            <p className="text-accent cross-promo__tag">Prefer Playing Together?</p>
            <h2>Join the Musical Ensemble</h2>
            <div className="cross-promo__features">
              <span className="cross-promo__pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
                No Auditions
              </span>
              <span className="cross-promo__pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
                No Pressure
              </span>
              <span className="cross-promo__pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
                Community Jam
              </span>
            </div>
            <Link to="/musical-ensemble" className="btn btn--primary btn--large">Explore the Ensemble</Link>
          </div>
        </div>
      </section>
    </>);

}