import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductCatalog from '@/components/ProductCatalog';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

// Revalidate page data every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const [products, categories, testimonials] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      include: { category: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProductCatalog
          initialProducts={JSON.parse(JSON.stringify(products))}
          categories={JSON.parse(JSON.stringify(categories))}
        />
        <AboutSection />
        <TestimonialsSection
          initialTestimonials={JSON.parse(JSON.stringify(testimonials))}
        />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
