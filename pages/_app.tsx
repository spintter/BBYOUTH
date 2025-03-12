import '../styles/globals.css';
import { AppProps } from 'next/app';
import { FPSProvider } from '../context/FPSContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { useEffect } from 'react';

// MyApp Component
function MyApp({ Component, pageProps }: AppProps) {
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
    <ErrorBoundary>
      <FPSProvider initialQuality="medium">
        <Component {...pageProps} />
      </FPSProvider>
    </ErrorBoundary>
  );
}

export default MyApp; // Ensure proper default export