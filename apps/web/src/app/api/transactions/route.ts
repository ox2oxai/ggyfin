import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0'
};

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        txn_ref_number,
        txn_type,
        mode,
        amount,
        balance_after,
        notes,
        created_at,
        accounts (
          id,
          account_number,
          customers (
            cif_number,
            full_name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(150);

    if (error) {
      console.error('[API /api/transactions GET] Supabase error:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
    }

    const transactions = (data || []).map((txn: any) => {
      const acc = Array.isArray(txn.accounts) ? txn.accounts[0] : txn.accounts;
      const cust = acc?.customers ? (Array.isArray(acc.customers) ? acc.customers[0] : acc.customers) : null;
      const isCredit = txn.txn_type === 'CREDIT';

      let displayType = 'DISBURSEMENT';
      if (isCredit) {
        displayType = txn.mode === 'UPI' ? 'UPI_REPAYMENT' : 'CASH_COLLECTION';
      }

      return {
        id: txn.id,
        timestamp: txn.created_at,
        referenceId: txn.txn_ref_number,
        accountNumber: acc?.account_number || 'CBS-LEDGER',
        customerId: cust?.cif_number || 'CIF-LEDGER',
        borrowerName: cust?.full_name || 'Borrower',
        type: displayType,
        debit: isCredit ? 0 : Number(txn.amount),
        credit: isCredit ? Number(txn.amount) : 0,
        balanceAfter: Number(txn.balance_after),
        status: 'SETTLED',
        remarks: txn.notes || ''
      };
    });

    return NextResponse.json({ success: true, transactions }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('[API /api/transactions GET] Internal error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch ledger' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountNumber, amount, mode, utrNumber, remarks, makerId } = body;

    if (!accountNumber || !amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid repayment details' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // 1. Fetch current account
    const { data: acc, error: accErr } = await supabase
      .from('accounts')
      .select('id, current_balance, status')
      .eq('account_number', accountNumber.trim())
      .single();

    if (accErr || !acc) {
      return NextResponse.json({ success: false, message: 'Account not found' }, { status: 404 });
    }

    const currentBal = Number(acc.current_balance);
    const payAmt = Number(amount);
    const newBal = Math.max(0, currentBal - payAmt);
    const paymentMode = (mode || 'UPI').toUpperCase();
    const validModes = ['UPI', 'CASH', 'NEFT_IMPS', 'BANK_TRANSFER'];
    const assignedMode = validModes.includes(paymentMode) ? paymentMode : 'UPI';
    const txnRef = utrNumber || `TXN-${Date.now().toString().slice(-8)}`;

    // 2. Insert ledger transaction (Credit reduces borrower loan liability)
    const { data: txn, error: txnErr } = await supabase.from('transactions').insert({
      account_id: acc.id,
      txn_ref_number: txnRef,
      txn_type: 'CREDIT',
      mode: assignedMode,
      amount: String(payAmt),
      balance_after: String(newBal),
      notes: remarks || `Repayment received via ${assignedMode}`
    }).select().single();

    if (txnErr) {
      return NextResponse.json({ success: false, message: txnErr.message }, { status: 500 });
    }

    // 3. Update account balance
    await supabase.from('accounts').update({
      current_balance: String(newBal),
      status: newBal === 0 ? 'CLOSED' : acc.status
    }).eq('id', acc.id);

    return NextResponse.json({
      success: true,
      message: `Repayment of ₹${payAmt.toLocaleString('en-IN')} recorded successfully`,
      transaction: txn,
      balanceAfter: newBal
    });
  } catch (err: any) {
    console.error('[API /api/transactions POST] Error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
