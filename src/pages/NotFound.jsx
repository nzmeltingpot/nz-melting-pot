import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta({
    title: 'Page Not Found — NZ Melting Pot',
    description: 'The page you are looking for does not exist. Head back to the NZ Melting Pot home page.',
    path: '/404'
  });

  return (
    <section className="page-hero page-hero--404">
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="text-accent" style={{ marginBottom: '0.5rem' }}>Oops</p>
        <h1>404</h1>
        <p style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)', margin: '1rem 0 2.5rem', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back to the music.
        </p>
        <Link to="/" className="btn btn--primary btn--large">Back to Home</Link>
      </div>
    </section>);

}