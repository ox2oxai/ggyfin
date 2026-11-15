import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0'
};

const DEFAULT_CONFIG = {
  organizationName: 'GGY Finance Ltd.',
  platformTagline: 'National Micro-Lending Platform • Direct Doorstep Credit',
  registrationNumber: 'NBFC-ND/2026/7742',
  supportEmail: 'support@ggyfinance.in',
  supportPhone: '1800-889-2020',
  nodalOfficerName: 'Smt. Anita Deshmukh',
  nodalOfficerContact: 'grievance@ggyfinance.in • 080-28491001',
  headOfficeAddress: '#104, Institutional Financial Zone, Outer Ring Road, Bengaluru - 560001',
  logoUrl: ''
};

function resolvePath(): string {
  const p1 = path.join(process.cwd(), 'apps', 'web', 'data', 'institution-config.json');
  if (fs.existsSync(p1) || fs.existsSync(path.join(process.cwd(), 'apps', 'web'))) {
    return p1;
  }
  return path.join(process.cwd(), 'data', 'institution-config.json');
}

export async function GET() {
  const filePath = resolvePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      return NextResponse.json(
        { success: true, config: { ...DEFAULT_CONFIG, ...parsed } },
        { headers: NO_CACHE_HEADERS }
      );
    }
  } catch (err) {
    console.error('[API /api/config] Read error:', err);
  }

  return NextResponse.json(
    { success: true, config: DEFAULT_CONFIG },
    { headers: NO_CACHE_HEADERS }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = body.config;

    if (!config || typeof config !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid configuration payload' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const filePath = resolvePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const merged = { ...DEFAULT_CONFIG, ...config };
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');

    return NextResponse.json(
      {
        success: true,
        message: 'Institution profile and branding updated successfully',
        config: merged
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error('[API /api/config] POST error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update config' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
