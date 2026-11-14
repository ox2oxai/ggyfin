'use client';

import React from 'react';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import { ShieldCheck, Lock, EyeOff, Server, UserCheck, HelpCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { lang } = useLanguage();

  const content = {
    en: {
      badge: 'Statutory Data Protection Policy',
      title: 'Privacy Policy & Data Governance',
      effectiveDate: 'Effective Date: April 1, 2026 | Last Updated: November 14, 2026',
      intro: 'GGY Finance Ltd. ("GGY Finance", "we", "our", or "the Company") is a Karnataka State-registered micro-lending platform (Reg No: KA-ML/2024/7742). We are committed to protecting the privacy, confidentiality, and security of our borrowers and customer applicants in strict compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act), Karnataka State Lending Guidelines, and UIDAI regulations.',
      s1Title: '1. Legislative Framework & Scope',
      s1Text: 'This Privacy Policy governs the collection, processing, storage, and retention of personal data collected through our field officers, web applications, and customer support channels across Karnataka.',
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
      s7Officer: 'Data Protection Officer (DPO) & Principal Nodal Officer: Shri A. Deshmukh',
      s7Address: 'GGY Finance Ltd., Regional Headquarters, Mandya, Karnataka - 571401',
      s7Email: 'dpo@ggyfinance.in | grievance@ggyfinance.in',
      s7Phone: 'Toll-Free Helpline: 1800-209-4321 (9:00 AM - 6:00 PM IST)'
    },
    kn: {
      badge: 'ಶಾಸನಬದ್ಧ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ನೀತಿ',
      title: 'ಗೌಪ್ಯತಾ ನೀತಿ ಮತ್ತು ಡೇಟಾ ಆಡಳಿತ (Privacy Policy)',
      effectiveDate: 'ಜಾರಿಗೆ ಬಂದ ದಿನಾಂಕ: 1 ಏಪ್ರಿಲ್ 2026 | ನವೀಕರಿಸಿದ್ದು: 14 ನವೆಂಬರ್ 2026',
      intro: 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ ಸಂಸ್ಥೆಯು ಕರ್ನಾಟಕ ರಾಜ್ಯ ನೋಂದಾಯಿತ ಕಿರು ಸಾಲ ಸಂಸ್ಥೆಯಾಗಿದ್ದು (ನೋಂದಣಿ ಸಂಖ್ಯೆ: KA-ML/2024/7742), ಭಾರತ ಸರ್ಕಾರದ ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ 2023 (DPDP Act) ಮತ್ತು ರಾಜ್ಯದ ಕಿರು ಸಾಲ ನಿಯಮಾವಳಿಗಳಿಗೆ ಬದ್ಧವಾಗಿದೆ.',
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
      s5Title: '5. ಭಾರತದಲ್ಲೇ ಡೇಟಾ ಸಂಗ್ರಹಣೆ (Indian Data Sovereignty)',
      s5Text: 'ನಮ್ಮ ಎಲ್ಲಾ ಸರ್ವರ್‌ಗಳು ಮತ್ತು ಡೇಟಾ ಕೇಂದ್ರಗಳು ಭಾರತದ ಮುಂಬೈ (AWS Mumbai ap-south-1) ವ್ಯಾಪ್ತಿಯಲ್ಲೇ ಇವೆ. ಯಾವುದೇ ಮಾಹಿತಿಯನ್ನು ವಿದೇಶಿ ಸರ್ವರ್‌ಗಳಿಗೆ ರವಾನಿಸುವುದಿಲ್ಲ.',
      s6Title: '6. ಗ್ರಾಹಕರ ಶಾಸನಬದ್ಧ ಹಕ್ಕುಗಳು (DPDP Rights)',
      s6Text: 'DPDP ಕಾಯ್ದೆಯನ್ವಯ ಪ್ರತಿಯೊಬ್ಬ ಗ್ರಾಹಕರಿಗೂ ಈ ಕೆಳಗಿನ ಹಕ್ಕುಗಳಿವೆ:',
      s6Rights: [
        'ಮಾಹಿತಿ ಪರಿಶೀಲನಾ ಹಕ್ಕು: ನಿಮ್ಮ ಸಾಲದ ಮಾಹಿತಿ ವಿವರಗಳನ್ನು ಪಡೆಯುವ ಹಕ್ಕು.',
        'ತಿದ್ದುಪಡಿ ಹಕ್ಕು: ತಪ್ಪಾದ ವಿಳಾಸ ಅಥವಾ ವಿವರಗಳನ್ನು ಸರಿಪಡಿಸಿಕೊಳ್ಳುವ ಹಕ್ಕು.',
        'ದಾಖಲೆ ಅಳಿಸುವ ಹಕ್ಕು: ಸಾಲ ಪೂರ್ಣವಾಗಿ ಚುಕ್ತಾ ಆಗಿ ನಿರಾಕ್ಷೇಪಣಾ ಪ್ರಮಾಣಪತ್ರ (NOC) ಪಡೆದ ನಂತರ ಡೇಟಾ ಅಳಿಸಲು ವಿನಂತಿಸುವ ಹಕ್ಕು.',
        'ದೂರು ಸಲ್ಲಿಕೆ ಹಕ್ಕು: ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಅಧಿಕಾರಿಗೆ ನೇರವಾಗಿ ದೂರು ಸಲ್ಲಿಸುವ ಹಕ್ಕು.'
      ],
      s7Title: '7. ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಅಧಿಕಾರಿಗಳ ವಿವರ',
      s7Officer: 'ಮುಖ್ಯ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಅಧಿಕಾರಿ (DPO): ಶ್ರೀ ಎ. ದೇಶಮುಖ್',
      s7Address: 'ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ ಲಿಮಿಟೆಡ್, ಪ್ರಾದೇಶಿಕ ಕಚೇರಿ, ಮಂಡ್ಯ, ಕರ್ನಾಟಕ - 571401',
      s7Email: 'dpo@ggyfinance.in | grievance@ggyfinance.in',
      s7Phone: 'ಉಚಿತ ಸಹಾಯವಾಣಿ: 1800-209-4321 (ಬೆಳಿಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 6 ರವರೆಗೆ)'
    }
  };

  const t = content[lang];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <section className="bg-sandstone-50 py-12 px-4 border-b border-clay/60">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-forest-900 tracking-tight">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-forest-800/70 mt-2 font-medium">
            {t.effectiveDate}
          </p>
          <p className="text-xs sm:text-sm text-forest-800/80 mt-4 leading-relaxed bg-sandstone-100 p-4 rounded-xl border border-clay/60">
            {t.intro}
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-sandstone-100 flex-1">
        <div className="max-w-4xl mx-auto space-y-8 text-xs sm:text-sm text-forest-800/90 leading-relaxed">
          {/* Section 1 */}
          <div className="bg-sandstone-50 p-6 rounded-2xl border border-clay shadow-xs space-y-2">
            <h3 className="font-bold text-base text-forest-900">{t.s1Title}</h3>
            <p>{t.s1Text}</p>
          </div>

          {/* Section 2 */}
          <div className="bg-sandstone-50 p-6 rounded-2xl border border-clay shadow-xs space-y-2">
            <h3 className="font-bold text-base text-forest-900">{t.s2Title}</h3>
            <p>{t.s2Text}</p>
          </div>

          {/* Section 3 */}
          <div className="bg-sandstone-50 p-6 rounded-2xl border border-clay shadow-xs space-y-4">
            <h3 className="font-bold text-base text-forest-900">{t.s3Title}</h3>

            <div className="bg-sandstone-100 p-4 rounded-xl border border-clay/60 space-y-2">
              <h4 className="font-bold text-emerald-800 text-xs sm:text-sm">{t.s3CollectTitle}</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs text-forest-800">
                {t.s3CollectList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-2">
              <h4 className="font-bold text-rose-800 text-xs sm:text-sm">{t.s3NeverTitle}</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs text-rose-900">
                {t.s3NeverList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-sandstone-50 p-6 rounded-2xl border border-clay shadow-xs space-y-2">
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-terracotta-600" />
              <span>{t.s4Title}</span>
            </h3>
            <p>{t.s4Text}</p>
          </div>

          {/* Section 5 */}
          <div className="bg-sandstone-50 p-6 rounded-2xl border border-clay shadow-xs space-y-2">
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>{t.s5Title}</span>
            </h3>
            <p>{t.s5Text}</p>
          </div>

          {/* Section 6 */}
          <div className="bg-sandstone-50 p-6 rounded-2xl border border-clay shadow-xs space-y-3">
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-terracotta-600" />
              <span>{t.s6Title}</span>
            </h3>
            <p>{t.s6Text}</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-forest-800">
              {t.s6Rights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section 7 */}
          <div className="bg-forest-800 text-sandstone-100 p-6 rounded-2xl border border-forest-600 shadow-md space-y-2">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-terracotta-400" />
              <span>{t.s7Title}</span>
            </h3>
            <p className="text-sandstone-200 text-xs font-semibold">{t.s7Officer}</p>
            <p className="text-sandstone-300 text-xs">{t.s7Address}</p>
            <p className="text-sandstone-300 text-xs">{t.s7Email}</p>
            <p className="text-terracotta-400 font-bold text-xs">{t.s7Phone}</p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
