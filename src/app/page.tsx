import Navigation from '@/components/sections/Navigation';
import Logo from '@/components/ui/Logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-4 py-20">
      <Navigation />

      <Logo size="sm" />
    </main>
  );
}
