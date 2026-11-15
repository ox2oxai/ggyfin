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
    const currentPassword = String(body.currentPassword || '');
    const newPassword = String(body.newPassword || '');

    if (!identifier || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Staff identifier and new password are required.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // Password Complexity Validation (GEMINI.md Rule 9)
    if (newPassword.length < 8 || newPassword.length > 128) {
      return NextResponse.json(
        { success: false, message: 'Password must be between 8 and 128 characters.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      return NextResponse.json(
        { success: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    if (currentPassword && currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, message: 'Your new confidential password must be different from your current password.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const supabase = getSupabaseAdminClient();

    // Query user by username, staff number, or email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, staff_number, username, full_name, email, phone, password_hash, role, branch_code, is_active')
      .or(`username.ilike.${identifier},staff_number.eq.${identifier},email.ilike.${identifier}`)
      .limit(1)
      .maybeSingle();

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: 'Staff record not found.' },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    // If current password provided, verify it
    if (currentPassword) {
      const match = await bcrypt.compare(currentPassword, user.password_hash || '');
      if (!match) {
        return NextResponse.json(
          { success: false, message: 'Current password verification failed. Please re-enter your current password.' },
          { status: 401, headers: NO_CACHE_HEADERS }
        );
      }
    }

    // Cryptographically hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password_hash in Supabase
    const { error: updErr } = await supabase
      .from('users')
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updErr) {
      console.error('[API /api/auth/reset-password] Update error:', updErr);
      return NextResponse.json(
        { success: false, message: 'Failed to update password in database.' },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }

    // Record audit log
    await supabase.from('audit_logs').insert({
      action: 'PASSWORD_RESET_COMPLETED',
      entity_type: 'STAFF_USER',
      entity_id: user.staff_number || user.username,
      user_id: user.id,
      user_role: user.role,
      category: 'INTENDED_ADMIN_UPDATE',
      details: { message: `Confidential password rotated by staff member @${user.username}` },
      ip_address: '127.0.0.1'
    });

    return NextResponse.json({
      success: true,
      message: 'Password rotated successfully. You may now authenticate with your new password.',
      user: {
        id: user.id,
        staffNumber: user.staff_number,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
        branchCode: user.branch_code
      }
    }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('[API /api/auth/reset-password] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error processing password rotation.' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
