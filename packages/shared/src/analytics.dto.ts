export interface PortfolioSummaryDto {
  totalAum: number;
  activeLoansCount: number;
  activeBorrowersCount: number;
  totalDisbursedAmount: number;
  averageTicketSize: number;
  collectionEfficiencyRatio: number; // Percentage (e.g. 99.1)
  grossNpaPercent: number; // PAR 90+ Percentage (e.g. 0.84)
  quarterlyTurnover: number; // Realized interest + fees in current quarter
  yearlyTurnover: number; // Financial Year turnover
  estimatedNetProfit: number; // Turnover minus opex and cost of funds
}

export interface AgingBucket {
  count: number;
  totalBalance: number;
  percentage: number;
}

export interface AssetQualityAgingDto {
  standard: AgingBucket; // 0 DPD
  sma0: AgingBucket; // 1-30 DPD (Early Warning)
  sma1: AgingBucket; // 31-60 DPD (Medium Stress)
  sma2: AgingBucket; // 61-90 DPD (High Stress)
  grossNpa: AgingBucket; // 90+ DPD (Default / RBI Substandard)
  par30Percent: number; // PAR 30+
  par60Percent: number; // PAR 60+
  par90Percent: number; // PAR 90+ (Gross NPA %)
}

export interface GenderDiversity {
  femaleCount: number;
  maleCount: number;
  otherCount: number;
  femalePercentage: number;
}

export interface LivelihoodShare {
  purpose: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface DemographicDiversityDto {
  genderBreakdown: GenderDiversity;
  livelihoodBreakdown: LivelihoodShare[];
  averageBorrowerAge: number;
}

export interface TalukMetrics {
  taluk: string;
  district: string;
  borrowerCount: number;
  aum: number;
  concentrationPercent: number; // % of total AUM
  collectionEfficiency: number;
}

export interface GeographicRiskDto {
  taluks: TalukMetrics[];
  concentrationAlerts: string[]; // Alerts triggered when a taluk > 25% of total AUM
}

export interface DailyCollectionRecord {
  accountNumber: string;
  borrowerName: string;
  phone: string;
  villageTaluk: string;
  emiAmount: number;
  dueDate: string;
  assignedFieldOfficer: string;
  status: 'PENDING' | 'COLLECTED';
}
