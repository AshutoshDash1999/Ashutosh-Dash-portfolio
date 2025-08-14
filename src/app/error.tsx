'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      role="alert"
      className="bg-background flex min-h-screen flex-col items-center justify-center p-8"
    >
      <div className="w-full max-w-2xl">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="bg-destructive shadow-brutal flex h-24 w-24 items-center justify-center border-4 border-black">
            <span className="text-destructive-foreground text-4xl font-black">!</span>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-foreground mb-6 text-center text-4xl font-black tracking-tight">
          OOPS! SOMETHING BROKE
        </h1>

        {/* Error Message */}
        <div className="bg-card shadow-brutal mb-8 border-4 border-black p-6">
          <h2 className="text-card-foreground mb-3 text-xl font-bold">Error Details:</h2>
          <div className="bg-muted text-muted-foreground border-2 border-black p-4 font-mono text-sm break-words">
            {error.message || 'An unexpected error occurred'}
          </div>
          {error.digest && (
            <div className="text-muted-foreground mt-3 text-xs">Error ID: {error.digest}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="neobrutalist-button bg-primary text-primary-foreground hover:bg-primary-dark px-8 py-4 text-lg font-bold"
          >
            TRY AGAIN
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className="neobrutalist-button bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-4 text-lg font-bold"
          >
            GO HOME
          </button>
        </div>

        {/* Help Text */}
        <div className="text-muted-foreground mt-8 text-center">
          <p className="text-sm">
            If this problem persists, please contact me or check your internet connection.
          </p>
        </div>
      </div>
    </div>
  );
}
