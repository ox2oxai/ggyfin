'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../components/language-context';
import {
  ArrowLeftRight,
  QrCode,
  Banknote,
  Send,
  CheckCircle2,
  Download,
  ShieldCheck,
  Search,
  X
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  timestamp: string;
  accountNumber: string;
  borrowerName: string;
  type: 'DISBURSEMENT' | 'UPI_REPAYMENT' | 'CASH_COLLECTION' | 'INTEREST_ACCRUAL';
  debit: number;
  credit: number;
  balanceAfter: number;
  makerId: string;
  checkerId?: string;
  referenceId: string;
  status: 'SETTLED' | 'PENDING_VERIFICATION';
}

const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'TXN-DISB-2026-001',
    timestamp: '2026-04-15 10:30',
    accountNumber: 'GGY-LN-KA-2026-0001',
    borrowerName: 'Smt. Lakshmi Gowda',
    type: 'DISBURSEMENT',
    debit: 60000,
    credit: 0,
    balanceAfter: 60000,
    makerId: 'field_officer_ramesh',
    checkerId: 'checker_sharma',
    referenceId: 'IMPS-NEFT-9847291034',
    status: 'SETTLED'
  },
  {
    id: 'TXN-UPI-2026-002',
    timestamp: '2026-05-10 14:15',
    accountNumber: 'GGY-LN-KA-2026-0001',
    borrowerName: 'Smt. Lakshmi Gowda',
    type: 'UPI_REPAYMENT',
    debit: 0,
    credit: 5500,
    balanceAfter: 54500,
    makerId: 'SYSTEM_NPCI_WEBHOOK',
    checkerId: 'NPCI_AUTO_SETTLED',
    referenceId: 'UTR:2026051098231',
    status: 'SETTLED'
  },
  {
    id: 'TXN-CASH-2026-003',
    timestamp: '2026-06-10 11:20',
    accountNumber: 'GGY-LN-KA-2026-0001',
    borrowerName: 'Smt. Lakshmi Gowda',
    type: 'CASH_COLLECTION',
    debit: 0,
    credit: 5500,
    balanceAfter: 49000,
    makerId: 'field_officer_ramesh',
    checkerId: 'manager_anita',
    referenceId: 'RCPT-KA-BLR-0041',
    status: 'SETTLED'
  },
  {
    id: 'TXN-CASH-2026-004',
    timestamp: '2026-06-14 16:40',
    accountNumber: 'GGY-LN-KA-2026-0004',
    borrowerName: 'Sri Basavaraj Patil',
    type: 'CASH_COLLECTION',
    debit: 0,
    credit: 4800,
    balanceAfter: 33400,
    makerId: 'field_officer_ramesh',
    referenceId: 'RCPT-KA-TUM-0082',
    status: 'PENDING_VERIFICATION'
  }
];

export default function TransactionsPage() {
  const { lang } = useLanguage();
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'UPI_SIM' | 'CASH_ENTRY'>('LEDGER');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // UPI Simulation Form State (deterministic default for SSR hydration safety)
  const [upiForm, setUpiForm] = useState({
    accountNumber: 'GGY-LN-KA-2026-0001',
    borrowerName: 'Smt. Lakshmi Gowda',
    amount: 5500,
    utr: '202611149814'
  });

  // Cash Entry Form State (deterministic default for SSR hydration safety)
  const [cashForm, setCashForm] = useState({
    accountNumber: 'GGY-LN-KA-2026-0001',
    borrowerName: 'Smt. Lakshmi Gowda',
    amount: 4500,
    fieldOfficer: 'field_officer_ramesh',
    receiptNumber: 'RCPT-KA-45210'
  });

  const t = {
    en: {
      title: 'Ledger & Financial Transactions',
      subtitle: 'Immutable double-entry general ledger with NPCI UPI auto-reconciliation and dual-control cash credits.',
      tabLedger: 'General Ledger View',
      tabUpi: 'Simulate Inward UPI Repayment',
      tabCash: 'Doorstep Cash Collection & Verification',
      colTxnId: 'Txn ID & Ref',
      colDateTime: 'Timestamp',
      colAccount: 'Account & Borrower',
      colType: 'Type',
      colDebit: 'Debit (Dr)',
      colCredit: 'Credit (Cr)',
      colBalance: 'Running Balance',
      colDualControl: 'Maker / Checker Signatures',
      colStatus: 'Status',
      verifyCashBtn: 'Verify Cash (Checker)',
      exportCsv: 'Export Audit CSV',
      disbursement: 'Disbursement',
      upiRepayment: 'UPI Inward Credit',
      cashRepayment: 'Doorstep Cash Credit',
      upiSimulatorTitle: 'Trigger NPCI Inward UPI Repayment Webhook',
      upiSimulatorDesc: 'Simulate an instant UPI repayment received from PhonePe / Google Pay / BHIM QR with real-time balance credit.',
      fireUpiWebhook: 'Confirm UPI Repayment Credit',
      cashEntryTitle: 'Record Field Cash Receipt (Maker)',
      cashEntryDesc: 'Field officer records cash collected at borrower doorstep. It enters Pending Verification until verified by Branch Manager.',
      submitCashEntry: 'Record Cash Receipt',
      totalDisbursed: 'Total Disbursed',
      totalCollected: 'Total Repayments Collected',
      activeLedgerCount: 'Total Transactions'
    },
    kn: {
      title: 'ಲೆಡ್ಜರ್ ಮತ್ತು ಹಣಕಾಸು ವಹಿವಾಟುಗಳು (Transactions & Ledger)',
      subtitle: 'ಆರ್.ಬಿ.ಐ ನಿಯಮಾವಳಿಗಳ ಅನ್ವಯ ಡಬಲ್-ಎಂಟ್ರಿ ಜನರಲ್ ಲೆಡ್ಜರ್ ಮತ್ತು ಯುಪಿಐ ತ್ವರಿತ ಜಮಾ ವ್ಯವಸ್ಥೆ.',
      tabLedger: 'ಲೆಡ್ಜರ್ ವೀಕ್ಷಣೆ (Ledger View)',
      tabUpi: 'ಯುಪಿಐ ಮರುಪಾವತಿ ಸಿಮ್ಯುಲೇಟರ್ (UPI Repayment)',
      tabCash: 'ನಗದು ಸಂಗ್ರಹ ಮತ್ತು ಪರಿಶೀಲನೆ (Cash Collection)',
      colTxnId: 'ವಹಿವಾಟು ಸಂಖ್ಯೆ & ಉಲ್ಲೇಖ',
      colDateTime: 'ದಿನಾಂಕ & ಸಮಯ',
      colAccount: 'ಖಾತೆ & ಸಾಲಗಾರರು',
      colType: 'ವಿಧ (Type)',
      colDebit: 'ಡೆಬಿಟ್ (ಖರ್ಚು)',
      colCredit: 'ಕ್ರೆಡಿಟ್ (ಜಮಾ)',
      colBalance: 'ಪ್ರಸ್ತುತ ಬಾಕಿ',
      colDualControl: 'ಮೇಕರ್ / ಚೆಕ್ಕರ್ ಸಹಿ',
      colStatus: 'ಸ್ಥಿತಿ',
      verifyCashBtn: 'ನಗದು ಪರಿಶೀಲಿಸಿ (ಚೆಕ್ಕರ್)',
      exportCsv: 'ಆಡಿಟ್ CSV ಡೌನ್‌ಲೋಡ್',
      disbursement: 'ಸಾಲ ವಿತರಣೆ (Disbursement)',
      upiRepayment: 'ಯುಪಿಐ ಜಮಾ (UPI Credit)',
      cashRepayment: 'ಮನೆಬಾಗಿಲಿನ ನಗದು ಜಮಾ',
      upiSimulatorTitle: 'NPCI ಯುಪಿಐ ಮರುಪಾವತಿ ವೆಬ್‌ಹುಕ್ ಪ್ರಕ್ರಿಯೆ',
      upiSimulatorDesc: 'PhonePe / GPay ಮೂಲಕ ಬಂದ ಯುಪಿಐ ಪಾವತಿಯನ್ನು ತಕ್ಷಣವೇ ಖಾತೆಗೆ ಜಮಾ ಮಾಡಿ ಬಾಕಿ ಮೊತ್ತವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.',
      fireUpiWebhook: 'ಯುಪಿಐ ಪಾವತಿ ದೃಢೀಕರಿಸಿ',
      cashEntryTitle: 'ಕ್ಷೇತ್ರ ನಗದು ರಶೀದಿ ದಾಖಲಿಸಿ (ಮೇಕರ್)',
      cashEntryDesc: 'ಫೀಲ್ಡ್ ಆಫೀಸರ್ ಸಂಗ್ರಹಿಸಿದ ನಗದನ್ನು ನಮೂದಿಸುತ್ತಾರೆ. ಶಾಖಾ ವ್ಯವಸ್ಥಾಪಕರು ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.',
      submitCashEntry: 'ನಗದು ದಾಖಲಿಸಿ',
      totalDisbursed: 'ಒಟ್ಟು ಸಾಲ ವಿತರಣೆ',
      totalCollected: 'ಒಟ್ಟು ಮರುಪಾವತಿ ಸಂಗ್ರಹ',
      activeLedgerCount: 'ಒಟ್ಟು ವಹಿವಾಟುಗಳು'
    }
  }[lang];

  // Calculated Stats
  const totalDebit = ledger.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = ledger.reduce((sum, item) => (item.status === 'SETTLED' ? sum + item.credit : sum), 0);

  // Filtered Ledger
  const filteredLedger = ledger.filter(
    (item) =>
      item.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSimulateUpi = (e: React.FormEvent) => {
    e.preventDefault();
    const newTxnId = `TXN-UPI-2026-00${ledger.length + 1}`;
    
    // Resolve dynamic prior balance for the target account
    const priorSettledEntry = ledger.find(
      (l) => l.accountNumber === upiForm.accountNumber && l.status === 'SETTLED'
    );
    const priorBalance = priorSettledEntry
      ? priorSettledEntry.balanceAfter
      : (upiForm.accountNumber === 'GGY-LN-KA-2026-0004' ? 38200 : 24500);
    const calculatedBalance = Math.max(0, priorBalance - Number(upiForm.amount));

    const newEntry: LedgerEntry = {
      id: newTxnId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      accountNumber: upiForm.accountNumber,
      borrowerName: upiForm.borrowerName,
      type: 'UPI_REPAYMENT',
      debit: 0,
      credit: Number(upiForm.amount),
      balanceAfter: calculatedBalance,
      makerId: 'SYSTEM_NPCI_WEBHOOK',
      checkerId: 'NPCI_AUTO_SETTLED',
      referenceId: `UTR:${upiForm.utr}`,
      status: 'SETTLED'
    };

    setLedger([newEntry, ...ledger]);
    setActiveTab('LEDGER');
    setToastMsg(`₹${upiForm.amount} successfully credited via UPI UTR ${upiForm.utr}!`);
    // Randomize next UTR for subsequent simulations
    setUpiForm({
      ...upiForm,
      utr: '2026111498' + Math.floor(1000 + Math.random() * 9000)
    });
    setTimeout(() => setToastMsg(''), 5000);
  };

  const handleRecordCash = (e: React.FormEvent) => {
    e.preventDefault();
    const newTxnId = `TXN-CASH-2026-00${ledger.length + 1}`;
    
    // Resolve current balance
    const priorSettledEntry = ledger.find(
      (l) => l.accountNumber === cashForm.accountNumber && l.status === 'SETTLED'
    );
    const priorBalance = priorSettledEntry
      ? priorSettledEntry.balanceAfter
      : (cashForm.accountNumber === 'GGY-LN-KA-2026-0004' ? 38200 : 24500);

    const newEntry: LedgerEntry = {
      id: newTxnId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      accountNumber: cashForm.accountNumber,
      borrowerName: cashForm.borrowerName,
      type: 'CASH_COLLECTION',
      debit: 0,
      credit: Number(cashForm.amount),
      balanceAfter: priorBalance, // Not deducted until manager verifies
      makerId: cashForm.fieldOfficer,
      referenceId: cashForm.receiptNumber,
      status: 'PENDING_VERIFICATION'
    };

    setLedger([newEntry, ...ledger]);
    setActiveTab('LEDGER');
    setToastMsg(`Cash entry recorded for ${cashForm.borrowerName}. Pending Branch Manager verification!`);
    // Randomize next receipt number
    setCashForm({
      ...cashForm,
      receiptNumber: 'RCPT-KA-' + Math.floor(10000 + Math.random() * 90000)
    });
    setTimeout(() => setToastMsg(''), 5000);
  };

  const handleVerifyCash = (item: LedgerEntry) => {
    setLedger(
      ledger.map((l) => {
        if (l.id === item.id) {
          const priorSettled = ledger.find(
            (other) => other.accountNumber === item.accountNumber && other.status === 'SETTLED' && other.id !== item.id
          );
          const baseBalance = priorSettled ? priorSettled.balanceAfter : item.balanceAfter;
          return {
            ...l,
            status: 'SETTLED',
            checkerId: 'manager_anita',
            balanceAfter: Math.max(0, baseBalance - l.credit)
          };
        }
        return l;
      })
    );
    setToastMsg(`Manager verified cash collection ${item.referenceId}. ₹${item.credit} credited to ledger!`);
    setTimeout(() => setToastMsg(''), 5000);
  };

  const handleExportCsv = () => {
    const headers = 'TxnID,Timestamp,AccountNumber,Borrower,Type,Debit,Credit,BalanceAfter,Maker,Checker,Reference,Status\n';
    const rows = ledger
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.accountNumber}","${l.borrowerName}","${l.type}",${l.debit},${l.credit},${l.balanceAfter},"${l.makerId}","${l.checkerId || ''}","${l.referenceId}","${l.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GGY_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-sandstone-50 p-6 rounded-3xl border border-clay shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-forest-900 tracking-tight flex items-center gap-2.5">
            <ArrowLeftRight className="w-6 h-6 text-terracotta-600" />
            <span>{t.title}</span>
          </h2>
          <p className="text-xs text-forest-800/80 mt-1 max-w-2xl">{t.subtitle}</p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 bg-sandstone-200 hover:bg-sandstone-300 text-forest-900 font-bold text-xs py-2.5 px-4 rounded-xl border border-clay transition-all shrink-0"
        >
          <Download className="w-4 h-4 text-forest-800" />
          <span>{t.exportCsv}</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-sandstone-50 p-4 rounded-2xl border border-clay">
          <p className="text-[11px] font-bold text-forest-800/70 uppercase">{t.totalDisbursed} (Debits)</p>
          <p className="text-2xl font-black text-forest-900 mt-1">
            ₹{totalDebit.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
          <p className="text-[11px] font-bold text-emerald-800 uppercase">{t.totalCollected} (Credits)</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            ₹{totalCredit.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-sandstone-200/50 p-4 rounded-2xl border border-clay">
          <p className="text-[11px] font-bold text-forest-800/70 uppercase">{t.activeLedgerCount}</p>
          <p className="text-2xl font-black text-forest-900 mt-1">{ledger.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-clay pb-2">
        <button
          onClick={() => setActiveTab('LEDGER')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'LEDGER'
              ? 'bg-forest-800 text-white shadow-xs'
              : 'text-forest-800 hover:bg-sandstone-200'
          }`}
        >
          {t.tabLedger}
        </button>
        <button
          onClick={() => setActiveTab('UPI_SIM')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'UPI_SIM'
              ? 'bg-forest-800 text-white shadow-xs'
              : 'text-forest-800 hover:bg-sandstone-200'
          }`}
        >
          <QrCode className="w-3.5 h-3.5 text-terracotta-400" />
          <span>{t.tabUpi}</span>
        </button>
        <button
          onClick={() => setActiveTab('CASH_ENTRY')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'CASH_ENTRY'
              ? 'bg-forest-800 text-white shadow-xs'
              : 'text-forest-800 hover:bg-sandstone-200'
          }`}
        >
          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.tabCash}</span>
        </button>
      </div>

      {/* TAB 1: LEDGER VIEW */}
      {activeTab === 'LEDGER' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-forest-800/50" />
              <input
                type="text"
                placeholder="Search transaction, account or UTR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-sandstone-50 border border-clay rounded-xl text-xs text-forest-900"
              />
            </div>
          </div>

          <div className="bg-sandstone-50 rounded-3xl border border-clay shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sandstone-200/70 border-b border-clay text-forest-900 font-extrabold">
                  <tr>
                    <th className="py-3 px-4">{t.colTxnId}</th>
                    <th className="py-3 px-4">{t.colDateTime}</th>
                    <th className="py-3 px-4">{t.colAccount}</th>
                    <th className="py-3 px-4">{t.colType}</th>
                    <th className="py-3 px-4 text-right">{t.colDebit}</th>
                    <th className="py-3 px-4 text-right">{t.colCredit}</th>
                    <th className="py-3 px-4 text-right">{t.colBalance}</th>
                    <th className="py-3 px-4">{t.colDualControl}</th>
                    <th className="py-3 px-4 text-center">{t.colStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-clay/40 font-medium">
                  {filteredLedger.map((item) => (
                    <tr key={item.id} className="hover:bg-sandstone-100/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-forest-900">
                        <div>{item.id}</div>
                        <div className="text-[10px] text-forest-800/60 font-sans">{item.referenceId}</div>
                      </td>

                      <td className="py-3 px-4 text-forest-800/80 whitespace-nowrap">
                        {item.timestamp}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-bold text-forest-900">{item.borrowerName}</p>
                        <p className="text-[10px] font-mono text-forest-800/70">{item.accountNumber}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.type === 'DISBURSEMENT'
                              ? 'bg-amber-100 text-amber-900'
                              : item.type === 'UPI_REPAYMENT'
                              ? 'bg-emerald-100 text-emerald-900'
                              : item.type === 'CASH_COLLECTION'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-sandstone-200 text-forest-900'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-terracotta-600">
                        {item.debit > 0 ? `₹${item.debit.toLocaleString('en-IN')}` : '-'}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        {item.credit > 0 ? `₹${item.credit.toLocaleString('en-IN')}` : '-'}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-forest-900">
                        ₹{item.balanceAfter.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-[10px]">
                        <div>Maker: <strong className="font-mono">{item.makerId}</strong></div>
                        {item.checkerId ? (
                          <div>Checker: <strong className="font-mono text-emerald-700">{item.checkerId}</strong></div>
                        ) : (
                          <div className="text-amber-700 font-semibold">Checker Verification Pending</div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {item.status === 'SETTLED' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Settled</span>
                          </span>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-amber-700 font-bold">Unverified</span>
                            <button
                              onClick={() => handleVerifyCash(item)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold shadow-xs transition-all"
                            >
                              {t.verifyCashBtn}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIMULATE INWARD UPI */}
      {activeTab === 'UPI_SIM' && (
        <div className="bg-sandstone-50 p-6 rounded-3xl border border-clay max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-clay pb-3">
            <QrCode className="w-5 h-5 text-terracotta-600" />
            <div>
              <h3 className="font-extrabold text-sm text-forest-900">{t.upiSimulatorTitle}</h3>
              <p className="text-[11px] text-forest-800/70">{t.upiSimulatorDesc}</p>
            </div>
          </div>

          <form onSubmit={handleSimulateUpi} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-forest-900 mb-1">Target Loan Account</label>
              <select
                value={upiForm.accountNumber}
                onChange={(e) => {
                  const acc = e.target.value;
                  const name = acc === 'GGY-LN-KA-2026-0001' ? 'Smt. Lakshmi Gowda' : 'Sri Basavaraj Patil';
                  setUpiForm({ ...upiForm, accountNumber: acc, borrowerName: name });
                }}
                className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-mono"
              >
                <option value="GGY-LN-KA-2026-0001">GGY-LN-KA-2026-0001 (Smt. Lakshmi Gowda)</option>
                <option value="GGY-LN-KA-2026-0004">GGY-LN-KA-2026-0004 (Sri Basavaraj Patil)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-forest-900 mb-1">Repayment Credit Amount (₹)</label>
                <input
                  type="number"
                  min={100}
                  max={100000}
                  step={100}
                  value={upiForm.amount}
                  onChange={(e) => setUpiForm({ ...upiForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">12-Digit NPCI UTR Reference</label>
                <input
                  type="text"
                  required
                  value={upiForm.utr}
                  onChange={(e) => setUpiForm({ ...upiForm, utr: e.target.value })}
                  className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Atomic Credit Protocol</span>
              </p>
              <p>Simulates the bank's UPI webhook payload (`POST /api/v1/collections/upi/confirm`). Outstanding balance is automatically reduced with zero cashier intervention.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-terracotta-400" />
              <span>{t.fireUpiWebhook}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: RECORD DOORSTEP CASH */}
      {activeTab === 'CASH_ENTRY' && (
        <div className="bg-sandstone-50 p-6 rounded-3xl border border-clay max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-clay pb-3">
            <Banknote className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-extrabold text-sm text-forest-900">{t.cashEntryTitle}</h3>
              <p className="text-[11px] text-forest-800/70">{t.cashEntryDesc}</p>
            </div>
          </div>

          <form onSubmit={handleRecordCash} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-forest-900 mb-1">Borrower Account</label>
              <select
                value={cashForm.accountNumber}
                onChange={(e) => {
                  const acc = e.target.value;
                  const name = acc === 'GGY-LN-KA-2026-0001' ? 'Smt. Lakshmi Gowda' : 'Sri Basavaraj Patil';
                  setCashForm({ ...cashForm, accountNumber: acc, borrowerName: name });
                }}
                className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-mono"
              >
                <option value="GGY-LN-KA-2026-0001">GGY-LN-KA-2026-0001 (Smt. Lakshmi Gowda)</option>
                <option value="GGY-LN-KA-2026-0004">GGY-LN-KA-2026-0004 (Sri Basavaraj Patil)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-forest-900 mb-1">Cash Collected Amount (₹)</label>
                <input
                  type="number"
                  min={100}
                  max={50000}
                  step={100}
                  value={cashForm.amount}
                  onChange={(e) => setCashForm({ ...cashForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Physical Receipt Serial Number</label>
                <input
                  type="text"
                  required
                  value={cashForm.receiptNumber}
                  onChange={(e) => setCashForm({ ...cashForm, receiptNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>RBI Dual-Control Cash Rule</span>
              </p>
              <p>Under RBI microfinance operating guidelines, a field officer who collects cash CANNOT self-verify the credit. Cash must be surrendered at the branch and authorized by the Branch Manager (`manager_anita`) before the borrower balance is credited.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-terracotta-400" />
              <span>{t.submitCashEntry}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
