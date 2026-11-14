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

  useEffect(() => {
    const raw = localStorage.getItem('nbfc_staff_session');
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch (e) {
        // fallback
      }
    } else {
      setSession({
        userId: 'u-field_officer-001',
        username: 'field_officer_ramesh',
        role: UserRole.FIELD_OFFICER,
        branchCode: 'KA-BLR-01'
      });
    }
  }, []);

  const role = session?.role || UserRole.FIELD_OFFICER;
  const username = session?.username || 'Staff User';

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
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Today's Collection Target</p>
              <p className="text-2xl font-black text-forest-900 mt-1">₹45,000</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-forest-800/70">
                <span>Collected so far:</span>
                <strong className="text-emerald-700">₹32,500 (72%)</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Doorstep Visits Scheduled</p>
              <p className="text-2xl font-black text-forest-900 mt-1">6 Borrowers</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-forest-800/70">
                <span>Completed today:</span>
                <strong className="text-forest-900">4 of 6</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Maker Applications in Queue</p>
              <p className="text-2xl font-black text-amber-700 mt-1">1 Pending</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-amber-800">
                <span>Smt. Kavitha Revanna</span>
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
                Channapatna - Ramanagara Route
              </span>
            </div>

            <div className="divide-y divide-clay/40 text-xs">
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-pearl-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest-900">Smt. Lakshmi Gowda</span>
                    <span className="font-mono text-[10px] bg-sandstone-200 px-1.5 py-0.5 rounded text-forest-800">1084-0101-702-0039-4</span>
                    <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Visit Done (Cash Collected)</span>
                  </div>
                  <p className="text-[11px] text-forest-800/70 mt-1">Near Silk Market, Channapatna • Dairy Loan Installment: ₹4,500</p>
                </div>
                <div className="text-right text-[11px] text-emerald-800 font-mono font-bold">
                  RCPT-KA-BLR-0041
                </div>
              </div>

              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-pearl-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest-900">Sri Basavaraj Patil</span>
                    <span className="font-mono text-[10px] bg-sandstone-200 px-1.5 py-0.5 rounded text-forest-800">1084-0101-704-0018-9</span>
                    <span className="text-amber-800 text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded-full">Pending Visit Today</span>
                  </div>
                  <p className="text-[11px] text-forest-800/70 mt-1">Main Bazaar, Kunigal • Organic Retail Installment: ₹4,800</p>
                </div>
                <Link
                  href="/dashboard/field"
                  className="px-3 py-1.5 bg-saffron-500 hover:bg-saffron-600 text-white rounded-lg text-xs font-bold transition-all shrink-0"
                >
                  Start Visit & UPI QR
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROLE 2: AUTHORIZER (CHECKER) WORKSPACE */}
      {role === UserRole.AUTHORIZER && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Pending 4-Eyes Queue</p>
              <p className="text-2xl font-black text-amber-700 mt-1">1 Application</p>
              <p className="text-[11px] text-forest-800/70 mt-1">SLA Target: Within 4 hours</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Loans Sanctioned Today</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">3 Accounts</p>
              <p className="text-[11px] text-forest-800/70 mt-1">Total Volume: ₹1,80,000</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Maker Compliance Rate</p>
              <p className="text-2xl font-black text-forest-900 mt-1">100%</p>
              <p className="text-[11px] text-emerald-700 mt-1">Zero Maker=Checker violations</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-clay p-6 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-forest-900">Immediate Action Required</h3>
              <p className="text-xs text-forest-800/70 mt-0.5">Smt. Kavitha Revanna (Powerloom Artisan Working Capital • ₹80,000) awaits your audit.</p>
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
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Cash Awaiting Counterfoil Verification</p>
              <p className="text-2xl font-black text-amber-700 mt-1">₹4,800</p>
              <p className="text-[11px] text-forest-800/70 mt-1">1 Field Agent Deposit Pending</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Branch Vault Cash Balance</p>
              <p className="text-2xl font-black text-forest-900 mt-1">₹1,24,500</p>
              <p className="text-[11px] text-emerald-700 mt-1">Within RBI Insured Vault Limit</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-clay">
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Disbursements Ready to Release</p>
              <p className="text-2xl font-black text-forest-900 mt-1">2 Batches</p>
              <p className="text-[11px] text-forest-800/70 mt-1">IMPS / NEFT Settlement</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-clay p-6 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-forest-900">Dual-Control Cash Sign-off</h3>
              <p className="text-xs text-forest-800/70 mt-0.5">Field Officer Ramesh has submitted physical receipt RCPT-KA-TUM-0082 (₹4,800) for counter verification.</p>
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
              <p className="text-[10px] font-bold uppercase text-forest-800/60">Finacle CBS Readiness</p>
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
    </div>
  );
}
