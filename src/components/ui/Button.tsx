// components/ui/Button.tsx
import { cn } from '@/lib/utils';

type TailwindColor =
  | 'white'
  | 'black'
  | 'gray'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'zinc'
  | 'neutral'
  | 'stone';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: TailwindColor;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

export function Button({
  className,
  color = 'white',
  loading = false,
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  const getColorClasses = (color: TailwindColor) => {
    const colorMap: Record<TailwindColor, string> = {
      white: 'bg-white text-black',
      black: 'bg-black text-white',
      gray: 'bg-gray-600 text-white',
      red: 'bg-red-600 text-white',
      orange: 'bg-orange-600 text-white',
      amber: 'bg-amber-600 text-black',
      yellow: 'bg-yellow-600 text-black',
      lime: 'bg-lime-600 text-black',
      green: 'bg-green-600 text-white',
      emerald: 'bg-emerald-600 text-white',
      teal: 'bg-teal-600 text-white',
      cyan: 'bg-cyan-600 text-black',
      sky: 'bg-sky-600 text-white',
      blue: 'bg-blue-600 text-white',
      indigo: 'bg-indigo-600 text-white',
      violet: 'bg-violet-600 text-white',
      purple: 'bg-purple-600 text-white',
      fuchsia: 'bg-fuchsia-600 text-white',
      pink: 'bg-pink-600 text-white',
      rose: 'bg-rose-600 text-white',
      slate: 'bg-slate-600 text-white',
      zinc: 'bg-zinc-600 text-white',
      neutral: 'bg-neutral-600 text-white',
      stone: 'bg-stone-600 text-white',
    };
    return colorMap[color];
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        'cursor-pointer border-4 border-black px-8 py-4 text-sm font-bold transition-all duration-300 ease-out',
        'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_black]',
        'active:translate-x-0.5 active:translate-y-0.5 active:shadow-[4px_4px_0_0_black]',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-[4px_4px_0_0_black]',
        'disabled:focus-visible:ring-0',
        getColorClasses(color),
        'shadow-[8px_8px_0_0_black]',
        'min-h-[44px]', // WCAG minimum touch target size
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <div
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            role="status"
            aria-label="Loading"
          />
        )}

        <span className={loading ? 'opacity-70' : ''}>{children}</span>
      </div>
    </button>
  );
}
