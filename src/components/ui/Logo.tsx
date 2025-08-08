import { cn } from '@/lib/utils';

type LogoProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const sizeConfig = {
  xs: {
    container: 'size-10',
    text: 'text-xs',
    border: 'border-2',
    shadow: 'shadow-[4px_4px_0px_#000000]',
    hoverShadow: 'hover:shadow-[6px_6px_0px_#000000]',
    activeShadow: 'active:shadow-[2px_2px_0px_#000000]',
    hoverTransform: 'hover:-translate-x-1 hover:-translate-y-1',
    activeTransform: 'active:translate-x-1 active:translate-y-1',
    topDecor: { size: 'h-2 w-2', position: 'top-1 right-1' },
    bottomDecor: { size: 'h-1.5 w-1.5', position: 'bottom-1 left-1' },
  },
  sm: {
    container: 'size-20',
    text: 'text-2xl',
    border: 'border-2',
    shadow: 'shadow-[4px_4px_0px_#000000]',
    hoverShadow: 'hover:shadow-[6px_6px_0px_#000000]',
    activeShadow: 'active:shadow-[2px_2px_0px_#000000]',
    hoverTransform: 'hover:-translate-x-1 hover:-translate-y-1',
    activeTransform: 'active:translate-x-1 active:translate-y-1',
    topDecor: { size: 'h-3 w-3', position: 'top-1.5 right-1.5' },
    bottomDecor: { size: 'h-2.5 w-2.5', position: 'bottom-1.5 left-1.5' },
  },
  md: {
    container: 'size-40',
    text: 'text-5xl',
    border: 'border-3',
    shadow: 'shadow-[6px_6px_0px_#000000]',
    hoverShadow: 'hover:shadow-[8px_8px_0px_#000000]',
    activeShadow: 'active:shadow-[3px_3px_0px_#000000]',
    hoverTransform: 'hover:-translate-x-1.5 hover:-translate-y-1.5',
    activeTransform: 'active:translate-x-1.5 active:translate-y-1.5',
    topDecor: { size: 'h-5 w-5', position: 'top-2.5 right-2.5' },
    bottomDecor: { size: 'h-4 w-4', position: 'bottom-2.5 left-2.5' },
  },
  lg: {
    container: 'size-60',
    text: 'text-7xl',
    border: 'border-4',
    shadow: 'shadow-[8px_8px_0px_#000000]',
    hoverShadow: 'hover:shadow-[10px_10px_0px_#000000]',
    activeShadow: 'active:shadow-[4px_4px_0px_#000000]',
    hoverTransform: 'hover:-translate-x-2 hover:-translate-y-2',
    activeTransform: 'active:translate-x-2 active:translate-y-2',
    topDecor: { size: 'h-6 w-6', position: 'top-3 right-3' },
    bottomDecor: { size: 'h-5 w-5', position: 'bottom-3 left-3' },
  },
  xl: {
    container: 'size-80',
    text: 'text-9xl',
    border: 'border-4',
    shadow: 'shadow-[8px_8px_0px_#000000]',
    hoverShadow: 'hover:shadow-[12px_12px_0px_#000000]',
    activeShadow: 'active:shadow-[4px_4px_0px_#000000]',
    hoverTransform: 'hover:-translate-x-2 hover:-translate-y-2',
    activeTransform: 'active:translate-x-1 active:translate-y-1',
    topDecor: { size: 'h-8 w-8', position: 'top-4 right-4' },
    bottomDecor: { size: 'h-6 w-6', position: 'bottom-4 left-4' },
  },
};

export default function Logo({ size = 'xl' }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        'from-primary-light to-primary-dark relative flex cursor-pointer items-center justify-center bg-gradient-to-br transition-all duration-300 ease-in-out',
        config.container,
        config.border,
        config.shadow,
        config.hoverShadow,
        config.activeShadow,
        config.hoverTransform,
        config.activeTransform,
        'border-black'
      )}
    >
      <span className={cn('font-black text-white', config.text)}>AD</span>

      <div
        className={cn(
          'absolute cursor-pointer bg-emerald-500 transition-all duration-300 ease-in-out',
          config.border,
          config.shadow,
          config.hoverShadow,
          config.activeShadow,
          config.hoverTransform,
          config.activeTransform,
          'border-black',
          config.topDecor.size,
          config.topDecor.position
        )}
      />
      <div
        className={cn(
          'absolute cursor-pointer bg-yellow-500 transition-all duration-300 ease-in-out',
          config.border,
          config.shadow,
          config.hoverShadow,
          config.activeShadow,
          config.hoverTransform,
          config.activeTransform,
          'border-black',
          config.bottomDecor.size,
          config.bottomDecor.position
        )}
      />
    </div>
  );
}
