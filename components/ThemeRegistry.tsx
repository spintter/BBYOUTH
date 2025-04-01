'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';

// Cache for emotion styles
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

// Create a client-side cache for emotion
const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
};

// Client-side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();

interface ThemeRegistryProps {
  children: React.ReactNode;
}

/**
 * ThemeRegistry component that can be used in both App Router and Pages Router
 * Provides MUI theme and emotion cache
 */
export function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

export default ThemeRegistry; 