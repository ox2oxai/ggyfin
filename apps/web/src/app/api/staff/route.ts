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
      .from('users')
      .select('id, staff_number, username, full_name, email, phone, role, branch_code, is_active, created_at')
      .order('staff_number', { ascending: true });

    if (!error && Array.isArray(data)) {
      const directory = data.map((u) => ({
        id: u.id,
        staffNumber: u.staff_number,
        username: u.username,
        fullName: u.full_name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        branchCode: u.branch_code,
        isActive: u.is_active,
        createdAt: u.created_at
      }));

      return NextResponse.json({ success: true, directory }, { headers: NO_CACHE_HEADERS });
    }
  } catch (err) {
    console.error('[API /api/staff] Supabase read error:', err);
  }

  return NextResponse.json({ success: true, directory: [] }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const staff = body.staff || body;

    if (!staff || !staff.username || !staff.role) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: username and role are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('users')
      .upsert({
        staff_number: staff.staffNumber ? String(staff.staffNumber).trim() : undefined,
        username: String(staff.username).trim().toLowerCase(),
        full_name: staff.fullName || 'Staff Member',
        email: staff.email || `${staff.username}@ggyfinance.in`,
        phone: staff.phone || '9800000000',
        password_hash: staff.passwordHash || '$2a$10$wJ1j0F/7J2U5cO3Z5c.mmeR/aW85J7qK8K6G6U4q1K0l3Z5c.mme',
        role: staff.role,
        branch_code: staff.branchCode || '2020',
        is_active: staff.isActive !== false,
        updated_at: new Date().toISOString()
      }, { onConflict: 'username' })
      .select('id, staff_number, username, full_name, email, role, branch_code, is_active');

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Staff member saved to Supabase', staff: data?.[0] },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error('[API /api/staff] POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
