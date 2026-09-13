import React from 'react';

interface FlagIconProps {
  code?: 'ko' | 'ja' | 'en' | 'kr' | 'jp' | 'us' | 'gb' | string;
  country?: 'ko' | 'ja' | 'en' | 'kr' | 'jp' | 'us' | 'gb' | string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const FlagIcon: React.FC<FlagIconProps> = ({ code, country, className = '', size }) => {
  const rawCode = (code || country || 'en').toLowerCase();
  const normCode =
    rawCode === 'ko' || rawCode === 'kr'
      ? 'kr'
      : rawCode === 'ja' || rawCode === 'jp'
      ? 'jp'
      : rawCode === 'gb' || rawCode === 'en' || rawCode === 'eng' || rawCode === 'us' || rawCode === 'uk'
      ? 'gb'
      : rawCode;

  const dimensions =
    size === 'xs'
      ? 'w-4 h-3'
      : size === 'sm'
      ? 'w-5 h-3.5'
      : size === 'md'
      ? 'w-8 h-5.5'
      : size === 'lg'
      ? 'w-10 h-7'
      : '';

  return (
    <img
      src={`https://flagcdn.com/w80/${normCode}.png`}
      srcSet={`https://flagcdn.com/w160/${normCode}.png 2x`}
      alt={`${normCode.toUpperCase()} Flag`}
      className={`${dimensions} rounded-2xs object-cover shadow-2xs border border-black/10 dark:border-white/20 shrink-0 ${className}`}
      onError={(e) => {
        // SVG Data URI fallback if offline
        const target = e.target as HTMLImageElement;
        if (normCode === 'kr') {
          target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23fff"/><circle cx="1.5" cy="1" r="0.5" fill="%23c60c30"/></svg>';
        } else if (normCode === 'jp') {
          target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23fff"/><circle cx="1.5" cy="1" r="0.6" fill="%23bc002d"/></svg>';
        } else if (normCode === 'gb') {
          target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><rect width="60" height="30" fill="%23012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="%23fff" stroke-width="6"/><path d="M30,0 v30 M0,15 h60" stroke="%23fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="%23c8102e" stroke-width="6"/></svg>';
        } else {
          target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%233c3b6e"/></svg>';
        }
      }}
    />
  );
};
