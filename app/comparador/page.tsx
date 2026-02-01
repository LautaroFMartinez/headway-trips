import type { Metadata } from 'next';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { TripComparator } from '@/components/trip-comparator';

export const metadata: Metadata = {
  title: 'Comparador de Destinos | Headway Trips',
  description: 'Compará nuestros mejores destinos lado a lado y elegí tu próxima aventura. Analizá precios, duración, destacados y más.',
  openGraph: {
    title: 'Comparador de Destinos | Headway Trips',
    description: 'Encontrá el viaje perfecto comparando destinos lado a lado.',
    images: ['/og-image.jpg'],
  },
};

export default function ComparatorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <TripComparator />
      </main>
      <Footer />
    </>
  );
}
