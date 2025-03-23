import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat, Playfair_Display, Poppins } from 'next/font/google';
import Script from 'next/script';
import '../styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'BBYM - Knowledge Is Power',
  description: 'Empowering Birmingham\'s youth through chess, education, and cultural enrichment',
  icons: {
    icon: '/favicon.png',
  }
};

export const viewport: Viewport = {
  themeColor: '#1A1A2E'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${playfair.variable} ${poppins.variable}`}>
      <body className="bg-white text-[#333333] min-h-screen">
        {children}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          integrity="sha512-fD9DI5bZwQxOi7MhYWnnNPlvXdp/2Pj3XSTRrFs5FQa4mizyGLnJcN6tuvUS6LbmgN1ut+XGSABKvjN0H6Aoow=="
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer"
        />
      </body>
    </html>
  );
} 