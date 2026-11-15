'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import {
  ShieldCheck,
  Lock,
  Users2,
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Mail,
  Award
} from 'lucide-react';
import { getBranchesSync, getInstitutionConfigSync, BranchRecord, InstitutionConfig } from '../../lib/institution';

export default function AboutPage() {
  const { lang } = useLanguage();
  const [branches, setBranches] = useState<BranchRecord[]>(getBranchesSync());
  const [config, setConfig] = useState<InstitutionConfig>(getInstitutionConfigSync());

  useEffect(() => {
    const handleSync = () => {
      setBranches(getBranchesSync());
      setConfig(getInstitutionConfigSync());
    };
    handleSync();
    window.addEventListener('nbfc_branches_updated', handleSync);
    window.addEventListener('nbfc_config_updated', handleSync);
    return () => {
      window.removeEventListener('nbfc_branches_updated', handleSync);
      window.removeEventListener('nbfc_config_updated', handleSync);
    };
  }, []);

  const content = {
    en: {
      badge: 'National Micro-Lending Platform • Institutional Profile',
      heroTitle: `About ${config.organizationName || 'GGY Finance'}`,
      heroSubtitle: 'Bridging the Rural Credit Divide with Honest Micro Capital',
      heroDesc: `${config.organizationName || 'GGY Finance'} is an institutional micro-lending platform dedicated to empowering rural micro-entrepreneurs, dairy farmers, and village households with fair, transparent, and technology-driven credit.`,
      missionTitle: 'Our Mission & Vision',
      missionText: 'To build India’s most trusted micro-lending institution by replacing predatory informal moneylenders with affordable, reducing-balance credit delivered directly to the borrower’s doorstep.',
      pillarsTitle: 'Our Core Operational Pillars',
      pillar1Title: 'Fair Reducing Balance Interest',
      pillar1Desc: 'We strictly charge interest on the outstanding loan balance, never on flat or compound basis. Full APR transparency with zero hidden deductions.',
      pillar2Title: 'Zero-Leak KYC Cryptography',
      pillar2Desc: 'All customer identity documents are envelope-encrypted with AES-256-GCM. Unmasked Aadhaar numbers are never stored, conforming to UIDAI and DPDP Act 2023.',
      pillar3Title: 'Dual-Control Four-Eyes Governance',
      pillar3Desc: 'Every loan follows the 4-Eyes principle: field agents who source loans cannot approve them, and managers must confirm vault cash deposits under dual control.',
      pillar4Title: 'Instant Universal UPI & Doorstep Cash',
      pillar4Desc: 'Repay seamlessly using any UPI app (PhonePe, GPay, Paytm) via dynamic NPCI QR codes, or through official cash counter receipts at the branch.',
      branchesTitle: 'Our Branch Network',
      branchesDesc: 'Serving rural and semi-urban communities with physical branch presence and local field officers.',
      governanceTitle: 'Corporate Governance & Leadership',
      governanceDesc: 'Guided by seasoned microfinance, banking, and technology leaders committed to regulatory adherence.',
      leader1: 'Managing Director & CEO: Shri S. Ramanathan',
      leader1Title: 'Former Regional Head, Rural Microfinance Banking (28+ years experience).',
      leader2: 'Chief Risk & Compliance Officer: Smt. Meenakshi Sundaram',
      leader2Title: 'Senior Banking & Microfinance Regulatory Specialist.',
      leader3: `Principal Nodal & Grievance Officer: ${config.nodalOfficerName || 'Smt. Anita Deshmukh'}`,
      leader3Title: 'Direct point of contact for customer rights and grievance resolution.',
      ctaTitle: 'Need honest credit for your business or enterprise?',
      ctaButton: 'Explore Loan Products'
    },
    kn: {
      badge: 'ರಾಷ್ಟ್ರೀಯ ಕಿರು ಸಾಲ ಸಂಸ್ಥೆ • ಅಧಿಕೃತ ವಿವರ',
      heroTitle: `${config.organizationName || 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್'} ಬಗ್ಗೆ (About Us)`,
      heroSubtitle: 'ಗ್ರಾಮೀಣ ಭಾರತದ ಬೆಳವಣಿಗೆಗೆ ಪ್ರಾಮಾಣಿಕ ಕಿರು ಸಾಲ ಸೇವೆ',
      heroDesc: `${config.organizationName || 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್'} ಅಧಿಕೃತ ಕಿರು ಹಣಕಾಸು ಸಂಸ್ಥೆಯಾಗಿದ್ದು, ಗ್ರಾಮೀಣ ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು, ಹೈನುಗಾರಿಕೆ ಕುಟುಂಬಗಳು ಮತ್ತು ಸಣ್ಣ ಉದ್ಯಮಿಗಳಿಗೆ ಪ್ರಾಮಾಣಿಕ ಮತ್ತು ಸುಲಭ ಕಿರು ಸಾಲಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.`,
      missionTitle: 'ನಮ್ಮ ಧ್ಯೇಯ ಮತ್ತು ಗುರಿ',
      missionText: 'ಖಾಸಗಿ ಲೇವಾದೇವಿದಾರರ ದುಬಾರಿ ಬಡ್ಡಿಯಿಂದ ಗ್ರಾಮೀಣ ಜನರನ್ನು ಮುಕ್ತಗೊಳಿಸಿ, ಕಡಿಮೆ ಬಡ್ಡಿದರದಲ್ಲಿ ನ್ಯಾಯಯುತ ಸಾಲ ಸೌಲಭ್ಯವನ್ನು ಮನೆಬಾಗಿಲಿಗೆ ತಲುಪಿಸುವುದು.',
      pillarsTitle: 'ನಮ್ಮ ಮುಖ್ಯ ತತ್ವಗಳು',
      pillar1Title: 'ಪಾರದರ್ಶಕ ಇಳಿಕೆ ಮೊತ್ತದ ಬಡ್ಡಿ',
      pillar1Desc: 'ಬಾಕಿ ಇರುವ ಸಾಲದ ಮೊತ್ತಕ್ಕೆ ಮಾತ್ರ ಬಡ್ಡಿ ವಿಧಿಸಲಾಗುತ್ತದೆ. ಯಾವುದೇ ಗುಪ್ತ ಶುಲ್ಕಗಳಿಲ್ಲದ ಸ್ಪಷ್ಟ ಲೆಕ್ಕಾಚಾರ.',
      pillar2Title: 'ಸುರಕ್ಷಿತ ಕೆವೈಸಿ (KYC) ಡೇಟಾ ಭದ್ರತೆ',
      pillar2Desc: 'ಆಧಾರ್‌ನ ಕೊನೆಯ 4 ಅಂಕಿಗಳನ್ನು ಮಾತ್ರ ಪಡೆದು (XXXX-XXXX-1234), DPDP ಕಾಯ್ದೆ 2023 ರಂತೆ ಎಲ್ಲ ದಾಖಲೆಗಳನ್ನು ಗೂಢಲಿಪೀಕರಣ (AES-256-GCM) ಮೂಲಕ ರಕ್ಷಿಸಲಾಗುತ್ತದೆ.',
      pillar3Title: 'ದ್ವಿ-ಪರಿಶೀಲನಾ ಆಡಳಿತ ನಿಯಮಾವಳಿ',
      pillar3Desc: 'ಸಾಲ ನೀಡುವ ಅಧಿಕಾರಿಗಳು ಮತ್ತು ಪರಿಶೀಲಿಸುವ ಅಧಿಕಾರಿಗಳು ಪ್ರತ್ಯೇಕವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಾರೆ (Maker-Checker 4-Eyes Principle).',
      pillar4Title: 'ಸುಲಭ ಯುಪಿಐ (UPI) ಮತ್ತು ನಗದು ಪಾವತಿ',
      pillar4Desc: 'PhonePe, GPay, Paytm ಮೂಲಕ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅಥವಾ ಶಾಖೆಯ ರಸೀದಿ ಮೂಲಕ ಸುಲಭವಾಗಿ ಮರುಪಾವತಿಸಿ.',
      branchesTitle: 'ನಮ್ಮ ಅಧಿಕೃತ ಶಾಖಾ ಜಾಲ',
      branchesDesc: 'ಸ್ಥಳೀಯ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳೊಂದಿಗೆ ಗ್ರಾಮೀಣ ಜನರ ಮನೆಬಾಗಿಲಿಗೆ ನೇರ ಸೇವೆ.',
      governanceTitle: 'ಆಡಳಿತ ಮಂಡಳಿ & ನಾಯಕತ್ವ',
      governanceDesc: 'ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಕಿರು ಹಣಕಾಸು ಕ್ಷೇತ್ರದಲ್ಲಿ ದಶಕಗಳ ಅನುಭವವಿರುವ ನುರಿತ ತಂಡ.',
      leader1: 'ವ್ಯವಸ್ಥಾಪಕ ನಿರ್ದೇಶಕರು & ಸಿಇಒ: ಶ್ರೀ ಎಸ್. ರಾಮನಾಥನ್',
      leader1Title: 'ಗ್ರಾಮೀಣ ಬ್ಯಾಂಕಿಂಗ್ ಕ್ಷೇತ್ರದಲ್ಲಿ 28+ ವರ್ಷಗಳ ನಾಯಕತ್ವದ ಅನುಭವ.',
      leader2: 'ಮುಖ್ಯ ನಿಯಂತ್ರಣ & ರಿಸ್ಕ್ ಅಧಿಕಾರಿ: ಶ್ರೀಮತಿ ಮೀನಾಕ್ಷಿ ಸುಂದರಂ',
      leader2Title: 'ಹಿರಿಯ ಬ್ಯಾಂಕರ್ ಮತ್ತು ನಿಯಮಾವಳಿ ತಜ್ಞರು.',
      leader3: `ಮುಖ್ಯ ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿ: ${config.nodalOfficerName || 'ಶ್ರೀಮತಿ ಅನಿತಾ ದೇಶಮುಖ್'}`,
      leader3Title: 'ಗ್ರಾಹಕರ ಹಕ್ಕುಗಳ ರಕ್ಷಣೆ ಮತ್ತು ದೂರು ನಿವಾರಣೆಯ ಮುಖ್ಯ ಅಧಿಕಾರಿ.',
      ctaTitle: 'ನಿಮ್ಮ ವ್ಯಾಪಾರಕ್ಕೆ ಪ್ರಾಮಾಣಿಕ ಕಿರು ಸಾಲ ಬೇಕೇ?',
      ctaButton: 'ಕಿರು ಸಾಲ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ'
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white pt-16 pb-20 px-4 sm:px-10 text-center border-b border-orange-800 shadow-inner overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm">
            <Building2 className="w-4 h-4 text-amber-200" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
            {t.heroTitle}
          </h1>
          <p className="text-amber-200 font-bold text-base sm:text-lg">
            {t.heroSubtitle}
          </p>
          <p className="text-amber-50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            {t.heroDesc}
          </p>
        </div>
      </section>

      {/* Mission & Purpose */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 -mt-8 relative z-20 w-full">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Institutional Commitment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">{t.missionTitle}</h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
            {t.missionText}
          </p>
        </div>
      </section>

      {/* Operational Pillars */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">{t.pillarsTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Institutional standards ensuring transparent, doorstep micro-lending.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold border border-orange-200">
              <CheckCircle2 className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-base text-slate-950">{t.pillar1Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.pillar1Desc}</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
              <Lock className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-slate-950">{t.pillar2Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.pillar2Desc}</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-slate-950">{t.pillar3Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.pillar3Desc}</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
              <Users2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-base text-slate-950">{t.pillar4Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.pillar4Desc}</p>
          </div>
        </div>
      </section>

      {/* Branch Network */}
      <section className="py-16 px-4 sm:px-8 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Doorstep Presence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">{t.branchesTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.branchesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((b) => (
              <div key={b.branchCode} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-700 font-bold text-xs">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>{b.type}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-950">{b.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{b.address}</p>
                </div>
                <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold border-t border-slate-200 flex justify-between items-center">
                  <span>SOL ID: {b.solId}</span>
                  <Link href="/contact" className="text-orange-600 hover:underline">
                    Contact &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Leadership */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">{t.governanceTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.governanceDesc}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#064e3b] text-white font-bold flex items-center justify-center shrink-0 text-sm">
              SR
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-950">{t.leader1}</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">{t.leader1Title}</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#064e3b] text-white font-bold flex items-center justify-center shrink-0 text-sm">
              MS
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-950">{t.leader2}</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">{t.leader2Title}</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              AD
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-950">{t.leader3}</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">{t.leader3Title}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">{t.ctaTitle}</h2>
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 bg-white text-orange-700 px-6 py-3 rounded-xl font-bold text-xs shadow-lg hover:bg-amber-50 transition-all"
          >
            <span>{t.ctaButton}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
