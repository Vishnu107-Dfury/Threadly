import React from 'react';
import Logo from './Logo';

/**
 * Threadly Brand Wordmark
 * Modern geometric sans-serif, medium-bold weight, tight letter spacing (-0.03em)
 * Accompanied by the minimal line-art thread spool mark.
 */
export default function Wordmark({
  size = 'default',
  showLogo = true,
  className = '',
  withTagline = false
}) {
  const sizeClasses = {
    sm: 'text-lg',
    default: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const logoSizes = {
    sm: 20,
    default: 24,
    lg: 30,
    xl: 36
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {showLogo && <Logo size={logoSizes[size] || 24} />}
      <div className="flex flex-col">
        <span
          className={`font-sans font-bold tracking-tight text-slate-900 dark:text-slate-100 ${sizeClasses[size] || 'text-xl'}`}
          style={{ letterSpacing: '-0.035em' }}
        >
          Thread<span className="text-brand-primary">ly</span>
        </span>
        {withTagline && (
          <span className="text-[11px] font-medium tracking-normal text-slate-500 dark:text-slate-400 -mt-1">
            Weave your style.
          </span>
        )}
      </div>
    </div>
  );
}
