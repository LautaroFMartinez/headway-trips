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
    keywords: [...keywords, 'viajes', 'turismo', 'Europa', 'viajes Europa', 'Headway Trips'],
    authors: author ? [{ name: author }] : [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      locale: 'es_ES',
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
      priceCurrency: trip.currency || 'EUR',
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
    description: 'Agencia de viajes internacional especializada en Europa. Experiencias para viajeros de 20 a 30 años.',
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
    inLanguage: 'es-ES',
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

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBlogPostingSchema(post: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image || 'https://headwaytrips.com/og-image.jpg',
    url: `https://headwaytrips.com${post.url}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Organization',
      name: post.author || 'Headway Trips',
      url: 'https://headwaytrips.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Headway Trips',
      logo: {
        '@type': 'ImageObject',
        url: 'https://headwaytrips.com/icono.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://headwaytrips.com${post.url}`,
    },
  };
}

export function generateAggregateRatingSchema(rating: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Headway Trips',
    url: 'https://headwaytrips.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.ratingValue,
      reviewCount: rating.reviewCount,
      bestRating: rating.bestRating || 5,
      worstRating: rating.worstRating || 1,
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': 'https://headwaytrips.com/#organization',
    name: 'Headway Trips',
    url: 'https://headwaytrips.com',
    logo: 'https://headwaytrips.com/icono.png',
    image: 'https://headwaytrips.com/og-image.jpg',
    description: 'Agencia de viajes internacional especializada en Europa. Creamos experiencias de viaje inolvidables para viajeros de 20 a 30 años.',
    telephone: '+525527118391',
    email: 'info@headwaytrips.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Madrid',
      addressRegion: 'Madrid',
      postalCode: '28001',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.4168,
      longitude: -3.7038,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    sameAs: [
      'https://facebook.com/headwaytrips',
      'https://instagram.com/headwaytrips',
      'https://twitter.com/headwaytrips',
    ],
    priceRange: '$$',
  };
}

