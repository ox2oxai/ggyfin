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
    const branch = body.branch || body;

    if (!branch || !branch.solId || !branch.name) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: solId and name are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('branches')
      .upsert({
        sol_id: String(branch.solId).trim(),
        name: String(branch.name).trim(),
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
  } catch (err) {
    console.error('[API /api/branches] POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
