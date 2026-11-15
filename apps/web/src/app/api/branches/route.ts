import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DEFAULT_BRANCHES = [
  {
    branchCode: '2020',
    solId: '2020',
    name: 'Headquarters & Primary Branch',
    type: 'Head Office & Principal SOL',
    address: '#104, Institutional Financial Zone, Outer Ring Road, Bengaluru - 560001',
    manager: 'Sri Suresh Hegde (Branch Head)',
    phone: '080-28491001',
    email: 'branch2020@ggyfinance.in',
    operatingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    isActive: true
  }
];

function resolvePath(): string {
  const p1 = path.join(process.cwd(), 'apps', 'web', 'data', 'branches.json');
  if (fs.existsSync(p1) || fs.existsSync(path.join(process.cwd(), 'apps', 'web'))) {
    return p1;
  }
  return path.join(process.cwd(), 'data', 'branches.json');
}

export async function GET() {
  const filePath = resolvePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return NextResponse.json({ success: true, branches: parsed });
      }
    }
  } catch (err) {
    console.error('[API /api/branches] Read error:', err);
  }

  return NextResponse.json({ success: true, branches: DEFAULT_BRANCHES });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const branches = body.branches;

    if (!Array.isArray(branches)) {
      return NextResponse.json({ success: false, message: 'Invalid payload: branches must be an array' }, { status: 400 });
    }

    const filePath = resolvePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(branches, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Branch network updated successfully',
      count: branches.length
    });
  } catch (err: any) {
    console.error('[API /api/branches] POST error:', err);
    return NextResponse.json({ success: false, message: err?.message || 'Failed to update branches' }, { status: 500 });
  }
}
