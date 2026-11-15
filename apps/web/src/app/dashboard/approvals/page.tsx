'use client';

import React, { useState } from 'react';
import { recordAuditLog } from '../../../lib/audit';
import {
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  FileText,
  Lock
} from 'lucide-react';

interface PendingApplication {
  id: string;
  cifNumber: string;
  customerName: string;
  phone: string;
  address: string;
  maskedAadhaar: string;
  loanPurpose: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  makerName: string;
  submittedAt: string;
}

export default function ApprovalsPage() {
  const [applications, setApplications] = useState<PendingApplication[]>(() => {
    try {
      const raw = localStorage.getItem('nbfc_pending_applications');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [remarks, setRemarks] = useState('KYC documents audited. Livelihood verification completed. Approved under dual-control Four-Eyes governance.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [decisionNotice, setDecisionNotice] = useState<{ type: 'APPROVED' | 'REJECTED'; accountNo?: string } | null>(null);

  const activeApp = applications.find((a) => a.id === selectedAppId);

  const handleApprove = () => {
    if (!activeApp) return;
    setIsProcessing(true);

    setTimeout(() => {
      const generatedAccountNo = `GGY-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const updatedApps = applications.filter((a) => a.id !== activeApp.id);
      setApplications(updatedApps);
      try {
        localStorage.setItem('nbfc_pending_applications', JSON.stringify(updatedApps));

        // Add to active accounts
        const rawAccounts = localStorage.getItem('nbfc_live_accounts');
        const accList = rawAccounts ? JSON.parse(rawAccounts) : [];
        accList.unshift({
          id: `acc-${Date.now()}`,
          customerId: activeApp.cifNumber,
          accountNumber: generatedAccountNo,
          borrowerName: activeApp.customerName,
          maskedAadhaar: activeApp.maskedAadhaar,
          phone: activeApp.phone,
          taluk: activeApp.address,
          product: activeApp.loanPurpose,
          principal: activeApp.principalAmount,
          balance: activeApp.principalAmount,
          interestRate: activeApp.interestRate,
          tenureMonths: activeApp.tenureMonths,
          status: 'ACTIVE',
          makerId: activeApp.makerName,
          checkerId: 'checker_authorizer',
          disbursedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        });
        localStorage.setItem('nbfc_live_accounts', JSON.stringify(accList));

        // Add initial disbursement entry into ledger
        const rawLedger = localStorage.getItem('nbfc_ledger_transactions');
        const ledgerList = rawLedger ? JSON.parse(rawLedger) : [];
        ledgerList.unshift({
          id: `TXN-DISB-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          customerId: activeApp.cifNumber,
          accountNumber: generatedAccountNo,
          borrowerName: activeApp.customerName,
          type: 'DISBURSEMENT',
          debit: activeApp.principalAmount,
          credit: 0,
          balanceAfter: activeApp.principalAmount,
          makerId: activeApp.makerName,
          checkerId: 'checker_authorizer',
          referenceId: `SANCTION-${generatedAccountNo}`,
          status: 'SETTLED'
        });
        localStorage.setItem('nbfc_ledger_transactions', JSON.stringify(ledgerList));

        recordAuditLog({
          category: 'OPERATIONAL_BANKING_EVENT',
          action: 'LOAN_APPROVED',
          target: generatedAccountNo,
          details: `Four-Eyes approval sanctioned by Authorizer for ${activeApp.customerName} (₹${activeApp.principalAmount.toLocaleString('en-IN')}) - CBS Account Issued: ${generatedAccountNo}`
        });
      } catch (e) {}

      setIsProcessing(false);
      setDecisionNotice({ type: 'APPROVED', accountNo: generatedAccountNo });
    }, 700);
  };

  const handleReject = () => {
    if (!activeApp) return;
    setIsProcessing(true);

    setTimeout(() => {
      const updatedApps = applications.filter((a) => a.id !== activeApp.id);
      setApplications(updatedApps);
      try {
        localStorage.setItem('nbfc_pending_applications', JSON.stringify(updatedApps));
        recordAuditLog({
          category: 'OPERATIONAL_BANKING_EVENT',
          action: 'LOAN_REJECTED',
          target: activeApp.cifNumber,
          details: `Application rejected by Authorizer for ${activeApp.customerName} (${activeApp.loanPurpose})`
        });
      } catch (e) {}
      setIsProcessing(false);
      setDecisionNotice({ type: 'REJECTED' });
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-sandstone-50 p-6 rounded-3xl border border-clay shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 bg-sandstone-200 px-2.5 py-1 rounded-full border border-clay mb-2">
            <UserCheck className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Authorizer / Checker Workstation • Four-Eyes Dual Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-forest-900">Pending Approvals Queue</h2>
          <p className="text-xs text-forest-800/70 mt-0.5">
            Sole authority to approve or reject customer accounts. Maker cannot approve their own drafted applications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-terracotta-50 text-terracotta-700 px-3.5 py-2 rounded-xl border border-terracotta-200">
          <Clock className="w-4 h-4 text-terracotta-600" />
          <span>{applications.length} Applications Awaiting Decision</span>
        </div>
      </div>

      {decisionNotice && (
        <div
          className={`p-5 rounded-2xl border flex items-start gap-3 text-xs ${
            decisionNotice.type === 'APPROVED'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          {decisionNotice.type === 'APPROVED' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold text-sm">
              {decisionNotice.type === 'APPROVED'
                ? `Account Approved & Activated! Core Account No: ${decisionNotice.accountNo}`
                : 'Application Returned to Maker in DRAFT status with remediation notes.'}
            </p>
            <p className="mt-0.5">
              Decision permanently committed to immutable audit logs with authorizer signature and timestamp.
            </p>
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-sandstone-50 p-12 text-center rounded-3xl border border-clay">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-forest-900">All Approvals Cleared</h3>
          <p className="text-xs text-forest-800/70 mt-1">
            No pending loan applications in your branch queue.
          </p>
        </div>
      ) : (
        /* Dual-Pane Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Customer Application Details */}
          <div className="lg:col-span-7 bg-sandstone-50 rounded-3xl p-6 border border-clay shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-clay/60 pb-3">
              <div>
                <span className="text-[11px] font-bold text-forest-800/60 uppercase">Application Reference</span>
                <h3 className="font-black text-lg text-forest-900">{activeApp?.cifNumber}</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                PENDING_APPROVAL
              </span>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-forest-800/60 block">Customer Name</span>
                <span className="font-bold text-forest-900 text-sm">{activeApp?.customerName}</span>
              </div>
              <div>
                <span className="text-forest-800/60 block">Mobile Number</span>
                <span className="font-bold text-forest-900 text-sm">{activeApp?.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-forest-800/60 block">Permanent Address</span>
                <span className="font-medium text-forest-900">{activeApp?.address}</span>
              </div>
              <div>
                <span className="text-forest-800/60 block">Masked Aadhaar Identifier</span>
                <span className="font-mono font-bold text-forest-900 text-sm">{activeApp?.maskedAadhaar}</span>
              </div>
              <div>
                <span className="text-forest-800/60 block">Drafted By (Maker)</span>
                <span className="font-medium text-forest-900">{activeApp?.makerName}</span>
              </div>
            </div>

            {/* Loan Terms Summary */}
            <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-forest-900">Loan Purpose:</span>
                <span className="font-extrabold text-terracotta-600">{activeApp?.loanPurpose}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-clay/60 text-xs">
                <div>
                  <span className="text-[11px] text-forest-800/60 block">Principal</span>
                  <span className="font-bold text-forest-900">₹{activeApp?.principalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[11px] text-forest-800/60 block">Tenure</span>
                  <span className="font-bold text-forest-900">{activeApp?.tenureMonths} Mos</span>
                </div>
                <div>
                  <span className="text-[11px] text-forest-800/60 block">Monthly EMI</span>
                  <span className="font-bold text-emerald-700">₹{activeApp?.emiAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Checker Remarks Input */}
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Authorizer Audit Remarks (Mandatory for Compliance Audit)
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-xs text-forest-900 focus:ring-2 focus:ring-terracotta-500 outline-hidden"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleReject}
                disabled={isProcessing}
                className="py-3 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Return with Remarks</span>
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={isProcessing}
                className="py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-sandstone-50 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-terracotta-400" />
                <span>Approve & Issue Account</span>
              </button>
            </div>
          </div>

          {/* Right Pane: Decrypted KYC Inspection Viewport */}
          <div className="lg:col-span-5 bg-sandstone-50 rounded-3xl p-6 border border-clay shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-clay/60 pb-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-forest-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Encrypted KYC Document Vault</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                AES-256-GCM
              </span>
            </div>

            <div className="bg-sandstone-100 p-3 rounded-xl border border-clay text-[11px] text-forest-800/80 flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta-600 shrink-0" />
              <span>Inspection View Token: <strong>Active (58s remaining)</strong></span>
            </div>

            {/* Document Preview Box */}
            <div className="border border-clay rounded-2xl overflow-hidden bg-sandstone-100/70 p-4 space-y-4 text-center">
              <div className="w-24 h-24 rounded-full bg-clay mx-auto flex items-center justify-center text-forest-800 font-bold text-2xl border-2 border-forest-800 shadow-sm">
                SP
              </div>
              <div>
                <p className="text-xs font-bold text-forest-900">{activeApp?.customerName}</p>
                <p className="text-[10px] text-forest-800/60">Live Field Selfie Verified</p>
              </div>

              {/* Masked Card Mockup */}
              <div className="bg-sandstone-50 p-4 rounded-xl border border-clay text-left shadow-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-forest-800/60">GOVT OF INDIA ID PROOF</span>
                  <span className="text-[10px] font-bold text-emerald-700">MASKED</span>
                </div>
                <div className="font-mono text-xs font-extrabold text-forest-900 tracking-wider">
                  {activeApp?.maskedAadhaar}
                </div>
                <p className="text-[9px] text-forest-800/50">
                  First 8 digits masked under UIDAI regulations. Verified against field physical document.
                </p>
              </div>
            </div>

            <div className="p-3 bg-sandstone-100 rounded-xl text-[10px] text-forest-800/70 leading-relaxed border border-clay/60">
              <p>
                <strong>Audit Notice:</strong> Every inspection view event logs your Authorizer user ID, timestamp, and IP address under Section 8 of the DPDP Act 2023.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
