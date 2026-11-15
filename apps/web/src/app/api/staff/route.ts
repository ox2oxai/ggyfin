import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0'
};

const DEFAULT_STAFF_DATA = [
  {
    id: 'u-superadmin-it-001',
    staffNumber: '202010',
    username: 'it_superadmin',
    fullName: 'Shiv Yaragatti',
    email: 'it.admin@ggyfinance.in',
    phone: '9800000001',
    password: 'GGY#SuperAdminIT@2026!',
    role: 'SUPER_ADMIN_IT',
    branchCode: '2020',
    isActive: true,
    mustResetPassword: false,
    createdAt: '2026-01-01'
  },
  {
    id: 'u-staff-ngyaragatti-002',
    staffNumber: '202011',
    username: 'ngyaragatti',
    fullName: 'N. G. Yaragatti',
    email: 'ng.yaragatti@ggyfinance.in',
    phone: '9845012399',
    password: 'GGYSecurePassword@2026',
    role: 'SYSTEM_ADMIN',
    branchCode: '2020',
    isActive: true,
    mustResetPassword: true,
    createdAt: '2026-01-01'
  }
];

function resolveFilePath(): string {
  const fromRoot = path.join(process.cwd(), 'apps', 'web', 'data', 'staff-directory.json');
  if (fs.existsSync(fromRoot)) return fromRoot;

  const fromWeb = path.join(process.cwd(), 'data', 'staff-directory.json');
  if (fs.existsSync(fromWeb)) return fromWeb;

  if (fs.existsSync(path.join(process.cwd(), 'apps', 'web'))) {
    return fromRoot;
  }
  return fromWeb;
}

function readDirectoryFromFile(): any[] {
  const filePath = resolveFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[API /api/staff] Error reading staff-directory.json:', err);
  }

  // Initialize file if not found
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(DEFAULT_STAFF_DATA, null, 2), 'utf-8');
  } catch (err) {
    console.error('[API /api/staff] Failed to initialize file:', err);
  }

  return DEFAULT_STAFF_DATA;
}

export async function GET() {
  const directory = readDirectoryFromFile();
  return NextResponse.json(
    {
      success: true,
      directory
    },
    { headers: NO_CACHE_HEADERS }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const directory = body.directory;

    if (!Array.isArray(directory)) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: directory must be an array' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const filePath = resolveFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(directory, null, 2), 'utf-8');

    return NextResponse.json(
      {
        success: true,
        message: 'Staff directory persisted successfully',
        directory,
        count: directory.length
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error('[API /api/staff] POST error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update directory' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
