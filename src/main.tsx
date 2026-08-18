import './instrument';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import * as Sentry from '@sentry/react';
import App from './App';
import './index.css';

const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://catalogue-dev.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById('root')!, {
  onUncaughtError: Sentry.reactErrorHandler(),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<div className="p-4 text-red-500">Something went wrong.</div>}>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);

