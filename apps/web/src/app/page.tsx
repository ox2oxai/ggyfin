'use client';

import React, { useState, useEffect } from 'react';
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
  Check,
  Play,
  Video,
  X,
  Volume2,
  MessageCircle,
  PiggyBank
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

interface CustomerVideo {
  id: string;
  nameEn: string;
  nameKn: string;
  villageEn: string;
  villageKn: string;
  district: string;
  schemeEn: string;
  schemeKn: string;
  amount: string;
  metricEn: string;
  metricKn: string;
  duration: string;
  quoteEn: string;
  quoteKn: string;
  transcriptEn: string;
  transcriptKn: string;
  tagEn: string;
  tagKn: string;
}

const CUSTOMER_VIDEOS: CustomerVideo[] = [
  {
    id: 'vid-lakshmi',
    nameEn: 'Smt. Lakshmi Gowda',
    nameKn: 'ಶ್ರೀಮತಿ ಲಕ್ಷ್ಮಿ ಗೌಡ',
    villageEn: 'Channapatna Taluk',
    villageKn: 'ಚನ್ನಪಟ್ಟಣ ತಾಲೂಕು',
    district: 'Ramanagara',
    schemeEn: 'Dairy Development Term Loan',
    schemeKn: 'ಹೈನುಗಾರಿಕೆ ಅಭಿವೃದ್ಧಿ ಸಾಲ',
    amount: '₹1,20,000',
    metricEn: 'Daily milk yield rose from 15L to 35L',
    metricKn: 'ದೈನಂದಿನ ಹಾಲಿನ ಇಳುವರಿ ೧೫ ಲೀ ನಿಂದ ೩೫ ಲೀಟರ್‌ಗೆ ಏರಿಕೆ',
    duration: '2:45 min',
    quoteEn: '“With GGY’s doorstep UPI collection, I bought two HF crossbred cows without paying any broker commission. My family now earns ₹38,000 net profit every month.”',
    quoteKn: '“ದಲ್ಲಾಳಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಸಾಲ ಪಡೆದು ೨ ಸಂಕರ ತಳಿಯ ಹಸುಗಳನ್ನು ಖರೀದಿಸಿದೆ. ಈಗ ಪ್ರತಿ ತಿಂಗಳು ನಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ₹೩೮,೦೦೦ ನಿವ್ವಳ ಆದಾಯ ಸಿಗುತ್ತಿದೆ.”',
    transcriptEn: 'Lakshmi explains how she applied for the dairy loan through the GGY Field Officer in Channapatna. Approval took 15 minutes with masked Aadhaar, and repayment is deducted via weekly UPI directly from her milk cooperative payout.',
    transcriptKn: 'ಲಕ್ಷ್ಮಿಯವರು ಚನ್ನಪಟ್ಟಣದಲ್ಲಿ ಜಿಜಿವೈ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಯ ಮೂಲಕ ಸಾಲ ಪಡೆದ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳುತ್ತಾರೆ. ಆಧಾರ್ ಪರಿಶೀಲನೆಯೊಂದಿಗೆ ೧೫ ನಿಮಿಷಗಳಲ್ಲಿ ಅನುಮೋದನೆ ದೊರೆತಿದ್ದು, ಡೇರಿ ಹಾಲಿನ ಹಣದಿಂದಲೇ ಯುಪಿಐ ಮೂಲಕ ವಾರದ ಕಂತು ಪಾವತಿಸುತ್ತಿದ್ದಾರೆ.',
    tagEn: 'Dairy Transformation',
    tagKn: 'ಹೈನುಗಾರಿಕೆ ಯಶೋಗಾಥೆ'
  },
  {
    id: 'vid-basavaraj',
    nameEn: 'Sri Basavaraj Patil',
    nameKn: 'ಶ್ರೀ ಬಸವರಾಜ್ ಪಾಟೀಲ್',
    villageEn: 'Kunigal Town',
    villageKn: 'ಕುಣಿಗಲ್ ಪಟ್ಟಣ',
    district: 'Tumakuru',
    schemeEn: 'Kirana & Village Retail Capital',
    schemeKn: 'ಕಿರಾಣಿ & ಸಣ್ಣ ವ್ಯಾಪಾರ ಬಂಡವಾಳ',
    amount: '₹80,000',
    metricEn: 'Inventory expanded with 2.5x monthly turnover',
    metricKn: 'ದಿನಸಿ ಸರಕು ವಿಸ್ತರಣೆ ಮತ್ತು ೨.೫ ಪಟ್ಟು ವಹಿವಾಟು ಹೆಚ್ಚಳ',
    duration: '3:15 min',
    quoteEn: '“The wholesale FMCG supplier received direct payment from GGY at 0% processing fee. I installed a UPI soundbox and my customers pay digitally without hassle.”',
    quoteKn: '“ಸಗಟು ವಿತರಕರಿಗೆ ನೇರವಾಗಿ ಹಣ ಪಾವತಿಯಾಗಿದ್ದರಿಂದ ೧೫% ರಿಯಾಯಿತಿ ಸಿಕ್ಕಿತು. ಅಂಗಡಿಯಲ್ಲಿ ಯುಪಿಐ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಅಳವಡಿಸಿದ್ದು, ಗ್ರಾಹಕರು ಸುಲಭವಾಗಿ ಪಾವತಿಸುತ್ತಿದ್ದಾರೆ.”',
    transcriptEn: 'Basavaraj shares how eliminating local money lenders helped his grocery store stock seasonal FMCG items in bulk, increasing gross margins by 18%.',
    transcriptKn: 'ಸ್ಥಳೀಯ ಲೇವಾದೇವಿದಾರರ ದುಬಾರಿ ಬಡ್ಡಿಯನ್ನು ತಪ್ಪಿಸಿ, ನೇರ ಬಂಡವಾಳದ ಮೂಲಕ ದಿನಸಿ ಅಂಗಡಿಯನ್ನು ಆಧುನೀಕರಿಸಿ ಲಾಭ ಹೆಚ್ಚಿಸಿಕೊಂಡ ಬಗೆಯನ್ನು ಬಸವರಾಜ್ ವಿವರಿಸುತ್ತಾರೆ.',
    tagEn: 'Retail Enterprise',
    tagKn: 'ಸಣ್ಣ ವ್ಯಾಪಾರ ಪ್ರಗತಿ'
  },
  {
    id: 'vid-kavitha',
    nameEn: 'Smt. Kavitha Revanna',
    nameKn: 'ಶ್ರೀಮತಿ ಕವಿತಾ ರೇವಣ್ಣ',
    villageEn: 'Ramanagara Silk Cluster',
    villageKn: 'ರಾಮನಗರ ರೇಷ್ಮೆ ಕ್ಲಸ್ಟರ್',
    district: 'Ramanagara',
    schemeEn: 'Powerloom Artisan Credit',
    schemeKn: 'ನೇಯ್ಗೆ & ಕೈಮಗ್ಗ ಕುಶಲಕರ್ಮಿ ಸಾಲ',
    amount: '₹1,50,000',
    metricEn: 'Direct yarn procurement saved 14% raw material cost',
    metricKn: 'ನೇರ ರೇಷ್ಮೆ ನೂಲು ಖರೀದಿಯಿಂದ ೧೪% ಉಳಿತಾಯ',
    duration: '2:10 min',
    quoteEn: '“We eliminated predatory loan sharks. With GGY’s 14% reducing rate, we bought pure mulberry silk yarn directly from the Ramanagara Silk Exchange for the wedding season.”',
    quoteKn: '“ಖಾಸಗಿ ಲೇವಾದೇವಿದಾರರ ಹಾವಳಿ ತಪ್ಪಿತು. ಜಿಜಿವೈ ಸಾಲದಿಂದ ನೇರವಾಗಿ ರಾಮನಗರ ರೇಷ್ಮೆ ಮಾರುಕಟ್ಟೆಯಿಂದಲೇ ನೂಲು ಖರೀದಿಸಿ ಮದುವೆ ಸೀಸನ್‌ಗೆ ಸೀರೆಗಳನ್ನು ತಯಾರಿಸಿದ್ದೇವೆ.”',
    transcriptEn: 'Kavitha demonstrates how modern motorized jacquard looms doubled weaving speed while keeping debt service predictable with zero foreclosure penalty.',
    transcriptKn: 'ಕವಿತಾರವರು ಮಗ್ಗದ ಆಧುನೀಕರಣದಿಂದ ನೇಯ್ಗೆ ವೇಗ ದುಪ್ಪಟ್ಟಾಗಿದ್ದು, ಯಾವುದೇ ಮುಂಗಡ ರದ್ದು ಶುಲ್ಕವಿಲ್ಲದೆ ನೆಮ್ಮದಿಯಿಂದ ವ್ಯಾಪಾರ ಮಾಡುತ್ತಿರುವುದಾಗಿ ತಿಳಿಸುತ್ತಾರೆ.',
    tagEn: 'Artisan & Weaving',
    tagKn: 'ಕುಶಲಕರ್ಮಿ ಸಬಲೀಕರಣ'
  }
];

export default function HomePage() {
  const { lang } = useLanguage();
  const [loanAmount, setLoanAmount] = useState<number>(60000);
  const [tenure, setTenure] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(12.5);
  const [selectedProduct, setSelectedProduct] = useState<string>('prod-dairy');
  const [selectedVideo, setSelectedVideo] = useState<CustomerVideo | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };
    if (selectedVideo) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedVideo]);

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
      heroPill: 'Karnataka Micro-Lending Platform • Doorstep Financial Services',
      heroTitle1: 'Honest Micro Banking for',
      heroTitleAccent: 'Rural Bharat',
      heroDesc: 'Transparent reducing-balance micro-loans and accessible wealth creation for Karnataka’s village entrepreneurs, dairy farmers, and weavers.',
      btnCalculate: 'Calculate Monthly EMI',
      btnExplore: 'Explore Credit Facilities',
      statDisbursed: 'Disbursed Capital',
      statRepayment: 'Repayment Rate',
      statEmpowered: 'Families Served',
      statTurnaround: 'Doorstep Turnaround',
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
      trustTitle: 'Institutional Governance & Fair Practices',
      trustDesc: '100% Indian Data Sovereignty under DPDP Act 2023 with dual-control maker-checker validation.',
      applyPwa: 'Request Doorstep Application via Field Officer',
      videoSectionBadge: 'Customer Stories',
      videoSectionTitle: 'Voices from the Field',
      videoSectionDesc: 'Real experiences from Karnataka borrowers who expanded their livelihood through honest, doorstep credit.',
      watchVideo: 'Watch Story',
      playingPreview: 'Video Case Study Simulator',
      verifiedBorrower: 'Verified Borrower',
      loanSanctioned: 'Loan Sanctioned:',
      impactMetric: 'Key Transformation:',
      videoTranscript: 'Story Summary & Field Officer Notes',
      closeVideo: 'Close Video',
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
      heroPill: 'ಕರ್ನಾಟಕ ಗ್ರಾಮೀಣ ಕಿರು ಸಾಲ ಸೇವಾ ವೇದಿಕೆ • ಮನೆಬಾಗಿಲ ಸೇವೆ',
      heroTitle1: 'ಗ್ರಾಮೀಣ ಭಾರತದ ಬೆಳವಣಿಗೆಗೆ',
      heroTitleAccent: 'ಪ್ರಾಮಾಣಿಕ ಕಿರು ಬ್ಯಾಂಕಿಂಗ್',
      heroDesc: 'ಗ್ರಾಮೀಣ ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು, ಹೈನುಗಾರಿಕೆ ಕುಟುಂಬಗಳು ಮತ್ತು ನೇಕಾರರಿಗೆ ನೇರ ಮನೆಬಾಗಿಲ ಸಾಲ ಸೌಲಭ್ಯ ಹಾಗೂ ಸುಲಭ ಸಂಪತ್ತು ಸೃಷ್ಟಿ.',
      btnCalculate: 'ನಿಮ್ಮ ಇಎಂಐ (EMI) ಲೆಕ್ಕಹಾಕಿ',
      btnExplore: 'ಸಾಲ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ',
      statDisbursed: 'ಒಟ್ಟು ಸಾಲ ವಿತರಣೆ',
      statRepayment: 'ಮರುಪಾವತಿ ದರ',
      statEmpowered: 'ಸಬಲೀಕರಣಗೊಂಡ ಕುಟುಂಬಗಳು',
      statTurnaround: 'ಮನೆಬಾಗಿಲ ಪರಿಶೀಲನೆ ವೇಗ',
      productsSectionTitle: 'ಪ್ರಾಮಾಣಿಕ ಕಿರು ಸಾಲ ಸೌಲಭ್ಯಗಳು',
      productsSectionDesc: 'ಗ್ರಾಮೀಣ ಸಬಲೀಕರಣ ಮತ್ತು ಪಾರದರ್ಶಕ ಸಾಲ ವಿತರಣೆಗೆ ರೂಪಿಸಲಾದ ಕರ್ನಾಟಕ ರಾಜ್ಯ ನಿಯಮಾವಳಿ ಆಧಾರಿತ ಕಿರು ಸಾಲ ಯೋಜನೆಗಳು.',
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
      trustTitle: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ನಿಯಮಾವಳಿಗಳ ಕಟ್ಟುನಿಟ್ಟಾದ ಅನುಸರಣೆ',
      trustDesc: 'DPDP ಕಾಯ್ದೆ 2023 ರ ಅನ್ವಯ 100% ಭಾರತೀಯ ಸರ್ವರ್‌ಗಳಲ್ಲಿ ಡೇಟಾ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಡ್ಯುಯಲ್-ಕಂಟ್ರೋಲ್ ಪರಿಶೀಲನೆ.',
      applyPwa: 'ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳ ಮೂಲಕ ಮನೆಬಾಗಿಲಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
      videoSectionBadge: 'ನೈಜ ಪ್ರಗತಿ ಕಥೆಗಳು',
      videoSectionTitle: 'ಕ್ಷೇತ್ರದ ಅನುಭವಗಳು & ಯಶೋಗಾಥೆಗಳು',
      videoSectionDesc: 'ಪ್ರಾಮಾಣಿಕ ಮನೆಬಾಗಿಲ ಸಾಲ ಸೌಲಭ್ಯದಿಂದ ಆರ್ಥಿಕ ಪ್ರಗತಿ ಸಾಧಿಸಿದ ಕರ್ನಾಟಕದ ಗ್ರಾಹಕರ ಅನುಭವಗಳು.',
      watchVideo: 'ವಿಡಿಯೋ ವೀಕ್ಷಿಸಿ',
      playingPreview: 'ವೀಡಿಯೊ ಕೇಸ್ ಸ್ಟಡಿ ಸಿಮ್ಯುಲೇಟರ್',
      verifiedBorrower: 'ದೃಢೀಕೃತ ಗ್ರಾಹಕರು',
      loanSanctioned: 'ಮಂಜೂರಾದ ಸಾಲ:',
      impactMetric: 'ಪ್ರಮುಖ ಬದಲಾವಣೆ:',
      videoTranscript: 'ಕಥೆಯ ಮುಖ್ಯಾಂಶಗಳು & ಕ್ಷೇತ್ರಾಧಿಕಾರಿ ಟಿಪ್ಪಣಿ',
      closeVideo: 'ಮುಚ್ಚಿ',
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

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      {/* 3. HERO SECTION: SLEEK, CONTEMPORARY ROYAL SAFFRON */}
      <section className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white pt-16 pb-20 px-4 sm:px-10 text-center border-b border-orange-800 shadow-inner overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute -top-32 left-1/3 w-[600px] h-[400px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[350px] bg-amber-300/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          {/* Institutional Status Pill */}
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 backdrop-blur-md px-4 py-1 rounded-full text-xs font-semibold text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>{t.heroPill}</span>
          </div>

          {/* Main Headline: Confident, Editorial-Grade Typography */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-tight drop-shadow-sm">
            {t.heroTitle1}{' '}
            <span className="text-amber-200">
              {t.heroTitleAccent}
            </span>
          </h1>

          {/* Subtitle: High-Contrast, Calm Institutional Prose */}
          <p className="text-amber-100/90 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal">
            {t.heroDesc}
          </p>

          {/* Modern Action Group: Minimalist Action Capsule + Inline Explorer Link */}
          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="#calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white hover:bg-amber-50 active:scale-[0.98] text-orange-700 font-extrabold text-sm rounded-full shadow-lg shadow-black/10 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Calculator className="w-4 h-4 text-orange-700" />
              <span>{t.btnCalculate}</span>
            </a>

            <a
              href="#products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 text-white/90 hover:text-white font-bold text-sm transition-colors group"
            >
              <span>{t.btnExplore}</span>
              <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Unified Frosted Glass Metrics Bar */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-7 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/15 text-center">
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">₹48.5 Cr+</p>
                <p className="text-xs text-amber-100/80 font-medium uppercase tracking-wider">{t.statDisbursed}</p>
              </div>

              <div className="space-y-1 pt-4 sm:pt-0">
                <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">98.9%</p>
                <p className="text-xs text-amber-100/80 font-medium uppercase tracking-wider">{t.statRepayment}</p>
              </div>

              <div className="space-y-1 pt-4 sm:pt-0">
                <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">42,000+</p>
                <p className="text-xs text-amber-100/80 font-medium uppercase tracking-wider">{t.statEmpowered}</p>
              </div>

              <div className="space-y-1 pt-4 sm:pt-0">
                <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">15-Min</p>
                <p className="text-xs text-amber-100/80 font-medium uppercase tracking-wider">{t.statTurnaround}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS SECTION: Saffron & White Dominant with Subtle Green */}
      <section id="products" className="py-16 sm:py-20 px-4 sm:px-10 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full shadow-2xs">
            <Award className="w-3.5 h-3.5 text-orange-600" />
            <span>Doorstep Micro-Credit Schemes</span>
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

      {/* 4.5. CUSTOMER VIDEO SHOWCASE: REAL RURAL TRANSFORMATION STORIES */}
      <section id="stories" className="py-16 sm:py-20 px-4 sm:px-10 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full shadow-2xs">
            <Video className="w-3.5 h-3.5 text-orange-600" />
            <span>{t.videoSectionBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {t.videoSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {t.videoSectionDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_VIDEOS.map((vid) => {
            return (
              <div
                key={vid.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-400 transition-all flex flex-col justify-between group"
              >
                {/* Simulated Video Player Thumbnail */}
                <div
                  onClick={() => {
                    setSelectedVideo(vid);
                    setIsVideoPlaying(true);
                  }}
                  className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  {/* Visual Ambient Glow */}
                  <div className="absolute inset-0 bg-radial from-orange-500/20 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2.5 py-0.5 rounded-full shadow-md">
                      {lang === 'kn' ? vid.tagKn : vid.tagEn}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-black/60 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded-md border border-white/10">
                      {vid.duration}
                    </span>
                  </div>

                  {/* Pulsing Play Button */}
                  <div className="w-14 h-14 rounded-full bg-orange-600 group-hover:bg-orange-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform z-10">
                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                  </div>

                  {/* Bottom Video Banner */}
                  <div className="absolute bottom-2 left-3 right-3 text-left z-10">
                    <p className="text-[11px] font-bold text-white/90 truncate">
                      {lang === 'kn' ? vid.nameKn : vid.nameEn} • {vid.district}
                    </p>
                  </div>
                </div>

                {/* Card Content & Testimonial Quote */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-black text-slate-950 flex items-center gap-1.5">
                          <span>{lang === 'kn' ? vid.nameKn : vid.nameEn}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 inline shrink-0" />
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold">
                          {lang === 'kn' ? vid.villageKn : vid.villageEn}, {vid.district}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sanctioned</span>
                        <span className="text-xs font-black text-orange-600 font-mono bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                          {vid.amount}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-[11px] font-bold text-emerald-900 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{lang === 'kn' ? vid.metricKn : vid.metricEn}</span>
                    </div>

                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      {lang === 'kn' ? vid.quoteKn : vid.quoteEn}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedVideo(vid);
                      setIsVideoPlaying(true);
                    }}
                    className="w-full mt-2 py-2.5 px-4 bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all border border-orange-200 group-hover:border-orange-600"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t.watchVideo}</span>
                  </button>
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
                    className="bg-[#064e3b] h-full transition-all duration-300"
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

      {/* 5.5. RURAL WEALTH & INVESTMENTS SPOTLIGHT BANNER */}
      <section id="wealth-initiative" className="py-12 px-4 sm:px-10 max-w-6xl mx-auto">
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden border border-orange-800">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black text-white border border-white/30 shadow-xs">
              <PiggyBank className="w-4 h-4 text-amber-200" />
              <span>{t.investmentBannerBadge}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {t.investmentBannerTitle}
            </h2>

            <p className="text-amber-50 text-sm sm:text-base leading-relaxed font-medium">
              {t.investmentBannerDesc}
            </p>

            {/* 3 Feature Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1 text-xs font-bold text-white/90">
              <span className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.pillMf}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.pillFd}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.pillPiggy}</span>
              </span>
            </div>

            {/* CTAs: White button for primary action + Forest green button for WhatsApp */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3.5">
              <Link
                href="/investments"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-amber-50 active:scale-[0.98] text-orange-700 font-black text-sm rounded-xl shadow-xl transition-all"
              >
                <TrendingUp className="w-4 h-4 text-orange-700" />
                <span>{t.btnExploreInvestments}</span>
                <ArrowRight className="w-4 h-4 text-orange-700" />
              </Link>

              <a
                href={`https://wa.me/919845123450?text=${encodeURIComponent('Namaskara, I want information regarding Rural Mutual Funds, Fixed Deposits, and Daily Piggy savings.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#064e3b] hover:bg-[#043e2f] active:scale-[0.98] text-white font-extrabold text-sm rounded-xl shadow-lg border border-emerald-500/50 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>{t.btnWhatsappAdvisor}</span>
              </a>
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
                Karnataka Micro-Lending Framework
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                {t.trustTitle}
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3.5 py-1.5 rounded-full border border-emerald-200 text-xs font-bold">
              <BadgeCheck className="w-4 h-4 text-emerald-700" />
              <span>Registered State Micro-Lending Platform</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700 leading-relaxed">
            <div className="space-y-1.5">
              <p className="font-black text-sm text-slate-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Dual-Control Maker-Checker</span>
              </p>
              <p>Every credit request is originated by a Field Maker and independently verified by a Checker Authorizer. Complete internal dual-control compliance.</p>
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

      {/* 7. INTERACTIVE VIDEO PLAYER SIMULATOR MODAL */}
      {selectedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  {t.playingPreview}
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                <span className="text-xs text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-xs">
                  {lang === 'kn' ? selectedVideo.nameKn : selectedVideo.nameEn} ({selectedVideo.district})
                </span>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                aria-label={t.closeVideo}
                className="w-8 h-8 rounded-full bg-slate-700/80 hover:bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Screen Simulation */}
            <div className="relative aspect-video bg-black flex flex-col justify-between p-4 overflow-hidden select-none">
              {/* Camera Lens Flare / Ambient Lighting */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none"></div>

              {/* Top Watermark */}
              <div className="relative z-10 flex justify-between items-center text-[10px] text-white/70 font-mono">
                <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                  GGY Ground Reality Case Study • {selectedVideo.district}
                </span>
                <span className="bg-red-600/90 text-white font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  HD
                </span>
              </div>

              {/* Center Play/Pause Overlay Toggle */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="w-16 h-16 rounded-full bg-orange-600/90 hover:bg-orange-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 border border-white/20 cursor-pointer"
                >
                  <Play className={`w-7 h-7 ml-0.5 fill-current ${isVideoPlaying ? 'opacity-80' : 'opacity-100'}`} />
                </button>
                <p className="text-[11px] text-slate-300 mt-2 font-mono bg-black/60 px-2.5 py-0.5 rounded-md">
                  {isVideoPlaying ? 'Playing case study audio' : 'Paused'}
                </p>
              </div>

              {/* Bottom Video Progress Scrub Bar & Controls */}
              <div className="relative z-10 space-y-2">
                {/* Scrub line */}
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden flex">
                  <div className={`h-full bg-orange-500 rounded-full transition-all duration-300 ${isVideoPlaying ? 'w-2/3 animate-pulse' : 'w-1/3'}`}></div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="hover:text-white font-bold cursor-pointer"
                    >
                      {isVideoPlaying ? 'Pause' : 'Play'}
                    </button>
                    <span className="text-[11px] text-slate-400">01:18 / {selectedVideo.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-slate-300" />
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60 hidden sm:inline">
                      Kannada + English Subtitles
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body: Borrower Profile & Transcripts */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs bg-slate-900">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-black text-white flex items-center gap-1.5">
                    <span>{lang === 'kn' ? selectedVideo.nameKn : selectedVideo.nameEn}</span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 px-2 py-0.5 rounded-full">
                      {t.verifiedBorrower}
                    </span>
                  </h4>
                  <p className="text-slate-400 text-xs">
                    {lang === 'kn' ? selectedVideo.villageKn : selectedVideo.villageEn}, {selectedVideo.district}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">{t.loanSanctioned}</span>
                  <span className="text-base font-black text-orange-400 font-mono">{selectedVideo.amount}</span>
                </div>
              </div>

              {/* Quote bubble */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                <p className="text-amber-200 font-bold text-xs italic leading-relaxed">
                  {lang === 'kn' ? selectedVideo.quoteKn : selectedVideo.quoteEn}
                </p>
              </div>

              {/* Story Summary / Transcript */}
              <div className="space-y-1">
                <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px]">
                  {t.videoTranscript}
                </p>
                <p className="text-slate-300 leading-relaxed font-normal">
                  {lang === 'kn' ? selectedVideo.transcriptKn : selectedVideo.transcriptEn}
                </p>
              </div>

              {/* Modal CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/contact"
                  onClick={() => setSelectedVideo(null)}
                  className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black text-center transition-colors shadow-md"
                >
                  Apply for Doorstep Loan &rarr;
                </Link>
                <a
                  href={`https://wa.me/919845123450?text=${encodeURIComponent(`Namaskara, I watched the case study of ${selectedVideo.nameEn} and want loan details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-extrabold flex items-center justify-center gap-1.5 transition-colors border border-emerald-600"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
}
