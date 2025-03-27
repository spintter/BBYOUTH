import type { AppProps } from 'next/app';
import ThemeRegistry from '../components/ThemeRegistry';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeRegistry>
      <Component {...pageProps} />
    </ThemeRegistry>
  );
} 