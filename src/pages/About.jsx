import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import usePageMeta from '../hooks/usePageMeta';
import AnimatedIcon from '../components/AnimatedIcon';

export default function About() {
  useScrollReveal();
  usePageMeta({
    title: 'About Us — NZ Melting Pot',
    description: 'Learn about NZ Melting Pot, a not-for-profit charity bringing Auckland communities together through music events.',
    path: '/about'
  });

  return (
    <>
      {/* Hero */}
      <section className="page-hero page-hero--about">
        <div className="container">
          <div className="page-hero__content reveal">
            <p className="text-accent">Our Story</p>
            <h1>About NZ Melting Pot</h1>
            <p className="page-hero__subtitle">
              A not-for-profit charity dedicated to bringing Auckland's diverse communities together through the universal language of music.
            </p>
          </div>
        </div>
        <div className="divider divider--bottom">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-cream)">
            <path d="M0,20 C480,60 960,10 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Mission */}
      <section className="about-page-section">
        <div className="container">
          <div className="about-page__grid">
            <div className="about-page__text reveal-left">
              <h2>Our Mission</h2>
              <p className="lead">
                Enabling excellence by fostering unity and inclusivity in New Zealand's diverse society.
              </p>
              <p>
                NZ Melting Pot was founded on a simple belief: music has the power to connect people across all boundaries.
                In Auckland, one of the most culturally diverse cities in the world, we saw an opportunity to create
                spaces where everyone — regardless of age, background, or skill level — could come together and share in
                the joy of making music.
              </p>
              <p>
                We're not about competition or perfection. We're about community, connection, and celebration.
                Every voice matters. Every rhythm counts. Every person belongs.
              </p>
            </div>
            <div className="about-page__visual reveal-right" data-delay="150">
              <img
                src="/images/talent-showcase/showcase-01.webp"
                alt="Community gathering at NZ Melting Pot event"
                width="600"
                height="400"
                loading="lazy" />

            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="divider divider--top">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-cream)">
            <path d="M0,40 C360,0 720,60 1080,20 C1260,8 1380,30 1440,10 L1440,0 L0,0 Z" />
          </svg>
        </div>
        <div className="container">
          <div className="values-header reveal-scale">
            <p className="text-accent">What We Stand For</p>
            <h2>Our Values</h2>
          </div>
          <div className="values-grid">
            <div className="value-card reveal" data-delay="0">
              <div className="value-card__icon">
                <AnimatedIcon name="people" />
              </div>
              <h3>Inclusivity</h3>
              <p>Everyone is welcome. No auditions, no barriers. Whether you're a seasoned musician or picking up an instrument for the first time, there's a place for you.</p>
            </div>
            <div className="value-card reveal" data-delay="120">
              <div className="value-card__icon value-card__icon--amber">
                <AnimatedIcon name="heart" />
              </div>
              <h3>Community</h3>
              <p>We believe that stronger communities create a stronger society. Our events are designed to bring people together and foster meaningful connections.</p>
            </div>
            <div className="value-card reveal" data-delay="240">
              <div className="value-card__icon value-card__icon--gold">
                <AnimatedIcon name="notes" />
              </div>
              <h3>Celebration</h3>
              <p>We celebrate the rich cultural diversity of Auckland through music. Every culture, every tradition, every sound has something beautiful to offer.</p>
            </div>
          </div>
        </div>
        <div className="divider divider--bottom">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-white)">
            <path d="M0,20 C240,55 720,0 1200,40 C1350,50 1400,30 1440,25 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Our Events */}
      <section className="about-events-section">
        <div className="container">
          <div className="about-events-header reveal">
            <p className="text-accent">What We Do</p>
            <h2>Our Annual Events</h2>
            <p>Two signature events, each with its own character, united by a common purpose.</p>
          </div>
          <div className="about-events-grid">
            <div className="about-event-card reveal-left" data-delay="0">
              <div className="about-event-card__img">
                <img
                  src="/images/talent-showcase/showcase-05.webp"
                  alt="Musical Talent Showcase"
                  width="600"
                  height="300"
                  loading="lazy" />

              </div>
              <div className="about-event-card__content">
                <h3>Musical Talent Showcase</h3>
                <p>
                  Our annual talent showcase gives performers of all ages and backgrounds the chance to take the stage.
                  Soloists, duets, and trios — vocalists and instrumentalists — everyone is welcome to sign up and share their talent
                  with an appreciative community audience.
                </p>
                <Link to="/musical-talent-showcase" className="btn btn--outline">Learn More</Link>
              </div>
            </div>
            <div className="about-event-card reveal-right" data-delay="150">
              <div className="about-event-card__img">
                <img
                  src="/images/musical-ensemble/ensemble-01.webp"
                  alt="Musical Ensemble"
                  width="600"
                  height="300"
                  loading="lazy" />

              </div>
              <div className="about-event-card__content">
                <h3>Musical Ensemble</h3>
                <p>
                  No auditions, no competition — just an afternoon of collaborative music-making. Musicians from across
                  Auckland come together to play, learn from each other, and experience the joy of making music as one
                  unified group.
                </p>
                <Link to="/musical-ensemble" className="btn btn--outline">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <div className="divider divider--top">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-white)">
            <path d="M0,40 C360,0 720,60 1080,20 C1260,8 1380,30 1440,10 L1440,0 L0,0 Z" />
          </svg>
        </div>
        <div className="container">
          <div className="about-cta reveal-scale">
            <h2>Be Part of the Music</h2>
            <p>Whether you want to perform, participate, or simply enjoy the show — we'd love to have you.</p>
            <div className="about-cta__actions">
              <Link to="/musical-talent-showcase" className="btn btn--primary btn--large">Register to Perform</Link>
              <Link to="/contact" className="btn btn--outline btn--large">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </>);

}