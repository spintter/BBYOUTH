import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { FPSProvider } from '../context/FPSContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { useEffect } from 'react';
import Head from 'next/head';

// MyApp Component
export default function MyApp({ Component, pageProps }: AppProps) {
  // Optimize performance by removing 300ms delay on mobile devices
  useEffect(() => {
    document.documentElement.classList.remove('no-js');
  }, []);

  // Add performance monitoring
  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === 'undefined') return;

    // Report Web Vitals
    const reportWebVitals = () => {
      try {
        const cls = performance.getEntriesByType('layout-shift')
          .reduce((sum, entry: any) => sum + entry.value, 0);
        
        console.log('Cumulative Layout Shift:', cls);
        
        // First Contentful Paint
        const paint = performance.getEntriesByType('paint')
          .find((entry) => entry.name === 'first-contentful-paint');
        
        if (paint) {
          console.log('First Contentful Paint:', paint.startTime);
        }
      } catch (error) {
        console.error('Error measuring performance:', error);
      }
    };
    
    // Report after page load
    if (document.readyState === 'complete') {
      reportWebVitals();
    } else {
      window.addEventListener('load', reportWebVitals);
      return () => window.removeEventListener('load', reportWebVitals);
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      <ErrorBoundary>
        <FPSProvider initialQuality="medium">
          <Component {...pageProps} />
        </FPSProvider>
      </ErrorBoundary>
    </>
  );
}