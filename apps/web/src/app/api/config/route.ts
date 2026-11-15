import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0'
};

const DEFAULT_CONFIG = {
  organizationName: 'GGY Finance Ltd',
  platformTagline: 'National Micro-Lending Platform • Direct Doorstep Credit',
  registrationNumber: 'NBFC-ND/2026/7742',
  supportEmail: 'support@ggyfinance.in',
  supportPhone: '1800-889-2020',
  nodalOfficerName: 'Smt. Anita Deshmukh',
  nodalOfficerContact: 'grievance@ggyfinance.in • 080-28491001',
  headOfficeAddress: '#104, Institutional Financial Zone, Outer Ring Road, Bengaluru - 560001',
  logoUrl: '',
  upiVpa: 'ggycollect@icici',
  upiPayeeName: 'GGY Finance Ltd',
  upiMerchantCode: '6012',
  upiAccountNumber: '1084-0101-702-0039-4',
  qrImageUrl: '',
  enablePublicQr: true,
  collectionInstructions: 'Scan using BHIM UPI, Google Pay, PhonePe, or Paytm. Specify your Loan Account Number in remarks for instant automated ledger credit.'
};

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('institution_config')
      .select('*')
      .eq('id', 'PRIMARY_CONFIG')
      .maybeSingle();

    if (!error && data) {
      const config = {
        organizationName: data.organization_name || DEFAULT_CONFIG.organizationName,
        platformTagline: data.platform_tagline || DEFAULT_CONFIG.platformTagline,
        registrationNumber: data.registration_number || DEFAULT_CONFIG.registrationNumber,
        supportEmail: data.support_email || DEFAULT_CONFIG.supportEmail,
        supportPhone: data.support_phone || DEFAULT_CONFIG.supportPhone,
        nodalOfficerName: data.nodal_officer_name || DEFAULT_CONFIG.nodalOfficerName,
        nodalOfficerContact: data.nodal_officer_contact || DEFAULT_CONFIG.nodalOfficerContact,
        headOfficeAddress: data.head_office_address || DEFAULT_CONFIG.headOfficeAddress,
        logoUrl: data.logo_url || DEFAULT_CONFIG.logoUrl,
        upiVpa: data.upi_vpa || DEFAULT_CONFIG.upiVpa,
        upiPayeeName: data.upi_payee_name || DEFAULT_CONFIG.upiPayeeName,
        upiMerchantCode: data.upi_merchant_code || DEFAULT_CONFIG.upiMerchantCode,
        upiAccountNumber: data.upi_account_number || DEFAULT_CONFIG.upiAccountNumber,
        qrImageUrl: data.qr_image_url || DEFAULT_CONFIG.qrImageUrl,
        enablePublicQr: data.enable_public_qr ?? DEFAULT_CONFIG.enablePublicQr,
        collectionInstructions: data.collection_instructions || DEFAULT_CONFIG.collectionInstructions
      };
      return NextResponse.json({ success: true, config }, { headers: NO_CACHE_HEADERS });
    }
  } catch (err) {
    console.error('[API /api/config] Supabase read error:', err);
  }

  return NextResponse.json({ success: true, config: DEFAULT_CONFIG }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = body.config;

    if (!config || typeof config !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid configuration payload' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const merged = { ...DEFAULT_CONFIG, ...config };
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase.from('institution_config').upsert({
      id: 'PRIMARY_CONFIG',
      organization_name: merged.organizationName,
      platform_tagline: merged.platformTagline,
      registration_number: merged.registrationNumber,
      support_email: merged.supportEmail,
      support_phone: merged.supportPhone,
      nodal_officer_name: merged.nodalOfficerName,
      nodal_officer_contact: merged.nodalOfficerContact,
      head_office_address: merged.headOfficeAddress,
      logo_url: merged.logoUrl,
      upi_vpa: merged.upiVpa,
      upi_payee_name: merged.upiPayeeName,
      upi_merchant_code: merged.upiMerchantCode,
      upi_account_number: merged.upiAccountNumber,
      qr_image_url: merged.qrImageUrl,
      enable_public_qr: merged.enablePublicQr ?? true,
      collection_instructions: merged.collectionInstructions,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error('[API /api/config] Supabase upsert error:', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Configuration saved directly to Supabase', config: merged },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error('[API /api/config] POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
