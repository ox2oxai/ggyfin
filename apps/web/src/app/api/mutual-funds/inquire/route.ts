import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { MutualFundInquirySchema } from '@nbfc/shared';

export const dynamic = 'force-dynamic';

function resolveFilePath(): string {
  const fromRoot = path.join(process.cwd(), 'apps', 'web', 'data', 'mutual-funds-inquiries.json');
  if (fs.existsSync(fromRoot)) return fromRoot;

  const fromWeb = path.join(process.cwd(), 'data', 'mutual-funds-inquiries.json');
  if (fs.existsSync(fromWeb)) return fromWeb;

  if (fs.existsSync(path.join(process.cwd(), 'apps', 'web'))) {
    return fromRoot;
  }
  return fromWeb;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = MutualFundInquirySchema.safeParse(body);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || 'Invalid inquiry details';
      return NextResponse.json({ success: false, message: issue }, { status: 400 });
    }

    const validData = parseResult.data;
    const ticketRef = `MF-ARN-${Date.now().toString().slice(-6)}`;
    const newInquiry = {
      ticketRef,
      ...validData,
      submittedAt: new Date().toISOString(),
      status: 'OPEN_PENDING_ADVISORY'
    };

    const filePath = resolveFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let list: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        list = JSON.parse(raw);
        if (!Array.isArray(list)) list = [];
      } catch {}
    }

    list.unshift(newInquiry);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      ticketRef,
      message: `Inquiry registered successfully under reference ${ticketRef}. Our AMFI-registered mutual fund distributor desk will assist you shortly.`
    });
  } catch (err: any) {
    console.error('[API /api/mutual-funds/inquire] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to record inquiry. Please retry.' },
      { status: 500 }
    );
  }
}
