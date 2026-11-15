'use client';

import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { GGYBrandMark } from '../../components/brand-mark';

interface StoredStaffUser {
  id: string;
  staffNumber: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  branchCode: string;
  isActive: boolean;
  mustResetPassword?: boolean;
}

const DEFAULT_SUPER_ADMIN: StoredStaffUser = {
  id: 'u-superadmin-it-001',
  staffNumber: 'EMP-1084-001',
  username: 'it_superadmin',
  fullName: 'System Administrator',
  email: 'it.admin@ggyfinance.in',
  phone: '9800000000',
  password: 'GGY#SuperAdminIT@2026!',
  role: UserRole.SUPER_ADMIN_IT,
  branchCode: 'KA-HQ-IT',
  isActive: true,
  mustResetPassword: false
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // First-Time Password Reset Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<StoredStaffUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const getStaffDirectory = (): StoredStaffUser[] => {
    try {
      const raw = localStorage.getItem('nbfc_staff_directory');
      if (raw) {
        let parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migration: remove legacy mock names and assign staff numbers
          let needsUpdate = false;
          parsed = parsed.map((u: any, idx: number) => {
            let updatedUser = { ...u };
            if (!updatedUser.staffNumber) {
              updatedUser.staffNumber = `EMP-1084-${String(idx + 1).padStart(3, '0')}`;
              needsUpdate = true;
            }
            if (updatedUser.fullName && updatedUser.fullName.includes('Chethan Gowda')) {
              updatedUser.fullName = 'System Administrator';
              needsUpdate = true;
            }
            return updatedUser;
          });

          // Ensure it_superadmin is always present
          if (!parsed.some((u: StoredStaffUser) => u.username === 'it_superadmin')) {
            parsed.unshift(DEFAULT_SUPER_ADMIN);
            needsUpdate = true;
          }

          if (needsUpdate) {
            localStorage.setItem('nbfc_staff_directory', JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    // Default initial directory with ONLY the Super Admin IT
    const initial = [DEFAULT_SUPER_ADMIN];
    localStorage.setItem('nbfc_staff_directory', JSON.stringify(initial));
    return initial;
  };

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const directory = getStaffDirectory();
      const user = directory.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (!user) {
        setErrorMessage('Invalid credentials. Staff username not found in directory.');
        setIsLoading(false);
        return;
      }

      if (!user.isActive) {
        setErrorMessage('Your account access has been suspended by the Super IT Admin. Please contact IT support.');
        setIsLoading(false);
        return;
      }

      if (user.password !== password) {
        setErrorMessage('Invalid password. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      // Check if user is logging in with a temporary password from Super IT Admin
      if (user.mustResetPassword) {
        setPendingUser(user);
        setIsResetModalOpen(true);
        setIsLoading(false);
        return;
      }

      // Successful Authentication: Establish staff session
      localStorage.setItem(
        'nbfc_staff_session',
        JSON.stringify({
          userId: user.id,
          staffNumber: user.staffNumber || 'EMP-1084-001',
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

  const handleCompletePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match. Please retype carefully.');
      return;
    }

    if (pendingUser && newPassword === pendingUser.password) {
      setResetError('Your new confidential password must be different from your temporary password.');
      return;
    }

    if (!pendingUser) return;

    try {
      // Update password in staff directory
      const directory = getStaffDirectory();
      const updated = directory.map((u) =>
        u.id === pendingUser.id
          ? { ...u, password: newPassword, mustResetPassword: false }
          : u
      );
      localStorage.setItem('nbfc_staff_directory', JSON.stringify(updated));

      // Establish session
      localStorage.setItem(
        'nbfc_staff_session',
        JSON.stringify({
          userId: pendingUser.id,
          staffNumber: pendingUser.staffNumber || 'EMP-1084-001',
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
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand & Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </Link>

        <div className="flex justify-center">
          <GGYBrandMark size="xl" />
        </div>

        <h2 className="mt-4 text-center text-2xl font-black text-slate-950 tracking-tight">
          GGY Finance Staff Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 font-medium">
          Micro-Lending Platform • Karnataka Dual-Control Core Banking
        </p>
      </div>

      {/* Clean Modern Login Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200/80 sm:px-10 space-y-6">
          <div className="text-center space-y-1 pb-1">
            <h3 className="text-sm font-black text-slate-900">Sign In to Your Workspace</h3>
            <p className="text-xs text-slate-500">
              Enter your assigned institutional username and password
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
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Staff Username
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. it_superadmin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-all font-mono"
                />
              </div>
            </div>

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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-[11px] text-emerald-900 flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Role-based access privileges are assigned directly by the Super Admin IT.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-xs font-black text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold">
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
                <label className="block text-slate-800 mb-1">New Password (Min 8 characters)</label>
                <input
                  type="password"
                  required
                  placeholder="Enter your new secure password"
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
                  className="w-full sm:w-1/3 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-2/3 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all text-center cursor-pointer"
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
