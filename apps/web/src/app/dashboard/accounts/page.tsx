'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../components/language-context';
import {
  generateCustomerId,
  generateCBSAccountNumber
} from '@nbfc/shared';
import {
  Users,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  Ban,
  FileCheck2,
  Download,
  Info,
  Shield,
  X
} from 'lucide-react';

interface AccountRecord {
  id: string;
  customerId: string;
  accountNumber: string;
  borrowerName: string;
  maskedAadhaar: string;
  phone: string;
  taluk: string;
  product: string;
  principal: number;
  balance: number;
  interestRate: number;
  tenureMonths: number;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  makerId: string;
  checkerId?: string;
  disbursedAt?: string;
  closedAt?: string;
  suspensionReason?: string;
}

const INITIAL_ACCOUNTS: AccountRecord[] = [
  {
    id: 'acc-001',
    customerId: '1084000039',
    accountNumber: '1084-0101-702-0039-4',
    borrowerName: 'Smt. Lakshmi Gowda',
    maskedAadhaar: 'XXXX-XXXX-8421',
    phone: '9845123450',
    taluk: 'Channapatna, Ramanagara',
    product: 'Dairy Development Term Loan',
    principal: 60000,
    balance: 24500,
    interestRate: 14.5,
    tenureMonths: 12,
    status: 'ACTIVE',
    makerId: 'field_officer_ramesh',
    checkerId: 'checker_sharma',
    disbursedAt: '2026-04-15'
  },
  {
    id: 'acc-002',
    customerId: '1084000012',
    accountNumber: '1084-0101-701-0012-7',
    borrowerName: 'Sri Manjunath Hegde',
    maskedAadhaar: 'XXXX-XXXX-3912',
    phone: '9741298456',
    taluk: 'Maddur, Mandya',
    product: 'Petty Shop Working Capital',
    principal: 40000,
    balance: 0,
    interestRate: 14.0,
    tenureMonths: 6,
    status: 'CLOSED',
    makerId: 'field_officer_ramesh',
    checkerId: 'checker_sharma',
    disbursedAt: '2026-01-10',
    closedAt: '2026-07-10'
  },
  {
    id: 'acc-003',
    customerId: '1084000042',
    accountNumber: '1084-0101-703-0042-3',
    borrowerName: 'Smt. Kavitha Revanna',
    maskedAadhaar: 'XXXX-XXXX-9104',
    phone: '9480112233',
    taluk: 'Doddaballapura, Bangalore Rural',
    product: 'Powerloom Artisan Working Capital',
    principal: 80000,
    balance: 80000,
    interestRate: 15.0,
    tenureMonths: 18,
    status: 'PENDING_APPROVAL',
    makerId: 'field_officer_ramesh'
  },
  {
    id: 'acc-004',
    customerId: '1084000018',
    accountNumber: '1084-0101-704-0018-9',
    borrowerName: 'Sri Basavaraj Patil',
    maskedAadhaar: 'XXXX-XXXX-1567',
    phone: '9611554433',
    taluk: 'Kunigal, Tumakuru',
    product: 'Organic Fertilizer Retail',
    principal: 50000,
    balance: 38200,
    interestRate: 14.5,
    tenureMonths: 12,
    status: 'SUSPENDED',
    makerId: 'field_officer_ramesh',
    checkerId: 'checker_sharma',
    disbursedAt: '2026-03-01',
    suspensionReason: 'KYC Document verification flag - address re-verification pending'
  }
];

export default function AccountsPage() {
  const { lang } = useLanguage();
  const [accounts, setAccounts] = useState<AccountRecord[]>(INITIAL_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNocModal, setShowNocModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountRecord | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [closeError, setCloseError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // New Account Form State
  const [newBorrower, setNewBorrower] = useState({
    name: '',
    aadhaarMasked: '',
    phone: '',
    taluk: 'Channapatna, Ramanagara',
    product: 'Dairy Development Micro-Loan',
    principal: 50000,
    interestRate: 14.5,
    tenureMonths: 12,
    dpdpConsent: true
  });

  const t = {
    en: {
      title: 'Loan Accounts & Lifecycle Management',
      subtitle: 'Maker-Checker dual-control core banking ledger compliant with Karnataka State Lending Regulations & DPDP Act 2023.',
      createBtn: 'New Loan Application (Maker)',
      searchPlaceholder: 'Search by borrower name, account number, or taluk...',
      all: 'All Accounts',
      pending: 'Pending Approval',
      active: 'Active Loans',
      suspended: 'Suspended',
      closed: 'Closed',
      colAcc: 'Account Number',
      colBorrower: 'Borrower & Taluk',
      colProduct: 'Product & Principal',
      colBalance: 'Outstanding Balance',
      colStatus: 'Status',
      colActions: 'Lifecycle Actions',
      suspendAction: 'Suspend',
      reactivateAction: 'Reactivate',
      closeAction: 'Close Loan (NOC)',
      deleteAction: 'Delete/Purge',
      makerSignature: 'Maker',
      checkerSignature: 'Checker',
      createModalTitle: 'Create Micro-Lending Account Application (Maker)',
      borrowerName: 'Borrower Full Name (as per KYC)',
      aadhaarField: 'Masked Aadhaar (e.g. XXXX-XXXX-1234)',
      phoneField: 'Mobile Number (+91)',
      talukField: 'Operational Taluk / District',
      productField: 'Loan Product',
      principalField: 'Sanction Amount (₹10,000 - ₹2,00,000)',
      rateField: 'Interest Rate (% p.a. Reducing Balance)',
      tenureField: 'Repayment Tenure (Months)',
      consentNotice: 'I hereby confirm explicit DPDP Act 2023 consent obtained for digital credit evaluation.',
      submitApplication: 'Submit for Checker 4-Eyes Approval',
      zeroBalanceRule: 'Zero-Balance Rule: An account can only be formally closed when the outstanding balance is exactly ₹0.00.',
      closeSuccess: 'Loan account successfully closed. Tamper-evident No Objection Certificate (NOC) generated.',
      suspendModalTitle: 'Suspend Account (Dual-Control Lock)',
      suspendReasonPrompt: 'Specify mandatory regulatory or operational justification for account suspension:',
      confirmSuspend: 'Confirm Suspension',
      deleteModalTitle: 'DPDP Data Minimization & Statutory Retention Notice',
      deleteExplanation: 'Under Section 8(7) of the Digital Personal Data Protection (DPDP) Act 2023 and statutory financial audit retention rules, active and historical credit ledgers CANNOT be deleted for a statutory period of 8 years. When a loan reaches CLOSED status with zero balance, borrower PII is scrubbed and archived in encrypted cold storage.',
      closeNocTitle: 'No Objection Certificate (NOC) & Loan Clearance',
      nocStatement: 'This certifies that the loan facility has been fully satisfied with ZERO outstanding liability. The borrower is cleared for new credit facilities.'
    },
    kn: {
      title: 'ಸಾಲ ಖಾತೆಗಳು ಮತ್ತು ನಿರ್ವಹಣೆ (Loan Accounts)',
      subtitle: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಕಿರು ಸಾಲ ನಿಯಮಾವಳಿಗಳು ಮತ್ತು DPDP ಕಾಯ್ದೆ 2023 ರ ಅನ್ವಯ ಡ್ಯುಯಲ್-ಕಂಟ್ರೋಲ್ ಕೋರ್ ಬ್ಯಾಂಕಿಂಗ್ ಲೆಡ್ಜರ್.',
      createBtn: 'ಹೊಸ ಸಾಲ ಅರ್ಜಿ (New Loan Application)',
      searchPlaceholder: 'ಸಾಲಗಾರರ ಹೆಸರು, ಖಾತೆ ಸಂಖ್ಯೆ ಅಥವಾ ತಾಲೂಕಿನ ಮೂಲಕ ಹುಡುಕಿ...',
      all: 'ಎಲ್ಲಾ ಖಾತೆಗಳು',
      pending: 'ಅನುಮೋದನೆ ಬಾಕಿ',
      active: 'ಸಕ್ರಿಯ ಸಾಲಗಳು',
      suspended: 'ಅಮಾನತುಗೊಂಡಿದೆ',
      closed: 'ಮುಕ್ತಾಯಗೊಂಡಿದೆ',
      colAcc: 'ಖಾತೆ ಸಂಖ್ಯೆ',
      colBorrower: 'ಸಾಲಗಾರರು & ತಾಲೂಕು',
      colProduct: 'ಯೋಜನೆ & ಮೊತ್ತ',
      colBalance: 'ಬಾಕಿ ಮೊತ್ತ',
      colStatus: 'ಸ್ಥಿತಿ',
      colActions: 'ಕ್ರಮಗಳು',
      suspendAction: 'ಅಮಾನತು',
      reactivateAction: 'ಮರುಸಕ್ರಿಯಗೊಳಿಸಿ',
      closeAction: 'ಸಾಲ ಮುಕ್ತಾಯ (NOC)',
      deleteAction: 'ಅಳಿಸಿ / ಮಾಹಿತಿ',
      makerSignature: 'ಮೇಕರ್',
      checkerSignature: 'ಚೆಕ್ಕರ್',
      createModalTitle: 'ಹೊಸ ಸಾಲ ಖಾತೆ ಸಲ್ಲಿಕೆ (ಮೇಕರ್)',
      borrowerName: 'ಸಾಲಗಾರರ ಪೂರ್ಣ ಹೆಸರು (ಕೆವೈಸಿ ಪ್ರಕಾರ)',
      aadhaarField: 'ಮರೆಮಾಡಿದ ಆಧಾರ್ (XXXX-XXXX-1234)',
      phoneField: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (+91)',
      talukField: 'ಕಾರ್ಯಾಚರಣೆಯ ತಾಲೂಕು / ಜಿಲ್ಲೆ',
      productField: 'ಸಾಲದ ಯೋಜನೆ',
      principalField: 'ಸಾಲದ ಮೊತ್ತ (₹10,000 - ₹2,00,000)',
      rateField: 'ಬಡ್ಡಿ ದರ (% ವಾರ್ಷಿಕ)',
      tenureField: 'ಮರುಪಾವತಿ ಅವಧಿ (ತಿಂಗಳು)',
      consentNotice: 'DPDP ಕಾಯ್ದೆ 2023 ರ ಪ್ರಕಾರ ಸಾಲ ಮೌಲ್ಯಮಾಪನಕ್ಕಾಗಿ ಸ್ಪಷ್ಟ ಒಪ್ಪಿಗೆ ಪಡೆಯಲಾಗಿದೆ.',
      submitApplication: 'ಚೆಕ್ಕರ್ ಅನುಮೋದನೆಗೆ ಸಲ್ಲಿಸಿ',
      zeroBalanceRule: 'ಶೂನ್ಯ-ಬಾಕಿ ನಿಯಮ: ಸಾಲದ ಬಾಕಿ ಮೊತ್ತ ಸಂಪೂರ್ಣವಾಗಿ ₹0.00 ಇದ್ದಾಗ ಮಾತ್ರ ಖಾತೆಯನ್ನು ಮುಕ್ತಾಯಗೊಳಿಸಬಹುದು.',
      closeSuccess: 'ಸಾಲದ ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ಮುಕ್ತಾಯಗೊಂಡಿದೆ. ಬಾಕಿ ಇಲ್ಲ ಪ್ರಮಾಣಪತ್ರ (NOC) ಸಿದ್ಧವಾಗಿದೆ.',
      suspendModalTitle: 'ಖಾತೆ ಅಮಾನತು (Dual-Control Lock)',
      suspendReasonPrompt: 'ಖಾತೆ ಅಮಾನತುಗೊಳಿಸಲು ನಿಯಂತ್ರಣಾ ಕಾರಣವನ್ನು ನಮೂದಿಸಿ:',
      confirmSuspend: 'ಅಮಾನತು ದೃಢೀಕರಿಸಿ',
      deleteModalTitle: 'DPDP ದತ್ತಾಂಶ ಸಂರಕ್ಷಣೆ ಮತ್ತು ನಿಯಮಾವಳಿ ಮಾಹಿತಿ',
      deleteExplanation: 'DPDP ಕಾಯ್ದೆ 2023 ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನಾ ನಿಯಮಗಳ ಪ್ರಕಾರ, ಸಾಲದ ಲೆಕ್ಕಪತ್ರ ದಾಖಲೆಗಳನ್ನು ಕನಿಷ್ಠ 8 ವರ್ಷಗಳ ಕಾಲ ಅಳಿಸಲು ಅವಕಾಶವಿಲ್ಲ. ಸಾಲ ಶೂನ್ಯ ಬಾಕಿಯೊಂದಿಗೆ ಮುಕ್ತಾಯಗೊಂಡ ನಂತರ ಕೆವೈಸಿ ವಿವರಗಳನ್ನು ನಿಯಮಾನುಸಾರ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗುತ್ತದೆ.',
      closeNocTitle: 'ಬಾಕಿ ಇಲ್ಲ ಪ್ರಮಾಣಪತ್ರ (No Objection Certificate - NOC)',
      nocStatement: 'ಈ ಸಾಲವು ಶೂನ್ಯ ಬಾಕಿಯೊಂದಿಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಮರುಪಾವತಿಯಾಗಿದ್ದು, ಯಾವುದೇ ಬಾಕಿ ಇರುವುದಿಲ್ಲವೆಂದು ಪ್ರಮಾಣೀಕರಿಸಲಾಗಿದೆ.'
    }
  }[lang];

  // Filtering
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.taluk.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || acc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSeq = accounts.length + 1;
    const newId = `acc-00${newSeq}`;
    const newCif = generateCustomerId('1084', newSeq + 42);
    const schemeCode = newBorrower.product.includes('Dairy')
      ? '702'
      : newBorrower.product.includes('Shop')
      ? '701'
      : newBorrower.product.includes('Powerloom')
      ? '703'
      : '704';
    const newAccNum = generateCBSAccountNumber('1084', '0101', schemeCode, newSeq + 42, true);

    const record: AccountRecord = {
      id: newId,
      customerId: newCif,
      accountNumber: newAccNum,
      borrowerName: newBorrower.name,
      maskedAadhaar: newBorrower.aadhaarMasked || 'XXXX-XXXX-9999',
      phone: newBorrower.phone,
      taluk: newBorrower.taluk,
      product: newBorrower.product,
      principal: Number(newBorrower.principal),
      balance: Number(newBorrower.principal),
      interestRate: Number(newBorrower.interestRate),
      tenureMonths: Number(newBorrower.tenureMonths),
      status: 'PENDING_APPROVAL',
      makerId: 'field_officer_ramesh'
    };

    setAccounts([record, ...accounts]);
    setShowCreateModal(false);
    setSuccessToast(`Application for ${record.borrowerName} submitted into Checker Approval Queue! Assigned CIF: ${newCif}, CBS A/C: ${newAccNum}`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleSuspendConfirm = () => {
    if (!selectedAccount) return;
    setAccounts(
      accounts.map((a) =>
        a.id === selectedAccount.id
          ? { ...a, status: 'SUSPENDED', suspensionReason: suspensionReason || 'Manager audit flag' }
          : a
      )
    );
    setShowSuspendModal(false);
    setSuccessToast(`Account ${selectedAccount.accountNumber} has been SUSPENDED.`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleReactivate = (acc: AccountRecord) => {
    setAccounts(
      accounts.map((a) =>
        a.id === acc.id ? { ...a, status: 'ACTIVE', suspensionReason: undefined } : a
      )
    );
    setSuccessToast(`Account ${acc.accountNumber} has been REACTIVATED to Active status.`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleCloseAttempt = (acc: AccountRecord) => {
    setSelectedAccount(acc);
    setCloseError('');
    if (acc.balance > 0) {
      setCloseError(
        `Cannot close account with outstanding balance of ₹${acc.balance.toLocaleString('en-IN')}. Full repayment is required before issuing NOC.`
      );
      setShowCloseModal(true);
    } else {
      setShowCloseModal(true);
    }
  };

  const handleConfirmClose = () => {
    if (!selectedAccount || selectedAccount.balance > 0) return;
    setAccounts(
      accounts.map((a) =>
        a.id === selectedAccount.id
          ? { ...a, status: 'CLOSED', closedAt: new Date().toISOString().slice(0, 10) }
          : a
      )
    );
    setShowCloseModal(false);
    setShowNocModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & New Application Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-sandstone-50 p-6 rounded-3xl border border-clay shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-forest-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-terracotta-600" />
            <span>{t.title}</span>
          </h2>
          <p className="text-xs text-forest-800/80 mt-1 max-w-2xl">{t.subtitle}</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs py-3 px-5 rounded-2xl shadow-md transition-all shrink-0 hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.createBtn}</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-sandstone-50 p-4 rounded-2xl border border-clay">
          <p className="text-[11px] font-bold text-forest-800/70 uppercase">Total Accounts</p>
          <p className="text-2xl font-black text-forest-900 mt-1">{accounts.length}</p>
        </div>
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
          <p className="text-[11px] font-bold text-emerald-800 uppercase">{t.active}</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {accounts.filter((a) => a.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
          <p className="text-[11px] font-bold text-amber-800 uppercase">{t.pending}</p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {accounts.filter((a) => a.status === 'PENDING_APPROVAL').length}
          </p>
        </div>
        <div className="bg-sandstone-200/50 p-4 rounded-2xl border border-clay">
          <p className="text-[11px] font-bold text-forest-800/70 uppercase">{t.closed}</p>
          <p className="text-2xl font-black text-forest-800 mt-1">
            {accounts.filter((a) => a.status === 'CLOSED').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-forest-800/50" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-sandstone-50 border border-clay rounded-2xl text-xs text-forest-900 focus:outline-hidden focus:ring-2 focus:ring-terracotta-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto bg-sandstone-200/60 p-1 rounded-2xl border border-clay text-xs font-bold">
          {['ALL', 'ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-forest-800 hover:bg-sandstone-100'
              }`}
            >
              {st === 'ALL'
                ? t.all
                : st === 'ACTIVE'
                ? t.active
                : st === 'PENDING_APPROVAL'
                ? t.pending
                : st === 'SUSPENDED'
                ? t.suspended
                : t.closed}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Data Table */}
      <div className="bg-sandstone-50 rounded-3xl border border-clay shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sandstone-200/70 border-b border-clay text-forest-900 font-extrabold">
              <tr>
                <th className="py-3.5 px-4">{t.colAcc}</th>
                <th className="py-3.5 px-4">{t.colBorrower}</th>
                <th className="py-3.5 px-4">{t.colProduct}</th>
                <th className="py-3.5 px-4">{t.colBalance}</th>
                <th className="py-3.5 px-4">{t.colStatus}</th>
                <th className="py-3.5 px-4 text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay/40 font-medium">
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-sandstone-100/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-forest-900">
                    <div className="text-xs">{acc.accountNumber}</div>
                    <div className="text-[10px] text-terracotta-600 font-sans mt-0.5 font-bold">
                      CIF: <span className="font-mono">{acc.customerId}</span>
                    </div>
                    <div className="text-[10px] text-forest-800/60 font-sans mt-0.5">
                      {t.makerSignature}: <span className="font-semibold">{acc.makerId}</span>
                      {acc.checkerId && (
                        <span> • {t.checkerSignature}: {acc.checkerId}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-forest-900">{acc.borrowerName}</p>
                    <p className="text-[11px] text-forest-800/70">
                      {acc.maskedAadhaar} • {acc.taluk}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-forest-900">{acc.product}</p>
                    <p className="text-[11px] text-forest-800/70">
                      ₹{acc.principal.toLocaleString('en-IN')} • {acc.interestRate}% • {acc.tenureMonths}m
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className={`font-mono font-bold text-sm ${acc.balance === 0 ? 'text-emerald-700' : 'text-forest-900'}`}>
                      ₹{acc.balance.toLocaleString('en-IN')}
                    </p>
                    {acc.balance === 0 && acc.status === 'CLOSED' && (
                      <span className="text-[10px] text-emerald-700 font-bold">Zero-Balance (NOC Issued)</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        acc.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : acc.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-100 text-amber-800'
                          : acc.status === 'SUSPENDED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-sandstone-200 text-forest-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{acc.status}</span>
                    </span>
                    {acc.suspensionReason && (
                      <p className="text-[10px] text-red-600 mt-1 max-w-xs truncate" title={acc.suspensionReason}>
                        {acc.suspensionReason}
                      </p>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {acc.status === 'ACTIVE' && (
                        <button
                          onClick={() => {
                            setSelectedAccount(acc);
                            setShowSuspendModal(true);
                          }}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-bold transition-all"
                        >
                          {t.suspendAction}
                        </button>
                      )}

                      {acc.status === 'SUSPENDED' && (
                        <button
                          onClick={() => handleReactivate(acc)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold transition-all"
                        >
                          {t.reactivateAction}
                        </button>
                      )}

                      {acc.status !== 'CLOSED' && acc.status !== 'PENDING_APPROVAL' && (
                        <button
                          onClick={() => handleCloseAttempt(acc)}
                          className="px-2.5 py-1 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-[11px] font-bold transition-all"
                        >
                          {t.closeAction}
                        </button>
                      )}

                      {acc.status === 'CLOSED' && (
                        <button
                          onClick={() => {
                            setSelectedAccount(acc);
                            setShowNocModal(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>View NOC</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedAccount(acc);
                          setShowDeleteModal(true);
                        }}
                        className="px-2 py-1 text-forest-800/60 hover:text-red-600 rounded-lg text-[11px] transition-all"
                        title="Delete / Retention Policy"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-sandstone-50 rounded-3xl border border-clay max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-clay pb-3">
              <h3 className="font-extrabold text-base text-forest-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-terracotta-600" />
                <span>{t.createModalTitle}</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-forest-800/60 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-forest-900 mb-1">{t.borrowerName}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Renukamma Siddaramaiah"
                  value={newBorrower.name}
                  onChange={(e) => setNewBorrower({ ...newBorrower, name: e.target.value })}
                  className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">{t.aadhaarField}</label>
                  <input
                    type="text"
                    required
                    placeholder="XXXX-XXXX-8421"
                    value={newBorrower.aadhaarMasked}
                    onChange={(e) => setNewBorrower({ ...newBorrower, aadhaarMasked: e.target.value })}
                    className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl font-mono text-forest-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-900 mb-1">{t.phoneField}</label>
                  <input
                    type="text"
                    required
                    placeholder="9845012345"
                    value={newBorrower.phone}
                    onChange={(e) => setNewBorrower({ ...newBorrower, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">{t.talukField}</label>
                  <select
                    value={newBorrower.taluk}
                    onChange={(e) => setNewBorrower({ ...newBorrower, taluk: e.target.value })}
                    className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900"
                  >
                    <option value="Channapatna, Ramanagara">Channapatna, Ramanagara</option>
                    <option value="Maddur, Mandya">Maddur, Mandya</option>
                    <option value="Doddaballapura, Bangalore Rural">Doddaballapura, Bangalore Rural</option>
                    <option value="Kunigal, Tumakuru">Kunigal, Tumakuru</option>
                    <option value="Hunsur, Mysuru">Hunsur, Mysuru</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-forest-900 mb-1">{t.productField}</label>
                  <select
                    value={newBorrower.product}
                    onChange={(e) => setNewBorrower({ ...newBorrower, product: e.target.value })}
                    className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900"
                  >
                    <option value="Dairy Development Micro-Loan">Dairy Development Micro-Loan</option>
                    <option value="Petty Shop Working Capital">Petty Shop Working Capital</option>
                    <option value="Powerloom Artisan Working Capital">Powerloom Artisan Working Capital</option>
                    <option value="Organic Fertilizer Retail">Organic Fertilizer Retail</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Sanction (₹)</label>
                  <input
                    type="number"
                    min={10000}
                    max={200000}
                    step={5000}
                    value={newBorrower.principal}
                    onChange={(e) => setNewBorrower({ ...newBorrower, principal: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Rate (% p.a.)</label>
                  <input
                    type="number"
                    min={10}
                    max={24}
                    step={0.5}
                    value={newBorrower.interestRate}
                    onChange={(e) => setNewBorrower({ ...newBorrower, interestRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Tenure (m)</label>
                  <select
                    value={newBorrower.tenureMonths}
                    onChange={(e) => setNewBorrower({ ...newBorrower, tenureMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900"
                  >
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                    <option value={18}>18 Months</option>
                    <option value={24}>24 Months</option>
                    <option value={36}>36 Months</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-sandstone-100 rounded-xl border border-clay flex items-start gap-2 text-[11px] text-forest-800">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t.consentNotice}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-clay text-forest-800 rounded-xl hover:bg-sandstone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-xl shadow-xs"
                >
                  {t.submitApplication}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUSPEND MODAL */}
      {showSuspendModal && selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-sandstone-50 rounded-3xl border border-clay max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-red-700 flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-600" />
              <span>{t.suspendModalTitle}</span>
            </h3>
            <p className="text-xs text-forest-800/80">
              Account: <strong>{selectedAccount.accountNumber}</strong> ({selectedAccount.borrowerName})
            </p>

            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">{t.suspendReasonPrompt}</label>
              <textarea
                rows={3}
                required
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="e.g. Regulatory compliance audit flag / Address re-verification pending"
                className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-xs text-forest-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2 text-xs border border-clay text-forest-800 rounded-xl hover:bg-sandstone-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSuspendConfirm}
                className="px-5 py-2 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
              >
                {t.confirmSuspend}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLOSE LOAN MODAL */}
      {showCloseModal && selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-sandstone-50 rounded-3xl border border-clay max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-forest-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-terracotta-600" />
              <span>Close Loan Account (Dual-Control)</span>
            </h3>

            <div className="bg-sandstone-100 p-3.5 rounded-2xl border border-clay text-xs space-y-1">
              <p>Account: <strong>{selectedAccount.accountNumber}</strong></p>
              <p>Borrower: <strong>{selectedAccount.borrowerName}</strong></p>
              <p>
                Outstanding Balance:{' '}
                <strong className={selectedAccount.balance > 0 ? 'text-red-600 font-mono text-sm' : 'text-emerald-700 font-mono text-sm'}>
                  ₹{selectedAccount.balance.toLocaleString('en-IN')}
                </strong>
              </p>
            </div>

            {closeError ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{closeError}</span>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero-Balance verified! Confirming closure will permanently issue a No Objection Certificate (NOC).</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCloseModal(false)}
                className="px-4 py-2 text-xs border border-clay text-forest-800 rounded-xl hover:bg-sandstone-200"
              >
                Close
              </button>
              {selectedAccount.balance === 0 && (
                <button
                  type="button"
                  onClick={handleConfirmClose}
                  className="px-5 py-2 text-xs bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Closure & Generate NOC
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NOC CERTIFICATE MODAL */}
      {showNocModal && selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-sandstone-50 rounded-3xl border-2 border-forest-900 max-w-lg w-full p-8 shadow-2xl space-y-5">
            <div className="text-center border-b-2 border-forest-900/20 pb-4">
              <p className="text-xs uppercase font-extrabold tracking-widest text-terracotta-600">
                GGY Finance • Karnataka Reg: KA-ML/2024/7742
              </p>
              <h2 className="text-xl font-black text-forest-900 mt-1">{t.closeNocTitle}</h2>
              <p className="text-[11px] font-mono text-forest-800/70 mt-0.5">Certificate Ref: NOC-KA-2026-{selectedAccount.id.toUpperCase()}</p>
            </div>

            <div className="text-xs space-y-3 text-forest-900 leading-relaxed">
              <p>{t.nocStatement}</p>
              <div className="bg-sandstone-100 p-4 rounded-2xl border border-clay space-y-1.5 font-mono text-[11px]">
                <p>Borrower Name: <strong>{selectedAccount.borrowerName}</strong></p>
                <p>Aadhaar Masked: <strong>{selectedAccount.maskedAadhaar}</strong></p>
                <p>Loan Facility Ref: <strong>{selectedAccount.accountNumber}</strong></p>
                <p>Sanctioned Principal: <strong>₹{selectedAccount.principal.toLocaleString('en-IN')}</strong></p>
                <p>Outstanding Balance: <strong className="text-emerald-700">₹0.00 (NIL)</strong></p>
                <p>Closure Date: <strong>{selectedAccount.closedAt || new Date().toISOString().slice(0, 10)}</strong></p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-clay">
              <div className="text-[10px] text-forest-800/60 font-mono">
                Digitally Sealed • SHA-256 Verified
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNocModal(false)}
                  className="px-4 py-2 text-xs border border-clay rounded-xl text-forest-800 hover:bg-sandstone-200"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs bg-forest-800 text-white font-bold rounded-xl flex items-center gap-1.5 hover:bg-forest-900 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE / RETENTION NOTICE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-sandstone-50 rounded-3xl border border-clay max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-forest-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-terracotta-600" />
              <span>{t.deleteModalTitle}</span>
            </h3>
            <p className="text-xs text-forest-800/90 leading-relaxed">
              {t.deleteExplanation}
            </p>
            <div className="p-3 bg-sandstone-100 rounded-xl border border-clay text-[11px] text-forest-800/80">
              <strong>Statutory Reference:</strong> Karnataka State Lending & Micro-Credit Regulations and DPDP Act 2023, Section 42 (8-Year Audit Retention).
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 text-xs bg-forest-800 text-white font-bold rounded-xl"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
