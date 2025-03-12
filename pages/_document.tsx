import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="no-js" style={{ height: '100%' }}>
      <Head>
        {/* Preload 3D Assets */}
        <link rel="preload" href="/models/african-girl.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/african-queen.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/textures/african-wood-base.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/textures/african-wood-normal.jpg" as="image" type="image/jpeg" />

        {/* Custom Font */}
        <link rel="preload" href="/fonts/Roboto-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Accessibility Enhancements */}
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark light" />
        <link rel="stylesheet" href="/styles/high-contrast.css" media="(prefers-contrast: high)" />
      </Head>
      <body className="bg-black text-white min-h-screen" style={{ height: '100%' }}>
        <Main />
        <NextScript />
        {/* Reduced Motion Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.body.classList.add('reduce-motion');
              }
            `,
          }}
        />
      </body>
    </Html>
  );
}