'use client';

import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import { Scale, FileText, CheckCircle2, AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import { getInstitutionConfigSync, InstitutionConfig, DEFAULT_INSTITUTION_CONFIG } from '../../lib/institution';

export default function TermsAndConditionsPage() {
  const { lang } = useLanguage();
  const [config, setConfig] = useState<InstitutionConfig>(DEFAULT_INSTITUTION_CONFIG);

  useEffect(() => {
    const handleSync = () => setConfig(getInstitutionConfigSync());
    handleSync();
    window.addEventListener('nbfc_config_updated', handleSync);
    return () => window.removeEventListener('nbfc_config_updated', handleSync);
  }, []);

  const content = {
    en: {
      badge: 'Statutory Fair Practices Code',
      title: 'Terms & Conditions of Lending',
      effectiveDate: 'Effective Date: April 1, 2026 | Last Updated: November 15, 2026',
      intro: `These Terms and Conditions constitute a legally binding agreement between the borrower ("Applicant", "Borrower", "you") and ${config.organizationName || 'GGY Finance Ltd.'} ("Lender", "we", "us"). The Lender is a registered micro-lending institution (Reg No: ${config.registrationNumber || 'NBFC-ND/2026/7742'}) and strictly adheres to the Fair Practices Code (FPC) and RBI Master Directions on Microfinance.`,
      s1Title: '1. Loan Origination & Key Fact Statement (KFS)',
      s1Text: 'Every approved loan is governed by an individualized Key Fact Statement (KFS) provided prior to disbursement. The KFS explicitly details the loan amount, Annual Percentage Rate (APR), processing fee (1.5% of principal plus 18% GST), monthly EMI amount, and complete reducing balance amortization schedule. No fee not disclosed in the KFS shall ever be charged.',
      s2Title: '2. Interest Rate & Reducing Balance Calculation',
      s2Text: 'Interest is charged strictly on the diminishing/reducing balance of the principal outstanding. We strictly prohibit flat-rate or compound interest traps. Interest accrues daily on the remaining principal and is payable monthly.',
      s3Title: '3. Repayment Channels & Receipts',
      s3Text: 'Borrowers may repay through two sanctioned channels exclusively:',
      s3List: [
        'Dynamic Universal UPI QR: Scannable via any UPI application (PhonePe, GPay, Paytm, BHIM) with instant automated digital confirmation.',
        'Authorized Branch Cash Receipt: Cash handed to field officers or branch cashiers must be accompanied by an immediate printed/SMS receipt. Cash is credited to your ledger upon dual-control manager verification.'
      ],
      s4Title: '4. Zero Pre-Payment & Foreclosure Penalties',
      s4Text: 'In accordance with Fair Practices Code guidelines, borrowers have the right to prepay or foreclose their loan in part or in full at any time with ZERO pre-payment penalty or foreclosure fee.',
      s5Title: '5. Zero-Balance Loan Closure & No-Dues Certificate (NOC)',
      s5Text: 'Upon complete settlement of all dues (when the account reaches an exact ₹0.00 balance), the loan is reviewed under Maker-Checker dual control. The Authorizer shall formally issue an official No-Dues Certificate (NOC reference: NOC-GGY-YYYY-XXXXXX) within 7 business days, releasing all liabilities.',
      s6Title: '6. Fair Recovery Practices & Code of Conduct',
      s6Text: 'Field staff and recovery personnel strictly adhere to civilized, ethical conduct. We never engage in intimidation, harassment, public shaming, visits at unearthly hours (visits permitted only between 8:00 AM and 7:00 PM), or contact with relatives/references without legal authorization.',
      s7Title: '7. Grievance Redressal Mechanism',
      s7Text: 'If you have any grievance regarding service, repayment, or staff conduct:',
      s7Steps: [
        'Step 1: Contact your primary branch office or relationship manager.',
        `Step 2: Escalate to the Principal Nodal Officer: ${config.nodalOfficerName || 'Smt. Anita Deshmukh'} (Email: ${config.supportEmail || 'grievance@ggyfinance.in'}, Helpline: ${config.supportPhone || '1800-889-2020'}). Timeframe for resolution: 30 calendar days.`,
        `Step 3: If unresolved within 30 days, you may escalate to the Institutional Grievance Redressal Desk at ${config.supportEmail || 'grievance@ggyfinance.in'} or visit our designated Nodal Office.`
      ]
    },
    kn: {
      badge: 'ಶಾಸನಬದ್ಧ ಪ್ರಾಮಾಣಿಕ ಸಾಲ ನೀತಿ',
      title: 'ಸಾಲದ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು (Terms & Conditions)',
      effectiveDate: 'ಜಾರಿಗೆ ಬಂದ ದಿನಾಂಕ: 1 ಏಪ್ರಿಲ್ 2026 | ನವೀಕರಿಸಿದ್ದು: 15 ನವೆಂಬರ್ 2026',
      intro: `ಈ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು ಸಾಲಗಾರರು ಮತ್ತು ${config.organizationName || 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್'} ನಡುವಿನ ಕಾನೂನುಬದ್ಧ ಒಪ್ಪಂದವಾಗಿದೆ. ಸಂಸ್ಥೆಯು ನೋಂದಾಯಿತ ಕಿರು ಸಾಲ ಸಂಸ್ಥೆಯಾಗಿದ್ದು (ನೋಂದಣಿ ಸಂಖ್ಯೆ: ${config.registrationNumber || 'NBFC-ND/2026/7742'}), ಪ್ರಾಮಾಣಿಕ ಸಾಲ ನೀತಿಯನ್ನು (Fair Practices Code) ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಪಾಲಿಸುತ್ತದೆ.`,
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
      s4Text: 'ಗ್ರಾಹಕರು ತಮ್ಮ ಸಾಲವನ್ನು ಅವಧಿಗಿಂತ ಮುಂಚಿತವಾಗಿ ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ದಂಡ ಅಥವಾ ಶುಲ್ಕವಿಲ್ಲದೆ (Zero Penalty) ಪೂರ್ಣವಾಗಿ ಚುಕ್ತಾ ಮಾಡಬಹುದು.',
      s5Title: '5. ಸಾಲ ಮುಕ್ತಾಯ & ನಿರಾಕ್ಷೇಪಣಾ ಪ್ರಮಾಣಪತ್ರ (NOC)',
      s5Text: 'ಸಾಲದ ಬಾಕಿ ಮೊತ್ತ ಶೂನ್ಯವಾದಾಗ (₹0.00), ಪರಿಶೀಲನಾ ಅಧಿಕಾರಿಗಳು ಖಾತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ 7 ಕೆಲಸದ ದಿನಗಳಲ್ಲಿ ಅಧಿಕೃತ ಸಾಲ ಮುಕ್ತಾಯ ಪ್ರಮಾಣಪತ್ರವನ್ನು (NOC reference: NOC-GGY-YYYY-XXXXXX) ನೀಡುತ್ತಾರೆ.',
      s6Title: '6. ಪ್ರಾಮಾಣಿಕ ವಸೂಲಾತಿ ನೀತಿ (Fair Recovery Code)',
      s6Text: 'ನಮ್ಮ ಸಿಬ್ಬಂದಿ ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಅನುಚಿತ ವರ್ತನೆ, ಬೆದರಿಕೆ ಅಥವಾ ಅವಮಾನಕರ ವಿಧಾನಗಳನ್ನು ಅನುಸರಿಸುವುದಿಲ್ಲ. ಬೆಳಿಗ್ಗೆ 8:00 ರಿಂದ ಸಂಜೆ 7:00 ರ ನಡುವೆ ಮಾತ್ರ ಗ್ರಾಹಕರನ್ನು ಭೇಟಿ ಮಾಡಲಾಗುತ್ತದೆ.',
      s7Title: '7. ಕುಂದುಕೊರತೆ ನಿವಾರಣಾ ವ್ಯವಸ್ಥೆ',
      s7Text: 'ಸೇವೆ ಅಥವಾ ಸಿಬ್ಬಂದಿ ಬಗ್ಗೆ ಯಾವುದೇ ದೂರುಗಳಿದ್ದಲ್ಲಿ:',
      s7Steps: [
        'ಹಂತ 1: ನಿಮ್ಮ ಸ್ಥಳೀಯ ಶಾಖಾ ಕಚೇರಿ ಅಥವಾ ವ್ಯವಸ್ಥಾಪಕರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        `ಹಂತ 2: ಮುಖ್ಯ ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ: ${config.nodalOfficerName || 'ಶ್ರೀಮತಿ ಅನಿತಾ ದೇಶಮುಖ್'} (ಇಮೇಲ್: ${config.supportEmail || 'grievance@ggyfinance.in'}, ಸಹಾಯವಾಣಿ: ${config.supportPhone || '1800-889-2020'}). ಪರಿಹಾರದ ಕಾಲಮಿತಿ: 30 ದಿನಗಳು.`,
        `ಹಂತ 3: 30 ದಿನಗಳಲ್ಲಿ ಪರಿಹಾರ ಸಿಗದಿದ್ದರೆ, ಕುಂದುಕೊರತೆ ನಿವಾರಣಾ ಡೆಸ್ಕ್ ಅಥವಾ ನಮ್ಮ ಪ್ರಧಾನ ಕಚೇರಿಗೆ ನೇರ ದೂರು ನೀಡಬಹುದು.`
      ]
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white pt-16 pb-20 px-4 sm:px-10 text-center border-b border-orange-800 shadow-inner overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm">
            <Scale className="w-4 h-4 text-amber-200" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
            {t.title}
          </h1>
          <p className="text-xs font-mono text-amber-100">
            {t.effectiveDate}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <p className="font-semibold text-slate-900 text-sm sm:text-base leading-relaxed">
            {t.intro}
          </p>
        </div>

        {/* Section 1 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            <span>{t.s1Title}</span>
          </h2>
          <p>{t.s1Text}</p>
        </div>

        {/* Section 2 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <span>{t.s2Title}</span>
          </h2>
          <p>{t.s2Text}</p>
        </div>

        {/* Section 3 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>{t.s3Title}</span>
          </h2>
          <p>{t.s3Text}</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            {t.s3List.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Section 4 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>{t.s4Title}</span>
          </h2>
          <p>{t.s4Text}</p>
        </div>

        {/* Section 5 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>{t.s5Title}</span>
          </h2>
          <p>{t.s5Text}</p>
        </div>

        {/* Section 6 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>{t.s6Title}</span>
          </h2>
          <p>{t.s6Text}</p>
        </div>

        {/* Section 7 */}
        <div className="p-6 bg-emerald-50/70 rounded-3xl border border-emerald-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-emerald-950 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <span>{t.s7Title}</span>
          </h2>
          <p>{t.s7Text}</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-emerald-900 font-medium">
            {t.s7Steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
