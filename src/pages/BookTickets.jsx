import useScrollReveal from '../hooks/useScrollReveal';
import usePageMeta from '../hooks/usePageMeta';
import BookingForm from '../components/BookingForm';
import Breadcrumbs from '../components/Breadcrumbs';
import { OrganizationSchema } from '../components/SchemaOrg';

/**
 * /book-tickets — audience ticket booking page for the Talent Showcase 2026.
 * Mirrors the look and feel of the TalentShowcase page (registration form),
 * but the form here is the BookingForm (just buyer name + email + count).
 */
export default function BookTickets() {
  useScrollReveal();
  usePageMeta({
    title: 'Book Audience Tickets — Talent Showcase 2026 | NZ Melting Pot',
    description:
      'Book your tickets for the Musical Talent Showcase 2026 in Auckland. $10 NZD per ticket, up to 10 tickets per booking. Saturday 18 July 2026.',
    path: '/book-tickets'
  });

  return (
    <>
      <OrganizationSchema />

      <section className="page-hero" style={{ padding: '80px 20px 40px', textAlign: 'center' }}>
        <div className="container">
          <Breadcrumbs items={[
            { label: 'Home', to: '/' },
            { label: 'Talent Showcase', to: '/musical-talent-showcase' },
            { label: 'Book Tickets', to: '/book-tickets' }
          ]} />

          <p className="text-accent page-hero__tag" style={{ marginTop: 18 }}>Saturday 18 July 2026</p>
          <h1 className="page-hero__title" style={{ marginTop: 4 }}>
            Book Your <em>Tickets</em>
          </h1>
          <p className="page-hero__lead" style={{ maxWidth: 640, margin: '14px auto 0' }}>
            Come and cheer on Auckland's performers at the 2026 Musical Talent Showcase.
            Tickets are $10 NZD each — book up to 10 in one go.
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="section" style={{ paddingTop: 32, paddingBottom: 40 }}>
        <div className="container">
          <div className="reveal" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            maxWidth: 980,
            margin: '0 auto 36px'
          }}>
            <FeatureCard icon="🎤" title="Live performances" text="Solo vocalists, instrumentalists, duos and groups across all ages." />
            <FeatureCard icon="🏆" title="Live judges" text="A panel of judges and audience celebrating Auckland's musical talent." />
            <FeatureCard icon="👨‍👩‍👧‍👦" title="Family friendly" text="Open to all ages — bring family and friends." />
            <FeatureCard icon="🎟️" title="Easy entry" text="Tickets emailed to you instantly after payment. Show on your phone or print." />
          </div>
        </div>
      </section>

      {/* The booking form */}
      <section id="booking-form" className="section" style={{ paddingTop: 0, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 2.6rem)', margin: '0 0 8px 0' }}>
              Reserve Your Seat
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>
              Tickets are $10 NZD per person. Book up to 10 in one transaction.
            </p>
          </div>

          <div className="reveal" data-delay="100">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 12,
      padding: '20px 18px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: 10 }}>{icon}</div>
      <h3 style={{ fontSize: '1.05rem', margin: '0 0 6px 0', color: '#fff' }}>{title}</h3>
      <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.55, margin: 0 }}>{text}</p>
    </div>
  );
}
