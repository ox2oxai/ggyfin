'use client';

import React, { useState } from 'react';
import {
  LoanPurpose,
  LoanPurposeLabels,
  calculateEMI,
  Gender,
  generateUpiUri
} from '@nbfc/shared';
import {
  Smartphone,
  Shield,
  UserPlus,
  Upload,
  Camera,
  CheckCircle,
  QrCode,
  IndianRupee,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export default function FieldOfficerPage() {
  // Form State
  const [fullName, setFullName] = useState('Suresh Gowda');
  const [phone, setPhone] = useState('9845012345');
  const [dob, setDob] = useState('1988-06-20');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [addressLine, setAddressLine] = useState('Near Kalikamba Temple, Maddur Taluk');
  const [pincode, setPincode] = useState('571428');
  const [state, setState] = useState('Karnataka');
  const [aadhaarLast4, setAadhaarLast4] = useState('4821');
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose>(LoanPurpose.DAIRY_LIVESTOCK);
  const [principalAmount, setPrincipalAmount] = useState<number>(75000);
  const [tenureMonths, setTenureMonths] = useState<number>(18);
  const [consentGranted, setConsentGranted] = useState(true);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dynamic UPI Repayment QR Modal State
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrAmount, setQrAmount] = useState<number>(4650);
  const [activeUpiUri, setActiveUpiUri] = useState('');

  const currentLoanConfig = LoanPurposeLabels[loanPurpose];
  const calculatedEmi = calculateEMI(principalAmount, currentLoanConfig.defaultRate, tenureMonths);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 700);
  };

  const handleOpenUpiQr = () => {
    const uri = generateUpiUri({
      vpa: 'ggycollect@icici',
      payeeName: 'GGY Finance',
      amount: qrAmount,
      transactionRef: `UPI${Date.now().toString().slice(-8)}`,
      accountNumber: 'ACC-8921-DEMO'
    });
    setActiveUpiUri(uri);
    setShowQrModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-sandstone-50 p-6 rounded-3xl border border-clay shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-100 mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Field Officer Mode • Maker Persona</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-forest-900">Doorstep Customer Onboarding</h2>
          <p className="text-xs text-forest-800/70 mt-0.5">Captures customer KYC with UIDAI Aadhaar masking & DPDP consent.</p>
        </div>

        {/* Quick Collection UPI Button */}
        <button
          onClick={handleOpenUpiQr}
          className="inline-flex items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>Instant UPI Repayment QR</span>
        </button>
      </div>

      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Application Drafted & Submitted to Authorizer Queue!</p>
            <p className="mt-1 text-emerald-800">
              Customer Information File (CIF) and Draft Account created. Status is set to <strong>PENDING_APPROVAL</strong>.
              Under RBI 4-Eyes rules, the Authorizer/Checker must now audit the masked KYC before funds are disbursed.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-3 text-xs font-bold text-emerald-700 underline"
            >
              Onboard Another Customer
            </button>
          </div>
        </div>
      )}

      {/* Main Onboarding Form */}
      <form onSubmit={handleSubmitApplication} className="bg-sandstone-50 rounded-3xl p-6 sm:p-8 border border-clay shadow-xs space-y-6">
        <div className="border-b border-clay/60 pb-4">
          <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-terracotta-500" />
            <span>1. Customer Personal Profile</span>
          </h3>
          <p className="text-xs text-forest-800/70">Legal identification as per Indian KYC Master Directions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-forest-900 mb-1">Customer Full Name (as per Govt ID)</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:ring-2 focus:ring-terracotta-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-forest-900 mb-1">Mobile Number (Indian 10-Digit)</label>
            <input
              type="tel"
              required
              pattern="[6-9][0-9]{9}"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:ring-2 focus:ring-terracotta-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-forest-900 mb-1">Date of Birth</label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:ring-2 focus:ring-terracotta-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-forest-900 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:ring-2 focus:ring-terracotta-500 outline-hidden"
            >
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.OTHER}>Other</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-forest-900 mb-1">Village / Town Address</label>
            <input
              type="text"
              required
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:ring-2 focus:ring-terracotta-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-forest-900 mb-1">6-Digit PIN Code</label>
            <input
              type="text"
              required
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:ring-2 focus:ring-terracotta-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-forest-900 mb-1">State</label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:ring-2 focus:ring-terracotta-500 outline-hidden"
            />
          </div>
        </div>

        {/* UIDAI Masked Aadhaar Section */}
        <div className="border-t border-clay/60 pt-5 space-y-4">
          <div>
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>2. UIDAI-Compliant Masked Aadhaar Entry</span>
            </h3>
            <p className="text-xs text-forest-800/70">
              UIDAI Aadhaar Act strict rule: The system automatically masks the first 8 digits. Enter only the last 4 digits.
            </p>
          </div>

          <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay max-w-md">
            <label className="block text-xs font-bold text-forest-900 mb-1">
              Aadhaar Number (First 8 Digits Legally Masked)
            </label>
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="bg-sandstone-200 px-3 py-2 rounded-xl text-forest-800 font-bold border border-clay">
                XXXX - XXXX -
              </span>
              <input
                type="text"
                maxLength={4}
                required
                value={aadhaarLast4}
                onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className="w-24 p-2 bg-sandstone-50 border border-clay rounded-xl text-center font-bold text-forest-900 tracking-widest focus:ring-2 focus:ring-terracotta-500 outline-hidden"
              />
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Full Masked ID: XXXX-XXXX-{aadhaarLast4 || 'XXXX'} (Zero plain Aadhaar exposure)</span>
            </p>
          </div>

          {/* Document Upload Simulation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="border-2 border-dashed border-clay rounded-2xl p-4 text-center bg-sandstone-100/50 hover:bg-sandstone-100 transition-all cursor-pointer">
              <Camera className="w-6 h-6 text-terracotta-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-forest-900">Capture Live Customer Selfie</p>
              <p className="text-[10px] text-forest-800/60 mt-0.5">Will be AES-256-GCM encrypted in vault</p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ Ready for Field Camera
              </span>
            </div>

            <div className="border-2 border-dashed border-clay rounded-2xl p-4 text-center bg-sandstone-100/50 hover:bg-sandstone-100 transition-all cursor-pointer">
              <Upload className="w-6 h-6 text-terracotta-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-forest-900">Scan Masked ID Proof</p>
              <p className="text-[10px] text-forest-800/60 mt-0.5">Aadhaar card / Voter ID / Ration card</p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ Ready for Field Scanner
              </span>
            </div>
          </div>
        </div>

        {/* Loan Request Parameters */}
        <div className="border-t border-clay/60 pt-5 space-y-4">
          <div>
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-terracotta-500" />
              <span>3. Loan Terms & Reducing Balance EMI</span>
            </h3>
            <p className="text-xs text-forest-800/70">Select the intended rural livelihood purpose and amount.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-forest-900 mb-1">Loan Purpose</label>
              <select
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value as LoanPurpose)}
                className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 focus:ring-2 focus:ring-terracotta-500 outline-hidden font-medium"
              >
                {(Object.keys(LoanPurposeLabels) as LoanPurpose[]).map((p) => (
                  <option key={p} value={p}>{LoanPurposeLabels[p].title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-forest-900 mb-1">Principal Amount (₹)</label>
              <input
                type="number"
                step="5000"
                min="5000"
                max={currentLoanConfig.maxAmount}
                value={principalAmount}
                onChange={(e) => setPrincipalAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-bold focus:ring-2 focus:ring-terracotta-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-forest-900 mb-1">Tenure (Months)</label>
              <select
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full p-2.5 bg-sandstone-100 border border-clay rounded-xl text-forest-900 font-bold focus:ring-2 focus:ring-terracotta-500 outline-hidden"
              >
                <option value={6}>6 Months</option>
                <option value={12}>12 Months (1 Year)</option>
                <option value={18}>18 Months</option>
                <option value={24}>24 Months (2 Years)</option>
                <option value={36}>36 Months (3 Years)</option>
              </select>
            </div>
          </div>

          {/* Real-time Math Summary */}
          <div className="bg-forest-800 text-sandstone-100 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <p className="text-xs text-sandstone-300">Estimated Reducing Balance EMI:</p>
              <p className="text-2xl font-black text-white">₹{calculatedEmi.toLocaleString('en-IN')} <span className="text-xs font-normal text-sandstone-300">/ month</span></p>
            </div>
            <div className="text-right text-xs text-sandstone-300">
              <p>Annual Rate: <strong>{currentLoanConfig.defaultRate}%</strong></p>
              <p>Total Repayable: <strong>₹{(calculatedEmi * tenureMonths).toLocaleString('en-IN')}</strong></p>
            </div>
          </div>
        </div>

        {/* DPDP Act 2023 Explicit Consent */}
        <div className="p-4 bg-sandstone-100 rounded-2xl border border-clay flex items-start gap-3">
          <input
            type="checkbox"
            id="dpdpConsent"
            required
            checked={consentGranted}
            onChange={(e) => setConsentGranted(e.target.checked)}
            className="mt-1 w-4 h-4 accent-terracotta-600 rounded cursor-pointer"
          />
          <label htmlFor="dpdpConsent" className="text-xs text-forest-900 font-medium leading-relaxed">
            <strong>DPDP Act 2023 Mandatory Declaration:</strong> Customer explicitly consents to verification of masked identity documents and loan disbursement under the RBI Fair Practices Code.
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-forest-800 hover:bg-forest-900 text-sandstone-50 font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-terracotta-400" />
              <span>Encrypting KYC & Submitting Draft to Authorizer...</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 text-terracotta-400" />
              <span>Submit for Maker-Checker Review (RBI Dual-Control)</span>
            </>
          )}
        </button>
      </form>

      {/* Dynamic UPI Repayment QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-forest-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-sandstone-50 max-w-sm w-full rounded-3xl p-6 border border-clay shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800">Dynamic Inward Repayment</span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-forest-800 hover:text-terracotta-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="w-16 h-16 bg-terracotta-50 rounded-2xl flex items-center justify-center mx-auto border border-terracotta-200">
              <QrCode className="w-8 h-8 text-terracotta-600" />
            </div>

            <h4 className="font-extrabold text-lg text-forest-900">Scan to Repay via UPI</h4>
            <p className="text-xs text-forest-800/70">
              Dynamic NPCI Universal QR for PhonePe, GPay, Paytm, or BHIM.
            </p>

            <div className="p-3 bg-sandstone-100 rounded-xl border border-clay">
              <div className="text-xs text-forest-800/70">Repayment Amount:</div>
              <div className="text-2xl font-black text-terracotta-600">₹{qrAmount.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-forest-800/60 mt-1">Beneficiary: GGY Finance</div>
            </div>

            {/* Simulated Live QR Code Visual Box */}
            <div className="p-6 bg-white rounded-2xl border-2 border-forest-800 shadow-inner flex flex-col items-center justify-center space-y-2">
              <div className="w-40 h-40 bg-sandstone-100 border border-clay rounded-xl flex items-center justify-center p-2">
                <QrCode className="w-36 h-36 text-forest-900" />
              </div>
              <p className="text-[10px] font-mono text-forest-800/60 break-all px-2">
                {activeUpiUri}
              </p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-forest-800 text-white rounded-xl text-xs font-bold hover:bg-forest-900"
            >
              Done / Close Repayment Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
