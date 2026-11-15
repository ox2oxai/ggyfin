import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '../components/language-context';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'GGY Finance | National Micro Money Lending Platform',
  description: 'National Micro Money Lending Platform providing transparent credit, dual-control core banking, and doorstep financial services for micro-enterprises, dairy farmers, and rural livelihoods.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <head>
        {/* Pre-hydration Self-Healing ChunkLoadError Interceptor */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var reloadKey = 'ggy_chunk_reload_ts';
                function triggerReload() {
                  var lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
                  if (Date.now() - lastReload > 5000) {
                    sessionStorage.setItem(reloadKey, String(Date.now()));
                    window.location.reload();
                  }
                }
                window.addEventListener('error', function(e) {
                  var msg = (e && (e.message || (e.reason && e.reason.message))) || '';
                  if (/ChunkLoadError|Loading chunk|timeout:.*chunk/i.test(msg)) {
                    triggerReload();
                  }
                  if (e.target && e.target.tagName === 'SCRIPT' && e.target.src && e.target.src.indexOf('/_next/static/chunks/') !== -1) {
                    triggerReload();
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  var msg = (e && (e.reason && (e.reason.message || e.reason.stack))) || '';
                  if (/ChunkLoadError|Loading chunk|timeout:.*chunk/i.test(msg)) {
                    triggerReload();
                  }
                });
              })();
            `
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
