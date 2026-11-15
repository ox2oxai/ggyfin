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
  Mail,
  User,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  BadgeCheck
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

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'DETAILS' | 'PASSWORD'>('DETAILS');
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const syncActiveSession = () => {
    const raw = localStorage.getItem('nbfc_staff_session');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSession(parsed);

        // Security check: verify account is still active in directory
        const rawDir = localStorage.getItem('nbfc_staff_directory');
        if (rawDir) {
          const dir = JSON.parse(rawDir);
          const userInDir = dir.find((u: any) => u.username === parsed.username);
          if (userInDir && !userInDir.isActive) {
            localStorage.removeItem('nbfc_staff_session');
            router.push('/login');
            return;
          }
        }

        // Automatic redirect if SUPER_ADMIN_IT lands on /dashboard or /dashboard/workspace
        if (parsed.role === UserRole.SUPER_ADMIN_IT && (pathname === '/dashboard' || pathname === '/dashboard/workspace')) {
          router.replace('/dashboard/it-admin');
          return;
        }
      } catch (e) {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  };

  useEffect(() => {
    setMounted(true);
    syncActiveSession();

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
    window.addEventListener('storage', syncActiveSession);
    window.addEventListener('nbfc_session_updated', syncActiveSession);
    window.addEventListener('nbfc_messages_updated', syncMailboxCount);

    return () => {
      window.removeEventListener('storage', syncMailboxCount);
      window.removeEventListener('storage', syncActiveSession);
      window.removeEventListener('nbfc_session_updated', syncActiveSession);
      window.removeEventListener('nbfc_messages_updated', syncMailboxCount);
    };
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('nbfc_staff_session');
    router.push('/login');
  };

  const handleOpenProfileModal = () => {
    setProfileError('');
    setProfileSuccess('');
    setProfileTab('DETAILS');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setEditFullName(session?.fullName || 'System Administrator');
    setEditEmail(session?.email || 'it.admin@ggyfinance.in');
    setEditPhone(session?.phone || '9800000000');
    setIsProfileModalOpen(true);
  };

  const handleSaveProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!editEmail.trim() || !editPhone.trim()) {
      setProfileError('Email and phone number are required.');
      return;
    }

    if (!session) return;

    try {
      const rawDir = localStorage.getItem('nbfc_staff_directory');
      const dir = rawDir ? JSON.parse(rawDir) : [];

      // Determine full name
      const isSuperAdmin = session.role === UserRole.SUPER_ADMIN_IT;
      const finalFullName = isSuperAdmin && editFullName.trim() ? editFullName.trim() : (session.fullName || 'System Administrator');

      // Update directory
      const updatedDir = dir.map((u: any) => {
        if (u.username === session.username) {
          return {
            ...u,
            fullName: finalFullName,
            email: editEmail.trim(),
            phone: editPhone.trim()
          };
        }
        return u;
      });
      localStorage.setItem('nbfc_staff_directory', JSON.stringify(updatedDir));

      // Update session
      const updatedSession = {
        ...session,
        fullName: finalFullName,
        email: editEmail.trim(),
        phone: editPhone.trim()
      };
      localStorage.setItem('nbfc_staff_session', JSON.stringify(updatedSession));
      setSession(updatedSession);

      // Append immutable audit log
      const rawAudit = localStorage.getItem('nbfc_audit_trail');
      const audits = rawAudit ? JSON.parse(rawAudit) : [];
      const newAudit = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        category: isSuperAdmin ? 'INTENDED_ADMIN_UPDATE' : 'OPERATIONAL_BANKING_EVENT',
        action: 'PROFILE_UPDATED',
        actorStaffNumber: session.staffNumber || 'EMP-1084-001',
        actorUsername: session.username,
        actorRole: session.role,
        target: session.staffNumber || session.username,
        details: isSuperAdmin
          ? `Super Admin IT updated their personal identity (Name: ${finalFullName}, Email: ${editEmail})`
          : `Staff user ${session.username} updated contact details (Email: ${editEmail}, Phone: ${editPhone})`,
        ip: '127.0.0.1'
      };
      localStorage.setItem('nbfc_audit_trail', JSON.stringify([newAudit, ...audits]));

      // Emit events
      window.dispatchEvent(new Event('nbfc_session_updated'));
      window.dispatchEvent(new Event('nbfc_audit_updated'));

      setProfileSuccess('Profile details successfully updated and synchronized!');
      setTimeout(() => {
        setIsProfileModalOpen(false);
      }, 1500);
    } catch {
      setProfileError('Failed to save profile updates.');
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (newPassword.length < 8) {
      setProfileError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileError('New passwords do not match. Please retype carefully.');
      return;
    }

    if (newPassword === currentPassword) {
      setProfileError('Your new confidential password must be different from your current password.');
      return;
    }

    if (!session) return;

    try {
      const rawDir = localStorage.getItem('nbfc_staff_directory');
      const dir = rawDir ? JSON.parse(rawDir) : [];
      const user = dir.find((u: any) => u.username === session.username);

      if (!user) {
        setProfileError('User record not found in directory.');
        return;
      }

      if (user.password !== currentPassword) {
        setProfileError('Current password does not match institutional records.');
        return;
      }

      // Update password
      const updatedDir = dir.map((u: any) =>
        u.username === session.username ? { ...u, password: newPassword, mustResetPassword: false } : u
      );
      localStorage.setItem('nbfc_staff_directory', JSON.stringify(updatedDir));

      // Append immutable audit log
      const rawAudit = localStorage.getItem('nbfc_audit_trail');
      const audits = rawAudit ? JSON.parse(rawAudit) : [];
      const newAudit = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        category: 'INTENDED_ADMIN_UPDATE',
        action: 'PASSWORD_CHANGED',
        actorStaffNumber: session.staffNumber || 'EMP-1084-001',
        actorUsername: session.username,
        actorRole: session.role,
        target: session.staffNumber || session.username,
        details: `Password changed securely by user ${session.username}`,
        ip: '127.0.0.1'
      };
      localStorage.setItem('nbfc_audit_trail', JSON.stringify([newAudit, ...audits]));

      window.dispatchEvent(new Event('nbfc_audit_updated'));
      setProfileSuccess('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsProfileModalOpen(false);
      }, 1500);
    } catch {
      setProfileError('Failed to change password.');
    }
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
            {/* Staff ID & Name badge */}
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
                  {mounted ? (session?.staffNumber || 'EMP-1084-001') : '...'}
                </span>
                <p className="text-xs font-bold text-white truncate max-w-[140px]">
                  {mounted ? (session?.fullName || session?.username || 'Staff User') : 'Staff User'}
                </p>
              </div>
              <p className="text-[10px] text-saffron-400 font-bold">{mounted ? (session?.role || 'FIELD_OFFICER') : '...'}</p>
            </div>

            {/* Profile Trigger Button */}
            <button
              onClick={handleOpenProfileModal}
              className="inline-flex items-center gap-1.5 text-xs bg-bankGreen-900 hover:bg-bankGreen-800 text-pearl-100 py-1.5 px-3 rounded-lg border border-bankGreen-700 transition-all font-semibold cursor-pointer"
              title="View and manage staff profile"
            >
              <User className="w-3.5 h-3.5 text-saffron-400" />
              <span className="hidden sm:inline">My Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs bg-bankGreen-900 hover:bg-bankGreen-800 text-pearl-100 py-1.5 px-3 rounded-lg border border-bankGreen-700 transition-all font-semibold cursor-pointer"
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
                className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer"
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

      {/* ======================================================== */}
      {/* MODAL: STAFF USER PROFILE & CREDENTIALS STUDIO */}
      {/* ======================================================== */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-bankGreen-950 to-bankGreen-900 p-6 text-white flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-2">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>Institutional Staff Identity</span>
                </div>
                <h3 className="text-lg font-black tracking-tight">Staff Profile & Biodata</h3>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Permanent Staff Identification: <strong className="font-mono text-white">{session?.staffNumber || 'EMP-1084-001'}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-bankGreen-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 px-6 pt-2">
              <button
                onClick={() => setProfileTab('DETAILS')}
                className={`py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${
                  profileTab === 'DETAILS'
                    ? 'border-orange-500 text-orange-600 font-black'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Personal & Contact Details
              </button>
              <button
                onClick={() => setProfileTab('PASSWORD')}
                className={`py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${
                  profileTab === 'PASSWORD'
                    ? 'border-orange-500 text-orange-600 font-black'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Change Confidential Password
              </button>
            </div>

            {/* Notification messages */}
            {profileError && (
              <div className="m-6 mb-0 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{profileError}</span>
              </div>
            )}
            {profileSuccess && (
              <div className="m-6 mb-0 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {/* TAB 1: DETAILS */}
            {profileTab === 'DETAILS' && (
              <form onSubmit={handleSaveProfileDetails} className="p-6 space-y-4 text-xs">
                {/* Identification Banner */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Staff ID (Immutable)</span>
                    <span className="font-mono font-black text-slate-900 text-xs">{session?.staffNumber || 'EMP-1084-001'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Username</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">@{session?.username}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Institutional Role</span>
                    <span className="font-bold text-orange-700 text-xs">{session?.role}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Branch SOL Code</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">{session?.branchCode}</span>
                  </div>
                </div>

                {/* Full Legal Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Full Legal Name</span>
                    {userRole !== UserRole.SUPER_ADMIN_IT && (
                      <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Locked (Set by IT Admin)
                      </span>
                    )}
                  </label>
                  {userRole === UserRole.SUPER_ADMIN_IT ? (
                    <div>
                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        placeholder="Enter your system administrator name"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-orange-500 outline-hidden"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Super Admin IT can customize their administrative identity.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          value={session?.fullName || 'Institutional Staff'}
                          disabled
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold cursor-not-allowed pr-8"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Staff legal names are permanent upon provisioning. Contact Super Admin IT for any corrections.
                      </p>
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institutional Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 outline-hidden"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Used for system alerts, notices, and communications.</p>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 outline-hidden"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Required for 2FA, OTPs, and statutory communication logs.</p>
                </div>

                {/* Form Actions */}
                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: CHANGE PASSWORD */}
            {profileTab === 'PASSWORD' && (
              <form onSubmit={handleSavePassword} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Confidential Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 8 characters"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Retype new password"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 outline-hidden"
                  />
                </div>

                {/* Form Actions */}
                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
