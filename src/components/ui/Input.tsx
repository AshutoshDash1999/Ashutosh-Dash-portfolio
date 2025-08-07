// components/ui/Input.tsx
import { cn } from '@/lib/utils';

type InputProps = {
  id: string;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ id, label, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-black">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          'w-full border-2 border-black bg-white px-3 py-2 text-sm font-medium placeholder-gray-600 shadow-[3px_3px_0_0_black]',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  );
}
