import '../styles/globals.css';
import { AssetProvider } from '../context/AssetContext';
import { AnimationProvider } from '../context/AnimationContext';

function MyApp({ Component, pageProps }) {
  return (
    <AnimationProvider>
      <AssetProvider>
        <Component {...pageProps} />
      </AssetProvider>
    </AnimationProvider>
  );
}

export default MyApp;
