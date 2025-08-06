export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex items-center justify-center min-h-screen"
    >
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
