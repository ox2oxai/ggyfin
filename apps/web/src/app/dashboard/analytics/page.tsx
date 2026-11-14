'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Download,
  FileSpreadsheet,
  PieChart,
  MapPin,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('FY 2026-27 Q3');
  const [cluster, setCluster] = useState('All Karnataka Clusters');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadReport = (reportType: string, filename: string) => {
    // Generate and trigger clean client-side CSV download
    let csvContent = '';
    if (reportType === 'daily') {
      csvContent = [
        'Account Number,Borrower Name,Phone,Village/Taluk,EMI Due (INR),Due Date,Assigned Field Officer,Status',
        'GGY-2026-M48101,"Anandi Devi Gowda",9845012345,"Maddur, Mandya",4607.00,2026-11-15,"Field Officer Ramesh (KA-BLR-01)",PENDING',
        'GGY-2026-M48102,"Parvathamma K.",9845012346,"Shivaji Chowk, Maddur",4501.00,2026-11-15,"Field Officer Ramesh (KA-BLR-01)",PENDING',
        'GGY-2026-R56201,"Lakshmi Bai Channapatna",9741054321,"Crafts Colony, Channapatna",5448.00,2026-11-15,"Field Officer Suresh (KA-BLR-01)",COLLECTED',
        'GGY-2026-Y89101,"Basavaraju M.",9880011223,"Hunsur, Mysuru",5018.00,2026-11-15,"Field Officer Mahesh (KA-MYS-01)",PENDING'
      ].join('\n');
    } else if (reportType === 'asset-quality') {
      csvContent = [
        'GGY Finance - Monthly Asset Quality & NPA Classification Report (Micro-Lending Portfolio)',
        `Period: ${period} | Region: ${cluster}`,
        'Asset Classification,Days Past Due (DPD),Account Count,Total Exposure (INR),Portfolio Share (%),Statutory Provisioning Rate',
        'Standard (Current),0 Days,1398,47400000.00,98.34%,0.25%',
        'SMA-0 (Early Stress),1-30 Days,14,530000.00,1.10%,0.25%',
        'SMA-1 (Medium Stress),31-60 Days,5,190000.00,0.39%,5.00%',
        'SMA-2 (High Stress),61-90 Days,1,40000.00,0.08%,10.00%',
        'Gross NPA (Sub-Standard),> 90 Days,2,40000.00,0.08%,15.00%',
        '',
        'PAR 30 (Portfolio at Risk > 30 Days): 0.55%',
        'Gross NPA Ratio (PAR 90+ Days): 0.08% (Regulatory Risk Cap is 5.00%)'
      ].join('\n');
    } else {
      csvContent = [
        'GGY Finance - Quarterly Turnover & Financial Performance Statement',
        `Period: ${period}`,
        'Line Item,Amount (INR),Percentage of Revenue',
        'Gross Interest Realized (Reducing Balance),1820000.00,85.05%',
        'Loan Processing & Document Charges,240000.00,11.21%',
        'Late Repayment Fee Collections,80000.00,3.74%',
        'Total Gross Turnover,2140000.00,100.00%',
        '',
        'Less: Cost of Borrowed Funds (Bank Credit Lines),860000.00,40.19%',
        'Less: Operational Expenses & Field Agent Comms,160000.00,7.48%',
        'Estimated Net Profit before Taxes,1120000.00,52.33%'
      ].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="bg-sandstone-50 p-6 rounded-3xl border border-clay shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 bg-sandstone-200 px-2.5 py-1 rounded-full border border-clay mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Executive Portfolio Intelligence • Super Admin & Manager Console</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-forest-900">Portfolio Analytics & Reports</h2>
          <p className="text-xs text-forest-800/70 mt-0.5">
            Real-time turnover, asset quality (PAR/SMA), geographic concentration, and compliance reporting.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-sandstone-100 border border-clay px-3 py-1.5 rounded-xl text-xs">
            <Calendar className="w-3.5 h-3.5 text-forest-800/60" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent font-bold text-forest-900 focus:outline-hidden cursor-pointer"
            >
              <option value="FY 2026-27 Q3">FY 2026-27 Q3 (Current)</option>
              <option value="FY 2026-27 Q2">FY 2026-27 Q2</option>
              <option value="Full FY 2026-27">Full Financial Year</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-sandstone-100 border border-clay px-3 py-1.5 rounded-xl text-xs">
            <MapPin className="w-3.5 h-3.5 text-forest-800/60" />
            <select
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
              className="bg-transparent font-bold text-forest-900 focus:outline-hidden cursor-pointer"
            >
              <option value="All Karnataka Clusters">All Karnataka Clusters</option>
              <option value="Mandya (Maddur/Malavalli)">Mandya Cluster</option>
              <option value="Ramanagara (Channapatna)">Ramanagara Cluster</option>
              <option value="Mysuru (Hunsur/Nanjangud)">Mysuru Cluster</option>
            </select>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Report successfully exported to your downloads: <strong>{downloadSuccess}</strong></span>
        </div>
      )}

      {/* 6 Executive KPI Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1: Gross AUM */}
        <div className="bg-sandstone-50 p-4 rounded-2xl border border-clay shadow-xs">
          <span className="text-[11px] font-bold text-forest-800/60 uppercase block">Gross AUM</span>
          <div className="text-xl font-black text-forest-900 mt-1">₹ 4.82 Cr</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18.4% QoQ</span>
          </div>
        </div>

        {/* KPI 2: Active Borrowers */}
        <div className="bg-sandstone-50 p-4 rounded-2xl border border-clay shadow-xs">
          <span className="text-[11px] font-bold text-forest-800/60 uppercase block">Active Borrowers</span>
          <div className="text-xl font-black text-forest-900 mt-1">1,420</div>
          <span className="inline-block mt-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            78% Women
          </span>
        </div>

        {/* KPI 3: Collection Efficiency Ratio */}
        <div className="bg-sandstone-50 p-4 rounded-2xl border border-clay shadow-xs">
          <span className="text-[11px] font-bold text-forest-800/60 uppercase block">Collection Ratio</span>
          <div className="text-xl font-black text-emerald-700 mt-1">99.1%</div>
          <div className="text-[10px] text-forest-800/60 mt-1">Target: ≥ 98.5%</div>
        </div>

        {/* KPI 4: Gross NPA Ratio */}
        <div className="bg-sandstone-50 p-4 rounded-2xl border border-clay shadow-xs">
          <span className="text-[11px] font-bold text-forest-800/60 uppercase block">Gross NPA (90+ DPD)</span>
          <div className="text-xl font-black text-terracotta-600 mt-1">0.84%</div>
          <div className="text-[10px] text-forest-800/60 mt-1">Risk Cap: &lt; 5.0%</div>
        </div>

        {/* KPI 5: Quarterly Turnover */}
        <div className="bg-sandstone-50 p-4 rounded-2xl border border-clay shadow-xs">
          <span className="text-[11px] font-bold text-forest-800/60 uppercase block">Quarterly Turnover</span>
          <div className="text-xl font-black text-forest-900 mt-1">₹ 21.4 L</div>
          <div className="text-[10px] text-forest-800/60 mt-1">Interest & Fees</div>
        </div>

        {/* KPI 6: Estimated Net Profit */}
        <div className="bg-sandstone-50 p-4 rounded-2xl border border-clay shadow-xs">
          <span className="text-[11px] font-bold text-forest-800/60 uppercase block">Est. Net Profit</span>
          <div className="text-xl font-black text-forest-900 mt-1">₹ 11.2 L</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">52.3% Margin</div>
        </div>
      </div>

      {/* Grid: 2 Columns (Asset Quality & Diversity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Asset Quality & Overdue Aging (PAR & SMA Classification) */}
        <div className="lg:col-span-7 bg-sandstone-50 rounded-3xl p-6 border border-clay shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-clay/60 pb-3">
            <div>
              <h3 className="font-bold text-base text-forest-900">Asset Quality & Overdue Aging Buckets</h3>
              <p className="text-xs text-forest-800/70">Conforming to Microfinance Standard PAR & SMA Framework</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Low Credit Risk
            </span>
          </div>

          {/* Visual Overdue Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold text-forest-900">
              <span>Standard (0 DPD): 98.34%</span>
              <span className="text-terracotta-600">Overdue (SMA / NPA): 1.66%</span>
            </div>
            <div className="h-4 w-full bg-clay rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: '98.34%' }} className="bg-emerald-600" title="Standard: 98.34%"></div>
              <div style={{ width: '1.10%' }} className="bg-amber-400" title="SMA-0 (1-30 DPD): 1.10%"></div>
              <div style={{ width: '0.39%' }} className="bg-amber-600" title="SMA-1 (31-60 DPD): 0.39%"></div>
              <div style={{ width: '0.08%' }} className="bg-orange-600" title="SMA-2 (61-90 DPD): 0.08%"></div>
              <div style={{ width: '0.08%' }} className="bg-red-600" title="Gross NPA (>90 DPD): 0.08%"></div>
            </div>
          </div>

          {/* Detailed Classification Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-clay text-forest-800/60 uppercase font-bold text-[10px]">
                  <th className="py-2">Category</th>
                  <th className="py-2">DPD Window</th>
                  <th className="py-2">Accounts</th>
                  <th className="py-2">Outstanding</th>
                  <th className="py-2">Share</th>
                  <th className="py-2">Provision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay/40 font-medium">
                <tr>
                  <td className="py-2 font-bold text-forest-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Standard
                  </td>
                  <td className="py-2 text-forest-800/70">0 Days</td>
                  <td className="py-2 font-bold">1,398</td>
                  <td className="py-2">₹ 4.74 Cr</td>
                  <td className="py-2 font-bold text-emerald-700">98.34%</td>
                  <td className="py-2 text-forest-800/60">0.25%</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-amber-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span> SMA-0
                  </td>
                  <td className="py-2 text-forest-800/70">1-30 Days</td>
                  <td className="py-2 font-bold">14</td>
                  <td className="py-2">₹ 5.30 L</td>
                  <td className="py-2 font-bold text-amber-800">1.10%</td>
                  <td className="py-2 text-forest-800/60">0.25%</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span> SMA-1
                  </td>
                  <td className="py-2 text-forest-800/70">31-60 Days</td>
                  <td className="py-2 font-bold">5</td>
                  <td className="py-2">₹ 1.90 L</td>
                  <td className="py-2 font-bold text-amber-900">0.39%</td>
                  <td className="py-2 text-forest-800/60">5.00%</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-orange-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-600"></span> SMA-2
                  </td>
                  <td className="py-2 text-forest-800/70">61-90 Days</td>
                  <td className="py-2 font-bold">1</td>
                  <td className="py-2">₹ 0.40 L</td>
                  <td className="py-2 font-bold text-orange-900">0.08%</td>
                  <td className="py-2 text-forest-800/60">10.00%</td>
                </tr>
                <tr className="bg-red-50/50">
                  <td className="py-2 font-bold text-red-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span> Gross NPA
                  </td>
                  <td className="py-2 text-red-700 font-bold">&gt; 90 Days</td>
                  <td className="py-2 font-bold text-red-700">2</td>
                  <td className="py-2 font-bold text-red-700">₹ 0.40 L</td>
                  <td className="py-2 font-bold text-red-700">0.08%</td>
                  <td className="py-2 font-bold text-red-700">15.00%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-sandstone-100 rounded-xl border border-clay text-[11px] text-forest-800/80 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Early Stress Mitigation:</strong> Field Officers receive automated WhatsApp reminders for all 14 borrowers in the SMA-0 bucket to secure repayment before reaching 30 DPD.
            </span>
          </div>
        </div>

        {/* Right Column: Livelihood Diversity & Gender Inclusion */}
        <div className="lg:col-span-5 bg-sandstone-50 rounded-3xl p-6 border border-clay shadow-xs space-y-4">
          <div className="border-b border-clay/60 pb-3">
            <h3 className="font-bold text-base text-forest-900">Livelihood & Sector Spread</h3>
            <p className="text-xs text-forest-800/70">Loan allocation across rural livelihood purposes</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-forest-900 mb-1">
                <span>Dairy & Animal Husbandry</span>
                <span>42% (₹ 2.02 Cr)</span>
              </div>
              <div className="w-full bg-clay rounded-full h-2.5 overflow-hidden">
                <div style={{ width: '42%' }} className="bg-terracotta-500 h-full rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-forest-900 mb-1">
                <span>Kirana & Retail Inventory</span>
                <span>28% (₹ 1.35 Cr)</span>
              </div>
              <div className="w-full bg-clay rounded-full h-2.5 overflow-hidden">
                <div style={{ width: '28%' }} className="bg-forest-800 h-full rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-forest-900 mb-1">
                <span>Two-Wheeler & Mobility</span>
                <span>18% (₹ 0.87 Cr)</span>
              </div>
              <div className="w-full bg-clay rounded-full h-2.5 overflow-hidden">
                <div style={{ width: '18%' }} className="bg-amber-600 h-full rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-forest-900 mb-1">
                <span>Farm Solar & Machinery</span>
                <span>12% (₹ 0.58 Cr)</span>
              </div>
              <div className="w-full bg-clay rounded-full h-2.5 overflow-hidden">
                <div style={{ width: '12%' }} className="bg-emerald-700 h-full rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Social Inclusion Box */}
          <div className="mt-4 p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between items-center font-bold text-purple-900">
              <span>Women Borrower Inclusion</span>
              <span>1,108 of 1,420 (78%)</span>
            </div>
            <p className="text-[11px] text-purple-800/80 leading-relaxed">
              Exceeds the financial inclusion benchmark of 60% priority sector micro-credit to women micro-entrepreneurs.
            </p>
          </div>
        </div>
      </div>

      {/* Geographic Concentration Risk & Cluster Breakdown */}
      <div className="bg-sandstone-50 rounded-3xl p-6 border border-clay shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-clay/60 pb-3">
          <div>
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta-500" />
              <span>Geographic Concentration & Cluster Risk</span>
            </h3>
            <p className="text-xs text-forest-800/70">Monitors single-taluk exposure to prevent agrarian shock defaults</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Mandya Taluk Exceeds 25% Concentration Limit</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay">
            <div className="flex justify-between items-start">
              <span className="font-extrabold text-forest-900 text-sm">Maddur & Malavalli</span>
              <span className="font-bold text-amber-700">34.0%</span>
            </div>
            <p className="text-[11px] text-forest-800/60 mt-0.5">District: Mandya</p>
            <div className="mt-3 pt-2 border-t border-clay/60 flex justify-between">
              <span>AUM Exposure:</span>
              <span className="font-bold">₹ 1.64 Cr</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold mt-1">
              <span>Collection Ratio:</span>
              <span>99.2%</span>
            </div>
          </div>

          <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay">
            <div className="flex justify-between items-start">
              <span className="font-extrabold text-forest-900 text-sm">Ramanagara & Channapatna</span>
              <span className="font-bold text-amber-700">26.0%</span>
            </div>
            <p className="text-[11px] text-forest-800/60 mt-0.5">District: Ramanagara</p>
            <div className="mt-3 pt-2 border-t border-clay/60 flex justify-between">
              <span>AUM Exposure:</span>
              <span className="font-bold">₹ 1.25 Cr</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold mt-1">
              <span>Collection Ratio:</span>
              <span>99.4%</span>
            </div>
          </div>

          <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay">
            <div className="flex justify-between items-start">
              <span className="font-extrabold text-forest-900 text-sm">Hunsur & Nanjangud</span>
              <span className="font-bold text-emerald-700">22.0%</span>
            </div>
            <p className="text-[11px] text-forest-800/60 mt-0.5">District: Mysuru</p>
            <div className="mt-3 pt-2 border-t border-clay/60 flex justify-between">
              <span>AUM Exposure:</span>
              <span className="font-bold">₹ 1.06 Cr</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold mt-1">
              <span>Collection Ratio:</span>
              <span>98.7%</span>
            </div>
          </div>

          <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay">
            <div className="flex justify-between items-start">
              <span className="font-extrabold text-forest-900 text-sm">Magadi & Kanakapura</span>
              <span className="font-bold text-emerald-700">18.0%</span>
            </div>
            <p className="text-[11px] text-forest-800/60 mt-0.5">District: Ramanagara</p>
            <div className="mt-3 pt-2 border-t border-clay/60 flex justify-between">
              <span>AUM Exposure:</span>
              <span className="font-bold">₹ 0.87 Cr</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold mt-1">
              <span>Collection Ratio:</span>
              <span>99.0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Report Generation & Export Center */}
      <div className="bg-sandstone-50 rounded-3xl p-6 border border-clay shadow-xs space-y-4">
        <div className="border-b border-clay/60 pb-3">
          <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-terracotta-500" />
            <span>Statutory Report Generation & Export Center</span>
          </h3>
          <p className="text-xs text-forest-800/70">
            One-click audit downloads for regulatory inspections, Credit Bureau monthly submissions, and daily field collections.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Report 1 */}
          <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Daily Operations
              </span>
              <h4 className="font-bold text-forest-900 text-sm mt-2">Daily Field Collection Sheet (DCF)</h4>
              <p className="text-[11px] text-forest-800/70 mt-1">
                CSV schedule for Field Officers listing borrowers due today, village names, and expected installments.
              </p>
            </div>
            <button
              onClick={() => handleDownloadReport('daily', 'GGY_Daily_Field_Collection_Sheet.csv')}
              className="w-full py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-terracotta-400" />
              <span>Download CSV Sheet</span>
            </button>
          </div>

          {/* Report 2 */}
          <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold text-terracotta-700 uppercase bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200">
                Portfolio Audit
              </span>
              <h4 className="font-bold text-forest-900 text-sm mt-2">Monthly Asset Quality & NPA Report</h4>
              <p className="text-[11px] text-forest-800/70 mt-1">
                Breakdown of Standard vs SMA-0, SMA-1, SMA-2, and 90+ DPD Gross NPAs with mandatory provisioning.
              </p>
            </div>
            <button
              onClick={() => handleDownloadReport('asset-quality', 'GGY_Monthly_Asset_Quality_NPA_Report.csv')}
              className="w-full py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-terracotta-400" />
              <span>Download Audit Report</span>
            </button>
          </div>

          {/* Report 3 */}
          <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Board & Investors
              </span>
              <h4 className="font-bold text-forest-900 text-sm mt-2">Quarterly P&L & Turnover Statement</h4>
              <p className="text-[11px] text-forest-800/70 mt-1">
                Net Interest Income, processing fee revenue, cost of funds, and net margin statement for the Board of Directors.
              </p>
            </div>
            <button
              onClick={() => handleDownloadReport('financials', 'GGY_Quarterly_Turnover_Financials.csv')}
              className="w-full py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-terracotta-400" />
              <span>Download Financial Deck</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
