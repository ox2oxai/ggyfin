'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GGYBrandMark } from './brand-mark';
import { useLanguage } from './language-context';
import { Building2, Shield, HeartHandshake, FileText, Lock, PhoneCall, Mail, User } from 'lucide-react';
import {
  getInstitutionConfigSync,
  getCreditSchemesSync,
  getBranchesSync,
  InstitutionConfig,
  CreditScheme,
  BranchRecord,
  DEFAULT_INSTITUTION_CONFIG,
  DEFAULT_CREDIT_SCHEMES,
  DEFAULT_BRANCHES
} from '../lib/institution';

export function PublicFooter() {
  const { lang } = useLanguage();
  const [config, setConfig] = useState<InstitutionConfig>(DEFAULT_INSTITUTION_CONFIG);
  const [schemes, setSchemes] = useState<CreditScheme[]>(DEFAULT_CREDIT_SCHEMES);
  const [branches, setBranches] = useState<BranchRecord[]>(DEFAULT_BRANCHES);

  useEffect(() => {
    const handleSync = () => {
      setConfig(getInstitutionConfigSync());
      setSchemes(getCreditSchemesSync());
      setBranches(getBranchesSync());
    };
    handleSync();
    window.addEventListener('nbfc_config_updated', handleSync);
    window.addEventListener('nbfc_schemes_updated', handleSync);
    window.addEventListener('nbfc_branches_updated', handleSync);
    return () => {
      window.removeEventListener('nbfc_config_updated', handleSync);
      window.removeEventListener('nbfc_schemes_updated', handleSync);
      window.removeEventListener('nbfc_branches_updated', handleSync);
    };
  }, []);

  const activeSchemes = schemes.filter((s) => s.isActive).slice(0, 4);
  const activeBranches = branches.filter((b) => b.isActive);

  const labels = {
    en: {
      brandDesc: 'Empowering micro-entrepreneurs, dairy farmers, and village households with honest, transparent, and technology-driven doorstep credit solutions.',
      schemesTitle: 'Credit Schemes',
      investmentsLink: 'Rural Wealth: Micro-SIP & FDs',
      branchesTitle: 'Branch Network',
      contactAllLink: 'Branch Details & Nodal Office →',
      grievanceTitle: 'Nodal Grievance Redressal',
      grievanceOfficer: `Principal Nodal Officer: ${config.nodalOfficerName || 'Smt. Anita Deshmukh'}`,
      tollFree: `Helpline: ${config.supportPhone || '1800-889-2020'}`,
      email: config.supportEmail || 'support@ggyfinance.in',
      escalation: 'Grievance Desk: Micro Lending Redressal Desk',
      portalAccess: 'Secure Portal Access',
      borrowerLogin: 'Borrower Portal',
      staffLogin: 'Staff Portal',
      privacy: 'DPDP Privacy Notice',
      terms: 'Terms & Conditions',
      fairPractices: 'Fair Practices Code',
      rbiReg: `Registration: ${config.registrationNumber || 'NBFC-ND/2026/7742'}`,
      copyright: `© ${new Date().getFullYear()} ${config.organizationName || 'GGY Finance Ltd.'}. All rights reserved. 100% Data Sovereignty inside Indian Data Centers.`
    },
    kn: {
      brandDesc: 'ಗ್ರಾಮೀಣ ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು, ಹೈನುಗಾರಿಕೆ ಕುಟುಂಬಗಳು ಮತ್ತು ಕುಶಲಕರ್ಮಿಗಳಿಗೆ ಪಾರದರ್ಶಕ ಮತ್ತು ಪ್ರಾಮಾಣಿಕ ಮನೆಬಾಗಿಲ ಸಾಲ ಸೇವೆ.',
      schemesTitle: 'ಸಾಲ ಯೋಜನೆಗಳು (Schemes)',
      investmentsLink: 'ಗ್ರಾಮೀಣ ಹೂಡಿಕೆ: ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ & ಎಫ್‌ಡಿ',
      branchesTitle: 'ಶಾಖಾ ಜಾಲ (Branches)',
      contactAllLink: 'ಶಾಖಾ ವಿವರಗಳು & ನೊಡಲ್ ಕಚೇರಿ →',
      grievanceTitle: 'ಕುಂದುಕೊರತೆ ನಿವಾರಣೆ',
      grievanceOfficer: `ಮುಖ್ಯ ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿ: ${config.nodalOfficerName || 'ಶ್ರೀಮತಿ ಅನಿತಾ ದೇಶಮುಖ್'}`,
      tollFree: `ಸಹಾಯವಾಣಿ: ${config.supportPhone || '1800-889-2020'}`,
      email: config.supportEmail || 'support@ggyfinance.in',
      escalation: 'ಮೇಲ್ಮನವಿ: ಕಿರು ಸಾಲ ಕುಂದುಕೊರತೆ ನಿವಾರಣಾ ಕೋಶ',
      portalAccess: 'ಆಂತರಿಕ ಪೋರ್ಟಲ್ ಪ್ರವೇಶ',
      borrowerLogin: 'ಗ್ರಾಹಕರ ಪೋರ್ಟಲ್',
      staffLogin: 'ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್',
      privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ (DPDP 2023)',
      terms: 'ನಿಯಮಗಳು & ಷರತ್ತುಗಳು',
      fairPractices: 'ಪ್ರಾಮಾಣಿಕ ಸಾಲ ನೀತಿ',
      rbiReg: `ನೋಂದಣಿ: ${config.registrationNumber || 'NBFC-ND/2026/7742'}`,
      copyright: `© ${new Date().getFullYear()} ${config.organizationName || 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ (GGY Finance Ltd)'}. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಭಾರತೀಯ ಡೇಟಾ ಕೇಂದ್ರಗಳಲ್ಲಿ ಸಂಪೂರ್ಣ ಭದ್ರತೆ.`
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
              <span className="font-bold text-base text-white block tracking-tight">{config.organizationName || 'GGY Finance'}</span>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                Micro Money Lending Platform
              </span>
            </div>
          </div>
          <p className="text-emerald-200/90 text-xs leading-relaxed font-normal">
            {t.brandDesc}
          </p>
          <div className="pt-1">
            <span className="inline-block bg-emerald-950/80 text-emerald-200 border border-emerald-700/80 px-2.5 py-1 rounded-full text-[10px] font-mono">
              {t.rbiReg}
            </span>
          </div>
        </div>

        {/* Col 2: Core Banking Schemes */}
        <div className="space-y-2.5">
          <p className="font-bold text-amber-300 text-xs uppercase tracking-wider">
            {t.schemesTitle}
          </p>
          <ul className="space-y-2 text-emerald-200 text-xs">
            {activeSchemes.map((s) => (
              <li key={s.schemeCode}>
                <Link href="/#products" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>{s.schemeCode}: {s.name}</span>
                </Link>
              </li>
            ))}
            <li className="pt-1.5 border-t border-emerald-800/60">
              <Link href="/investments" className="text-amber-300 hover:text-white font-bold flex items-center gap-1">
                <span>{t.investmentsLink}</span>
                <span>&rarr;</span>
              </Link>
            </li>
            <li className="pt-1">
              <Link href="/mutual-funds" className="text-amber-300 hover:text-white font-bold flex items-center gap-1">
                <span>{lang === 'kn' ? 'ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ಸ್ ಪರಿಶೋಧನೆ' : 'Mutual Fund Explorer (AMFI)'}</span>
                <span>&rarr;</span>
              </Link>
            </li>
            <li className="pt-1">
              <Link href="/gallery" className="text-emerald-200 hover:text-white font-medium flex items-center gap-1">
                <span>{lang === 'kn' ? 'ಮಾಧ್ಯಮ & ನೈಜ ಯಶೋಗಾಥೆಗಳು' : 'Media & Field Story Gallery'}</span>
                <span>&rarr;</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Operational Branches */}
        <div className="space-y-2.5">
          <p className="font-bold text-amber-300 text-xs uppercase tracking-wider">
            {t.branchesTitle}
          </p>
          <ul className="space-y-1.5 text-emerald-200 text-xs">
            {activeBranches.map((b) => (
              <li key={b.branchCode} className="text-emerald-200">
                <span className="font-bold text-white block">{b.name}</span>
                <span className="text-[11px] text-emerald-300/80 block">SOL: {b.solId} • {b.phone}</span>
              </li>
            ))}
            <li className="pt-1.5 border-t border-emerald-800/60">
              <Link href="/contact" className="text-amber-300 hover:text-white font-bold block">
                {t.contactAllLink}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Grievance Redressal & Staff Access */}
        <div className="space-y-2.5">
          <p className="font-bold text-amber-300 text-xs uppercase tracking-wider">
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
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
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
