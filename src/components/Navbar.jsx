import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  const toggleMobile = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  const closeMobile = () => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  };

  const scrollToRegister = (e) => {
    e.preventDefault();
    const el = document.getElementById('register');
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    closeMobile();
  };

  const isActive = (path) => location.pathname === path;

  // On ensemble page, Register links to talent showcase
  const registerHref =
  location.pathname === '/musical-ensemble' ?
  '/musical-talent-showcase#register' :
  '#register';

  const registerAction = (e) => {
    if (location.pathname === '/musical-ensemble') return; // let Link navigate
    scrollToRegister(e);
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="nav__inner">
            <Link to="/" className="nav__logo">
              <img src="/images/branding/logo-150x150.png" alt="NZ Melting Pot" width="48" height="48" />
              <span>NZ Melting Pot</span>
            </Link>
            <ul className="nav__links">
              <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
              <li><Link to="/musical-talent-showcase" className={isActive('/musical-talent-showcase') ? 'active' : ''}>Talent Showcase</Link></li>
              <li><Link to="/book-tickets" className={isActive('/book-tickets') ? 'active' : ''}>Book Tickets</Link></li>
              <li><Link to="/musical-ensemble" className={isActive('/musical-ensemble') ? 'active' : ''}>Musical Ensemble</Link></li>
              <li><Link to="/gallery" className={isActive('/gallery') ? 'active' : ''}>Gallery</Link></li>
              <li><Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link></li>
              <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>
              <li>
                {location.pathname === '/musical-ensemble' ?
                <Link to="/musical-talent-showcase" className="nav__cta">Register Now</Link> :

                <a href="#register" className="nav__cta" onClick={scrollToRegister}>Register Now</a>
                }
              </li>
            </ul>
            <button className={`nav__toggle${mobileOpen ? ' open' : ''}`} aria-label="Toggle menu" onClick={toggleMobile}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`nav__mobile-overlay${mobileOpen ? ' open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={closeMobile}>Home</Link></li>
          <li><Link to="/musical-talent-showcase" onClick={closeMobile}>Talent Showcase</Link></li>
          <li><Link to="/book-tickets" onClick={closeMobile}>Book Tickets</Link></li>
          <li><Link to="/musical-ensemble" onClick={closeMobile}>Musical Ensemble</Link></li>
          <li><Link to="/gallery" onClick={closeMobile}>Gallery</Link></li>
          <li><Link to="/about" onClick={closeMobile}>About</Link></li>
          <li><Link to="/contact" onClick={closeMobile}>Contact</Link></li>
          <li>
            {location.pathname === '/musical-ensemble' ?
            <Link to="/musical-talent-showcase" onClick={closeMobile}>Register Now</Link> :

            <a href="#register" onClick={scrollToRegister}>Register Now</a>
            }
          </li>
        </ul>
      </div>
    </>);

}