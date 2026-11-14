'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  calculateEMI,
  generateUpiUri
} from '@nbfc/shared';
import {
  Store,
  Milk,
  Shirt,
  Sprout,
  ShieldCheck,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  QrCode,
  TrendingUp,
  Award,
  Users2,
  Clock,
  Sparkles,
  ChevronRight,
  BadgeCheck,
  IndianRupee,
  PhoneCall,
  Check
} from 'lucide-react';
import { GGYBrandMark } from '../components/brand-mark';
import { PublicHeader } from '../components/public-header';
import { PublicFooter } from '../components/public-footer';
import { useLanguage } from '../components/language-context';

interface ProductItem {
  id: string;
  schemeCode: string;
  titleEn: string;
  titleKn: string;
  category: string;
  interestRate: number;
  maxAmount: number;
  tenureRange: string;
  featuresEn: string[];
  featuresKn: string[];
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const BANK_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-dairy',
    schemeCode: 'SCHM-702',
    titleEn: 'Dairy Development Term Loan',
    titleKn: 'ಹೈನುಗಾರಿಕೆ ಅಭಿವೃದ್ಧಿ ಸಾಲ',
    category: 'Livestock & Agri-Allied',
    interestRate: 12.5,
    maxAmount: 150000,
    tenureRange: '12 to 24 Months',
    featuresEn: [
      'High-yield crossbred cow/buffalo purchase',
      'Bulk milk cooling & testing equipment',
      'Green fodder & cattle nutrition advance',
      'Doorstep cash/UPI repayment options'
    ],
    featuresKn: [
      'ಕರು/ಹಸುಗಳ ಖರೀದಿ ಮತ್ತು ಶೆಡ್ ನಿರ್ಮಾಣ',
      'ಹಾಲು ಶೇಖರಣಾ ಸಲಕರಣೆಗಳ ಖರೀದಿ',
      'ಹಸಿರು ಮೇವು ಮತ್ತು ಪಶು ಆಹಾರ ಮುಂಗಡ',
      'ಮನೆಬಾಗಿಲ ನಗದು ಅಥವಾ ಯುಪಿಐ ಮರುಪಾವತಿ'
    ],
    icon: Milk,
    tag: 'Most Popular'
  },
  {
    id: 'prod-kirana',
    schemeCode: 'SCHM-701',
    titleEn: 'Kirana & Village Retail Capital',
    titleKn: 'ಕಿರಾಣಿ & ಸಣ್ಣ ವ್ಯಾಪಾರ ಬಂಡವಾಳ',
    category: 'Micro-Enterprise',
    interestRate: 13.5,
    maxAmount: 100000,
    tenureRange: '6 to 18 Months',
    featuresEn: [
      'Inventory replenishment & FMCG bulk purchase',
      'Zero pre-payment or foreclosure penalty',
      'Direct credit to distributor/supplier account',
      'Weekly or monthly flexible installment'
    ],
    featuresKn: [
      'ದಿನಸಿ ಸಾಮಗ್ರಿಗಳ ಸಗಟು ಖರೀದಿ ಬಂಡವಾಳ',
      'ಅವಧಿಗೆ ಮುನ್ನ ಮರುಪಾವತಿಗೆ ಯಾವುದೇ ದಂಡವಿಲ್ಲ',
      'ವಿತರಕರ ಖಾತೆಗೆ ನೇರ ಹಣ ವರ್ಗಾವಣೆ',
      'ವಾರದ ಅಥವಾ ಮಾಸಿಕ ಸುಲಭ ಕಂತುಗಳು'
    ],
    icon: Store,
    tag: 'Instant Sanction'
  },
  {
    id: 'prod-artisan',
    schemeCode: 'SCHM-703',
    titleEn: 'Powerloom & Handloom Artisan Loan',
    titleKn: 'ನೇಯ್ಗೆ & ಕೈಮಗ್ಗ ಕುಶಲಕರ್ಮಿ ಸಾಲ',
    category: 'Artisan & Weaving',
    interestRate: 14.0,
    maxAmount: 200000,
    tenureRange: '12 to 36 Months',
    featuresEn: [
      'Raw mulberry silk & yarn procurement',
      'Loom motor modernization & jacquard cards',
      'Festival season production advance',
      'Joint Liability Group (JLG) option available'
    ],
    featuresKn: [
      'ರೇಷ್ಮೆ ನೂಲು ಮತ್ತು ಕಚ್ಚಾ ವಸ್ತುಗಳ ಖರೀದಿ',
      'ಮಗ್ಗಗಳ ಆಧುನೀಕರಣ ಮತ್ತು ವಿದ್ಯುದೀಕರಣ',
      'ಹಬ್ಬದ ಸೀಸನ್ ಉತ್ಪಾದನಾ ಮುಂಗಡ',
      'ಸ್ವಸಹಾಯ ಗುಂಪು (JLG) ಆಧಾರಿತ ಸಾಲ'
    ],
    icon: Shirt,
    tag: 'Silk Capital'
  },
  {
    id: 'prod-agri',
    schemeCode: 'SCHM-704',
    titleEn: 'Micro-Agriculture & Horticulture Credit',
    titleKn: 'ಕಿರು ಕೃಷಿ & ತೋಟಗಾರಿಕೆ ಸಾಲ',
    category: 'Agritech & Smallholder',
    interestRate: 11.5,
    maxAmount: 80000,
    tenureRange: '6 to 12 Months',
    featuresEn: [
      'Drip irrigation pipes & micro-sprinklers',
      'Certified organic bio-fertilizer supply',
      'Post-harvest village warehousing support',
      'Bullet interest repayment option'
    ],
    featuresKn: [
      'ಹನಿ ನೀರಾವರಿ ಪೈಪ್ ಮತ್ತು ಸಲಕರಣೆಗಳು',
      'ಪ್ರಮಾಣೀಕೃತ ಸಾವಯವ ಗೊಬ್ಬರ ಮತ್ತು ಬೀಜಗಳು',
      'ಕೊಯ್ಲಿನ ನಂತರದ ಗೋದಾಮು ಬೆಂಬಲ',
      'ಬೆಳೆ ಕಟಾವಿನ ನಂತರ ಮರುಪಾವತಿ ಸೌಲಭ್ಯ'
    ],
    icon: Sprout,
    tag: 'Lowest Rate'
  }
];

export default function HomePage() {
  const { lang } = useLanguage();
  const [loanAmount, setLoanAmount] = useState<number>(60000);
  const [tenure, setTenure] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(12.5);
  const [selectedProduct, setSelectedProduct] = useState<string>('prod-dairy');

  const monthlyEmi = calculateEMI(loanAmount, interestRate, tenure);
  const totalAmount = monthlyEmi * tenure;
  const totalInterest = Math.max(0, totalAmount - loanAmount);
  const principalPercentage = totalAmount > 0 ? Math.round((loanAmount / totalAmount) * 100) : 100;

  const specimenUpiUri = generateUpiUri({
    vpa: 'ggycollect@icici',
    payeeName: 'GGY Finance',
    amount: monthlyEmi,
    transactionRef: 'EMI-SPECIMEN',
    accountNumber: '1084-0101-702-0039-4'
  });

  const handleSelectProduct = (prod: ProductItem) => {
    setSelectedProduct(prod.id);
    setInterestRate(prod.interestRate);
    setLoanAmount((prev) => Math.min(prod.maxAmount, Math.max(10000, prev)));

    // Clamp tenure within product's specific regulatory scheme bounds
    const match = prod.tenureRange.match(/(\d+)\s+to\s+(\d+)/);
    if (match) {
      const minT = parseInt(match[1], 10);
      const maxT = parseInt(match[2], 10);
      setTenure((prev) => Math.min(maxT, Math.max(minT, prev)));
    }
  };

  const t = {
    en: {
      heroPill: 'RBI Registered NBFC-BL • Certificate No: B-14.02981',
      heroTitle1: 'Honest Micro Banking for',
      heroTitleAccent: "Bharat's Rural Builders",
      heroDesc: 'Purpose-built credit facilities for village entrepreneurs, dairy farmers, and weavers. Transparent reducing-balance interest with instant PhonePe/GPay UPI repayments and doorstep relationship managers.',
      btnCalculate: 'Calculate Monthly EMI',
      btnExplore: 'Explore 4 Credit Schemes',
      statDisbursed: 'Disbursed Capital',
      statRepayment: 'Repayment Rate',
      statEmpowered: 'Families Served',
      statTurnaround: 'Doorstep Sanction Speed',
      productsSectionTitle: 'Purpose-Built Credit Facilities',
      productsSectionDesc: 'Architected with individual Finacle Scheme Codes for seamless future transition to a Scheduled Bank.',
      ratePerAnnum: '% p.a.',
      maxSanction: 'Max Sanction:',
      calcTitle: 'Interactive EMI Calculator & Repayment Simulator',
      calcDesc: 'Transparent reducing balance calculation. No hidden file charges, no foreclosure penalty.',
      sliderAmount: 'Required Loan Capital (Principal)',
      sliderTenure: 'Repayment Tenure (Months)',
      sliderRate: 'Annual Interest Rate (Reducing Balance)',
      emiHeading: 'Monthly Installment (EMI)',
      perMonth: '/ month',
      principalBreakdown: 'Principal Amount',
      interestBreakdown: 'Total Reducing Interest',
      totalPayable: 'Total Repayable Over Tenure',
      qrTitle: 'Dynamic UPI Repayment QR',
      qrDesc: 'Scan with any UPI App (PhonePe, GPay, Paytm, BHIM) to settle your monthly installment instantly.',
      trustTitle: 'Institutional Bank-Grade Governance',
      trustDesc: '100% Indian Data Sovereignty under DPDP Act 2023 with RBI Four-Eyes segregation of duties.',
      applyPwa: 'Request Doorstep Application via Field Officer'
    },
    kn: {
      heroPill: 'ಆರ್.ಬಿ.ಐ ನೋಂದಾಯಿತ ಕಿರು ಸಾಲ ಸಂಸ್ಥೆ • ಪ್ರಮಾಣಪತ್ರ: B-14.02981',
      heroTitle1: 'ಗ್ರಾಮೀಣ ಭಾರತದ ಬೆಳವಣಿಗೆಗೆ',
      heroTitleAccent: 'ಪ್ರಾಮಾಣಿಕ ಕಿರು ಬ್ಯಾಂಕಿಂಗ್ ಸಾಲಗಳು',
      heroDesc: 'ಗ್ರಾಮೀಣ ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು, ಹೈನುಗಾರಿಕೆ ಕುಟುಂಬಗಳು ಮತ್ತು ನೇಕಾರರಿಗೆ ನೇರ ಮನೆಬಾಗಿಲ ಸಾಲ ಸೌಲಭ್ಯ. ಯಾವುದೇ ಗುಪ್ತ ಶುಲ್ಕಗಳಿಲ್ಲದ ಪಾರದರ್ಶಕ ಬಡ್ಡಿದರ ಮತ್ತು ಸುಲಭ ಯುಪಿಐ (UPI) ಮರುಪಾವತಿ.',
      btnCalculate: 'ನಿಮ್ಮ ಇಎಂಐ (EMI) ಲೆಕ್ಕಹಾಕಿ',
      btnExplore: '೪ ಸಾಲ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ',
      statDisbursed: 'ಒಟ್ಟು ಸಾಲ ವಿತರಣೆ',
      statRepayment: 'ಮರುಪಾವತಿ ದರ',
      statEmpowered: 'ಸಬಲೀಕರಣಗೊಂಡ ಕುಟುಂಬಗಳು',
      statTurnaround: 'ಮನೆಬಾಗಿಲ ಅನುಮೋದನೆ ವೇಗ',
      productsSectionTitle: 'ಉದ್ದೇಶ ಆಧಾರಿತ ಕಿರು ಸಾಲ ಸೌಲಭ್ಯಗಳು',
      productsSectionDesc: 'ಭವಿಷ್ಯದಲ್ಲಿ ಪೂರ್ಣ ಬ್ಯಾಂಕ್ ಆಗಿ ಪರಿವರ್ತನೆಗೊಳ್ಳಲು ಸಿದ್ಧವಾಗಿರುವ ಕೋರ್ ಬ್ಯಾಂಕಿಂಗ್ ಯೋಜನೆಗಳು.',
      ratePerAnnum: '% ವಾರ್ಷಿಕ ಬಡ್ಡಿ',
      maxSanction: 'ಗರಿಷ್ಠ ಮಿತಿ:',
      calcTitle: 'ಸುಲಭ ಇಎಂಐ (EMI) ಕ್ಯಾಲ್ಕುಲೇಟರ್ & ಯುಪಿಐ ಪ್ರಕ್ರಿಯೆ',
      calcDesc: 'ಪಾರದರ್ಶಕ ಬಡ್ಡಿದರ ಲೆಕ್ಕಾಚಾರ. ಯಾವುದೇ ಮುಂಗಡ ರದ್ದು ಶುಲ್ಕ ಅಥವಾ ಗುಪ್ತ ಕಡಿತಗಳಿಲ್ಲ.',
      sliderAmount: 'ಸಾಲದ ಮೊತ್ತ (Principal)',
      sliderTenure: 'ಮರುಪಾವತಿ ಅವಧಿ (ತಿಂಗಳುಗಳಲ್ಲಿ)',
      sliderRate: 'ವಾರ್ಷಿಕ ಬಡ್ಡಿದರ (Reducing Balance)',
      emiHeading: 'ನಿಮ್ಮ ಮಾಸಿಕ ಕಂತು (EMI)',
      perMonth: '/ ತಿಂಗಳಿಗೆ',
      principalBreakdown: 'ಪಡೆದ ಅಸಲು ಮೊತ್ತ',
      interestBreakdown: 'ಒಟ್ಟು ಬಡ್ಡಿ ಮೊತ್ತ',
      totalPayable: 'ಒಟ್ಟು ಮರುಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ',
      qrTitle: 'ತ್ವರಿತ ಯುಪಿಐ (UPI) ಕ್ಯೂಆರ್ ಕೋಡ್',
      qrDesc: 'PhonePe, GPay, Paytm ಮೂಲಕ ನಿಮ್ಮ ಮಾಸಿಕ ಕಂತನ್ನು ತಕ್ಷಣವೇ ಸುಲಭವಾಗಿ ಮರುಪಾವತಿಸಿ.',
      trustTitle: 'ಆರ್.ಬಿ.ಐ ನಿಯಮಾವಳಿಗಳ ಕಟ್ಟುನಿಟ್ಟಾದ ಅನುಸರಣೆ',
      trustDesc: 'DPDP ಕಾಯ್ದೆ 2023 ರ ಅನ್ವಯ 100% ಭಾರತೀಯ ಸರ್ವರ್‌ಗಳಲ್ಲಿ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆದ ಡೇಟಾ ಸಂರಕ್ಷಣೆ.',
      applyPwa: 'ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳ ಮೂಲಕ ಮನೆಬಾಗಿಲಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ'
    }
  }[lang];

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      {/* 3. HERO SECTION: OPTION B ROYAL SAFFRON SUNBURST */}
      <section className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white pt-16 pb-20 px-4 sm:px-10 text-center border-b border-orange-800 shadow-inner overflow-hidden">
        {/* Ambient Glow & Subtle Depth */}
        <div className="absolute -top-24 left-1/4 w-[500px] h-[350px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-amber-300/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          {/* Institutional Status Pill */}
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-white shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>{t.heroPill}</span>
          </div>

          {/* Main Headline: Diamond White with Warm Amber Underline Accent */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-tight drop-shadow-md">
            {t.heroTitle1}{' '}
            <span className="text-amber-100 underline decoration-white/40 decoration-4 block sm:inline">
              {t.heroTitleAccent}
            </span>
          </h1>

          {/* Subtitle: Crisp Amber-50 with Maximum Contrast */}
          <p className="text-amber-50 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium drop-shadow-xs">
            {t.heroDesc}
          </p>

          {/* CTAs: Pure White Primary Button + Forest Green Secondary Button */}
          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3.5">
            <a
              href="#calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white hover:bg-amber-50 active:scale-[0.98] text-orange-700 font-black text-sm rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5 border border-white"
            >
              <Calculator className="w-4 h-4 text-orange-700" />
              <span>{t.btnCalculate}</span>
            </a>

            <a
              href="#products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#064e3b] hover:bg-[#043e2f] active:scale-[0.98] text-white border border-emerald-500/50 font-extrabold text-sm rounded-xl shadow-lg transition-all"
            >
              <span>{t.btnExplore}</span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </a>
          </div>

          {/* 4 Floating Key Metrics Strip: Floating Porcelain White Tiles */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-white/60 shadow-xl text-center transform hover:-translate-y-1 transition-transform">
              <p className="text-2xl sm:text-3xl font-black text-orange-600 font-mono tracking-tight">₹48.5 Cr+</p>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{t.statDisbursed}</p>
              <span className="inline-block mt-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">100% Karnataka</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-white/60 shadow-xl text-center transform hover:-translate-y-1 transition-transform">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tracking-tight">98.9%</p>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{t.statRepayment}</p>
              <span className="inline-block mt-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Zero Foreclosure Fee</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-white/60 shadow-xl text-center transform hover:-translate-y-1 transition-transform">
              <p className="text-2xl sm:text-3xl font-black text-orange-600 font-mono tracking-tight">42,000+</p>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{t.statEmpowered}</p>
              <span className="inline-block mt-1 text-[10px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">76% Women Borrowers</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-white/60 shadow-xl text-center transform hover:-translate-y-1 transition-transform">
              <p className="text-2xl sm:text-3xl font-black text-orange-600 font-mono tracking-tight">15-Min</p>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{t.statTurnaround}</p>
              <span className="inline-block mt-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">RBI 4-Eyes Check</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS SECTION: Saffron & White Dominant with Subtle Green */}
      <section id="products" className="py-16 sm:py-20 px-4 sm:px-10 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full shadow-2xs">
            <Award className="w-3.5 h-3.5 text-orange-600" />
            <span>Core Banking Scheme Codes (Finacle / BaNCS)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {t.productsSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {t.productsSectionDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BANK_PRODUCTS.map((prod) => {
            const Icon = prod.icon;
            const isSelected = selectedProduct === prod.id;
            return (
              <div
                key={prod.id}
                onClick={() => handleSelectProduct(prod)}
                className={`cursor-pointer rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between space-y-5 ${
                  isSelected
                    ? 'bg-white border-2 border-orange-500 shadow-xl shadow-orange-500/5 scale-[1.01]'
                    : 'bg-white border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-orange-600 flex items-center justify-center border border-amber-200">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200">
                        {prod.schemeCode}
                      </span>
                      <span className="text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-200 px-2.5 py-0.5 rounded-full">
                        {prod.tag}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                      {prod.category}
                    </p>
                    <h3 className="text-lg font-black text-slate-950 mt-0.5">
                      {lang === 'kn' ? prod.titleKn : prod.titleEn}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Interest Rate</p>
                      <p className="text-xl font-black text-orange-600 mt-0.5">
                        {prod.interestRate}{t.ratePerAnnum}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.maxSanction}</p>
                      <p className="text-xl font-black text-slate-950 mt-0.5 font-mono">
                        ₹{prod.maxAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] font-bold text-slate-600">Product Highlights:</p>
                    <ul className="text-xs space-y-1.5 text-slate-700">
                      {(lang === 'kn' ? prod.featuresKn : prod.featuresEn).map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center text-xs border-t border-slate-100 font-semibold">
                  <span className="text-slate-500">Tenure: {prod.tenureRange}</span>
                  <span className="text-orange-600 font-bold flex items-center gap-1 group">
                    <span>Calculate in EMI tool</span>
                    <ChevronRight className="w-3.5 h-3.5 text-orange-600 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE EMI CALCULATOR SECTION */}
      <section id="calculator" className="py-16 bg-[#FBFBFA] border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-10 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-700 bg-orange-100 border border-orange-200 px-3.5 py-1 rounded-full">
              <Calculator className="w-3.5 h-3.5 text-orange-600" />
              <span>Transparent Core Banking Math</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {t.calcTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {t.calcDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              {/* Slider 1: Loan Amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-900">{t.sliderAmount}</label>
                  <span className="text-base sm:text-lg font-black text-slate-950 font-mono bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                  <span>₹10,000</span>
                  <span>₹1,00,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              {/* Slider 2: Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-900">{t.sliderTenure}</label>
                  <span className="text-base sm:text-lg font-black text-slate-950 font-mono bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    {tenure} Months
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="36"
                  step="3"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                  <span>6 Months</span>
                  <span>18 Months</span>
                  <span>36 Months</span>
                </div>
              </div>

              {/* Slider 3: Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-900">{t.sliderRate}</label>
                  <span className="text-base sm:text-lg font-black text-slate-950 font-mono bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    {interestRate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="18"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                  <span>10.0%</span>
                  <span>14.0%</span>
                  <span>18.0%</span>
                </div>
              </div>

              {/* Principal vs Interest Visual Ratio */}
              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-900">
                  <span>Principal ({principalPercentage}%)</span>
                  <span>Interest ({100 - principalPercentage}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${principalPercentage}%` }}
                    className="bg-[#0e4b2f] h-full transition-all duration-300"
                  ></div>
                  <div
                    style={{ width: `${100 - principalPercentage}%` }}
                    className="bg-orange-500 h-full transition-all duration-300"
                  ></div>
                </div>
              </div>
            </div>

            {/* Result & Repayment Card: Deep Institutional Emerald Accent (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#064e3b] to-[#022c22] text-white p-6 sm:p-8 rounded-3xl border border-emerald-900 shadow-xl space-y-6 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                  {t.emiHeading}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    ₹{monthlyEmi.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-emerald-200 font-semibold">{t.perMonth}</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  Calculated at standard monthly reducing balance.
                </p>

                <div className="divide-y divide-emerald-800/80 text-xs mt-6">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-emerald-200">{t.principalBreakdown}:</span>
                    <span className="font-mono font-bold text-white">₹{loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-emerald-200">{t.interestBreakdown}:</span>
                    <span className="font-mono font-bold text-amber-300">₹{totalInterest.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="py-2.5 flex justify-between text-sm font-bold">
                    <span className="text-white">{t.totalPayable}:</span>
                    <span className="font-mono font-black text-emerald-300">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Repayment QR Specimen */}
              <div className="bg-emerald-900/80 p-4 rounded-2xl border border-emerald-700/60 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <QrCode className="w-4 h-4" />
                  <span>{t.qrTitle}</span>
                </div>
                <p className="text-[11px] text-emerald-100 leading-relaxed font-medium">
                  {t.qrDesc}
                </p>
              </div>

              <Link
                href="/login"
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-950/30 transition-all text-center block"
              >
                {t.applyPwa} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GOVERNANCE & TRUST WALL */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-orange-700">
                Reserve Bank of India Guidelines
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                {t.trustTitle}
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3.5 py-1.5 rounded-full border border-emerald-200 text-xs font-bold">
              <BadgeCheck className="w-4 h-4 text-emerald-700" />
              <span>Audited Base Layer NBFC</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700 leading-relaxed">
            <div className="space-y-1.5">
              <p className="font-black text-sm text-slate-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Four-Eyes Segregation</span>
              </p>
              <p>Every credit request is originated by a Field Maker and independently verified by a Checker Authorizer. Zero single-point credit approval fraud.</p>
            </div>

            <div className="space-y-1.5">
              <p className="font-black text-sm text-slate-950 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>UIDAI Masked Aadhaar Vault</span>
              </p>
              <p>Only masked Aadhaar numbers (XXXX-XXXX-1234) are accepted. All documents are AES-256-GCM envelope encrypted with 60-second ephemeral tokens.</p>
            </div>

            <div className="space-y-1.5">
              <p className="font-black text-sm text-slate-950 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Karnataka Branch Network</span>
              </p>
              <p>Physical banking service outlets across Bengaluru, Ramanagara, Mandya, Tumakuru, and Mysuru with dedicated Nodal Grievance Redressal.</p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
