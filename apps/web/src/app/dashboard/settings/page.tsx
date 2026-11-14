'use client';

import React, { useState } from 'react';
import {
  generateCustomerId,
  generateCBSAccountNumber,
  verifyCBSAccountNumber,
  CBS_DEFAULT_BRANCHES,
  CBS_DEFAULT_SCHEMES
} from '@nbfc/shared';
import {
  Settings,
  Building2,
  CreditCard,
  UserCheck,
  CheckCircle2,
  Database,
  ArrowRight,
  ShieldCheck,
  Layers,
  Copy,
  Check,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function CBSSettingsPage() {
  const [bankCode, setBankCode] = useState('1084');
  const [selectedBranch, setSelectedBranch] = useState('0101');
  const [selectedScheme, setSelectedScheme] = useState('702');
  const [sequenceNumber, setSequenceNumber] = useState(42);
  const [isCopied, setIsCopied] = useState(false);

  // Computed live values
  const generatedCIF = generateCustomerId(bankCode, sequenceNumber);
  const generatedFormattedAcc = generateCBSAccountNumber(bankCode, selectedBranch, selectedScheme, sequenceNumber, true);
  const generatedNumericAcc = generateCBSAccountNumber(bankCode, selectedBranch, selectedScheme, sequenceNumber, false);
  const isValidChecksum = verifyCBSAccountNumber(generatedFormattedAcc);

  const selectedBranchObj = CBS_DEFAULT_BRANCHES.find((b) => b.solId === selectedBranch);
  const selectedSchemeObj = CBS_DEFAULT_SCHEMES.find((s) => s.schemeCode === selectedScheme);

  const handleCopyAcc = () => {
    navigator.clipboard.writeText(generatedFormattedAcc);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-sandstone-50 p-6 sm:p-8 rounded-3xl border border-clay shadow-xs space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-100">
          <Settings className="w-3.5 h-3.5" />
          <span>Executive Administration • System & Bank Extensibility</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-forest-900 tracking-tight">
          Core Banking (CBS) Account Numbering & CIF Configuration Studio
        </h2>
        <p className="text-xs text-forest-800/80 max-w-3xl leading-relaxed">
          Decouples the <strong>Customer ID (CIF)</strong> from individual <strong>Loan Account Numbers</strong>. 
          Architected for complete 1:1 forward-compatibility with modern Core Banking Systems and scheduled microfinance networks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-sandstone-50 p-6 rounded-3xl border border-clay shadow-xs space-y-5">
            <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2 border-b border-clay pb-3">
              <Sliders className="w-4 h-4 text-terracotta-600" />
              <span>1. Account Number Scheme Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-forest-900 mb-1">
                  Bank / Institution Code (4 Digits)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl font-mono text-forest-900 font-bold focus:ring-2 focus:ring-terracotta-500 outline-hidden"
                />
                <p className="text-[10px] text-forest-800/60 mt-1">Default 1084 assigned to GGY Finance Platform.</p>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">
                  Running Sequence Number (Serial)
                </label>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={sequenceNumber}
                  onChange={(e) => setSequenceNumber(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl font-mono text-forest-900 font-bold focus:ring-2 focus:ring-terracotta-500 outline-hidden"
                />
                <p className="text-[10px] text-forest-800/60 mt-1">Unique sequential account index across branch.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-forest-900 mb-1">
                  Branch Service Outlet (SOL ID)
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-semibold focus:ring-2 focus:ring-terracotta-500 outline-hidden"
                >
                  {CBS_DEFAULT_BRANCHES.map((b) => (
                    <option key={b.solId} value={b.solId}>
                      {b.solId} - {b.name} ({b.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">
                  CBS Product Scheme Code
                </label>
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                  className="w-full px-3 py-2 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-semibold focus:ring-2 focus:ring-terracotta-500 outline-hidden"
                >
                  {CBS_DEFAULT_SCHEMES.map((s) => (
                    <option key={s.schemeCode} value={s.schemeCode}>
                      {s.schemeCode} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Generated Display */}
            <div className="bg-forest-900 text-sandstone-100 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs text-sandstone-300">
                <span className="uppercase tracking-wider font-bold text-[10px]">Real-Time Core Banking Specimen</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Mod-11 Verified</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-forest-950 p-4 rounded-xl border border-forest-800">
                <div>
                  <p className="text-[10px] text-sandstone-400 font-bold uppercase">16-Digit Standard Loan Account Number</p>
                  <p className="text-xl sm:text-2xl font-mono font-black text-amber-400 tracking-wider mt-0.5">
                    {generatedFormattedAcc}
                  </p>
                  <p className="text-[10px] text-sandstone-400 font-mono mt-0.5">Raw Numeric: {generatedNumericAcc}</p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAcc}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-forest-800 hover:bg-forest-700 text-sandstone-100 rounded-lg text-xs font-bold transition-all shrink-0"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-sandstone-300 pt-1 font-mono">
                <div className="bg-forest-800/50 p-2 rounded-lg">
                  <p className="text-sandstone-400">Bank Code:</p>
                  <p className="font-bold text-white">{bankCode}</p>
                </div>
                <div className="bg-forest-800/50 p-2 rounded-lg">
                  <p className="text-sandstone-400">Branch SOL:</p>
                  <p className="font-bold text-white">{selectedBranch}</p>
                </div>
                <div className="bg-forest-800/50 p-2 rounded-lg">
                  <p className="text-sandstone-400">Product Code:</p>
                  <p className="font-bold text-white">{selectedScheme}</p>
                </div>
                <div className="bg-forest-800/50 p-2 rounded-lg">
                  <p className="text-sandstone-400">Mod-11 Check:</p>
                  <p className="font-bold text-emerald-400">{generatedFormattedAcc.slice(-1)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer ID (CIF) Card */}
          <div className="bg-sandstone-50 p-6 rounded-3xl border border-clay shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2 border-b border-clay pb-3">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Decoupled Customer Information File (CIF / Customer ID)</span>
            </h3>

            <p className="text-xs text-forest-800/80 leading-relaxed">
              Every customer is assigned a permanent <strong>10-digit Customer ID</strong> that represents their individual legal identity. 
              The customer uses this Customer ID to log into the <strong>Borrower Self-Service Portal</strong> to view all their current and historical loan facilities.
            </p>

            <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-forest-800/60">Generated Borrower Customer ID (CIF)</p>
                <p className="text-xl font-mono font-black text-forest-900 tracking-wider">{generatedCIF}</p>
                <p className="text-[11px] text-forest-800/70 mt-0.5">Used for Borrower Portal login credentials & multi-loan aggregation.</p>
              </div>

              <div className="bg-sandstone-200 px-3 py-1.5 rounded-xl border border-clay text-[11px] font-bold text-forest-900">
                1 Customer &harr; N Loan Facilities
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: CBS Migration Matrix */}
        <div className="space-y-6">
          <div className="bg-sandstone-50 p-6 rounded-3xl border border-clay shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2 border-b border-clay pb-3">
              <Database className="w-4 h-4 text-terracotta-600" />
              <span>Core Banking Migration Schema</span>
            </h3>

            <p className="text-xs text-forest-800/70">
              When GGY Finance converts to a bank, existing customer and account tables map 1:1 without manual re-numbering:
            </p>

            <div className="divide-y divide-clay/40 text-xs">
              <div className="py-2.5">
                <p className="font-mono font-bold text-forest-900">FORACID</p>
                <p className="text-[11px] text-forest-800/70">16-Digit Full Account Number</p>
                <p className="text-[10px] font-mono text-emerald-700">{generatedFormattedAcc}</p>
              </div>

              <div className="py-2.5">
                <p className="font-mono font-bold text-forest-900">CUST_ID (CIF)</p>
                <p className="text-[11px] text-forest-800/70">Permanent Borrower Identification</p>
                <p className="text-[10px] font-mono text-emerald-700">{generatedCIF}</p>
              </div>

              <div className="py-2.5">
                <p className="font-mono font-bold text-forest-900">SOL_ID</p>
                <p className="text-[11px] text-forest-800/70">Branch Service Outlet</p>
                <p className="text-[10px] font-mono text-emerald-700">{selectedBranch} ({selectedBranchObj?.name})</p>
              </div>

              <div className="py-2.5">
                <p className="font-mono font-bold text-forest-900">SCHM_CODE</p>
                <p className="text-[11px] text-forest-800/70">Product Scheme</p>
                <p className="text-[10px] font-mono text-emerald-700">{selectedScheme} ({selectedSchemeObj?.name})</p>
              </div>

              <div className="py-2.5">
                <p className="font-mono font-bold text-forest-900">CHECK_DIGIT</p>
                <p className="text-[11px] text-forest-800/70">ISO 7064 Mod-11 Anti-Typo</p>
                <p className="text-[10px] font-mono text-emerald-700">{generatedFormattedAcc.slice(-1)} (Valid: Yes)</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Zero-migration overhead: NACH e-Mandates, NPCI UPI IDs, and clearing codes remain identical across system updates.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
