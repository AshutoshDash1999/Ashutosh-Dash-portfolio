"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong
      </h2>
      <pre className="bg-red-100 p-4 rounded">{error.message}</pre>
    </div>
  );
}
