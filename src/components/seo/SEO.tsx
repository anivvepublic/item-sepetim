import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article' | 'profile';
  noindex?: boolean;
  schema?: object;
}

const SITE_URL = 'https://itemsepetim.com';
const SITE_NAME = 'Item Sepetim';
const DEFAULT_IMAGE = '/og-default.jpg'; // public klasörüne koyacağız

export default function SEO({
  title,
  description = 'Türkiye\'nin en güvenilir oyun hesapları ve item pazar yeri. Valorant, Mobile Legends, PUBG Mobile ve daha fazlası için güvenli alışveriş.',
  image = DEFAULT_IMAGE,
  url = '/',
  type = 'website',
  noindex = false,
  schema,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Temel Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph (Facebook, WhatsApp, Discord) */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Ekstra */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

// Product Schema helper
export function getProductSchema(listing: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description,
    image: listing.images?.[0] || DEFAULT_IMAGE,
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'TRY',
      availability: listing.status === 'active' 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
    },
    category: listing.category,
    brand: {
      '@type': 'Brand',
      name: listing.game,
    },
  };
}

// Website Schema helper
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Türkiye\'nin en güvenilir oyun hesapları ve item pazar yeri',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/listings?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}