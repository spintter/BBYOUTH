import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#8B0000' },
    secondary: { main: '#006400' },
    background: { default: '#000000' },
    text: { primary: '#FFFFFF', secondary: '#FFD700' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    h1: { fontSize: '5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    body1: { fontSize: '1.25rem', fontWeight: 400 },
  },
}); 