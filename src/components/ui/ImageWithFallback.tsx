'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { Image02Icon, Loading03Icon } from '@hugeicons/core-free-icons';

type ImageWithFallbackProps = Omit<ImageProps, 'onLoad' | 'onError'> & {
  fallbackText?: string;
  showFallbackIcon?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

const ImageWithFallback = ({
  src,
  alt = 'Image',
  className = '',
  fallbackText = 'Image not available',
  showFallbackIcon = true,
  onLoad,
  onError,
  priority = false,
  quality = 75,
  sizes,
  fill,
  width,
  height,
  ...props
}: ImageWithFallbackProps) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // Create sizing classes based on props
  const getSizingClasses = () => {
    if (fill) return '';
    if (width && height) {
      return `w-[${width}px] h-[${height}px]`;
    }
    return 'w-full h-full';
  };

  const sizingClasses = getSizingClasses();

  const handleLoad = () => {
    setImageStatus('success');
    onLoad?.();
  };

  const handleError = () => {
    setImageStatus('error');
    onError?.();
  };

  // Reset status when src changes
  useEffect(() => {
    setImageStatus('loading');
  }, [src]);

  // Loading state
  if (imageStatus === 'loading') {
    return (
      <div
        className={`relative flex items-center justify-center bg-gray-100 ${className} ${sizingClasses}`}
        role="status"
        aria-label="Loading image"
        aria-live="polite"
      >
        {/* Loading animation */}
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <HugeiconsIcon
            icon={Loading03Icon}
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
          />
          <span className="sr-only text-sm text-gray-500">Loading image...</span>
        </div>

        {/* Hidden image for loading detection */}
        <Image
          src={src}
          alt={alt}
          {...(fill ? { fill, sizes } : { width, height })}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          quality={quality}
          className="absolute opacity-0"
          {...props}
        />
      </div>
    );
  }

  // Error state - show fallback UI
  if (imageStatus === 'error') {
    return (
      <div
        className={`bg-muted border-muted-foreground relative flex items-center justify-center border-2 border-dashed ${className} ${sizingClasses}`}
        role="img"
        aria-label={fallbackText}
        aria-live="polite"
      >
        <div className="flex flex-col items-center space-y-3 p-4 text-center">
          {showFallbackIcon && (
            <HugeiconsIcon
              icon={Image02Icon}
              className="text-muted-foreground h-8 w-8"
              aria-hidden="true"
            />
          )}
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">{fallbackText}</p>
            <p className="sr-only text-xs text-gray-400">Failed to load image</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show actual image
  return (
    <div className={`relative ${className} ${sizingClasses}`}>
      <Image
        src={src}
        alt={alt}
        {...(fill ? { fill, sizes } : { width, height })}
        onError={handleError}
        priority={priority}
        quality={quality}
        className="object-cover transition-opacity duration-300"
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
