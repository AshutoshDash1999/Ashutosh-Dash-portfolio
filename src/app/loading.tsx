export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="bg-background flex min-h-screen flex-col items-center justify-center p-8"
    >
      <div className="w-full max-w-md text-center">
        {/* Loading Icon */}
        <div className="mb-8 flex justify-center">
          <div className="bg-primary shadow-brutal relative flex h-24 w-24 items-center justify-center overflow-hidden border-4 border-black">
            <div className="bg-primary-foreground h-16 w-16 animate-pulse"></div>
            <div className="border-t-primary-foreground absolute inset-0 animate-spin border-4 border-transparent"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-foreground mb-4 text-3xl font-black tracking-tight">LOADING...</h1>

        {/* Loading Description */}
        <div className="bg-card shadow-brutal border-4 border-black p-6">
          <p className="text-muted-foreground font-medium">
            Please wait while we prepare your experience
          </p>
        </div>

        {/* Loading Dots */}
        <div className="mt-6 flex justify-center space-x-2">
          <div className="bg-primary h-3 w-3 animate-bounce border-2 border-black"></div>
          <div
            className="bg-primary h-3 w-3 animate-bounce border-2 border-black"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="bg-primary h-3 w-3 animate-bounce border-2 border-black"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
