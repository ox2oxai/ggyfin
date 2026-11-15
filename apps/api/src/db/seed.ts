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
    // 1. Seed Initial Super Admin IT (Bcrypt salt rounds: 10)
    console.log('[Seed] Seeding initial Super Admin IT...');
    const superAdminPassword = 'GGY#SuperAdminIT@2026!';
    const superAdminPasswordHash = await bcrypt.hash(superAdminPassword, 10);
    const ngyPasswordHash = await bcrypt.hash('GGYSecurePassword@2026', 10);

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
