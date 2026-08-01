import React from 'react';

interface FlagIconProps {
  code: 'ko' | 'ja' | 'en' | 'kr' | 'jp' | 'us';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FlagIcon: React.FC<FlagIconProps> = ({ code, className = '', size = 'md' }) => {
  const normCode = code.toLowerCase() === 'ko' ? 'kr' : code.toLowerCase() === 'ja' ? 'jp' : code.toLowerCase() === 'en' ? 'us' : code.toLowerCase();

  const dimensions = size === 'sm' ? 'w-5 h-3.5' : size === 'lg' ? 'w-10 h-7' : 'w-8 h-5.5';

  return (
    <img
      src={`https://flagcdn.com/w80/${normCode}.png`}
      srcSet={`https://flagcdn.com/w160/${normCode}.png 2x`}
      alt={`${normCode.toUpperCase()} Flag`}
      className={`${dimensions} rounded-xs object-cover shadow-2xs border border-slate-200 shrink-0 ${className}`}
      onError={(e) => {
        // SVG Data URI fallback if offline
        const target = e.target as HTMLImageElement;
        if (normCode === 'kr') {
          target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23fff"/><circle cx="1.5" cy="1" r="0.5" fill="%23c60c30"/></svg>';
        } else if (normCode === 'jp') {
          target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23fff"/><circle cx="1.5" cy="1" r="0.6" fill="%23bc002d"/></svg>';
        } else {
          target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%233c3b6e"/></svg>';
        }
      }}
    />
  );
};
