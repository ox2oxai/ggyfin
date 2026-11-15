import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAbsoluteReturn,
  calculateCAGR,
  downsampleNavHistory,
  MutualFundInquirySchema
} from './mutual-fund.js';

describe('Mutual Fund Performance & Validation Engine', () => {
  describe('calculateAbsoluteReturn', () => {
    it('calculates point-to-point absolute return correctly', () => {
      // NAV moves from 100 to 118 -> 18.00%
      const ret = calculateAbsoluteReturn(100, 118);
      assert.equal(ret, 18.0);
    });

    it('handles negative returns accurately', () => {
      // NAV drops from 50 to 45 -> -10.00%
      const ret = calculateAbsoluteReturn(50, 45);
      assert.equal(ret, -10.0);
    });

    it('guards against zero, negative or invalid NAV inputs', () => {
      assert.equal(calculateAbsoluteReturn(0, 100), null);
      assert.equal(calculateAbsoluteReturn(100, 0), null);
      assert.equal(calculateAbsoluteReturn(-10, 50), null);
    });
  });

  describe('calculateCAGR (Compounded Annual Growth Rate)', () => {
    it('calculates 3-year CAGR accurately across 1095 days', () => {
      // If an asset grows from 100 to 172.8 in 3 years (1095 days), CAGR is 20%
      const cagr = calculateCAGR(100, 172.8, 1095);
      assert.equal(cagr, 20.0);
    });

    it('calculates 5-year CAGR accurately across 1825 days', () => {
      // If asset doubles in 5 years (from 100 to 200 in 1825 days), CAGR is ~14.87%
      const cagr = calculateCAGR(100, 200, 1825);
      assert.equal(cagr, 14.87);
    });

    it('falls back to absolute return if period is less than 360 days', () => {
      const cagr = calculateCAGR(100, 112, 180);
      assert.equal(cagr, 12.0);
    });
  });

  describe('downsampleNavHistory', () => {
    it('reduces a large series to requested max points while preserving first and last', () => {
      const largeSeries = Array.from({ length: 250 }, (_, i) => ({
        date: `2025-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        nav: 100 + i * 0.2
      }));

      const downsampled = downsampleNavHistory(largeSeries, 24);
      assert.equal(downsampled.length, 24);
      assert.equal(downsampled[0].date, largeSeries[0].date);
      assert.equal(downsampled[downsampled.length - 1].date, largeSeries[largeSeries.length - 1].date);
    });

    it('leaves series untouched if length is already below max points', () => {
      const smallSeries = [
        { date: '2026-01-01', nav: 100 },
        { date: '2026-02-01', nav: 105 },
        { date: '2026-03-01', nav: 110 }
      ];
      const result = downsampleNavHistory(smallSeries, 36);
      assert.equal(result.length, 3);
    });
  });

  describe('MutualFundInquirySchema validation', () => {
    it('accepts compliant investor inquiry with 10-digit mobile and DPDP consent', () => {
      const valid = MutualFundInquirySchema.safeParse({
        fullName: 'Ramesh Patil',
        phone: '9845012345',
        email: 'ramesh.patil@example.com',
        schemeName: 'HDFC Large and Mid Cap Fund',
        message: 'Interested in monthly SIP of Rs. 2,000',
        consentGranted: true,
        sourcePage: '/mutual-funds'
      });
      assert.equal(valid.success, true);
    });

    it('rejects inquiry if DPDP consent is false', () => {
      const invalid = MutualFundInquirySchema.safeParse({
        fullName: 'Ramesh Patil',
        phone: '9845012345',
        consentGranted: false
      });
      assert.equal(invalid.success, false);
    });

    it('rejects invalid mobile numbers (must be 10 digits starting 6-9)', () => {
      const invalid = MutualFundInquirySchema.safeParse({
        fullName: 'Ramesh Patil',
        phone: '1234567890',
        consentGranted: true
      });
      assert.equal(invalid.success, false);
    });
  });
});
