import data from "@/lib/data.json";

export default function Hero() {
  const { personal } = data;

  return (
    <section id="hero" className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading">
            {personal.name}
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-main">
            {personal.title}
          </h2>
          <p className="text-lg md:text-xl text-foreground max-w-2xl">
            {personal.bio}
          </p>
        </div>
        <div className="flex-1 w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
          <div className="w-full h-full min-h-[400px] md:min-h-[500px] border-2 border-border rounded-base bg-secondary-background">
            {/* 3D Element will be added here */}
          </div>
        </div>
      </div>
    </section>
  );
}
