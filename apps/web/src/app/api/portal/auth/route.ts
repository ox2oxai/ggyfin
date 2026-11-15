import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = String(body.identifier || '').trim();

    if (!identifier) {
      return NextResponse.json({ success: false, message: 'Please provide Customer ID (CIF) or Account Number' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // Look up customer by CIF, or look up account by account number
    let customer: any = null;

    // 1. Try match by CIF or Phone
    const { data: custData } = await supabase
      .from('customers')
      .select(`
        id,
        cif_number,
        full_name,
        phone,
        address_line,
        pincode,
        state,
        created_at,
        accounts (
          id,
          account_number,
          account_type,
          status,
          current_balance,
          loan_details (
            loan_purpose,
            principal_amount,
            interest_rate_percent,
            tenure_months,
            emi_amount,
            disbursed_at
          )
        )
      `)
      .or(`cif_number.ilike.%${identifier}%,phone.eq.${identifier}`)
      .limit(1)
      .maybeSingle();

    if (custData) {
      customer = custData;
    } else {
      // 2. Try match by Account Number
      const { data: accData } = await supabase
        .from('accounts')
        .select(`
          id,
          account_number,
          customers (
            id,
            cif_number,
            full_name,
            phone,
            address_line,
            pincode,
            state,
            created_at,
            accounts (
              id,
              account_number,
              account_type,
              status,
              current_balance,
              loan_details (
                loan_purpose,
                principal_amount,
                interest_rate_percent,
                tenure_months,
                emi_amount,
                disbursed_at
              )
            )
          )
        `)
        .eq('account_number', identifier)
        .limit(1)
        .maybeSingle();

      if (accData?.customers) {
        customer = Array.isArray(accData.customers) ? accData.customers[0] : accData.customers;
      }
    }

    if (!customer) {
      return NextResponse.json({
        success: false,
        message: 'No borrower record found for this Customer ID (CIF) or Account Number. Please verify your details or contact your branch.'
      }, { status: 404 });
    }

    const customerAccounts = customer.accounts || [];
    const activeAccount = customerAccounts.find((a: any) => a.status === 'ACTIVE') || customerAccounts[0] || null;
    const loan = activeAccount?.loan_details ? (Array.isArray(activeAccount.loan_details) ? activeAccount.loan_details[0] : activeAccount.loan_details) : null;

    // Fetch recent ledger transactions for active account if exists
    let recentTransactions: any[] = [];
    if (activeAccount?.id) {
      const { data: txns } = await supabase
        .from('transactions')
        .select('id, txn_ref_number, txn_type, mode, amount, balance_after, notes, created_at')
        .eq('account_id', activeAccount.id)
        .order('created_at', { ascending: false })
        .limit(10);

      recentTransactions = (txns || []).map((t: any) => ({
        id: t.id,
        date: t.created_at,
        type: t.txn_type === 'CREDIT' ? 'REPAYMENT' : 'DISBURSEMENT',
        mode: t.mode,
        amount: Number(t.amount),
        balanceAfter: Number(t.balance_after),
        utr: t.txn_ref_number,
        remarks: t.notes || ''
      }));
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: customer.id,
        cifNumber: customer.cif_number,
        fullName: customer.full_name,
        phone: customer.phone,
        address: customer.address_line,
        taluk: customer.address_line,
        state: customer.state,
        pincode: customer.pincode,
        joinedAt: customer.created_at,
        activeAccount: activeAccount ? {
          id: activeAccount.id,
          accountNumber: activeAccount.account_number,
          type: activeAccount.account_type,
          status: activeAccount.status,
          currentBalance: Number(activeAccount.current_balance || 0),
          loanPurpose: loan?.loan_purpose || 'Rural Credit Facility',
          principal: Number(loan?.principal_amount || activeAccount.current_balance || 0),
          interestRate: Number(loan?.interest_rate_percent || 12.0),
          tenureMonths: Number(loan?.tenure_months || 12),
          emiAmount: Number(loan?.emi_amount || 0),
          disbursedAt: loan?.disbursed_at
        } : null,
        accounts: customerAccounts.map((a: any) => {
          const l = a.loan_details ? (Array.isArray(a.loan_details) ? a.loan_details[0] : a.loan_details) : null;
          return {
            accountNumber: a.account_number,
            product: l?.loan_purpose || 'Rural Credit Facility',
            sanctionAmount: Number(l?.principal_amount || a.current_balance || 0),
            balance: Number(a.current_balance || 0),
            monthlyEmi: Number(l?.emi_amount || Math.round(Number(a.current_balance || 0) / 12)),
            nextDueDate: '2026-12-05',
            status: a.status === 'CLOSED' ? 'CLOSED' : 'ACTIVE'
          };
        }),
        recentTransactions
      }
    });
  } catch (err: any) {
    console.error('[API /api/portal/auth POST] Error:', err);
    return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 500 });
  }
}
