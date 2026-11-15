import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0'
};

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('sol_id', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      const branches = data.map((b) => ({
        id: b.id,
        solId: b.sol_id,
        branchCode: b.sol_id,
        name: b.name,
        type: b.type,
        address: b.address,
        manager: b.manager,
        phone: b.phone,
        email: b.email,
        operatingHours: b.operating_hours,
        isActive: b.is_active
      }));
      return NextResponse.json({ success: true, branches }, { headers: NO_CACHE_HEADERS });
    }
  } catch (err) {
    console.error('[API /api/branches] Supabase read error:', err);
  }

  return NextResponse.json({ success: true, branches: [] }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdminClient();

    // Check if payload is batch array: { branches: [...] } or [...]
    const rawList = Array.isArray(body) ? body : Array.isArray(body.branches) ? body.branches : null;

    if (rawList && rawList.length > 0) {
      const recordsToUpsert = rawList.map((b: any) => ({
        sol_id: String(b.solId || b.branchCode).trim(),
        name: String(b.name).trim(),
        type: b.type || 'Standard NBFC SOL',
        address: b.address || '',
        manager: b.manager || '',
        phone: b.phone || '',
        email: b.email || '',
        operating_hours: b.operatingHours || 'Mon - Sat: 9:00 AM - 6:00 PM',
        is_active: b.isActive !== false,
        updated_at: new Date().toISOString()
      })).filter((b: any) => b.sol_id && b.name);

      if (recordsToUpsert.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No valid branch records found in payload' },
          { status: 400, headers: NO_CACHE_HEADERS }
        );
      }

      const { data, error } = await supabase
        .from('branches')
        .upsert(recordsToUpsert, { onConflict: 'sol_id' })
        .select();

      if (error) {
        console.error('[API /api/branches] Batch upsert error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
      }

      const branches = (data || []).map((b) => ({
        id: b.id,
        solId: b.sol_id,
        branchCode: b.sol_id,
        name: b.name,
        type: b.type,
        address: b.address,
        manager: b.manager,
        phone: b.phone,
        email: b.email,
        operatingHours: b.operating_hours,
        isActive: b.is_active
      }));

      return NextResponse.json({ success: true, message: 'Branches saved to Supabase', branches }, { headers: NO_CACHE_HEADERS });
    }

    // Single branch payload
    const branch = body.branch || body;
    const solId = String(branch?.solId || branch?.branchCode || '').trim();
    const name = String(branch?.name || '').trim();

    if (!solId || !name) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: solId and name are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const { data, error } = await supabase
      .from('branches')
      .upsert({
        sol_id: solId,
        name: name,
        type: branch.type || 'Standard NBFC SOL',
        address: branch.address || '',
        manager: branch.manager || '',
        phone: branch.phone || '',
        email: branch.email || '',
        operating_hours: branch.operatingHours || 'Mon - Sat: 9:00 AM - 6:00 PM',
        is_active: branch.isActive !== false,
        updated_at: new Date().toISOString()
      }, { onConflict: 'sol_id' })
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Branch saved to Supabase', branch: data?.[0] },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error('[API /api/branches] POST error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
