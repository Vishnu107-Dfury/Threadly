import React from 'react';

/**
 * Threadly Brand Logo Mark
 * A minimal line-art icon of a spool of thread with a single thread trailing off
 * and looping gracefully into the shape of a "T" (Threadly).
 * Works crisply at 16x16, 24x24, 32x32, 48x48.
 */
export default function Logo({ size = 28, className = '', showSecondaryColor = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none shrink-0 ${className}`}
      aria-label="Threadly Logo"
    >
      {/* Top flange of spool */}
      <rect
        x="3.5"
        y="4"
        width="14"
        height="3"
        rx="1.5"
        className="fill-brand-primary"
      />

      {/* Central wound thread core */}
      <rect
        x="5"
        y="7"
        width="11"
        height="13"
        rx="1"
        className="fill-brand-primary/15 stroke-brand-primary"
        strokeWidth="1.25"
      />
      {/* Delicate horizontal wound thread lines */}
      <line
        x1="5"
        y1="10"
        x2="16"
        y2="10"
        className="stroke-brand-primary"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="13"
        x2="16"
        y2="13"
        className="stroke-brand-primary"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="16"
        x2="16"
        y2="16"
        className="stroke-brand-primary"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* Bottom flange of spool */}
      <rect
        x="3.5"
        y="20"
        width="14"
        height="3"
        rx="1.5"
        className="fill-brand-primary"
      />

      {/* Trailing thread unspooling from bottom and looping into 'T' shape */}
      <path
        d="M10.5 23C10.5 26.5 14 28.5 17.5 28.5C21 28.5 23 26 23 22V9M18 9H28"
        className={showSecondaryColor ? 'stroke-brand-accent' : 'stroke-brand-primary'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
