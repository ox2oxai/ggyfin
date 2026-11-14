'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GGYBrandMark } from './brand-mark';
import { useLanguage } from './language-context';
import { Menu, X, MessageCircle } from 'lucide-react';

export function PublicHeader() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const labels = {
    en: {
      topBar: 'Karnataka State Registered Micro-Lending Platform • Doorstep Financial Services',
      brandName: 'GGY Finance',
      tagline: 'Micro Money Lending Platform',
      home: 'Home',
      about: 'About Us',
      investments: 'Investments',
      contact: 'Contact Us',
      tollFree: 'Toll-Free: 1800-209-4321',
      dpdp: 'DPDP Act 2023 Compliant',
      whatsappQuick: 'WhatsApp Advisory'
    },
    kn: {
      topBar: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ನೋಂದಾಯಿತ ಕಿರು ಸಾಲ ಸೇವಾ ಸಂಸ್ಥೆ • ಮನೆಬಾಗಿಲ ಆರ್ಥಿಕ ಸೇವೆ',
      brandName: 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ (GGY Finance)',
      tagline: 'ಕಿರು ಹಣಕಾಸು ಸಾಲ ವೇದಿಕೆ (Micro Money Lending Platform)',
      home: 'ಮುಖಪುಟ',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      investments: 'ಹೂಡಿಕೆಗಳು',
      contact: 'ಸಂಪರ್ಕಿಸಿ',
      tollFree: 'ಉಚಿತ ಕರೆ: 1800-209-4321',
      dpdp: 'DPDP ಕಾಯ್ದೆ 2023 ಅನುಸರಣೆ',
      whatsappQuick: 'ವಾಟ್ಸಾಪ್ ಸಹಾಯ'
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
            <a href="tel:18002094321" className="font-mono text-emerald-200 font-bold hover:underline">
              {t.tollFree}
            </a>
            <span className="hidden md:inline">•</span>
            <a
              href="https://wa.me/919845123450?text=Namaskara%20GGY%20Finance,%20I%20want%20information%20about%20Rural%20Loans%20and%20Mutual%20Fund%20Investments."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-amber-300 hover:text-white font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.whatsappQuick}</span>
            </a>
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1 bg-pearl-200/80 p-1 rounded-xl border border-pearl-300">
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
              <Link
                href="/investments"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/investments'
                    ? 'bg-bankGreen-900 text-white shadow-xs font-extrabold'
                    : 'text-bankGreen-900 hover:text-saffron-600 hover:bg-white'
                }`}
              >
                {t.investments}
              </Link>
              <Link
                href="/contact"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/contact'
                    ? 'bg-bankGreen-900 text-white shadow-xs font-extrabold'
                    : 'text-bankGreen-900 hover:text-saffron-600 hover:bg-white'
                }`}
              >
                {t.contact}
              </Link>
            </div>

            {/* Bilingual Switcher: English | Kannada */}
            <div className="flex items-center gap-1 bg-pearl-200 p-1 rounded-xl border border-pearl-300">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
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
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  lang === 'kn'
                    ? 'bg-bankGreen-900 text-white shadow-xs font-extrabold'
                    : 'text-bankGreen-900 hover:text-saffron-600'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </nav>

          {/* Mobile Right Controls: Language + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center gap-0.5 bg-pearl-200 p-0.5 rounded-lg border border-pearl-300 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-bankGreen-900 text-white' : 'text-slate-700'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('kn')}
                className={`px-2 py-1 rounded ${lang === 'kn' ? 'bg-bankGreen-900 text-white' : 'text-slate-700'}`}
              >
                ಕನ್ನ
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-pearl-200 text-bankGreen-950 border border-pearl-300 hover:bg-pearl-300 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-pearl-300 bg-white px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  pathname === '/' ? 'bg-bankGreen-900 text-white' : 'bg-pearl-100 text-slate-800'
                }`}
              >
                {t.home}
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  pathname === '/about' ? 'bg-bankGreen-900 text-white' : 'bg-pearl-100 text-slate-800'
                }`}
              >
                {t.about}
              </Link>
              <Link
                href="/investments"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  pathname === '/investments' ? 'bg-bankGreen-900 text-white' : 'bg-pearl-100 text-slate-800'
                }`}
              >
                {t.investments}
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  pathname === '/contact' ? 'bg-bankGreen-900 text-white' : 'bg-pearl-100 text-slate-800'
                }`}
              >
                {t.contact}
              </Link>
            </div>

            <div className="pt-2 border-t border-pearl-200 text-center">
              <a
                href="https://wa.me/919845123450?text=Namaskara%20GGY%20Finance,%20I%20want%20information%20about%20Rural%20Loans%20and%20Mutual%20Fund%20Investments."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 w-full justify-center"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat with Advisor on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
