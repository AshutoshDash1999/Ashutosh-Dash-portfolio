import data from "@/lib/data.json";

export default function Footer() {
  const { footer } = data;

  return (
    <footer className="border-t-2 border-border bg-secondary-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-foreground">
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
