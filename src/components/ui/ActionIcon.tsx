// components/ui/ActionIcon.tsx
import { cn } from '@/lib/utils';
import { SearchIcon } from '@hugeicons/core-free-icons'; // used for inferring type
import { HugeiconsIcon } from '@hugeicons/react';

type IconDataType = typeof SearchIcon;

type ActionIconProps = {
  icon: IconDataType;
  label?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ActionIcon({
  icon,
  label,
  size = 20,
  strokeWidth = 1.5,
  color = 'currentColor',
  className,
  ...props
}: ActionIconProps) {
  const fallbackLabel = 'Icon';

  return (
    <button
      className={cn(
        'flex h-10 w-10 items-center justify-center border-2 border-black bg-white text-black shadow-[3px_3px_0_0_black] transition-all',
        'hover:bg-black hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      aria-label={label || fallbackLabel}
      {...props}
    >
      <HugeiconsIcon
        icon={icon}
        size={size}
        strokeWidth={strokeWidth}
        color={color}
        aria-hidden="true"
      />
    </button>
  );
}
