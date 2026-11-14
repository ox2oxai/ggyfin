'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole, UserSession } from '@nbfc/shared';
import {
  Smartphone,
  ShieldCheck,
  Shield,
  LogOut,
  FileCheck2,
  Users,
  ArrowLeftRight,
  Settings,
  ShieldAlert,
  ArrowRight,
  Briefcase,
  Mail
} from 'lucide-react';
import { GGYBrandMark } from '../../components/brand-mark';

interface NavTab {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string;
}

const ALL_TABS: NavTab[] = [
  {
    href: '/dashboard/it-admin',
    label: 'IT Super Admin Control Center',
    icon: Shield,
    roles: [UserRole.SUPER_ADMIN_IT]
  },
  {
    href: '/dashboard/workspace',
    label: 'My Daily Workspace',
    icon: Briefcase,
    roles: [UserRole.FIELD_OFFICER, UserRole.AUTHORIZER, UserRole.BRANCH_MANAGER, UserRole.SYSTEM_ADMIN]
  },
  {
    href: '/dashboard/field',
    label: 'Field Agent PWA (Onboarding & UPI)',
    icon: Smartphone,
    roles: [UserRole.FIELD_OFFICER, UserRole.SYSTEM_ADMIN]
  },
  {
    href: '/dashboard/approvals',
    label: 'Checker 4-Eyes Approvals Queue',
    icon: FileCheck2,
    roles: [UserRole.AUTHORIZER, UserRole.SYSTEM_ADMIN]
  },
  {
    href: '/dashboard/transactions',
    label: 'Ledger & Transactions (Credit/Debit)',
    icon: ArrowLeftRight,
    roles: [UserRole.BRANCH_MANAGER, UserRole.SYSTEM_ADMIN]
  },
  {
    href: '/dashboard/accounts',
    label: 'Accounts & Loan Lifecycle',
    icon: Users,
    roles: [UserRole.BRANCH_MANAGER, UserRole.AUTHORIZER, UserRole.SYSTEM_ADMIN]
  },
  {
    href: '/dashboard/analytics',
    label: 'Portfolio Analytics & Reports',
    icon: ShieldCheck,
    roles: [UserRole.SYSTEM_ADMIN]
  },
  {
    href: '/dashboard/settings',
    label: 'Core Banking (CBS) & CIF Config',
    icon: Settings,
    roles: [UserRole.SYSTEM_ADMIN]
  },
  {
    href: '/dashboard/mailbox',
    label: 'Staff Mailbox',
    icon: Mail,
    roles: [UserRole.FIELD_OFFICER, UserRole.AUTHORIZER, UserRole.BRANCH_MANAGER, UserRole.SYSTEM_ADMIN]
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [unreadMailCount, setUnreadMailCount] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem('nbfc_staff_session');
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch (e) {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }

    // Dynamic unread count listener
    const syncMailboxCount = () => {
      try {
        const rawMsgs = localStorage.getItem('nbfc_staff_messages');
        if (rawMsgs) {
          const parsed = JSON.parse(rawMsgs);
          if (Array.isArray(parsed)) {
            setUnreadMailCount(parsed.filter((m: any) => !m.isRead).length);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    syncMailboxCount();
    window.addEventListener('storage', syncMailboxCount);
    window.addEventListener('nbfc_messages_updated', syncMailboxCount);

    return () => {
      window.removeEventListener('storage', syncMailboxCount);
      window.removeEventListener('nbfc_messages_updated', syncMailboxCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nbfc_staff_session');
    router.push('/login');
  };

  const userRole = session?.role || UserRole.FIELD_OFFICER;

  // Filter tabs visible strictly to this specific role
  const visibleTabs = ALL_TABS.filter((tab) => tab.roles.includes(userRole));

  // Check if current route is authorized for this user
  const currentTabConfig = ALL_TABS.find((tab) => pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href)));
  const isAuthorized = !currentTabConfig || currentTabConfig.roles.includes(userRole);

  const getDefaultRouteForRole = (role: UserRole) => {
    if (role === UserRole.SUPER_ADMIN_IT) {
      return '/dashboard/it-admin';
    }
    return '/dashboard/workspace';
  };

  const getTabBadge = (tab: NavTab) => {
    if (tab.href === '/dashboard/mailbox') {
      return unreadMailCount > 0 ? String(unreadMailCount) : undefined;
    }
    return tab.badge;
  };

  return (
    <div className="min-h-screen bg-sandstone-100 flex flex-col">
      {/* Top Staff Navigation with Saffron-White-Green Bank Palette */}
      <header className="bg-bankGreen-950 text-sandstone-100 border-b border-bankGreen-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <GGYBrandMark size="sm" />
              <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">GGY Finance</span>
            </Link>
            <span className="text-xs text-emerald-600 hidden sm:inline">•</span>
            <span className="text-xs bg-bankGreen-900 text-emerald-200 py-0.5 px-2.5 rounded-full border border-bankGreen-700/60 font-medium">
              Branch: <strong>{mounted ? (session?.branchCode || 'KA-BLR-01') : 'KA-BLR-01'}</strong>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] bg-saffron-500/20 text-saffron-300 py-0.5 px-2.5 rounded-full border border-saffron-500/40 font-mono font-bold">
              ROLE: <strong>{mounted ? userRole : '...'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{mounted ? (session?.username || 'Staff User') : 'Staff User'}</p>
              <p className="text-[10px] text-saffron-400 font-bold">{mounted ? (session?.role || 'FIELD_OFFICER') : '...'}</p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs bg-bankGreen-900 hover:bg-bankGreen-800 text-pearl-100 py-1.5 px-3 rounded-lg border border-bankGreen-700 transition-all font-semibold"
            >
              <LogOut className="w-3.5 h-3.5 text-saffron-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Role-Filtered Tab Bar */}
        <div className="bg-bankGreen-900/90 px-4 sm:px-8 flex gap-6 text-xs font-semibold overflow-x-auto border-t border-bankGreen-800/80">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            const badge = getTabBadge(tab);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`py-3 inline-flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-saffron-500 text-white font-black'
                    : 'border-transparent text-emerald-200/80 hover:text-white hover:border-emerald-500/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-400' : 'text-emerald-400'}`} />
                <span>{tab.label}</span>
                {badge && (
                  <span className="ml-1 bg-saffron-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area with Strict RBAC Guard & Hydration Protection */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!mounted ? (
          <div className="animate-pulse space-y-6">
            <div className="h-28 bg-white/70 rounded-3xl border border-clay/60"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-24 bg-white/70 rounded-2xl border border-clay/60"></div>
              <div className="h-24 bg-white/70 rounded-2xl border border-clay/60"></div>
              <div className="h-24 bg-white/70 rounded-2xl border border-clay/60"></div>
            </div>
          </div>
        ) : !isAuthorized ? (
          <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border-2 border-red-200 p-8 shadow-md text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-forest-900">Access Restricted — Segregation of Duties</h3>
            <p className="text-xs text-forest-800/80 leading-relaxed">
              {userRole === UserRole.SUPER_ADMIN_IT ? (
                <>
                  Under statutory Core Banking data isolation principles, <strong>Super Admin IT</strong> accounts are strictly quarantined from customer financial accounts, borrower identities, and credit operations. IT staff are restricted to technical infrastructure, gateway configurations, and staff provisioning.
                </>
              ) : (
                <>
                  Under Four-Eyes Corporate Governance principles, your role (<strong>{userRole}</strong>) is strictly segregated from this module. Field officers cannot authorize loans or view institutional risk analytics, and authorizers cannot execute field collections.
                </>
              )}
            </p>
            <div className="pt-2">
              <Link
                href={getDefaultRouteForRole(userRole)}
                className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all"
              >
                <span>Return to My Authorized Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
