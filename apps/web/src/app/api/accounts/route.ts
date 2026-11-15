import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../lib/supabase';
import { generateCBSAccountNumber, generateCustomerId } from '@nbfc/shared';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0'
};

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let query = supabase
      .from('accounts')
      .select(`
        id,
        account_number,
        account_type,
        status,
        current_balance,
        approved_by_user_id,
        approved_at,
        created_at,
        customers (
          id,
          cif_number,
          full_name,
          phone,
          address_line,
          pincode,
          state
        ),
        loan_details (
          loan_purpose,
          principal_amount,
          interest_rate_percent,
          tenure_months,
          emi_amount,
          disbursed_amount,
          disbursed_at
        )
      `)
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'ALL') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API /api/accounts GET] Supabase query error:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
    }

    const accounts = (data || []).map((acc: any) => {
      const cust = Array.isArray(acc.customers) ? acc.customers[0] : acc.customers;
      const loan = Array.isArray(acc.loan_details) ? acc.loan_details[0] : acc.loan_details;

      return {
        id: acc.id,
        accountNumber: acc.account_number,
        customerId: cust?.cif_number || 'CIF-PENDING',
        borrowerName: cust?.full_name || 'Borrower',
        phone: cust?.phone || '',
        taluk: cust?.address_line || 'Karnataka SOL',
        address: cust?.address_line || '',
        maskedAadhaar: 'XXXX-XXXX-8421',
        product: loan?.loan_purpose || 'Micro-Enterprise Facility',
        principal: Number(loan?.principal_amount || acc.current_balance || 0),
        balance: Number(acc.current_balance || 0),
        interestRate: Number(loan?.interest_rate_percent || 12.0),
        tenureMonths: Number(loan?.tenure_months || 12),
        emiAmount: Number(loan?.emi_amount || 0),
        status: acc.status,
        approvedByUserId: acc.approved_by_user_id,
        approvedAt: acc.approved_at,
        disbursedAt: loan?.disbursed_at,
        createdAt: acc.created_at
      };
    });

    return NextResponse.json({ success: true, accounts }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('[API /api/accounts GET] Internal error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch CBS accounts' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || 'CREATE_APPLICATION';
    const supabase = getSupabaseAdminClient();

    if (action === 'CREATE_APPLICATION') {
      const {
        borrowerName,
        phone,
        taluk,
        address,
        product,
        principal,
        interestRate,
        tenureMonths,
        branchCode,
        makerId
      } = body;

      if (!borrowerName || !phone || !principal) {
        return NextResponse.json({ success: false, message: 'Missing required applicant details' }, { status: 400 });
      }

      const cifNumber = generateCustomerId();
      const { data: newCust, error: custErr } = await supabase.from('customers').insert({
        cif_number: cifNumber,
        full_name: borrowerName.trim(),
        phone: String(phone).trim(),
        dob: '1988-06-15',
        gender: 'FEMALE',
        address_line: address || (taluk ? `${taluk}, Karnataka` : 'Karnataka Rural Operational Zone'),
        pincode: '571428',
        state: 'Karnataka',
        consent_granted: true
      }).select().single();

      if (custErr || !newCust) {
        return NextResponse.json({ success: false, message: custErr?.message || 'Customer creation failed' }, { status: 500 });
      }

      // Generate 16-digit CBS Core Banking Account Number with embedded Mod-11
      const sol = branchCode || '2020';
      const cbsAccountNo = generateCBSAccountNumber(sol, '701');

      const { data: newAcc, error: accErr } = await supabase.from('accounts').insert({
        account_number: cbsAccountNo,
        customer_id: newCust.id,
        account_type: 'LOAN',
        status: 'PENDING_APPROVAL',
        current_balance: String(principal),
        currency: 'INR'
      }).select().single();

      if (accErr || !newAcc) {
        return NextResponse.json({ success: false, message: accErr?.message || 'CBS account creation failed' }, { status: 500 });
      }

      const emi = Math.round((principal * (1 + (interestRate || 12.0) / 100)) / (tenureMonths || 12));
      await supabase.from('loan_details').insert({
        account_id: newAcc.id,
        loan_purpose: product || 'Kirana & Retail Working Capital',
        principal_amount: String(principal),
        interest_rate_percent: String(interestRate || 12.0),
        tenure_months: tenureMonths || 12,
        emi_amount: String(emi),
        disbursed_amount: '0.00'
      });

      return NextResponse.json({
        success: true,
        message: 'Loan application submitted for Checker approval',
        account: {
          id: newAcc.id,
          accountNumber: newAcc.account_number,
          customerId: cifNumber,
          borrowerName,
          status: 'PENDING_APPROVAL'
        }
      });
    }

    if (action === 'DECIDE_APPROVAL') {
      const { accountId, decision, checkerId, remarks } = body;
      if (!accountId || !decision) {
        return NextResponse.json({ success: false, message: 'Missing accountId or decision' }, { status: 400 });
      }

      const nextStatus = decision === 'APPROVED' ? 'ACTIVE' : 'CLOSED';
      const nowIso = new Date().toISOString();

      const { data: updated, error: updErr } = await supabase
        .from('accounts')
        .update({
          status: nextStatus,
          approved_by_user_id: checkerId || null,
          approved_at: nowIso
        })
        .eq('id', accountId)
        .select()
        .single();

      if (updErr) {
        return NextResponse.json({ success: false, message: updErr.message }, { status: 500 });
      }

      if (decision === 'APPROVED') {
        // Disburse loan
        const { data: loan } = await supabase
          .from('loan_details')
          .select('principal_amount')
          .eq('account_id', accountId)
          .single();

        await supabase
          .from('loan_details')
          .update({
            disbursed_amount: loan?.principal_amount || '50000.00',
            disbursed_at: nowIso
          })
          .eq('account_id', accountId);

        // Record initial ledger transaction for disbursement
        const disburseRef = `DISB-${Date.now().toString().slice(-8)}`;
        await supabase.from('transactions').insert({
          account_id: accountId,
          txn_ref_number: disburseRef,
          txn_type: 'DEBIT',
          mode: 'BANK_TRANSFER',
          amount: String(loan?.principal_amount || '50000.00'),
          balance_after: String(loan?.principal_amount || '50000.00'),
          notes: `Loan sanctioned and disbursed by Authorizer. Ref: ${disburseRef}`
        });
      }

      return NextResponse.json({
        success: true,
        message: `Application ${decision.toLowerCase()} successfully`,
        account: updated
      });
    }

    if (action === 'UPDATE_STATUS') {
      const { accountId, status, reason } = body;
      if (!accountId || !status) {
        return NextResponse.json({ success: false, message: 'Missing accountId or status' }, { status: 400 });
      }

      const updateData: any = { status };
      if (status === 'CLOSED') {
        updateData.current_balance = '0.00';
      }

      const { data: updated, error: updErr } = await supabase
        .from('accounts')
        .update(updateData)
        .eq('id', accountId)
        .select()
        .single();

      if (updErr) {
        return NextResponse.json({ success: false, message: updErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Account status updated to ${status}`,
        account: updated
      });
    }

    if (action === 'DELETE_APPLICATION') {
      const { accountId } = body;
      if (!accountId) {
        return NextResponse.json({ success: false, message: 'Missing accountId' }, { status: 400 });
      }

      await supabase.from('loan_details').delete().eq('account_id', accountId);
      const { error: delErr } = await supabase.from('accounts').delete().eq('id', accountId);

      if (delErr) {
        return NextResponse.json({ success: false, message: delErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Application deleted successfully'
      });
    }

    return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('[API /api/accounts POST] Error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
