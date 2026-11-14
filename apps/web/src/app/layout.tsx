import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../components/language-context';

export const metadata: Metadata = {
  title: 'GGY Finance | Micro Money Lending Platform',
  description: 'Karnataka State Registered Micro Money Lending Platform providing transparent credit and doorstep financial services for micro-enterprises, dairy, and rural livelihoods.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#F8FAF8] text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
