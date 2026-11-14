'use client';

import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import {
  Building2,
  ShieldCheck,
  Users2,
  MapPin,
  Scale,
  Award,
  ArrowRight,
  Landmark,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  const { lang } = useLanguage();

  const content = {
    en: {
      badge: 'Karnataka State Registered Micro-Lending Platform • Institutional Profile',
      heroTitle: 'About GGY Finance',
      heroSubtitle: 'Bridging the Rural Credit Divide with Honest Micro Capital',
      heroDesc: 'GGY Finance is a Karnataka State-registered micro-lending platform dedicated to empowering rural micro-entrepreneurs, dairy farmers, and village households across Karnataka with fair, transparent, and technology-driven credit.',
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
      branchesTitle: 'Our Karnataka Branch Network',
      branchesDesc: 'Serving rural and semi-urban communities with physical branch presence and local field officers.',
      mandyaBranch: 'Mandya Regional Branch (KA-BLR-01)',
      mandyaDesc: 'Maddur, Malavalli, and Pandavapura agricultural clusters. Specializing in Dairy & Kirana working capital.',
      ramanagaraBranch: 'Ramanagara Cluster Office',
      ramanagaraDesc: 'Channapatna crafts, silk reelers, and rural transport micro-mobility.',
      mysuruBranch: 'Mysuru Livelihood Center',
      mysuruDesc: 'Hunsur and Nanjangud smallholder farmers and solar pump financing.',
      governanceTitle: 'Corporate Governance & Leadership',
      governanceDesc: 'Guided by seasoned microfinance, banking, and technology leaders committed to regulatory adherence.',
      leader1: 'Managing Director & CEO: Shri S. Ramanathan',
      leader1Title: 'Former Regional Head, Rural Microfinance Banking (28+ years experience).',
      leader2: 'Chief Risk & Compliance Officer: Smt. Meenakshi Sundaram',
      leader2Title: 'Senior Banking & Microfinance Regulatory Specialist.',
      leader3: 'Principal Nodal & Grievance Officer: Shri A. Deshmukh',
      leader3Title: 'Direct point of contact for customer rights and grievance resolution.',
      ctaTitle: 'Need honest credit for your village business?',
      ctaButton: 'Explore Loan Products'
    },
    kn: {
      badge: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ನೋಂದಾಯಿತ ಕಿರು ಸಾಲ ಸಂಸ್ಥೆ • ಅಧಿಕೃತ ವಿವರ',
      heroTitle: 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ ಬಗ್ಗೆ (About Us)',
      heroSubtitle: 'ಗ್ರಾಮೀಣ ಭಾರತದ ಬೆಳವಣಿಗೆಗೆ ಪ್ರಾಮಾಣಿಕ ಕಿರು ಸಾಲ ಸೇವೆ',
      heroDesc: 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ ಕರ್ನಾಟಕ ರಾಜ್ಯ ನೋಂದಾಯಿತ ಕಿರು ಹಣಕಾಸು ಸಂಸ್ಥೆಯಾಗಿದ್ದು, ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು, ಹೈನುಗಾರಿಕೆ ಕುಟುಂಬಗಳು ಮತ್ತು ಸಣ್ಣ ಉದ್ಯಮಿಗಳಿಗೆ ಪ್ರಾಮಾಣಿಕ ಮತ್ತು ಸುಲಭ ಕಿರು ಸಾಲಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.',
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
      branchesTitle: 'ಕರ್ನಾಟಕದಲ್ಲಿ ನಮ್ಮ ಶಾಖಾ ಜಾಲ',
      branchesDesc: 'ಸ್ಥಳೀಯ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳೊಂದಿಗೆ ಗ್ರಾಮೀಣ ಜನರ ಮನೆಬಾಗಿಲಿಗೆ ನೇರ ಸೇವೆ.',
      mandyaBranch: 'ಮಂಡ್ಯ ಪ್ರಾದೇಶಿಕ ಶಾಖೆ (KA-BLR-01)',
      mandyaDesc: 'ಮದ್ದೂರು, ಮಳವಳ್ಳಿ ಮತ್ತು ಪಾಂಡವಪುರ ಕೃಷಿ ಕ್ಲಸ್ಟರ್‌ಗಳು. ಹೈನುಗಾರಿಕೆ ಮತ್ತು ಕಿರಾಣಿ ಸಾಲಗಳು.',
      ramanagaraBranch: 'ರಾಮನಗರ ಶಾಖಾ ಕಚೇರಿ',
      ramanagaraDesc: 'ಚನ್ನಪಟ್ಟಣ ಆಟಿಕೆ ತಯಾರಕರು, ರೇಷ್ಮೆ ಉದ್ಯಮಿಗಳು ಮತ್ತು ಗ್ರಾಮೀಣ ವಾಹನ ಸಾಲಗಳು.',
      mysuruBranch: 'ಮೈಸೂರು ಜೀವನೋಪಾಯ ಕೇಂದ್ರ',
      mysuruDesc: 'ಹುಣಸೂರು ಮತ್ತು ನಂಜನಗೂಡು ರೈತ ಕುಟುಂಬಗಳಿಗೆ ಕಿರು ಸಾಲ ನೆರವು.',
      governanceTitle: 'ಆಡಳಿತ ಮಂಡಳಿ & ನಾಯಕತ್ವ',
      governanceDesc: 'ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಕಿರು ಹಣಕಾಸು ಕ್ಷೇತ್ರದಲ್ಲಿ ದಶಕಗಳ ಅನುಭವವಿರುವ ನುರಿತ ತಂಡ.',
      leader1: 'ವ್ಯವಸ್ಥಾಪಕ ನಿರ್ದೇಶಕರು & ಸಿಇಒ: ಶ್ರೀ ಎಸ್. ರಾಮನಾಥನ್',
      leader1Title: 'ಗ್ರಾಮೀಣ ಬ್ಯಾಂಕಿಂಗ್ ಕ್ಷೇತ್ರದಲ್ಲಿ 28+ ವರ್ಷಗಳ ನಾಯಕತ್ವದ ಅನುಭವ.',
      leader2: 'ಮುಖ್ಯ ನಿಯಂತ್ರಣ & ರಿಸ್ಕ್ ಅಧಿಕಾರಿ: ಶ್ರೀಮತಿ ಮೀನಾಕ್ಷಿ ಸುಂದರಂ',
      leader2Title: 'ಹಿರಿಯ ಬ್ಯಾಂಕರ್ ಮತ್ತು ನಿಯಮಾವಳಿ ತಜ್ಞರು.',
      leader3: 'ಮುಖ್ಯ ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿ: ಶ್ರೀ ಎ. ದೇಶಮುಖ್',
      leader3Title: 'ಗ್ರಾಹಕರ ಹಕ್ಕುಗಳ ರಕ್ಷಣೆ ಮತ್ತು ದೂರು ನಿವಾರಣೆಯ ಮುಖ್ಯ ಅಧಿಕಾರಿ.',
      ctaTitle: 'ನಿಮ್ಮ ವ್ಯಾಪಾರಕ್ಕೆ ಪ್ರಾಮಾಣಿಕ ಕಿರು ಸಾಲ ಬೇಕೇ?',
      ctaButton: 'ಕಿರು ಸಾಲ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ'
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      {/* Hero Section: Royal Saffron Sunburst */}
      <section className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white pt-16 pb-20 px-4 sm:px-10 text-center border-b border-orange-800 shadow-inner overflow-hidden">
        <div className="absolute -top-32 left-1/3 w-[600px] h-[400px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-white shadow-sm">
            <Building2 className="w-4 h-4 text-amber-200" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {t.heroTitle}
          </h1>
          <p className="text-amber-200 font-extrabold text-base sm:text-lg">
            {t.heroSubtitle}
          </p>
          <p className="text-amber-50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            {t.heroDesc}
          </p>
        </div>
      </section>

      {/* Mission Box: Deep Imperial Forest */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-20 w-full">
        <div className="bg-gradient-to-b from-[#064e3b] to-[#022c22] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-900 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center shrink-0">
            <Landmark className="w-8 h-8 text-amber-300" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">{t.missionTitle}</h3>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal">
              {t.missionText}
            </p>
          </div>
        </div>
      </section>

      {/* Operational Pillars */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>Institutional Principles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">{t.pillarsTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-slate-950">{t.pillar1Title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.pillar1Desc}</p>
            </div>
            <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full APR Transparency</span>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-slate-950">{t.pillar2Title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.pillar2Desc}</p>
            </div>
            <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AES-256-GCM Envelope Encryption</span>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-slate-950">{t.pillar3Title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.pillar3Desc}</p>
            </div>
            <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Four-Eyes Dual Control</span>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-slate-950">{t.pillar4Title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.pillar4Desc}</p>
            </div>
            <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Dynamic NPCI Universal QR</span>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Network */}
      <section className="py-16 px-4 sm:px-8 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Doorstep Presence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">{t.branchesTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.branchesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-700 font-extrabold text-xs">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Mandya Cluster</span>
                </div>
                <h3 className="font-black text-base text-slate-950">{t.mandyaBranch}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{t.mandyaDesc}</p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold">
                Sol ID: 1084-0101
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-700 font-extrabold text-xs">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Ramanagara Cluster</span>
                </div>
                <h3 className="font-black text-base text-slate-950">{t.ramanagaraBranch}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{t.ramanagaraDesc}</p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold">
                Sol ID: 1084-0102
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-700 font-extrabold text-xs">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Mysuru Cluster</span>
                </div>
                <h3 className="font-black text-base text-slate-950">{t.mysuruBranch}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{t.mysuruDesc}</p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold">
                Sol ID: 1084-0103
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Governance & Leadership */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">{t.governanceTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.governanceDesc}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#064e3b] text-white font-black flex items-center justify-center shrink-0 text-sm">
              SR
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-950">{t.leader1}</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">{t.leader1Title}</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#064e3b] text-white font-black flex items-center justify-center shrink-0 text-sm">
              MS
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-950">{t.leader2}</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">{t.leader2Title}</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-600 text-white font-black flex items-center justify-center shrink-0 text-sm">
              AD
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-950">{t.leader3}</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">{t.leader3Title}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 px-4 bg-white border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950">{t.ctaTitle}</h2>
          <div className="pt-2">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm min-h-[44px]"
            >
              <span>{t.ctaButton}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
