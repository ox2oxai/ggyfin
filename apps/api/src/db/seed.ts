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
    // 1. Seed Core Staff Users (Bcrypt salt rounds: 10)
    console.log('[Seed] Seeding staff users...');
    const defaultPassword = 'GGYSecurePassword@2026';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const staffProfiles = [
      {
        username: 'admin',
        email: 'admin@ggyfinance.in',
        phone: '9800010001',
        passwordHash,
        role: 'SYSTEM_ADMIN' as const,
        branchCode: 'KA-HQ-01'
      },
      {
        username: 'manager_blr',
        email: 'manager.blr@ggyfinance.in',
        phone: '9800010002',
        passwordHash,
        role: 'BRANCH_MANAGER' as const,
        branchCode: 'KA-BLR-01'
      },
      {
        username: 'authorizer_blr',
        email: 'authorizer.blr@ggyfinance.in',
        phone: '9800010003',
        passwordHash,
        role: 'AUTHORIZER' as const,
        branchCode: 'KA-BLR-01'
      },
      {
        username: 'officer_ramesh',
        email: 'ramesh.field@ggyfinance.in',
        phone: '9800010004',
        passwordHash,
        role: 'FIELD_OFFICER' as const,
        branchCode: 'KA-BLR-01'
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

    const fieldOfficerId = seededUsers['officer_ramesh'];
    const authorizerId = seededUsers['authorizer_blr'];

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
