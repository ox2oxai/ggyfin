'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import {
  HeartHandshake,
  Users,
  TrendingUp,
  Milk,
  Store,
  Sparkles,
  Bike,
  Tractor,
  Quote,
  CheckCircle2,
  QrCode,
  MapPin,
  ArrowRight
} from 'lucide-react';

export default function StoriesPage() {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'DAIRY' | 'KIRANA' | 'ENTERPRISE'>('ALL');

  const content = {
    en: {
      badge: 'Rural Voices & Grassroots Impact',
      heroTitle: 'Field Stories & Community Impact',
      heroSubtitle: 'Real Stories of Village Micro-Entrepreneurs Across Rural Communities',
      heroDesc: 'Behind every micro-loan is a story of grit, family dignity, and economic progress. Meet the dairy farmers, kirana owners, and village artisans transforming their households with GGY Finance.',
      statsAum: '₹4.8+ Crores',
      statsAumLabel: 'Total Micro-Capital Disbursed',
      statsBorrowers: '1,420+',
      statsBorrowersLabel: 'Active Rural Households',
      statsWomen: '78%',
      statsWomenLabel: 'Women Borrowers Supported',
      statsCer: '99.2%',
      statsCerLabel: 'On-Time Repayment Ratio',
      filterAll: 'All Stories',
      filterDairy: 'Dairy & Cattle',
      filterKirana: 'Kirana & Retail',
      filterEnterprise: 'Micro-Enterprise',
      readMore: 'Read Full Story',
      repaymentMethod: 'Repayment Method: Dynamic UPI QR & Field Receipt',
      ctaTitle: 'Ready to write your own success story?',
      ctaButton: 'Apply for a Micro Loan'
    },
    kn: {
      badge: 'ಗ್ರಾಮೀಣ ಕಥೆಗಳು & ಸಮುದಾಯ ಪ್ರಭಾವ',
      heroTitle: 'ಗ್ರಾಮೀಣ ಯಶೋಗಾಥೆಗಳು (Field Stories)',
      heroSubtitle: 'ಕರ್ನಾಟಕದ ಹಳ್ಳಿಗಳಲ್ಲಿ ಸಣ್ಣ ಉದ್ಯಮಿಗಳ ಸ್ವಾವಲಂಬನೆಯ ಕಥೆಗಳು',
      heroDesc: 'ಪ್ರತಿಯೊಂದು ಕಿರು ಸಾಲದ ಹಿಂದೆ ಗ್ರಾಮೀಣ ಕುಟುಂಬಗಳ ಸ್ವಾಭಿಮಾನ, ಪರಿಶ್ರಮ ಮತ್ತು ಆರ್ಥಿಕ ಪ್ರಗತಿಯ ಕಥೆಯಿದೆ. ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ ಮೂಲಕ ತಮ್ಮ ಬದುಕನ್ನು ಸುಧಾರಿಸಿಕೊಂಡ ಹೈನುಗಾರರು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳನ್ನು ಭೇಟಿ ಮಾಡಿ.',
      statsAum: '₹4.8+ ಕೋಟಿ',
      statsAumLabel: 'ಒಟ್ಟು ವಿತರಿಸಲಾದ ಕಿರು ಸಾಲ',
      statsBorrowers: '1,420+',
      statsBorrowersLabel: 'ಸಕ್ರಿಯ ಗ್ರಾಮೀಣ ಕುಟುಂಬಗಳು',
      statsWomen: '78%',
      statsWomenLabel: 'ಮಹಿಳಾ ಫಲಾನುಭವಿಗಳ ಪಾಲು',
      statsCer: '99.2%',
      statsCerLabel: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾದ ಮರುಪಾವತಿ',
      filterAll: 'ಎಲ್ಲ ಕಥೆಗಳು',
      filterDairy: 'ಹೈನುಗಾರಿಕೆ',
      filterKirana: 'ಕಿರಾಣಿ ಅಂಗಡಿ',
      filterEnterprise: 'ಸಣ್ಣ ಉದ್ಯಮ',
      readMore: 'ಪೂರ್ಣ ಕಥೆಯನ್ನು ಓದಿ',
      repaymentMethod: 'ಮರುಪಾವತಿ ವಿಧಾನ: ಯುಪಿಐ (UPI) ಮತ್ತು ಶಾಖಾ ರಸೀದಿ',
      ctaTitle: 'ನಿಮ್ಮ ಸ್ವಂತ ವ್ಯಾಪಾರವನ್ನು ಬೆಳೆಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?',
      ctaButton: 'ಕಿರು ಸಾಲಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ'
    }
  };

  const t = content[lang];

  const stories = [
    {
      id: 'story-1',
      category: 'DAIRY',
      name: lang === 'kn' ? 'ಶ್ರೀಮತಿ ಆನಂದಿ ದೇವಿ ಗೌಡ' : 'Smt. Anandi Devi Gowda',
      location: 'Maddur Taluk, Mandya',
      loanType: lang === 'kn' ? 'ಹೈನುಗಾರಿಕೆ ಸಾಲ (Dairy & Cattle)' : 'Dairy Livestock Loan',
      loanAmount: '₹75,000',
      tenure: '18 Months',
      rate: '13.0% p.a.',
      icon: <Milk className="w-5 h-5 text-terracotta-500" />,
      quote:
        lang === 'kn'
          ? 'ನನಗೆ ಕೇವಲ 2 ಹಸುಗಳಿದ್ದವು. ಜಿಜಿವೈ ಫೈನಾನ್ಸ್‌ನಿಂದ ಸಾಲ ಪಡೆದು ಇನ್ನೂ 3 ಉತ್ತಮ ತಳಿಯ ಹಸುಗಳನ್ನು ಖರೀದಿಸಿದೆ. ಈಗ ದಿನಕ್ಕೆ 40 ಲೀಟರ್ ಹಾಲು ಡೈರಿಗೆ ನೀಡುತ್ತಿದ್ದೇನೆ. ನನ್ನ ಮಾಸಿಕ ಆದಾಯ ₹22,000 ಕ್ಕೆ ಏರಿದೆ.'
          : 'I previously owned just two indigenous cows with low milk yield. With GGY Finance’s 18-month doorstep credit, I bought three high-yield cross-breed cows. My milk supply to the local KMF cooperative doubled to 40 liters daily, transforming my family’s economic security.',
      impactMetric: lang === 'kn' ? '+140% ಮಾಸಿಕ ಆದಾಯ ಹೆಚ್ಚಳ' : '+140% Household Monthly Income',
      repaymentStatus: '9 EMIs Paid On Time via UPI QR'
    },
    {
      id: 'story-2',
      category: 'KIRANA',
      name: lang === 'kn' ? 'ಶ್ರೀಮತಿ ಪಾರ್ವತಮ್ಮ ಕೆ.' : 'Smt. Parvathamma K.',
      location: 'Shivaji Chowk, Maddur Village',
      loanType: lang === 'kn' ? 'ಕಿರಾಣಿ ಅಂಗಡಿ ದುಡಿಯುವ ಬಂಡವಾಳ' : 'Kirana Inventory Loan',
      loanAmount: '₹50,000',
      tenure: '12 Months',
      rate: '14.5% p.a.',
      icon: <Store className="w-5 h-5 text-terracotta-500" />,
      quote:
        lang === 'kn'
          ? 'ದೊಡ್ಡ ವ್ಯಾಪಾರಿಗಳಿಂದ ಸಾಲ ಪಡೆಯಲು ಕಷ್ಟವಾಗುತ್ತಿತ್ತು. ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳು ನನ್ನ ಅಂಗಡಿಗೆ ಬಂದು ಆಧಾರ್ ಪರಿಶೀಲಿಸಿ 24 ಗಂಟೆಯಲ್ಲಿ ಹಣ ಬ್ಯಾಂಕ್‌ಗೆ ಜಮೆ ಮಾಡಿದರು. ದಿನಸಿ ಸಾಮಗ್ರಿಗಳನ್ನು ಸಗಟು ದರದಲ್ಲಿ ಖರೀದಿಸಿ ಲಾಭ ಹೆಚ್ಚಿಸಿಕೊಂಡೆ.'
          : 'Informal distributors charged me high weekly interest on wholesale supplies. GGY’s Field Officer visited my village shop, completed masked KYC, and the funds arrived directly in my Canara Bank account within 24 hours. My FMCG turnover grew 3x without debt stress.',
      impactMetric: lang === 'kn' ? '3x ದಿನಸಿ ಸಾಮಗ್ರಿಗಳ ವಹಿವಾಟು' : '3x Stock Turnover Rate',
      repaymentStatus: '11 EMIs Paid On Time via Field Agent'
    },
    {
      id: 'story-3',
      category: 'ENTERPRISE',
      name: lang === 'kn' ? 'ಶ್ರೀಮತಿ ಲಕ್ಷ್ಮಿ ಬಾಯಿ' : 'Smt. Lakshmi Bai',
      location: 'Crafts Colony, Channapatna',
      loanType: lang === 'kn' ? 'ರೇಷ್ಮೆ & ಮರದ ಆಟಿಕೆಗಳ ಕಿರು ಉದ್ಯಮ' : 'Micro-Enterprise Capital',
      loanAmount: '₹60,000',
      tenure: '12 Months',
      rate: '16.0% p.a.',
      icon: <Sparkles className="w-5 h-5 text-terracotta-500" />,
      quote:
        lang === 'kn'
          ? 'ಚನ್ನಪಟ್ಟಣದ ಸಾಂಪ್ರದಾಯಿಕ ಮರದ ಆಟಿಕೆಗಳ ತಯಾರಿಕೆಗೆ ಹೊಸ ಯಂತ್ರೋಪಕರಣ ಬೇಕಿತ್ತು. ಜಿಜಿವೈ ಸಾಲದಿಂದ ಯಂತ್ರ ಖರೀದಿಸಿ ನನ್ನ ಜೊತೆ ಇತರ 4 ಮಹಿಳೆಯರಿಗೆ ಕೆಲಸ ನೀಡಲು ಸಾಧ್ಯವಾಯಿತು.'
          : 'Our traditional Channapatna wooden lacquer toy craftsmanship needed precision motorized lathes. With GGY Finance’s working capital, I purchased two modern lathes and engaged four local women artisans, taking our wooden exports to Bengaluru retail stores.',
      impactMetric: lang === 'kn' ? '4 ಮಹಿಳೆಯರಿಗೆ ಗ್ರಾಮೀಣ ಉದ್ಯೋಗ' : '4 Rural Women Employed',
      repaymentStatus: '8 EMIs Paid On Time via PhonePe QR'
    },
    {
      id: 'story-4',
      category: 'ENTERPRISE',
      name: lang === 'kn' ? 'ಶ್ರೀ ಬಸವರಾಜು ಎಂ.' : 'Shri Basavaraju M.',
      location: 'Hunsur, Mysuru Cluster',
      loanType: lang === 'kn' ? 'ಕೃಷಿ ಸೋಲಾರ್ ಪಂಪ್ ನೆರವು' : 'Agri Equipment & Solar',
      loanAmount: '₹1,50,000',
      tenure: '36 Months',
      rate: '12.5% p.a.',
      icon: <Tractor className="w-5 h-5 text-terracotta-500" />,
      quote:
        lang === 'kn'
          ? 'ಡೀಸೆಲ್ ಪಂಪ್‌ಗೆ ತಿಂಗಳಿಗೆ ₹4,000 ಖರ್ಚಾಗುತ್ತಿತ್ತು. ಜಿಜಿವೈ ಫೈನಾನ್ಸ್‌ನ ದೀರ್ಘಾವಧಿ ಸಾಲದಿಂದ ಸೋಲಾರ್ ಪಂಪ್ ಅಳವಡಿಸಿದೆ. ಈಗ ಡೀಸೆಲ್ ಖರ್ಚು ಸಂಪೂರ್ಣ ಶೂನ್ಯವಾಗಿದೆ.'
          : 'Erratic electricity and costly diesel generators drained over ₹4,000 each month from my farm. GGY Finance supported me with an affordable 36-month solar pump loan. My crop irrigation is now 100% solar powered, saving thousands every season.',
      impactMetric: lang === 'kn' ? '₹0 ಡೀಸೆಲ್ ವೆಚ್ಚ (ಸಂಪೂರ್ಣ ಸೌರಶಕ್ತಿ)' : '100% Diesel Expenditure Eliminated',
      repaymentStatus: '14 EMIs Paid On Time via Mandya Branch'
    }
  ];

  const filteredStories = filter === 'ALL' ? stories : stories.filter((s) => s.category === filter);

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-sandstone-50 to-sandstone-100 py-16 px-4 border-b border-clay/60">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-terracotta-50 text-terracotta-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-terracotta-100">
            <HeartHandshake className="w-4 h-4 text-terracotta-500" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-forest-900 tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="text-terracotta-600 font-bold text-base sm:text-lg mt-3">
            {t.heroSubtitle}
          </p>
          <p className="text-forest-800/80 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>
        </div>
      </section>

      {/* Impact Scorecards */}
      <section className="py-12 px-4 max-w-6xl mx-auto -mt-10 w-full z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-forest-800 text-sandstone-100 p-6 rounded-2xl border border-forest-600 shadow-md">
            <p className="text-2xl sm:text-3xl font-black text-white">{t.statsAum}</p>
            <p className="text-xs text-sandstone-300 mt-1 font-medium">{t.statsAumLabel}</p>
          </div>
          <div className="bg-forest-800 text-sandstone-100 p-6 rounded-2xl border border-forest-600 shadow-md">
            <p className="text-2xl sm:text-3xl font-black text-terracotta-400">{t.statsBorrowers}</p>
            <p className="text-xs text-sandstone-300 mt-1 font-medium">{t.statsBorrowersLabel}</p>
          </div>
          <div className="bg-forest-800 text-sandstone-100 p-6 rounded-2xl border border-forest-600 shadow-md">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">{t.statsWomen}</p>
            <p className="text-xs text-sandstone-300 mt-1 font-medium">{t.statsWomenLabel}</p>
          </div>
          <div className="bg-forest-800 text-sandstone-100 p-6 rounded-2xl border border-forest-600 shadow-md">
            <p className="text-2xl sm:text-3xl font-black text-white">{t.statsCer}</p>
            <p className="text-xs text-sandstone-300 mt-1 font-medium">{t.statsCerLabel}</p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 px-4 bg-sandstone-50">
        <div className="max-w-6xl mx-auto flex justify-center items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-sandstone-200/80 text-forest-800 hover:bg-sandstone-300'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => setFilter('DAIRY')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === 'DAIRY'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-sandstone-200/80 text-forest-800 hover:bg-sandstone-300'
            }`}
          >
            {t.filterDairy}
          </button>
          <button
            onClick={() => setFilter('KIRANA')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === 'KIRANA'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-sandstone-200/80 text-forest-800 hover:bg-sandstone-300'
            }`}
          >
            {t.filterKirana}
          </button>
          <button
            onClick={() => setFilter('ENTERPRISE')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === 'ENTERPRISE'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-sandstone-200/80 text-forest-800 hover:bg-sandstone-300'
            }`}
          >
            {t.filterEnterprise}
          </button>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12 px-4 bg-sandstone-50 border-b border-clay/60">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-sandstone-100 rounded-3xl p-6 sm:p-8 border border-clay shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-terracotta-50 border border-terracotta-200 flex items-center justify-center shrink-0">
                      {story.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-forest-900 leading-tight">{story.name}</h4>
                      <p className="text-xs text-forest-800/70 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                        <span>{story.location}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-forest-800 text-white">
                    {story.loanAmount}
                  </span>
                </div>

                <div className="bg-sandstone-50 p-4 rounded-xl border border-clay/60 mb-5 relative">
                  <Quote className="w-5 h-5 text-terracotta-400/40 absolute top-2 right-2" />
                  <p className="text-xs sm:text-sm text-forest-800/90 leading-relaxed italic">
                    "{story.quote}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                  <div className="bg-sandstone-200/60 p-2.5 rounded-lg border border-clay/40">
                    <span className="text-[11px] text-forest-800/70 block">Purpose</span>
                    <span className="font-bold text-forest-900">{story.loanType}</span>
                  </div>
                  <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-[11px] text-emerald-800/70 block">Impact</span>
                    <span className="font-bold text-emerald-900">{story.impactMetric}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-clay/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-forest-800/80">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{story.repaymentStatus}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-forest-800/60">
                  <QrCode className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Universal UPI</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 px-4 bg-sandstone-200 border-t border-clay/60 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-forest-900">{t.ctaTitle}</h3>
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all text-sm"
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
