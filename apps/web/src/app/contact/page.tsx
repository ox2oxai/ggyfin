'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import {
  MessageCircle,
  PhoneCall,
  Mail,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  User,
  Send,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import {
  getBranchesSync,
  getInstitutionConfigSync,
  BranchRecord,
  InstitutionConfig
} from '../../lib/institution';

export default function ContactPage() {
  const { lang } = useLanguage();
  const [branches, setBranches] = useState<BranchRecord[]>(getBranchesSync());
  const [config, setConfig] = useState<InstitutionConfig>(getInstitutionConfigSync());

  // Contact Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [queryType, setQueryType] = useState('LOAN_INQUIRY');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setBranches(getBranchesSync());
      setConfig(getInstitutionConfigSync());
    };
    handleSync();
    window.addEventListener('nbfc_branches_updated', handleSync);
    window.addEventListener('nbfc_config_updated', handleSync);
    return () => {
      window.removeEventListener('nbfc_branches_updated', handleSync);
      window.removeEventListener('nbfc_config_updated', handleSync);
    };
  }, []);

  const t = {
    en: {
      badge: 'Institutional Support',
      title: 'Contact Us',
      subtitle: 'Reach our team via WhatsApp, helpline, official email, or visit our primary branch office.',
      chatWhatsappTitle: 'Instant WhatsApp',
      chatWhatsappDesc: 'Connect directly with a field officer for loan applications or investment advisory.',
      chatWhatsappBtn: 'Chat on WhatsApp',
      tollFreeTitle: 'Helpline',
      tollFreeDesc: 'Available Monday to Saturday, 9:00 AM to 6:00 PM for all loan and deposit queries.',
      emailTitle: 'Email',
      emailDesc: config.supportEmail || 'support@ggyfinance.in',
      nodalTitle: 'Nodal Officer',
      nodalDesc: `${config.nodalOfficerName || 'Smt. Anita Deshmukh'} (${config.nodalOfficerContact || 'Grievance Redressal Desk'})`,
      branchHeading: 'Branch Network',
      branchSubheading: 'Locate our physical service outlets for doorstep documentation and financial services.',
      formHeading: 'Send a Message',
      formSubheading: 'Our relationship team will respond within 4 business hours.',
      fieldName: 'Full Name',
      fieldPhone: 'Mobile Phone Number',
      fieldType: 'Inquiry Category',
      fieldMsg: 'Your Message or Question',
      btnSend: 'Submit Message',
      successMsg: 'Thank you! Your ticket reference is TKT-2026-8812. Our relationship team will call you shortly.',
      resetContactBtn: 'Send Another Inquiry'
    },
    kn: {
      badge: 'ಗ್ರಾಹಕ ಬೆಂಬಲ',
      title: 'ಸಂಪರ್ಕಿಸಿ',
      subtitle: 'ವಾಟ್ಸಾಪ್, ಸಹಾಯವಾಣಿ, ಇಮೇಲ್ ಅಥವಾ ನಮ್ಮ ಪ್ರಧಾನ ಕಚೇರಿ/ಶಾಖೆಯ ಮೂಲಕ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      chatWhatsappTitle: 'ತ್ವರಿತ ವಾಟ್ಸಾಪ್',
      chatWhatsappDesc: 'ಸಾಲ ಅಥವಾ ಹೂಡಿಕೆ ಕುರಿತು ಸ್ಥಳೀಯ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಯೊಂದಿಗೆ ನೇರವಾಗಿ ಮಾತನಾಡಿ.',
      chatWhatsappBtn: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ',
      tollFreeTitle: 'ಸಹಾಯವಾಣಿ',
      tollFreeDesc: 'ಸೋಮವಾರದಿಂದ ಶನಿವಾರ ಬೆಳಿಗ್ಗೆ 9:00 ರಿಂದ ಸಂಜೆ 6:00 ರವರೆಗೆ ಲಭ್ಯವಿದೆ.',
      emailTitle: 'ಅಧಿಕೃತ ಇಮೇಲ್',
      emailDesc: config.supportEmail || 'support@ggyfinance.in',
      nodalTitle: 'ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿ',
      nodalDesc: `${config.nodalOfficerName || 'ಶ್ರೀಮತಿ ಅನಿತಾ ದೇಶಮುಖ್'} (${config.nodalOfficerContact || 'ಕುಂದುಕೊರತೆ ನಿವಾರಣಾ ಕೋಶ'})`,
      branchHeading: 'ಶಾಖಾ ಜಾಲ',
      branchSubheading: 'ಮನೆಬಾಗಿಲ ದಾಖಲಾತಿ ಮತ್ತು ಹಣಕಾಸು ಸೇವೆಗಾಗಿ ನಮ್ಮ ಅಧಿಕೃತ ಶಾಖೆ.',
      formHeading: 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
      formSubheading: 'ನಮ್ಮ ಸ್ಥಳೀಯ ಅಧಿಕಾರಿಗಳು ೪ ಗಂಟೆಗಳಲ್ಲಿ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.',
      fieldName: 'ಪೂರ್ಣ ಹೆಸರು',
      fieldPhone: 'ಮೊಬೈಲ್ ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
      fieldType: 'ವಿಷಯದ ವಿಭಾಗ',
      fieldMsg: 'ನಿಮ್ಮ ಸಂದೇಶ ಅಥವಾ ಪ್ರಶ್ನೆ',
      btnSend: 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
      successMsg: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಟಿಕೆಟ್ ರೆಫರೆನ್ಸ್ TKT-2026-8812. ನಮ್ಮ ಅಧಿಕಾರಿಗಳು ಶೀಘ್ರದಲ್ಲೇ ಕರೆ ಮಾಡಲಿದ್ದಾರೆ.',
      resetContactBtn: 'ಮತ್ತೊಂದು ಸಂದೇಶ ಕಳುಹಿಸಿ'
    }
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white pt-14 pb-16 px-4 sm:px-10 text-center border-b border-orange-800 shadow-inner overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>{t.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight sm:leading-tight drop-shadow-sm">
            {t.title}
          </h1>

          <p className="text-amber-50 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* 4 PRIMARY CONTACT CARDS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Card 1: WhatsApp */}
          <div className="bg-white p-5 rounded-3xl border-2 border-emerald-500 shadow-lg flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-950 mt-2">{t.chatWhatsappTitle}</h3>
              <p className="text-slate-600 leading-relaxed mt-1 text-[11px]">{t.chatWhatsappDesc}</p>
            </div>
            <a
              href="https://wa.me/919845123450"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all shadow-md min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.chatWhatsappBtn}</span>
            </a>
          </div>

          {/* Card 2: Helpline */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold border border-orange-200">
                <PhoneCall className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-950 mt-2">{t.tollFreeTitle}</h3>
              <p className="text-slate-600 leading-relaxed mt-1 text-[11px]">{t.tollFreeDesc}</p>
            </div>
            <a
              href={`tel:${config.supportPhone || '18008892020'}`}
              className="py-3 px-4 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-xl font-mono text-xs font-bold text-center flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <PhoneCall className="w-4 h-4 text-orange-600" />
              <span>{config.supportPhone || '1800-889-2020'}</span>
            </a>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-950 mt-2">{t.emailTitle}</h3>
              <p className="text-slate-600 leading-relaxed mt-1 text-[11px]">{t.emailDesc}</p>
            </div>
            <a
              href={`mailto:${config.supportEmail || 'support@ggyfinance.in'}`}
              className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-xl font-mono text-[11px] font-bold text-center flex items-center justify-center transition-all min-h-[44px]"
            >
              {config.supportEmail || 'support@ggyfinance.in'}
            </a>
          </div>

          {/* Card 4: Nodal Redressal */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold border border-orange-200">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-950 mt-2">{t.nodalTitle}</h3>
              <p className="text-slate-600 leading-relaxed mt-1 text-[11px]">{t.nodalDesc}</p>
            </div>
            <a
              href="mailto:grievance@ggyfinance.in"
              className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-all min-h-[44px]"
            >
              <span>Grievance Desk</span>
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT: BRANCH LOCATOR + CALLBACK FORM */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-14 space-y-14">
        {/* BRANCH NETWORK SECTION */}
        <section className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <Building2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Physical Branch Service Outlets</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 mt-1">
              {t.branchHeading}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.branchSubheading}
            </p>
          </div>

          {/* Branch Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {branches.map((branch) => (
              <div
                key={branch.branchCode}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 text-xs"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 mb-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">SOL: {branch.solId}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">{branch.type}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 mt-1">
                    {branch.name}
                  </h3>

                  <p className="text-slate-600 mt-2 leading-relaxed flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-slate-700">
                    <p className="font-bold text-slate-900">{branch.manager}</p>
                    <p className="font-mono text-slate-600">Tel: {branch.phone}</p>
                    {branch.operatingHours && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{branch.operatingHours}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[11px] font-bold border-t border-slate-100">
                  <a
                    href={`tel:${branch.phone}`}
                    className="text-orange-600 hover:underline flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Branch</span>
                  </a>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Location</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CALLBACK FORM */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                {t.formHeading}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t.formSubheading}
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-950 leading-relaxed">
                  {t.successMsg}
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  {t.resetContactBtn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-800 mb-1">{t.fieldName}</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-normal focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 mb-1">{t.fieldPhone}</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-normal focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 mb-1">{t.fieldType}</label>
                  <select
                    value={queryType}
                    onChange={(e) => setQueryType(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-normal focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="LOAN_INQUIRY">Micro-Credit / Loan Application</option>
                    <option value="INVESTMENT_INQUIRY">Rural Mutual Funds &amp; Daily Piggy</option>
                    <option value="REPAYMENT_SUPPORT">UPI / Cash Repayment Clarification</option>
                    <option value="BRANCH_LOCATION">Visit Branch / Doorstep Verification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 mb-1">{t.fieldMsg}</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our financial officers assist you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-normal focus:ring-2 focus:ring-orange-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.btnSend}</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
