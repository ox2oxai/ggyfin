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
      .from('credit_schemes')
      .select('*')
      .order('scheme_code', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      const schemes = data.map((s) => ({
        id: s.id,
        schemeCode: s.scheme_code,
        name: s.name,
        minAmount: Number(s.min_amount),
        maxAmount: Number(s.max_amount),
        interestRate: Number(s.interest_rate),
        defaultTenureMonths: Number(s.default_tenure_months),
        minTenureMonths: Number(s.min_tenure_months),
        maxTenureMonths: Number(s.max_tenure_months),
        frequency: s.frequency,
        purpose: s.purpose,
        isActive: s.is_active
      }));
      return NextResponse.json({ success: true, schemes }, { headers: NO_CACHE_HEADERS });
    }
  } catch (err) {
    console.error('[API /api/schemes] Supabase read error:', err);
  }

  return NextResponse.json({ success: true, schemes: [] }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scheme = body.scheme || body;

    if (!scheme || !scheme.schemeCode || !scheme.name) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: schemeCode and name are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('credit_schemes')
      .upsert({
        scheme_code: String(scheme.schemeCode).trim(),
        name: String(scheme.name).trim(),
        min_amount: String(scheme.minAmount || 10000),
        max_amount: String(scheme.maxAmount || 50000),
        interest_rate: String(scheme.interestRate || 12.0),
        default_tenure_months: Number(scheme.defaultTenureMonths || 12),
        min_tenure_months: Number(scheme.minTenureMonths || 6),
        max_tenure_months: Number(scheme.maxTenureMonths || 24),
        frequency: scheme.frequency || 'MONTHLY',
        purpose: scheme.purpose || 'Working capital and micro-enterprise development',
        is_active: scheme.isActive !== false,
        updated_at: new Date().toISOString()
      }, { onConflict: 'scheme_code' })
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Scheme saved to Supabase', scheme: data?.[0] },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error('[API /api/schemes] POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
