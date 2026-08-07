import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// The kit's stylesheet is safe to load alongside the docs chrome: its reset is
// scoped to `.retro-root` and every rule is `retro-` prefixed, so the two
// systems share a page without colliding.
import 'retro-ui-kit-PLACEHOLDER/styles.css';
import './styles/docs.css';

import { App } from './App';
import { Router } from './lib/router';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
