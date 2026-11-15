import { useState } from 'react';
import { Coffee } from 'lucide-react';

interface ResilientImageProps {
  src?: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFECE6] text-[#4A4640] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Coffee className="w-7 h-7 mb-2 text-[#234234]" strokeWidth={1.5} />
        <span className="font-display text-sm font-medium text-[#181614]">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
