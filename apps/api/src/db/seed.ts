import { db, pool } from './client.js';
import {
  users,
  customers,
  accounts,
  loanDetails,
  transactions,
  cashReceipts,
  auditLogs,
  userRoleEnum,
  institutionConfig,
  branches,
  creditSchemes
} from './schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AccountStatus, AccountType, LoanPurpose, PaymentMode, ReceiptStatus, TransactionType, calculateEMI } from '@nbfc/shared';

export async function seedDatabase() {
  console.log('[Seed] Starting GGY Finance Karnataka Operations database seeding...');

  try {
    // 1. Seed Institutional Staff Roster (Pure-numeric IDs: 202010 - 202016)
    console.log('[Seed] Seeding institutional staff roster...');
    const defaultPasswordHash = await bcrypt.hash('GGYSecurePassword@2026', 10);
    const superAdminPasswordHash = await bcrypt.hash('GGY#SuperAdminIT@2026!', 10);

    const staffProfiles = [
      {
        staffNumber: '202010',
        username: 'it_superadmin',
        fullName: 'Shiv Yaragatti',
        email: 'it.admin@ggyfinance.in',
        phone: '9800000001',
        passwordHash: superAdminPasswordHash,
        role: 'SUPER_ADMIN_IT' as const,
        branchCode: '2020'
      },
      {
        staffNumber: '202011',
        username: 'ngyaragatti',
        fullName: 'N. G. Yaragatti',
        email: 'ng.yaragatti@ggyfinance.in',
        phone: '9845012399',
        passwordHash: defaultPasswordHash,
        role: 'SYSTEM_ADMIN' as const,
        branchCode: '2020'
      },
      {
        staffNumber: '202012',
        username: 'suresh_hegde',
        fullName: 'Suresh Hegde',
        email: 'suresh.hegde@ggyfinance.in',
        phone: '9845012312',
        passwordHash: defaultPasswordHash,
        role: 'BRANCH_MANAGER' as const,
        branchCode: '2020'
      },
      {
        staffNumber: '202013',
        username: 'roopa_k',
        fullName: 'Roopa K.',
        email: 'roopa.k@ggyfinance.in',
        phone: '9845012313',
        passwordHash: defaultPasswordHash,
        role: 'BRANCH_MANAGER' as const,
        branchCode: '2021'
      },
      {
        staffNumber: '202014',
        username: 'manjunath_s',
        fullName: 'Manjunath Swamy',
        email: 'manjunath.s@ggyfinance.in',
        phone: '9845012314',
        passwordHash: defaultPasswordHash,
        role: 'BRANCH_MANAGER' as const,
        branchCode: '2022'
      },
      {
        staffNumber: '202015',
        username: 'ramesh_kumar',
        fullName: 'Ramesh Kumar',
        email: 'ramesh.k@ggyfinance.in',
        phone: '9845012315',
        passwordHash: defaultPasswordHash,
        role: 'FIELD_OFFICER' as const,
        branchCode: '2021'
      },
      {
        staffNumber: '202016',
        username: 'suresh_naik',
        fullName: 'Suresh Naik',
        email: 'suresh.n@ggyfinance.in',
        phone: '9845012316',
        passwordHash: defaultPasswordHash,
        role: 'FIELD_OFFICER' as const,
        branchCode: '2022'
      }
    ];

    const seededUsers: Record<string, string> = {};

    for (const staff of staffProfiles) {
      const existing = await db.select().from(users).where(eq(users.username, staff.username)).limit(1);
      if (existing.length === 0) {
        const [inserted] = await db.insert(users).values(staff).returning();
        seededUsers[staff.username] = inserted.id;
        console.log(`  + Created user: ${staff.username} (${staff.staffNumber} - ${staff.role})`);
      } else {
        seededUsers[staff.username] = existing[0].id;
        console.log(`  * User exists: ${staff.username} (${existing[0].id})`);
      }
    }

    const superAdminId = seededUsers['it_superadmin'];
    const fieldOfficerId = seededUsers['ramesh_kumar'] || superAdminId;
    const authorizerId = seededUsers['suresh_hegde'] || superAdminId;

    // 2. Seed Customer Profiles (Mandya, Ramanagara & Bengaluru Rural)
    console.log('[Seed] Seeding production rural borrowers with DPDP consent...');
    const customerProfiles = [
      {
        cifNumber: 'CIF-2026-M48101',
        fullName: 'Anandi Devi Gowda',
        phone: '9845012345',
        email: 'anandi.maddur@example.com',
        dob: '1984-04-12',
        gender: 'FEMALE',
        addressLine: 'Near Kalikamba Temple, Maddur Taluk',
        pincode: '571428',
        state: 'Karnataka',
        consentGranted: true,
        createdByUserId: fieldOfficerId
      },
      {
        cifNumber: 'CIF-2026-M48102',
        fullName: 'Parvathamma K.',
        phone: '9845012346',
        email: null,
        dob: '1979-09-25',
        gender: 'FEMALE',
        addressLine: 'Shivaji Chowk, Maddur Village',
        pincode: '571428',
        state: 'Karnataka',
        consentGranted: true,
        createdByUserId: fieldOfficerId
      },
      {
        cifNumber: 'CIF-2026-R56201',
        fullName: 'Lakshmi Bai Channapatna',
        phone: '9741054321',
        email: null,
        dob: '1991-11-03',
        gender: 'FEMALE',
        addressLine: 'Crafts Colony, Channapatna Taluk',
        pincode: '562160',
        state: 'Karnataka',
        consentGranted: true,
        createdByUserId: fieldOfficerId
      },
      {
        cifNumber: 'CIF-2026-B10101',
        fullName: 'Basavaraju M.',
        phone: '9845012347',
        email: 'basavaraju.m@example.com',
        dob: '1982-08-19',
        gender: 'MALE',
        addressLine: 'Varthur Main Road, Bengaluru',
        pincode: '560087',
        state: 'Karnataka',
        consentGranted: true,
        createdByUserId: fieldOfficerId
      },
      {
        cifNumber: 'CIF-2026-B10102',
        fullName: 'Chennappa Gowda',
        phone: '9845012348',
        email: null,
        dob: '1975-03-14',
        gender: 'MALE',
        addressLine: 'Nelamangala Rural Cluster, Bengaluru Rural',
        pincode: '562123',
        state: 'Karnataka',
        consentGranted: true,
        createdByUserId: fieldOfficerId
      }
    ];

    const seededCustomers: Record<string, string> = {};

    for (const cust of customerProfiles) {
      const existing = await db.select().from(customers).where(eq(customers.cifNumber, cust.cifNumber)).limit(1);
      if (existing.length === 0) {
        const [inserted] = await db.insert(customers).values(cust).returning();
        seededCustomers[cust.cifNumber] = inserted.id;
        console.log(`  + Created customer: ${cust.fullName} (${cust.cifNumber})`);
      } else {
        seededCustomers[cust.cifNumber] = existing[0].id;
        console.log(`  * Customer exists: ${cust.fullName}`);
      }
    }

    // 3. Seed Micro Loan Accounts & Real Ledger
    console.log('[Seed] Seeding CBS micro-lending accounts and transactions...');
    const loanSeedData = [
      {
        accountNumber: 'GGY-2026-M48101',
        cif: 'CIF-2026-M48101',
        purpose: 'Dairy Development & Livestock Term Loan',
        principal: 75000,
        rate: 13.0,
        tenure: 18,
        status: AccountStatus.ACTIVE,
        balance: '68000.00',
        repayment: {
          ref: 'UPI20261101984501',
          amount: 7000,
          mode: PaymentMode.UPI,
          notes: 'November Monthly EMI via Google Pay (Ref: UPI20261101984501)'
        }
      },
      {
        accountNumber: 'GGY-2026-M48102',
        cif: 'CIF-2026-M48102',
        purpose: 'Kirana & Retail Working Capital',
        principal: 50000,
        rate: 14.5,
        tenure: 12,
        status: AccountStatus.ACTIVE,
        balance: '42000.00',
        repayment: {
          ref: 'RCPT20261102984502',
          amount: 8000,
          mode: PaymentMode.CASH,
          notes: 'Maddur field doorstep cash collection by Field Officer Ramesh Kumar'
        }
      },
      {
        accountNumber: 'DRAFT-R56201',
        cif: 'CIF-2026-R56201',
        purpose: 'Rural Artisan & Weaver Term Facility',
        principal: 60000,
        rate: 16.0,
        tenure: 12,
        status: AccountStatus.PENDING_APPROVAL,
        balance: '60000.00',
        repayment: null
      },
      {
        accountNumber: 'GGY-2026-B10101',
        cif: 'CIF-2026-B10101',
        purpose: 'Kirana & Retail Working Capital',
        principal: 40000,
        rate: 11.5,
        tenure: 12,
        status: AccountStatus.ACTIVE,
        balance: '36000.00',
        repayment: {
          ref: 'UPI20261105984503',
          amount: 4000,
          mode: PaymentMode.UPI,
          notes: 'PhonePe UPI QR repayment for Varthur retail store'
        }
      },
      {
        accountNumber: 'GGY-2026-B10102',
        cif: 'CIF-2026-B10102',
        purpose: 'Dairy Development & Livestock Term Loan',
        principal: 95000,
        rate: 12.0,
        tenure: 24,
        status: AccountStatus.ACTIVE,
        balance: '88000.00',
        repayment: {
          ref: 'UPI20261108984504',
          amount: 7000,
          mode: PaymentMode.UPI,
          notes: 'Direct BHIM UPI EMI credit from Nelamangala borrower'
        }
      }
    ];

    for (const item of loanSeedData) {
      const custId = seededCustomers[item.cif];
      if (!custId) continue;

      const existing = await db.select().from(accounts).where(eq(accounts.accountNumber, item.accountNumber)).limit(1);
      let accountRecordId = '';

      if (existing.length === 0) {
        const emi = calculateEMI(item.principal, item.rate, item.tenure);
        const [acc] = await db.insert(accounts).values({
          accountNumber: item.accountNumber,
          customerId: custId,
          accountType: AccountType.LOAN,
          status: item.status,
          currentBalance: item.balance,
          currency: 'INR',
          approvedByUserId: item.status === AccountStatus.ACTIVE ? authorizerId : null,
          approvedAt: item.status === AccountStatus.ACTIVE ? new Date() : null
        }).returning();

        accountRecordId = acc.id;

        await db.insert(loanDetails).values({
          accountId: acc.id,
          loanPurpose: item.purpose,
          principalAmount: item.principal.toFixed(2),
          interestRatePercent: item.rate.toFixed(2),
          tenureMonths: item.tenure,
          emiAmount: emi.toFixed(2),
          disbursedAmount: item.status === AccountStatus.ACTIVE ? item.principal.toFixed(2) : '0.00',
          disbursedAt: item.status === AccountStatus.ACTIVE ? new Date() : null
        });

        console.log(`  + Created loan account: ${item.accountNumber} (${item.status}, ₹${item.principal})`);

        // Record initial ledger entries if active
        if (item.status === AccountStatus.ACTIVE) {
          // 1. Initial Disbursement (DEBIT)
          const disbRef = `DISB-${item.accountNumber.replace(/[^A-Za-z0-9]/g, '')}`;
          await db.insert(transactions).values({
            accountId: acc.id,
            txnRefNumber: disbRef,
            amount: item.principal.toFixed(2),
            txnType: TransactionType.DEBIT,
            mode: PaymentMode.BANK_TRANSFER,
            balanceAfter: item.principal.toFixed(2),
            notes: `Initial principal disbursement for ${item.purpose}`
          });

          // 2. Sample Repayment (CREDIT)
          if (item.repayment) {
            await db.insert(transactions).values({
              accountId: acc.id,
              txnRefNumber: item.repayment.ref,
              amount: item.repayment.amount.toFixed(2),
              txnType: TransactionType.CREDIT,
              mode: item.repayment.mode,
              balanceAfter: item.balance,
              notes: item.repayment.notes
            });
          }
        }
      } else {
        accountRecordId = existing[0].id;
        console.log(`  * Account exists: ${item.accountNumber}`);

        if (item.status === AccountStatus.ACTIVE) {
          const existingTxns = await db.select().from(transactions).where(eq(transactions.accountId, accountRecordId)).limit(1);
          if (existingTxns.length === 0) {
            const disbRef = `DISB-${item.accountNumber.replace(/[^A-Za-z0-9]/g, '')}`;
            await db.insert(transactions).values({
              accountId: accountRecordId,
              txnRefNumber: disbRef,
              amount: item.principal.toFixed(2),
              txnType: TransactionType.DEBIT,
              mode: PaymentMode.BANK_TRANSFER,
              balanceAfter: item.principal.toFixed(2),
              notes: `Initial principal disbursement for ${item.purpose}`
            });

            if (item.repayment) {
              await db.insert(transactions).values({
                accountId: accountRecordId,
                txnRefNumber: item.repayment.ref,
                amount: item.repayment.amount.toFixed(2),
                txnType: TransactionType.CREDIT,
                mode: item.repayment.mode,
                balanceAfter: item.balance,
                notes: item.repayment.notes
              });
            }
            console.log(`    + Added initial ledger entries for: ${item.accountNumber}`);
          }
        }
      }
    }

    // 4. Seed Institution Configuration
    console.log('[Seed] Seeding institutional platform and UPI merchant settings...');
    const existingConfig = await db.select().from(institutionConfig).where(eq(institutionConfig.id, 'PRIMARY_CONFIG')).limit(1);
    if (existingConfig.length === 0) {
      await db.insert(institutionConfig).values({
        id: 'PRIMARY_CONFIG',
        organizationName: 'GGY Finance Ltd',
        platformTagline: 'National Micro-Lending Platform • Direct Doorstep Credit',
        registrationNumber: 'NBFC-ND/2026/7742',
        supportEmail: 'support@ggyfinance.in',
        supportPhone: '1800-889-2020',
        nodalOfficerName: 'Smt. Anita Deshmukh',
        nodalOfficerContact: 'grievance@ggyfinance.in • 080-28491001',
        headOfficeAddress: '#104, Institutional Financial Zone, Outer Ring Road, Bengaluru - 560001',
        upiVpa: 'ggycollect@icici',
        upiPayeeName: 'GGY Finance Ltd',
        upiMerchantCode: '6012',
        upiAccountNumber: '1084-0101-702-0039-4',
        enablePublicQr: true,
        collectionInstructions: 'Scan using BHIM UPI, Google Pay, PhonePe, or Paytm. Specify your Loan Account Number in remarks for instant automated ledger credit.'
      });
      console.log('  + Created institution config (PRIMARY_CONFIG)');
    } else {
      console.log('  * Institution config exists');
    }

    // 5. Seed Branches
    console.log('[Seed] Seeding primary branches...');
    const seedBranchesList = [
      {
        solId: '2020',
        name: 'Headquarters & Primary Branch',
        type: 'Head Office & Principal SOL',
        address: '#104, Institutional Financial Zone, Outer Ring Road, Bengaluru - 560001',
        manager: 'Sri Suresh Hegde (Branch Head)',
        phone: '080-28491001',
        email: 'branch2020@ggyfinance.in',
        operatingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
        isActive: true
      },
      {
        solId: '2021',
        name: 'Mandya Rural Livelihoods Hub',
        type: 'Agri & Dairy Lending Center',
        address: 'APMC Yard Complex, Main Road, Mandya - 571401',
        manager: 'Smt. Roopa K.',
        phone: '08232-224411',
        email: 'branch2021@ggyfinance.in',
        operatingHours: 'Mon - Sat: 8:30 AM - 5:30 PM',
        isActive: true
      },
      {
        solId: '2022',
        name: 'Ramanagara Artisan Credit Branch',
        type: 'Micro-Enterprise & Sericulture Hub',
        address: 'B.M. Road, Near Old Bus Stand, Ramanagara - 562159',
        manager: 'Sri Manjunath Swamy',
        phone: '080-29783322',
        email: 'branch2022@ggyfinance.in',
        operatingHours: 'Mon - Sat: 9:00 AM - 5:30 PM',
        isActive: true
      }
    ];

    for (const br of seedBranchesList) {
      const existingBranch = await db.select().from(branches).where(eq(branches.solId, br.solId)).limit(1);
      if (existingBranch.length === 0) {
        await db.insert(branches).values(br);
        console.log(`  + Created branch: ${br.solId} (${br.name})`);
      } else {
        console.log(`  * Branch exists: ${br.solId}`);
      }
    }

    // 6. Seed Credit Schemes
    console.log('[Seed] Seeding credit schemes...');
    const seedSchemesList = [
      {
        schemeCode: 'SCHM-701',
        name: 'Kirana & Retail Working Capital',
        minAmount: '10000.00',
        maxAmount: '50000.00',
        interestRate: '11.50',
        defaultTenureMonths: 12,
        minTenureMonths: 6,
        maxTenureMonths: 18,
        frequency: 'WEEKLY_OR_MONTHLY',
        purpose: 'Inventory purchase, shop modernization & merchant daily liquidity',
        isActive: true
      },
      {
        schemeCode: 'SCHM-702',
        name: 'Dairy Development & Livestock Term Loan',
        minAmount: '20000.00',
        maxAmount: '100000.00',
        interestRate: '12.00',
        defaultTenureMonths: 24,
        minTenureMonths: 12,
        maxTenureMonths: 24,
        frequency: 'MONTHLY',
        purpose: 'Milch cattle acquisition, cattle shed setup, feed stock & dairy equipment',
        isActive: true
      },
      {
        schemeCode: 'SCHM-703',
        name: 'Rural Artisan & Weaver Term Facility',
        minAmount: '15000.00',
        maxAmount: '75000.00',
        interestRate: '11.00',
        defaultTenureMonths: 18,
        minTenureMonths: 6,
        maxTenureMonths: 24,
        frequency: 'MONTHLY',
        purpose: 'Handloom, silk reeling machinery, raw materials and craft inventory',
        isActive: true
      },
      {
        schemeCode: 'SCHM-704',
        name: 'Women Self-Help Group (SHG) Livelihood Facility',
        minAmount: '25000.00',
        maxAmount: '150000.00',
        interestRate: '10.50',
        defaultTenureMonths: 24,
        minTenureMonths: 12,
        maxTenureMonths: 36,
        frequency: 'MONTHLY',
        purpose: 'Joint-liability group collective micro-enterprises and agro-processing',
        isActive: true
      }
    ];

    for (const sc of seedSchemesList) {
      const existingSc = await db.select().from(creditSchemes).where(eq(creditSchemes.schemeCode, sc.schemeCode)).limit(1);
      if (existingSc.length === 0) {
        await db.insert(creditSchemes).values(sc);
        console.log(`  + Created scheme: ${sc.schemeCode} (${sc.name})`);
      } else {
        console.log(`  * Scheme exists: ${sc.schemeCode}`);
      }
    }

    console.log('[Seed] Database seeding completed successfully.');
  } catch (err) {
    console.error('[Seed] Database seeding encountered an error:', err);
    throw err;
  }
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
