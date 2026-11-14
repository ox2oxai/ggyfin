import {
  PortfolioSummaryDto,
  AssetQualityAgingDto,
  DemographicDiversityDto,
  GeographicRiskDto,
  TalukMetrics,
  DailyCollectionRecord
} from '@nbfc/shared';

export interface RawLoanRow {
  accountId: string;
  accountNumber: string;
  borrowerName: string;
  phone: string;
  gender: string;
  taluk: string;
  district: string;
  principalAmount: number;
  currentBalance: number;
  loanPurpose: string;
  daysPastDue: number;
  emiAmount: number;
  status: string;
}

export class AnalyticsService {
  /**
   * Computes high-level Executive Portfolio Summary, Turnover, and P&L metrics.
   */
  public computePortfolioSummary(loans: RawLoanRow[]): PortfolioSummaryDto {
    const activeLoans = loans.filter((l) => l.status === 'ACTIVE');
    const totalAum = activeLoans.reduce((sum, l) => sum + l.currentBalance, 0);
    const totalDisbursed = activeLoans.reduce((sum, l) => sum + l.principalAmount, 0);
    const activeBorrowersCount = new Set(activeLoans.map((l) => l.borrowerName)).size;
    const averageTicketSize = activeLoans.length > 0 ? Math.round(totalDisbursed / activeLoans.length) : 0;

    // Overdue analysis for NPA
    const npaLoans = activeLoans.filter((l) => l.daysPastDue > 90);
    const npaBalance = npaLoans.reduce((sum, l) => sum + l.currentBalance, 0);
    const grossNpaPercent = totalAum > 0 ? Number(((npaBalance / totalAum) * 100).toFixed(2)) : 0;

    // Financial Turnover (Interest + Processing fees)
    // Micro-lending benchmark: ~14% average yield on AUM + 1.5% processing fee
    const yearlyTurnover = Math.round(totalAum * 0.145 + totalDisbursed * 0.015);
    const quarterlyTurnover = Math.round(yearlyTurnover / 4);

    // P&L: Net Profit = Turnover minus Cost of Funds (~8%) minus Operating Expenses (~3.5%)
    const costOfFunds = totalAum * 0.08;
    const opex = totalAum * 0.035;
    const estimatedNetProfit = Math.round(yearlyTurnover - (costOfFunds + opex));

    // Collection Efficiency Ratio (CER): Typically 98-99.5% in healthy JLG/micro loans
    const overdueBalance = activeLoans.filter((l) => l.daysPastDue > 0).reduce((s, l) => s + l.currentBalance, 0);
    const cer = totalAum > 0 ? Number((100 - (overdueBalance / totalAum) * 100).toFixed(1)) : 100;

    return {
      totalAum: Math.round(totalAum),
      activeLoansCount: activeLoans.length,
      activeBorrowersCount,
      totalDisbursedAmount: Math.round(totalDisbursed),
      averageTicketSize,
      collectionEfficiencyRatio: Math.min(100, Math.max(0, cer)),
      grossNpaPercent,
      quarterlyTurnover,
      yearlyTurnover,
      estimatedNetProfit
    };
  }

  /**
   * Computes Asset Quality & Overdue Aging Buckets conforming to RBI Master Directions:
   * - Standard: 0 DPD
   * - SMA-0: 1 to 30 DPD (Early Warning)
   * - SMA-1: 31 to 60 DPD (Medium Stress)
   * - SMA-2: 61 to 90 DPD (High Stress)
   * - Gross NPA: > 90 DPD (Substandard / Default)
   */
  public computeAssetQualityAging(loans: RawLoanRow[]): AssetQualityAgingDto {
    const active = loans.filter((l) => l.status === 'ACTIVE');
    const totalAum = active.reduce((sum, l) => sum + l.currentBalance, 0);

    const bucket = (minDpd: number, maxDpd: number) => {
      const matched = active.filter((l) => l.daysPastDue >= minDpd && l.daysPastDue <= maxDpd);
      const balance = matched.reduce((s, l) => s + l.currentBalance, 0);
      const percentage = totalAum > 0 ? Number(((balance / totalAum) * 100).toFixed(2)) : 0;
      return { count: matched.length, totalBalance: Math.round(balance), percentage };
    };

    const standard = bucket(0, 0);
    const sma0 = bucket(1, 30);
    const sma1 = bucket(31, 60);
    const sma2 = bucket(61, 90);

    const npaMatched = active.filter((l) => l.daysPastDue > 90);
    const npaBalance = npaMatched.reduce((s, l) => s + l.currentBalance, 0);
    const npaPercentage = totalAum > 0 ? Number(((npaBalance / totalAum) * 100).toFixed(2)) : 0;
    const grossNpa = { count: npaMatched.length, totalBalance: Math.round(npaBalance), percentage: npaPercentage };

    // Portfolio at Risk (PAR)
    const par30Bal = active.filter((l) => l.daysPastDue > 30).reduce((s, l) => s + l.currentBalance, 0);
    const par60Bal = active.filter((l) => l.daysPastDue > 60).reduce((s, l) => s + l.currentBalance, 0);

    return {
      standard,
      sma0,
      sma1,
      sma2,
      grossNpa,
      par30Percent: totalAum > 0 ? Number(((par30Bal / totalAum) * 100).toFixed(2)) : 0,
      par60Percent: totalAum > 0 ? Number(((par60Bal / totalAum) * 100).toFixed(2)) : 0,
      par90Percent: npaPercentage
    };
  }

  /**
   * Computes Demographic & Livelihood Diversity (Gender breakdown & Sector spread).
   */
  public computeDemographics(loans: RawLoanRow[]): DemographicDiversityDto {
    const total = loans.length || 1;
    const femaleCount = loans.filter((l) => l.gender.toUpperCase() === 'FEMALE').length;
    const maleCount = loans.filter((l) => l.gender.toUpperCase() === 'MALE').length;
    const otherCount = loans.length - (femaleCount + maleCount);
    const femalePercentage = Number(((femaleCount / total) * 100).toFixed(1));

    // Livelihood Breakdown
    const purposeMap = new Map<string, { count: number; totalAmount: number }>();
    for (const loan of loans) {
      const existing = purposeMap.get(loan.loanPurpose) || { count: 0, totalAmount: 0 };
      existing.count += 1;
      existing.totalAmount += loan.principalAmount;
      purposeMap.set(loan.loanPurpose, existing);
    }

    const totalDisbursed = loans.reduce((s, l) => s + l.principalAmount, 0) || 1;
    const livelihoodBreakdown = Array.from(purposeMap.entries()).map(([purpose, val]) => ({
      purpose,
      count: val.count,
      totalAmount: val.totalAmount,
      percentage: Number(((val.totalAmount / totalDisbursed) * 100).toFixed(1))
    }));

    return {
      genderBreakdown: {
        femaleCount,
        maleCount,
        otherCount,
        femalePercentage
      },
      livelihoodBreakdown,
      averageBorrowerAge: 38 // Typical rural borrower profile
    };
  }

  /**
   * Evaluates Geographic Concentration Risk.
   * Warns management if any taluk concentration > 25% of total AUM.
   */
  public computeGeographicRisk(taluks: TalukMetrics[]): GeographicRiskDto {
    const totalAum = taluks.reduce((sum, t) => sum + t.aum, 0) || 1;

    const enrichedTaluks = taluks.map((t) => ({
      ...t,
      concentrationPercent: Number(((t.aum / totalAum) * 100).toFixed(1))
    }));

    const concentrationAlerts: string[] = [];
    for (const t of enrichedTaluks) {
      if (t.concentrationPercent > 25.0) {
        concentrationAlerts.push(
          `High Geographic Concentration Warning: ${t.taluk} (${t.district}) accounts for ${t.concentrationPercent}% of total AUM (Threshold is 25%). Consider diversifying to adjacent taluks.`
        );
      }
    }

    return {
      taluks: enrichedTaluks,
      concentrationAlerts
    };
  }

  /**
   * Generates CSV format for the Daily Field Collection Sheet.
   */
  public generateDailyCollectionCsv(records: DailyCollectionRecord[]): string {
    const headers = ['Account Number', 'Borrower Name', 'Phone', 'Village/Taluk', 'EMI Due (INR)', 'Due Date', 'Field Officer', 'Status'];
    const rows = records.map((r) => [
      r.accountNumber,
      `"${r.borrowerName}"`,
      r.phone,
      `"${r.villageTaluk}"`,
      r.emiAmount.toFixed(2),
      r.dueDate,
      `"${r.assignedFieldOfficer}"`,
      r.status
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Generates CSV format for the Monthly Asset Quality & NPA Classification Report.
   */
  public generateAssetQualityCsv(aging: AssetQualityAgingDto, totalAum: number): string {
    const lines = [
      'GGY Finance - Monthly Asset Quality & NPA Classification Report (RBI SBR Base Layer)',
      `Generated On: ${new Date().toISOString()}`,
      `Total Gross Portfolio (AUM): INR ${totalAum.toLocaleString('en-IN')}`,
      '',
      'Asset Classification,Days Past Due (DPD),Account Count,Total Exposure (INR),Portfolio Share (%),Regulatory Provisioning Rate',
      `Standard (Current),0 Days,${aging.standard.count},${aging.standard.totalBalance},${aging.standard.percentage}%,0.25%`,
      `SMA-0 (Early Stress),1-30 Days,${aging.sma0.count},${aging.sma0.totalBalance},${aging.sma0.percentage}%,0.25%`,
      `SMA-1 (Medium Stress),31-60 Days,${aging.sma1.count},${aging.sma1.totalBalance},${aging.sma1.percentage}%,5.00%`,
      `SMA-2 (High Stress),61-90 Days,${aging.sma2.count},${aging.sma2.totalBalance},${aging.sma2.percentage}%,10.00%`,
      `Gross NPA (Sub-Standard),> 90 Days,${aging.grossNpa.count},${aging.grossNpa.totalBalance},${aging.grossNpa.percentage}%,15.00%`,
      '',
      `PAR 30 (Portfolio at Risk > 30 Days): ${aging.par30Percent}%`,
      `PAR 60 (Portfolio at Risk > 60 Days): ${aging.par60Percent}%`,
      `Gross NPA Ratio (PAR 90+ Days): ${aging.par90Percent}% (RBI Cap is 5.00%)`
    ];
    return lines.join('\n');
  }
}
