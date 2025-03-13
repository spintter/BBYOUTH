import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="no-js" style={{ height: '100%' }}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1A1A1A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Montserrat:wght@600&family=Open+Sans:wght@400;600&display=swap" 
          rel="stylesheet"
        />

        {/* Accessibility Enhancements */}
        <meta name="color-scheme" content="dark light" />
      </Head>
      <body className="bg-gray-50 text-gray-900 min-h-screen" style={{ height: '100%' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}