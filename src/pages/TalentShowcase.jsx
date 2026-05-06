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

      {/* Poster — printable / shareable artwork for the event */}
      <section
        id="poster"
        style={{ padding: '64px 20px 48px', background: 'var(--color-cream, #FBF5ED)' }}>

        <div className="container reveal" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p className="text-accent">Spread the Word</p>
            <h2 style={{ marginBottom: 8 }}>Download &amp; Share the Poster</h2>
            <p style={{ maxWidth: 640, margin: '0 auto', color: '#374151' }}>
              Pin it up at your school, workplace, or community space — or share it
              on socials. Available in print-ready and Instagram-friendly sizes.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24
          }}>
            <a
              href="/posters/talent-showcase-2026-poster.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the full-size Musical Talent Showcase 2026 poster in a new tab"
              style={{
                display: 'block',
                maxWidth: 460,
                width: '100%',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 12px 36px rgba(30, 25, 21, 0.18)',
                border: '1px solid #e2e8f0',
                background: '#fff',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 18px 44px rgba(30, 25, 21, 0.22)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(30, 25, 21, 0.18)';
              }}>

              <img
                src="/posters/talent-showcase-2026-poster.png"
                alt="Musical Talent Showcase 2026 poster — Saturday 18 July, Blockhouse Bay Community Centre, Auckland"
                loading="lazy"
                width="800"
                height="1185"
                style={{ width: '100%', height: 'auto', display: 'block' }} />

            </a>

            <div style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: 720
            }}>
              <a
                href="/posters/talent-showcase-2026-poster.png"
                download
                className="btn btn--primary">

                Download A4
              </a>
              <a
                href="/posters/talent-showcase-2026-poster-print-A3.png"
                download
                className="btn btn--outline">

                A3 print (300 dpi)
              </a>
              <a
                href="/posters/talent-showcase-2026-poster-square.png"
                download
                className="btn btn--outline">

                Instagram square
              </a>
              <a
                href="/posters/talent-showcase-2026-poster-story.png"
                download
                className="btn btn--outline">

                Instagram story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor banner — placed just above the Sign-Up section */}
      <section id="sponsor" style={{ padding: '40px 20px 24px', background: 'var(--color-cream, #FBF5ED)' }}>
        <div className="container reveal" style={{ maxWidth: 900 }}>
          <p style={{
            textAlign: 'center',
            fontSize: '0.78rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#7B1E2D',
            margin: '0 0 16px 0',
            fontWeight: 600
          }}>
            Proudly Supported By Our Sponsor
          </p>
          <a
            href="https://www.jrfinance.co.nz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit JR Finance website (opens in a new tab)"
            style={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              background: '#fff',
              border: '1.5px solid #e2e8f0',
              borderRadius: 14,
              padding: '24px 28px',
              boxShadow: '0 4px 16px rgba(30, 25, 21, 0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 25, 21, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 25, 21, 0.06)';
            }}>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {/* JR Finance brand mark */}
              <div style={{ flex: '0 0 auto', textAlign: 'center', minWidth: 120 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 700, color: '#3b6db8', letterSpacing: 1, lineHeight: 1 }}>JR</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#3b6db8', letterSpacing: 3, marginTop: 4 }}>FINANCE</div>
                <div style={{ fontSize: 10, color: '#6b86b3', letterSpacing: 1.5, marginTop: 6, textTransform: 'lowercase' }}>create wealth</div>
              </div>

              {/* Vertical divider */}
              <div style={{ width: 1, alignSelf: 'stretch', background: '#e2e8f0', flex: '0 0 1px' }} aria-hidden="true" />

              {/* Advisor details */}
              <div style={{ flex: '1 1 240px', minWidth: 240, color: '#374151', fontSize: '0.95rem', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1f2937', letterSpacing: 0.4 }}>JOHNRAE TANNEN</div>
                <div style={{ color: '#6b86b3', fontSize: '0.88rem', marginBottom: 8 }}>Financial Advisor</div>
                <div>+64 27-283-1946 &nbsp;·&nbsp; johnrae@jrfinance.co.nz</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: 2 }}>1A/268 Manukau Road, Epsom, Auckland 1023</div>
              </div>
            </div>
          </a>
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