import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Karsa Rasa Nusantara | UMKM Kopi, Camilan & Bumbu Tradisional',
  description:
    'Website resmi UMKM Karsa Rasa Nusantara. Biji kopi single origin sangrai segar, kudapan sehat alami, dan sambal rempah warisan tradisi nusantara.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col">
        <CartProvider>
          <Toaster position="top-right" />
          {children}
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
