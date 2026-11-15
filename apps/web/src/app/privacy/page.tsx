'use client';

import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import { ShieldCheck, Lock, EyeOff, Server, UserCheck, HelpCircle } from 'lucide-react';
import { getInstitutionConfigSync, InstitutionConfig } from '../../lib/institution';

export default function PrivacyPolicyPage() {
  const { lang } = useLanguage();
  const [config, setConfig] = useState<InstitutionConfig>(getInstitutionConfigSync());

  useEffect(() => {
    const handleSync = () => setConfig(getInstitutionConfigSync());
    handleSync();
    window.addEventListener('nbfc_config_updated', handleSync);
    return () => window.removeEventListener('nbfc_config_updated', handleSync);
  }, []);

  const content = {
    en: {
      badge: 'Statutory Data Protection Policy',
      title: 'Privacy Policy & Data Governance',
      effectiveDate: 'Effective Date: April 1, 2026 | Last Updated: November 15, 2026',
      intro: `${config.organizationName || 'GGY Finance Ltd.'} ("we", "our", or "the Company") is a registered micro-lending institution (Reg No: ${config.registrationNumber || 'NBFC-ND/2026/7742'}). We are committed to protecting the privacy, confidentiality, and security of our borrowers and customer applicants in strict compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act), RBI Master Directions on Microfinance, and UIDAI regulations.`,
      s1Title: '1. Legislative Framework & Scope',
      s1Text: 'This Privacy Policy governs the collection, processing, storage, and retention of personal data collected through our field officers, web applications, and customer support channels across our operating jurisdictions.',
      s2Title: '2. Principles of Data Minimization & Consent',
      s2Text: 'We adhere strictly to the principle of purpose limitation. We only collect data necessary to evaluate creditworthiness, fulfill statutory KYC, and service loan accounts. Every customer must provide affirmative, explicit DPDP consent before an application is drafted.',
      s3Title: '3. What We Collect vs. What We NEVER Collect',
      s3CollectTitle: 'Information We Collect:',
      s3CollectList: [
        'Demographic details: Full Name, Date of Birth, Gender, Address, Village/Taluk, Pincode.',
        'Contact Information: Mobile Phone Number (for TRAI DLT OTPs, transactional SMS, and WhatsApp alerts).',
        'Statutory KYC Identifiers: Masked Aadhaar (strictly XXXX-XXXX-1234 format), PAN Card, Voter ID.',
        'Financial Profile: Bank account number, IFSC code, and UPI VPA for credit disbursement and repayment.'
      ],
      s3NeverTitle: 'What We NEVER Collect (Strict Zero-Intrusion Policy):',
      s3NeverList: [
        'Raw, unmasked 12-digit Aadhaar numbers (strictly forbidden per UIDAI regulations).',
        'Biometric fingerprints or iris scans.',
        'Phone contact books, SMS conversation logs, call logs, or social media accounts.',
        'Continuous background GPS or mobile device media galleries.'
      ],
      s4Title: '4. Cryptographic Encryption & Vault Security',
      s4Text: 'All uploaded KYC documents, identity proofs, and customer photographs are envelope-encrypted using authenticated AES-256-GCM prior to touching storage. Checkers inspect documents via single-use, 60-second ephemeral HMAC view tokens. Decrypted documents are never cached on staff workstations.',
      s5Title: '5. Indian Data Sovereignty (Data Localization)',
      s5Text: '100% of our customer database, transactions ledger, and encrypted document vaults are stored exclusively inside Indian territorial borders (AWS Mumbai ap-south-1). No customer data is ever transferred, mirrored, or processed overseas.',
      s6Title: '6. Rights of the Data Principal (Your Rights)',
      s6Text: 'Under the DPDP Act 2023, you have the following rights:',
      s6Rights: [
        'Right to Access: Request a summary of your personal data and processing activities.',
        'Right to Correction: Request correction of inaccurate, outdated, or incomplete data.',
        'Right to Erasure upon Loan Closure: Request erasure of non-statutory records once your loan has reached an exact ₹0.00 balance and a formal No-Dues Certificate (NOC) has been issued.',
        'Right to Grievance Redressal: Redress grievances directly with our Data Protection Officer.'
      ],
      s7Title: '7. Data Protection & Grievance Contact',
      s7Officer: `Data Protection Officer (DPO) & Principal Nodal Officer: ${config.nodalOfficerName || 'Smt. Anita Deshmukh'}`,
      s7Address: `${config.organizationName || 'GGY Finance Ltd.'}, Registered Head Office: ${config.headOfficeAddress}`,
      s7Email: `${config.supportEmail || 'support@ggyfinance.in'}`,
      s7Phone: `Helpline: ${config.supportPhone || '1800-889-2020'} (9:00 AM - 6:00 PM IST)`
    },
    kn: {
      badge: 'ಶಾಸನಬದ್ಧ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ನೀತಿ',
      title: 'ಗೌಪ್ಯತಾ ನೀತಿ ಮತ್ತು ಡೇಟಾ ಆಡಳಿತ (Privacy Policy)',
      effectiveDate: 'ಜಾರಿಗೆ ಬಂದ ದಿನಾಂಕ: 1 ಏಪ್ರಿಲ್ 2026 | ನವೀಕರಿಸಿದ್ದು: 15 ನವೆಂಬರ್ 2026',
      intro: `${config.organizationName || 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್'} ಸಂಸ್ಥೆಯು ನೋಂದಾಯಿತ ಕಿರು ಸಾಲ ಸಂಸ್ಥೆಯಾಗಿದ್ದು (ನೋಂದಣಿ ಸಂಖ್ಯೆ: ${config.registrationNumber || 'NBFC-ND/2026/7742'}), ಭಾರತ ಸರ್ಕಾರದ ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ 2023 (DPDP Act) ಮತ್ತು ಕಿರು ಸಾಲ ನಿಯಮಾವಳಿಗಳಿಗೆ ಬದ್ಧವಾಗಿದೆ.`,
      s1Title: '1. ನಿಯಂತ್ರಣ ಚೌಕಟ್ಟು ಮತ್ತು ವ್ಯಾಪ್ತಿ',
      s1Text: 'ಈ ಗೌಪ್ಯತಾ ನೀತಿಯು ನಮ್ಮ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳು ಮತ್ತು ಸಾಲ ಪೋರ್ಟಲ್ ಮೂಲಕ ಸಂಗ್ರಹಿಸಲಾಗುವ ಎಲ್ಲಾ ಗ್ರಾಹಕರ ಮಾಹಿತಿಯ ಸುರಕ್ಷತೆಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.',
      s2Title: '2. ಸ್ಪಷ್ಟ ಸಮ್ಮತಿ (DPDP Consent)',
      s2Text: 'ಗ್ರಾಹಕರ ಸ್ಪಷ್ಟ ಸಮ್ಮತಿಯಿಲ್ಲದೆ ಯಾವುದೇ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ. ಸಾಲ ಮಂಜೂರಾತಿ ಮತ್ತು ನಿಯಂತ್ರಕ ಕೆವೈಸಿ (KYC) ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ ಮಾಹಿತಿಯನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.',
      s3Title: '3. ನಾವು ಪಡೆಯುವ ಮತ್ತು ಪಡೆಯದ ಮಾಹಿತಿಗಳು',
      s3CollectTitle: 'ನಾವು ಪಡೆಯುವ ಮಾಹಿತಿಗಳು:',
      s3CollectList: [
        'ವೈಯಕ್ತಿಕ ವಿವರ: ಪೂರ್ಣ ಹೆಸರು, ಜನ್ಮ ದಿನಾಂಕ, ಲಿಂಗ, ಗ್ರಾಮ/ತಾಲೂಕು, ವಿಳಾಸ, ಪಿನ್‌ಕೋಡ್.',
        'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ: ಮಾಸಿಕ ಇಎಂಐ ಎಸ್‌ಎಂಎಸ್ ಮತ್ತು ಯುಪಿಐ ಪಾವತಿ ದೃಢೀಕರಣಕ್ಕಾಗಿ.',
        'ಕೆವೈಸಿ ಗುರುತು: ಆಧಾರ್‌ನ ಕೊನೆಯ 4 ಅಂಕಿಗಳು (XXXX-XXXX-1234), ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಅಥವಾ ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ.',
        'ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರ: ಸಾಲದ ಹಣ ಜಮೆ ಮತ್ತು ಮರುಪಾವತಿಗಾಗಿ.'
      ],
      s3NeverTitle: 'ನಾವು ಎಂದಿಗೂ ಪಡೆಯದ ಮಾಹಿತಿಗಳು (Zero Intrusion):',
      s3NeverList: [
        'ಪೂರ್ಣ 12 ಅಂಕಿಗಳ ಅನ್‌ಮಾಸ್ಕ್ಡ್ ಆಧಾರ್ ಸಂಖ್ಯೆ (ಯುಐಡಿಎಐ ನಿಷೇಧಿಸಿದೆ).',
        'ಬಯೋಮೆಟ್ರಿಕ್ ಫಿಂಗರ್‌ಪ್ರಿಂಟ್ ಅಥವಾ ಕಣ್ಣಿನ ಸ್ಕ್ಯಾನ್.',
        'ನಿಮ್ಮ ಫೋನ್ ಕಾಂಟ್ಯಾಕ್ಟ್‌ಗಳು, ಖಾಸಗಿ ಮೆಸೇಜ್‌ಗಳು ಅಥವಾ ಫೋಟೋ ಗ್ಯಾಲರಿ.',
        'ನಿರಂತರ ಜಿಪಿಎಸ್ ಲೊಕೇಶನ್ ಟ್ರ್ಯಾಕಿಂಗ್.'
      ],
      s4Title: '4. ಗೂಢಲಿಪೀಕರಣ ಮತ್ತು ವಾಲ್ಟ್ ಭದ್ರತೆ (AES-256-GCM)',
      s4Text: 'ಗ್ರಾಹಕರ ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯನ್ನು ಅತ್ಯುನ್ನತ ಮಿಲಿಟರಿ ದರ್ಜೆಯ AES-256-GCM ಗೂಢಲಿಪೀಕರಣದ ಮೂಲಕ ಸರ್ವರ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿಡಲಾಗುತ್ತದೆ. ಪರಿಶೀಲನಾ ಅಧಿಕಾರಿಗಳು ಕೇವಲ 60 ಸೆಕೆಂಡುಗಳ ಕಾಲಾವಧಿಯ ತಾತ್ಕಾಲಿಕ ಟೋಕನ್ ಮೂಲಕ ಮಾತ್ರ ದಾಖಲೆಯನ್ನು ನೋಡಬಹುದು.',
      s5Title: '5. ಭಾರತೀಯ ಡೇಟಾ ಸಾರ್ವಭೌಮತ್ವ (Data Localization)',
      s5Text: '100% ಗ್ರಾಹಕರ ಮಾಹಿತಿ ಮತ್ತು ದಾಖಲೆಗಳು ಭಾರತೀಯ ಗಡಿಗಳೊಳಗಿನ ಸರ್ವರ್‌ಗಳಲ್ಲಿ ಮಾತ್ರ ಸಂಗ್ರಹವಾಗುತ್ತವೆ. ಯಾವುದೇ ಡೇಟಾವನ್ನು ವಿದೇಶಿ ಸರ್ವರ್‌ಗಳಿಗೆ ರವಾನಿಸುವುದಿಲ್ಲ.',
      s6Title: '6. ಡೇಟಾ ಪ್ರಿನ್ಸಿಪಾಲ್ ಹಕ್ಕುಗಳು (ನಿಮ್ಮ ಹಕ್ಕುಗಳು)',
      s6Text: 'DPDP ಕಾಯ್ದೆ 2023 ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಹಕ್ಕುಗಳು:',
      s6Rights: [
        'ಮಾಹಿತಿ ಪರಿಶೀಲಿಸುವ ಹಕ್ಕು: ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಪ್ರಕ್ರಿಯೆಯ ಸಾರಾಂಶವನ್ನು ಪಡೆಯಬಹುದು.',
        'ತಿದ್ದುಪಡಿ ಹಕ್ಕು: ತಪ್ಪಾದ ಅಥವಾ ಅಪೂರ್ಣ ಮಾಹಿತಿಯನ್ನು ನವೀಕರಿಸಲು ಕೋರಬಹುದು.',
        'ದಾಖಲೆ ಅಳಿಸುವ ಹಕ್ಕು: ಸಾಲ ಪೂರ್ಣ ಮರುಪಾವತಿಯಾಗಿ ₹0.00 ಬಾಕಿ ಪ್ರಮಾಣಪತ್ರ (NOC) ಪಡೆದ ನಂತರ ದಾಖಲೆಗಳನ್ನು ಅಳಿಸಲು ಕೋರಬಹುದು.',
        'ದೂರು ನಿವಾರಣಾ ಹಕ್ಕು: ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿಗೆ ನೇರವಾಗಿ ದೂರು ಸಲ್ಲಿಸಬಹುದು.'
      ],
      s7Title: '7. ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಮತ್ತು ಕುಂದುಕೊರತೆ ಸಂಪರ್ಕ',
      s7Officer: `ಮುಖ್ಯ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಅಧಿಕಾರಿ & ನೊಡಲ್ ಅಧಿಕಾರಿ: ${config.nodalOfficerName || 'ಶ್ರೀಮತಿ ಅನಿತಾ ದೇಶಮುಖ್'}`,
      s7Address: `${config.organizationName || 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್'}, ಪ್ರಧಾನ ಕಚೇರಿ: ${config.headOfficeAddress}`,
      s7Email: `${config.supportEmail || 'support@ggyfinance.in'}`,
      s7Phone: `ಸಹಾಯವಾಣಿ: ${config.supportPhone || '1800-889-2020'}`
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-[#062e1c] text-white pt-14 pb-16 px-4 sm:px-10 text-center border-b border-emerald-950">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/60 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t.title}
          </h1>
          <p className="text-xs font-mono text-emerald-300/90">
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
            <Server className="w-5 h-5 text-orange-600" />
            <span>{t.s1Title}</span>
          </h2>
          <p>{t.s1Text}</p>
        </div>

        {/* Section 2 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-700" />
            <span>{t.s2Title}</span>
          </h2>
          <p>{t.s2Text}</p>
        </div>

        {/* Section 3 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-amber-600" />
            <span>{t.s3Title}</span>
          </h2>

          <div className="space-y-2">
            <p className="font-bold text-slate-900">{t.s3CollectTitle}</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              {t.s3CollectList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="font-bold text-red-700">{t.s3NeverTitle}</p>
            <ul className="list-disc pl-5 space-y-1 text-red-900/80">
              {t.s3NeverList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 4 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-700" />
            <span>{t.s4Title}</span>
          </h2>
          <p>{t.s4Text}</p>
        </div>

        {/* Section 5 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <span>{t.s5Title}</span>
          </h2>
          <p>{t.s5Text}</p>
        </div>

        {/* Section 6 */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-orange-600" />
            <span>{t.s6Title}</span>
          </h2>
          <p>{t.s6Text}</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            {t.s6Rights.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Section 7 */}
        <div className="p-6 bg-emerald-50/70 rounded-3xl border border-emerald-200 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-emerald-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>{t.s7Title}</span>
          </h2>
          <div className="space-y-1.5 text-emerald-900 font-medium">
            <p className="font-bold text-emerald-950">{t.s7Officer}</p>
            <p>{t.s7Address}</p>
            <p className="font-mono text-xs">{t.s7Email}</p>
            <p className="font-mono text-xs">{t.s7Phone}</p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
