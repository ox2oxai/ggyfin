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
    tag: 'Artisan Special'
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
  const [interestRate, setInterestRate] = useState<number>(13.5);
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
      btnExplore: 'Explore Credit Facilities',
      statDisbursed: 'Disbursed Capital',
      statRepayment: 'Repayment Rate',
      statEmpowered: 'Rural Families Empowered',
      statTurnaround: 'Doorstep Sanction Speed',
      productsSectionTitle: 'Core Banking Credit Facilities',
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
      btnExplore: 'ಸಾಲ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ',
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
    <div className="min-h-screen bg-pearl-100 text-forest-900 flex flex-col selection:bg-saffron-500 selection:text-white">
      <PublicHeader />

      {/* HERO SECTION: TRICOLOR HARMONY */}
      <section className="relative overflow-hidden bg-linear-to-b from-bankGreen-950 via-bankGreen-900 to-bankGreen-950 text-sandstone-100 pt-16 pb-24 sm:pt-20 sm:pb-32 border-b border-bankGreen-800">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-bankGreen-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          {/* Institutional Status Badge */}
          <div className="inline-flex items-center gap-2 bg-bankGreen-900/80 border border-bankGreen-700/80 px-4 py-1.5 rounded-full shadow-inner backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-saffron-500 animate-pulse"></span>
            <span className="text-xs font-bold text-sandstone-200 tracking-wide">
              {t.heroPill}
            </span>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
              {t.heroTitle1}{' '}
              <span className="bg-linear-to-r from-saffron-400 via-amber-300 to-saffron-500 bg-clip-text text-transparent block sm:inline">
                {t.heroTitleAccent}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-sandstone-300 max-w-2xl mx-auto leading-relaxed font-medium">
              {t.heroDesc}
            </p>
          </div>

          {/* Dual Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3.5">
            <a
              href="#calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-saffron-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Calculator className="w-4 h-4" />
              <span>{t.btnCalculate}</span>
            </a>

            <a
              href="#products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-bankGreen-800/80 hover:bg-bankGreen-700/80 text-sandstone-100 border border-bankGreen-600/80 font-bold text-sm px-6 py-3.5 rounded-2xl backdrop-blur-md transition-all"
            >
              <span>{t.btnExplore}</span>
              <ArrowRight className="w-4 h-4 text-saffron-400" />
            </a>
          </div>

          {/* Floating Key Metrics Strip */}
          <div className="pt-10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-bankGreen-900/60 border border-bankGreen-700/60 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-black text-saffron-400">₹48.5 Cr+</p>
              <p className="text-[11px] text-sandstone-300 font-medium mt-1">{t.statDisbursed}</p>
            </div>
            <div className="bg-bankGreen-900/60 border border-bankGreen-700/60 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">98.9%</p>
              <p className="text-[11px] text-sandstone-300 font-medium mt-1">{t.statRepayment}</p>
            </div>
            <div className="bg-bankGreen-900/60 border border-bankGreen-700/60 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-black text-white">42,000+</p>
              <p className="text-[11px] text-sandstone-300 font-medium mt-1">{t.statEmpowered}</p>
            </div>
            <div className="bg-bankGreen-900/60 border border-bankGreen-700/60 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-black text-amber-300">15-Min</p>
              <p className="text-[11px] text-sandstone-300 font-medium mt-1">{t.statTurnaround}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION: STUNNING BANKING PRODUCT SHOWCASE */}
      <section id="products" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-bankGreen-800 bg-bankGreen-100 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-saffron-600" />
            <span>Finacle CBS-Compliant Credit Schemes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-forest-900 tracking-tight">
            {t.productsSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-forest-800/80 leading-relaxed font-medium">
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
                    ? 'bg-white border-2 border-saffron-500 shadow-xl shadow-saffron-500/10 scale-[1.01]'
                    : 'bg-white border-clay/80 hover:border-bankGreen-600/50 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-bankGreen-50 text-bankGreen-800 flex items-center justify-center border border-bankGreen-200">
                      <Icon className="w-6 h-6 text-bankGreen-800" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-pearl-200 text-forest-800 px-2 py-0.5 rounded-md">
                        {prod.schemeCode}
                      </span>
                      <span className="text-[11px] font-bold bg-saffron-100 text-saffron-800 px-2.5 py-0.5 rounded-full">
                        {prod.tag}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg sm:text-xl font-extrabold text-forest-900 leading-tight">
                      {lang === 'en' ? prod.titleEn : prod.titleKn}
                    </h3>
                    <p className="text-xs text-saffron-700 font-bold mt-0.5">{prod.category}</p>
                  </div>

                  <div className="mt-4 p-3 bg-pearl-100 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="text-[10px] text-forest-800/70 font-semibold">{t.ratePerAnnum}</p>
                      <p className="text-lg font-black text-bankGreen-800 font-mono">{prod.interestRate}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-forest-800/70 font-semibold">{t.maxSanction}</p>
                      <p className="text-lg font-black text-forest-900 font-mono">
                        ₹{prod.maxAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {(lang === 'en' ? prod.featuresEn : prod.featuresKn).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-forest-800/90 font-medium">
                        <Check className="w-3.5 h-3.5 text-bankGreen-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-clay/60 flex justify-between items-center">
                  <span className="text-xs font-bold text-forest-800/70">
                    Tenure: <strong className="text-forest-900">{prod.tenureRange}</strong>
                  </span>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      isSelected
                        ? 'bg-saffron-500 text-white shadow-xs'
                        : 'bg-bankGreen-900 text-white hover:bg-bankGreen-800'
                    }`}
                  >
                    {isSelected ? 'Selected in Calculator' : 'Select Product'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE EMI CALCULATOR SECTION */}
      <section id="calculator" className="py-16 sm:py-24 bg-pearl-200/60 border-y border-clay/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 bg-saffron-100 px-3 py-1 rounded-full">
              <Calculator className="w-3.5 h-3.5" />
              <span>Reducing Balance EMI Simulator</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-forest-900 tracking-tight">
              {t.calcTitle}
            </h2>
            <p className="text-xs sm:text-sm text-forest-800/80 font-medium">
              {t.calcDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sliders Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-clay shadow-xs space-y-6">
              {/* Slider 1: Amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-forest-900">{t.sliderAmount}</label>
                  <span className="text-lg font-black text-bankGreen-900 font-mono">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={200000}
                  step={5000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-pearl-200 rounded-lg appearance-none cursor-pointer accent-saffron-500"
                />
                <div className="flex justify-between text-[10px] text-forest-800/60 font-mono">
                  <span>₹10,000</span>
                  <span>Max: ₹2,00,000</span>
                </div>
              </div>

              {/* Slider 2: Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-forest-900">{t.sliderTenure}</label>
                  <span className="text-lg font-black text-bankGreen-900 font-mono">
                    {tenure} Months
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={36}
                  step={6}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2.5 bg-pearl-200 rounded-lg appearance-none cursor-pointer accent-bankGreen-700"
                />
                <div className="flex justify-between text-[10px] text-forest-800/60 font-mono">
                  <span>6 Months</span>
                  <span>36 Months (3 Years)</span>
                </div>
              </div>

              {/* Slider 3: Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-forest-900">{t.sliderRate}</label>
                  <span className="text-lg font-black text-saffron-600 font-mono">
                    {interestRate.toFixed(1)}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min={8.0}
                  max={24.0}
                  step={0.5}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-pearl-200 rounded-lg appearance-none cursor-pointer accent-saffron-500"
                />
                <div className="flex justify-between text-[10px] text-forest-800/60 font-mono">
                  <span>8.0% (Agri/SHG)</span>
                  <span>24.0% (Micro Cap)</span>
                </div>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-forest-800">
                  <span>Principal ({principalPercentage}%)</span>
                  <span>Interest ({100 - principalPercentage}%)</span>
                </div>
                <div className="w-full h-3 bg-pearl-200 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${principalPercentage}%` }}
                    className="bg-bankGreen-700 h-full transition-all duration-300"
                  ></div>
                  <div
                    style={{ width: `${100 - principalPercentage}%` }}
                    className="bg-saffron-500 h-full transition-all duration-300"
                  ></div>
                </div>
              </div>
            </div>

            {/* Result & Repayment Card (5 cols) */}
            <div className="lg:col-span-5 bg-bankGreen-950 text-sandstone-100 p-6 sm:p-8 rounded-3xl border border-bankGreen-800 shadow-xl space-y-6 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-400">
                  {t.emiHeading}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    ₹{monthlyEmi.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-sandstone-300 font-semibold">{t.perMonth}</span>
                </div>
                <p className="text-[11px] text-sandstone-400 mt-1">
                  Calculated at {interestRate}% annual reducing balance rate.
                </p>

                <div className="divide-y divide-bankGreen-800/80 text-xs mt-6">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-sandstone-300">{t.principalBreakdown}:</span>
                    <span className="font-mono font-bold text-white">₹{loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-sandstone-300">{t.interestBreakdown}:</span>
                    <span className="font-mono font-bold text-saffron-300">₹{totalInterest.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="py-2.5 flex justify-between text-sm font-bold">
                    <span className="text-white">{t.totalPayable}:</span>
                    <span className="font-mono font-black text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Repayment QR Specimen */}
              <div className="bg-bankGreen-900 p-4 rounded-2xl border border-bankGreen-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-saffron-300">
                  <QrCode className="w-4 h-4" />
                  <span>{t.qrTitle}</span>
                </div>
                <p className="text-[11px] text-sandstone-300 leading-relaxed font-medium">
                  {t.qrDesc}
                </p>
              </div>

              <Link
                href="/login"
                className="w-full py-3 bg-saffron-500 hover:bg-saffron-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all text-center block"
              >
                {t.applyPwa} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GOVERNANCE & TRUST WALL */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-clay p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-clay pb-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-saffron-700">
                Reserve Bank of India Guidelines
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-forest-900 mt-1">
                {t.trustTitle}
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-bankGreen-50 text-bankGreen-900 px-3.5 py-1.5 rounded-full border border-bankGreen-200 text-xs font-bold">
              <BadgeCheck className="w-4 h-4 text-bankGreen-700" />
              <span>Audited Base Layer NBFC</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-forest-800/90 leading-relaxed">
            <div className="space-y-1.5">
              <p className="font-extrabold text-sm text-forest-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-bankGreen-700" />
                <span>Four-Eyes Segregation</span>
              </p>
              <p>Every credit request is originated by a Field Maker and independently verified by a Checker Authorizer. Zero single-point credit approval fraud.</p>
            </div>

            <div className="space-y-1.5">
              <p className="font-extrabold text-sm text-forest-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-bankGreen-700" />
                <span>UIDAI Masked Aadhaar Vault</span>
              </p>
              <p>Only masked Aadhaar numbers (XXXX-XXXX-1234) are accepted. All documents are AES-256-GCM envelope encrypted with 60-second ephemeral tokens.</p>
            </div>

            <div className="space-y-1.5">
              <p className="font-extrabold text-sm text-forest-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-bankGreen-700" />
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
