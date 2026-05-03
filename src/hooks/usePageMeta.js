import { useEffect } from 'react';

const SITE_URL = 'https://www.nzmeltingpot.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/branding/logo-512x512.png`;

/**
 * Sets per-page <title>, meta description, canonical, OG, and Twitter card tags.
 * Falls back to defaults in index.html for crawlers that don't execute JS.
 */
export default function usePageMeta({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website'
}) {
  useEffect(() => {
    /* Title */
    document.title = title;

    /* Helper — find or create a <meta> tag */
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const url = `${SITE_URL}${path}`;

    /* Standard */
    setMeta('name', 'description', description);

    /* Open Graph */
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:type', type);

    /* Twitter / X */
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    /* Canonical */
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, path, image, type]);
}