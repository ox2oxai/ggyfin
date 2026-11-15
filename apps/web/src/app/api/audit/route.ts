import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function resolveFilePath(): string {
  const fromRoot = path.join(process.cwd(), 'apps', 'web', 'data', 'audit-trail.json');
  if (fs.existsSync(fromRoot)) return fromRoot;

  const fromWeb = path.join(process.cwd(), 'data', 'audit-trail.json');
  if (fs.existsSync(fromWeb)) return fromWeb;

  if (fs.existsSync(path.join(process.cwd(), 'apps', 'web'))) {
    return fromRoot;
  }
  return fromWeb;
}

function readAudits(): any[] {
  const filePath = resolveFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('[API /api/audit] Error reading audit-trail.json:', err);
  }
  return [];
}

export async function GET() {
  const audits = readAudits();
  return NextResponse.json(
    { success: true, audits },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = resolveFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const currentAudits = readAudits();
    let updatedAudits: any[] = [];

    if (body.event && typeof body.event === 'object') {
      updatedAudits = [body.event, ...currentAudits];
    } else if (Array.isArray(body.audits)) {
      updatedAudits = body.audits;
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: event or audits required' },
        { status: 400 }
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(updatedAudits, null, 2), 'utf-8');

    return NextResponse.json(
      { success: true, count: updatedAudits.length },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        }
      }
    );
  } catch (err) {
    console.error('[API /api/audit] Failed to write audit trail:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to record audit log' },
      { status: 500 }
    );
  }
}
