import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AnalyticsService, RawLoanRow } from './analytics.service.js';

describe('AnalyticsService (Institutional Micro-Lending Calculations)', () => {
  const service = new AnalyticsService();

  const mockLoans: RawLoanRow[] = [
    {
      accountId: 'acc-1',
      accountNumber: 'GGY-2026-001',
      borrowerName: 'Anandi Devi',
      phone: '9845012345',
      gender: 'FEMALE',
      taluk: 'Maddur',
      district: 'Mandya',
      principalAmount: 50000,
      currentBalance: 50000,
      loanPurpose: 'KIRANA_STORE',
      daysPastDue: 0, // Standard
      emiAmount: 4500,
      status: 'ACTIVE'
    },
    {
      accountId: 'acc-2',
      accountNumber: 'GGY-2026-002',
      borrowerName: 'Suresh Patil',
      phone: '9845012346',
      gender: 'MALE',
      taluk: 'Maddur',
      district: 'Mandya',
      principalAmount: 100000,
      currentBalance: 90000,
      loanPurpose: 'DAIRY_LIVESTOCK',
      daysPastDue: 15, // SMA-0
      emiAmount: 6000,
      status: 'ACTIVE'
    },
    {
      accountId: 'acc-3',
      accountNumber: 'GGY-2026-003',
      borrowerName: 'Rukmini K.',
      phone: '9845012347',
      gender: 'FEMALE',
      taluk: 'Channapatna',
      district: 'Ramanagara',
      principalAmount: 80000,
      currentBalance: 70000,
      loanPurpose: 'DAIRY_LIVESTOCK',
      daysPastDue: 95, // Gross NPA (>90 DPD)
      emiAmount: 5000,
      status: 'ACTIVE'
    }
  ];

  it('computes portfolio summary, turnover and estimated profit', () => {
    const summary = service.computePortfolioSummary(mockLoans);
    assert.equal(summary.totalAum, 210000); // 50k + 90k + 70k
    assert.equal(summary.activeLoansCount, 3);
    assert.equal(summary.activeBorrowersCount, 3);
    assert.equal(summary.totalDisbursedAmount, 230000); // 50k + 100k + 80k
    assert.equal(summary.averageTicketSize, Math.round(230000 / 3));
    // Gross NPA: 70,000 / 210,000 = 33.33%
    assert.equal(summary.grossNpaPercent, 33.33);
    assert.ok(summary.quarterlyTurnover > 0);
    assert.ok(summary.yearlyTurnover > 0);
  });

  it('correctly classifies loans into Standard, SMA-0, and Gross NPA buckets', () => {
    const aging = service.computeAssetQualityAging(mockLoans);
    assert.equal(aging.standard.count, 1);
    assert.equal(aging.standard.totalBalance, 50000);
    assert.equal(aging.sma0.count, 1);
    assert.equal(aging.sma0.totalBalance, 90000);
    assert.equal(aging.sma1.count, 0);
    assert.equal(aging.sma2.count, 0);
    assert.equal(aging.grossNpa.count, 1);
    assert.equal(aging.grossNpa.totalBalance, 70000);
    assert.equal(aging.par90Percent, 33.33);
  });

  it('calculates gender diversity and female borrower proportion', () => {
    const demo = service.computeDemographics(mockLoans);
    assert.equal(demo.genderBreakdown.femaleCount, 2);
    assert.equal(demo.genderBreakdown.maleCount, 1);
    // 2 out of 3 = 66.7%
    assert.equal(demo.genderBreakdown.femalePercentage, 66.7);
    assert.equal(demo.livelihoodBreakdown.length, 2);
  });

  it('triggers concentration risk warning when a single taluk exceeds 25% of total AUM', () => {
    const geo = service.computeGeographicRisk([
      { taluk: 'Maddur', district: 'Mandya', borrowerCount: 100, aum: 700000, concentrationPercent: 70, collectionEfficiency: 99.1 },
      { taluk: 'Ramanagara', district: 'Ramanagara', borrowerCount: 30, aum: 300000, concentrationPercent: 30, collectionEfficiency: 99.4 }
    ]);

    assert.equal(geo.concentrationAlerts.length, 2);
    assert.match(geo.concentrationAlerts[0], /Maddur/);
    assert.match(geo.concentrationAlerts[0], /70%/);
  });

  it('generates valid CSV format for daily field collection schedule', () => {
    const csv = service.generateDailyCollectionCsv([
      {
        accountNumber: 'GGY-2026-001',
        borrowerName: 'Anandi Devi',
        phone: '9845012345',
        villageTaluk: 'Maddur',
        emiAmount: 4500,
        dueDate: '2026-11-15',
        assignedFieldOfficer: 'Field Officer Ramesh',
        status: 'PENDING'
      }
    ]);

    assert.match(csv, /^Account Number,Borrower Name,Phone/);
    assert.match(csv, /GGY-2026-001/);
    assert.match(csv, /4500.00/);
  });
});
