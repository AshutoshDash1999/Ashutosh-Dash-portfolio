'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div role="alert" className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h2>
      <pre className="rounded bg-red-100 p-4">{error.message}</pre>
    </div>
  );
}
