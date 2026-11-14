'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import {
  TrendingUp,
  ShieldCheck,
  PiggyBank,
  Calculator,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  MessageCircle,
  FileCheck2,
  Award,
  Calendar,
  Lock,
  Percent,
  Sparkles,
  Users2,
  Coins,
  Wallet
} from 'lucide-react';

export default function InvestmentsPage() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'mf' | 'fd' | 'piggy'>('mf');

  // SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState<number>(500);
  const [sipYears, setSipYears] = useState<number>(5);
  const [sipRate, setSipRate] = useState<number>(12);

  // FD Calculator State
  const [fdAmount, setFdAmount] = useState<number>(50000);
  const [fdTenureMonths, setFdTenureMonths] = useState<number>(36);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);

  // Daily Piggy Calculator State
  const [piggyDaily, setPiggyDaily] = useState<number>(50);
  const [piggyDays, setPiggyDays] = useState<number>(90);
  const piggyRate = 6.0;

  // Callback Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientTaluk, setClientTaluk] = useState('Channapatna');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculate SIP Returns (with zero-division edge case guard)
  const totalMonths = sipYears * 12;
  const monthlyRate = sipRate / 12 / 100;
  const totalInvestedSip = sipMonthly * totalMonths;
  const estimatedWealthSip =
    monthlyRate > 0
      ? Math.round(
          sipMonthly * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))
        )
      : totalInvestedSip;
  const estimatedGainsSip = Math.max(0, estimatedWealthSip - totalInvestedSip);

  // Calculate FD Returns
  const baseFdRate = fdTenureMonths >= 36 ? 8.5 : fdTenureMonths >= 24 ? 8.0 : 7.5;
  const effectiveFdRate = isSeniorCitizen ? baseFdRate + 0.5 : baseFdRate;
  const fdInterest = Math.round(fdAmount * (effectiveFdRate / 100) * (fdTenureMonths / 12));
  const fdMaturityAmount = fdAmount + fdInterest;

  // Calculate Daily Piggy Returns
  const piggyTotalInvested = piggyDaily * piggyDays;
  const piggyInterest = Math.round(piggyTotalInvested * (piggyRate / 100) * (piggyDays / 365) / 2);
  const piggyMaturity = piggyTotalInvested + piggyInterest;
  const potentialLoanInterestSaved = Math.round(piggyTotalInvested * 0.13 * (piggyDays / 365));

  const t = {
    en: {
      badge: 'Rural Wealth Initiative',
      title: 'Rural Wealth & Investments',
      subtitle: 'Simple, disciplined wealth generation through SEBI-regulated micro-SIPs, high-yield fixed deposits, and doorstep Daily Piggy savings.',
      tabMf: 'Micro-SIP',
      tabFd: 'Fixed Deposits',
      tabPiggy: 'Daily Piggy Deposit',
      whatIsMfTitle: 'What is a Mutual Fund? (Village Cooperative Analogy)',
      whatIsMfDesc: 'Think of a Mutual Fund like a Village Milk Dairy Cooperative (ಹಾಲಿನ ಡೇರಿ ಸಹಕಾರ ಸಂಘ). Individual dairy farmers bring their milk together into one common bulk chiller to get the best wholesale rate from the federation. Similarly, in a Mutual Fund, thousands of small savers pool their savings (as low as ₹250 or ₹500/month), and professional SEBI-certified fund managers invest that collective pool across India’s top 100 diversified, high-growth enterprise leaders. You earn compounding returns without needing individual stock market expertise.',
      mfBenefit1Title: 'Start with just ₹250 / Month',
      mfBenefit1Desc: 'Micro-SIP via PhonePe, GPay, or Paytm UPI AutoPay. No visits to the branch required.',
      mfBenefit2Title: 'Beats Inflation & Gold',
      mfBenefit2Desc: 'Historical 11% to 14% returns over 5+ years help fund children’s college degrees and daughter’s marriage.',
      mfBenefit3Title: '100% Regulated by SEBI & AMFI',
      mfBenefit3Desc: 'Safe, transparent digital accounts with instant withdrawal back into your bank account anytime.',
      sipCalcTitle: 'Micro-SIP Growth Simulator',
      sipCalcSubtitle: 'See how modest monthly savings compound into a powerful family asset over time.',
      monthlyInvestment: 'Monthly Savings Amount',
      investmentPeriod: 'Time Horizon (Years)',
      expectedReturn: 'Expected Annual Return (CAGR)',
      totalInvested: 'Total Amount Invested',
      wealthGain: 'Estimated Wealth Generated',
      totalMaturity: 'Total Future Wealth Value',
      fdTitle: 'Fixed Deposits',
      fdSubtitle: 'Earn guaranteed annual returns up to 8.50% (8.75% for Senior Citizens) backed by institutional partner deposit institutions.',
      fdAmountLabel: 'Deposit Principal Amount',
      fdTenureLabel: 'Deposit Tenure (Months)',
      seniorCitizenCheck: 'Senior Citizen Investor (Age 60+ adds +0.50% interest bonus)',
      fdMaturityLabel: 'Guaranteed Maturity Value',
      fdInterestLabel: 'Total Interest Earned',
      fdRateLabel: 'Effective Annual Rate',
      piggyHeading: 'Daily Piggy Deposit (Doorstep Micro-Savings)',
      piggySubtitle: 'A daily micro-savings scheme collected right at your doorstep. Built for borrowers to build emergency savings and seamlessly prepay loan installments.',
      piggyBenefit1Title: 'Doorstep Daily Collection',
      piggyBenefit1Desc: 'Our field executive visits your shop or house daily to collect ₹20, ₹50, or ₹100. Instant digital SMS & WhatsApp receipts for every rupee.',
      piggyBenefit2Title: 'Prepay Loans & Save Interest',
      piggyBenefit2Desc: 'Borrowers can auto-apply their accumulated Piggy balance to prepay their loan principal or pay upcoming EMIs with zero penalty.',
      piggyBenefit3Title: '6.00% Annual Interest Return',
      piggyBenefit3Desc: 'Earns 6.00% p.a. interest, far higher than regular bank savings accounts, compounding on your daily collected balance.',
      piggyCalcTitle: 'Daily Piggy Savings & Prepayment Simulator',
      piggyCalcSubtitle: 'Calculate how small daily change builds into a powerful shield against debt.',
      dailyDepositLabel: 'Daily Savings Amount',
      piggyDaysLabel: 'Collection Duration (Days)',
      piggyPrincipalSaved: 'Total Daily Savings Collected',
      piggyInterestEarned: 'Accrued Interest (+6.00% p.a.)',
      piggyTotalFund: 'Total Piggy Fund Available',
      piggyPrepayBonus: 'Prepayment Advantage',
      piggyPrepayDesc: 'Using this fund to prepay your active loan principal saves an estimated ₹',
      piggyPrepaySuffix: ' in loan interest charges!',
      formTitle: 'Request an Advisory Callback',
      formSubtitle: 'Our certified Wealth Relationship Officer will contact you on WhatsApp or visit your local village hub.',
      formName: 'Your Full Name',
      formPhone: 'Mobile Phone Number',
      formTaluk: 'Taluk / Village Location',
      formBtn: 'Request Callback & Advisory',
      formSuccess: 'Thank you! Your inquiry reference is TKT-MF-2026. A Relationship Officer will call you within 4 hours.',
      chatWhatsapp: 'Chat Directly on WhatsApp'
    },
    kn: {
      badge: 'ಗ್ರಾಮೀಣ ಸಂಪತ್ತು ಸೃಷ್ಟಿ ಉಪಕ್ರಮ',
      title: 'ಗ್ರಾಮೀಣ ಹೂಡಿಕೆ ಮತ್ತು ಸಂಪತ್ತು',
      subtitle: 'ಕುಟುಂಬದ ಆರ್ಥಿಕ ಭದ್ರತೆಗಾಗಿ ನಿಯಂತ್ರಿತ ಮ್ಯೂಚುಯಲ್ ಫಂಡ್, ಸುರಕ್ಷಿತ ಫಿಕ್ಸೆಡ್ ಡೆಪಾಸಿಟ್ ಹಾಗೂ ಮನೆಬಾಗಿಲ ದೈನಂದಿನ ಪಿಗ್ಗಿ ಉಳಿತಾಯ.',
      tabMf: 'ಕಿರು ಎಸ್‌ಐಪಿ (Micro-SIP)',
      tabFd: 'ಫಿಕ್ಸೆಡ್ ಡೆಪಾಸಿಟ್ (FD)',
      tabPiggy: 'ದೈನಂದಿನ ಪಿಗ್ಗಿ (Piggy)',
      whatIsMfTitle: 'ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ ಎಂದರೇನು? (ಹಾಲಿನ ಡೇರಿಯ ಸರಳ ಉದಾಹರಣೆ)',
      whatIsMfDesc: 'ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ ಎಂದರೆ ನಮ್ಮ ಊರಿನ ಹಾಲಿನ ಡೇರಿ ಸಹಕಾರ ಸಂಘದಂತೆ. ಪ್ರತಿಯೊಬ್ಬ ರೈತರು ತಲಾ ಹಾಲು ತಂದು ಒಟ್ಟಾಗಿ ಸೇರಿಸಿ ಉತ್ತಮ ಸಗಟು ದರ ಪಡೆಯುವಂತೆ, ಇಲ್ಲಿ ಸಾವಿರಾರು ಕುಟುಂಬಗಳು ತಿಂಗಳಿಗೆ ₹250 ಅಥವಾ ₹500 ರಂತೆ ಒಗ್ಗೂಡಿಸುತ್ತಾರೆ. ಪರಿಣತ ಆರ್ಥಿಕ ತಜ್ಞರು ಈ ಹಣವನ್ನು ಭಾರತದ ಬಲಿಷ್ಠ, ಉನ್ನತ ಉದ್ಯಮಗಳಲ್ಲಿ ವೈವಿಧ್ಯಮಯವಾಗಿ ಹೂಡಿಕೆ ಮಾಡಿ ಉತ್ತಮ ಬೆಳವಣಿಗೆಯನ್ನು ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ತಂದುಕೊಡುತ್ತಾರೆ.',
      mfBenefit1Title: 'ಕೇವಲ ₹250 ರಿಂದ ಆರಂಭಿಸಿ',
      mfBenefit1Desc: 'PhonePe, GPay ಮೂಲಕ ಸುಲಭ ಮಾಸಿಕ ಆಟೋಪೇ. ಬ್ಯಾಂಕ್ ಅಲೆಯುವ ಅಗತ್ಯವಿಲ್ಲ.',
      mfBenefit2Title: 'ಚಿನ್ನಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ದೀರ್ಘಕಾಲಿಕ ಬೆಳವಣಿಗೆ',
      mfBenefit2Desc: 'ಮಕ್ಕಳ ಉನ್ನತ ಶಿಕ್ಷಣ ಹಾಗೂ ಮಗಳ ವಿವಾಹಕ್ಕೆ 5-10 ವರ್ಷಗಳಲ್ಲಿ ಬಲವಾದ ನಿಧಿ ಸೃಷ್ಟಿ.',
      mfBenefit3Title: 'ಸೆಬಿ (SEBI) ಮತ್ತು ಭಾರತ ಸರ್ಕಾರದಿಂದ ನಿಯಂತ್ರಿತ',
      mfBenefit3Desc: 'ಸಂಪೂರ್ಣ ಪಾರದರ್ಶಕತೆ ಹಾಗೂ ತುರ್ತು ಸಮಯದಲ್ಲಿ ಯಾವುದೇ ಕ್ಷಣದಲ್ಲೂ ಹಣವನ್ನು ಮರಳಿ ಪಡೆಯುವ ಸೌಲಭ್ಯ.',
      sipCalcTitle: 'ಸಣ್ಣ ಮಾಸಿಕ ಉಳಿತಾಯದ ಲೆಕ್ಕಾಚಾರ (SIP Calculator)',
      sipCalcSubtitle: 'ತಿಂಗಳಿಗೆ ಸಣ್ಣ ಮೊತ್ತವನ್ನು ಉಳಿಸಿದರೆ ಮುಂದಿನ ವರ್ಷಗಳಲ್ಲಿ ಎಷ್ಟು ದೊಡ್ಡ ಮೊತ್ತವಾಗುತ್ತದೆ ನೋಡಿ.',
      monthlyInvestment: 'ತಿಂಗಳ ಉಳಿತಾಯ ಮೊತ್ತ',
      investmentPeriod: 'ಹೂಡಿಕೆಯ ಅವಧಿ (ವರ್ಷಗಳಲ್ಲಿ)',
      expectedReturn: 'ಅಂದಾಜು ವಾರ್ಷಿಕ ಬೆಳವಣಿಗೆ ದರ',
      totalInvested: 'ನೀವು ಹೂಡಿದ ಒಟ್ಟು ಅಸಲು',
      wealthGain: 'ಬೆಳೆದ ಒಟ್ಟು ಬಡ್ಡಿ/ಲಾಭ',
      totalMaturity: 'ಭವಿಷ್ಯದಲ್ಲಿ ನಿಮಗೆ ಸಿಗುವ ಒಟ್ಟು ಮೊತ್ತ',
      fdTitle: 'ಫಿಕ್ಸೆಡ್ ಡೆಪಾಸಿಟ್ (Fixed Deposits)',
      fdSubtitle: 'ವಾರ್ಷಿಕ 8.50% ವರೆಗೆ ಗ್ಯಾರಂಟಿ ಬಡ್ಡಿ (ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ 8.75%). ಪಾಲುದಾರ ಬ್ಯಾಂಕಿಂಗ್ ಸಂಸ್ಥೆಗಳ ಸುರಕ್ಷತೆಯೊಂದಿಗೆ ಗ್ಯಾರಂಟಿ ಬಡ್ಡಿ.',
      fdAmountLabel: 'ಡೆಪಾಸಿಟ್ ಮೊತ್ತ (ಅಸಲು)',
      fdTenureLabel: 'ಅವಧಿ (ತಿಂಗಳುಗಳಲ್ಲಿ)',
      seniorCitizenCheck: 'ಹಿರಿಯ ನಾಗರಿಕರು (ವಯಸ್ಸು 60+ ಆದವರಿಗೆ ಹೆಚ್ಚುವರಿ +0.50% ಬಡ್ಡಿ)',
      fdMaturityLabel: 'ಅವಧಿ ಮುಗಿದಾಗ ಸಿಗುವ ಒಟ್ಟು ಮೊತ್ತ',
      fdInterestLabel: 'ಗಳಿಸಿದ ಒಟ್ಟು ಬಡ್ಡಿ',
      fdRateLabel: 'ವಾರ್ಷಿಕ ಬಡ್ಡಿದರ',
      piggyHeading: 'ದೈನಂದಿನ ಪಿಗ್ಗಿ ಕಿರು ಉಳಿತಾಯ ಯೋಜನೆ',
      piggySubtitle: 'ಮನೆಬಾಗಿಲಿಗೆ ಬಂದು ದಿನವೂ ಸಂಗ್ರಹಿಸುವ ಸಣ್ಣ ಉಳಿತಾಯ. ಸಾಲ ಪಡೆದ ಗ್ರಾಹಕರಿಗೆ ಸಾಲದ ಕಂತುಗಳನ್ನು ಸುಲಭವಾಗಿ ಮುಂಗಡ ಪಾವತಿಸಲು ಮತ್ತು ಬಡ್ಡಿ ಉಳಿಸಲು ವಿಶೇಷ ಸೌಲಭ್ಯ.',
      piggyBenefit1Title: 'ಮನೆಬಾಗಿಲ ದಿನಗೂಲಿ ಸಂಗ್ರಹ',
      piggyBenefit1Desc: 'ಪ್ರತಿದಿನ ನಮ್ಮ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳು ನಿಮ್ಮ ಅಂಗಡಿ ಅಥವಾ ಮನೆಗೆ ಬಂದು ₹೨೦, ₹೫೦ ಅಥವಾ ₹೧೦೦ ಸಂಗ್ರಹಿಸುತ್ತಾರೆ. ತಕ್ಷಣವೇ ಮೊಬೈಲ್‌ಗೆ ಡಿಜಿಟಲ್ ರಸೀದಿ.',
      piggyBenefit2Title: 'ಸಾಲ ಮುಂಗಡ ಪಾವತಿ & ಬಡ್ಡಿ ಕಡಿತ',
      piggyBenefit2Desc: 'ನಿಮ್ಮ ಪಿಗ್ಗಿ ಉಳಿತಾಯದ ಹಣವನ್ನು ನಿಮ್ಮ ಚಾಲ್ತಿ ಸಾಲದ ಅಸಲಿಗೆ ಜಮೆ ಮಾಡಿ ಸಾಲದ ಅವಧಿಯನ್ನು ಮತ್ತು ಬಡ್ಡಿಯನ್ನು ಯಾವುದೇ ದಂಡವಿಲ್ಲದೆ ಕಡಿಮೆ ಮಾಡಿಕೊಳ್ಳಬಹುದು.',
      piggyBenefit3Title: 'ವಾರ್ಷಿಕ ೬.೦೦% ಖಾತರಿ ಬಡ್ಡಿ',
      piggyBenefit3Desc: 'ಸಾಮಾನ್ಯ ಬ್ಯಾಂಕ್ ಉಳಿತಾಯ ಖಾತೆಗಿಂತ ಹೆಚ್ಚಿನ ೬.೦೦% ವಾರ್ಷಿಕ ಬಡ್ಡಿ ನಿಮ್ಮ ದೈನಂದಿನ ಠೇವಣಿಗೆ ಜಮೆಯಾಗುತ್ತದೆ.',
      piggyCalcTitle: 'ದೈನಂದಿನ ಪಿಗ್ಗಿ & ಸಾಲ ಉಳಿತಾಯ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
      piggyCalcSubtitle: 'ದಿನವೂ ಉಳಿಸುವ ಸಣ್ಣ ಮೊತ್ತವು ನಿಮ್ಮ ಸಾಲದ ಹೊರೆಯನ್ನು ಹೇಗೆ ಕರಗಿಸುತ್ತದೆ ನೋಡಿ.',
      dailyDepositLabel: 'ದೈನಂದಿನ ಉಳಿತಾಯ ಮೊತ್ತ',
      piggyDaysLabel: 'ಸಂಗ್ರಹ ಅವಧಿ (ದಿನಗಳಲ್ಲಿ)',
      piggyPrincipalSaved: 'ಒಟ್ಟು ಸಂಗ್ರಹವಾದ ಅಸಲು',
      piggyInterestEarned: 'ಗಳಿಸಿದ ಬಡ್ಡಿ (+೬.೦೦%)',
      piggyTotalFund: 'ಒಟ್ಟು ಲಭ್ಯವಿರುವ ಪಿಗ್ಗಿ ಮೊತ್ತ',
      piggyPrepayBonus: 'ಸಾಲ ಮುಂಗಡ ಪಾವತಿ ಲಾಭ',
      piggyPrepayDesc: 'ಈ ಮೊತ್ತವನ್ನು ನಿಮ್ಮ ಸಾಲದ ಅಸಲಿಗೆ ಪಾವತಿಸಿದರೆ ಅಂದಾಜು ₹',
      piggyPrepaySuffix: ' ರಷ್ಟು ಬಡ್ಡಿ ಹಣ ಉಳಿಯುತ್ತದೆ!',
      formTitle: 'ಸಲಹಾ ಕರೆಗೆ ವಿನಂತಿಸಿ',
      formSubtitle: 'ನಮ್ಮ ಆರ್ಥಿಕ ಸಲಹೆಗಾರರು ಸಂಪೂರ್ಣ ಮಾಹಿತಿಯೊಂದಿಗೆ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.',
      formName: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು',
      formPhone: 'ಮೊಬೈಲ್ ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
      formTaluk: 'ತಾಲೂಕು / ಗ್ರಾಮದ ಹೆಸರು',
      formBtn: 'ಉಚಿತ ಕರೆಗೆ ವಿನಂತಿಸಿ',
      formSuccess: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ರೆಫರೆನ್ಸ್ ಸಂಖ್ಯೆ TKT-MF-2026. ನಮ್ಮ ಅಧಿಕಾರಿಗಳು ೪ ಗಂಟೆಗಳಲ್ಲಿ ಕರೆ ಮಾಡಲಿದ್ದಾರೆ.',
      chatWhatsapp: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಮಾತನಾಡಿ'
    }
  }[lang];

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      {/* HERO BANNER: OPTION B ROYAL SAFFRON SUNBURST */}
      <section className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white pt-14 pb-16 px-4 sm:px-10 text-center border-b border-orange-800 shadow-inner overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-white shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>{t.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight drop-shadow-md">
            {t.title}
          </h1>

          <p className="text-amber-50 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
            {t.subtitle}
          </p>

          {/* WhatsApp Direct Advisory Button */}
          <div className="pt-2 flex justify-center">
            <a
              href="https://wa.me/919845123450?text=Namaskara%20GGY%20Finance,%20I%20am%20interested%20in%20Rural%20Mutual%20Fund%20Micro-SIP%20and%20Fixed%20Deposits."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-amber-50 text-orange-700 font-black text-xs sm:text-sm rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{t.chatWhatsapp}</span>
            </a>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SUBCATEGORY SELECTOR TABS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 -mt-6 relative z-20">
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-lg flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setActiveTab('mf')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'mf'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.tabMf}</span>
          </button>

          <button
            onClick={() => setActiveTab('fd')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'fd'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{t.tabFd}</span>
          </button>

          <button
            onClick={() => setActiveTab('piggy')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'piggy'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>{t.tabPiggy}</span>
          </button>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-12 space-y-12">
        {/* ======================================================== */}
        {/* SUBCATEGORY 1: MUTUAL FUNDS & RURAL MICRO-SIP */}
        {/* ======================================================== */}
        {activeTab === 'mf' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* Simple Village Cooperative Analogy Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-black text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                <Users2 className="w-3.5 h-3.5 text-orange-600" />
                <span>Financial Literacy for Rural India</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                {t.whatIsMfTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {t.whatIsMfDesc}
              </p>
            </div>

            {/* 3 Core Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-3">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black border border-orange-200">
                    <span className="text-base font-black">₹</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-950">{t.mfBenefit1Title}</h3>
                  <p className="text-slate-600 leading-relaxed font-normal">{t.mfBenefit1Desc}</p>
                </div>
                <div className="pt-2 text-[11px] font-bold text-orange-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>UPI AutoPay Enabled</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-3">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black border border-amber-200">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-black text-slate-950">{t.mfBenefit2Title}</h3>
                  <p className="text-slate-600 leading-relaxed font-normal">{t.mfBenefit2Desc}</p>
                </div>
                <div className="pt-2 text-[11px] font-bold text-amber-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Long-Term Compounding</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-3">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black border border-emerald-200">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-black text-slate-950">{t.mfBenefit3Title}</h3>
                  <p className="text-slate-600 leading-relaxed font-normal">{t.mfBenefit3Desc}</p>
                </div>
                <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SEBI Regulated &amp; Safe</span>
                </div>
              </div>
            </div>

            {/* Micro-SIP Calculator & Simulator */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
              <div className="text-center space-y-1 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  <Calculator className="w-3.5 h-3.5 text-orange-600" />
                  <span>Interactive SIP Calculator</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950">{t.sipCalcTitle}</h3>
                <p className="text-xs text-slate-500 font-medium">{t.sipCalcSubtitle}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Sliders (7 cols) */}
                <div className="lg:col-span-7 bg-[#FBFBFA] p-6 rounded-2xl border border-slate-200 space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <label>{t.monthlyInvestment}</label>
                      <span className="font-mono text-base font-black text-orange-600 bg-white px-3 py-1 rounded-xl border border-slate-200">
                        ₹{sipMonthly.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="250"
                      max="5000"
                      step="250"
                      value={sipMonthly}
                      onChange={(e) => setSipMonthly(Number(e.target.value))}
                      className="w-full accent-orange-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold">
                      <span>₹250</span>
                      <span>₹2,500</span>
                      <span>₹5,000</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <label>{t.investmentPeriod}</label>
                      <span className="font-mono text-base font-black text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200">
                        {sipYears} Years
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="1"
                      value={sipYears}
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="w-full accent-orange-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold">
                      <span>1 Year</span>
                      <span>5 Years</span>
                      <span>15 Years</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <label>{t.expectedReturn}</label>
                      <span className="font-mono text-base font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                        {sipRate}% p.a.
                      </span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="15"
                      step="0.5"
                      value={sipRate}
                      onChange={(e) => setSipRate(Number(e.target.value))}
                      className="w-full accent-orange-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Result Card: Deep Institutional Green (5 cols) */}
                <div className="lg:col-span-5 bg-gradient-to-b from-[#064e3b] to-[#022c22] text-white p-6 sm:p-7 rounded-2xl border border-emerald-900 shadow-xl space-y-5">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                      {t.totalMaturity}
                    </p>
                    <p className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                      ₹{estimatedWealthSip.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-emerald-200/80 mt-1">
                      In {sipYears} years at {sipRate}% compounding return.
                    </p>
                  </div>

                  <div className="divide-y divide-emerald-800/80 text-xs pt-2">
                    <div className="py-2 flex justify-between">
                      <span className="text-emerald-200">{t.totalInvested}:</span>
                      <span className="font-mono font-bold text-white">₹{totalInvestedSip.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-emerald-200">{t.wealthGain}:</span>
                      <span className="font-mono font-bold text-amber-300">+₹{estimatedGainsSip.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/919845123450?text=Namaskara,%20I%20want%20to%20start%20a%20Monthly%20Micro-SIP%20of%20Rs.%20500."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-lg transition-all text-center block"
                  >
                    Start This SIP on WhatsApp &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* SEBI & AMFI Compliance Notice */}
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl text-[11px] text-slate-700 leading-relaxed space-y-1">
              <p className="font-bold text-amber-900">AMFI Registered Mutual Fund Distributor • ARN-284910</p>
              <p>Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully before investing. GGY Finance distributes SEBI-registered mutual funds to rural investors with complete transparency and zero upfront commission deductions from the investor.</p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBCATEGORY 2: HIGH-YIELD SECURED FIXED DEPOSITS */}
        {/* ======================================================== */}
        {activeTab === 'fd' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* FD Overview Header */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Capital Protection &amp; Guaranteed Payout</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                {t.fdTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {t.fdSubtitle}
              </p>
            </div>

            {/* FD Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <label>{t.fdAmountLabel}</label>
                    <span className="font-mono text-base font-black text-slate-950 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                      ₹{fdAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="10000"
                    value={fdAmount}
                    onChange={(e) => setFdAmount(Number(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold">
                    <span>₹10,000</span>
                    <span>₹2,50,000</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <label>{t.fdTenureLabel}</label>
                    <span className="font-mono text-base font-black text-slate-950 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                      {fdTenureMonths} Months
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[12, 24, 36].map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setFdTenureMonths(months)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          fdTenureMonths === months
                            ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {months} Months ({months >= 36 ? '8.5%' : months >= 24 ? '8.0%' : '7.5%'})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer font-bold text-slate-900">
                    <input
                      type="checkbox"
                      checked={isSeniorCitizen}
                      onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded"
                    />
                    <span>{t.seniorCitizenCheck}</span>
                  </label>
                </div>
              </div>

              {/* FD Result Box: Deep Green */}
              <div className="lg:col-span-5 bg-gradient-to-b from-[#064e3b] to-[#022c22] text-white p-6 sm:p-7 rounded-3xl border border-emerald-900 shadow-xl space-y-5">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                    {t.fdMaturityLabel}
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                    ₹{fdMaturityAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-emerald-200/80 mt-1">
                    At guaranteed {effectiveFdRate.toFixed(2)}% annual interest.
                  </p>
                </div>

                <div className="divide-y divide-emerald-800/80 text-xs pt-2">
                  <div className="py-2 flex justify-between">
                    <span className="text-emerald-200">{t.fdRateLabel}:</span>
                    <span className="font-mono font-bold text-white">{effectiveFdRate.toFixed(2)}% p.a.</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-emerald-200">{t.fdInterestLabel}:</span>
                    <span className="font-mono font-bold text-amber-300">+₹{fdInterest.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <a
                  href="https://wa.me/919845123450?text=Namaskara,%20I%20am%20interested%20in%20booking%20a%20Fixed%20Deposit%20of%20Rs.%2050,000."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-lg transition-all text-center block"
                >
                  Book Doorstep Paperwork &rarr;
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBCATEGORY 3: DAILY PIGGY DEPOSIT (DOORSTEP MICRO-SAVINGS) */}
        {/* ======================================================== */}
        {activeTab === 'piggy' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* Overview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Doorstep Micro-Savings Scheme • ಮನೆಬಾಗಿಲ ಕಿರು ಉಳಿತಾಯ</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                {t.piggyHeading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {t.piggySubtitle}
              </p>
            </div>

            {/* 3 Core Benefits Grid with matched heights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-3">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black border border-orange-200">
                    <Wallet className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-sm font-black text-slate-950">{t.piggyBenefit1Title}</h3>
                  <p className="text-slate-600 leading-relaxed">{t.piggyBenefit1Desc}</p>
                </div>
                <div className="pt-2 text-[11px] font-bold text-orange-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Daily Instant SMS Receipt</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-3">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black border border-amber-200">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-black text-slate-950">{t.piggyBenefit2Title}</h3>
                  <p className="text-slate-600 leading-relaxed">{t.piggyBenefit2Desc}</p>
                </div>
                <div className="pt-2 text-[11px] font-bold text-amber-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Zero Prepayment Penalty</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-3">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black border border-emerald-200">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-black text-slate-950">{t.piggyBenefit3Title}</h3>
                  <p className="text-slate-600 leading-relaxed">{t.piggyBenefit3Desc}</p>
                </div>
                <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>6.00% Guaranteed Annual Interest</span>
                </div>
              </div>
            </div>

            {/* Daily Piggy Simulator */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
              <div className="text-center space-y-1 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  <Calculator className="w-3.5 h-3.5 text-orange-600" />
                  <span>Daily Micro-Savings & Loan Buffer Simulator</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-950">
                  {t.piggyCalcTitle}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {t.piggyCalcSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                {/* Sliders Area (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Daily Deposit Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline text-xs font-bold">
                      <span className="text-slate-800">{t.dailyDepositLabel}</span>
                      <span className="text-base font-black text-orange-600 font-mono">
                        ₹{piggyDaily} / day
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="500"
                      step="10"
                      value={piggyDaily}
                      onChange={(e) => setPiggyDaily(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-600 font-bold font-mono">
                      <span>₹20/day</span>
                      <span>₹100/day</span>
                      <span>₹250/day</span>
                      <span>₹500/day</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {[20, 50, 100, 200, 500].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setPiggyDaily(amt)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition-all ${
                            piggyDaily === amt
                              ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          ₹{amt}/day
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration Buttons */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline text-xs font-bold">
                      <span className="text-slate-800">{t.piggyDaysLabel}</span>
                      <span className="text-base font-black text-orange-600 font-mono">
                        {piggyDays} Days ({piggyDays >= 365 ? '1 Year' : piggyDays >= 180 ? '6 Months' : piggyDays >= 90 ? '3 Months' : '1 Month'})
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                      {[
                        { days: 30, label: '30 Days' },
                        { days: 90, label: '90 Days' },
                        { days: 180, label: '180 Days' },
                        { days: 365, label: '365 Days' }
                      ].map((item) => (
                        <button
                          key={item.days}
                          type="button"
                          onClick={() => setPiggyDays(item.days)}
                          className={`py-2 px-3 rounded-xl border transition-all text-center ${
                            piggyDays === item.days
                              ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Loan Prepayment Advantage Callout */}
                  <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-extrabold text-emerald-950">
                        {t.piggyPrepayBonus}
                      </p>
                      <p className="text-slate-700 leading-relaxed font-normal">
                        {t.piggyPrepayDesc}
                        <strong className="font-mono text-emerald-800 font-extrabold text-sm mx-1">
                          ₹{potentialLoanInterestSaved.toLocaleString('en-IN')}
                        </strong>
                        {t.piggyPrepaySuffix}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Piggy Result Box: Deep Forest Green */}
                <div className="lg:col-span-5 bg-gradient-to-b from-[#064e3b] to-[#022c22] text-white p-6 sm:p-7 rounded-3xl border border-emerald-900 shadow-xl space-y-5">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                      {t.piggyTotalFund}
                    </p>
                    <p className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                      ₹{piggyMaturity.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-emerald-200/80 mt-1">
                      Doorstep collected + 6.00% annual compounding.
                    </p>
                  </div>

                  <div className="divide-y divide-emerald-800/80 text-xs pt-2">
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-emerald-200">{t.piggyPrincipalSaved}:</span>
                      <span className="font-mono font-bold text-white">₹{piggyTotalInvested.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-emerald-200">{t.piggyInterestEarned}:</span>
                      <span className="font-mono font-bold text-amber-300">+₹{piggyInterest.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-emerald-200">Est. Loan Interest Saved:</span>
                      <span className="font-mono font-bold text-emerald-300">₹{potentialLoanInterestSaved.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/919845123450?text=Namaskara,%20I%20want%20to%20start%20a%20Daily%20Piggy%20Deposit%20of%20Rs.%20${piggyDaily}%20per%20day.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-lg transition-all text-center block"
                  >
                    Start Daily Doorstep Piggy &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DOORSTEP ADVISORY CALLBACK FORM */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">{t.formTitle}</h3>
              <p className="text-xs text-slate-500 font-medium">{t.formSubtitle}</p>
            </div>

            {isSubmitted ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-extrabold text-emerald-950">{t.formSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-800 mb-1">{t.formName}</label>
                  <input
                    type="text"
                    required
                    placeholder="Sri Basavaraj / Smt. Lakshmi"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 font-normal"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 mb-1">{t.formPhone}</label>
                    <input
                      type="tel"
                      required
                      placeholder="9845012345"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 font-mono font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 mb-1">{t.formTaluk}</label>
                    <select
                      value={clientTaluk}
                      onChange={(e) => setClientTaluk(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 font-semibold"
                    >
                      <option value="Channapatna">Channapatna, Ramanagara</option>
                      <option value="Kunigal">Kunigal, Tumakuru</option>
                      <option value="Maddur">Maddur, Mandya</option>
                      <option value="Nanjangud">Nanjangud, Mysuru</option>
                      <option value="Bengaluru_Rural">Nelamangala / Bengaluru Rural</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-extrabold shadow-md transition-all text-center"
                  >
                    {t.formBtn}
                  </button>

                  <a
                    href="https://wa.me/919845123450?text=Namaskara,%20I%20want%20information%20regarding%20Rural%20Investments."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
