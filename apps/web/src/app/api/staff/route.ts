import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DEFAULT_STAFF_DATA = [
  {
    id: 'u-superadmin-it-001',
    staffNumber: '202010',
    username: 'it_superadmin',
    fullName: 'Sri Chethan Gowda (IT Lead)',
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
  // Option 1: running from repo root
  const p1 = path.join(process.cwd(), 'apps', 'web', 'data', 'staff-directory.json');
  if (fs.existsSync(p1) || fs.existsSync(path.join(process.cwd(), 'apps', 'web'))) {
    return p1;
  }
  // Option 2: running from apps/web directory
  return path.join(process.cwd(), 'data', 'staff-directory.json');
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
  return NextResponse.json({
    success: true,
    directory
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const directory = body.directory;

    if (!Array.isArray(directory)) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: directory must be an array' },
        { status: 400 }
      );
    }

    const filePath = resolveFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(directory, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Staff directory persisted successfully',
      count: directory.length
    });
  } catch (err: any) {
    console.error('[API /api/staff] POST error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update directory' },
      { status: 500 }
    );
  }
}
