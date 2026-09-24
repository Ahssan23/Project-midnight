'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>

      <p>
        {error.message || 'An unexpected error occurred.'}
      </p>

      {error.stack && (
        <details>
          <summary>View Stack Trace</summary>
          <pre>{error.stack}</pre>
        </details>
      )}

      <button onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}