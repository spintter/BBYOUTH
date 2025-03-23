import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamic import with no SSR to prevent server-side errors with three.js
const ChessScene = dynamic(() => import('../components/ChessScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a2e',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div>Loading Chess Scene...</div>
      </div>
    </div>
  )
});

export default function ChessTestPage() {
  return (
    <>
      <Head>
        <title>Chess Scene Test - Birmingham Black Youth Ministry</title>
        <meta name="description" content="Testing the chess scene with 3D models" />
      </Head>
      
      <ChessScene />
    </>
  );
} 