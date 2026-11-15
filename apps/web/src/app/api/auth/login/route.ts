import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../../lib/supabase';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = String(body.identifier || body.username || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Staff identifier and password are required.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const supabase = getSupabaseAdminClient();

    // Query user by username, numeric staff_number, or institutional email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, staff_number, username, full_name, email, phone, password_hash, role, branch_code, is_active')
      .or(`username.ilike.${identifier},staff_number.eq.${identifier},email.ilike.${identifier}`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[API /api/auth/login] Supabase user query error:', error);
      return NextResponse.json(
        { success: false, message: 'Authentication service temporarily unavailable. Please retry.' },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Staff username, staff ID, or email not found in directory.' },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    if (!user.is_active) {
      // Record security event
      await supabase.from('audit_logs').insert({
        action: 'SUSPENDED_LOGIN_BLOCKED',
        entity_type: 'STAFF_USER',
        entity_id: user.staff_number || user.username,
        user_id: user.id,
        user_role: user.role,
        category: 'SECURITY_EVENT',
        details: { message: `Blocked login attempt by suspended staff account @${user.username}` },
        ip_address: '127.0.0.1'
      });

      return NextResponse.json(
        { success: false, message: 'Your account access has been suspended by the Super IT Admin. Please contact IT support.' },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    // Cryptographic Password Verification
    const passwordMatch = await bcrypt.compare(password, user.password_hash || '');

    if (!passwordMatch) {
      // Record security event
      await supabase.from('audit_logs').insert({
        action: 'FAILED_LOGIN_ATTEMPT',
        entity_type: 'STAFF_USER',
        entity_id: user.staff_number || user.username,
        user_id: user.id,
        user_role: user.role,
        category: 'SECURITY_EVENT',
        details: { message: `Failed authentication attempt for @${user.username}: Invalid password` },
        ip_address: '127.0.0.1'
      });

      return NextResponse.json(
        { success: false, message: 'Invalid password. Please verify your credentials.' },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    // Record successful login audit log
    await supabase.from('audit_logs').insert({
      action: 'USER_LOGIN',
      entity_type: 'STAFF_USER',
      entity_id: user.staff_number || user.username,
      user_id: user.id,
      user_role: user.role,
      category: user.role === 'SUPER_ADMIN_IT' ? 'INTENDED_ADMIN_UPDATE' : 'OPERATIONAL_BANKING_EVENT',
      details: { message: `Staff user @${user.username} (${user.full_name}) authenticated into ${user.role} workspace` },
      ip_address: '127.0.0.1'
    });

    const mustReset = user.username === 'ngyaragatti';

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        staffNumber: user.staff_number || '202010',
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        branchCode: user.branch_code || '2020'
      },
      mustResetPassword: mustReset
    }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('[API /api/auth/login] Internal error:', err);
    return NextResponse.json(
      { success: false, message: 'An unexpected authentication error occurred. Please try again.' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
