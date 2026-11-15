'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GGYBrandMark } from './brand-mark';
import { useLanguage } from './language-context';
import { Menu, X, MessageCircle } from 'lucide-react';
import { getInstitutionConfigSync, InstitutionConfig } from '../lib/institution';

export function PublicHeader() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [config, setConfig] = useState<InstitutionConfig>(getInstitutionConfigSync());

  useEffect(() => {
    const handleSync = () => {
      setConfig(getInstitutionConfigSync());
    };
    handleSync();
    window.addEventListener('nbfc_config_updated', handleSync);
    return () => window.removeEventListener('nbfc_config_updated', handleSync);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleResize);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  const labels = {
    en: {
      topBar: config.platformTagline || 'National Micro-Lending Platform • Doorstep Financial Services',
      brandName: config.organizationName || 'GGY Finance',
      tagline: 'Micro Money Lending Platform',
      home: 'Home',
      about: 'About Us',
      investments: 'Investments',
      gallery: 'Gallery',
      contact: 'Contact Us',
      tollFree: `Helpline: ${config.supportPhone || '1800-889-2020'}`,
      dpdp: 'DPDP Act 2023 Compliant',
      whatsappQuick: 'WhatsApp Advisory'
    },
    kn: {
      topBar: 'ರಾಷ್ಟ್ರೀಯ ಕಿರು ಸಾಲ ಸೇವಾ ಸಂಸ್ಥೆ • ಮನೆಬಾಗಿಲ ಆರ್ಥಿಕ ಸೇವೆ',
      brandName: config.organizationName || 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ (GGY Finance)',
      tagline: 'ಕಿರು ಹಣಕಾಸು ಸಾಲ ವೇದಿಕೆ (Micro Money Lending Platform)',
      home: 'ಮುಖಪುಟ',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      investments: 'ಹೂಡಿಕೆಗಳು',
      gallery: 'ಗ್ಯಾಲರಿ',
      contact: 'ಸಂಪರ್ಕಿಸಿ',
      tollFree: `ಸಹಾಯವಾಣಿ: ${config.supportPhone || '1800-889-2020'}`,
      dpdp: 'DPDP ಕಾಯ್ದೆ 2023 ಅನುಸರಣೆ',
      whatsappQuick: 'ವಾಟ್ಸಾಪ್ ಸಹಾಯ'
    }
  };

  const t = labels[lang];

  return (
    <>
      {/* Top Compliance Bar: Deep Midnight Imperial Forest */}
      <div className="bg-[#062e1c] text-emerald-200 text-xs py-2 px-4 border-b border-emerald-900/60">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
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
              href={`https://wa.me/919845123450?text=${encodeURIComponent('Namaskara GGY Finance, I want information about Rural Loans, Investments, and Daily Piggy.')}`}
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
      <header className="bg-white/95 border-b border-slate-200/90 sticky top-0 z-40 backdrop-blur-md shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <GGYBrandMark size="md" />
            <div>
              <h1 className="font-black text-lg sm:text-xl text-slate-950 leading-tight group-hover:text-orange-600 transition-colors tracking-tight">
                {t.brandName}
              </h1>
              <p className="text-[10px] text-orange-600 font-extrabold uppercase tracking-wider">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              <Link
                href="/"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-white'
                }`}
              >
                {t.home}
              </Link>
              <Link
                href="/about"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/about'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-white'
                }`}
              >
                {t.about}
              </Link>
              <Link
                href="/investments"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/investments'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-white'
                }`}
              >
                {t.investments}
              </Link>
              <Link
                href="/gallery"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/gallery'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-white'
                }`}
              >
                {t.gallery}
              </Link>
              <Link
                href="/contact"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === '/contact'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-white'
                }`}
              >
                {t.contact}
              </Link>
            </div>

            {/* Bilingual Switcher: English | Kannada */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-[#064e3b] text-white shadow-xs font-extrabold'
                    : 'text-slate-700 hover:text-orange-600'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('kn')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  lang === 'kn'
                    ? 'bg-[#064e3b] text-white shadow-xs font-extrabold'
                    : 'text-slate-700 hover:text-orange-600'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </nav>

          {/* Mobile Right Controls: Language + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-[#064e3b] text-white' : 'text-slate-700'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('kn')}
                className={`px-2 py-1 rounded ${lang === 'kn' ? 'bg-[#064e3b] text-white' : 'text-slate-700'}`}
              >
                ಕನ್ನ
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-3 rounded-xl border text-center transition-all min-h-[44px] flex items-center justify-center ${
                  pathname === '/' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-600 shadow-xs' : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                {t.home}
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-3 rounded-xl border text-center transition-all min-h-[44px] flex items-center justify-center ${
                  pathname === '/about' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-600 shadow-xs' : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                {t.about}
              </Link>
              <Link
                href="/investments"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-3 rounded-xl border text-center transition-all min-h-[44px] flex items-center justify-center ${
                  pathname === '/investments' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-600 shadow-xs' : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                {t.investments}
              </Link>
              <Link
                href="/gallery"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-3 rounded-xl border text-center transition-all min-h-[44px] flex items-center justify-center ${
                  pathname === '/gallery' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-600 shadow-xs' : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                {t.gallery}
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`col-span-2 p-3 rounded-xl border text-center transition-all min-h-[44px] flex items-center justify-center ${
                  pathname === '/contact' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-600 shadow-xs' : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                {t.contact}
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-200 text-center">
              <a
                href={`https://wa.me/919845123450?text=${encodeURIComponent('Namaskara GGY Finance, I want information about Rural Loans, Investments, and Daily Piggy.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-950 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200 w-full justify-center min-h-[44px]"
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
