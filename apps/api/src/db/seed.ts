import { db, pool } from './client.js';
import {
  users,
  customers,
  accounts,
  loanDetails,
  transactions,
  cashReceipts,
  auditLogs,
  userRoleEnum
} from './schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AccountStatus, AccountType, LoanPurpose, PaymentMode, ReceiptStatus, TransactionType, calculateEMI } from '@nbfc/shared';

export async function seedDatabase() {
  console.log('[Seed] Starting GGY Finance Karnataka Operations database seeding...');

  try {
    // 1. Seed Initial Super Admin IT (Bcrypt salt rounds: 10)
    console.log('[Seed] Seeding initial Super Admin IT...');
    const superAdminPassword = 'GGY#SuperAdminIT@2026!';
    const superAdminPasswordHash = await bcrypt.hash(superAdminPassword, 10);
    const ngyPasswordHash = await bcrypt.hash('GGYSecurePassword@2026', 10);

    const staffProfiles = [
      {
        staffNumber: '202010',
        username: 'it_superadmin',
        fullName: 'Sri Chethan Gowda (IT Lead)',
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
        passwordHash: ngyPasswordHash,
        role: 'SYSTEM_ADMIN' as const,
        branchCode: '2020'
      }
    ];

    const seededUsers: Record<string, string> = {};

    for (const staff of staffProfiles) {
      const existing = await db.select().from(users).where(eq(users.username, staff.username)).limit(1);
      if (existing.length === 0) {
        const [inserted] = await db.insert(users).values(staff).returning();
        seededUsers[staff.username] = inserted.id;
        console.log(`  + Created user: ${staff.username} (${staff.role})`);
      } else {
        seededUsers[staff.username] = existing[0].id;
        console.log(`  * User exists: ${staff.username}`);
      }
    }

    const fieldOfficerId = seededUsers['it_superadmin'];
    const authorizerId = seededUsers['it_superadmin'];

    // 2. Seed Customer Profiles (Mandya & Ramanagara Clusters)
    console.log('[Seed] Seeding sample rural borrowers with DPDP consent...');
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

    // 3. Seed Micro Loan Accounts
    console.log('[Seed] Seeding micro-lending accounts...');
    const loanSeedData = [
      {
        accountNumber: 'GGY-2026-M48101',
        cif: 'CIF-2026-M48101',
        purpose: LoanPurpose.DAIRY_LIVESTOCK,
        principal: 75000,
        rate: 13.0,
        tenure: 18,
        status: AccountStatus.ACTIVE,
        balance: '68000.00'
      },
      {
        accountNumber: 'GGY-2026-M48102',
        cif: 'CIF-2026-M48102',
        purpose: LoanPurpose.KIRANA_STORE,
        principal: 50000,
        rate: 14.5,
        tenure: 12,
        status: AccountStatus.ACTIVE,
        balance: '42000.00'
      },
      {
        accountNumber: 'DRAFT-R56201',
        cif: 'CIF-2026-R56201',
        purpose: LoanPurpose.MICRO_ENTERPRISE,
        principal: 60000,
        rate: 16.0,
        tenure: 12,
        status: AccountStatus.PENDING_APPROVAL,
        balance: '60000.00'
      }
    ];

    for (const item of loanSeedData) {
      const custId = seededCustomers[item.cif];
      if (!custId) continue;

      const existing = await db.select().from(accounts).where(eq(accounts.accountNumber, item.accountNumber)).limit(1);
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
      } else {
        console.log(`  * Account exists: ${item.accountNumber}`);
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
