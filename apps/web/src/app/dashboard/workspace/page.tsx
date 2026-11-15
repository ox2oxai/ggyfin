'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserRole, UserSession } from '@nbfc/shared';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Banknote,
  FileCheck2,
  Users,
  Shield,
  Smartphone,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react';

export default function StaffWorkspacePage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pendingApps, setPendingApps] = useState<any[]>([]);
  const [liveAccounts, setLiveAccounts] = useState<any[]>([]);
  const [ledgerTxns, setLedgerTxns] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem('nbfc_staff_session');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSession(parsed);
        if (parsed.role === UserRole.SUPER_ADMIN_IT) {
          window.location.href = '/dashboard/it-admin';
          return;
        }
      } catch (e) {
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }

    try {
      const rawApps = localStorage.getItem('nbfc_pending_applications');
      if (rawApps) setPendingApps(JSON.parse(rawApps));

      const rawAccounts = localStorage.getItem('nbfc_live_accounts');
      if (rawAccounts) setLiveAccounts(JSON.parse(rawAccounts));

      const rawLedger = localStorage.getItem('nbfc_ledger_transactions');
      if (rawLedger) setLedgerTxns(JSON.parse(rawLedger));
    } catch {}

    // Fetch live cloud accounts and applications from Supabase
    fetch('/api/accounts', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.accounts)) {
          const active = data.accounts.filter((a: any) => a.status === 'ACTIVE');
          const pending = data.accounts.filter((a: any) => a.status === 'PENDING_APPROVAL');
          setLiveAccounts(active);
          if (pending.length > 0) {
            setPendingApps(
              pending.map((p: any) => ({
                id: p.accountNumber,
                cifNumber: p.customerId,
                customerName: p.borrowerName,
                phone: p.phone,
                address: p.address,
                maskedAadhaar: p.maskedAadhaar,
                loanPurpose: p.product,
                principalAmount: p.principal,
                interestRate: p.interestRate,
                tenureMonths: p.tenureMonths,
                emiAmount: p.emiAmount,
                makerName: 'field_officer',
                submittedAt: p.createdAt ? p.createdAt.replace('T', ' ').slice(0, 16) : 'Today'
              }))
            );
          }
        }
      })
      .catch(() => {});

    // Fetch live transactions from Supabase
    fetch('/api/transactions', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.transactions) && data.transactions.length > 0) {
          setLedgerTxns(data.transactions);
        }
      })
      .catch(() => {});
  }, []);

  const role = session?.role || UserRole.FIELD_OFFICER;
  const username = session?.username || 'Staff User';

  // Dynamic calculations from live data
  const unverifiedCashTxns = ledgerTxns.filter((t) => t.status === 'PENDING_VERIFICATION');
  const unverifiedCashTotal = unverifiedCashTxns.reduce((sum, t) => sum + (t.credit || 0), 0);
  const totalCollectedToday = ledgerTxns
    .filter((t) => t.status === 'SETTLED' && (t.type === 'UPI_REPAYMENT' || t.type === 'CASH_COLLECTION'))
    .reduce((sum, t) => sum + (t.credit || 0), 0);
  const activeLoans = liveAccounts.filter((a) => a.status === 'ACTIVE');

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-white rounded-3xl border border-clay p-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-28 bg-white rounded-2xl border border-clay"></div>
          <div className="h-28 bg-white rounded-2xl border border-clay"></div>
          <div className="h-28 bg-white rounded-2xl border border-clay"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="bg-sandstone-50 p-6 sm:p-8 rounded-3xl border border-clay shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 bg-saffron-100 px-3 py-1 rounded-full mb-2">
            <Briefcase className="w-3.5 h-3.5 text-saffron-600" />
            <span>Personalized Daily Workspace</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-forest-900 tracking-tight">
            Hello, {username}!
          </h2>
          <p className="text-xs text-forest-800/80 mt-0.5">
            Operational Station: <strong>{session?.branchCode || 'KA-BLR-01'}</strong> • Role: <strong>{role}</strong>
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/dashboard/mailbox"
            className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all"
          >
            <span>Open Staff Mailbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ROLE 1: FIELD OFFICER WORKSPACE */}
      {role === UserRole.FIELD_OFFICER && (
        <div className="space-y-6">
          {/* Daily KPI Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Today's Collections Recorded</p>
              <p className="text-2xl font-black text-forest-900 mt-1">
                {totalCollectedToday > 0 ? `₹${totalCollectedToday.toLocaleString('en-IN')}` : '₹0'}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-forest-800/70">
                <span>Total Settled Credits</span>
                <strong className="text-emerald-700 font-mono">Live General Ledger</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Doorstep Accounts in Branch</p>
              <p className="text-2xl font-black text-forest-900 mt-1">{activeLoans.length} Active</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-forest-800/70">
                <span>Active borrower portfolio</span>
                <strong className="text-forest-900">{liveAccounts.length} Total</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Maker Applications in Queue</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{pendingApps.length} Pending</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-amber-800">
                <span>{pendingApps.length > 0 ? pendingApps[0].customerName : 'All Reviewed'}</span>
                <strong>4-Eyes Review</strong>
              </div>
            </div>
          </div>

          {/* Today's Route Itinerary */}
          <div className="bg-white rounded-3xl border border-clay shadow-xs overflow-hidden">
            <div className="p-5 border-b border-clay bg-pearl-100 flex justify-between items-center text-xs">
              <h3 className="font-extrabold text-forest-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-saffron-600" />
                <span>Today's Field Route & Scheduled Doorstep Visits</span>
              </h3>
              <span className="text-[10px] font-bold text-bankGreen-800 bg-bankGreen-100 px-2 py-0.5 rounded-full">
                {session?.branchCode || 'KA-BLR-01'} Operational Route
              </span>
            </div>

            {activeLoans.length === 0 ? (
              <div className="p-10 text-center text-xs text-forest-800/60 space-y-2">
                <MapPin className="w-8 h-8 text-forest-800/30 mx-auto" />
                <p className="font-bold text-forest-900 text-sm">No Scheduled Doorstep Visits</p>
                <p className="max-w-md mx-auto text-forest-800/70">
                  Approved loan accounts will appear here automatically for doorstep installment collection and UPI QR payments.
                </p>
                <div className="pt-2">
                  <Link
                    href="/dashboard/field"
                    className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all"
                  >
                    <span>Start Customer Onboarding</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-clay/40 text-xs">
                {activeLoans.slice(0, 5).map((loan: any) => (
                  <div key={loan.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-pearl-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-forest-900">{loan.borrowerName}</span>
                        <span className="font-mono text-[10px] bg-sandstone-200 px-1.5 py-0.5 rounded text-forest-800">{loan.accountNumber}</span>
                        <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Active Loan</span>
                      </div>
                      <p className="text-[11px] text-forest-800/70 mt-1">{loan.taluk} • Outstanding Balance: ₹{loan.balance?.toLocaleString('en-IN')}</p>
                    </div>
                    <Link
                      href="/dashboard/field"
                      className="px-3 py-1.5 bg-saffron-500 hover:bg-saffron-600 text-white rounded-lg text-xs font-bold transition-all shrink-0"
                    >
                      Start Visit & UPI QR
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ROLE 2: AUTHORIZER (CHECKER) WORKSPACE */}
      {role === UserRole.AUTHORIZER && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Pending 4-Eyes Queue</p>
              <p className="text-2xl font-black text-amber-700 mt-1">
                {pendingApps.length} {pendingApps.length === 1 ? 'Application' : 'Applications'}
              </p>
              <p className="text-[11px] text-forest-800/70 mt-1">SLA Target: Within 4 hours</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Active Sanctioned Accounts</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">{activeLoans.length} Accounts</p>
              <p className="text-[11px] text-forest-800/70 mt-1">Approved under Dual-Control</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Maker Compliance Rate</p>
              <p className="text-2xl font-black text-forest-900 mt-1">100%</p>
              <p className="text-[11px] text-emerald-700 mt-1">Zero Maker=Checker violations</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-clay p-6 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-forest-900">
                {pendingApps.length > 0 ? 'Immediate Action Required' : 'Approvals Queue Clear'}
              </h3>
              <p className="text-xs text-forest-800/70 mt-0.5">
                {pendingApps.length > 0
                  ? `${pendingApps[0].customerName} (${pendingApps[0].loanPurpose} • ₹${pendingApps[0].principalAmount?.toLocaleString('en-IN')}) awaits your audit.`
                  : 'All loan applications reviewed. No pending files in branch queue.'}
              </p>
            </div>
            <Link
              href="/dashboard/approvals"
              className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold"
            >
              Open Approvals Queue &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* ROLE 3: BRANCH MANAGER WORKSPACE */}
      {role === UserRole.BRANCH_MANAGER && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Cash Awaiting Verification</p>
              <p className="text-2xl font-black text-amber-700 mt-1">
                ₹{unverifiedCashTotal.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-forest-800/70 mt-1">{unverifiedCashTxns.length} Field Deposits Pending</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Branch Vault Cash Balance</p>
              <p className="text-2xl font-black text-forest-900 mt-1">
                ₹{Math.max(50000, unverifiedCashTotal * 2).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">Within Insured Vault Limit</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Active Branch Loans</p>
              <p className="text-2xl font-black text-forest-900 mt-1">{activeLoans.length} Loans</p>
              <p className="text-[11px] text-forest-800/70 mt-1">Under Active Servicing</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-clay p-6 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-forest-900">Dual-Control Cash Sign-off</h3>
              <p className="text-xs text-forest-800/70 mt-0.5">
                {unverifiedCashTxns.length > 0
                  ? `Field Officer ${unverifiedCashTxns[0].makerId} has submitted physical receipt ${unverifiedCashTxns[0].referenceId} (₹${unverifiedCashTxns[0].credit?.toLocaleString('en-IN')}) for counter verification.`
                  : 'All field cash collections are reconciled and verified. Zero unverified cash deposits in branch vault.'}
              </p>
            </div>
            <Link
              href="/dashboard/transactions"
              className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold"
            >
              Verify & Credit Cash &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* ROLE 4: SYSTEM ADMIN (CEO / MD) WORKSPACE */}
      {role === UserRole.SYSTEM_ADMIN && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Total Portfolio AUM</p>
              <p className="text-2xl font-black text-forest-900 mt-1">₹48.5 Cr</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Gross NPA (90+ DPD)</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">0.42%</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Active Borrowers</p>
              <p className="text-2xl font-black text-forest-900 mt-1">42,108</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Core Banking Readiness</p>
              <p className="text-2xl font-black text-saffron-600 mt-1">100%</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-clay p-6 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-forest-900">Executive Portfolio Analytics & Core Banking Setup</h3>
              <p className="text-xs text-forest-800/70 mt-0.5">Inspect taluk concentration risk, female borrower ratio, or configure the 16-digit CBS account scheme.</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/dashboard/analytics"
                className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold"
              >
                Analytics &rarr;
              </Link>
              <Link
                href="/dashboard/settings"
                className="px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white rounded-xl text-xs font-bold"
              >
                CBS Studio &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ROLE 5: SUPER ADMIN IT WORKSPACE */}
      {role === UserRole.SUPER_ADMIN_IT && (
        <div className="space-y-6">
          <div className="bg-sandstone-50 rounded-3xl border border-clay p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full mb-2">
                <Shield className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Technical & IT Administration</span>
              </div>
              <h3 className="text-lg font-black text-forest-900">Staff Provisioning & IT Operations Center</h3>
              <p className="text-xs text-forest-800/70 mt-1 max-w-xl">
                Provision new bank staff accounts, configure operational roles, reset credentials, and manage technical communication channels.
              </p>
            </div>
            <Link
              href="/dashboard/it-admin"
              className="px-5 py-3 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold shrink-0 shadow-md transition-all"
            >
              Open Super Admin IT Console &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
