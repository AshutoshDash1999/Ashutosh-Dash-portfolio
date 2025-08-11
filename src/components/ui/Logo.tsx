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
    container: 'size-15',
    text: 'text-lg',
    border: 'border-2',
    shadow: 'shadow-[4px_4px_0px_#000000]',
    hoverShadow: 'hover:shadow-[6px_6px_0px_#000000]',
    activeShadow: 'active:shadow-[2px_2px_0px_#000000]',
    hoverTransform: 'hover:-translate-x-1 hover:-translate-y-1',
    activeTransform: 'active:translate-x-1 active:translate-y-1',
    topDecor: { size: 'h-2.5 w-2.5', position: 'top-1.5 right-1.5' },
    bottomDecor: { size: 'h-2 w-2', position: 'bottom-1.5 left-1.5' },
  },
  md: {
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
  lg: {
    container: 'size-25',
    text: 'text-3xl',
    border: 'border-3',
    shadow: 'shadow-[6px_6px_0px_#000000]',
    hoverShadow: 'hover:shadow-[8px_8px_0px_#000000]',
    activeShadow: 'active:shadow-[3px_3px_0px_#000000]',
    hoverTransform: 'hover:-translate-x-1.5 hover:-translate-y-1.5',
    activeTransform: 'active:translate-x-1.5 active:translate-y-1.5',
    topDecor: { size: 'h-4 w-4', position: 'top-2 right-2' },
    bottomDecor: { size: 'h-3 w-3', position: 'bottom-2 left-2' },
  },
  xl: {
    container: 'size-30',
    text: 'text-4xl',
    border: 'border-3',
    shadow: 'shadow-[6px_6px_0px_#000000]',
    hoverShadow: 'hover:shadow-[8px_8px_0px_#000000]',
    activeShadow: 'active:shadow-[3px_3px_0px_#000000]',
    hoverTransform: 'hover:-translate-x-1.5 hover:-translate-y-1.5',
    activeTransform: 'active:translate-x-1.5 active:translate-y-1.5',
    topDecor: { size: 'h-5 w-5', position: 'top-2.5 right-2.5' },
    bottomDecor: { size: 'h-4 w-4', position: 'bottom-2.5 left-2.5' },
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
