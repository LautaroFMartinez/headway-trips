import { Metadata } from 'next';

interface SEOMetadataProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateSEOMetadata({ title, description, url, image = '/og-image.jpg', type = 'website', keywords = [], author, publishedTime, modifiedTime }: SEOMetadataProps): Metadata {
  const siteName = 'Headway Trips';
  const fullTitle = `${title} | ${siteName}`;
  const baseUrl = 'https://headwaytrips.com';
  const fullUrl = `${baseUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'viajes', 'turismo', 'Argentina', 'Headway Trips'],
    authors: author ? [{ name: author }] : [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      locale: 'es_AR',
      url: fullUrl,
      siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@headwaytrips',
      site: '@headwaytrips',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// JSON-LD structured data helpers
export function generateTouristDestinationSchema(destination: { name: string; description: string; image: string; url: string; address?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.description,
    image: destination.image,
    url: destination.url,
    ...(destination.address && {
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AR',
        addressLocality: destination.address,
      },
    }),
  };
}

export function generateTripOfferSchema(trip: { name: string; description: string; image: string; url: string; price: number; currency?: string; availability?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.name,
    description: trip.description,
    image: trip.image,
    url: trip.url,
    offers: {
      '@type': 'Offer',
      price: trip.price,
      priceCurrency: trip.currency || 'ARS',
      availability: trip.availability || 'https://schema.org/InStock',
      url: trip.url,
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Headway Trips',
      url: 'https://headwaytrips.com',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Headway Trips',
    url: 'https://headwaytrips.com',
    logo: 'https://headwaytrips.com/icono.png',
    description: 'Tu agencia de viajes de confianza en Argentina',
    sameAs: ['https://facebook.com/headwaytrips', 'https://instagram.com/headwaytrips', 'https://twitter.com/headwaytrips'],
  };
}

export function generateWebPageSchema({ title, description, url }: { title: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `https://headwaytrips.com${url}`,
    inLanguage: 'es-AR',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Headway Trips',
      url: 'https://headwaytrips.com',
    },
    publisher: {
      '@type': 'TravelAgency',
      name: 'Headway Trips',
      url: 'https://headwaytrips.com',
    },
  };
}
