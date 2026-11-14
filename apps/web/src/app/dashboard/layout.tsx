'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole, UserSession } from '@nbfc/shared';
import {
  Smartphone,
  ShieldCheck,
  LogOut,
  FileCheck2,
  Users,
  ArrowLeftRight
} from 'lucide-react';
import { GGYBrandMark } from '../../components/brand-mark';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem('nbfc_staff_session');
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch (e) {
        // fallback
      }
    } else {
      // Default to Field Officer demo session
      setSession({
        userId: 'u-field_officer-001',
        username: 'field_officer_ramesh',
        role: UserRole.FIELD_OFFICER,
        branchCode: 'KA-BLR-01'
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nbfc_staff_session');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-sandstone-100 flex flex-col">
      {/* Top Staff Navigation */}
      <header className="bg-forest-900 text-sandstone-100 border-b border-forest-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <GGYBrandMark size="sm" />
              <span className="font-bold text-sm tracking-tight hidden sm:inline">GGY Finance</span>
            </Link>
            <span className="text-xs text-sandstone-400 hidden sm:inline">•</span>
            <span className="text-xs bg-forest-800 text-sandstone-200 py-0.5 px-2.5 rounded-full border border-forest-700">
              Branch: <strong>{mounted ? (session?.branchCode || 'KA-BLR-01') : 'KA-BLR-01'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{mounted ? (session?.username || 'Staff User') : 'Staff User'}</p>
              <p className="text-[10px] text-terracotta-400 font-semibold">{mounted ? (session?.role || 'FIELD_OFFICER') : 'FIELD_OFFICER'}</p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs bg-forest-800 hover:bg-forest-700 text-sandstone-200 py-1.5 px-3 rounded-lg border border-forest-700 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-terracotta-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-forest-800/80 px-4 sm:px-8 flex gap-6 text-xs font-semibold overflow-x-auto border-t border-forest-700/60">
          <Link
            href="/dashboard/accounts"
            className={`py-3 inline-flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              pathname === '/dashboard/accounts'
                ? 'border-terracotta-500 text-white font-bold'
                : 'border-transparent text-sandstone-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-terracotta-400" />
            <span>Accounts & Loan Lifecycle</span>
          </Link>

          <Link
            href="/dashboard/transactions"
            className={`py-3 inline-flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              pathname === '/dashboard/transactions'
                ? 'border-terracotta-500 text-white font-bold'
                : 'border-transparent text-sandstone-300 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-terracotta-400" />
            <span>Ledger & Transactions (Credit/Debit)</span>
          </Link>

          <Link
            href="/dashboard/field"
            className={`py-3 inline-flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              pathname === '/dashboard/field'
                ? 'border-terracotta-500 text-white font-bold'
                : 'border-transparent text-sandstone-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-terracotta-400" />
            <span>Field Agent PWA</span>
          </Link>

          <Link
            href="/dashboard/approvals"
            className={`py-3 inline-flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              pathname === '/dashboard/approvals'
                ? 'border-terracotta-500 text-white font-bold'
                : 'border-transparent text-sandstone-300 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-terracotta-400" />
            <span>Checker 4-Eyes Approvals Queue</span>
          </Link>

          <Link
            href="/dashboard/analytics"
            className={`py-3 inline-flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              pathname === '/dashboard/analytics'
                ? 'border-terracotta-500 text-white font-bold'
                : 'border-transparent text-sandstone-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-terracotta-400" />
            <span>Portfolio Analytics & Reports</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
