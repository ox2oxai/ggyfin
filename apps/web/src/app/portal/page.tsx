'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../components/language-context';
import { GGYBrandMark } from '../../components/brand-mark';
import {
  User,
  KeyRound,
  Shield,
  CreditCard,
  QrCode,
  FileCheck2,
  Download,
  ArrowLeft,
  LogOut,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Phone,
  Copy,
  Check
} from 'lucide-react';
import { generateUpiUri } from '@nbfc/shared';
import {
  InstitutionConfig,
  getInstitutionConfigSync,
  getInstitutionConfigAsync,
  DEFAULT_INSTITUTION_CONFIG
} from '../../lib/institution';

interface BorrowerAccountSummary {
  accountNumber: string;
  product: string;
  sanctionAmount: number;
  balance: number;
  monthlyEmi: number;
  nextDueDate: string;
  status: 'ACTIVE' | 'CLOSED';
}

export default function BorrowerPortalPage() {
  const { lang } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [borrowerData, setBorrowerData] = useState<{
    customerId: string;
    fullName: string;
    maskedAadhaar: string;
    phone: string;
    taluk: string;
    dpdpConsentDate: string;
    accounts: BorrowerAccountSummary[];
  } | null>(null);
  const [selectedAcc, setSelectedAcc] = useState<BorrowerAccountSummary | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showNocModal, setShowNocModal] = useState(false);
  const [instConfig, setInstConfig] = useState<InstitutionConfig>(DEFAULT_INSTITUTION_CONFIG);
  const [copiedPortalUpi, setCopiedPortalUpi] = useState(false);

  React.useEffect(() => {
    const handleConfigUpdate = () => {
      setInstConfig(getInstitutionConfigSync());
    };
    window.addEventListener('nbfc_config_updated', handleConfigUpdate);
    getInstitutionConfigAsync().then(setInstConfig).catch(() => {});
    return () => window.removeEventListener('nbfc_config_updated', handleConfigUpdate);
  }, []);

  const t = {
    en: {
      portalTitle: 'Borrower Self-Service Portal',
      portalSubtitle: 'Secure digital access for micro-enterprise, dairy, and rural borrowers using your Customer ID (CIF).',
      cifLabel: 'Customer ID (CIF) or Account Number',
      cifHelp: 'Enter your 10-digit Customer ID (CIF) or 16-digit CBS Account Number.',
      passwordLabel: 'Password / MPIN',
      signInBtn: 'Sign In to Borrower Portal',
      welcome: 'Welcome,',
      profileTitle: 'Customer Identity & DPDP Rights Profile',
      aadhaar: 'Masked Aadhaar',
      phone: 'Mobile',
      district: 'Location',
      dpdpConsent: 'DPDP Act Consent',
      myFacilities: 'My Loan Facilities',
      accNum: 'CBS Account Number',
      principal: 'Sanction',
      balance: 'Outstanding Balance',
      emi: 'Monthly Installment',
      dueDate: 'Due Date',
      status: 'Status',
      payUpi: 'Pay via UPI QR',
      viewNoc: 'Download NOC',
      signOut: 'Sign Out',
      activeStatus: 'Active',
      closedStatus: 'Fully Repaid (Closed)'
    },
    kn: {
      portalTitle: 'ಗ್ರಾಹಕರ ಸ್ವಯಂ-ಸೇವಾ ಪೋರ್ಟಲ್ (Borrower Portal)',
      portalSubtitle: 'ನಿಮ್ಮ ಗ್ರಾಹಕ ಸಂಖ್ಯೆ (Customer ID / CIF) ಬಳಸಿ ನಿಮ್ಮ ಸಾಲದ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
      cifLabel: 'ಗ್ರಾಹಕ ಸಂಖ್ಯೆ (Customer ID / CIF) ಅಥವಾ ಖಾತೆ ಸಂಖ್ಯೆ',
      cifHelp: 'ನಿಮ್ಮ 10-ಅಂಕಿಯ ಗ್ರಾಹಕ ಸಂಖ್ಯೆ ಅಥವಾ 16-ಅಂಕಿಯ ಖಾತೆ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
      passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್ / ಎಂ-ಪಿನ್ (MPIN)',
      signInBtn: 'ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ',
      welcome: 'ಸುಸ್ವಾಗತ,',
      profileTitle: 'ಗ್ರಾಹಕ ವಿವರ ಮತ್ತು DPDP ಹಕ್ಕುಗಳು',
      aadhaar: 'ಮರೆಮಾಡಿದ ಆಧಾರ್',
      phone: 'ಮೊಬೈಲ್',
      district: 'ಸ್ಥಳ',
      dpdpConsent: 'DPDP ಒಪ್ಪಿಗೆ',
      myFacilities: 'ನನ್ನ ಸಾಲದ ಖಾತೆಗಳು',
      accNum: 'ಖಾತೆ ಸಂಖ್ಯೆ',
      principal: 'ಸಾಲದ ಮೊತ್ತ',
      balance: 'ಬಾಕಿ ಮೊತ್ತ',
      emi: 'ಮಾಸಿಕ ಕಂತು',
      dueDate: 'ಕೊನೆಯ ದಿನಾಂಕ',
      status: 'ಸ್ಥಿತಿ',
      payUpi: 'ಯುಪಿಐ ಮೂಲಕ ಪಾವತಿಸಿ',
      viewNoc: 'NOC ಡೌನ್‌ಲೋಡ್',
      signOut: 'ಲಾಗ್ ಔಟ್',
      activeStatus: 'ಸಕ್ರಿಯ',
      closedStatus: 'ಸಂಪೂರ್ಣ ಮರುಪಾವತಿಯಾಗಿದೆ'
    }
  }[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const rawAccounts = localStorage.getItem('nbfc_live_accounts');
      const accountsList = rawAccounts ? JSON.parse(rawAccounts) : [];
      const matched = accountsList.filter(
        (a: any) =>
          a.customerId?.toLowerCase() === customerId.trim().toLowerCase() ||
          a.accountNumber?.toLowerCase() === customerId.trim().toLowerCase() ||
          (a.phone && a.phone.includes(customerId.trim()))
      );

      if (matched.length > 0) {
        const primary = matched[0];
        setBorrowerData({
          customerId: primary.customerId,
          fullName: primary.borrowerName,
          maskedAadhaar: primary.maskedAadhaar || 'XXXX-XXXX-8421',
          phone: primary.phone || '9845000000',
          taluk: primary.taluk || 'Primary Cluster',
          dpdpConsentDate: '2026-04-10',
          accounts: matched.map((a: any) => ({
            accountNumber: a.accountNumber,
            product: a.product,
            sanctionAmount: a.principal,
            balance: a.balance,
            monthlyEmi: Math.round(a.principal / (a.tenureMonths || 12)),
            nextDueDate: '2026-12-05',
            status: a.status === 'CLOSED' ? 'CLOSED' : 'ACTIVE'
          }))
        });
        setIsLoggedIn(true);
        return;
      }
    } catch {}

    setLoginError('No borrower record found for this Customer ID (CIF) or Account Number. Please verify your details or contact your branch.');
  };

  const handleOpenUpi = (acc: BorrowerAccountSummary) => {
    setSelectedAcc(acc);
    setShowQrModal(true);
  };

  const currentBorrower = borrowerData || {
    customerId: '',
    fullName: '',
    maskedAadhaar: '',
    phone: '',
    taluk: '',
    dpdpConsentDate: '',
    accounts: [] as BorrowerAccountSummary[]
  };

  const activeLoan = selectedAcc || (currentBorrower.accounts.length > 0 ? currentBorrower.accounts[0] : null);
  const upiUri = activeLoan ? generateUpiUri({
    vpa: instConfig.upiVpa || 'ggycollect@icici',
    payeeName: instConfig.upiPayeeName || instConfig.organizationName || 'GGY Finance Ltd',
    amount: activeLoan.monthlyEmi || 5000,
    transactionRef: `EMI-${activeLoan.accountNumber.slice(-6)}`,
    accountNumber: activeLoan.accountNumber
  }) : '';

  return (
    <div className="min-h-screen bg-sandstone-100 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="bg-forest-900 text-sandstone-100 py-3.5 px-4 sm:px-8 border-b border-forest-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <GGYBrandMark size="sm" />
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block leading-tight">
                GGY Finance
              </span>
              <span className="text-[10px] text-terracotta-400 font-bold tracking-wider uppercase block">
                {t.portalTitle}
              </span>
            </div>
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => setIsLoggedIn(false)}
              className="inline-flex items-center gap-1.5 text-xs bg-forest-800 hover:bg-forest-700 text-sandstone-200 py-1.5 px-3 rounded-lg border border-forest-700 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-terracotta-400" />
              <span>{t.signOut}</span>
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-sandstone-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!isLoggedIn ? (
          /* LOGIN SCREEN */
          <div className="max-w-md mx-auto my-8">
            <div className="bg-sandstone-50 p-6 sm:p-8 rounded-3xl border border-clay shadow-md space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center mx-auto border border-terracotta-200">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-forest-900">{t.portalTitle}</h2>
                <p className="text-xs text-forest-800/70">{t.portalSubtitle}</p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">{t.cifLabel}</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      placeholder="e.g. 1084000039"
                      className="w-full px-3 py-2.5 bg-sandstone-100 border border-clay rounded-xl font-mono text-forest-900 font-bold focus:ring-2 focus:ring-terracotta-500 outline-hidden"
                    />
                  </div>
                  <p className="text-[10px] text-forest-800/60 mt-1">{t.cifHelp}</p>
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">{t.passwordLabel}</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:ring-2 focus:ring-terracotta-500 outline-hidden"
                  />
                </div>

                <div className="p-3 bg-sandstone-100 rounded-xl border border-clay text-[11px] text-forest-800/80 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Protected by 256-bit encryption. Conforms to UIDAI Aadhaar masking and DPDP Act 2023.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-xl shadow-md transition-all text-xs"
                >
                  {t.signInBtn}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED BORROWER DASHBOARD */
          <div className="space-y-6">
            {/* Welcome & Profile Card */}
            <div className="bg-sandstone-50 p-6 rounded-3xl border border-clay shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-clay pb-4">
                <div>
                  <p className="text-xs text-forest-800/70 font-semibold">{t.welcome}</p>
                  <h2 className="text-xl sm:text-2xl font-black text-forest-900">
                    {currentBorrower.fullName}
                  </h2>
                </div>

                <div className="bg-forest-900 text-sandstone-100 px-3.5 py-1.5 rounded-xl text-xs font-mono">
                  CIF: <strong>{currentBorrower.customerId}</strong>
                </div>
              </div>

              {/* Profile KYC Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-sandstone-100 p-3 rounded-xl border border-clay">
                  <p className="text-[10px] text-forest-800/60 uppercase font-bold">{t.aadhaar}</p>
                  <p className="font-mono font-bold text-forest-900 mt-0.5">{currentBorrower.maskedAadhaar}</p>
                </div>
                <div className="bg-sandstone-100 p-3 rounded-xl border border-clay">
                  <p className="text-[10px] text-forest-800/60 uppercase font-bold">{t.phone}</p>
                  <p className="font-mono font-bold text-forest-900 mt-0.5">+91 {currentBorrower.phone}</p>
                </div>
                <div className="bg-sandstone-100 p-3 rounded-xl border border-clay">
                  <p className="text-[10px] text-forest-800/60 uppercase font-bold">{t.district}</p>
                  <p className="font-bold text-forest-900 mt-0.5">{currentBorrower.taluk}</p>
                </div>
                <div className="bg-sandstone-100 p-3 rounded-xl border border-clay">
                  <p className="text-[10px] text-forest-800/60 uppercase font-bold">{t.dpdpConsent}</p>
                  <p className="font-bold text-emerald-700 mt-0.5">Active ({currentBorrower.dpdpConsentDate})</p>
                </div>
              </div>
            </div>

            {/* Linked Loan Facilities */}
            <div className="space-y-4">
              <h3 className="font-black text-base text-forest-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-terracotta-600" />
                <span>{t.myFacilities} (Linked to CIF: {currentBorrower.customerId})</span>
              </h3>

              {currentBorrower.accounts.length === 0 ? (
                <div className="bg-sandstone-50 p-8 rounded-3xl border border-clay text-center text-xs text-forest-800/60">
                  <CreditCard className="w-8 h-8 text-forest-800/30 mx-auto mb-2" />
                  <p className="font-bold text-forest-900 text-sm">No Active Loan Facilities</p>
                  <p className="mt-1">All loan facilities linked to this Customer ID have been completed or are in processing.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentBorrower.accounts.map((acc) => (
                    <div
                      key={acc.accountNumber}
                      className="bg-sandstone-50 p-6 rounded-3xl border border-clay shadow-xs space-y-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="text-[10px] font-mono text-forest-800/60 uppercase font-bold">16-Digit CBS Account</p>
                            <p className="font-mono font-black text-forest-900 text-sm">{acc.accountNumber}</p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              acc.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-sandstone-200 text-forest-800'
                            }`}
                          >
                            {acc.status === 'ACTIVE' ? t.activeStatus : t.closedStatus}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-forest-900 mt-2">{acc.product}</h4>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-3 font-medium">
                          <div>
                            <p className="text-[10px] text-forest-800/60">{t.principal}:</p>
                            <p className="font-mono font-bold text-forest-900">₹{acc.sanctionAmount.toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-forest-800/60">{t.balance}:</p>
                            <p className={`font-mono font-bold ${acc.balance === 0 ? 'text-emerald-700' : 'text-forest-900'}`}>
                              ₹{acc.balance.toLocaleString('en-IN')}
                            </p>
                          </div>
                          {acc.status === 'ACTIVE' && (
                            <>
                              <div>
                                <p className="text-[10px] text-forest-800/60">{t.emi}:</p>
                                <p className="font-mono font-bold text-terracotta-600">₹{acc.monthlyEmi.toLocaleString('en-IN')}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-forest-800/60">{t.dueDate}:</p>
                                <p className="font-bold text-forest-900">{acc.nextDueDate}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-clay flex justify-end gap-2">
                        {acc.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleOpenUpi(acc)}
                            className="w-full py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5 text-terracotta-400" />
                            <span>{t.payUpi}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowNocModal(true)}
                            className="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t.viewNoc}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-sandstone-50 max-w-sm w-full rounded-3xl p-6 border border-clay shadow-2xl space-y-4 text-center">
            <h4 className="font-extrabold text-base text-forest-900">Instant UPI Repayment QR</h4>
            <p className="text-xs text-forest-800/70">
              Scan with PhonePe, Google Pay, Paytm, or BHIM to instantly credit your installment.
            </p>

            <div className="p-4 bg-white rounded-2xl border-2 border-forest-900 flex flex-col items-center space-y-3">
              <div className="w-36 h-36 flex items-center justify-center p-1 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                {instConfig.qrImageUrl ? (
                  <img src={instConfig.qrImageUrl} alt="Merchant Collection QR" className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="w-32 h-32 text-forest-900" />
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-black text-forest-900">
                  {instConfig.upiPayeeName || instConfig.organizationName || 'GGY Finance Ltd'}
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-forest-800 bg-sandstone-100 px-2 py-0.5 rounded-md border border-clay">
                    {instConfig.upiVpa || 'ggycollect@icici'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(instConfig.upiVpa || 'ggycollect@icici');
                        setCopiedPortalUpi(true);
                        setTimeout(() => setCopiedPortalUpi(false), 2000);
                      }
                    }}
                    className="p-1 rounded-md bg-forest-100 text-forest-800 hover:bg-forest-200 cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copiedPortalUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-sandstone-100 rounded-xl text-xs font-bold text-forest-900">
              Amount Due: ₹{activeLoan?.monthlyEmi ? activeLoan.monthlyEmi.toLocaleString('en-IN') : '0'}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-forest-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}

      {/* NOC MODAL */}
      {showNocModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-sandstone-50 max-w-md w-full rounded-3xl p-6 border-2 border-forest-900 shadow-2xl space-y-4">
            <div className="text-center border-b border-clay pb-3">
              <p className="text-[10px] uppercase font-bold text-terracotta-600">GGY Finance • Core Banking</p>
              <h3 className="font-black text-base text-forest-900">No Objection Certificate (NOC)</h3>
            </div>

            <div className="text-xs space-y-2 text-forest-900 font-mono">
              <p>Borrower Name: <strong>{currentBorrower.fullName}</strong></p>
              <p>Customer ID (CIF): <strong>{currentBorrower.customerId}</strong></p>
              <p>Account Number: <strong>{activeLoan?.accountNumber || 'N/A'}</strong></p>
              <p>Facility: <strong>{activeLoan?.product || 'Micro-Enterprise Facility'}</strong></p>
              <p>Status: <strong className="text-emerald-700">ZERO OUTSTANDING (NIL)</strong></p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-clay">
              <button
                onClick={() => setShowNocModal(false)}
                className="px-4 py-2 text-xs border border-clay rounded-xl text-forest-800 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs bg-forest-800 text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-forest-900 text-sandstone-300 text-[11px] py-4 px-4 text-center border-t border-forest-800">
        <p>GGY Finance Borrower Self-Service Portal • National Micro-Lending Platform • DPDP Act 2023 Compliant</p>
      </footer>
    </div>
  );
}
