export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <section className="px-6 md:px-12 py-10">{children}</section>
    </main>
  );
}
