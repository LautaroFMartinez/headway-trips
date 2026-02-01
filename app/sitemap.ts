import { MetadataRoute } from 'next';
import { trips } from '@/lib/trips-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://headwaytrips.com';
  const currentDate = new Date();

  // Static routes with proper priorities and change frequencies
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/viaje`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/comparador`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sitemap-html`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic routes from trips data with proper metadata
  const tripRoutes = trips.map((trip) => ({
    url: `${baseUrl}/viaje/${trip.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Group by region for better organization
  const regionRoutes = Array.from(new Set(trips.map((t) => t.region))).map((region) => ({
    url: `${baseUrl}/viaje?region=${region}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...tripRoutes, ...regionRoutes];
}
