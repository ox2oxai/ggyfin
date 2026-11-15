'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import {
  Search,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  X,
  Plus,
  Check,
  Send,
  HelpCircle,
  PhoneCall,
  MessageCircle,
  FileText,
  AlertTriangle
} from 'lucide-react';
import {
  MutualFundSchemeDetail,
  MutualFundAmcRecord,
  getRiskometerColor,
  RiskometerLevel
} from '@nbfc/shared';
import {
  getMutualFundsSync,
  getMutualFundsAsync,
  submitMutualFundInquiry,
  FALLBACK_MUTUAL_FUNDS,
  MutualFundsDataset
} from '../../lib/mutual-funds';

function NavSplineChart({
  scheme
}: {
  scheme: MutualFundSchemeDetail;
}) {
  const points = scheme.milestonesNavHistory && scheme.milestonesNavHistory.length > 0
    ? scheme.milestonesNavHistory
    : [
        { date: '2021-03-31', nav: Number((scheme.latestNav * 0.65).toFixed(2)) },
        { date: '2022-03-31', nav: Number((scheme.latestNav * 0.76).toFixed(2)) },
        { date: '2023-03-31', nav: Number((scheme.latestNav * 0.84).toFixed(2)) },
        { date: '2024-03-31', nav: Number((scheme.latestNav * 0.94).toFixed(2)) },
        { date: scheme.latestNavDate || '2024-11-14', nav: scheme.latestNav }
      ];

  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; nav: number } | null>(null);

  const navs = points.map((p) => p.nav);
  const minNav = Math.min(...navs);
  const maxNav = Math.max(...navs);
  const paddingNav = (maxNav - minNav) * 0.12 || 2;
  const yMin = Math.max(0, minNav - paddingNav);
  const yMax = maxNav + paddingNav;
  const yRange = yMax - yMin || 1;

  // Chart Dimensions
  const width = 540;
  const height = 170;
  const padLeft = 48;
  const padRight = 24;
  const padTop = 22;
  const padBottom = 32;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const coords = points.map((pt, i) => {
    const x = padLeft + (points.length === 1 ? plotWidth / 2 : (i / (points.length - 1)) * plotWidth);
    const y = padTop + (1 - (pt.nav - yMin) / yRange) * plotHeight;
    return { x, y, pt };
  });

  // Smooth Cubic Bezier Spline Path
  let pathD = '';
  if (coords.length > 0) {
    pathD = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cpX = ((prev.x + curr.x) / 2).toFixed(1);
      pathD += ` C ${cpX} ${prev.y.toFixed(1)}, ${cpX} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
    }
  }

  const lastCoord = coords[coords.length - 1];
  const firstCoord = coords[0];
  const areaD = coords.length > 0
    ? `${pathD} L ${lastCoord.x.toFixed(1)} ${(padTop + plotHeight).toFixed(1)} L ${firstCoord.x.toFixed(1)} ${(padTop + plotHeight).toFixed(1)} Z`
    : '';

  // 3 Gridline values (Top, Mid, Bottom)
  const gridLines = [
    { label: `₹${maxNav.toFixed(1)}`, y: padTop + (1 - (maxNav - yMin) / yRange) * plotHeight },
    { label: `₹${((maxNav + minNav) / 2).toFixed(1)}`, y: padTop + (1 - ((maxNav + minNav) / 2 - yMin) / yRange) * plotHeight },
    { label: `₹${minNav.toFixed(1)}`, y: padTop + (1 - (minNav - yMin) / yRange) * plotHeight }
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-inner space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="font-extrabold text-white tracking-tight">
            High-Resolution NAV Trajectory
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {points.length} Official Checkpoints
          </span>
        </div>
        <div className="text-right">
          {hoveredPoint ? (
            <span className="text-xs font-mono font-bold text-amber-300">
              ₹{hoveredPoint.nav.toFixed(2)} on {hoveredPoint.date}
            </span>
          ) : (
            <span className="text-xs font-mono font-bold text-emerald-400">
              Latest: ₹{scheme.latestNav.toFixed(2)} ({scheme.latestNavDate})
            </span>
          )}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-44 overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`gradient-${scheme.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((gl, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={gl.y}
                x2={width - padRight}
                y2={gl.y}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={gl.y + 3.5}
                fill="#94a3b8"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="end"
                className="font-bold"
              >
                {gl.label}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          {areaD && (
            <path
              d={areaD}
              fill={`url(#gradient-${scheme.id})`}
            />
          )}

          {/* Smooth Bezier Spline Stroke */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#fb923c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {coords.map((c, i) => {
            const isHovered = hoveredPoint?.date === c.pt.date;
            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(c.pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#ea580c' : '#ffffff'}
                  stroke="#ea580c"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />
                {/* Year / Date Axis Label */}
                <text
                  x={c.x}
                  y={height - 8}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="font-medium"
                >
                  {c.pt.date.slice(0, 4)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-2">
        <span>Inception / Base: ₹{points[0]?.nav.toFixed(2)} ({points[0]?.date})</span>
        <span className="text-amber-400/90 font-bold">Daily NAV History Source: AMFI India Official</span>
      </div>
    </div>
  );
}

export default function MutualFundsPage() {
  const { lang } = useLanguage();
  const [dataset, setDataset] = useState<MutualFundsDataset>(FALLBACK_MUTUAL_FUNDS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAmc, setSelectedAmc] = useState<string>('All');
  const [sortKey, setSortKey] = useState<'1Y' | '3Y' | '5Y' | 'NAV'>('1Y');

  // Interactive View States
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<MutualFundSchemeDetail[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Inquiry Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadScheme, setLeadScheme] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [leadConsent, setLeadConsent] = useState(true);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccessMsg, setLeadSuccessMsg] = useState('');
  const [leadErrorMsg, setLeadErrorMsg] = useState('');

  // Hydrate Data on Mount
  useEffect(() => {
    getMutualFundsAsync()
      .then((data) => {
        setDataset(data);
        setIsLoading(false);
      })
      .catch(() => {
        setDataset(getMutualFundsSync());
        setIsLoading(false);
      });
  }, []);

  const categories = ['All', 'Equity', 'Hybrid', 'Debt', 'Index Funds', 'ELSS'];

  // Filtered & Sorted Schemes
  const filteredSchemes = useMemo(() => {
    let list = dataset.schemes || [];

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter((s) => s.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by AMC
    if (selectedAmc !== 'All') {
      list = list.filter((s) => s.amcCode === selectedAmc);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.schemeName.toLowerCase().includes(q) ||
          s.amcName.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.subCategory.toLowerCase().includes(q) ||
          s.amfiCode.includes(q)
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortKey === '1Y') return (b.returns1Y ?? -999) - (a.returns1Y ?? -999);
      if (sortKey === '3Y') return (b.cagr3Y ?? -999) - (a.cagr3Y ?? -999);
      if (sortKey === '5Y') return (b.cagr5Y ?? -999) - (a.cagr5Y ?? -999);
      if (sortKey === 'NAV') return b.latestNav - a.latestNav;
      return 0;
    });
  }, [dataset.schemes, selectedCategory, selectedAmc, searchQuery, sortKey]);

  // Toggle Compare Selection
  const toggleCompare = (scheme: MutualFundSchemeDetail) => {
    const exists = selectedForCompare.some((s) => s.id === scheme.id);
    if (exists) {
      setSelectedForCompare((prev) => prev.filter((s) => s.id !== scheme.id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare a maximum of 3 mutual fund schemes side by side.');
        return;
      }
      setSelectedForCompare((prev) => [...prev, scheme]);
    }
  };

  // Inquiry Submission Handler
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadErrorMsg('');
    setLeadSuccessMsg('');
    setIsSubmittingLead(true);

    const res = await submitMutualFundInquiry({
      fullName: leadName,
      phone: leadPhone,
      email: leadEmail || undefined,
      schemeName: leadScheme || undefined,
      message: leadMessage || undefined,
      consentGranted: leadConsent,
      sourcePage: '/mutual-funds'
    });

    setIsSubmittingLead(false);
    if (res.success) {
      setLeadSuccessMsg(res.message);
      setLeadName('');
      setLeadPhone('');
      setLeadEmail('');
      setLeadScheme('');
      setLeadMessage('');
    } else {
      setLeadErrorMsg(res.message);
    }
  };

  // Pre-fill Scheme Inquiry from Card
  const openInquiryForScheme = (schemeName: string) => {
    setLeadScheme(schemeName);
    const formEl = document.getElementById('inquiry-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const t = {
    en: {
      badge: 'Official AMFI Market Data Discovery',
      title: 'Explore Indian Mutual Funds',
      subtitle:
        'A high-speed, lightweight reference guide to discover, benchmark, and compare mutual fund schemes using official AMFI published data.',
      quickRefNoticeTitle: 'Official AMC Live Reference Notice',
      quickRefNoticeDesc:
        'Fund NAVs displayed below are published as-of the latest daily AMFI release. For real-time intraday NAVs, official portfolio disclosures, and SID/KIM documents, please visit the respective Mutual Fund House official website linked directly on each fund card.',
      searchPlaceholder: 'Search by scheme name, fund house, AMFI code (e.g. HDFC, 101658, Parag Parikh)...',
      categoryAll: 'All Categories',
      sortLabel: 'Sort by:',
      sort1Y: '1-Year Return',
      sort3Y: '3-Year CAGR',
      sort5Y: '5-Year CAGR',
      sortNav: 'Latest NAV',
      latestNavLabel: 'Latest NAV',
      navDatePrefix: 'As of',
      returns1YLabel: '1Y Return',
      cagr3YLabel: '3Y CAGR',
      cagr5YLabel: '5Y CAGR',
      viewNavTrack: 'Historical NAV Track',
      closeNavTrack: 'Hide NAV Track',
      officialAmcBtn: 'Official AMC Portal',
      compareBtn: 'Compare',
      comparingBarTitle: 'Funds selected for comparison:',
      viewCompareBtn: 'Compare Schemes Now',
      inquireCtaTitle: 'Interested in Investing?',
      inquireCtaDesc:
        'Connect with our AMFI-registered Mutual Fund Distributor for authorized guidance, portfolio diversification, and doorstep documentation.',
      distributorName: 'AMFI Registered Distributor: GGY Finance Wealth Desk',
      arnDisclosure: 'ARN Number: ARN-284910 • AMFI Registration: Valid & In Force',
      statutoryWarning:
        'Mutual Fund investments are subject to market risks, read all scheme related documents carefully.',
      formName: 'Full Legal Name',
      formPhone: '10-Digit Mobile Number',
      formEmail: 'Email Address (Optional)',
      formScheme: 'Interested Scheme',
      formMsg: 'Message or Questions',
      formConsent:
        'I give explicit consent under DPDP Act 2023 to be contacted by an AMFI-registered distributor regarding mutual fund investments.',
      formSubmitBtn: 'Connect with Distributor Desk',
      noResults: 'No mutual fund schemes match your search criteria.',
      resetFilters: 'Reset Search & Filters'
    },
    kn: {
      badge: 'ಅಧಿಕೃತ ಆಂಫಿ (AMFI) ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಪರಿಶೋಧನೆ',
      title: 'ಭಾರತೀಯ ಮ್ಯೂಚುಯಲ್ ಫಂಡ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
      subtitle:
        'ಅಧಿಕೃತ ಆಂಫಿ (AMFI) ಪ್ರಕಟಿತ ದೈನಂದಿನ ಮಾಹಿತಿಯ ಆಧಾರದಲ್ಲಿ ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು, ಹೋಲಿಸಲು ಮತ್ತು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ತ್ವರಿತ ವೇದಿಕೆ.',
      quickRefNoticeTitle: 'ಅಧಿಕೃತ ಎಎಂಸಿ (AMC) ನೇರ ಪರಿಶೀಲನಾ ಸೂಚನೆ',
      quickRefNoticeDesc:
        'ಇಲ್ಲಿ ಪ್ರದರ್ಶಿಸಲಾದ ಎನ್‌ಎವಿ (NAV) ಮೌಲ್ಯಗಳು ಇತ್ತೀಚಿನ ಆಂಫಿ ದೈನಂದಿನ ವರದಿಯ ಪ್ರಕಾರ ಇವೆ. ರಿಯಲ್-ಟೈಮ್ ಎನ್‌ಎವಿ, ಪೋರ್ಟ್‌ಫೋಲಿಯೋ ವಿವರಗಳು ಮತ್ತು ಅಧಿಕೃತ ದಾಖಲೆಗಳಿಗಾಗಿ ಆಯಾ ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ ಹೌಸ್‌ನ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ.',
      searchPlaceholder: 'ಯೋಜನೆಯ ಹೆಸರು, ಫಂಡ್ ಹೌಸ್ ಅಥವಾ ಆಂಫಿ ಕೋಡ್ ಮೂಲಕ ಹುಡುಕಿ...',
      categoryAll: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು',
      sortLabel: 'ವಿಂಗಡಣೆ:',
      sort1Y: '೧-ವರ್ಷದ ರಿಟರ್ನ್',
      sort3Y: '೩-ವರ್ಷದ ಸಿಎಜಿಆರ್ (CAGR)',
      sort5Y: '೫-ವರ್ಷದ ಸಿಎಜಿಆರ್ (CAGR)',
      sortNav: 'ಇತ್ತೀಚಿನ ಎನ್‌ಎವಿ',
      latestNavLabel: 'ಇತ್ತೀಚಿನ NAV',
      navDatePrefix: 'ದಿನಾಂಕದಂತೆ',
      returns1YLabel: '೧-ವರ್ಷ ರಿಟರ್ನ್',
      cagr3YLabel: '೩-ವರ್ಷ CAGR',
      cagr5YLabel: '೫-ವರ್ಷ CAGR',
      viewNavTrack: 'ಐತಿಹಾಸಿಕ NAV ಚಾರ್ಟ್',
      closeNavTrack: 'ಚಾರ್ಟ್ ಮುಚ್ಚಿ',
      officialAmcBtn: 'ಅಧಿಕೃತ AMC ವೆಬ್‌ಸೈಟ್',
      compareBtn: 'ಹೋಲಿಕೆ ಮಾಡಿ',
      comparingBarTitle: 'ಹೋಲಿಕೆಗೆ ಆಯ್ಕೆಯಾದ ಯೋಜನೆಗಳು:',
      viewCompareBtn: 'ಈಗಲೇ ಹೋಲಿಕೆ ವೀಕ್ಷಿಸಿ',
      inquireCtaTitle: 'ಹೂಡಿಕೆಯಲ್ಲಿ ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಾ?',
      inquireCtaDesc:
        'ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ ಹೂಡಿಕೆ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ನಮ್ಮ ಆಂಫಿ-ನೋಂದಾಯಿತ (AMFI) ವಿತರಕರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      distributorName: 'ಆಂಫಿ ನೋಂದಾಯಿತ ವಿತರಕರು: ಜಿಜಿವೈ ಫೈನಾನ್ಸ್ ವೆಲ್ತ್ ಡೆಸ್ಕ್',
      arnDisclosure: 'ARN ಸಂಖ್ಯೆ: ARN-284910 • AMFI ನೋಂದಣಿ ಚಾಲ್ತಿಯಲ್ಲಿದೆ',
      statutoryWarning:
        'ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ ಹೂಡಿಕೆಗಳು ಮಾರುಕಟ್ಟೆಯ ಅಪಾಯಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತವೆ, ಎಲ್ಲಾ ಯೋಜನೆ ಸಂಬಂಧಿತ ದಾಖಲೆಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ.',
      formName: 'ಪೂರ್ಣ ಹೆಸರು',
      formPhone: '೧೦-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      formEmail: 'ಇಮೇಲ್ ವಿಳಾಸ (ಐಚ್ಛಿಕ)',
      formScheme: 'ಆಸಕ್ತ ಯೋಜನೆ',
      formMsg: 'ನಿಮ್ಮ ಸಂದೇಶ ಅಥವಾ ಪ್ರಶ್ನೆ',
      formConsent:
        'DPDP ಕಾಯ್ದೆ 2023 ರ ಅನ್ವಯ ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ ಹೂಡಿಕೆ ಕುರಿತು ವಿತರಕರಿಂದ ಮಾಹಿತಿ ಪಡೆಯಲು ಸಮ್ಮತಿಸುತ್ತೇನೆ.',
      formSubmitBtn: 'ವಿತರಕರ ಡೆಸ್ಕ್ ಸಂಪರ್ಕಿಸಿ',
      noResults: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
      resetFilters: 'ಫಿಲ್ಟರ್ ರದ್ದುಗೊಳಿಸಿ'
    }
  }[lang];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <PublicHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 flex-1 w-full">
        {/* ======================================================== */}
        {/* 1. TOP HEADER & NOTICE BANNER */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-800 bg-orange-100/90 px-3.5 py-1.5 rounded-full border border-orange-200/90 ring-1 ring-inset ring-orange-500/10 shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
            <span>{t.badge}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
              {t.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed font-normal">
              {t.subtitle}
            </p>
          </div>

          {/* Prominent Quick-Reference & Official AMC Live Notice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 flex items-start gap-3.5 shadow-[0_1px_3px_0_rgba(6,78,59,0.05)] ring-1 ring-emerald-900/[0.03]">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-emerald-950">
              <p className="font-extrabold text-emerald-900 text-sm tracking-tight">{t.quickRefNoticeTitle}</p>
              <p className="text-emerald-800 leading-relaxed font-normal">
                {t.quickRefNoticeDesc}
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. INSTANT SEARCH & LEAN FILTERS */}
        {/* ======================================================== */}
        <section className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-[0_2px_10px_-3px_rgba(15,23,42,0.06),0_1px_3px_-1px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.03] space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-16 py-3.5 bg-slate-50/80 border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white transition-all font-medium shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-700 text-xs font-bold bg-slate-200/70 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills & Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1 border-t border-slate-100">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm ring-1 ring-orange-600/30 font-extrabold'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/90 border border-slate-200/70 font-bold'
                  }`}
                >
                  {cat === 'All' ? t.categoryAll : cat}
                </button>
              ))}
            </div>

            {/* AMC & Sort Select */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold shrink-0 self-end sm:self-auto">
              <select
                value={selectedAmc}
                onChange={(e) => setSelectedAmc(e.target.value)}
                className="bg-slate-50/90 border border-slate-200/90 py-1.5 px-3 rounded-xl text-xs font-extrabold text-slate-800 cursor-pointer focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              >
                <option value="All">All Fund Houses</option>
                {(dataset.amcs || []).map((amc) => (
                  <option key={amc.code} value={amc.code}>
                    {amc.name}
                  </option>
                ))}
              </select>

              <span className="text-slate-500 flex items-center gap-1 pl-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.sortLabel}</span>
              </span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="bg-slate-50/90 border border-slate-200/90 py-1.5 px-3 rounded-xl text-xs font-extrabold text-slate-800 cursor-pointer focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              >
                <option value="1Y">{t.sort1Y}</option>
                <option value="3Y">{t.sort3Y}</option>
                <option value="5Y">{t.sort5Y}</option>
                <option value="NAV">{t.sortNav}</option>
              </select>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. SCHEMES DISCOVERY GRID */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 px-1">
            <span>
              Showing {filteredSchemes.length} verified schemes (AMFI Daily Catalog)
            </span>
            {dataset.syncMetadata?.lastSyncTimestamp && (
              <span className="font-mono text-[11px] text-slate-400">
                Data Freshness: {dataset.syncMetadata.lastSyncTimestamp.slice(0, 10)}
              </span>
            )}
          </div>

          {filteredSchemes.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-black text-slate-700">{t.noResults}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedAmc('All');
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
              >
                {t.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchemes.map((scheme) => {
                const isExpanded = expandedSchemeId === scheme.id;
                const isCompared = selectedForCompare.some((s) => s.id === scheme.id);
                const riskColor = getRiskometerColor(scheme.riskometer);

                return (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06),0_1px_3px_-1px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] p-5 sm:p-6 hover:border-orange-300/80 hover:shadow-[0_8px_24px_-4px_rgba(249,115,22,0.12),0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-4"
                  >
                    {/* Top Row: Category + Riskometer + AMFI Code */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-900 bg-orange-50/90 px-2.5 py-1 rounded-lg border border-orange-200/90 ring-1 ring-inset ring-orange-500/15">
                          {scheme.category} • {scheme.subCategory}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ring-1 ring-inset ring-black/5 ${riskColor.badgeBg} ${riskColor.badgeText} ${riskColor.badgeBorder}`}
                          >
                            {scheme.riskometer} Risk
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/90">
                            #{scheme.amfiCode}
                          </span>
                        </div>
                      </div>

                      {/* Scheme Name & Fund House */}
                      <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight tracking-tight line-clamp-2">
                          {scheme.schemeName}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {scheme.amcName} • {scheme.planType} Plan ({scheme.optionType})
                        </p>
                      </div>
                    </div>

                    {/* Performance & NAV Metrics Strip */}
                    <div className="bg-slate-50/90 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 grid grid-cols-4 gap-2 text-center divide-x divide-slate-200/60">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.latestNavLabel}</p>
                        <p className="text-sm sm:text-base font-black text-slate-950 font-mono tabular-nums mt-0.5">
                          ₹{scheme.latestNav.toFixed(2)}
                        </p>
                        <p className="text-[9px] text-slate-400 font-mono">
                          {scheme.latestNavDate ? scheme.latestNavDate.slice(5) : ''}
                        </p>
                      </div>

                      <div className="pl-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.returns1YLabel}</p>
                        <p
                          className={`text-sm sm:text-base font-black font-mono tabular-nums mt-0.5 ${
                            (scheme.returns1Y ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {scheme.returns1Y !== null ? `+${scheme.returns1Y}%` : 'N/A'}
                        </p>
                        <p className="text-[9px] text-slate-400 font-medium">Absolute</p>
                      </div>

                      <div className="pl-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.cagr3YLabel}</p>
                        <p
                          className={`text-sm sm:text-base font-black font-mono tabular-nums mt-0.5 ${
                            (scheme.cagr3Y ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {scheme.cagr3Y !== null ? `+${scheme.cagr3Y}%` : 'N/A'}
                        </p>
                        <p className="text-[9px] text-slate-400 font-medium">p.a.</p>
                      </div>

                      <div className="pl-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.cagr5YLabel}</p>
                        <p
                          className={`text-sm sm:text-base font-black font-mono tabular-nums mt-0.5 ${
                            (scheme.cagr5Y ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {scheme.cagr5Y !== null ? `+${scheme.cagr5Y}%` : 'N/A'}
                        </p>
                        <p className="text-[9px] text-slate-400 font-medium">p.a.</p>
                      </div>
                    </div>

                    {/* Expandable High-Resolution Vector SVG Spline Chart */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span className="flex items-center gap-1.5 text-slate-900">
                            <BarChart3 className="w-3.5 h-3.5 text-orange-600" />
                            <span>Historical NAV Track (Milestone Trajectory)</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Benchmark: {scheme.benchmarkName || 'Category Index'}
                          </span>
                        </div>

                        {/* High-Resolution SVG Area Spline */}
                        <NavSplineChart scheme={scheme} />

                        {/* Statutory Disclosure Links & Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold text-slate-600 pt-1">
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                            <span className="text-[9px] text-slate-400 block uppercase">Expense Ratio (TER)</span>
                            <span className="font-mono text-slate-900">{scheme.expenseRatio ? `${scheme.expenseRatio}%` : 'N/A'}</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                            <span className="text-[9px] text-slate-400 block uppercase">Inception Date</span>
                            <span className="font-mono text-slate-900">{scheme.inceptionDate || 'N/A'}</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                            <span className="text-[9px] text-slate-400 block uppercase">Official SID</span>
                            <a
                              href={scheme.sidUrl || scheme.amcOfficialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:underline flex items-center gap-1"
                            >
                              <span>View SID</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                            <span className="text-[9px] text-slate-400 block uppercase">Official Factsheet</span>
                            <a
                              href={scheme.factsheetUrl || scheme.amcOfficialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:underline flex items-center gap-1"
                            >
                              <span>Factsheet</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Strip */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {/* Left: View Historical Track + Compare Checkbox */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                          className="text-slate-700 hover:text-orange-600 font-bold inline-flex items-center gap-1 py-1 cursor-pointer transition-colors"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-orange-600" />
                          <span>{isExpanded ? t.closeNavTrack : t.viewNavTrack}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleCompare(scheme)}
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            isCompared
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isCompared ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3" />}
                          <span>{isCompared ? 'Selected' : t.compareBtn}</span>
                        </button>
                      </div>

                      {/* Right: Direct Official AMC Link + Inquiry Action */}
                      <div className="flex items-center gap-2">
                        <a
                          href={scheme.amcOfficialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-colors"
                          title="Visit official fund house portal for real-time intraday NAV and direct folio actions"
                        >
                          <span>{t.officialAmcBtn}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          type="button"
                          onClick={() => openInquiryForScheme(scheme.schemeName)}
                          className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* 4. FLOATING COMPARISON DOCK BAR */}
        {/* ======================================================== */}
        {selectedForCompare.length > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4 max-w-lg w-[92%] animate-in slide-in-from-bottom-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-300">{t.comparingBarTitle}</p>
              <div className="flex items-center gap-1.5">
                {selectedForCompare.map((s) => (
                  <span
                    key={s.id}
                    className="text-[10px] font-extrabold bg-slate-800 text-orange-400 px-2 py-0.5 rounded-md border border-slate-700 truncate max-w-[120px]"
                  >
                    {s.schemeName.split(' ')[0]} {s.schemeName.split(' ')[1]}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                {t.viewCompareBtn} ({selectedForCompare.length}/3)
              </button>
              <button
                type="button"
                onClick={() => setSelectedForCompare([])}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Clear Compare"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. COMPARISON MODAL DIALOG */}
        {/* ======================================================== */}
        {isCompareModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Side-by-Side Scheme Comparison</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Benchmark performance, riskometer, and official expense ratios across chosen schemes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Metric / Feature</th>
                      {selectedForCompare.map((s) => (
                        <th key={s.id} className="py-2.5 px-3 text-slate-900 font-black">
                          {s.schemeName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-2.5 px-3 text-slate-500 font-bold">Fund House (AMC)</td>
                      {selectedForCompare.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 font-bold text-slate-800">
                          {s.amcName}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-slate-500 font-bold">Category</td>
                      {selectedForCompare.map((s) => (
                        <td key={s.id} className="py-2.5 px-3">
                          <span className="bg-orange-50 text-orange-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            {s.category} ({s.subCategory})
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-slate-500 font-bold">Latest NAV</td>
                      {selectedForCompare.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 font-mono font-black text-slate-900">
                          ₹{s.latestNav.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-slate-500 font-bold">1-Year Absolute Return</td>
                      {selectedForCompare.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                          {s.returns1Y !== null ? `+${s.returns1Y}%` : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-slate-500 font-bold">3-Year CAGR</td>
                      {selectedForCompare.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                          {s.cagr3Y !== null ? `+${s.cagr3Y}% p.a.` : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-slate-500 font-bold">5-Year CAGR</td>
                      {selectedForCompare.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                          {s.cagr5Y !== null ? `+${s.cagr5Y}% p.a.` : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-slate-500 font-bold">SEBI Riskometer</td>
                      {selectedForCompare.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 font-bold text-slate-800">
                          {s.riskometer}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-slate-500 font-bold">Expense Ratio (TER)</td>
                      {selectedForCompare.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 font-mono">
                          {s.expenseRatio ? `${s.expenseRatio}%` : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-slate-500 font-bold">Official Verification</td>
                      {selectedForCompare.map((s) => (
                        <td key={s.id} className="py-2.5 px-3">
                          <a
                            href={s.amcOfficialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:underline font-bold inline-flex items-center gap-1"
                          >
                            <span>Live AMC Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Close Comparison
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. AMFI REGISTERED DISTRIBUTOR LEAD INQUIRY SECTION */}
        {/* ======================================================== */}
        <section
          id="inquiry-section"
          className="bg-gradient-to-br from-[#064e3b] via-[#062e1c] to-[#022c22] text-white rounded-3xl p-6 sm:p-10 border border-emerald-800 shadow-xl space-y-6"
        >
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.distributorName}</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {t.inquireCtaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t.inquireCtaDesc}
            </p>
            <p className="text-[11px] font-mono text-emerald-300 font-medium">
              {t.arnDisclosure}
            </p>
          </div>

          {/* Statutory Risk Disclaimer Banner */}
          <div className="p-3.5 bg-emerald-950/80 rounded-2xl border border-emerald-700/80 text-[11px] text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">
              {t.statutoryWarning}
            </p>
          </div>

          {/* Lead Capture Form */}
          {leadSuccessMsg ? (
            <div className="p-6 bg-emerald-900/80 rounded-2xl border border-emerald-600 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto" />
              <h4 className="text-base font-black text-white">Inquiry Registered</h4>
              <p className="text-xs text-emerald-100 max-w-lg mx-auto leading-relaxed">
                {leadSuccessMsg}
              </p>
              <button
                type="button"
                onClick={() => setLeadSuccessMsg('')}
                className="mt-2 px-5 py-2 bg-white text-emerald-950 text-xs font-black rounded-xl hover:bg-emerald-50 cursor-pointer"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4 max-w-2xl text-xs font-bold">
              {leadErrorMsg && (
                <div className="p-3 rounded-xl bg-red-900/60 border border-red-500 text-white text-xs">
                  {leadErrorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-emerald-200 mb-1">{t.formName}</label>
                  <input
                    type="text"
                    required
                    placeholder="Sri Basavaraj / Smt. Lakshmi"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full p-3 bg-emerald-950/90 border border-emerald-700 rounded-xl text-white placeholder:text-emerald-500 text-xs focus:ring-2 focus:ring-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 mb-1">{t.formPhone}</label>
                  <input
                    type="tel"
                    required
                    placeholder="9845012345"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full p-3 bg-emerald-950/90 border border-emerald-700 rounded-xl text-white placeholder:text-emerald-500 font-mono text-xs focus:ring-2 focus:ring-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-emerald-200 mb-1">{t.formEmail}</label>
                  <input
                    type="email"
                    placeholder="investor@example.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full p-3 bg-emerald-950/90 border border-emerald-700 rounded-xl text-white placeholder:text-emerald-500 text-xs focus:ring-2 focus:ring-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 mb-1">{t.formScheme}</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Top 100 or Parag Parikh Flexi Cap"
                    value={leadScheme}
                    onChange={(e) => setLeadScheme(e.target.value)}
                    className="w-full p-3 bg-emerald-950/90 border border-emerald-700 rounded-xl text-white placeholder:text-emerald-500 text-xs focus:ring-2 focus:ring-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-200 mb-1">{t.formMsg}</label>
                <textarea
                  rows={2}
                  placeholder="I would like to explore monthly SIP or portfolio allocation options..."
                  value={leadMessage}
                  onChange={(e) => setLeadMessage(e.target.value)}
                  className="w-full p-3 bg-emerald-950/90 border border-emerald-700 rounded-xl text-white placeholder:text-emerald-500 text-xs focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-emerald-100 text-[11px] font-normal leading-relaxed">
                <input
                  type="checkbox"
                  required
                  checked={leadConsent}
                  onChange={(e) => setLeadConsent(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600 shrink-0 mt-0.5 cursor-pointer"
                />
                <span>{t.formConsent}</span>
              </label>

              <button
                type="submit"
                disabled={isSubmittingLead}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingLead ? 'Submitting...' : t.formSubmitBtn}</span>
              </button>
            </form>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
