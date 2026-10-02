import React from 'react';

interface ArunaLogoProps {
  variant?: 'horizontal' | 'horizontal-tagline' | 'vertical' | 'vertical-tagline' | 'mark-only' | 'favicon-mark';
  color?: 'navy' | 'white' | 'gold';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ArunaLogo: React.FC<ArunaLogoProps> = ({
  variant = 'horizontal',
  color = 'navy',
  className = '',
  size = 'md',
}) => {
  const fillColor =
    color === 'white'
      ? '#FFFFFF'
      : color === 'gold'
      ? '#B59A5A'
      : '#0B1F33';

  const secondaryColor =
    color === 'white'
      ? 'rgba(255, 255, 255, 0.7)'
      : color === 'gold'
      ? '#987E41'
      : '#6B7280';

  // Mark-only rendering
  if (variant === 'mark-only') {
    const markHeight = size === 'sm' ? 16 : size === 'md' ? 22 : size === 'lg' ? 28 : 36;
    return (
      <svg
        height={markHeight}
        viewBox="0 0 32 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 ${className}`}
        aria-label="ARUNA Symbol"
      >
        <rect x="0" y="3" width="32" height="4.5" rx="2.25" fill={fillColor} />
        <rect x="0" y="12.5" width="32" height="4.5" rx="2.25" fill={fillColor} />
      </svg>
    );
  }

  // Favicon / Small interlocking mark
  if (variant === 'favicon-mark') {
    const markSize = size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 44 : 56;
    return (
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 ${className}`}
        aria-label="ARUNA Interlocking Mark"
      >
        <rect width="64" height="64" rx="14" fill={color === 'white' ? '#132D47' : '#0B1F33'} />
        <rect x="14" y="24" width="36" height="5" rx="2.5" fill="#FFFFFF" />
        <rect x="14" y="35" width="36" height="5" rx="2.5" fill="#FFFFFF" />
        <path d="M22 17C16 22 16 42 22 47" stroke="#B59A5A" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M42 17C48 22 48 42 42 47" stroke="#B59A5A" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Vertical lockup
  if (variant === 'vertical' || variant === 'vertical-tagline') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Symbol: Two horizontal bars */}
        <svg
          width="42"
          height="24"
          viewBox="0 0 42 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-2 shrink-0"
        >
          <rect x="2" y="4" width="38" height="5.5" rx="2.75" fill={fillColor} />
          <rect x="2" y="14.5" width="38" height="5.5" rx="2.75" fill={fillColor} />
        </svg>

        {/* Wordmark ARUNA */}
        <span
          className="text-2xl sm:text-3xl font-extrabold tracking-[0.2em] uppercase leading-none font-sans"
          style={{ color: fillColor }}
        >
          ARUNA
        </span>

        {/* Tagline */}
        {variant === 'vertical-tagline' && (
          <span
            className="text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase mt-2.5 font-sans"
            style={{ color: secondaryColor }}
          >
            MAKE BUSINESS MAKE SENSE.
          </span>
        )}
      </div>
    );
  }

  // Horizontal lockup (Default & Standard Header)
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isXl = size === 'xl';

  const barWidth = isSm ? 20 : isLg ? 30 : isXl ? 36 : 24;
  const barHeight = isSm ? 15 : isLg ? 22 : isXl ? 26 : 18;

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 ${className}`}>
      {/* Symbol: Two equal horizontal bars */}
      <svg
        width={barWidth}
        height={barHeight}
        viewBox="0 0 28 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect x="0" y="3" width="28" height="4.5" rx="2.25" fill={fillColor} />
        <rect x="0" y="12.5" width="28" height="4.5" rx="2.25" fill={fillColor} />
      </svg>

      {/* Wordmark */}
      <span
        className={`font-extrabold tracking-[0.18em] uppercase leading-none font-sans ${
          isSm
            ? 'text-lg'
            : isLg
            ? 'text-2xl sm:text-3xl'
            : isXl
            ? 'text-3xl sm:text-4xl'
            : 'text-xl sm:text-2xl'
        }`}
        style={{ color: fillColor }}
      >
        ARUNA
      </span>

      {/* Horizontal Tagline Lockup if specified */}
      {variant === 'horizontal-tagline' && (
        <>
          <span className="hidden md:inline-block text-[#B59A5A] font-bold">—</span>
          <span
            className="hidden md:inline-block text-xs font-semibold tracking-[0.15em] uppercase font-sans"
            style={{ color: secondaryColor }}
          >
            MAKE BUSINESS MAKE SENSE.
          </span>
        </>
      )}
    </div>
  );
};
