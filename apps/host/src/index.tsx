import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';
import './index.css';

// #region agent log
fetch('http://127.0.0.1:7647/ingest/5dbce222-9957-4ad6-b6f1-d80f014d3c87', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'f3e564' },
  body: JSON.stringify({
    sessionId: 'f3e564',
    runId: 'post-fix',
    hypothesisId: 'H1',
    location: 'apps/host/src/index.tsx',
    message: 'host index executed after shared eager fix',
    data: { hasRoot: typeof document !== 'undefined' && !!document.getElementById('root') },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

const theme = createTheme({
  palette: { mode: 'light' },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
