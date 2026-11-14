import React from 'react';

interface GGYBrandMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withText?: boolean;
  subtitle?: string;
}

export function GGYBrandMark({
  size = 'md',
  className = '',
  withText = false,
  subtitle
}: GGYBrandMarkProps) {
  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-lg', svg: 20, text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-11 h-11 rounded-xl', svg: 26, text: 'text-base sm:text-lg', sub: 'text-[11px]' },
    lg: { box: 'w-14 h-14 rounded-2xl', svg: 34, text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16 rounded-2xl', svg: 40, text: 'text-2xl', sub: 'text-xs' }
  };

  const currentSize = sizeMap[size];

  const emblem = (
    <div
      className={`${currentSize.box} bg-[#163323] text-sandstone-100 flex items-center justify-center shadow-md border border-forest-600/40 relative overflow-hidden flex-shrink-0 transition-transform hover:scale-105 ${className}`}
      aria-label="GGY Finance Brand Emblem"
    >
      {/* Subtle institutional pattern background */}
      <div className="absolute inset-0 bg-radial from-forest-700/30 to-transparent opacity-60" />

      {/* Stylized Modern FinTech SVG Emblem: Financial Growth & Trust */}
      <svg
        width={currentSize.svg}
        height={currentSize.svg}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Foundation Arch - Stability / Micro-Lending Trust */}
        <path
          d="M6 24C6 24 10 26 16 26C22 26 26 24 26 24"
          stroke="#E5DECE"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Dynamic Growth Leaf / Prosperity Curve */}
        <path
          d="M16 6C11 6 7 10 7 15C7 20 16 23 16 23C16 23 25 20 25 15C25 10 21 6 16 6Z"
          fill="#1E3A2F"
          stroke="#C05621"
          strokeWidth="1.8"
        />
        {/* Central Core: Golden Grain / Indian Micro-Credit Symbol */}
        <circle cx="16" cy="14" r="3.2" fill="#E5DECE" />
        <path
          d="M16 11V17M13.5 13H18.5"
          stroke="#163323"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  if (!withText) {
    return emblem;
  }

  return (
    <div className="flex items-center gap-3">
      {emblem}
      <div>
        <h1 className={`font-extrabold ${currentSize.text} text-forest-900 leading-tight`}>
          GGY Finance
        </h1>
        {subtitle && (
          <p className={`${currentSize.sub} text-terracotta-600 font-bold uppercase tracking-wider`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
