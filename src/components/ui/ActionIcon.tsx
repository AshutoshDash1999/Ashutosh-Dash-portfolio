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
  iconColor?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ActionIcon({
  icon,
  label,
  size = 20,
  strokeWidth = 1.5,
  iconColor = 'currentColor',
  variant = 'default',
  className,
  ...props
}: ActionIconProps) {
  const fallbackLabel = 'Icon';

  const variantStyles = {
    default: 'bg-white text-black hover:bg-black hover:text-white',
    primary: 'bg-primary text-primary-foreground hover:bg-primary-dark',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/80',
  };

  return (
    <button
      className={cn(
        'neobrutalist-button flex h-10 w-10 items-center justify-center',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        className
      )}
      aria-label={label || fallbackLabel}
      {...props}
    >
      <HugeiconsIcon
        icon={icon}
        size={size}
        strokeWidth={strokeWidth}
        color={iconColor}
        aria-hidden="true"
      />
    </button>
  );
}
