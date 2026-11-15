import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0'
};

const DEFAULT_SCHEMES = [
  {
    schemeCode: 'SCHM-701',
    name: 'Kirana & Retail Working Capital',
    minAmount: 10000,
    maxAmount: 50000,
    interestRate: 11.5,
    defaultTenureMonths: 12,
    minTenureMonths: 6,
    maxTenureMonths: 18,
    frequency: 'WEEKLY_OR_MONTHLY',
    purpose: 'Inventory purchase, shop modernization & merchant daily liquidity',
    isActive: true
  },
  {
    schemeCode: 'SCHM-702',
    name: 'Dairy Development & Livestock Term Loan',
    minAmount: 20000,
    maxAmount: 100000,
    interestRate: 12.0,
    defaultTenureMonths: 24,
    minTenureMonths: 12,
    maxTenureMonths: 24,
    frequency: 'MONTHLY',
    purpose: 'Crossbred cattle purchase, cattle feed & milking equipment',
    isActive: true
  },
  {
    schemeCode: 'SCHM-703',
    name: 'Powerloom & Rural Artisan Credit',
    minAmount: 15000,
    maxAmount: 80000,
    interestRate: 12.5,
    defaultTenureMonths: 18,
    minTenureMonths: 12,
    maxTenureMonths: 24,
    frequency: 'MONTHLY',
    purpose: 'Yarn stock, weaving loom accessories & handicraft working capital',
    isActive: true
  },
  {
    schemeCode: 'SCHM-704',
    name: 'Micro-Agri & Allied Equipment Loan',
    minAmount: 25000,
    maxAmount: 200000,
    interestRate: 13.0,
    defaultTenureMonths: 24,
    minTenureMonths: 12,
    maxTenureMonths: 36,
    frequency: 'MONTHLY',
    purpose: 'Drip irrigation, solar fencing, polyhouse setup & small farm implements',
    isActive: true
  }
];

function resolvePath(): string {
  const p1 = path.join(process.cwd(), 'apps', 'web', 'data', 'credit-schemes.json');
  if (fs.existsSync(p1) || fs.existsSync(path.join(process.cwd(), 'apps', 'web'))) {
    return p1;
  }
  return path.join(process.cwd(), 'data', 'credit-schemes.json');
}

export async function GET() {
  const filePath = resolvePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return NextResponse.json(
          { success: true, schemes: parsed },
          { headers: NO_CACHE_HEADERS }
        );
      }
    }
  } catch (err) {
    console.error('[API /api/schemes] Read error:', err);
  }

  return NextResponse.json(
    { success: true, schemes: DEFAULT_SCHEMES },
    { headers: NO_CACHE_HEADERS }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const schemes = body.schemes;

    if (!Array.isArray(schemes)) {
      return NextResponse.json(
        { success: false, message: 'Invalid schemes payload: must be an array' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const filePath = resolvePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(schemes, null, 2), 'utf-8');

    return NextResponse.json(
      {
        success: true,
        message: 'Credit schemes updated successfully',
        schemes,
        count: schemes.length
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error('[API /api/schemes] POST error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update schemes' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
