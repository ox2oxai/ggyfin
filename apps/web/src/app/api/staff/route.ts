import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../lib/supabase';
import bcrypt from 'bcryptjs';

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
    const supabase = getSupabaseAdminClient();

    // Query existing users so existing bcrypt password_hashes are never lost or overwritten
    const { data: existingUsers } = await supabase
      .from('users')
      .select('username, password_hash');
    
    const existingMap = new Map<string, string>();
    if (Array.isArray(existingUsers)) {
      existingUsers.forEach((u) => {
        if (u.username && u.password_hash) {
          existingMap.set(u.username.toLowerCase(), u.password_hash);
        }
      });
    }

    const defaultHash = await bcrypt.hash('GGYSecurePassword@2026', 10);

    // Check if payload is batch array: { directory: [...] } or [...]
    const rawList = Array.isArray(body) ? body : Array.isArray(body.directory) ? body.directory : null;

    if (rawList && rawList.length > 0) {
      const recordsToUpsert = [];
      for (const item of rawList) {
        if (!item || !item.username || !item.role) continue;
        const uname = String(item.username).trim().toLowerCase();
        let pwdHash = item.passwordHash;
        if (!pwdHash) {
          pwdHash = existingMap.get(uname) || (item.password ? await bcrypt.hash(item.password, 10) : defaultHash);
        }

        recordsToUpsert.push({
          staff_number: item.staffNumber ? String(item.staffNumber).trim() : undefined,
          username: uname,
          full_name: item.fullName || 'Staff Member',
          email: item.email || `${uname}@ggyfinance.in`,
          phone: item.phone || '9800000000',
          password_hash: pwdHash,
          role: item.role,
          branch_code: item.branchCode || '2020',
          is_active: item.isActive !== false,
          updated_at: new Date().toISOString()
        });
      }

      if (recordsToUpsert.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No valid staff records found in payload' },
          { status: 400, headers: NO_CACHE_HEADERS }
        );
      }

      const { data, error } = await supabase
        .from('users')
        .upsert(recordsToUpsert, { onConflict: 'username' })
        .select('id, staff_number, username, full_name, email, phone, role, branch_code, is_active, created_at');

      if (error) {
        console.error('[API /api/staff] Batch upsert error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
      }

      const directory = (data || []).map((u) => ({
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

      return NextResponse.json(
        { success: true, message: 'Staff directory saved to Supabase', directory },
        { headers: NO_CACHE_HEADERS }
      );
    }

    // Single staff object payload: { staff: {...} } or {...}
    const staff = body.staff || body;
    if (!staff || !staff.username || !staff.role) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: username and role are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const uname = String(staff.username).trim().toLowerCase();
    let pwdHash = staff.passwordHash;
    if (!pwdHash) {
      pwdHash = existingMap.get(uname) || (staff.password ? await bcrypt.hash(staff.password, 10) : defaultHash);
    }

    const { data, error } = await supabase
      .from('users')
      .upsert({
        staff_number: staff.staffNumber ? String(staff.staffNumber).trim() : undefined,
        username: uname,
        full_name: staff.fullName || 'Staff Member',
        email: staff.email || `${uname}@ggyfinance.in`,
        phone: staff.phone || '9800000000',
        password_hash: pwdHash,
        role: staff.role,
        branch_code: staff.branchCode || '2020',
        is_active: staff.isActive !== false,
        updated_at: new Date().toISOString()
      }, { onConflict: 'username' })
      .select('id, staff_number, username, full_name, email, phone, role, branch_code, is_active, created_at');

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }

    const savedStaff = data?.[0] ? {
      id: data[0].id,
      staffNumber: data[0].staff_number,
      username: data[0].username,
      fullName: data[0].full_name,
      email: data[0].email,
      phone: data[0].phone,
      role: data[0].role,
      branchCode: data[0].branch_code,
      isActive: data[0].is_active,
      createdAt: data[0].created_at
    } : null;

    return NextResponse.json(
      { success: true, message: 'Staff member saved to Supabase', staff: savedStaff },
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
