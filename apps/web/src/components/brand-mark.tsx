'use client';

import React, { useState, useEffect } from 'react';
import { getInstitutionConfigSync } from '../lib/institution';

interface GGYBrandMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withText?: boolean;
  subtitle?: string;
  customLogoUrl?: string;
  customTitle?: string;
}

export function GGYBrandMark({
  size = 'md',
  className = '',
  withText = false,
  subtitle,
  customLogoUrl,
  customTitle
}: GGYBrandMarkProps) {
  const [logoUrl, setLogoUrl] = useState<string>(customLogoUrl || '');
  const [orgName, setOrgName] = useState<string>(customTitle || 'GGY Finance');

  useEffect(() => {
    const updateFromConfig = () => {
      const cfg = getInstitutionConfigSync();
      if (!customLogoUrl && cfg.logoUrl) {
        setLogoUrl(cfg.logoUrl);
      }
      if (!customTitle && cfg.organizationName) {
        setOrgName(cfg.organizationName);
      }
    };

    updateFromConfig();
    window.addEventListener('nbfc_config_updated', updateFromConfig);
    return () => window.removeEventListener('nbfc_config_updated', updateFromConfig);
  }, [customLogoUrl, customTitle]);

  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-lg', svg: 20, text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-11 h-11 rounded-xl', svg: 26, text: 'text-base sm:text-lg', sub: 'text-[11px]' },
    lg: { box: 'w-14 h-14 rounded-2xl', svg: 34, text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16 rounded-2xl', svg: 40, text: 'text-2xl', sub: 'text-xs' }
  };

  const currentSize = sizeMap[size];

  const emblem = logoUrl ? (
    <div
      className={`${currentSize.box} bg-white shadow-sm border border-slate-200/80 p-1 flex items-center justify-center relative overflow-hidden flex-shrink-0 transition-transform hover:scale-105 ${className}`}
      aria-label="Institution Logo"
    >
      <img
        src={logoUrl}
        alt={orgName}
        className="w-full h-full object-contain"
      />
    </div>
  ) : (
    <div
      className={`${currentSize.box} bg-gradient-to-br from-[#064e3b] via-[#043e2f] to-[#022c22] text-white flex items-center justify-center shadow-md border border-emerald-500/30 ring-1 ring-white/10 relative overflow-hidden flex-shrink-0 transition-transform hover:scale-105 ${className}`}
      aria-label="GGY Finance Brand Emblem"
    >
      {/* Subtle radial lighting for high-definition depth */}
      <div className="absolute inset-0 bg-radial from-amber-400/20 via-transparent to-transparent opacity-80 pointer-events-none" />

      {/* Modern High-Resolution FinTech SVG Emblem: Financial Growth & Trust */}
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
          stroke="#FDE047"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Dynamic Growth Leaf / Prosperity Curve */}
        <path
          d="M16 6C11 6 7 10 7 15C7 20 16 23 16 23C16 23 25 20 25 15C25 10 21 6 16 6Z"
          fill="#065F46"
          stroke="#F97316"
          strokeWidth="1.8"
          vectorEffect="non-scaling-stroke"
        />
        {/* Central Core: Golden Grain / Indian Micro-Credit Symbol */}
        <circle cx="16" cy="14" r="3.2" fill="#FBBF24" />
        <path
          d="M16 11V17M13.5 13H18.5"
          stroke="#022C22"
          strokeWidth="1.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
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
        <h1 className={`font-bold ${currentSize.text} text-slate-900 tracking-tight leading-tight`}>
          {orgName}
        </h1>
        {subtitle && (
          <p className={`${currentSize.sub} text-orange-600 font-bold uppercase tracking-wider`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
