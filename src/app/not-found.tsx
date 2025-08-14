'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div className="bg-secondary shadow-brutal flex h-24 w-24 items-center justify-center border-4 border-black">
            <span className="text-secondary-foreground text-3xl font-black">404</span>
          </div>
        </div>

        {/* Page Title */}
        <h1 className="text-foreground mb-6 text-center text-4xl font-black tracking-tight">
          PAGE NOT FOUND
        </h1>

        {/* Description */}
        <div className="bg-card shadow-brutal mb-8 border-4 border-black p-6 text-center">
          <h2 className="text-card-foreground mb-3 text-xl font-bold">
            Oops! This page doesn&apos;t exist
          </h2>
          <p className="text-muted-foreground">
            The page you&apos;re looking for might have been moved, deleted, or you entered the
            wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="neobrutalist-button bg-primary text-primary-foreground hover:bg-primary-dark px-8 py-4 text-center text-lg font-bold"
          >
            GO HOME
          </Link>

          <button
            onClick={() => window.history.back()}
            className="neobrutalist-button bg-accent text-accent-foreground hover:bg-accent/80 px-8 py-4 text-lg font-bold"
          >
            GO BACK
          </button>
        </div>

        {/* Help Text */}
        <div className="text-muted-foreground mt-8 text-center">
          <p className="text-sm">
            If you believe this is an error, please check the URL or contact me.
          </p>
        </div>
      </div>
    </div>
  );
}
