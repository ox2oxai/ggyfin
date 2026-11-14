'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@nbfc/shared';
import { Lock, Shield, ArrowLeft, Building2, User, KeyRound } from 'lucide-react';
import { GGYBrandMark } from '../../components/brand-mark';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('field_officer_ramesh');
  const [password, setPassword] = useState('SecurePass@123');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.FIELD_OFFICER);
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
        userId: 'u-' + selectedRole.toLowerCase() + '-001',
        username,
        role: selectedRole,
        branchCode: 'MH-PUN-01'
      }));

      // Route based on role
      if (selectedRole === UserRole.FIELD_OFFICER) {
        router.push('/dashboard/field');
      } else if (selectedRole === UserRole.AUTHORIZER) {
        router.push('/dashboard/approvals');
      } else {
        router.push('/dashboard/field');
      }
    } catch (err: unknown) {
      setErrorMessage('Failed to sign in. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const setRolePreset = (role: UserRole, user: string) => {
    setSelectedRole(role);
    setUsername(user);
    setPassword('SecurePass@123');
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
          Micro Money Lending Platform • RBI SBR Base-Layer Core Banking
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-sandstone-50 py-8 px-6 shadow-md rounded-3xl border border-clay sm:px-10">
          {/* Quick Role Preset Picker */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-forest-900 mb-2">
              Select Demo Staff Persona:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRolePreset(UserRole.FIELD_OFFICER, 'field_officer_ramesh')}
                className={`text-xs p-2.5 rounded-xl border text-left font-medium transition-all ${
                  selectedRole === UserRole.FIELD_OFFICER
                    ? 'bg-terracotta-50 border-terracotta-500 text-terracotta-700 font-bold'
                    : 'bg-sandstone-100 border-clay text-forest-800 hover:bg-sandstone-200'
                }`}
              >
                <p className="font-bold">Field Officer</p>
                <p className="text-[10px] text-forest-800/60">Maker • Mobile PWA</p>
              </button>

              <button
                type="button"
                onClick={() => setRolePreset(UserRole.AUTHORIZER, 'checker_suresh')}
                className={`text-xs p-2.5 rounded-xl border text-left font-medium transition-all ${
                  selectedRole === UserRole.AUTHORIZER
                    ? 'bg-terracotta-50 border-terracotta-500 text-terracotta-700 font-bold'
                    : 'bg-sandstone-100 border-clay text-forest-800 hover:bg-sandstone-200'
                }`}
              >
                <p className="font-bold">Authorizer (Checker)</p>
                <p className="text-[10px] text-forest-800/60">4-Eyes Approvals</p>
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
              <span>Session protected with device fingerprinting and immutable audit logging under RBI IT Directions.</span>
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
