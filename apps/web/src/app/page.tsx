'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  calculateEMI
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
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  IndianRupee,
  PhoneCall,
  Check,
  Copy,
  Play,
  Video,
  MessageCircle,
  PiggyBank,
  ExternalLink
} from 'lucide-react';
import { GGYBrandMark } from '../components/brand-mark';
import { PublicHeader } from '../components/public-header';
import { PublicFooter } from '../components/public-footer';
import { useLanguage } from '../components/language-context';
import {
  getCreditSchemesSync,
  CreditScheme,
  InstitutionConfig,
  getInstitutionConfigSync,
  getInstitutionConfigAsync,
  DEFAULT_INSTITUTION_CONFIG
} from '../lib/institution';

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
      'ಸುಲಭ ಬಡ್ಡಿ ಮರುಪಾವತಿ ಆಯ್ಕೆ'
    ],
    icon: Sprout,
    tag: 'Drip & Organic'
  }
];

export default function HomePage() {
  const { lang } = useLanguage();
  const [loanAmount, setLoanAmount] = useState<number>(60000);
  const [tenure, setTenure] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(12.5);
  const [selectedProduct, setSelectedProduct] = useState<string>('prod-dairy');

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);

  // Dynamic Credit Schemes from Admin Store
  const [creditSchemes, setCreditSchemes] = useState<CreditScheme[]>(getCreditSchemesSync());

  // Dynamic Institution Configuration (for Admin-Published UPI / QR Details)
  const [instConfig, setInstConfig] = useState<InstitutionConfig>(getInstitutionConfigSync());
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  useEffect(() => {
    const handleSchemesUpdate = () => {
      setCreditSchemes(getCreditSchemesSync());
    };
    const handleConfigUpdate = () => {
      setInstConfig(getInstitutionConfigSync());
    };
    window.addEventListener('nbfc_schemes_updated', handleSchemesUpdate);
    window.addEventListener('nbfc_config_updated', handleConfigUpdate);

    getInstitutionConfigAsync().then(setInstConfig).catch(() => {});

    return () => {
      window.removeEventListener('nbfc_schemes_updated', handleSchemesUpdate);
      window.removeEventListener('nbfc_config_updated', handleConfigUpdate);
    };
  }, []);

  const handleCopyUpi = () => {
    const vpa = instConfig.upiVpa || 'ggycollect@icici';
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(vpa);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  // Hero Carousel Auto-Advance Timer (every 6 seconds unless hovered/touched)
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (diff > 50) {
      // Swiped left -> next slide
      setCurrentSlide((prev) => (prev + 1) % 3);
    } else if (diff < -50) {
      // Swiped right -> prev slide
      setCurrentSlide((prev) => (prev - 1 + 3) % 3);
    }
    touchStartXRef.current = null;
  };

  const monthlyEmi = calculateEMI(loanAmount, interestRate, tenure);
  const totalAmount = monthlyEmi * tenure;
  const totalInterest = Math.max(0, totalAmount - loanAmount);
  const principalPercentage = totalAmount > 0 ? Math.round((loanAmount / totalAmount) * 100) : 100;

  const handleSelectProduct = (prod: ProductItem) => {
    setSelectedProduct(prod.id);
    setInterestRate(prod.interestRate);
    setLoanAmount((prev) => Math.min(prod.maxAmount, Math.max(10000, prev)));

    const match = prod.tenureRange.match(/(\d+)\s+to\s+(\d+)/);
    if (match) {
      const minT = parseInt(match[1], 10);
      const maxT = parseInt(match[2], 10);
      setTenure((prev) => Math.min(maxT, Math.max(minT, prev)));
    }
  };

  const t = {
    en: {
      // Slide 1: Grassroots Lending
      slide1Pill: 'National Micro-Lending Platform • Doorstep Financial Services',
      slide1Title1: 'Honest Micro Banking for',
      slide1TitleAccent: 'Rural Bharat',
      slide1Desc: 'Transparent reducing-balance micro-loans and accessible wealth creation for village entrepreneurs, dairy farmers, and artisans across rural Bharat.',
      slide1Cta1: 'Calculate Monthly EMI',
      slide1Cta2: 'Explore Credit Facilities',
      slide1Stat1Val: '₹48.5 Cr+',
      slide1Stat1Lbl: 'Disbursed Capital',
      slide1Stat2Val: '99.4%',
      slide1Stat2Lbl: 'Repayment Rate',
      slide1Stat3Val: '35,000+',
      slide1Stat3Lbl: 'Families Empowered',
      slide1Stat4Val: '24-48 Hrs',
      slide1Stat4Lbl: 'Doorstep Turnaround',

      // Slide 2: Dairy & Women Entrepreneurship
      slide2Pill: 'Women Empowerment • Dairy & Livestock Financing',
      slide2Title1: 'Fueling Grassroots Women Entrepreneurs &',
      slide2TitleAccent: 'Dairy Growth',
      slide2Desc: 'Empowering rural women with Joint Liability Groups (JLG), cattle nutrition advances, and high-yield livestock financing at fair reducing rates.',
      slide2Cta1: 'View Dairy & JLG Schemes',
      slide2Cta2: 'Explore Field Stories in Gallery',
      slide2Stat1Val: '100%',
      slide2Stat1Lbl: 'Women SHG Coverage',
      slide2Stat2Val: '2x',
      slide2Stat2Lbl: 'Daily Milk Yield Increase',
      slide2Stat3Val: '₹0',
      slide2Stat3Lbl: 'Broker Commission',
      slide2Stat4Val: '15 Min',
      slide2Stat4Lbl: 'In-Principle Sanction',

      // Slide 3: Doorstep Digital Banking
      slide3Pill: 'Next-Gen Fintech • Instant NPCI UPI Repayment',
      slide3Title1: 'Fast, Transparent Digital Banking at Your',
      slide3TitleAccent: 'Doorstep',
      slide3Desc: 'Paperless 15-minute biometric approvals, instant dynamic QR payments, and zero pre-closure penalties with 100% DPDP Act 2023 compliance.',
      slide3Cta1: 'Try Dynamic UPI Simulator',
      slide3Cta2: 'Visit Video & Media Gallery',
      slide3Stat1Val: '3 Sec',
      slide3Stat1Lbl: 'Instant UPI Settlement',
      slide3Stat2Val: '100%',
      slide3Stat2Lbl: 'DPDP Data Sovereignty',
      slide3Stat3Val: '0%',
      slide3Stat3Lbl: 'Pre-Closure Penalty',
      slide3Stat4Val: 'RBI',
      slide3Stat4Lbl: 'Dual-Control Governance',

      productsSectionTitle: 'Regulated Credit Facilities',
      productsSectionDesc: 'Standardized regulatory credit schemes designed for transparent, door-to-door rural financial inclusion.',
      ratePerAnnum: '% p.a.',
      maxSanction: 'Max Sanction:',
      calcTitle: 'EMI Calculator & Repayment Simulator',
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
      copyUpi: 'Copy UPI ID',
      copiedUpi: 'Copied!',
      trustTitle: 'Institutional Governance & Fair Practices',
      trustDesc: '100% Indian Data Sovereignty under DPDP Act 2023 with dual-control maker-checker validation.',
      applyPwa: 'Request Doorstep Application via Field Officer',

      // Dedicated Gallery Teaser Section
      featuredStoryBadge: 'Customer Stories & Media',
      featuredStoryTitle: 'Voices from the Field',
      featuredStoryDesc: 'Real experiences from borrowers across rural Bharat who expanded their livelihood through honest, doorstep credit.',
      exploreGalleryBtn: 'Explore All Video Case Studies & Field Stories in Gallery',
      featuredTag1: 'Dairy Transformation',
      featuredTag2: 'Retail Enterprise',
      featuredBorrower1: 'Smt. Lakshmi Gowda',
      featuredVillage1: 'Channapatna Taluk, Ramanagara',
      featuredQuote1: '“With GGY’s doorstep UPI collection, I bought two HF crossbred cows without paying any broker commission. My family now earns ₹38,000 net profit monthly.”',
      featuredBorrower2: 'Sri Basavaraj Patil',
      featuredVillage2: 'Kunigal Town, Tumakuru',
      featuredQuote2: '“The wholesale FMCG supplier received direct payment from GGY at 0% processing fee. I installed a UPI soundbox and my customers pay digitally without hassle.”',

      investmentBannerBadge: 'Rural Wealth Initiative',
      investmentBannerTitle: 'From Disciplined Borrowers to Confident Wealth Creators',
      investmentBannerDesc: 'Disciplined wealth generation through SEBI-regulated micro-SIPs, high-yield fixed deposits, and daily doorstep Piggy savings.',
      btnExploreInvestments: 'Explore Investments & Daily Piggy',
      btnWhatsappAdvisor: 'Chat with Investment Advisor',
      pillMf: 'SEBI & AMFI Regulated Micro-SIP',
      pillFd: 'High-Yield FDs up to 8.50% p.a.',
      pillPiggy: 'Daily Doorstep Piggy Savings'
    },
    kn: {
      // Slide 1: Grassroots Lending
      slide1Pill: 'ರಾಷ್ಟ್ರೀಯ ಗ್ರಾಮೀಣ ಕಿರು ಸಾಲ ಸೇವಾ ವೇದಿಕೆ • ಮನೆಬಾಗಿಲ ಸೇವೆ',
      slide1Title1: 'ಗ್ರಾಮೀಣ ಭಾರತದ ಬೆಳವಣಿಗೆಗೆ',
      slide1TitleAccent: 'ಪ್ರಾಮಾಣಿಕ ಕಿರು ಬ್ಯಾಂಕಿಂಗ್',
      slide1Desc: 'ಗ್ರಾಮೀಣ ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು, ಹೈನುಗಾರಿಕೆ ಕುಟುಂಬಗಳು ಮತ್ತು ನೇಕಾರರಿಗೆ ನೇರ ಮನೆಬಾಗಿಲ ಸಾಲ ಸೌಲಭ್ಯ ಹಾಗೂ ಸುಲಭ ಸಂಪತ್ತು ಸೃಷ್ಟಿ.',
      slide1Cta1: 'ನಿಮ್ಮ ಇಎಂಐ (EMI) ಲೆಕ್ಕಹಾಕಿ',
      slide1Cta2: 'ಸಾಲ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ',
      slide1Stat1Val: '₹೪೮.೫ ಕೋಟಿ+',
      slide1Stat1Lbl: 'ಒಟ್ಟು ಸಾಲ ವಿತರಣೆ',
      slide1Stat2Val: '೯೯.೪%',
      slide1Stat2Lbl: 'ಮರುಪಾವತಿ ದರ',
      slide1Stat3Val: '೩೫,೦೦೦+',
      slide1Stat3Lbl: 'ಸಬಲೀಕರಣಗೊಂಡ ಕುಟುಂಬಗಳು',
      slide1Stat4Val: '೨೪-೪೮ ಗಂಟೆ',
      slide1Stat4Lbl: 'ಮನೆಬಾಗಿಲ ಪರಿಶೀಲನೆ ವೇಗ',

      // Slide 2: Dairy & Women Entrepreneurship
      slide2Pill: 'ಮಹಿಳಾ ಸಬಲೀಕರಣ • ಹೈನುಗಾರಿಕೆ ಮತ್ತು ಜಾನುವಾರು ಸಾಲ',
      slide2Title1: 'ಗ್ರಾಮೀಣ ಮಹಿಳಾ ಉದ್ಯಮಿಗಳು & ಹೈನುಗಾರಿಕೆಯ',
      slide2TitleAccent: 'ನೈಜ ಶಕ್ತಿ',
      slide2Desc: 'ಸ್ವಸಹಾಯ ಗುಂಪುಗಳು (JLG), ಪಶು ಆಹಾರ ಮುಂಗಡ ಮತ್ತು ಸಂಕರ ತಳಿಯ ಹಸುಗಳ ಖರೀದಿಗೆ ನ್ಯಾಯಸಮ್ಮತ ಇಳಿಕೆ ಬಡ್ಡಿದರದಲ್ಲಿ ಸಾಲ ಸೌಲಭ್ಯ.',
      slide2Cta1: 'ಹೈನುಗಾರಿಕೆ & ಸಂಘದ ಸಾಲ ಯೋಜನೆಗಳು',
      slide2Cta2: 'ಗ್ಯಾಲರಿಯಲ್ಲಿ ಯಶೋಗಾಥೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
      slide2Stat1Val: '೧೦೦%',
      slide2Stat1Lbl: 'ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಸಂಘಗಳ ವ್ಯಾಪ್ತಿ',
      slide2Stat2Val: '೨ ಪಟ್ಟು',
      slide2Stat2Lbl: 'ದೈನಂದಿನ ಹಾಲಿನ ಇಳುವರಿ ಹೆಚ್ಚಳ',
      slide2Stat3Val: '₹೦',
      slide2Stat3Lbl: 'ಯಾವುದೇ ದಲ್ಲಾಳಿ ಕಮಿಷನ್ ಇಲ್ಲ',
      slide2Stat4Val: '೧೫ ನಿಮಿಷ',
      slide2Stat4Lbl: 'ಪ್ರಾಥಮಿಕ ಸಾಲ ಮಂಜೂರಾತಿ',

      // Slide 3: Doorstep Digital Banking
      slide3Pill: 'ಆಧುನಿಕ ಫಿನ್‌ಟೆಕ್ • ತ್ವರಿತ ಯುಪಿಐ (UPI) ಮರುಪಾವತಿ',
      slide3Title1: 'ನಿಮ್ಮ ಮನೆಬಾಗಿಲಲ್ಲೇ ವೇಗದ, ಪಾರದರ್ಶಕ',
      slide3TitleAccent: 'ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್',
      slide3Desc: '೧೫ ನಿಮಿಷಗಳಲ್ಲಿ ಕಾಗದರಹಿತ ಬಯೋಮೆಟ್ರಿಕ್ ಸಾಲ ಅನುಮೋದನೆ, ಡೈನಾಮಿಕ್ ಕ್ಯೂಆರ್ ಕೋಡ್ ಮರುಪಾವತಿ ಮತ್ತು DPDP ಕಾಯ್ದೆ 2023 ರ ಸಂಪೂರ್ಣ ಅನುಸರಣೆ.',
      slide3Cta1: 'ಯುಪಿಐ (UPI) ಸಿಮ್ಯುಲೇಟರ್ ಬಳಸಿ',
      slide3Cta2: 'ವಿಡಿಯೋ & ಮಾಧ್ಯಮ ಗ್ಯಾಲರಿ ನೋಡಿ',
      slide3Stat1Val: '೩ ಸೆಕೆಂಡ್',
      slide3Stat1Lbl: 'ತತ್‌ಕ್ಷಣ ಯುಪಿಐ ಸೆಟಲ್‌ಮೆಂಟ್',
      slide3Stat2Val: '೧೦೦%',
      slide3Stat2Lbl: 'DPDP ಡೇಟಾ ರಕ್ಷಣೆ',
      slide3Stat3Val: '೦%',
      slide3Stat3Lbl: 'ಮುಂಗಡ ರದ್ದು ಶುಲ್ಕವಿಲ್ಲ',
      slide3Stat4Val: 'ಆರ್‌ಬಿಐ',
      slide3Stat4Lbl: 'ಡ್ಯುಯಲ್-ಕಂಟ್ರೋಲ್ ಆಡಳಿತ',

      productsSectionTitle: 'ಪ್ರಾಮಾಣಿಕ ಕಿರು ಸಾಲ ಸೌಲಭ್ಯಗಳು',
      productsSectionDesc: 'ಗ್ರಾಮೀಣ ಸಬಲೀಕರಣ ಮತ್ತು ಪಾರದರ್ಶಕ ಸಾಲ ವಿತರಣೆಗೆ ರೂಪಿಸಲಾದ ನಿಯಮಾವಳಿ ಆಧಾರಿತ ಕಿರು ಸಾಲ ಯೋಜನೆಗಳು.',
      ratePerAnnum: '% ವಾರ್ಷಿಕ ಬಡ್ಡಿ',
      maxSanction: 'ಗರಿಷ್ಠ ಮಿತಿ:',
      calcTitle: 'ಇಎಂಐ (EMI) ಕ್ಯಾಲ್ಕುಲೇಟರ್ & ಯುಪಿಐ ಪ್ರಕ್ರಿಯೆ',
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
      copyUpi: 'ಯುಪಿಐ ಐಡಿ ಕಾಪಿ ಮಾಡಿ',
      copiedUpi: 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!',
      trustTitle: 'ನಿಯಮಾವಳಿಗಳ ಕಟ್ಟುನಿಟ್ಟಾದ ಅನುಸರಣೆ & ಆಡಳಿತ',
      trustDesc: 'DPDP ಕಾಯ್ದೆ 2023 ರ ಅನ್ವಯ 100% ಭಾರತೀಯ ಸರ್ವರ್‌ಗಳಲ್ಲಿ ಡೇಟಾ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಡ್ಯುಯಲ್-ಕಂಟ್ರೋಲ್ ಪರಿಶೀಲನೆ.',
      applyPwa: 'ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳ ಮೂಲಕ ಮನೆಬಾಗಿಲಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',

      // Dedicated Gallery Teaser Section
      featuredStoryBadge: 'ನೈಜ ಯಶೋಗಾಥೆಗಳು & ಮಾಧ್ಯಮ',
      featuredStoryTitle: 'ಕ್ಷೇತ್ರದ ಅನುಭವಗಳು & ಯಶೋಗಾಥೆಗಳು',
      featuredStoryDesc: 'ಪ್ರಾಮಾಣಿಕ ಮನೆಬಾಗಿಲ ಸಾಲ ಸೌಲಭ್ಯದಿಂದ ಆರ್ಥಿಕ ಪ್ರಗತಿ ಸಾಧಿಸಿದ ಗ್ರಾಹಕರ ನೈಜ ಅನುಭವಗಳು.',
      exploreGalleryBtn: 'ಗ್ಯಾಲರಿಯಲ್ಲಿ ಎಲ್ಲಾ ವಿಡಿಯೋ ಸಂದರ್ಶನಗಳು & ಫೋಟೋ ಕಥೆಗಳನ್ನು ನೋಡಿ',
      featuredTag1: 'ಹೈನುಗಾರಿಕೆ ಯಶೋಗಾಥೆ',
      featuredTag2: 'ಸಣ್ಣ ವ್ಯಾಪಾರ ಪ್ರಗತಿ',
      featuredBorrower1: 'ಶ್ರೀಮತಿ ಲಕ್ಷ್ಮಿ ಗೌಡ',
      featuredVillage1: 'ಚನ್ನಪಟ್ಟಣ ತಾಲೂಕು, ರಾಮನಗರ',
      featuredQuote1: '“ದಲ್ಲಾಳಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಸಾಲ ಪಡೆದು ೨ ಸಂಕರ ತಳಿಯ ಹಸುಗಳನ್ನು ಖರೀದಿಸಿದೆ. ಈಗ ಪ್ರತಿ ತಿಂಗಳು ನಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ₹೩೮,೦೦೦ ನಿವ್ವಳ ಆದಾಯ ಸಿಗುತ್ತಿದೆ.”',
      featuredBorrower2: 'ಶ್ರೀ ಬಸವರಾಜ್ ಪಾಟೀಲ್',
      featuredVillage2: 'ಕುಣಿಗಲ್ ಪಟ್ಟಣ, ತುಮಕೂರು',
      featuredQuote2: '“ಸಗಟು ವಿತರಕರಿಗೆ ನೇರವಾಗಿ ಹಣ ಪಾವತಿಯಾಗಿದ್ದರಿಂದ ೧೫% ರಿಯಾಯಿತಿ ಸಿಕ್ಕಿತು. ಅಂಗಡಿಯಲ್ಲಿ ಯುಪಿಐ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಅಳವಡಿಸಿದ್ದು, ಗ್ರಾಹಕರು ಸುಲಭವಾಗಿ ಪಾವತಿಸುತ್ತಿದ್ದಾರೆ.”',

      investmentBannerBadge: 'ಹೊಸ ಗ್ರಾಮೀಣ ಸಂಪತ್ತು ಸೃಷ್ಟಿ ಯೋಜನೆ',
      investmentBannerTitle: 'ಸಾಲಗಾರರಿಂದ ಸಂಪತ್ತಿನ ಒಡೆಯರಾಗುವ ಸುವರ್ಣಾವಕಾಶ',
      investmentBannerDesc: 'ಮ್ಯೂಚುಯಲ್ ಫಂಡ್, ಆಕರ್ಷಕ ಫಿಕ್ಸೆಡ್ ಡೆಪಾಸಿಟ್ ಹಾಗೂ ಮನೆಬಾಗಿಲ ದೈನಂದಿನ ಪಿಗ್ಗಿ ಉಳಿತಾಯದ ಮೂಲಕ ಸುಭದ್ರ ಆರ್ಥಿಕ ಭವಿಷ್ಯ ನಿರ್ಮಿಸಿ.',
      btnExploreInvestments: 'ಹೂಡಿಕೆ & ದೈನಂದಿನ ಪಿಗ್ಗಿ ಯೋಜನೆಗಳು',
      btnWhatsappAdvisor: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ತಜ್ಞರ ಸಲಹೆ ಪಡೆಯಿರಿ',
      pillMf: 'SEBI & AMFI ನಿಯಂತ್ರಿತ ಕಿರು SIP',
      pillFd: 'ಶೇ ೮.೫೦ ವರೆಗೆ ಗರಿಷ್ಠ ಎಫ್‌ಡಿ ಬಡ್ಡಿ',
      pillPiggy: 'ಮನೆಬಾಗಿಲ ದೈನಂದಿನ ಪಿಗ್ಗಿ ಕಿರು ಉಳಿತಾಯ'
    }
  }[lang];

  // Carousel Slides Definitions
  const slides = [
    {
      id: 'slide-grassroots',
      pill: t.slide1Pill,
      title1: t.slide1Title1,
      titleAccent: t.slide1TitleAccent,
      desc: t.slide1Desc,
      cta1Text: t.slide1Cta1,
      cta1Href: '#calculator',
      cta1Icon: Calculator,
      cta2Text: t.slide1Cta2,
      cta2Href: '#products',
      cta2Icon: ArrowRight,
      bgGradient: 'from-orange-600 via-amber-600 to-orange-700',
      stats: [
        { val: t.slide1Stat1Val, lbl: t.slide1Stat1Lbl },
        { val: t.slide1Stat2Val, lbl: t.slide1Stat2Lbl },
        { val: t.slide1Stat3Val, lbl: t.slide1Stat3Lbl },
        { val: t.slide1Stat4Val, lbl: t.slide1Stat4Lbl }
      ]
    },
    {
      id: 'slide-women-dairy',
      pill: t.slide2Pill,
      title1: t.slide2Title1,
      titleAccent: t.slide2TitleAccent,
      desc: t.slide2Desc,
      cta1Text: t.slide2Cta1,
      cta1Href: '#products',
      cta1Icon: Milk,
      cta2Text: t.slide2Cta2,
      cta2Href: '/gallery',
      cta2Icon: Video,
      bgGradient: 'from-[#064e3b] via-[#062e1c] to-[#022c22]',
      stats: [
        { val: t.slide2Stat1Val, lbl: t.slide2Stat1Lbl },
        { val: t.slide2Stat2Val, lbl: t.slide2Stat2Lbl },
        { val: t.slide2Stat3Val, lbl: t.slide2Stat3Lbl },
        { val: t.slide2Stat4Val, lbl: t.slide2Stat4Lbl }
      ]
    },
    {
      id: 'slide-fintech',
      pill: t.slide3Pill,
      title1: t.slide3Title1,
      titleAccent: t.slide3TitleAccent,
      desc: t.slide3Desc,
      cta1Text: t.slide3Cta1,
      cta1Href: '#calculator',
      cta1Icon: QrCode,
      cta2Text: t.slide3Cta2,
      cta2Href: '/gallery',
      cta2Icon: ExternalLink,
      bgGradient: 'from-slate-900 via-emerald-950 to-slate-900',
      stats: [
        { val: t.slide3Stat1Val, lbl: t.slide3Stat1Lbl },
        { val: t.slide3Stat2Val, lbl: t.slide3Stat2Lbl },
        { val: t.slide3Stat3Val, lbl: t.slide3Stat3Lbl },
        { val: t.slide3Stat4Val, lbl: t.slide3Stat4Lbl }
      ]
    }
  ];

  const activeSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      {/* ======================================================== */}
      {/* 3. DYNAMIC INTERACTIVE HERO CAROUSEL */}
      {/* ======================================================== */}
      <section
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative bg-gradient-to-br ${activeSlideData.bgGradient} text-white pt-14 pb-16 sm:pb-20 px-4 sm:px-10 text-center border-b border-orange-800/40 shadow-inner overflow-hidden transition-colors duration-700 select-none`}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute -top-32 left-1/3 w-[600px] h-[400px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[350px] bg-amber-300/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-6">
          {/* Institutional Status Pill */}
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{activeSlideData.pill}</span>
          </div>

          {/* Main Headline: Confident, Harmonized Editorial Typography */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-tight drop-shadow-xs max-w-4xl mx-auto min-h-[90px] sm:min-h-[120px] flex items-center justify-center">
            <span>
              {activeSlideData.title1}{' '}
              <span className="text-amber-200 underline decoration-orange-400/50 decoration-wavy">
                {activeSlideData.titleAccent}
              </span>
            </span>
          </h1>

          {/* Subtitle: High-Contrast, Calm Institutional Prose */}
          <p className="text-amber-100/90 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal min-h-[48px]">
            {activeSlideData.desc}
          </p>

          {/* Interactive CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
            {activeSlideData.cta1Href.startsWith('#') ? (
              <a
                href={activeSlideData.cta1Href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white hover:bg-amber-50 active:scale-[0.98] text-orange-700 font-extrabold text-xs sm:text-sm rounded-full shadow-lg shadow-black/10 hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[46px]"
              >
                <activeSlideData.cta1Icon className="w-4 h-4 text-orange-700" />
                <span>{activeSlideData.cta1Text}</span>
              </a>
            ) : (
              <Link
                href={activeSlideData.cta1Href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white hover:bg-amber-50 active:scale-[0.98] text-orange-700 font-extrabold text-xs sm:text-sm rounded-full shadow-lg shadow-black/10 hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[46px]"
              >
                <activeSlideData.cta1Icon className="w-4 h-4 text-orange-700" />
                <span>{activeSlideData.cta1Text}</span>
              </Link>
            )}

            {activeSlideData.cta2Href.startsWith('#') ? (
              <a
                href={activeSlideData.cta2Href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white/90 hover:text-white font-bold text-xs sm:text-sm transition-colors group cursor-pointer min-h-[46px]"
              >
                <span>{activeSlideData.cta2Text}</span>
                <activeSlideData.cta2Icon className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <Link
                href={activeSlideData.cta2Href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white/90 hover:text-white font-bold text-xs sm:text-sm transition-colors group cursor-pointer min-h-[46px]"
              >
                <span>{activeSlideData.cta2Text}</span>
                <activeSlideData.cta2Icon className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {/* Unified Frosted Glass Metrics Bar for Active Slide */}
          <div className="pt-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-6 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/15 text-center">
              {activeSlideData.stats.map((s, idx) => (
                <div key={idx} className="space-y-1 pt-2 sm:pt-0">
                  <p className="text-xl sm:text-3xl font-black text-white font-mono tracking-tight">{s.val}</p>
                  <p className="text-[11px] text-amber-100/80 font-medium uppercase tracking-wider">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Slide Indicators & Chevron Navigation */}
          <div className="pt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
              aria-label="Previous Slide"
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-amber-300 shadow-xs' : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
              aria-label="Next Slide"
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. REGULATED CREDIT FACILITIES (GRID) */}
      {/* ======================================================== */}
      <section id="products" className="py-16 sm:py-20 px-4 sm:px-10 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full shadow-2xs">
            <Award className="w-3.5 h-3.5 text-orange-600" />
            <span>Fair Practices Code Aligned</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {t.productsSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {t.productsSectionDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BANK_PRODUCTS.map((prod) => {
            const Icon = prod.icon;
            const isSelected = selectedProduct === prod.id;

            return (
              <div
                key={prod.id}
                onClick={() => handleSelectProduct(prod)}
                className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden ${
                  isSelected
                    ? 'border-orange-500 shadow-xl ring-2 ring-orange-500/20 transform -translate-y-1'
                    : 'border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06),0_1px_3px_-1px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] hover:border-orange-300 hover:shadow-lg'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isSelected ? 'bg-orange-600 text-white shadow-md' : 'bg-orange-50 text-orange-600'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50/90 text-orange-800 border border-orange-200/90 ring-1 ring-inset ring-orange-500/10 px-2 py-0.5 rounded-full">
                      {prod.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-950 leading-snug">
                      {lang === 'kn' ? prod.titleKn : prod.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{prod.category}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Interest Rate</span>
                      <span className="font-black text-orange-600 font-mono">
                        {prod.interestRate}% {t.ratePerAnnum}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">{t.maxSanction}</span>
                      <span className="font-black text-slate-900 font-mono">
                        ₹{prod.maxAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Scheme Highlights
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
                      {(lang === 'kn' ? prod.featuresKn : prod.featuresEn).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
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

      {/* ======================================================== */}
      {/* 4.5. FEATURED FIELD STORIES & DEDICATED GALLERY TEASER */}
      {/* ======================================================== */}
      <section id="stories" className="py-16 sm:py-20 px-4 sm:px-10 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full shadow-2xs">
            <Video className="w-3.5 h-3.5 text-orange-600" />
            <span>{t.featuredStoryBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {t.featuredStoryTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {t.featuredStoryDesc}
          </p>
        </div>

        {/* Featured Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-400 transition-all p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full">
                  <Milk className="w-3 h-3 text-orange-600" />
                  <span>{t.featuredTag1}</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  ₹1,20,000 Sanctioned
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t.featuredBorrower1}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {t.featuredVillage1}
              </p>
              <blockquote className="text-xs text-slate-700 italic border-l-2 border-orange-500 pl-3 leading-relaxed">
                {t.featuredQuote1}
              </blockquote>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Milk yield rose from 15L to 35L/day
              </span>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                <span>Watch Story in Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-400 transition-all p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full">
                  <Store className="w-3 h-3 text-orange-600" />
                  <span>{t.featuredTag2}</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  ₹80,000 Sanctioned
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t.featuredBorrower2}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {t.featuredVillage2}
              </p>
              <blockquote className="text-xs text-slate-700 italic border-l-2 border-orange-500 pl-3 leading-relaxed">
                {t.featuredQuote2}
              </blockquote>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Inventory expanded 2.5x turnover
              </span>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                <span>Watch Story in Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Prominent Call to Action Banner to Dedicated Gallery */}
        <div className="bg-gradient-to-r from-[#064e3b] via-[#062e1c] to-[#022c22] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-800">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {lang === 'kn' ? 'ನಮ್ಮ ಎಲ್ಲಾ ಗ್ರಾಮೀಣ ಯಶೋಗಾಥೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'Discover All Rural Transformation Case Studies'}
            </h3>
            <p className="text-xs text-emerald-200 max-w-xl">
              {lang === 'kn'
                ? 'ವಿಡಿಯೋ ಸಂದರ್ಶನಗಳು, ಹೈನುಗಾರಿಕೆ ವರದಿಗಳು, ಮತ್ತು ಸ್ವಸಹಾಯ ಸಂಘಗಳ ಸಭೆಗಳ ಸಂಪೂರ್ಣ ಮಾಧ್ಯಮ ಗ್ಯಾಲರಿ.'
                : 'Watch unscripted borrower video case studies, village photo-essays, and women SHG community meetings.'}
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-6 py-3.5 rounded-xl shadow-lg transition-all shrink-0 min-h-[46px]"
          >
            <Video className="w-4 h-4" />
            <span>{t.exploreGalleryBtn} &rarr;</span>
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. INTERACTIVE EMI CALCULATOR SECTION */}
      {/* ======================================================== */}
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
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06),0_1px_3px_-1px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] space-y-6">
              {/* Slider 1: Loan Amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-900 font-extrabold">{t.sliderAmount}</label>
                  <span className="text-base sm:text-lg font-black text-slate-950 font-mono tabular-nums bg-slate-100/90 px-3 py-1 rounded-xl border border-slate-200/90 shadow-2xs">
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
                  className="w-full accent-orange-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold font-mono tabular-nums">
                  <span>₹10,000</span>
                  <span>₹1,00,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              {/* Slider 2: Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-900 font-extrabold">{t.sliderTenure}</label>
                  <span className="text-base sm:text-lg font-black text-slate-950 font-mono tabular-nums bg-slate-100/90 px-3 py-1 rounded-xl border border-slate-200/90 shadow-2xs">
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
                  className="w-full accent-orange-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold font-mono tabular-nums">
                  <span>6 Mo</span>
                  <span>18 Mo</span>
                  <span>36 Mo</span>
                </div>
              </div>

              {/* Slider 3: Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-900 font-extrabold">{t.sliderRate}</label>
                  <span className="text-base sm:text-lg font-black text-orange-600 font-mono tabular-nums bg-orange-50/90 px-3 py-1 rounded-xl border border-orange-200/90 shadow-2xs">
                    {interestRate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="10.0"
                  max="18.0"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-orange-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold font-mono tabular-nums">
                  <span>10.0%</span>
                  <span>14.0%</span>
                  <span>18.0%</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-0.5">
                  <p className="font-black">Zero Foreclosure Penalty Guarantee</p>
                  <p className="text-emerald-800 leading-relaxed font-normal">
                    Borrowers may settle their full principal at any time without punitive prepayment charges, under RBI Fair Practice Guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Calculation Display & UPI Simulator (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#064e3b] via-[#062e1c] to-[#022c22] p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-emerald-800/80 space-y-6 ring-1 ring-emerald-700/30">
              <div className="space-y-1 pb-4 border-b border-emerald-800">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">{t.emiHeading}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                    ₹{monthlyEmi.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">{t.perMonth}</span>
                </div>
              </div>

              {/* Progress Breakdown bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-emerald-200">
                  <span>Principal ({principalPercentage}%)</span>
                  <span>Interest ({100 - principalPercentage}%)</span>
                </div>
                <div className="w-full h-3 bg-emerald-950 rounded-full overflow-hidden flex border border-emerald-800">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${principalPercentage}%` }}
                  ></div>
                  <div
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${100 - principalPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Summary items */}
              <div className="space-y-3 text-xs pt-2">
                <div className="flex justify-between py-1.5 border-b border-emerald-900 font-medium">
                  <span className="text-emerald-200">{t.principalBreakdown}</span>
                  <span className="font-mono tabular-nums font-bold text-white">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-emerald-900 font-medium">
                  <span className="text-emerald-200">{t.interestBreakdown}</span>
                  <span className="font-mono tabular-nums font-bold text-amber-300">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-sm">
                  <span className="text-white">{t.totalPayable}</span>
                  <span className="font-mono tabular-nums font-black text-orange-400">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* NPCI Verified Merchant UPI Repayment Card (Published by Sysadmin) */}
              {(instConfig.enablePublicQr ?? true) ? (
                <div className="p-4 sm:p-5 bg-emerald-950/95 rounded-2xl border border-emerald-700/80 space-y-4 shadow-inner ring-1 ring-emerald-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200">
                        {t.qrTitle}
                      </span>
                    </div>
                    <span className="text-[9px] bg-emerald-800/80 text-emerald-100 font-bold px-2 py-0.5 rounded-full border border-emerald-600/50">
                      NPCI / BHIM UPI Verified
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Visual QR Card: Displays admin-uploaded merchant QR or high-res vector */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white p-2 rounded-2xl shrink-0 flex items-center justify-center border-2 border-white shadow-lg relative group">
                      {instConfig.qrImageUrl ? (
                        <img
                          src={instConfig.qrImageUrl}
                          alt="Official Collection QR"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center p-1 space-y-1">
                          <QrCode className="w-20 h-20 mx-auto text-emerald-950" />
                          <p className="text-[9px] font-mono font-bold text-slate-700">Scan to Pay</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                      <div>
                        <p className="text-xs font-black text-white truncate">
                          {instConfig.upiPayeeName || instConfig.organizationName || 'GGY Finance Ltd'}
                        </p>
                        <p className="text-[11px] text-emerald-200/90 font-medium">
                          {t.qrDesc}
                        </p>
                      </div>

                      {/* Clean VPA Badge + One-Click Copy */}
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        <span className="text-xs font-mono font-bold text-amber-300 bg-emerald-900/90 px-2.5 py-1 rounded-lg border border-emerald-700/80 truncate max-w-[200px]">
                          {instConfig.upiVpa || 'ggycollect@icici'}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-orange-600 hover:bg-orange-700 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>{t.copiedUpi}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{t.copyUpi}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[10px] text-emerald-300/80 font-medium pt-0.5">
                        {instConfig.collectionInstructions || 'Mention your Loan Account Number in remarks. Zero transaction charges.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[10px] text-emerald-300/80">
                    <span>Supported Apps: BHIM • PhonePe • GPay • Paytm</span>
                    <span className="font-bold text-emerald-200">Zero Foreclosure Fee</span>
                  </div>
                </div>
              ) : (
                /* When Admin disables public QR, show a clean doorstep assistance card */
                <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-800 space-y-2 text-white">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs font-extrabold text-white">Doorstep &amp; Branch Repayment Settle</p>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                    Repayments are collected directly at your village center by authorized Field Officers with biometric handheld devices and instant digital SMS receipts, or via our primary branch counter.
                  </p>
                </div>
              )}

              <Link
                href="/contact"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg transition-all min-h-[46px]"
              >
                <span>{t.applyPwa}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. RURAL WEALTH & WEALTH CREATOR CALL TO ACTION */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-10 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-[#064e3b] via-[#062e1c] to-[#022c22] rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-emerald-800 relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t.investmentBannerBadge}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {t.investmentBannerTitle}
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              {t.investmentBannerDesc}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-200 border border-emerald-700/80 px-3 py-1.5 rounded-xl text-xs font-bold">
                <PiggyBank className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.pillPiggy}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-200 border border-emerald-700/80 px-3 py-1.5 rounded-xl text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.pillMf}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-200 border border-emerald-700/80 px-3 py-1.5 rounded-xl text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                <span>{t.pillFd}</span>
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/investments"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all min-h-[46px]"
              >
                <span>{t.btnExploreInvestments}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/919845123450?text=${encodeURIComponent('Namaskara GGY Finance, I want information about Rural Investments, Micro-SIP, and Daily Piggy savings.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 font-bold text-xs px-6 py-3.5 rounded-xl transition-all min-h-[46px]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{t.btnWhatsappAdvisor}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. INSTITUTIONAL GOVERNANCE & RBI FOUR-EYES PILLARS */}
      {/* ======================================================== */}
      <section className="py-16 bg-[#FDFBF7] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-10 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full">
              <Lock className="w-3.5 h-3.5 text-orange-600" />
              <span>DPDP Act 2023 &amp; RBI Dual-Control Core</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {t.trustTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {t.trustDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06),0_1px_3px_-1px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] space-y-3 hover:-translate-y-0.5 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Masked Aadhaar Vault</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aadhaar numbers masked immediately at field capture (XXXX-XXXX-1234) with AES-256 envelope encryption.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06),0_1px_3px_-1px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] space-y-3 hover:-translate-y-0.5 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">RBI Maker-Checker</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Four-Eyes Principle enforced by system code. Field Officers cannot sanction or disburse loans they created.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06),0_1px_3px_-1px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] space-y-3 hover:-translate-y-0.5 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Dynamic UPI Repayments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant UPI auto-credit directly to borrower account balance with zero cash transit risk or reconciliation lag.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06),0_1px_3px_-1px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] space-y-3 hover:-translate-y-0.5 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Dedicated Redressal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Institutional branch outlets providing direct verification, doorstep service, and dedicated Nodal Grievance Redressal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
