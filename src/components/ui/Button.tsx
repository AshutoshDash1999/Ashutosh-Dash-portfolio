// components/ui/Button.tsx
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-bold text-black shadow-[4px_4px_0_0_black] transition-all',
        'hover:bg-yellow-400 hover:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
