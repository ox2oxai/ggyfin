'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  calculateEMI,
  LoanPurpose,
  LoanPurposeLabels
} from '@nbfc/shared';
import {
  Store,
  Milk,
  Bike,
  Tractor,
  Briefcase,
  ShieldCheck,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  QrCode
} from 'lucide-react';
import { GGYBrandMark } from '../components/brand-mark';

type Lang = 'en' | 'kn';

const content = {
  en: {
    topBar: 'RBI Registered NBFC-BL (Base Layer) | Reg. Certificate No: B-14.02981',
    brandName: 'GGY Finance',
    tagline: 'Micro Money Lending Platform',
    heroBadge: 'Transparent Micro Lending with Zero Hidden Deductions',
    heroTitlePrefix: 'Honest Micro Credit for',
    heroTitleAccent: "Bharat’s Real Builders",
    heroDesc: 'Doorstep financial support for village entrepreneurs, dairy farmers, and kirana owners. No complicated paperwork and instant UPI repayments.',
    calcButton: 'Calculate Your Monthly EMI',
    exploreButton: 'Explore Loan Products',
    productsTitle: 'Purpose-Built Micro Loans',
    productsDesc: 'Every loan is matched with your exact livelihood needs with fair reducing balance interest rates.',
    emiTitle: 'Interactive EMI Calculator',
    emiDesc: 'Move the sliders to see your exact monthly installment. No surprises, no hidden compound traps.',
    loanAmount: 'Loan Amount',
    tenure: 'Tenure (Repayment Period)',
    interestRate: 'Interest Rate (% p.a.)',
    rateMinLabel: '8.0% p.a. (Agri / SHG)',
    rateMaxLabel: '30.0% p.a. (RBI Cap)',
    interestRateLabel: 'Interest Rate:',
    months: 'Months',
    installment: 'Your Monthly Installment',
    monthShort: '/ month',
    principalBorrowed: 'Principal Borrowed:',
    totalInterest: 'Total Interest:',
    totalPayable: 'Total Amount Payable:',
    howItWorks: 'How It Works',
    howItWorksDesc: 'Simple 3-step micro lending process designed for rural communities.',
    step1Title: '1. Doorstep Field Visit',
    step1Desc: 'Our local Field Officer visits your village with our secure mobile app to understand your requirement.',
    step2Title: '2. Masked KYC & Maker-Checker',
    step2Desc: 'We capture your photo and masked Aadhaar (XXXX-XXXX-1234). All documents are encrypted in our vault and audited under RBI dual-control.',
    step3Title: '3. Direct Bank Credit & Easy UPI',
    step3Desc: 'Funds are transferred straight to your bank account. Repay easily each month by scanning our dynamic UPI QR code with any UPI app.',
    grievanceOfficer: 'Principal Nodal Officer: Shri A. Deshmukh',
    staffLogin: 'Staff Login Portal',
    copyright: '© 2026 GGY Finance Ltd. All rights reserved. 100% Data Sovereignty inside Indian Data Centers.'
  },
  kn: {
    topBar: 'ಆರ್.ಬಿ.ಐ ನೋಂದಾಯಿತ ಕಿರು ಸಾಲ ಸಂಸ್ಥೆ (NBFC-BL) | ಪ್ರಮಾಣಪತ್ರ ಸಂಖ್ಯೆ: B-14.02981',
    brandName: 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ (GGY Finance)',
    tagline: 'ಕಿರು ಹಣಕಾಸು ಸಾಲ ವೇದಿಕೆ (Micro Money Lending Platform)',
    heroBadge: 'ಯಾವುದೇ ಗುಪ್ತ ಶುಲ್ಕಗಳಿಲ್ಲದ ಪಾರದರ್ಶಕ ಕಿರು ಸಾಲಗಳು',
    heroTitlePrefix: 'ಗ್ರಾಮೀಣ ಭಾರತದ ಬೆಳವಣಿಗೆಗೆ',
    heroTitleAccent: 'ಪ್ರಾಮಾಣಿಕ ಕಿರು ಸಾಲಗಳು',
    heroDesc: 'ಗ್ರಾಮೀಣ ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು, ಹೈನುಗಾರಿಕೆ ಕುಟುಂಬಗಳು ಮತ್ತು ಸಣ್ಣ ಉದ್ಯಮಿಗಳಿಗೆ ನೇರ ಮನೆಬಾಗಿಲ ಸಾಲ ಸೌಲಭ್ಯ. ಸುಲಭ ಮಾಸಿಕ ಕಂತು ಮತ್ತು ಯುಪಿಐ (UPI) ಮರುಪಾವತಿ.',
    calcButton: 'ನಿಮ್ಮ ಮಾಸಿಕ ಕಂತು (EMI) ಲೆಕ್ಕಹಾಕಿ',
    exploreButton: 'ಕಿರು ಸಾಲ ಯೋಜನೆಗಳು',
    productsTitle: 'ಉದ್ದೇಶ ಆಧಾರಿತ ಕಿರು ಸಾಲಗಳು',
    productsDesc: 'ನಿಮ್ಮ ವ್ಯಾಪಾರ ಮತ್ತು ಜೀವನೋಪಾಯದ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಕಡಿಮೆ ಬಡ್ಡಿದರದ ಕಿರು ಸಾಲಗಳು.',
    emiTitle: 'ಸುಲಭ ಇಎಂಐ (EMI) ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    emiDesc: 'ನಿಮ್ಮ ಸಾಲದ ಮೊತ್ತ ಮತ್ತು ತಿಂಗಳುಗಳನ್ನು ಆರಿಸಿ, ಮಾಸಿಕ ಕಂತನ್ನು ಸುಲಭವಾಗಿ ತಿಳಿಯಿರಿ.',
    loanAmount: 'ಸಾಲದ ಮೊತ್ತ',
    tenure: 'ಮರುಪಾವತಿ ಅವಧಿ (ತಿಂಗಳುಗಳಲ್ಲಿ)',
    interestRate: 'ವಾರ್ಷಿಕ ಬಡ್ಡಿದರ (% p.a.)',
    rateMinLabel: '8.0% ವಾರ್ಷಿಕ (ಕೃಷಿ / ಸ್ವಸಹಾಯ)',
    rateMaxLabel: '30.0% ವಾರ್ಷಿಕ (ಆರ್.ಬಿ.ಐ ಮಿತಿ)',
    interestRateLabel: 'ವಾರ್ಷಿಕ ಬಡ್ಡಿದರ:',
    months: 'ತಿಂಗಳುಗಳು',
    installment: 'ನಿಮ್ಮ ಮಾಸಿಕ ಕಂತು',
    monthShort: '/ ತಿಂಗಳಿಗೆ',
    principalBorrowed: 'ಪಡೆದ ಸಾಲದ ಮೊತ್ತ:',
    totalInterest: 'ಒಟ್ಟು ಬಡ್ಡಿ:',
    totalPayable: 'ಒಟ್ಟು ಮರುಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ:',
    howItWorks: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?',
    howItWorksDesc: 'ಗ್ರಾಮೀಣ ಜನರಿಗಾಗಿ ರೂಪಿಸಲಾದ ಸುಲಭ 3 ಹಂತಗಳ ಪ್ರಕ್ರಿಯೆ.',
    step1Title: '1. ಮನೆಬಾಗಿಲಿಗೆ ಭೇಟಿ',
    step1Desc: 'ನಮ್ಮ ಸ್ಥಳೀಯ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳು ನಿಮ್ಮ ಗ್ರಾಮಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ನಿಮ್ಮ ಸಾಲದ ಅಗತ್ಯವನ್ನು ಪರಿಶೀಲಿಸುತ್ತಾರೆ.',
    step2Title: '2. ಸುರಕ್ಷಿತ ಕೆವೈಸಿ (KYC) ಪರಿಶೀಲನೆ',
    step2Desc: 'ಆಧಾರ್‌ನ ಕೊನೆಯ 4 ಅಂಕಿಗಳನ್ನು ಮಾತ್ರ ಪಡೆದು (XXXX-XXXX-1234), ಆರ್.ಬಿ.ಐ ನಿಯಮಾವಳಿಯಂತೆ ಸುರಕ್ಷಿತವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.',
    step3Title: '3. ನೇರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ & ಯುಪಿಐ ಪಾವತಿ',
    step3Desc: 'ಸಾಲದ ಮೊತ್ತವು ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ. ಮಾಸಿಕ ಕಂತನ್ನು ಯಾವುದೇ ಯುಪಿಐ ಆ್ಯಪ್ ಮೂಲಕ ಸುಲಭವಾಗಿ ಪಾವತಿಸಿ.',
    grievanceOfficer: 'ಮುಖ್ಯ ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿ: ಶ್ರೀ ಎ. ದೇಶಮುಖ್',
    staffLogin: 'ಸಿಬ್ಬಂದಿ ಲಾಗಿನ್ ಪೋರ್ಟಲ್',
    copyright: '© 2026 ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ (GGY Finance Ltd). ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.'
  }
};

const kannadaProductTitles: Record<LoanPurpose, string> = {
  [LoanPurpose.KIRANA_STORE]: 'ಕಿರಾಣಿ ಅಂಗಡಿ ಸಾಲ (Kirana Store)',
  [LoanPurpose.DAIRY_LIVESTOCK]: 'ಹೈನುಗಾರಿಕೆ & ಹಸುಗಳ ಸಾಲ (Dairy & Cattle)',
  [LoanPurpose.TWO_WHEELER]: 'ದ್ವಿಚಕ್ರ ವಾಹನ ಸಾಲ (Two-Wheeler)',
  [LoanPurpose.AGRICULTURAL_EQUIPMENT]: 'ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ & ಸೋಲಾರ್ ಪಂಪ್',
  [LoanPurpose.MICRO_ENTERPRISE]: 'ಗ್ರಾಮೀಣ ಸಣ್ಣ ಉದ್ಯಮ ಸಾಲ (Micro-Enterprise)'
};

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [selectedPurpose, setSelectedPurpose] = useState<LoanPurpose>(LoanPurpose.KIRANA_STORE);
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(14.5);

  const t = content[lang];
  const currentConfig = LoanPurposeLabels[selectedPurpose];
  const emi = calculateEMI(loanAmount, interestRate, tenureMonths);
  const totalRepayable = Math.round(emi * tenureMonths);
  const totalInterest = Math.max(0, totalRepayable - loanAmount);

  const purposeIcons: Record<LoanPurpose, React.ReactNode> = {
    [LoanPurpose.KIRANA_STORE]: <Store className="w-6 h-6 text-terracotta-500" />,
    [LoanPurpose.DAIRY_LIVESTOCK]: <Milk className="w-6 h-6 text-terracotta-500" />,
    [LoanPurpose.TWO_WHEELER]: <Bike className="w-6 h-6 text-terracotta-500" />,
    [LoanPurpose.AGRICULTURAL_EQUIPMENT]: <Tractor className="w-6 h-6 text-terracotta-500" />,
    [LoanPurpose.MICRO_ENTERPRISE]: <Briefcase className="w-6 h-6 text-terracotta-500" />
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Compliance Bar */}
      <div className="bg-forest-900 text-sandstone-200 text-xs py-2 px-4 border-b border-forest-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{t.topBar}</span>
          </div>
          <div className="flex items-center gap-4 text-sandstone-300">
            <span>DPDP Act 2023 Compliant</span>
            <span>•</span>
            <span>Toll-Free: 1800-209-4321</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-sandstone-50 border-b border-clay/60 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* GGY Brand Mark */}
            <GGYBrandMark size="md" />
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-forest-900 leading-tight">{t.brandName}</h1>
              <p className="text-xs text-terracotta-600 font-bold uppercase tracking-wider">{t.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bilingual Switcher: English | Kannada */}
            <div className="flex items-center gap-1 bg-sandstone-200 p-1 rounded-xl border border-clay text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
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
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  lang === 'kn'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-forest-800 hover:text-terracotta-600'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-900 text-sandstone-50 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow"
            >
              <Lock className="w-3.5 h-3.5 text-terracotta-500" />
              <span className="hidden sm:inline">Staff Portal</span>
              <span className="sm:hidden">Staff</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sandstone-50 to-sandstone-100 py-16 px-4 border-b border-clay/50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-terracotta-50 text-terracotta-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-terracotta-100">
            <ShieldCheck className="w-4 h-4 text-terracotta-500" />
            {t.heroBadge}
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-forest-900 tracking-tight leading-tight max-w-3xl mx-auto">
            {t.heroTitlePrefix} <span className="text-terracotta-600 underline decoration-clay underline-offset-8">{t.heroTitleAccent}</span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-forest-800/80 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
            >
              <Calculator className="w-5 h-5" />
              <span>{t.calcButton}</span>
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-sandstone-50 hover:bg-sandstone-200 text-forest-900 px-6 py-3 rounded-xl font-bold text-sm sm:text-base border border-clay transition-all"
            >
              <span>{t.exploreButton}</span>
              <ArrowRight className="w-4 h-4 text-terracotta-600" />
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-sandstone-50 p-4 rounded-xl border border-clay/60 shadow-xs">
              <p className="text-2xl font-black text-forest-900">₹0</p>
              <p className="text-xs text-forest-800 font-medium mt-1">Hidden File Processing Fees</p>
            </div>
            <div className="bg-sandstone-50 p-4 rounded-xl border border-clay/60 shadow-xs">
              <p className="text-2xl font-black text-forest-900">24-48 Hrs</p>
              <p className="text-xs text-forest-800 font-medium mt-1">Direct Bank Disbursement</p>
            </div>
            <div className="bg-sandstone-50 p-4 rounded-xl border border-clay/60 shadow-xs">
              <p className="text-2xl font-black text-forest-900">UPI & Cash</p>
              <p className="text-xs text-forest-800 font-medium mt-1">Flexible Village Repayments</p>
            </div>
            <div className="bg-sandstone-50 p-4 rounded-xl border border-clay/60 shadow-xs">
              <p className="text-2xl font-black text-forest-900">100% Masked</p>
              <p className="text-xs text-forest-800 font-medium mt-1">UIDAI Aadhaar Data Security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose-Based Products Section */}
      <section id="products" className="py-16 px-4 bg-sandstone-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-forest-900">{t.productsTitle}</h3>
            <p className="text-forest-800/80 text-sm sm:text-base mt-2">
              {t.productsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(LoanPurposeLabels) as LoanPurpose[]).map((purpose) => {
              const item = LoanPurposeLabels[purpose];
              const isSelected = selectedPurpose === purpose;
              const displayTitle = lang === 'kn' ? kannadaProductTitles[purpose] : item.title;

              return (
                <div
                  key={purpose}
                  onClick={() => {
                    setSelectedPurpose(purpose);
                    setLoanAmount(Math.min(loanAmount, item.maxAmount));
                    setInterestRate(item.defaultRate);
                  }}
                  className={`cursor-pointer rounded-2xl p-6 transition-all duration-200 border-2 ${
                    isSelected
                      ? 'bg-sandstone-50 border-terracotta-500 shadow-md ring-2 ring-terracotta-500/20'
                      : 'bg-sandstone-50/80 border-clay/80 hover:border-terracotta-500/50 hover:bg-sandstone-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-terracotta-50 flex items-center justify-center border border-terracotta-100">
                      {purposeIcons[purpose]}
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-forest-50 text-forest-800 border border-forest-100">
                      {item.defaultRate}% p.a.
                    </span>
                  </div>

                  <h4 className="font-bold text-base sm:text-lg text-forest-900 mt-4">{displayTitle}</h4>
                  <p className="text-xs text-forest-800/70 mt-1">Up to ₹{(item.maxAmount / 100000).toFixed(1)} Lakhs • {item.defaultTenure} {t.months}</p>

                  <div className="mt-5 pt-4 border-t border-clay/40 flex justify-between items-center text-xs">
                    <span className="text-terracotta-600 font-semibold">{t.calcButton}</span>
                    <ArrowRight className="w-4 h-4 text-terracotta-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive EMI Calculator Section */}
      <section id="calculator" className="py-16 px-4 bg-sandstone-50 border-y border-clay/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4 text-terracotta-500" />
              <span>{t.emiTitle}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-forest-900">
              {lang === 'kn' ? kannadaProductTitles[selectedPurpose] : currentConfig.title}
            </h3>
            <p className="text-sm text-forest-800/70 mt-1">
              {t.emiDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-sandstone-100 rounded-3xl p-6 sm:p-10 border border-clay shadow-sm">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Amount Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-forest-900">{t.loanAmount}</label>
                  <span className="text-lg font-black text-terracotta-600">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max={currentConfig.maxAmount}
                  step="5000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-terracotta-600 h-2 bg-clay rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-forest-800/60 mt-1">
                  <span>₹10,000</span>
                  <span>Max: ₹{currentConfig.maxAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-forest-900">{t.tenure}</label>
                  <span className="text-lg font-black text-forest-900">{tenureMonths} {t.months}</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="36"
                  step="3"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full accent-forest-800 h-2 bg-clay rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-forest-800/60 mt-1">
                  <span>6 {t.months}</span>
                  <span>36 {t.months} (3 Years)</span>
                </div>
              </div>

              {/* Interest Rate Slider (Mandatory Variable Control) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-forest-900">{t.interestRate}</label>
                  <span className="text-lg font-black text-terracotta-600">{interestRate.toFixed(1)}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="8.0"
                  max="30.0"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-terracotta-600 h-2 bg-clay rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-forest-800/60 mt-1">
                  <span>{t.rateMinLabel}</span>
                  <span>{t.rateMaxLabel}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="pt-4 border-t border-clay/60 grid grid-cols-2 gap-3 text-xs text-forest-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Reducing balance interest</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero pre-payment penalty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pay via PhonePe / GPay / BHIM</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Doorstep cash receipt option</span>
                </div>
              </div>
            </div>

            {/* Output Card */}
            <div className="lg:col-span-5 bg-forest-800 text-sandstone-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg border border-forest-500">
              <div>
                <span className="text-xs uppercase tracking-wider text-sandstone-300 font-semibold">{t.installment}</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-white">₹{emi.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-sandstone-300 font-medium">{t.monthShort}</span>
                </div>
                <p className="text-xs text-sandstone-300/80 mt-2">
                  Calculated at {interestRate.toFixed(1)}% annual reducing balance rate.
                </p>
              </div>

              <div className="my-6 py-4 border-y border-forest-700 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-sandstone-300">{t.principalBorrowed}</span>
                  <span className="font-bold text-white">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sandstone-300">{t.interestRateLabel}</span>
                  <span className="font-bold text-sandstone-200">{interestRate.toFixed(1)}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sandstone-300">{t.totalInterest}</span>
                  <span className="font-bold text-terracotta-400">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-forest-700/60 font-semibold">
                  <span className="text-sandstone-200">{t.totalPayable}</span>
                  <span className="text-white text-sm">₹{totalRepayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-700 text-xs text-sandstone-300 flex items-center gap-2.5">
                <QrCode className="w-5 h-5 text-terracotta-400 shrink-0" />
                <span>Instant dynamic UPI repayment QR will be generated for every monthly installment.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-sandstone-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-forest-900">{t.howItWorks}</h3>
            <p className="text-sm text-forest-800/80 mt-1">{t.howItWorksDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-sandstone-50 p-6 rounded-2xl border border-clay relative">
              <span className="w-8 h-8 rounded-full bg-forest-800 text-white font-bold text-sm flex items-center justify-center mb-4">1</span>
              <h4 className="font-bold text-forest-900 text-base">{t.step1Title}</h4>
              <p className="text-xs text-forest-800/70 mt-2 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="bg-sandstone-50 p-6 rounded-2xl border border-clay relative">
              <span className="w-8 h-8 rounded-full bg-terracotta-600 text-white font-bold text-sm flex items-center justify-center mb-4">2</span>
              <h4 className="font-bold text-forest-900 text-base">{t.step2Title}</h4>
              <p className="text-xs text-forest-800/70 mt-2 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="bg-sandstone-50 p-6 rounded-2xl border border-clay relative">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center mb-4">3</span>
              <h4 className="font-bold text-forest-900 text-base">{t.step3Title}</h4>
              <p className="text-xs text-forest-800/70 mt-2 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Citizen Charter */}
      <footer className="bg-forest-900 text-sandstone-200 py-12 px-4 border-t border-forest-800 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <GGYBrandMark size="sm" />
              <div>
                <span className="font-bold text-sm text-white block">GGY Finance</span>
                <span className="text-[10px] text-terracotta-400 font-bold uppercase">Micro Money Lending Platform</span>
              </div>
            </div>
            <p className="text-sandstone-300/80 leading-relaxed">
              Empowering rural micro-entrepreneurs, dairy farmers, and village households with honest, transparent, and technology-driven credit solutions across India.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Regulatory Disclosures</h5>
            <ul className="space-y-2 text-sandstone-300">
              <li>RBI SBR Framework: Base Layer (NBFC-BL)</li>
              <li>Certificate of Registration: B-14.02981</li>
              <li>Fair Practices Code (FPC) strictly followed</li>
              <li>Zero unmasked Aadhaar storage policy</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Grievance Redressal</h5>
            <ul className="space-y-2 text-sandstone-300">
              <li>{t.grievanceOfficer}</li>
              <li>Email: grievance@ggyfinance.in</li>
              <li>Toll-Free: 1800-209-4321 (9 AM - 6 PM)</li>
              <li>Escalation: RBI CMS Portal (cms.rbi.org.in)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Staff & Internal Access</h5>
            <p className="text-sandstone-300/80 mb-3">
              Only authorized banking personnel (Admins, Managers, Checkers, and Field Agents) may log in.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white px-3.5 py-2 rounded-lg font-semibold transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>{t.staffLogin}</span>
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-forest-800 text-center text-sandstone-400 text-xs">
          {t.copyright}
        </div>
      </footer>
    </div>
  );
}
