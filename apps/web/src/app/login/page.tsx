'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@nbfc/shared';
import {
  Lock,
  Shield,
  ArrowLeft,
  User,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  ShieldCheck,
  Check,
  PhoneCall
} from 'lucide-react';
import { GGYBrandMark } from '../../components/brand-mark';
import { recordAuditLog } from '../../lib/audit';
import {
  StaffRecord,
  DEFAULT_STAFF_DIRECTORY,
  getStaffDirectoryAsync,
  getStaffDirectorySync,
  saveStaffDirectory
} from '../../lib/staff';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // First-Time Password Reset Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<StaffRecord | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');

  useEffect(() => {
    getStaffDirectoryAsync().catch(() => {});
  }, []);

  const routeByRole = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN_IT:
        router.push('/dashboard/it-admin');
        break;
      case UserRole.FIELD_OFFICER:
        router.push('/dashboard/workspace');
        break;
      case UserRole.AUTHORIZER:
        router.push('/dashboard/approvals');
        break;
      case UserRole.BRANCH_MANAGER:
        router.push('/dashboard/transactions');
        break;
      case UserRole.SYSTEM_ADMIN:
        router.push('/dashboard/analytics');
        break;
      default:
        router.push('/dashboard/workspace');
    }
  };

  // Live Detected Staff Preview
  const matchedStaff = username.trim()
    ? getStaffDirectorySync().find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() ||
          (u.staffNumber && u.staffNumber.trim().toLowerCase() === username.trim().toLowerCase()) ||
          (u.email && u.email.trim().toLowerCase() === username.trim().toLowerCase())
      ) ||
      DEFAULT_STAFF_DIRECTORY.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() ||
          (u.staffNumber && u.staffNumber.trim().toLowerCase() === username.trim().toLowerCase()) ||
          (u.email && u.email.trim().toLowerCase() === username.trim().toLowerCase())
      )
    : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: username.trim(),
          password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Invalid credentials. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      const user = data.user;

      if (data.mustResetPassword) {
        setPendingUser({
          id: user.id,
          staffNumber: user.staffNumber,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          branchCode: user.branchCode,
          isActive: true,
          mustResetPassword: true,
          createdAt: new Date().toISOString()
        });
        setIsResetModalOpen(true);
        setIsLoading(false);
        return;
      }

      // Successful Authentication: Establish staff session
      localStorage.setItem(
        'nbfc_staff_session',
        JSON.stringify({
          userId: user.id,
          staffNumber: user.staffNumber || '202010',
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          branchCode: user.branchCode
        })
      );

      routeByRole(user.role);
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (newPassword.length < 8 || newPassword.length > 128) {
      setResetError('Password must be between 8 and 128 characters.');
      return;
    }

    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      setResetError('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match. Please retype carefully.');
      return;
    }

    if (!pendingUser) return;

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: pendingUser.username,
          currentPassword: password,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setResetError(data.message || 'Failed to update password. Please try again.');
        return;
      }

      // Establish session
      localStorage.setItem(
        'nbfc_staff_session',
        JSON.stringify({
          userId: pendingUser.id,
          staffNumber: pendingUser.staffNumber || '202010',
          username: pendingUser.username,
          fullName: pendingUser.fullName,
          email: pendingUser.email,
          phone: pendingUser.phone,
          role: pendingUser.role,
          branchCode: pendingUser.branchCode
        })
      );

      setIsResetModalOpen(false);
      routeByRole(pendingUser.role);
    } catch {
      setResetError('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-orange-500 selection:text-white">
      {/* Modern Split-Screen Banking Gateway Card */}
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* ======================================================== */}
        {/* LEFT COLUMN: INSTITUTIONAL TRUST & CORE BANKING PILLAR */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#062e1c] via-[#064e3b] to-[#022c22] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Website</span>
            </Link>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <GGYBrandMark size="lg" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    GGY Finance
                  </h1>
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                    Institutional Core Banking Portal
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed font-normal">
                National Micro-Lending Platform operating under strict RBI Dual-Control Maker-Checker protocols and DPDP Act 2023 data sovereignty.
              </p>
            </div>

            {/* Institutional Security Assurance Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-emerald-100">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">AES-256 Envelope Vault</strong>
                  <span className="text-[11px] text-emerald-200/80">UIDAI compliant masked Aadhaar and encrypted document storage.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-emerald-100">
                <Shield className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">DPDP Act 2023 Compliant</strong>
                  <span className="text-[11px] text-emerald-200/80">100% Data Sovereignty housed exclusively in Indian Data Centers.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-emerald-100">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">RBI Four-Eyes Principle</strong>
                  <span className="text-[11px] text-emerald-200/80">Maker-Checker dual authorization for loan sanctions and cash collections.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Support Helpline Pill */}
          <div className="relative z-10 pt-6 mt-6 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-300/90">
            <span className="flex items-center gap-1.5 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              <span>IT Support: 1800-889-2020</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
              Branch 2020 Active
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: AUTHENTICATION WORKSPACE CARD */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6 bg-white">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-[11px] font-black uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3 text-orange-600" />
              <span>Staff Authentication</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign In to Your Workspace
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Enter your assigned institutional username, numeric staff ID, or registered email.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  Staff Identifier (Username, ID, or Email)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">e.g. ngyaragatti or 202011</span>
              </div>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. ngyaragatti or 202011"
                  maxLength={80}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Live Detected Staff Preview Badge */}
            {matchedStaff && (
              <div className="p-2.5 bg-orange-50/80 border border-orange-200/80 rounded-xl text-[11px] text-orange-950 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{matchedStaff.fullName}</span>
                </div>
                <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-orange-200 text-orange-700 font-extrabold">
                  {matchedStaff.role} ({matchedStaff.branchCode})
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Password
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Quick Fill Test Staff Pills */}
            <div className="pt-1 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Quick Fill Test Staff:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUsername('ngyaragatti');
                    setPassword('GGYSecurePassword@2026');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-[11px] font-bold transition-all cursor-pointer"
                >
                  System Admin: @ngyaragatti (202011)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('it_superadmin');
                    setPassword('GGY#SuperAdminIT@2026!');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-all cursor-pointer"
                >
                  IT Superadmin: @it_superadmin (202010)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-xs font-black text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer min-h-[46px]"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Staff Portal'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MANDATORY FIRST-TIME PASSWORD RESET MODAL */}
      {/* ======================================================== */}
      {isResetModalOpen && pendingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-950">Set Your Private Password</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Welcome, <strong>{pendingUser.fullName}</strong>. As an institutional banking security requirement, please create your own confidential password before continuing.
              </p>
            </div>

            {resetError && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-xl font-medium">
                {resetError}
              </div>
            )}

            <form onSubmit={handleCompletePasswordReset} className="space-y-4 text-xs font-bold">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-800">New Password</label>
                  <span className="text-[10px] text-slate-400 font-normal">8-128 chars (A-Z, a-z, 0-9, symbol)</span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter your new secure password"
                  minLength={8}
                  maxLength={128}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-normal focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Retype password"
                  maxLength={128}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-normal focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Assigned Role: <strong>{pendingUser.role}</strong> ({pendingUser.branchCode})</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetModalOpen(false);
                    setPendingUser(null);
                    setNewPassword('');
                    setConfirmPassword('');
                    setResetError('');
                  }}
                  className="w-full sm:w-1/3 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all text-center cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-2/3 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all text-center cursor-pointer min-h-[44px]"
                >
                  Save Password &amp; Open Workspace &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
