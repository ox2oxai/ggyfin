'use client';

import React from 'react';
import Link from 'next/link';
import { GGYBrandMark } from './brand-mark';
import { useLanguage } from './language-context';
import { Building2, Shield, HeartHandshake, FileText, Lock, PhoneCall, Mail, User } from 'lucide-react';

export function PublicFooter() {
  const { lang } = useLanguage();

  const labels = {
    en: {
      brandDesc: 'Empowering rural micro-entrepreneurs, dairy farmers, and village artisans with honest, transparent, and technology-driven credit solutions across Karnataka.',
      schemesTitle: 'Credit Schemes',
      scheme1: 'SCHM-701: Kirana Retail Capital',
      scheme2: 'SCHM-702: Dairy Development Loan',
      scheme3: 'SCHM-703: Powerloom Artisan Loan',
      scheme4: 'SCHM-704: Organic Agri-Allied Loan',
      investmentsLink: 'Rural Wealth: Micro-SIP & FDs',
      branchesTitle: 'Karnataka Branches',
      branch1: 'Bengaluru City & Rural Hub',
      branch2: 'Ramanagara & Channapatna Hub',
      branch3: 'Mandya & Maddur Hub',
      branch4: 'Tumakuru & Kunigal Hub',
      branch5: 'Mysuru & Nanjangud Hub',
      contactAllLink: 'All Branches & Nodal Office →',
      grievanceTitle: 'Nodal Grievance Redressal',
      grievanceOfficer: 'Principal Nodal Officer: Smt. Anita Deshmukh',
      tollFree: 'Toll-Free: 1800-209-4321 (9 AM - 6 PM)',
      email: 'nodal@ggyfinance.in',
      escalation: 'Escalation: RBI Ombudsman CMS Portal (cms.rbi.org.in)',
      portalAccess: 'Secure Portal Access',
      borrowerLogin: 'Borrower Portal',
      staffLogin: 'Staff Portal',
      privacy: 'DPDP Privacy Notice',
      terms: 'Terms & Conditions',
      fairPractices: 'Fair Practices Code',
      rbiReg: 'Certificate: B-14.02981',
      copyright: '© 2026 GGY Finance (Karnataka) Private Limited. All rights reserved. 100% Data Sovereignty inside Indian Data Centers.'
    },
    kn: {
      brandDesc: 'ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು, ಹೈನುಗಾರಿಕೆ ಕುಟುಂಬಗಳು ಮತ್ತು ನೇಕಾರರಿಗೆ ಪಾರದರ್ಶಕ ಮತ್ತು ಪ್ರಾಮಾಣಿಕ ಕಿರು ಸಾಲ ಸೇವೆ.',
      schemesTitle: 'ಸಾಲ ಯೋಜನೆಗಳು (Schemes)',
      scheme1: 'SCHM-701: ಕಿರಾಣಿ & ಸಣ್ಣ ವ್ಯಾಪಾರ ಬಂಡವಾಳ',
      scheme2: 'SCHM-702: ಹೈನುಗಾರಿಕೆ ಅಭಿವೃದ್ಧಿ ಸಾಲ',
      scheme3: 'SCHM-703: ನೇಯ್ಗೆ & ಕೈಮಗ್ಗ ಕುಶಲಕರ್ಮಿ ಸಾಲ',
      scheme4: 'SCHM-704: ಕಿರು ಕೃಷಿ & ತೋಟಗಾರಿಕೆ ಸಾಲ',
      investmentsLink: 'ಗ್ರಾಮೀಣ ಹೂಡಿಕೆ: ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ & ಎಫ್‌ಡಿ',
      branchesTitle: 'ಕರ್ನಾಟಕ ಶಾಖಾ ಜಾಲ',
      branch1: 'ಬೆಂಗಳೂರು ನಗರ & ಗ್ರಾಮಾಂತರ',
      branch2: 'ರಾಮನಗರ & ಚನ್ನಪಟ್ಟಣ',
      branch3: 'ಮಂಡ್ಯ & ಮದ್ದೂರು',
      branch4: 'ತುಮಕೂರು & ಕುಣಿಗಲ್',
      branch5: 'ಮೈಸೂರು & ನಂಜನಗೂಡು',
      contactAllLink: 'ಎಲ್ಲಾ ಶಾಖೆಗಳ ಸಂಪರ್ಕ & ನೊಡಲ್ ಕಚೇರಿ →',
      grievanceTitle: 'ಕುಂದುಕೊರತೆ ನಿವಾರಣೆ',
      grievanceOfficer: 'ಮುಖ್ಯ ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿ: ಶ್ರೀಮತಿ ಅನಿತಾ ದೇಶಮುಖ್',
      tollFree: 'ಉಚಿತ ಕರೆ: 1800-209-4321 (ಬೆಳಿಗ್ಗೆ 9 - ಸಂಜೆ 6)',
      email: 'nodal@ggyfinance.in',
      escalation: 'ಮೇಲ್ಮನವಿ: ಆರ್.ಬಿ.ಐ ಸಿ.ಎಂ.ಎಸ್ ಪೋರ್ಟಲ್',
      portalAccess: 'ಆಂತರಿಕ ಪೋರ್ಟಲ್ ಪ್ರವೇಶ',
      borrowerLogin: 'ಗ್ರಾಹಕರ ಪೋರ್ಟಲ್',
      staffLogin: 'ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್',
      privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ (DPDP 2023)',
      terms: 'ನಿಯಮಗಳು & ಷರತ್ತುಗಳು',
      fairPractices: 'ಆರ್.ಬಿ.ಐ ಪ್ರಾಮಾಣಿಕ ಸಾಲ ನೀತಿ',
      rbiReg: 'ಆರ್.ಬಿ.ಐ ನೋಂದಣಿ: B-14.02981',
      copyright: '© 2026 ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ (GGY Finance Ltd). ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಭಾರತೀಯ ಡೇಟಾ ಕೇಂದ್ರಗಳಲ್ಲಿ ಸಂಪೂರ್ಣ ಭದ್ರತೆ.'
    }
  };

  const t = labels[lang];

  return (
    <footer className="bg-gradient-to-b from-[#064e3b] to-[#022c22] text-white pt-14 pb-8 px-4 sm:px-8 lg:px-12 border-t border-emerald-900 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-800/80 text-xs">
        {/* Col 1: Brand & Purpose */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <GGYBrandMark size="sm" />
            <div>
              <span className="font-black text-base text-white block tracking-tight">GGY Finance</span>
              <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
                Micro Money Lending Platform
              </span>
            </div>
          </div>
          <p className="text-emerald-200/90 text-xs leading-relaxed font-normal">
            {t.brandDesc}
          </p>
          <div className="pt-1">
            <span className="inline-block bg-emerald-950/80 text-emerald-200 border border-emerald-700/80 px-2.5 py-1 rounded-full text-[10px] font-mono">
              RBI Reg: B-14.02981
            </span>
          </div>
        </div>

        {/* Col 2: Core Banking Schemes */}
        <div className="space-y-2.5">
          <p className="font-extrabold text-amber-300 text-xs uppercase tracking-wider">
            {t.schemesTitle}
          </p>
          <ul className="space-y-2 text-emerald-200 text-xs">
            <li>
              <Link href="/#products" className="hover:text-white transition-colors">
                {t.scheme1}
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-white transition-colors">
                {t.scheme2}
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-white transition-colors">
                {t.scheme3}
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-white transition-colors">
                {t.scheme4}
              </Link>
            </li>
            <li className="pt-1.5 border-t border-emerald-800/60">
              <Link href="/investments" className="text-amber-300 hover:text-white font-bold flex items-center gap-1">
                <span>{t.investmentsLink}</span>
                <span>&rarr;</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Karnataka Operational Branches */}
        <div className="space-y-2.5">
          <p className="font-extrabold text-amber-300 text-xs uppercase tracking-wider">
            {t.branchesTitle}
          </p>
          <ul className="space-y-1.5 text-emerald-200 text-xs">
            <li>{t.branch1}</li>
            <li>{t.branch2}</li>
            <li>{t.branch3}</li>
            <li>{t.branch4}</li>
            <li>{t.branch5}</li>
            <li className="pt-1.5 border-t border-emerald-800/60">
              <Link href="/contact" className="text-amber-300 hover:text-white font-bold block">
                {t.contactAllLink}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Grievance Redressal & Staff Access */}
        <div className="space-y-2.5">
          <p className="font-extrabold text-amber-300 text-xs uppercase tracking-wider">
            {t.grievanceTitle}
          </p>
          <p className="text-emerald-200 leading-relaxed text-xs">
            {t.grievanceOfficer}<br />
            {t.tollFree}<br />
            Email: <span className="font-mono text-emerald-300">{t.email}</span>
          </p>
          <p className="text-[11px] text-amber-300 font-semibold pt-1">
            {t.escalation}
          </p>
          <div className="pt-2 space-y-1.5">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/80">
              {t.portalAccess}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/portal"
                className="inline-flex items-center gap-1.5 bg-emerald-950/90 hover:bg-emerald-800 text-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-700/80 text-xs font-bold transition-all"
              >
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.borrowerLogin}</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-700/80 text-xs font-bold transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.staffLogin}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer Legal & DPDP Notice */}
      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-emerald-300/80 gap-3">
        <p>{t.copyright}</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-white transition-colors">
            {t.privacy}
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            {t.terms}
          </Link>
          <span>•</span>
          <span className="text-emerald-400">{t.fairPractices}</span>
        </div>
      </div>
    </footer>
  );
}
