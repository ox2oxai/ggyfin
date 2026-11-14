'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GGYBrandMark } from './brand-mark';
import { useLanguage } from './language-context';
import { Lock, User } from 'lucide-react';

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
      borrowerPortal: 'Borrower Portal',
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
      borrowerPortal: 'ಗ್ರಾಹಕರ ಪೋರ್ಟಲ್',
      staffPortal: 'ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್',
      tollFree: 'ಉಚಿತ ಕರೆ: 1800-209-4321',
      dpdp: 'DPDP ಕಾಯ್ದೆ 2023 ಅನುಸರಣೆ'
    }
  };

  const t = labels[lang];

  return (
    <>
      {/* Top Compliance Bar: Deep Midnight Imperial Forest */}
      <div className="bg-bankGreen-950 text-emerald-200 text-xs py-2 px-4 border-b border-bankGreen-900">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-saffron-500 animate-pulse"></span>
            <span>{t.topBar}</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-300/80 font-medium">
            <span>{t.dpdp}</span>
            <span>•</span>
            <span className="font-mono text-emerald-200 font-bold">{t.tollFree}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar: Clean Pearl White with Crisp Saffron & Bank Green Accents */}
      <header className="bg-white/95 border-b border-pearl-300/80 sticky top-0 z-40 backdrop-blur-md shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <GGYBrandMark size="md" />
            <div>
              <h1 className="font-black text-lg sm:text-xl text-bankGreen-950 leading-tight group-hover:text-saffron-600 transition-colors tracking-tight">
                {t.brandName}
              </h1>
              <p className="text-[10px] text-saffron-600 font-extrabold uppercase tracking-wider">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Navigation Links: Home and About */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-1 bg-pearl-200/80 p-1 rounded-xl border border-pearl-300 text-xs font-bold">
              <Link
                href="/"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/'
                    ? 'bg-bankGreen-900 text-white shadow-xs font-extrabold'
                    : 'text-bankGreen-900 hover:text-saffron-600 hover:bg-white'
                }`}
              >
                {t.home}
              </Link>
              <Link
                href="/about"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/about'
                    ? 'bg-bankGreen-900 text-white shadow-xs font-extrabold'
                    : 'text-bankGreen-900 hover:text-saffron-600 hover:bg-white'
                }`}
              >
                {t.about}
              </Link>
            </div>

            {/* Bilingual Switcher: English | Kannada */}
            <div className="flex items-center gap-1 bg-pearl-200 p-1 rounded-xl border border-pearl-300 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-bankGreen-900 text-white shadow-xs font-extrabold'
                    : 'text-bankGreen-900 hover:text-saffron-600'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('kn')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                  lang === 'kn'
                    ? 'bg-bankGreen-900 text-white shadow-xs font-extrabold'
                    : 'text-bankGreen-900 hover:text-saffron-600'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Borrower Self-Service Portal Login */}
            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 bg-bankGreen-50 hover:bg-bankGreen-100 text-bankGreen-900 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-bankGreen-200"
            >
              <User className="w-3.5 h-3.5 text-bankGreen-700" />
              <span className="hidden sm:inline">{t.borrowerPortal}</span>
              <span className="sm:hidden">Borrower</span>
            </Link>

            {/* Bank Staff Portal Login */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-md hover:shadow-lg shadow-saffron-500/20"
            >
              <Lock className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">{t.staffPortal}</span>
              <span className="sm:hidden">Staff</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
