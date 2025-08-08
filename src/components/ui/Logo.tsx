import { cn } from '@/lib/utils'; // assuming you have a `cn` utility
import { motion } from 'motion/react';

type LogoProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const sizeMap: Record<NonNullable<LogoProps['size']>, string> = {
  xs: 'size-10',
  sm: 'size-20',
  md: 'size-40',
  lg: 'size-60',
  xl: 'size-80',
};

export default function Logo({ size = 'md' }: LogoProps) {
  return (
    <div
      className={cn(
        'brutalist-card bg-primary relative flex items-center justify-center overflow-hidden',
        sizeMap[size]
      )}
    ></div>
  );
}
