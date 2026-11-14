'use client';

import React from 'react';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import { Scale, FileText, CheckCircle2, AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';

export default function TermsAndConditionsPage() {
  const { lang } = useLanguage();

  const content = {
    en: {
      badge: 'Statutory Fair Practices Code',
      title: 'Terms & Conditions of Lending',
      effectiveDate: 'Effective Date: April 1, 2026 | Last Updated: November 14, 2026',
      intro: 'These Terms and Conditions constitute a legally binding agreement between the borrower ("Applicant", "Borrower", "you") and GGY Finance Ltd. ("GGY Finance", "Lender", "we", "us"). GGY Finance is a Karnataka State-registered micro-lending platform (Reg No: KA-ML/2024/7742) and strictly adheres to the Karnataka State Lending Guidelines and Fair Practices Code (FPC).',
      s1Title: '1. Loan Origination & Key Fact Statement (KFS)',
      s1Text: 'Every approved loan is governed by an individualized Key Fact Statement (KFS) provided prior to disbursement. The KFS explicitly details the loan amount, Annual Percentage Rate (APR), processing fee (1.5% of principal plus 18% GST), monthly EMI amount, and complete reducing balance amortization schedule. No fee not disclosed in the KFS shall ever be charged.',
      s2Title: '2. Interest Rate & Reducing Balance Calculation',
      s2Text: 'Interest is charged strictly on the diminishing/reducing balance of the principal outstanding. GGY Finance strictly prohibits flat-rate or compound interest traps. Interest accrues daily on the remaining principal and is payable monthly.',
      s3Title: '3. Repayment Channels & Receipts',
      s3Text: 'Borrowers may repay through two sanctioned channels exclusively:',
      s3List: [
        'Dynamic Universal UPI QR: Scannable via any UPI application (PhonePe, GPay, Paytm, BHIM) with instant automated digital confirmation.',
        'Authorized Branch Cash Receipt: Cash handed to field officers or branch cashiers must be accompanied by an immediate printed/SMS receipt. Cash is credited to your ledger upon dual-control manager verification.'
      ],
      s4Title: '4. Zero Pre-Payment & Foreclosure Penalties',
      s4Text: 'In accordance with Karnataka State Micro-Lending guidelines, borrowers have the right to prepay or foreclose their loan in part or in full at any time with ZERO pre-payment penalty or foreclosure fee.',
      s5Title: '5. Zero-Balance Loan Closure & No-Dues Certificate (NOC)',
      s5Text: 'Upon complete settlement of all dues (when the account reaches an exact ₹0.00 balance), the loan is reviewed under Maker-Checker dual control. The Authorizer shall formally issue an official No-Dues Certificate (NOC reference: NOC-GGY-YYYY-XXXXXX) within 7 business days, releasing all liabilities.',
      s6Title: '6. Fair Recovery Practices & Code of Conduct',
      s6Text: 'GGY Finance field staff and recovery personnel strictly adhere to civilized, ethical conduct. We never engage in intimidation, harassment, public shaming, visits at unearthly hours (visits permitted only between 8:00 AM and 7:00 PM), or contact with relatives/references without legal authorization.',
      s7Title: '7. Grievance Redressal & State Redressal Mechanism',
      s7Text: 'If you have any grievance regarding service, repayment, or staff conduct:',
      s7Steps: [
        'Step 1: Contact your local Branch Manager at Mandya, Ramanagara, or Mysuru.',
        'Step 2: Escalate to the Principal Nodal Officer: Shri A. Deshmukh (Email: grievance@ggyfinance.in, Toll-Free: 1800-209-4321). Timeframe for resolution: 30 calendar days.',
        'Step 3: If unresolved within 30 days, you may escalate to the Karnataka State Micro Lending Grievance Redressal Desk at grievance@ggyfinance.in or visit our designated Nodal Office.'
      ]
    },
    kn: {
      badge: 'ಶಾಸನಬದ್ಧ ಪ್ರಾಮಾಣಿಕ ಸಾಲ ನೀತಿ',
      title: 'ಸಾಲದ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು (Terms & Conditions)',
      effectiveDate: 'ಜಾರಿಗೆ ಬಂದ ದಿನಾಂಕ: 1 ಏಪ್ರಿಲ್ 2026 | ನವೀಕರಿಸಿದ್ದು: 14 ನವೆಂಬರ್ 2026',
      intro: 'ಈ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು ಸಾಲಗಾರರು ಮತ್ತು ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ ಸಂಸ್ಥೆಯ ನಡುವಿನ ಕಾನೂನುಬದ್ಧ ಒಪ್ಪಂದವಾಗಿದೆ. ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ ಕರ್ನಾಟಕ ರಾಜ್ಯ ನೋಂದಾಯಿತ ಕಿರು ಸಾಲ ಸಂಸ್ಥೆಯಾಗಿದ್ದು (ನೋಂದಣಿ ಸಂಖ್ಯೆ: KA-ML/2024/7742), ರಾಜ್ಯದ ಕಿರು ಸಾಲ ನಿಯಮಾವಳಿ ಮತ್ತು ಪ್ರಾಮಾಣಿಕ ಸಾಲ ನೀತಿಯನ್ನು (Fair Practices Code) ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಪಾಲಿಸುತ್ತದೆ.',
      s1Title: '1. ಮುಖ್ಯ ಸತ್ಯಾಂಶಗಳ ವಿವರಣೆ (Key Fact Statement - KFS)',
      s1Text: 'ಸಾಲ ನೀಡುವ ಮುನ್ನ ಪ್ರತಿಯೊಬ್ಬ ಗ್ರಾಹಕರಿಗೂ ಸಂಪೂರ್ಣ ಕೆಎಫ್‌ಎಸ್ (KFS) ನೀಡಲಾಗುತ್ತದೆ. ಇದರಲ್ಲಿ ಸಾಲದ ಮೊತ್ತ, ವಾರ್ಷಿಕ ಬಡ್ಡಿದರ (APR), ಪ್ರೊಸೆಸಿಂಗ್ ಶುಲ್ಕ (1.5% + 18% ಜಿಎಸ್‌ಟಿ), ಮಾಸಿಕ ಕಂತು ಮತ್ತು ತಿಂಗಳ ಮರುಪಾವತಿ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ನಮೂದಿಸಲಾಗಿರುತ್ತದೆ. ಇದರಲ್ಲಿ ನಮೂದಿಸದ ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕವನ್ನು ವಿಧಿಸಲಾಗುವುದಿಲ್ಲ.',
      s2Title: '2. ಇಳಿಕೆ ಮೊತ್ತದ ಬಡ್ಡಿದರ (Reducing Balance)',
      s2Text: 'ಬಾಕಿ ಇರುವ ಸಾಲದ ಅಸಲಿಗೆ ಮಾತ್ರ ಬಡ್ಡಿ ವಿಧಿಸಲಾಗುತ್ತದೆ. ಫ್ಲಾಟ್ ಬಡ್ಡಿ ಅಥವಾ ಚಕ್ರಬಡ್ಡಿಯನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ.',
      s3Title: '3. ಮರುಪಾವತಿ ವಿಧಾನಗಳು ಮತ್ತು ರಸೀದಿಗಳು',
      s3Text: 'ಸಾಲಗಾರರು ಈ ಕೆಳಗಿನ ಎರಡು ವಿಧಾನಗಳ ಮೂಲಕ ಮಾತ್ರ ಮರುಪಾವತಿ ಮಾಡಬಹುದು:',
      s3List: [
        'ಯುಪಿಐ ಕ್ಯೂಆರ್ ಕೋಡ್ (Dynamic UPI QR): PhonePe, Google Pay, Paytm ಮೂಲಕ ಸುಲಭವಾಗಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಪಾವತಿಸಿ, ತಕ್ಷಣ ಡಿಜಿಟಲ್ ರಸೀದಿ ಪಡೆಯಿರಿ.',
        'ಶಾಖೆಯ ಅಧಿಕೃತ ನಗದು ರಸೀದಿ: ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳಿಗೆ ನೀಡುವ ನಗದಿಗೆ ತಕ್ಷಣವೇ ಮುದ್ರಿತ ಅಥವಾ ಎಸ್‌ಎಂಎಸ್ ರಸೀದಿ ಪಡೆಯಬೇಕು. ಶಾಖಾ ವ್ಯವಸ್ಥಾಪಕರ ದೃಢೀಕರಣದ ನಂತರ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.'
      ],
      s4Title: '4. ಯಾವುದೇ ಅವಧಿಪೂರ್ವ ಪಾವತಿ ಶುಲ್ಕವಿಲ್ಲ (Zero Pre-Payment Penalty)',
      s4Text: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಕಿರು ಸಾಲ ನಿಯಮಾವಳಿಯಂತೆ, ಗ್ರಾಹಕರು ತಮ್ಮ ಸಾಲವನ್ನು ಅವಧಿಗಿಂತ ಮುಂಚಿತವಾಗಿ ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ದಂಡ ಅಥವಾ ಶುಲ್ಕವಿಲ್ಲದೆ (Zero Penalty) ಪೂರ್ಣವಾಗಿ ಚುಕ್ತಾ ಮಾಡಬಹುದು.',
      s5Title: '5. ಸಾಲ ಮುಕ್ತಾಯ & ನಿರಾಕ್ಷೇಪಣಾ ಪ್ರಮಾಣಪತ್ರ (NOC)',
      s5Text: 'ಸಾಲದ ಬಾಕಿ ಮೊತ್ತ ಶೂನ್ಯವಾದಾಗ (₹0.00), ಪರಿಶೀಲನಾ ಅಧಿಕಾರಿಗಳು ಖಾತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ 7 ಕೆಲಸದ ದಿನಗಳಲ್ಲಿ ಅಧಿಕೃತ ಸಾಲ ಮುಕ್ತಾಯ ಪ್ರಮಾಣಪತ್ರವನ್ನು (NOC reference: NOC-GGY-YYYY-XXXXXX) ನೀಡುತ್ತಾರೆ.',
      s6Title: '6. ಪ್ರಾಮಾಣಿಕ ವಸೂಲಾತಿ ನೀತಿ (Fair Recovery Code)',
      s6Text: 'ನಮ್ಮ ಸಿಬ್ಬಂದಿ ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಅನುಚಿತ ವರ್ತನೆ, ಬೆದರಿಕೆ ಅಥವಾ ಅವಮಾನಕರ ವಿಧಾನಗಳನ್ನು ಅನುಸರಿಸುವುದಿಲ್ಲ. ಬೆಳಿಗ್ಗೆ 8:00 ರಿಂದ ಸಂಜೆ 7:00 ರ ನಡುವೆ ಮಾತ್ರ ಗ್ರಾಹಕರನ್ನು ಭೇಟಿ ಮಾಡಲಾಗುತ್ತದೆ.',
      s7Title: '7. ಕುಂದುಕೊರತೆ ನಿವಾರಣಾ ವ್ಯವಸ್ಥೆ',
      s7Text: 'ಸೇವೆ ಅಥವಾ ಸಿಬ್ಬಂದಿ ಬಗ್ಗೆ ಯಾವುದೇ ದೂರುಗಳಿದ್ದಲ್ಲಿ:',
      s7Steps: [
        'ಹಂತ 1: ನಿಮ್ಮ ಸ್ಥಳೀಯ ಶಾಖಾ ವ್ಯವಸ್ಥಾಪಕರನ್ನು ಸಂಪರ್ಕಿಸಿ (ಮಂಡ್ಯ, ರಾಮನಗರ, ಮೈಸೂರು).',
        'ಹಂತ 2: ಮುಖ್ಯ ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ: ಶ್ರೀ ಎ. ದೇಶಮುಖ್ (ಇಮೇಲ್: grievance@ggyfinance.in, ಉಚಿತ ಕರೆ: 1800-209-4321). ಪರಿಹಾರದ ಕಾಲಮಿತಿ: 30 ದಿನಗಳು.',
        'ಹಂತ 3: 30 ದಿನಗಳಲ್ಲಿ ಪರಿಹಾರ ಸಿಗದಿದ್ದರೆ, ಕರ್ನಾಟಕ ರಾಜ್ಯ ಕಿರು ಸಾಲ ಕುಂದುಕೊರತೆ ನಿವಾರಣಾ ಡೆಸ್ಕ್ (grievance@ggyfinance.in) ಅಥವಾ ನಮ್ಮ ಪ್ರಧಾನ ಕಚೇರಿಗೆ ನೇರ ದೂರು ನೀಡಬಹುದು.'
      ]
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
            <Scale className="w-4 h-4 text-amber-200" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {t.title}
          </h1>
          <p className="text-amber-200 text-xs sm:text-sm font-bold">
            {t.effectiveDate}
          </p>
          <div className="bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-white text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto font-medium">
            {t.intro}
          </div>
        </div>
      </section>

      {/* Legal Terms Sections */}
      <main className="py-14 px-4 sm:px-8 max-w-4xl mx-auto flex-1 w-full space-y-6">
        {/* Section 1 */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-orange-600 shrink-0" />
            <span>{t.s1Title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{t.s1Text}</p>
        </div>

        {/* Section 2 */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{t.s2Title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{t.s2Text}</p>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{t.s3Title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{t.s3Text}</p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-1">
            {t.s3List.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4 */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{t.s4Title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{t.s4Text}</p>
        </div>

        {/* Section 5 */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
            <span>{t.s5Title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{t.s5Text}</p>
        </div>

        {/* Section 6 */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
            <span>{t.s6Title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{t.s6Text}</p>
        </div>

        {/* Section 7: Grievance Redressal (Deep Imperial Forest) */}
        <div className="bg-gradient-to-b from-[#064e3b] to-[#022c22] text-white p-7 sm:p-8 rounded-3xl border border-emerald-900 shadow-xl space-y-4">
          <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{t.s7Title}</span>
          </h3>
          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">{t.s7Text}</p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-100 pt-1">
            {t.s7Steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-900 border border-emerald-700 text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
