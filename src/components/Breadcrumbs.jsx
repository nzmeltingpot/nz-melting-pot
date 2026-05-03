import { Link } from 'react-router-dom';

const SITE_URL = 'https://www.nzmeltingpot.com';

/**
 * Renders a breadcrumb trail with BreadcrumbList structured data.
 * items: [{ label: 'Home', to: '/' }, { label: 'Page Name', to: '/page' }]
 */
export default function Breadcrumbs({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${item.to}`
    }))
  };

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <div className="container">
          <ol>
            {items.map((item, i) =>
            <li key={i}>
                {i < items.length - 1 ?
              <Link to={item.to}>{item.label}</Link> :

              <span aria-current="page">{item.label}</span>
              }
              </li>
            )}
          </ol>
        </div>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

    </>);

}