'use client';

import React from 'react';
import Link from 'next/link';
import { GGYBrandMark } from './brand-mark';
import { useLanguage } from './language-context';
import { Building2, Shield, HeartHandshake, FileText, Lock } from 'lucide-react';

export function PublicFooter() {
  const { lang } = useLanguage();

  const labels = {
    en: {
      brandDesc: 'Empowering rural micro-entrepreneurs, dairy farmers, and village households with honest, transparent, and technology-driven credit solutions across Karnataka.',
      platformLinks: 'Platform & Impact',
      home: 'Home',
      about: 'About GGY Finance',
      stories: 'Field Stories & Community Impact',
      legalLinks: 'Legal & Regulatory',
      privacy: 'Privacy Policy (DPDP 2023)',
      terms: 'Terms & Conditions',
      fairPractices: 'RBI Fair Practices Code',
      rbiReg: 'Certificate: B-14.02981',
      grievanceTitle: 'Grievance Redressal',
      grievanceOfficer: 'Principal Nodal Officer: Shri A. Deshmukh',
      tollFree: 'Toll-Free: 1800-209-4321 (9 AM - 6 PM)',
      escalation: 'Escalation: RBI CMS Portal (cms.rbi.org.in)',
      staffTitle: 'Staff & Internal Access',
      staffDesc: 'Dedicated login portal for Field Officers, Branch Managers, and Authorizers.',
      staffLogin: 'Staff Login Portal',
      copyright: '© 2026 GGY Finance Ltd. All rights reserved. 100% Data Sovereignty inside Indian Data Centers.'
    },
    kn: {
      brandDesc: 'ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು, ಹೈನುಗಾರಿಕೆ ಕುಟುಂಬಗಳು ಮತ್ತು ಸ್ವಸಹಾಯ ಗುಂಪುಗಳಿಗೆ ಪಾರದರ್ಶಕ ಮತ್ತು ಪ್ರಾಮಾಣಿಕ ಕಿರು ಸಾಲ ಸೇವೆ.',
      platformLinks: 'ವೇದಿಕೆ ಮತ್ತು ಪ್ರಭಾವ',
      home: 'ಮುಖಪುಟ',
      about: 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ ಬಗ್ಗೆ',
      stories: 'ಗ್ರಾಮೀಣ ಕಥೆಗಳು & ಸಮುದಾಯ ಪ್ರಭಾವ (Stories)',
      legalLinks: 'ಕಾನೂನು & ನಿಯಮಾವಳಿಗಳು',
      privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ (DPDP ಕಾಯ್ದೆ 2023)',
      terms: 'ನಿಯಮಗಳು & ಷರತ್ತುಗಳು (Terms)',
      fairPractices: 'ಆರ್.ಬಿ.ಐ ಪ್ರಾಮಾಣಿಕ ಸಾಲ ನೀತಿ',
      rbiReg: 'ಆರ್.ಬಿ.ಐ ನೋಂದಣಿ: B-14.02981',
      grievanceTitle: 'ಕುಂದುಕೊರತೆ ನಿವಾರಣೆ',
      grievanceOfficer: 'ಮುಖ್ಯ ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿ: ಶ್ರೀ ಎ. ದೇಶಮುಖ್',
      tollFree: 'ಉಚಿತ ಕರೆ: 1800-209-4321 (ಬೆಳಿಗ್ಗೆ 9 - ಸಂಜೆ 6)',
      escalation: 'ಮೇಲ್ಮನವಿ: ಆರ್.ಬಿ.ಐ ಸಿ.ಎಂ.ಎಸ್ ಪೋರ್ಟಲ್',
      staffTitle: 'ಸಿಬ್ಬಂದಿ ಆಂತರಿಕ ಪ್ರವೇಶ',
      staffDesc: 'ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳು ಮತ್ತು ಶಾಖಾ ವ್ಯವಸ್ಥಾಪಕರಿಗೆ ಮಾತ್ರ ಅಧಿಕೃತ ಲಾಗಿನ್ ಪೋರ್ಟಲ್.',
      staffLogin: 'ಸಿಬ್ಬಂದಿ ಲಾಗಿನ್ ಪೋರ್ಟಲ್',
      copyright: '© 2026 ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ (GGY Finance Ltd). ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಭಾರತೀಯ ಡೇಟಾ ಕೇಂದ್ರಗಳಲ್ಲಿ ಸಂಪೂರ್ಣ ಭದ್ರತೆ.'
    }
  };

  const t = labels[lang];

  return (
    <footer className="bg-forest-900 text-sandstone-200 py-12 px-4 border-t border-forest-800 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
        {/* Brand & Purpose */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <GGYBrandMark size="sm" />
            <div>
              <span className="font-bold text-sm text-white block">GGY Finance</span>
              <span className="text-[10px] text-terracotta-400 font-bold uppercase tracking-wider">
                Micro Money Lending Platform
              </span>
            </div>
          </div>
          <p className="text-sandstone-300/80 leading-relaxed text-[11px]">
            {t.brandDesc}
          </p>
          <div className="pt-2 text-[11px] text-sandstone-400">
            <p>Mandya • Ramanagara • Mysuru</p>
          </div>
        </div>

        {/* Platform Links (Home, About, Stories) */}
        <div>
          <h5 className="font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-terracotta-400" />
            <span>{t.platformLinks}</span>
          </h5>
          <ul className="space-y-2 text-sandstone-300">
            <li>
              <Link href="/" className="hover:text-terracotta-400 transition-colors">
                {t.home}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-terracotta-400 transition-colors font-medium">
                {t.about}
              </Link>
            </li>
            <li>
              <Link href="/stories" className="hover:text-terracotta-400 transition-colors font-medium">
                {t.stories}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Regulatory (Privacy, Terms, FPC) - FOOTER ONLY */}
        <div>
          <h5 className="font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-terracotta-400" />
            <span>{t.legalLinks}</span>
          </h5>
          <ul className="space-y-2 text-sandstone-300">
            <li>
              <Link href="/privacy" className="hover:text-terracotta-400 transition-colors">
                {t.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-terracotta-400 transition-colors">
                {t.terms}
              </Link>
            </li>
            <li className="text-sandstone-400">{t.fairPractices}</li>
            <li className="text-sandstone-400">{t.rbiReg}</li>
          </ul>
        </div>

        {/* Grievance & Staff Access */}
        <div>
          <h5 className="font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-terracotta-400" />
            <span>{t.grievanceTitle}</span>
          </h5>
          <ul className="space-y-1.5 text-sandstone-300 mb-4 text-[11px]">
            <li className="font-semibold text-white">{t.grievanceOfficer}</li>
            <li>grievance@ggyfinance.in</li>
            <li>{t.tollFree}</li>
            <li className="text-sandstone-400 text-[10px]">{t.escalation}</li>
          </ul>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-all text-xs shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.staffLogin}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-forest-800 text-center text-sandstone-400 text-xs">
        {t.copyright}
      </div>
    </footer>
  );
}
