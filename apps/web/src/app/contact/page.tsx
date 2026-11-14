'use client';

import React, { useState } from 'react';
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

interface BranchLocation {
  solId: string;
  nameEn: string;
  nameKn: string;
  district: string;
  addressEn: string;
  addressKn: string;
  manager: string;
  phone: string;
  email: string;
}

const KARNATAKA_BRANCHES: BranchLocation[] = [
  {
    solId: '0101',
    nameEn: 'Bengaluru Central Operations Hub',
    nameKn: 'ಬೆಂಗಳೂರು ಕೇಂದ್ರ ಕಾರ್ಯಾಚರಣೆ ಶಾಖೆ',
    district: 'Bengaluru',
    addressEn: '#104, 2nd Floor, Outer Ring Road, Bellandur, Bengaluru - 560103',
    addressKn: '#104, 2ನೇ ಮಹಡಿ, ಔಟರ್ ರಿಂಗ್ ರಸ್ತೆ, ಬೆಳ್ಳಂದೂರು, ಬೆಂಗಳೂರು - 560103',
    manager: 'Sri Suresh Hegde (Branch Head)',
    phone: '080-28491001',
    email: 'blr01@ggyfinance.in'
  },
  {
    solId: '0102',
    nameEn: 'Ramanagara & Channapatna Silk Branch',
    nameKn: 'ರಾಮನಗರ & ಚನ್ನಪಟ್ಟಣ ರೇಷ್ಮೆ ಶಾಖೆ',
    district: 'Ramanagara',
    addressEn: 'Near Old Bus Stand, Silk Market Road, Channapatna - 562160',
    addressKn: 'ಹಳೇ ಬಸ್ ನಿಲ್ದಾಣದ ಹತ್ತಿರ, ಸಿಲ್ಕ್ ಮಾರ್ಕೆಟ್ ರಸ್ತೆ, ಚನ್ನಪಟ್ಟಣ - 562160',
    manager: 'Smt. Anita Deshmukh (Branch Manager)',
    phone: '08113-254102',
    email: 'ram01@ggyfinance.in'
  },
  {
    solId: '0103',
    nameEn: 'Mandya & Maddur Sugar Belt Branch',
    nameKn: 'ಮಂಡ್ಯ & ಮದ್ದೂರು ಕೃಷಿ ಶಾಖೆ',
    district: 'Mandya',
    addressEn: 'V.V. Road, Opposite APMC Yard, Mandya - 571401',
    addressKn: 'ವಿ.ವಿ. ರಸ್ತೆ, ಎ.ಪಿ.ಎಂ.ಸಿ ಯಾರ್ಡ್ ಎದುರು, ಮಂಡ್ಯ - 571401',
    manager: 'Sri Raghavendra Sharma (Branch Manager)',
    phone: '08232-224103',
    email: 'man01@ggyfinance.in'
  },
  {
    solId: '0104',
    nameEn: 'Tumakuru & Kunigal Rural Branch',
    nameKn: 'ತುಮಕೂರು & ಕುಣಿಗಲ್ ಗ್ರಾಮೀಣ ಶಾಖೆ',
    district: 'Tumakuru',
    addressEn: 'Main Bazaar Road, Near APMC Market, Kunigal - 572130',
    addressKn: 'ಮುಖ್ಯ ಬಜಾರ್ ರಸ್ತೆ, ಎ.ಪಿ.ಎಂ.ಸಿ ಮಾರ್ಕೆಟ್ ಹತ್ತಿರ, ಕುಣಿಗಲ್ - 572130',
    manager: 'Sri Ramesh Kumar (Field Operations Lead)',
    phone: '08132-264104',
    email: 'tum01@ggyfinance.in'
  },
  {
    solId: '0105',
    nameEn: 'Mysuru & Nanjangud Heritage Branch',
    nameKn: 'ಮೈಸೂರು & ನಂಜನಗೂಡು ಶಾಖೆ',
    district: 'Mysuru',
    addressEn: 'Devaraj Urs Road, Near Suburb Bus Stand, Mysuru - 570001',
    addressKn: 'ದೇವರಾಜ್ ಅರಸ್ ರಸ್ತೆ, ಉಪನಗರ ಬಸ್ ನಿಲ್ದಾಣ ಹತ್ತಿರ, ಮೈಸೂರು - 570001',
    manager: 'Sri M. Venkatesh (Senior Manager)',
    phone: '0821-244105',
    email: 'mys01@ggyfinance.in'
  }
];

export default function ContactPage() {
  const { lang } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Contact Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [queryType, setQueryType] = useState('LOAN_INQUIRY');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = {
    en: {
      badge: 'Regional Support',
      title: 'Contact Us for Help',
      subtitle: 'Reach our dedicated Karnataka team via WhatsApp, toll-free helpline, email, or visit our regional branch offices.',
      chatWhatsappTitle: 'Instant WhatsApp',
      chatWhatsappDesc: 'Connect directly with a field officer for loan applications or investment advisory.',
      chatWhatsappBtn: 'Chat on WhatsApp',
      tollFreeTitle: 'Toll-Free Helpline',
      tollFreeDesc: 'Available Monday to Saturday, 9:00 AM to 6:00 PM for all loan and deposit queries.',
      emailTitle: 'Email',
      emailDesc: 'contact@ggyfinance.in • invest@ggyfinance.in',
      nodalTitle: 'Nodal Officer',
      nodalDesc: 'Smt. Anita Deshmukh (Principal Nodal Officer). Dedicated Karnataka State Grievance Redressal Desk.',
      branchHeading: 'Branch Network',
      branchSubheading: 'Locate our regional Karnataka offices for doorstep documentation and financial services.',
      filterAll: 'All Branches (5)',
      formHeading: 'Send a Message',
      formSubheading: 'Our relationship team will respond within 4 business hours.',
      fieldName: 'Full Name',
      fieldPhone: 'Mobile Phone Number',
      fieldType: 'Inquiry Category',
      fieldMsg: 'Your Message or Question',
      btnSend: 'Submit Message',
      successMsg: 'Thank you! Your ticket reference is TKT-KA-2026-8812. Our relationship team will call you shortly.'
    },
    kn: {
      badge: 'ಗ್ರಾಹಕ ಬೆಂಬಲ',
      title: 'ಸಂಪರ್ಕಿಸಿ',
      subtitle: 'ವಾಟ್ಸಾಪ್, ಸಹಾಯವಾಣಿ, ಇಮೇಲ್ ಅಥವಾ ನಮ್ಮ ಪ್ರಾದೇಶಿಕ ಶಾಖೆಗಳ ಮೂಲಕ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      chatWhatsappTitle: 'ತ್ವರಿತ ವಾಟ್ಸಾಪ್',
      chatWhatsappDesc: 'ಸಾಲ ಅಥವಾ ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ ಕುರಿತು ಸ್ಥಳೀಯ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಯೊಂದಿಗೆ ನೇರವಾಗಿ ಮಾತನಾಡಿ.',
      chatWhatsappBtn: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ',
      tollFreeTitle: 'ಉಚಿತ ಕರೆ (Toll-Free)',
      tollFreeDesc: 'ಸೋಮವಾರದಿಂದ ಶನಿವಾರ ಬೆಳಿಗ್ಗೆ 9:00 ರಿಂದ ಸಂಜೆ 6:00 ರವರೆಗೆ ಲಭ್ಯವಿದೆ.',
      emailTitle: 'ಅಧಿಕೃತ ಇಮೇಲ್',
      emailDesc: 'contact@ggyfinance.in • invest@ggyfinance.in',
      nodalTitle: 'ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿ',
      nodalDesc: 'ಶ್ರೀಮತಿ ಅನಿತಾ ದೇಶಮುಖ್. ಕರ್ನಾಟಕ ರಾಜ್ಯ ಕುಂದುಕೊರತೆ ನಿವಾರಣಾ ಕೋಶ ಹಾಗೂ ನೇರ ಸಹಾಯ.',
      branchHeading: 'ಶಾಖಾ ಜಾಲ',
      branchSubheading: 'ಮನೆಬಾಗಿಲ ದಾಖಲಾತಿ ಮತ್ತು ಹಣಕಾಸು ಸೇವೆಗಾಗಿ ನಿಮ್ಮ ಹತ್ತಿರದ ಶಾಖೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      filterAll: 'ಎಲ್ಲ ಶಾಖೆಗಳು (೫)',
      formHeading: 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
      formSubheading: 'ನಮ್ಮ ಸ್ಥಳೀಯ ಅಧಿಕಾರಿಗಳು ೪ ಗಂಟೆಗಳಲ್ಲಿ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.',
      fieldName: 'ಪೂರ್ಣ ಹೆಸರು',
      fieldPhone: 'ಮೊಬೈಲ್ ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
      fieldType: 'ವಿಷಯದ ವಿಭಾಗ',
      fieldMsg: 'ನಿಮ್ಮ ಸಂದೇಶ ಅಥವಾ ಪ್ರಶ್ನೆ',
      btnSend: 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
      successMsg: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಟಿಕೆಟ್ ರೆಫರೆನ್ಸ್ TKT-KA-2026-8812. ನಮ್ಮ ಅಧಿಕಾರಿಗಳು ಶೀಘ್ರದಲ್ಲೇ ಕರೆ ಮಾಡಲಿದ್ದಾರೆ.'
    }
  }[lang];

  const filteredBranches = selectedDistrict === 'ALL'
    ? KARNATAKA_BRANCHES
    : KARNATAKA_BRANCHES.filter((b) => b.district === selectedDistrict);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      {/* HERO SECTION: OPTION B ROYAL SAFFRON SUNBURST */}
      <section className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white pt-14 pb-16 px-4 sm:px-10 text-center border-b border-orange-800 shadow-inner overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-white shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>{t.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight drop-shadow-md">
            {t.title}
          </h1>

          <p className="text-amber-50 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
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
              <h3 className="text-sm font-black text-slate-950 mt-2">{t.chatWhatsappTitle}</h3>
              <p className="text-slate-600 leading-relaxed mt-1 text-[11px]">{t.chatWhatsappDesc}</p>
            </div>
            <a
              href="https://wa.me/919845123450?text=Namaskara%20GGY%20Finance,%20I%20need%20assistance%20with%20Loans%20or%20Investments."
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 bg-[#064e3b] hover:bg-[#043e2f] text-white rounded-xl font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-xs min-h-[44px]"
            >
              <span>{t.chatWhatsappBtn}</span>
            </a>
          </div>

          {/* Card 2: Toll-Free Phone */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-orange-600 flex items-center justify-center font-bold border border-amber-200">
                <PhoneCall className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-black text-slate-950 mt-2">{t.tollFreeTitle}</h3>
              <p className="text-slate-600 leading-relaxed mt-1 text-[11px]">{t.tollFreeDesc}</p>
            </div>
            <a
              href="tel:18002094321"
              className="py-3 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-mono font-bold text-center flex items-center justify-center transition-all min-h-[44px]"
            >
              1800-209-4321
            </a>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-black text-slate-950 mt-2">{t.emailTitle}</h3>
              <p className="text-slate-600 leading-relaxed mt-1 text-[11px]">{t.emailDesc}</p>
            </div>
            <a
              href="mailto:contact@ggyfinance.in"
              className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-xl font-mono text-[11px] font-bold text-center flex items-center justify-center transition-all min-h-[44px]"
            >
              contact@ggyfinance.in
            </a>
          </div>

          {/* Card 4: Nodal Redressal */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold border border-orange-200">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-black text-slate-950 mt-2">{t.nodalTitle}</h3>
              <p className="text-slate-600 leading-relaxed mt-1 text-[11px]">{t.nodalDesc}</p>
            </div>
            <a
              href="mailto:grievance@ggyfinance.in"
              className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-all min-h-[44px]"
            >
              <span>grievance@ggyfinance.in</span>
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT: KARNATAKA BRANCH LOCATOR + CALLBACK FORM */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-14 space-y-14">
        {/* BRANCH NETWORK SECTION */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                <Building2 className="w-3.5 h-3.5 text-orange-600" />
                <span>Physical Branch Service Outlets</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                {t.branchHeading}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t.branchSubheading}
              </p>
            </div>

            {/* District Filter Pills */}
            <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setSelectedDistrict('ALL')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedDistrict === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.filterAll}
              </button>
              {['Bengaluru', 'Ramanagara', 'Mandya', 'Tumakuru', 'Mysuru'].map((dist) => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedDistrict === dist
                      ? 'bg-orange-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>

          {/* Branch Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBranches.map((branch) => (
              <div
                key={branch.solId}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 text-xs"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 mb-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">SOL: {branch.solId}</span>
                    <span className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full font-bold">{branch.district} District</span>
                  </div>

                  <h3 className="text-sm font-black text-slate-950 mt-1">
                    {lang === 'kn' ? branch.nameKn : branch.nameEn}
                  </h3>

                  <p className="text-slate-600 mt-2 leading-relaxed flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span>{lang === 'kn' ? branch.addressKn : branch.addressEn}</span>
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-slate-700">
                    <p className="font-bold text-slate-900">{branch.manager}</p>
                    <p className="font-mono text-slate-600">Tel: {branch.phone}</p>
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
                    href={`https://maps.google.com/?q=${encodeURIComponent(branch.addressEn)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CALLBACK REQUEST & GRIEVANCE FORM */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">{t.formHeading}</h3>
              <p className="text-xs text-slate-500 font-medium">{t.formSubheading}</p>
            </div>

            {isSubmitted ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-extrabold text-emerald-950">{t.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 mb-1">{t.fieldName}</label>
                    <input
                      type="text"
                      required
                      placeholder="Sri Ramesh / Smt. Lakshmi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 mb-1">{t.fieldPhone}</label>
                    <input
                      type="tel"
                      required
                      placeholder="9845012345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 font-mono font-normal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 mb-1">{t.fieldType}</label>
                  <select
                    value={queryType}
                    onChange={(e) => setQueryType(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 font-semibold"
                  >
                    <option value="LOAN_INQUIRY">Rural Micro Loan (Kirana, Dairy, Artisan, Agri)</option>
                    <option value="MUTUAL_FUND_SIP">Rural Mutual Fund &amp; Micro-SIP Advisory</option>
                    <option value="FIXED_DEPOSIT">High-Yield Fixed Deposit (FD)</option>
                    <option value="UPI_REPAYMENT">Repayment &amp; UPI QR Clarification</option>
                    <option value="GRIEVANCE">Customer Grievance Redressal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 mb-1">{t.fieldMsg}</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe your village location, loan capital requirement, or investment query..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-orange-500 font-normal"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-extrabold shadow-md transition-all text-center"
                  >
                    {t.btnSend}
                  </button>

                  <a
                    href="https://wa.me/919845123450?text=Namaskara,%20I%20have%20an%20inquiry%20regarding%20GGY%20Finance."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-6 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
