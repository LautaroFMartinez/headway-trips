import dynamic from 'next/dynamic';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';

const DestinationsGrid = dynamic(() => import('@/components/destinations-grid').then((mod) => ({ default: mod.DestinationsGrid })), {
  loading: () => (
    <section className="py-24 px-6 bg-secondary">
      <div className="container mx-auto">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </section>
  ),
});

const WhyChooseUs = dynamic(() => import('@/components/why-choose-us').then((mod) => ({ default: mod.WhyChooseUs })), {
  loading: () => (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </section>
  ),
});

const Testimonials = dynamic(() => import('@/components/testimonials'), {
  loading: () => (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </section>
  ),
});

const Newsletter = dynamic(() => import('@/components/newsletter'), {
  loading: () => (
    <section className="py-16 bg-primary">
      <div className="container mx-auto max-w-2xl">
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </div>
    </section>
  ),
});

const ContactForm = dynamic(() => import('@/components/contact-form').then((mod) => ({ default: mod.ContactForm })), {
  loading: () => (
    <section className="py-24 px-6 bg-secondary">
      <div className="container mx-auto max-w-2xl">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </section>
  ),
});

const Footer = dynamic(() => import('@/components/footer').then((mod) => ({ default: mod.Footer })), {
  loading: () => null,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <DestinationsGrid />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
      <ContactForm />
      <Footer />
    </main>
  );
}
