import { ActionIcon } from '@/components/ui/ActionIcon';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GithubIcon } from '@hugeicons/core-free-icons';

export default function Home() {
  return (
    <main className="min-h-screen py-20">
      <div className="flex flex-col gap-4 p-20">
        <Button>Hello</Button>
        <Input id="email" label="Email" />
        <ActionIcon icon={GithubIcon} />
      </div>
    </main>
  );
}
