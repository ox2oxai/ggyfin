'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GGYBrandMark } from './brand-mark';
import { useLanguage } from './language-context';
import { Lock } from 'lucide-react';

export function PublicHeader() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();

  const labels = {
    en: {
      topBar: 'RBI Registered NBFC-BL (Base Layer) | Reg. Certificate No: B-14.02981',
      brandName: 'GGY Finance',
      tagline: 'Micro Money Lending Platform',
      home: 'Home',
      about: 'About Us',
      staffPortal: 'Staff Portal',
      tollFree: 'Toll-Free: 1800-209-4321',
      dpdp: 'DPDP Act 2023 Compliant'
    },
    kn: {
      topBar: 'ಆರ್.ಬಿ.ಐ ನೋಂದಾಯಿತ ಕಿರು ಸಾಲ ಸಂಸ್ಥೆ (NBFC-BL) | ಪ್ರಮಾಣಪತ್ರ: B-14.02981',
      brandName: 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ (GGY Finance)',
      tagline: 'ಕಿರು ಹಣಕಾಸು ಸಾಲ ವೇದಿಕೆ (Micro Money Lending Platform)',
      home: 'ಮುಖಪುಟ (Home)',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ (About)',
      staffPortal: 'ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್',
      tollFree: 'ಉಚಿತ ಕರೆ: 1800-209-4321',
      dpdp: 'DPDP ಕಾಯ್ದೆ 2023 ಅನುಸರಣೆ'
    }
  };

  const t = labels[lang];

  return (
    <>
      {/* Top Compliance Bar */}
      <div className="bg-forest-900 text-sandstone-200 text-xs py-2 px-4 border-b border-forest-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{t.topBar}</span>
          </div>
          <div className="flex items-center gap-4 text-sandstone-300">
            <span>{t.dpdp}</span>
            <span>•</span>
            <span>{t.tollFree}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar: Home & About ONLY */}
      <header className="bg-sandstone-50 border-b border-clay/60 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <GGYBrandMark size="md" />
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-forest-900 leading-tight group-hover:text-terracotta-600 transition-colors">
                {t.brandName}
              </h1>
              <p className="text-[11px] text-terracotta-600 font-bold uppercase tracking-wider">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Navigation Links: Home and About in Header */}
          <nav className="flex items-center gap-1 sm:gap-6">
            <div className="hidden md:flex items-center gap-1 bg-sandstone-200/70 p-1 rounded-xl border border-clay text-xs font-bold">
              <Link
                href="/"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-forest-800 hover:text-terracotta-600 hover:bg-sandstone-100'
                }`}
              >
                {t.home}
              </Link>
              <Link
                href="/about"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/about'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-forest-800 hover:text-terracotta-600 hover:bg-sandstone-100'
                }`}
              >
                {t.about}
              </Link>
            </div>

            {/* Bilingual Switcher: English | Kannada */}
            <div className="flex items-center gap-1 bg-sandstone-200 p-1 rounded-xl border border-clay text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-forest-800 hover:text-terracotta-600'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('kn')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                  lang === 'kn'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-forest-800 hover:text-terracotta-600'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Staff Portal Login */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-900 text-sandstone-50 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow"
            >
              <Lock className="w-3.5 h-3.5 text-terracotta-500" />
              <span className="hidden sm:inline">{t.staffPortal}</span>
              <span className="sm:hidden">Staff</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
