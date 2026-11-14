'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@nbfc/shared';
import { Lock, Shield, ArrowLeft, Building2, User, KeyRound } from 'lucide-react';
import { GGYBrandMark } from '../../components/brand-mark';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('it_superadmin');
  const [password, setPassword] = useState('GGY#SuperAdminIT@2026!');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.SUPER_ADMIN_IT);
  const [branchCode, setBranchCode] = useState('KA-HQ-IT');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // In production, calls REST API: POST /api/v1/auth/login
      // Store session token in localStorage for dashboard client usage
      localStorage.setItem('nbfc_staff_session', JSON.stringify({
        userId: selectedRole === UserRole.SUPER_ADMIN_IT ? 'u-superadmin-it-001' : 'u-' + selectedRole.toLowerCase() + '-001',
        username,
        role: selectedRole,
        branchCode: selectedRole === UserRole.SUPER_ADMIN_IT ? 'KA-HQ-IT' : branchCode
      }));

      // Route technical super admin to dedicated isolated IT dashboard; banking staff to Daily Workspace
      if (selectedRole === UserRole.SUPER_ADMIN_IT) {
        router.push('/dashboard/it-admin');
      } else {
        router.push('/dashboard/workspace');
      }
    } catch (err: unknown) {
      setErrorMessage('Failed to sign in. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const setRolePreset = (role: UserRole, user: string, pass: string, branch = 'KA-BLR-01') => {
    setSelectedRole(role);
    setUsername(user);
    setPassword(pass);
    setBranchCode(branch);
  };

  return (
    <div className="min-h-screen bg-sandstone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-forest-800 hover:text-terracotta-600 mb-6 transition-all">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </Link>

        <div className="flex justify-center">
          <GGYBrandMark size="xl" />
        </div>

        <h2 className="mt-4 text-center text-2xl font-extrabold text-forest-900">
          GGY Finance Staff Portal
        </h2>
        <p className="mt-1 text-center text-xs text-forest-800/70">
          Micro-Lending Platform • Karnataka Dual-Control Core Banking
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-sandstone-50 py-8 px-6 shadow-md rounded-3xl border border-clay sm:px-10">
          {/* Quick Role Preset Picker */}
          <div className="mb-6 space-y-2">
            <label className="block text-xs font-bold text-forest-900">
              Select Staff Persona to Test:
            </label>

            {/* Featured: Super Admin IT (Technical Lead) */}
            <button
              type="button"
              onClick={() => setRolePreset(UserRole.SUPER_ADMIN_IT, 'it_superadmin', 'GGY#SuperAdminIT@2026!', 'KA-HQ-IT')}
              className={`w-full text-xs p-3 rounded-2xl border text-left transition-all ${
                selectedRole === UserRole.SUPER_ADMIN_IT
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-md border-orange-600'
                  : 'bg-orange-50/70 border-orange-200 text-slate-800 hover:bg-orange-100/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-black flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${selectedRole === UserRole.SUPER_ADMIN_IT ? 'bg-emerald-300 animate-pulse' : 'bg-orange-600'}`}></span>
                  Super Admin IT (Technical Admin)
                </p>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedRole === UserRole.SUPER_ADMIN_IT ? 'bg-white text-orange-700' : 'bg-orange-600 text-white'}`}>
                  Primary System Admin
                </span>
              </div>
              <p className={`text-[10px] mt-1 ${selectedRole === UserRole.SUPER_ADMIN_IT ? 'text-orange-100 font-medium' : 'text-slate-600'}`}>
                Staff Provisioning • Gateway Settings (Email/WhatsApp/SMS) • Isolated
              </p>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRolePreset(UserRole.SYSTEM_ADMIN, 'admin', 'GGYSecurePassword@2026', 'KA-HQ-01')}
                className={`text-xs p-2.5 rounded-xl border text-left font-medium transition-all ${
                  selectedRole === UserRole.SYSTEM_ADMIN
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                    : 'bg-sandstone-100 border-clay text-forest-800 hover:bg-sandstone-200'
                }`}
              >
                <p className="font-bold">System Admin (Banking)</p>
                <p className="text-[10px] text-forest-800/60">Portfolio & Risk Oversight</p>
              </button>

              <button
                type="button"
                onClick={() => setRolePreset(UserRole.BRANCH_MANAGER, 'manager_blr', 'GGYSecurePassword@2026', 'KA-BLR-01')}
                className={`text-xs p-2.5 rounded-xl border text-left font-medium transition-all ${
                  selectedRole === UserRole.BRANCH_MANAGER
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                    : 'bg-sandstone-100 border-clay text-forest-800 hover:bg-sandstone-200'
                }`}
              >
                <p className="font-bold">Branch Manager</p>
                <p className="text-[10px] text-forest-800/60">Dual Controls • Cash</p>
              </button>

              <button
                type="button"
                onClick={() => setRolePreset(UserRole.AUTHORIZER, 'authorizer_blr', 'GGYSecurePassword@2026', 'KA-BLR-01')}
                className={`text-xs p-2.5 rounded-xl border text-left font-medium transition-all ${
                  selectedRole === UserRole.AUTHORIZER
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                    : 'bg-sandstone-100 border-clay text-forest-800 hover:bg-sandstone-200'
                }`}
              >
                <p className="font-bold">Authorizer (Checker)</p>
                <p className="text-[10px] text-forest-800/60">4-Eyes Approvals</p>
              </button>

              <button
                type="button"
                onClick={() => setRolePreset(UserRole.FIELD_OFFICER, 'officer_ramesh', 'GGYSecurePassword@2026', 'KA-BLR-01')}
                className={`text-xs p-2.5 rounded-xl border text-left font-medium transition-all ${
                  selectedRole === UserRole.FIELD_OFFICER
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                    : 'bg-sandstone-100 border-clay text-forest-800 hover:bg-sandstone-200'
                }`}
              >
                <p className="font-bold">Field Officer (Maker)</p>
                <p className="text-[10px] text-forest-800/60">Doorstep Onboarding & UPI</p>
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-forest-900">
                Staff Username
              </label>
              <div className="mt-1 relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-forest-800/50">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 text-xs bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:outline-hidden focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900">
                Password
              </label>
              <div className="mt-1 relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-forest-800/50">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 text-xs bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:outline-hidden focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="p-3 bg-sandstone-100 rounded-xl border border-clay/60 text-[11px] text-forest-800/80 flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Session protected with device fingerprinting and immutable audit logging under statutory IT security guidelines.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-forest-800 hover:bg-forest-900 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 transition-all disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-terracotta-400" />
              <span>{isLoading ? 'Verifying...' : `Sign In as ${selectedRole}`}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
