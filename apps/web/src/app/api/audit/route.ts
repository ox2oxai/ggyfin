import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
};

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && Array.isArray(data)) {
      const audits = data.map((log) => {
        const payload = (log.payload_after && typeof log.payload_after === 'object') ? log.payload_after : {};
        const detailsVal = payload.details 
          ? (typeof payload.details === 'string' ? payload.details : (payload.details.message || JSON.stringify(payload.details)))
          : (typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {}));

        return {
          id: String(log.id),
          timestamp: log.created_at,
          actor: payload.actorUsername || payload.userRole || 'SYSTEM',
          userId: log.user_id,
          action: log.action,
          resource: log.entity_type,
          resourceId: log.entity_id,
          category: log.category || payload.category || 'OPERATIONAL_BANKING_EVENT',
          actorStaffNumber: payload.actorStaffNumber || '202010',
          actorUsername: payload.actorUsername || 'system',
          actorRole: payload.userRole || 'SYSTEM',
          target: payload.target || log.entity_id || log.entity_type || 'SYSTEM',
          details: detailsVal || 'System event recorded',
          ip: log.ip_address || '127.0.0.1',
          severity: 'INFO'
        };
      });
      return NextResponse.json({ success: true, audits, events: audits }, { headers: NO_CACHE_HEADERS });
    }
  } catch (err) {
    console.error('[API /api/audit] Supabase read error:', err);
  }

  return NextResponse.json({ success: true, audits: [], events: [] }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = body.event || body;

    if (!event || !event.action) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: action is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const supabase = getSupabaseAdminClient();
    const payloadAfter = {
      ...(event.payload_after || {}),
      userRole: event.actor || event.userRole || 'SYSTEM_ADMIN',
      actorStaffNumber: event.actorStaffNumber || '202010',
      actorUsername: event.actorUsername || 'system',
      target: event.target || event.entityId || 'SYSTEM',
      details: typeof event.details === 'object' ? event.details : { message: event.details || '' }
    };

    const insertPayload: any = {
      action: event.action,
      entity_type: event.resource || event.entityType || 'SYSTEM_MODULE',
      entity_id: event.resourceId || event.entityId || 'SYS-01',
      user_id: event.userId || null,
      ip_address: event.ip || '127.0.0.1',
      user_agent: event.userAgent || 'GGYF-Web-Portal',
      payload_after: payloadAfter,
      category: event.category || 'OPERATIONAL_BANKING_EVENT'
    };

    const { data, error } = await supabase.from('audit_logs').insert(insertPayload).select();

    if (error) {
      console.warn('[API /api/audit] Supabase insert warning:', error.message);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Audit event logged to Supabase', audit: data?.[0] },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error('[API /api/audit] POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
