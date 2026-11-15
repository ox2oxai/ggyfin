'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { GGYBrandMark } from '../components/brand-mark';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If it's a chunk load or timeout error, attempt automatic reload once
    if (/ChunkLoadError|Loading chunk|timeout/i.test(error?.message || '')) {
      const lastReload = parseInt(sessionStorage.getItem('ggy_chunk_reload_ts') || '0', 10);
      if (Date.now() - lastReload > 8000) {
        sessionStorage.setItem('ggy_chunk_reload_ts', String(Date.now()));
        window.location.reload();
      }
    }
  }, [error]);

  const handleManualReload = () => {
    sessionStorage.removeItem('ggy_chunk_reload_ts');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center p-4 sm:p-6 font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95">
        <div className="flex justify-center">
          <GGYBrandMark size="lg" />
        </div>

        <div className="space-y-2">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <RefreshCw className="w-6 h-6 animate-spin text-orange-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Connection Re-synchronization
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The banking platform detected an updated application version or temporary network timeout. Click below to reconnect to the live Core Banking service.
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Status Code:</span>
          <p className="text-xs font-mono text-slate-700 truncate">
            {error?.message || 'Client Chunk Timeout Recovery Active'}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleManualReload}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload &amp; Reconnect to Core Banking</span>
          </button>

          <Link
            href="/"
            onClick={handleManualReload}
            className="w-full py-2.5 px-4 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Public Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
