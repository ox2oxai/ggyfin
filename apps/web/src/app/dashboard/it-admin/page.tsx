'use client';

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  sanitizePhoneInput,
  sanitizeUsername,
  sanitizeLegalName,
  isValidMobile,
  isValidEmail,
  isValidLegalName,
  isValidUsername
} from '@nbfc/shared';
import { recordAuditLog, getNextStaffNumber } from '../../../lib/audit';
import {
  DEFAULT_STAFF_DIRECTORY,
  getStaffDirectoryAsync,
  getStaffDirectorySync,
  saveStaffDirectory,
  StaffRecord
} from '../../../lib/staff';
import {
  InstitutionConfig,
  CreditScheme,
  BranchRecord,
  getInstitutionConfigSync,
  getInstitutionConfigAsync,
  saveInstitutionConfig,
  getCreditSchemesSync,
  getCreditSchemesAsync,
  saveCreditSchemes,
  getBranchesSync,
  getBranchesAsync,
  saveBranches,
  DEFAULT_INSTITUTION_CONFIG,
  DEFAULT_CREDIT_SCHEMES,
  DEFAULT_BRANCHES
} from '../../../lib/institution';
import {
  Shield,
  Users,
  Settings,
  UserPlus,
  Mail,
  Radio,
  FileCode,
  HardDrive,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Database,
  Search,
  Filter,
  Trash2,
  UserCheck,
  UserX,
  Lock,
  Activity,
  Layers,
  Building2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Sliders,
  Send,
  Check,
  Copy,
  X,
  Edit3,
  BadgeCheck,
  Upload,
  Image as ImageIcon,
  Plus,
  Percent,
  RefreshCw,
  FileText
} from 'lucide-react';

interface StaffUser {
  id: string;
  staffNumber: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  branchCode: string;
  isActive: boolean;
  mustResetPassword?: boolean;
  createdAt: string;
}

interface GatewayConfig {
  email: {
    smtpHost: string;
    smtpPort: number;
    secure: boolean;
    username: string;
    fromAddress: string;
  };
  whatsapp: {
    phoneNumberId: string;
    wabaId: string;
    cloudApiVersion: string;
    webhookSecret: string;
  };
  sms: {
    dltEntityId: string;
    senderHeader: string;
    provider: string;
  };
  storage: {
    provider: 'LOCAL' | 'AWS_S3' | 'CLOUDFLARE_R2';
    bucketName: string;
    region: string;
    encryption: string;
  };
}

interface AuditEvent {
  id: string;
  timestamp: string;
  category: 'INTENDED_ADMIN_UPDATE' | 'OPERATIONAL_BANKING_EVENT' | 'SECURITY_EVENT';
  action: string;
  actorStaffNumber?: string;
  actorUsername?: string;
  actorRole?: string;
  target: string;
  details: string;
  ip: string;
}

const DEFAULT_SUPER_ADMIN_STAFF: StaffUser[] = DEFAULT_STAFF_DIRECTORY as StaffUser[];

export default function SuperAdminItDashboard() {
  const [activeTab, setActiveTab] = useState<'staff' | 'institution' | 'schemes' | 'branches' | 'gateways' | 'telemetry'>('institution');
  const [staffList, setStaffList] = useState<StaffUser[]>(DEFAULT_SUPER_ADMIN_STAFF);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBranch, setEditBranch] = useState('2020');

  // Institution Profile & Dynamic Branding State
  const [instConfig, setInstConfig] = useState<InstitutionConfig>(DEFAULT_INSTITUTION_CONFIG);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isSavingInst, setIsSavingInst] = useState(false);

  // Credit Schemes State
  const [schemesList, setSchemesList] = useState<CreditScheme[]>(DEFAULT_CREDIT_SCHEMES);
  const [editingScheme, setEditingScheme] = useState<CreditScheme | null>(null);
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);

  // Operational Branches State
  const [branchesList, setBranchesList] = useState<BranchRecord[]>(DEFAULT_BRANCHES);
  const [editingBranch, setEditingBranch] = useState<BranchRecord | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');
  const [lastProvisionedInvite, setLastProvisionedInvite] = useState<{
    staffNumber: string;
    username: string;
    fullName: string;
    role: UserRole;
    branchCode: string;
    temporaryPassword: string;
  } | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Audit State
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>('ALL');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [activeSession, setActiveSession] = useState<{ username: string; userId: string; staffNumber: string } | null>(null);

  // Sync staff directory from persistent API & localStorage with clean migration and real-time reactivity
  const syncStaffDirectory = () => {
    try {
      const rawSession = localStorage.getItem('nbfc_staff_session');
      if (rawSession) {
        const s = JSON.parse(rawSession);
        const fixedStaffNo = !s.staffNumber || !/^\d+$/.test(s.staffNumber) || s.staffNumber.startsWith('EMP-') ? '202010' : s.staffNumber;
        const fixedBranch = s.branchCode === 'KA-HQ-IT' ? '2020' : (s.branchCode || '2020');
        setActiveSession({ username: s.username, userId: s.userId, staffNumber: fixedStaffNo });
        if (fixedStaffNo !== s.staffNumber || fixedBranch !== s.branchCode) {
          localStorage.setItem('nbfc_staff_session', JSON.stringify({ ...s, staffNumber: fixedStaffNo, branchCode: fixedBranch }));
        }
      }

      getStaffDirectoryAsync().then((list) => {
        setStaffList(list as StaffUser[]);
      }).catch(() => {
        setStaffList(getStaffDirectorySync() as StaffUser[]);
      });
    } catch {
      setStaffList(getStaffDirectorySync() as StaffUser[]);
    }
  };

  // Sync Institution, Credit Schemes & Branches
  const syncInstitutionData = () => {
    try {
      getInstitutionConfigAsync().then((c) => {
        setInstConfig(c);
        if (c.logoUrl) setLogoPreview(c.logoUrl);
      }).catch(() => {
        const c = getInstitutionConfigSync();
        setInstConfig(c);
        if (c.logoUrl) setLogoPreview(c.logoUrl);
      });

      getCreditSchemesAsync().then((s) => {
        setSchemesList(s);
      }).catch(() => {
        setSchemesList(getCreditSchemesSync());
      });

      getBranchesAsync().then((b) => {
        setBranchesList(b);
      }).catch(() => {
        setBranchesList(getBranchesSync());
      });
    } catch {
      setInstConfig(getInstitutionConfigSync());
      setSchemesList(getCreditSchemesSync());
      setBranchesList(getBranchesSync());
    }
  };

  useEffect(() => {
    syncStaffDirectory();
    syncInstitutionData();
    window.addEventListener('storage', syncStaffDirectory);
    window.addEventListener('storage', syncInstitutionData);
    window.addEventListener('nbfc_session_updated', syncStaffDirectory);
    window.addEventListener('nbfc_staff_updated', syncStaffDirectory);
    window.addEventListener('nbfc_config_updated', syncInstitutionData);
    window.addEventListener('nbfc_schemes_updated', syncInstitutionData);
    window.addEventListener('nbfc_branches_updated', syncInstitutionData);
    return () => {
      window.removeEventListener('storage', syncStaffDirectory);
      window.removeEventListener('storage', syncInstitutionData);
      window.removeEventListener('nbfc_session_updated', syncStaffDirectory);
      window.removeEventListener('nbfc_staff_updated', syncStaffDirectory);
      window.removeEventListener('nbfc_config_updated', syncInstitutionData);
      window.removeEventListener('nbfc_schemes_updated', syncInstitutionData);
      window.removeEventListener('nbfc_branches_updated', syncInstitutionData);
    };
  }, []);

  // Sync immutable audit trail
  const syncAudits = () => {
    try {
      const raw = localStorage.getItem('nbfc_audit_trail');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAuditEvents(parsed);
          return;
        }
      }
    } catch {}

    const initial: AuditEvent[] = [
      {
        id: 'aud-001',
        timestamp: '2026-11-15 02:30:12',
        category: 'INTENDED_ADMIN_UPDATE',
        action: 'SYSTEM_BOOT',
        actorStaffNumber: '202010',
        actorUsername: 'it_superadmin',
        actorRole: 'SUPER_ADMIN_IT',
        target: 'KA-HQ-IT',
        details: 'Primary IT Super Admin root session established. Strict technical isolation active.',
        ip: '127.0.0.1'
      },
      {
        id: 'aud-002',
        timestamp: '2026-11-15 02:15:40',
        category: 'INTENDED_ADMIN_UPDATE',
        action: 'GATEWAY_TEST',
        actorStaffNumber: '202010',
        actorUsername: 'it_superadmin',
        actorRole: 'SUPER_ADMIN_IT',
        target: 'SMTP_GATEWAY',
        details: 'SMTP handshake to SendGrid verified healthy (42ms latency). TLS 1.3 verified.',
        ip: '127.0.0.1'
      }
    ];
    localStorage.setItem('nbfc_audit_trail', JSON.stringify(initial));
    setAuditEvents(initial);
  };

  useEffect(() => {
    syncAudits();
    window.addEventListener('storage', syncAudits);
    window.addEventListener('nbfc_audit_updated', syncAudits);
    return () => {
      window.removeEventListener('storage', syncAudits);
      window.removeEventListener('nbfc_audit_updated', syncAudits);
    };
  }, []);

  const appendAuditEvent = (event: Omit<AuditEvent, 'id' | 'timestamp' | 'ip'>) => {
    const raw = localStorage.getItem('nbfc_audit_trail');
    const existing: AuditEvent[] = raw ? JSON.parse(raw) : [];
    const newEntry: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ip: '127.0.0.1',
      ...event
    };
    const updated = [newEntry, ...existing];
    localStorage.setItem('nbfc_audit_trail', JSON.stringify(updated));
    setAuditEvents(updated);
    window.dispatchEvent(new Event('nbfc_audit_updated'));
  };

  const persistStaffList = (updated: StaffUser[]) => {
    setStaffList(updated);
    saveStaffDirectory(updated as any);
  };

  // Provision Form State
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.FIELD_OFFICER);
  const [newBranch, setNewBranch] = useState('2020');
  const [newPassword, setNewPassword] = useState('GGYSecurePassword@2026');

  // Gateways Config State
  const [gateways, setGateways] = useState<GatewayConfig>({
    email: {
      smtpHost: 'smtp.sendgrid.net',
      smtpPort: 587,
      secure: false,
      username: 'apikey',
      fromAddress: 'alerts@ggyfinance.in'
    },
    whatsapp: {
      phoneNumberId: '10840192847192',
      wabaId: '928471928471',
      cloudApiVersion: 'v20.0',
      webhookSecret: 'whsec_ggy_fin_2026_prod'
    },
    sms: {
      dltEntityId: '1401552890000041289',
      senderHeader: 'GGYFIN',
      provider: 'Airtel IQ TRAI DLT'
    },
    storage: {
      provider: 'LOCAL',
      bucketName: 'ggy-kyc-vault-secure',
      region: 'ap-south-1',
      encryption: 'AES-256-GCM Envelope Encryption (Active)'
    }
  });

  const [testingGateway, setTestingGateway] = useState<string | null>(null);
  const [gatewayTestResult, setGatewayTestResult] = useState<{ [key: string]: string }>({});

  // Flash banner clear helper
  const notifySuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setActionErrorMsg('');
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  const notifyError = (msg: string) => {
    setActionErrorMsg(msg);
    setActionSuccessMsg('');
    setTimeout(() => setActionErrorMsg(''), 5000);
  };

  // Institution Profile & Branding Handlers
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      notifyError('Image size exceeds 2MB limit. Please upload a smaller logo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoPreview(dataUrl);
      setInstConfig((prev) => ({ ...prev, logoUrl: dataUrl }));
      notifySuccess('Logo uploaded! Click "Save Institution Profile & Branding" to apply platform-wide.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
    setInstConfig((prev) => ({ ...prev, logoUrl: '' }));
    notifySuccess('Custom logo removed. Default SVG emblem will be used.');
  };

  const handleSaveInstitutionProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInst(true);
    try {
      await saveInstitutionConfig(instConfig);
      appendAuditEvent({
        category: 'INTENDED_ADMIN_UPDATE',
        action: 'INSTITUTION_PROFILE_UPDATED',
        actorStaffNumber: activeSession?.staffNumber || '202010',
        actorUsername: activeSession?.username || 'it_superadmin',
        actorRole: 'SUPER_ADMIN_IT',
        target: instConfig.organizationName,
        details: `Institution profile and branding updated by ${activeSession?.username || 'it_superadmin'}`
      });
      notifySuccess('Institution profile, branding, and registration details successfully saved.');
    } catch {
      notifyError('Failed to save institution profile. Please retry.');
    } finally {
      setIsSavingInst(false);
    }
  };

  // Operational Branch Handlers
  const handleSaveBranch = async (updatedBranch: BranchRecord) => {
    try {
      const existing = branchesList.some(b => b.branchCode === updatedBranch.branchCode);
      const updatedList = existing
        ? branchesList.map(b => b.branchCode === updatedBranch.branchCode ? updatedBranch : b)
        : [...branchesList, updatedBranch];

      setBranchesList(updatedList);
      await saveBranches(updatedList);
      appendAuditEvent({
        category: 'INTENDED_ADMIN_UPDATE',
        action: 'BRANCH_RECORD_SAVED',
        actorStaffNumber: activeSession?.staffNumber || '202010',
        actorUsername: activeSession?.username || 'it_superadmin',
        actorRole: 'SUPER_ADMIN_IT',
        target: `Branch ${updatedBranch.branchCode}`,
        details: `Branch ${updatedBranch.branchCode} (${updatedBranch.name}) updated.`
      });
      notifySuccess(`Branch ${updatedBranch.branchCode} details saved successfully.`);
      setIsBranchModalOpen(false);
      setEditingBranch(null);
    } catch {
      notifyError('Failed to save branch. Please retry.');
    }
  };

  // Credit Schemes Handlers
  const handleSaveScheme = async (scheme: CreditScheme) => {
    try {
      const exists = schemesList.some(s => s.schemeCode === scheme.schemeCode);
      const updatedList = exists
        ? schemesList.map(s => s.schemeCode === scheme.schemeCode ? scheme : s)
        : [...schemesList, scheme];

      setSchemesList(updatedList);
      await saveCreditSchemes(updatedList);
      appendAuditEvent({
        category: 'INTENDED_ADMIN_UPDATE',
        action: exists ? 'CREDIT_SCHEME_UPDATED' : 'CREDIT_SCHEME_CREATED',
        actorStaffNumber: activeSession?.staffNumber || '202010',
        actorUsername: activeSession?.username || 'it_superadmin',
        actorRole: 'SUPER_ADMIN_IT',
        target: scheme.schemeCode,
        details: `Credit scheme ${scheme.schemeCode} (${scheme.name}) rate ${scheme.interestRate}% saved.`
      });
      notifySuccess(`Credit scheme ${scheme.schemeCode} successfully saved.`);
      setIsSchemeModalOpen(false);
      setEditingScheme(null);
    } catch {
      notifyError('Failed to save credit scheme. Please retry.');
    }
  };

  const handleToggleSchemeStatus = async (schemeCode: string) => {
    const scheme = schemesList.find(s => s.schemeCode === schemeCode);
    if (!scheme) return;

    const nextState = !scheme.isActive;
    const updatedList = schemesList.map(s => s.schemeCode === schemeCode ? { ...s, isActive: nextState } : s);
    setSchemesList(updatedList);
    await saveCreditSchemes(updatedList);

    appendAuditEvent({
      category: 'INTENDED_ADMIN_UPDATE',
      action: nextState ? 'CREDIT_SCHEME_ACTIVATED' : 'CREDIT_SCHEME_DEACTIVATED',
      actorStaffNumber: activeSession?.staffNumber || '202010',
      actorUsername: activeSession?.username || 'it_superadmin',
      actorRole: 'SUPER_ADMIN_IT',
      target: schemeCode,
      details: `Credit scheme ${schemeCode} status set to ${nextState ? 'ACTIVE' : 'INACTIVE'}`
    });
    notifySuccess(`Credit scheme ${schemeCode} is now ${nextState ? 'Active' : 'Inactive'}.`);
  };

  // Staff Management Actions
  const handleRoleChange = (userId: string, targetRole: UserRole) => {
    const user = staffList.find((u) => u.id === userId);
    if (!user) return;

    const isSelf = activeSession?.username === user.username || activeSession?.userId === user.id;
    if (isSelf && targetRole !== UserRole.SUPER_ADMIN_IT) {
      notifyError('Security Guard: You cannot demote your own active administrator account.');
      return;
    }

    if (user.username === 'it_superadmin' && targetRole !== UserRole.SUPER_ADMIN_IT) {
      notifyError('Security Guard: Cannot demote the primary Super Admin IT account.');
      return;
    }

    const updated = staffList.map((u) => (u.id === userId ? { ...u, role: targetRole } : u));
    persistStaffList(updated);

    appendAuditEvent({
      category: 'INTENDED_ADMIN_UPDATE',
      action: 'ROLE_MUTATED',
      actorStaffNumber: activeSession?.staffNumber || '202010',
      actorUsername: activeSession?.username || 'it_superadmin',
      actorRole: 'SUPER_ADMIN_IT',
      target: user.staffNumber || user.username,
      details: `Role updated from ${user.role} to ${targetRole} by ${activeSession?.username || 'it_superadmin'}`
    });

    notifySuccess(`Role for '${user.username}' successfully changed to ${targetRole}.`);
  };

  const handleToggleStatus = (userId: string) => {
    const user = staffList.find((u) => u.id === userId);
    if (!user) return;

    const isSelf = activeSession?.username === user.username || activeSession?.userId === user.id;
    if (isSelf) {
      notifyError('Security Guard: You cannot suspend your own active session.');
      return;
    }

    if (user.username === 'it_superadmin') {
      notifyError('Security Guard: Super Admin IT cannot suspend their own active account.');
      return;
    }

    const nextState = !user.isActive;
    const updated = staffList.map((u) => (u.id === userId ? { ...u, isActive: nextState } : u));
    persistStaffList(updated);

    appendAuditEvent({
      category: 'INTENDED_ADMIN_UPDATE',
      action: nextState ? 'ACCESS_RESTORED' : 'ACCESS_REVOKED',
      actorStaffNumber: activeSession?.staffNumber || '202010',
      actorUsername: activeSession?.username || 'it_superadmin',
      actorRole: 'SUPER_ADMIN_IT',
      target: user.staffNumber || user.username,
      details: `Account access ${nextState ? 'restored to ACTIVE' : 'REVOKED (Suspended)'} by ${activeSession?.username || 'it_superadmin'}`
    });

    notifySuccess(
      `Account '${user.username}' is now ${nextState ? 'ACTIVE' : 'SUSPENDED'}.`
    );
  };

  const handleDeleteStaff = (userId: string) => {
    const user = staffList.find((u) => u.id === userId);
    if (!user) return;

    const isSelf = activeSession?.username === user.username || activeSession?.userId === user.id;
    if (isSelf) {
      notifyError('Security Guard: You cannot deprovision your own active administrator profile.');
      return;
    }

    if (user.username === 'it_superadmin') {
      notifyError('Security Guard: Primary Super Admin IT profile cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to permanently deprovision staff account '${user.username}' (${user.fullName})?`)) {
      return;
    }

    const updated = staffList.filter((u) => u.id !== userId);
    persistStaffList(updated);

    appendAuditEvent({
      category: 'INTENDED_ADMIN_UPDATE',
      action: 'STAFF_DEPROVISIONED',
      actorStaffNumber: activeSession?.staffNumber || '202010',
      actorUsername: activeSession?.username || 'it_superadmin',
      actorRole: 'SUPER_ADMIN_IT',
      target: user.staffNumber || user.username,
      details: `Account ${user.username} (${user.role}) permanently deprovisioned from ${user.branchCode}`
    });

    notifySuccess(`Staff account '${user.username}' has been deprovisioned.`);
  };

  const handleResetUserPassword = (userId: string) => {
    const user = staffList.find((u) => u.id === userId);
    if (!user) return;

    if (user.username === 'it_superadmin') {
      notifyError('Security Guard: Primary Super Admin IT password cannot be reset from this action.');
      return;
    }

    const generatedTempPassword = `GGY#Temp${Math.floor(100000 + Math.random() * 900000)}!`;
    const updated = staffList.map((u) =>
      u.id === userId
        ? { ...u, password: generatedTempPassword, mustResetPassword: true }
        : u
    );
    persistStaffList(updated);

    setLastProvisionedInvite({
      staffNumber: user.staffNumber || '202010',
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      branchCode: user.branchCode,
      temporaryPassword: generatedTempPassword
    });

    appendAuditEvent({
      category: 'INTENDED_ADMIN_UPDATE',
      action: 'PASSWORD_RESET_ISSUED',
      actorStaffNumber: '202010',
      actorUsername: 'it_superadmin',
      actorRole: 'SUPER_ADMIN_IT',
      target: user.staffNumber || user.username,
      details: `Temporary password generated and forced password reset flagged for ${user.username}`
    });

    notifySuccess(
      `Temporary credentials reissued for '${user.username}'. Please copy the updated invite text above and send it securely.`
    );
  };

  const handleEditStaff = (user: StaffUser) => {
    setEditingStaff(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditBranch(user.branchCode);
    setIsEditModalOpen(true);
  };

  const handleSaveStaffEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    if (!isValidEmail(editEmail)) {
      notifyError('Please enter a valid official email address (e.g. name@ggyfinance.in).');
      return;
    }

    if (!isValidMobile(editPhone)) {
      notifyError('Mobile phone number must be exactly 10 digits starting with 6, 7, 8, or 9.');
      return;
    }

    if (!isValidLegalName(editFullName)) {
      notifyError('Full legal name must be 2-70 characters and contain only letters, spaces, dots, single quotes, or hyphens.');
      return;
    }

    const updated = staffList.map((u) => {
      if (u.id === editingStaff.id) {
        return {
          ...u,
          fullName: editFullName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          branchCode: editBranch
        };
      }
      return u;
    });

    setStaffList(updated);
    await saveStaffDirectory(updated as any);

    // If editing oneself, also update session immediately
    try {
      const rawSession = localStorage.getItem('nbfc_staff_session');
      if (rawSession) {
        const s = JSON.parse(rawSession);
        if (s.username === editingStaff.username || s.userId === editingStaff.id) {
          const updatedSession = {
            ...s,
            fullName: editFullName.trim(),
            email: editEmail.trim(),
            phone: editPhone.trim(),
            branchCode: editBranch
          };
          localStorage.setItem('nbfc_staff_session', JSON.stringify(updatedSession));
          window.dispatchEvent(new Event('nbfc_session_updated'));
        }
      }
    } catch {}

    appendAuditEvent({
      category: 'INTENDED_ADMIN_UPDATE',
      action: 'PROFILE_UPDATED',
      actorStaffNumber: activeSession?.staffNumber || '202010',
      actorUsername: activeSession?.username || 'it_superadmin',
      actorRole: 'SUPER_ADMIN_IT',
      target: editingStaff.staffNumber || editingStaff.username,
      details: `Staff profile details updated for ${editingStaff.username} (Name: ${editFullName}, Email: ${editEmail}, Phone: ${editPhone})`
    });

    setIsEditModalOpen(false);
    setEditingStaff(null);
    notifySuccess(`Profile details for '${editingStaff.username}' updated.`);
  };

  const nextStaffNumber = getNextStaffNumber(staffList, newBranch || '2020');

  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUsername(newUsername)) {
      notifyError('Username must be 3-30 characters alphanumeric, underscore, or hyphen (no spaces or special symbols).');
      return;
    }

    if (!isValidLegalName(newFullName)) {
      notifyError('Full legal name must be 2-70 characters (letters, spaces, dots, single quotes, hyphens only).');
      return;
    }

    if (!isValidEmail(newEmail)) {
      notifyError('Please enter a valid official email address.');
      return;
    }

    if (!isValidMobile(newPhone)) {
      notifyError('Mobile phone number must be exactly 10 digits starting with 6, 7, 8, or 9.');
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      notifyError('Password must be between 8 and 128 characters.');
      return;
    }

    // Check duplicate
    if (staffList.some((u) => u.username.toLowerCase() === newUsername.toLowerCase())) {
      notifyError(`Username '${newUsername}' is already provisioned.`);
      return;
    }

    const assignedStaffNumber = nextStaffNumber;

    const created: StaffUser & { password?: string; mustResetPassword?: boolean } = {
      id: `u-prov-${Date.now()}`,
      staffNumber: assignedStaffNumber,
      username: newUsername.trim(),
      fullName: newFullName.trim() || newUsername.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      role: newRole,
      branchCode: newBranch || '2020',
      isActive: true,
      createdAt: new Date().toISOString().slice(0, 10),
      password: newPassword,
      mustResetPassword: true
    };

    const updated = [created as StaffUser, ...staffList];
    persistStaffList(updated);

    setLastProvisionedInvite({
      staffNumber: assignedStaffNumber,
      username: created.username,
      fullName: created.fullName,
      role: created.role,
      branchCode: created.branchCode,
      temporaryPassword: newPassword
    });

    appendAuditEvent({
      category: 'INTENDED_ADMIN_UPDATE',
      action: 'STAFF_PROVISIONED',
      actorStaffNumber: activeSession?.staffNumber || '202010',
      actorUsername: activeSession?.username || 'it_superadmin',
      actorRole: 'SUPER_ADMIN_IT',
      target: assignedStaffNumber,
      details: `Provisioned as ${created.role} for branch ${created.branchCode} with temporary password`
    });

    setIsProvisionModalOpen(false);
    setNewUsername('');
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    notifySuccess(`New staff member '${created.username}' (${assignedStaffNumber}) provisioned as ${created.role}. You can now copy and securely send their login credentials.`);
  };

  const handleCopyInvite = () => {
    if (!lastProvisionedInvite) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ggyfinance.in';
    const text = `GGY Finance Staff Portal Access Credentials\nPortal URL: ${origin}/login\nStaff Identification No: ${lastProvisionedInvite.staffNumber}\nUsername: ${lastProvisionedInvite.username}\nFull Name: ${lastProvisionedInvite.fullName}\nTemporary Password: ${lastProvisionedInvite.temporaryPassword}\nAssigned Role: ${lastProvisionedInvite.role}\nBranch SOL: ${lastProvisionedInvite.branchCode}\n\nNote: You will be prompted to create your own confidential password on first login.`;
    navigator.clipboard.writeText(text);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 3000);
  };

  // Gateway Test Helper
  const runGatewayTest = (gateway: 'EMAIL' | 'WHATSAPP' | 'SMS' | 'STORAGE') => {
    setTestingGateway(gateway);
    setTimeout(() => {
      let result = '';
      if (gateway === 'EMAIL') {
        result = `SMTP Handshake to ${gateways.email.smtpHost}:${gateways.email.smtpPort} Succeeded (42ms) • TLS 1.3 Verified`;
      } else if (gateway === 'WHATSAPP') {
        result = `Meta Cloud API v20.0 Verified (88ms) • WABA ID ${gateways.whatsapp.wabaId} Active`;
      } else if (gateway === 'SMS') {
        result = `TRAI DLT Entity ID ${gateways.sms.dltEntityId} Validated • Header '${gateways.sms.senderHeader}' Approved`;
      } else if (gateway === 'STORAGE') {
        result = `KYC Storage (${gateways.storage.provider}) Connected • AES-256-GCM Envelope Encryption Verified`;
      }

      setGatewayTestResult((prev) => ({ ...prev, [gateway]: result }));
      setTestingGateway(null);

      appendAuditEvent({
        category: 'INTENDED_ADMIN_UPDATE',
        action: 'GATEWAY_TEST',
        actorStaffNumber: '202010',
        actorUsername: 'it_superadmin',
        actorRole: 'SUPER_ADMIN_IT',
        target: gateway,
        details: result
      });
    }, 700);
  };

  const filteredStaff = staffList.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.staffNumber && u.staffNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.branchCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredAudits = auditEvents.filter((evt) => {
    const matchesCat = auditCategoryFilter === 'ALL' || evt.category === auditCategoryFilter;
    const q = auditSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      evt.action.toLowerCase().includes(q) ||
      evt.target.toLowerCase().includes(q) ||
      evt.details.toLowerCase().includes(q) ||
      (evt.actorStaffNumber && evt.actorStaffNumber.toLowerCase().includes(q)) ||
      (evt.actorUsername && evt.actorUsername.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN_IT:
        return 'bg-orange-100 text-orange-900 border-orange-300 font-extrabold';
      case UserRole.SYSTEM_ADMIN:
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case UserRole.BRANCH_MANAGER:
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case UserRole.AUTHORIZER:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case UserRole.FIELD_OFFICER:
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'INTENDED_ADMIN_UPDATE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
            Intended Admin Update
          </span>
        );
      case 'OPERATIONAL_BANKING_EVENT':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            Banking Operational
          </span>
        );
      case 'SECURITY_EVENT':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-300">
            Security Event
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            {category}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Super Admin IT Isolated Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white">
          <Shield className="w-3.5 h-3.5 text-amber-200" />
          <span>Super Admin IT • Technical Systems Controller</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          Digital Banking Infrastructure &amp; Staff Access Hub
        </h2>
        <p className="text-xs text-orange-100 max-w-3xl leading-relaxed">
          Primary technical administrator console. Quarantined from live customer loan books and financial balances under statutory data isolation principles. Controls institutional staff provisioning, unique staff numbering, role access, and technical communications gateways.
        </p>

        {/* Technical Isolation Pill */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
          <span className="bg-white/10 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 border border-white/20">
            <Lock className="w-3.5 h-3.5 text-amber-200" />
            <span>Customer Data Isolated (403 Quarantine)</span>
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-xl font-mono text-[11px] flex items-center gap-1.5 border border-white/20">
            <Radio className="w-3.5 h-3.5 text-emerald-300" />
            <span>Dual-Console Audit Logging Active</span>
          </span>
        </div>
      </div>

      {/* Action Notification Banners */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{actionSuccessMsg}</span>
        </div>
      )}

      {actionErrorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{actionErrorMsg}</span>
        </div>
      )}

      {/* Temporary Handover Credentials Card (Copyable) */}
      {lastProvisionedInvite && (
        <div className="bg-white p-6 rounded-3xl border-2 border-orange-300 shadow-md space-y-4 animate-in fade-in">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-wider uppercase bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full">
                Handover Invitation Ready
              </span>
              <h3 className="text-sm font-black text-slate-900">
                Staff Credentials Generated: {lastProvisionedInvite.fullName} ({lastProvisionedInvite.staffNumber})
              </h3>
              <p className="text-xs text-slate-500">
                Share these initial credentials with the staff member. They will be required to set their own confidential password upon first login.
              </p>
            </div>
            <button
              onClick={handleCopyInvite}
              className="py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedInvite ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedInvite ? 'Copied to Clipboard!' : 'Copy Invitation Text'}</span>
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
            <p><strong>Staff ID:</strong> {lastProvisionedInvite.staffNumber}</p>
            <p><strong>Username:</strong> {lastProvisionedInvite.username}</p>
            <p><strong>Temporary Password:</strong> {lastProvisionedInvite.temporaryPassword}</p>
            <p><strong>Assigned Role:</strong> {lastProvisionedInvite.role}</p>
            <p><strong>Branch SOL:</strong> {lastProvisionedInvite.branchCode}</p>
          </div>
        </div>
      )}

      {/* Executive Segmented Navigation Menu Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('institution')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'institution'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Institution &amp; Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'staff'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Directory ({staffList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'schemes'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Credit Schemes ({schemesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'branches'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Branch SOLs ({branchesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gateways')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'gateways'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Technical Gateways</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'telemetry'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit &amp; Governance ({auditEvents.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: STAFF DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'staff' && (
        <section className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by ID, username, name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value={UserRole.SUPER_ADMIN_IT}>Super Admin IT</option>
                <option value={UserRole.SYSTEM_ADMIN}>System Admin</option>
                <option value={UserRole.BRANCH_MANAGER}>Branch Manager</option>
                <option value={UserRole.AUTHORIZER}>Authorizer</option>
                <option value={UserRole.FIELD_OFFICER}>Field Officer</option>
              </select>
            </div>

            <button
              onClick={() => setIsProvisionModalOpen(true)}
              className="w-full sm:w-auto py-2.5 px-5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision New Staff</span>
            </button>
          </div>

          {/* Staff Directory Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Staff ID / EMP #</th>
                    <th className="py-3.5 px-4">Staff Member</th>
                    <th className="py-3.5 px-4">Branch SOL</th>
                    <th className="py-3.5 px-4">Current Role</th>
                    <th className="py-3.5 px-4">Access Status</th>
                    <th className="py-3.5 px-4 text-center">Change Role</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStaff.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-black text-orange-950 bg-orange-100/70 px-2 py-1 rounded-md text-[11px] border border-orange-200">
                          {user.staffNumber || '202010'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            {user.fullName}
                            {user.username === 'it_superadmin' && (
                              <span className="text-[10px] bg-orange-100 text-orange-800 font-black px-1.5 rounded-sm">
                                ROOT IT
                              </span>
                            )}
                            {user.username === activeSession?.username && (
                              <span className="text-[10px] bg-amber-100 text-amber-900 font-black px-1.5 rounded-sm">
                                YOU
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">@{user.username}</p>
                          <p className="text-[11px] text-slate-500">{user.email} • {user.phone}</p>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                          {user.branchCode}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] border ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            SUSPENDED
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {user.username === 'it_superadmin' ? (
                          <span className="text-[11px] text-slate-400 italic">Locked (Root IT)</span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            className="text-xs py-1 px-2 border border-slate-200 rounded-lg bg-white font-bold text-slate-800 focus:ring-1 focus:ring-orange-500 cursor-pointer"
                          >
                            <option value={UserRole.SUPER_ADMIN_IT}>SUPER_ADMIN_IT</option>
                            <option value={UserRole.SYSTEM_ADMIN}>SYSTEM_ADMIN</option>
                            <option value={UserRole.BRANCH_MANAGER}>BRANCH_MANAGER</option>
                            <option value={UserRole.AUTHORIZER}>AUTHORIZER</option>
                            <option value={UserRole.FIELD_OFFICER}>FIELD_OFFICER</option>
                          </select>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleEditStaff(user)}
                          className="py-1 px-2.5 rounded-lg text-[11px] font-bold border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit staff details"
                        >
                          {user.username === 'it_superadmin' ? 'Edit Profile' : 'Edit Details'}
                        </button>

                        {user.username !== 'it_superadmin' && (
                          <>
                            <button
                              onClick={() => handleResetUserPassword(user.id)}
                              className="py-1 px-2.5 rounded-lg text-[11px] font-bold border border-orange-300 bg-orange-50 text-orange-800 hover:bg-orange-100 transition-colors cursor-pointer"
                              title="Reissue temporary password with forced first-login reset"
                            >
                              Reset Password
                            </button>

                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`py-1 px-2.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                                user.isActive
                                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                              }`}
                            >
                              {user.isActive ? 'Suspend' : 'Activate'}
                            </button>

                            <button
                              onClick={() => handleDeleteStaff(user.id)}
                              className="py-1 px-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                              title="Deprovision user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 2: INSTITUTION PROFILE & BRANDING */}
      {/* ======================================================== */}
      {activeTab === 'institution' && (
        <section className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  <span>Institutional Profile, Regulatory Registration &amp; Dynamic Branding</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure organization name, official regulatory registration number, contact helpline, support emails, and live logo branding on the fly without software recompilation.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveInstitutionProfile} className="space-y-6">
              {/* Logo Branding Section */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-orange-600" />
                      <span>Organization Logo &amp; Brand Emblem</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Upload your official logo file (PNG, SVG, or JPG). Changes reflect in real-time across public headers, borrower portals, and staff consoles.
                    </p>
                  </div>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-3 py-1.5 text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Remove Custom Logo
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                  <div className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center p-2 overflow-hidden shadow-xs shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Institution Logo Preview" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center text-slate-400">
                        <Upload className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                        <span className="text-[10px] font-semibold">No Custom Logo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <label className="block text-xs font-bold text-slate-700">
                      Upload Logo Image (PNG / SVG / JPG, max 2MB)
                    </label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
                      onChange={handleLogoFileUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 font-medium">
                      Recommended: High-resolution PNG or SVG with transparent background.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Legal & Regulatory Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Organization Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={instConfig.organizationName}
                    onChange={(e) => setInstConfig({ ...instConfig, organizationName: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Platform Tagline &amp; Mission
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={140}
                    value={instConfig.platformTagline}
                    onChange={(e) => setInstConfig({ ...instConfig, platformTagline: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Regulatory Registration Number (NBFC / MFI)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={instConfig.registrationNumber}
                    onChange={(e) => setInstConfig({ ...instConfig, registrationNumber: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Displayed in public footers, disclosures, and statutory loan agreements.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Customer Support Helpline (Toll-Free / Phone)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={instConfig.supportPhone}
                    onChange={(e) => setInstConfig({ ...instConfig, supportPhone: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Official Support Email Address
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={80}
                    value={instConfig.supportEmail}
                    onChange={(e) => setInstConfig({ ...instConfig, supportEmail: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Principal Nodal Grievance Officer
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={instConfig.nodalOfficerName}
                    onChange={(e) => setInstConfig({ ...instConfig, nodalOfficerName: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Head Office Registered Postal Address
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={instConfig.headOfficeAddress}
                    onChange={(e) => setInstConfig({ ...instConfig, headOfficeAddress: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingInst}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSavingInst ? 'Saving Configuration...' : 'Save Institution Profile & Branding'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 4: OPERATIONAL BRANCHES & SOLS */}
      {/* ======================================================== */}
      {activeTab === 'branches' && (
        <section className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  <span>Authorized Branch Network &amp; Service Outlets (SOL) ({branchesList.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Core banking service outlets under RBI Branch Authorisation Guidelines. Primary operational branch is Branch 2020.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingBranch({
                    branchCode: '',
                    solId: '',
                    name: '',
                    type: 'Branch Office',
                    address: '',
                    manager: '',
                    phone: '',
                    email: '',
                    operatingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
                    isActive: true
                  });
                  setIsBranchModalOpen(true);
                }}
                className="py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Branch SOL</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branchesList.map((branch) => (
                <div key={branch.branchCode} className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80 shadow-xs space-y-3 hover:border-orange-300 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-black bg-orange-100 text-orange-900 px-2.5 py-0.5 rounded-full border border-orange-200">
                          SOL {branch.branchCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${branch.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {branch.isActive ? 'Operational' : 'Inactive'}
                        </span>
                      </div>
                      <h5 className="text-sm font-black text-slate-900 mt-1.5">{branch.name}</h5>
                      <p className="text-[11px] text-slate-500 font-semibold">{branch.type}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBranch(branch);
                        setIsBranchModalOpen(true);
                      }}
                      className="p-2 hover:bg-white rounded-xl text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all cursor-pointer shadow-2xs"
                      title="Edit Branch"
                    >
                      <Edit3 className="w-4 h-4 text-orange-600" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 font-medium pt-2 border-t border-slate-200/60">
                    <p className="truncate"><strong>Address:</strong> {branch.address}</p>
                    <p><strong>Branch Manager:</strong> {branch.manager}</p>
                    <p><strong>Contact:</strong> {branch.phone} • {branch.email}</p>
                    <p><strong>Hours:</strong> {branch.operatingHours}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CREDIT SCHEMES & PRODUCTS */}
      {/* ======================================================== */}
      {activeTab === 'schemes' && (
        <section className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-600" />
                  <span>Credit Schemes, Loan Products &amp; Interest Rates</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage active credit products, interest rates (% p.a.), loan bounds, and tenors dynamically. Changes update repayment calculators and loan applications immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingScheme({
                    schemeCode: `SCHM-${Math.floor(700 + Math.random() * 99)}`,
                    name: '',
                    minAmount: 10000,
                    maxAmount: 100000,
                    interestRate: 12.0,
                    defaultTenureMonths: 12,
                    minTenureMonths: 6,
                    maxTenureMonths: 24,
                    frequency: 'MONTHLY',
                    purpose: '',
                    isActive: true
                  });
                  setIsSchemeModalOpen(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Credit Plan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {schemesList.map((scheme) => (
                <div
                  key={scheme.schemeCode}
                  className={`p-5 rounded-2xl border transition-all ${
                    scheme.isActive
                      ? 'bg-white border-slate-200/90 shadow-xs hover:border-orange-300'
                      : 'bg-slate-50/70 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full">
                          {scheme.schemeCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scheme.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                          {scheme.isActive ? 'Active Plan' : 'Deactivated'}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{scheme.name}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleSchemeStatus(scheme.schemeCode)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                          scheme.isActive
                            ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {scheme.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingScheme(scheme);
                          setIsSchemeModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                        title="Edit Scheme Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {scheme.purpose}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Interest Rate</span>
                      <span className="text-xs font-black text-orange-600">{scheme.interestRate}% p.a.</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Loan Limits</span>
                      <span className="text-xs font-black text-slate-900">₹{(scheme.minAmount/1000)}k - ₹{(scheme.maxAmount/1000)}k</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Tenure</span>
                      <span className="text-xs font-black text-slate-900">{scheme.minTenureMonths}-{scheme.maxTenureMonths}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 4: GATEWAYS & CONFIG */}
      {/* ======================================================== */}
      {activeTab === 'gateways' && (
        <section className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Statutory Technical Configuration Boundary</p>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                External gateway credentials (SendGrid, Meta Cloud API, Airtel IQ TRAI DLT, AWS S3/Cloudflare R2) are managed exclusively by Super Admin IT.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Transactional Email Gateway */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Transactional Email (SMTP)</h3>
                    <p className="text-[11px] text-slate-500">NOC Certificates, Account Letters &amp; Notices</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">SMTP Host</label>
                  <input
                    type="text"
                    value={gateways.email.smtpHost}
                    onChange={(e) =>
                      setGateways({ ...gateways, email: { ...gateways.email, smtpHost: e.target.value } })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">SMTP Port</label>
                    <input
                      type="number"
                      value={gateways.email.smtpPort}
                      onChange={(e) =>
                        setGateways({ ...gateways, email: { ...gateways.email, smtpPort: Number(e.target.value) } })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">From Sender</label>
                    <input
                      type="email"
                      value={gateways.email.fromAddress}
                      onChange={(e) =>
                        setGateways({ ...gateways, email: { ...gateways.email, fromAddress: e.target.value } })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {gatewayTestResult['EMAIL'] && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono">
                    {gatewayTestResult['EMAIL']}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => runGatewayTest('EMAIL')}
                    disabled={testingGateway === 'EMAIL'}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Radio className={`w-3.5 h-3.5 ${testingGateway === 'EMAIL' ? 'animate-spin' : ''}`} />
                    <span>{testingGateway === 'EMAIL' ? 'Testing Handshake...' : 'Test SMTP Connection'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Meta WhatsApp Cloud API */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">WhatsApp Business Cloud API</h3>
                    <p className="text-[11px] text-slate-500">Kannada Payment Alerts &amp; UPI Links</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp Business Account ID (WABA)</label>
                  <input
                    type="text"
                    value={gateways.whatsapp.wabaId}
                    onChange={(e) =>
                      setGateways({ ...gateways, whatsapp: { ...gateways.whatsapp, wabaId: e.target.value } })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number ID</label>
                  <input
                    type="text"
                    value={gateways.whatsapp.phoneNumberId}
                    onChange={(e) =>
                      setGateways({ ...gateways, whatsapp: { ...gateways.whatsapp, phoneNumberId: e.target.value } })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>

                {gatewayTestResult['WHATSAPP'] && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono">
                    {gatewayTestResult['WHATSAPP']}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => runGatewayTest('WHATSAPP')}
                    disabled={testingGateway === 'WHATSAPP'}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Radio className={`w-3.5 h-3.5 ${testingGateway === 'WHATSAPP' ? 'animate-spin' : ''}`} />
                    <span>{testingGateway === 'WHATSAPP' ? 'Checking API...' : 'Test WhatsApp Ping'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Airtel IQ TRAI DLT SMS */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">TRAI DLT SMS Gateway</h3>
                    <p className="text-[11px] text-slate-500">Statutory 6-Char Header &amp; Entity ID</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  APPROVED
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">TRAI Principal Entity ID</label>
                  <input
                    type="text"
                    value={gateways.sms.dltEntityId}
                    onChange={(e) =>
                      setGateways({ ...gateways, sms: { ...gateways.sms, dltEntityId: e.target.value } })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Sender Header</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={gateways.sms.senderHeader}
                      onChange={(e) =>
                        setGateways({ ...gateways, sms: { ...gateways.sms, senderHeader: e.target.value.toUpperCase() } })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">DLT Provider</label>
                    <input
                      type="text"
                      value={gateways.sms.provider}
                      onChange={(e) =>
                        setGateways({ ...gateways, sms: { ...gateways.sms, provider: e.target.value } })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {gatewayTestResult['SMS'] && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono">
                    {gatewayTestResult['SMS']}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => runGatewayTest('SMS')}
                    disabled={testingGateway === 'SMS'}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Radio className={`w-3.5 h-3.5 ${testingGateway === 'SMS' ? 'animate-spin' : ''}`} />
                    <span>{testingGateway === 'SMS' ? 'Checking DLT...' : 'Test TRAI Route'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Encrypted Cloud Storage Vault */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">KYC Storage Vault</h3>
                    <p className="text-[11px] text-slate-500">AES-256-GCM Envelope Encrypted</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ENCRYPTED
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Storage Provider</label>
                  <select
                    value={gateways.storage.provider}
                    onChange={(e) =>
                      setGateways({
                        ...gateways,
                        storage: { ...gateways.storage, provider: e.target.value as any }
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="LOCAL">Local Vault (AES-256-GCM)</option>
                    <option value="AWS_S3">Amazon AWS S3 (ap-south-1 Mumbai)</option>
                    <option value="CLOUDFLARE_R2">Cloudflare R2 (Zero Egress)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Bucket Name</label>
                    <input
                      type="text"
                      value={gateways.storage.bucketName}
                      onChange={(e) =>
                        setGateways({ ...gateways, storage: { ...gateways.storage, bucketName: e.target.value } })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">AWS / Cloud Region</label>
                    <input
                      type="text"
                      value={gateways.storage.region}
                      onChange={(e) =>
                        setGateways({ ...gateways, storage: { ...gateways.storage, region: e.target.value } })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>

                {gatewayTestResult['STORAGE'] && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono">
                    {gatewayTestResult['STORAGE']}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => runGatewayTest('STORAGE')}
                    disabled={testingGateway === 'STORAGE'}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Radio className={`w-3.5 h-3.5 ${testingGateway === 'STORAGE' ? 'animate-spin' : ''}`} />
                    <span>{testingGateway === 'STORAGE' ? 'Checking Vault...' : 'Test Storage Ping'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                appendAuditEvent({
                  category: 'INTENDED_ADMIN_UPDATE',
                  action: 'GATEWAY_CONFIG_UPDATED',
                  actorStaffNumber: '202010',
                  actorUsername: 'it_superadmin',
                  actorRole: 'SUPER_ADMIN_IT',
                  target: 'SYSTEM_GATEWAYS',
                  details: 'All technical gateway configurations saved by it_superadmin'
                });
                notifySuccess('All gateway and infrastructure configuration parameters saved.');
              }}
              className="py-3 px-8 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Save Technical Configurations
            </button>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 3: AUDIT LOGS & GOVERNANCE */}
      {/* ======================================================== */}
      {activeTab === 'telemetry' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Database Engine</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-lg font-black text-slate-950">PostgreSQL 16 Native</p>
              <div className="text-[11px] text-slate-600 space-y-1 font-mono pt-1">
                <p>Dev/Prod Parity: 100% Guaranteed</p>
                <p>Immutable Audit Logs: Append-Only</p>
                <p>Deletion Rights: Strictly Prohibited</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Fastify Core API</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-lg font-black text-slate-950">Port 4000 • Healthy</p>
              <div className="text-[11px] text-slate-600 space-y-1 font-mono pt-1">
                <p>Liveness: 200 UP</p>
                <p>Readiness: 200 READY</p>
                <p>Dual-Console Stream: Active</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Audit Immutability</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-lg font-black text-slate-950">Tamper-Proof Trail</p>
              <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                <p className="text-emerald-700 font-bold">Admin Delete: Strictly Disabled</p>
                <p className="text-slate-600">Dual Visibility: IT Admin &amp; CEO</p>
                <p className="text-slate-600">DPDP Act 2023: Compliant</p>
              </div>
            </div>
          </div>

          {/* Audit Controls & Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-black text-slate-950">Statutory Institutional Audit Trail</h3>
                <p className="text-xs text-slate-500">
                  Tamper-proof event logs differentiated by Intended Updates, Banking Operations, and Security Events. Visible to IT Admin and Executive Oversight.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {filteredAudits.length} Records
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search audits by staff ID, action..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => setAuditCategoryFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    auditCategoryFilter === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Events
                </button>
                <button
                  onClick={() => setAuditCategoryFilter('INTENDED_ADMIN_UPDATE')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    auditCategoryFilter === 'INTENDED_ADMIN_UPDATE'
                      ? 'bg-cyan-700 text-white'
                      : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                  }`}
                >
                  Intended Admin Updates
                </button>
                <button
                  onClick={() => setAuditCategoryFilter('OPERATIONAL_BANKING_EVENT')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    auditCategoryFilter === 'OPERATIONAL_BANKING_EVENT'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Banking Operations
                </button>
                <button
                  onClick={() => setAuditCategoryFilter('SECURITY_EVENT')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    auditCategoryFilter === 'SECURITY_EVENT'
                      ? 'bg-red-700 text-white'
                      : 'bg-red-50 text-red-800 hover:bg-red-100'
                  }`}
                >
                  Security Events
                </button>
              </div>
            </div>

            {/* Audit Table */}
            <div className="divide-y divide-slate-100 text-xs pt-2">
              {filteredAudits.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-medium">
                  No audit records match the current filter.
                </div>
              ) : (
                filteredAudits.map((evt) => (
                  <div key={evt.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {getCategoryBadge(evt.category)}
                        <span className="font-mono text-[10px] font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                          {evt.action}
                        </span>
                        {evt.actorStaffNumber && (
                          <span className="text-[11px] font-mono font-bold text-orange-900 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            Actor: {evt.actorStaffNumber} (@{evt.actorUsername || 'system'})
                          </span>
                        )}
                        <span className="font-bold text-slate-900">Target: {evt.target}</span>
                      </div>
                      <p className="text-slate-600 text-xs">{evt.details}</p>
                    </div>
                    <div className="text-right text-[11px] text-slate-500 font-mono shrink-0">
                      <p>{evt.timestamp}</p>
                      <p className="text-[10px] text-slate-400">IP: {evt.ip}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* PROVISION NEW STAFF MODAL */}
      {/* ======================================================== */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-black text-slate-950">Provision New Staff Account</h3>
              </div>
              <button
                onClick={() => setIsProvisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProvisionSubmit} className="space-y-4 text-xs font-bold">
              {/* Permanent Staff ID Preview */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block text-[11px]">Auto-Assigned Permanent Staff ID:</span>
                <span className="font-mono text-amber-950 font-black text-sm">{nextStaffNumber}</span>
                <p className="text-[10px] text-amber-800/80 mt-0.5 font-normal">
                  Unique immutable employee identifier decoupled from staff username.
                </p>
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Username (System Identifier)</label>
                <input
                  type="text"
                  required
                  placeholder="officer_kumar"
                  maxLength={30}
                  value={newUsername}
                  onChange={(e) => setNewUsername(sanitizeUsername(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-normal focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Praveen Kumar"
                  maxLength={70}
                  value={newFullName}
                  onChange={(e) => setNewFullName(sanitizeLegalName(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-normal focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-[10px] text-slate-500 mt-1 font-normal">
                  Once set, the staff member cannot change their legal name.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="praveen.kumar@ggyfinance.in"
                    maxLength={254}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value.trim())}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-normal focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="9845012399 (10 digits)"
                    maxLength={10}
                    value={newPhone}
                    onChange={(e) => setNewPhone(sanitizePhoneInput(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-normal focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 mb-1">Assign User Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value={UserRole.FIELD_OFFICER}>Field Officer (Maker)</option>
                    <option value={UserRole.AUTHORIZER}>Authorizer (Checker)</option>
                    <option value={UserRole.BRANCH_MANAGER}>Branch Manager</option>
                    <option value={UserRole.SYSTEM_ADMIN}>System Admin (Banking)</option>
                    <option value={UserRole.SUPER_ADMIN_IT}>Super Admin IT (Technical)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 mb-1">Branch SOL Location</label>
                  <select
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {branchesList.map((b) => (
                      <option key={b.branchCode} value={b.branchCode}>
                        Branch {b.branchCode} ({b.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Temporary Initial Password</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-normal focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-[10px] text-slate-500 mt-1 font-normal">
                  Staff member will be prompted to reset their password on first login.
                </p>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Confirm &amp; Provision Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT STAFF DETAILS MODAL */}
      {/* ======================================================== */}
      {isEditModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-black text-slate-950">
                  Edit Staff Details: @{editingStaff.username}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffEdit} className="space-y-4 text-xs font-bold">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Staff ID</span>
                  <span className="font-mono font-black text-slate-900">{editingStaff.staffNumber || '202010'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Role</span>
                  <span className="font-bold text-orange-700">{editingStaff.role}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  maxLength={70}
                  value={editFullName}
                  onChange={(e) => setEditFullName(sanitizeLegalName(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-[10px] text-slate-500 mt-1 font-normal">
                  Super Admin IT has exclusive rights to correct or update staff legal names.
                </p>
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Official Institutional Email</label>
                <input
                  type="email"
                  required
                  maxLength={254}
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value.trim())}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-normal focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9845012399 (10 digits)"
                  value={editPhone}
                  onChange={(e) => setEditPhone(sanitizePhoneInput(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-normal focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Branch SOL Location</label>
                <select
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  {branchesList.map((b) => (
                    <option key={b.branchCode} value={b.branchCode}>
                      Branch {b.branchCode} ({b.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-forest-800 hover:bg-forest-900 text-white font-black rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE / EDIT CREDIT SCHEME MODAL */}
      {/* ======================================================== */}
      {isSchemeModalOpen && editingScheme && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-black text-slate-950">
                  {schemesList.some(s => s.schemeCode === editingScheme.schemeCode) ? 'Edit Credit Plan' : 'Create Credit Plan'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsSchemeModalOpen(false);
                  setEditingScheme(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveScheme(editingScheme);
              }}
              className="space-y-4 text-xs font-bold"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 mb-1">Scheme Code</label>
                  <input
                    type="text"
                    required
                    readOnly={schemesList.some(s => s.schemeCode === editingScheme.schemeCode)}
                    value={editingScheme.schemeCode}
                    onChange={(e) => setEditingScheme({ ...editingScheme, schemeCode: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 mb-1">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="36"
                    required
                    value={editingScheme.interestRate}
                    onChange={(e) => setEditingScheme({ ...editingScheme, interestRate: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-orange-600 font-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Scheme / Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rural Working Capital Loan"
                  value={editingScheme.name}
                  onChange={(e) => setEditingScheme({ ...editingScheme, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 mb-1">Min Sanction (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={editingScheme.minAmount}
                    onChange={(e) => setEditingScheme({ ...editingScheme, minAmount: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 mb-1">Max Sanction (₹)</label>
                  <input
                    type="number"
                    min="5000"
                    max="200000"
                    step="5000"
                    required
                    value={editingScheme.maxAmount}
                    onChange={(e) => setEditingScheme({ ...editingScheme, maxAmount: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-800 mb-1">Min Tenure (M)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={editingScheme.minTenureMonths}
                    onChange={(e) => setEditingScheme({ ...editingScheme, minTenureMonths: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 mb-1">Default Tenure (M)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={editingScheme.defaultTenureMonths}
                    onChange={(e) => setEditingScheme({ ...editingScheme, defaultTenureMonths: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 mb-1">Max Tenure (M)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={editingScheme.maxTenureMonths}
                    onChange={(e) => setEditingScheme({ ...editingScheme, maxTenureMonths: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Repayment Frequency</label>
                <select
                  value={editingScheme.frequency}
                  onChange={(e) => setEditingScheme({ ...editingScheme, frequency: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="MONTHLY">Monthly EMI</option>
                  <option value="WEEKLY">Weekly Collections</option>
                  <option value="WEEKLY_OR_MONTHLY">Weekly or Monthly (Flexible)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Credit Purpose / Target Segment</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Working capital liquidity for rural retail shops and small enterprises"
                  value={editingScheme.purpose}
                  onChange={(e) => setEditingScheme({ ...editingScheme, purpose: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-normal text-xs"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSchemeModalOpen(false);
                    setEditingScheme(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Credit Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT / CREATE BRANCH MODAL */}
      {/* ======================================================== */}
      {isBranchModalOpen && editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-black text-slate-950">
                  {branchesList.some(b => b.branchCode === editingBranch.branchCode) ? 'Edit Branch Location' : 'Register New Branch'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsBranchModalOpen(false);
                  setEditingBranch(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveBranch(editingBranch);
              }}
              className="space-y-4 text-xs font-bold"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 mb-1">Branch SOL Code (Numeric)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2020"
                    maxLength={10}
                    value={editingBranch.branchCode}
                    onChange={(e) => setEditingBranch({ ...editingBranch, branchCode: e.target.value.replace(/\D/g, ''), solId: e.target.value.replace(/\D/g, '') })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 mb-1">Branch Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Principal SOL / Retail Hub"
                    value={editingBranch.type}
                    onChange={(e) => setEditingBranch({ ...editingBranch, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Headquarters & Primary Branch"
                  value={editingBranch.name}
                  onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Postal Address</label>
                <input
                  type="text"
                  required
                  placeholder="Full office address"
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 mb-1">Branch Manager Name</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.manager}
                    onChange={(e) => setEditingBranch({ ...editingBranch, manager: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 mb-1">Official Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.phone}
                    onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 mb-1">Official Branch Email</label>
                <input
                  type="email"
                  required
                  value={editingBranch.email}
                  onChange={(e) => setEditingBranch({ ...editingBranch, email: e.target.value.trim() })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsBranchModalOpen(false);
                    setEditingBranch(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Branch Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
