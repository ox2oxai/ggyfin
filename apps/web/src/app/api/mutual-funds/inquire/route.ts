import { NextResponse } from 'next/server';
import { MutualFundInquirySchema } from '@nbfc/shared';
import { getSupabaseAdminClient } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

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

    // Store inquiry directly in Supabase audit_logs
    try {
      const supabase = getSupabaseAdminClient();
      await supabase.from('audit_logs').insert({
        action: 'MUTUAL_FUND_INVESTOR_INQUIRY',
        entity_type: 'MUTUAL_FUND_INQUIRY',
        entity_id: ticketRef,
        category: 'WEALTH_INQUIRY',
        details: newInquiry,
        user_role: 'PUBLIC_INVESTOR',
        ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
        user_agent: request.headers.get('user-agent') || 'Web Portal'
      });
    } catch (dbErr) {
      console.error('[API /api/mutual-funds/inquire] Supabase insert warning:', dbErr);
    }

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
