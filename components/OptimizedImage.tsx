import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        className={`
          transition-opacity duration-300 
          ${loading ? 'opacity-0' : 'opacity-100'}
          ${props.fill ? 'object-cover' : ''}
        `}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        quality={90}
        {...props}
      />
      {loading && (
        <div 
          className="
            absolute inset-0 
            bg-gray-200 animate-pulse 
            rounded-inherit
          "
        />
      )}
    </div>
  );
}
