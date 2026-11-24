import React, { useState, useEffect } from 'react';
import {
  fetchDriverKycStatus,
  submitDriverKyc,
  adminApproveDriver,
  getStoredDriver
} from '../../services/driverService';

export default function DriverKyc({ onNavigate, onBack }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [kycData, setKycData] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form State (Clean & blank by default for real rider inputs)
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [vehicleType, setVehicleType] = useState('Motorcycle');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await fetchDriverKycStatus();
      setKycData(res);
      if (res.documents && Object.keys(res.documents).length > 0) {
        if (res.documents.fullName) setFullName(res.documents.fullName);
        if (res.documents.city) setCity(res.documents.city);
        if (res.documents.vehicleType) setVehicleType(res.documents.vehicleType);
        if (res.documents.vehicleNumber) setVehicleNumber(res.documents.vehicleNumber);
        if (res.documents.drivingLicenseNumber) setDrivingLicenseNumber(res.documents.drivingLicenseNumber);
        if (res.documents.aadharNumber) setAadharNumber(res.documents.aadharNumber);
        if (res.documents.bankDetails) {
          setBankName(res.documents.bankDetails.bankName || '');
          setAccountNumber(res.documents.bankDetails.accountNumber || '');
          setIfscCode(res.documents.bankDetails.ifscCode || '');
        }
      }
    } catch (err) {
      console.warn('KYC status load notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = getStoredDriver();
    if (stored?.name && !stored.name.toLowerCase().includes('fleet rider')) {
      setFullName(stored.name);
    }
    loadStatus();
  }, []);

  const handleAutoFillSample = () => {
    setFullName('Shruti Paliwal');
    setCity('Indore');
    setVehicleType('Motorcycle');
    setVehicleNumber('MP-09-AB-4821');
    setDrivingLicenseNumber('DL-0920210048123');
    setAadharNumber('8492-3104-9912');
    setBankName('HDFC Bank');
    setAccountNumber('501004928172');
    setIfscCode('HDFC0001234');
    triggerToast('Sample KYC details auto-filled! ⚡');
  };

  const handleSubmitKyc = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        fullName,
        city,
        vehicleType,
        vehicleNumber,
        drivingLicenseNumber,
        aadharNumber,
        bankName,
        accountNumber,
        ifscCode
      };
      const res = await submitDriverKyc(payload);
      triggerToast('✓ KYC Documents submitted successfully!');
      setIsEditing(false);
      await loadStatus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      triggerToast(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickApprove = async () => {
    const driverId = kycData?.driver?.id || (getStoredDriver()?.id);
    if (!driverId) {
      triggerToast('No active rider session found to approve');
      return;
    }
    setApproving(true);
    try {
      await adminApproveDriver(driverId, 'APPROVED');
      triggerToast('✓ Driver KYC approved by Operations Admin! Account is active.');
      setIsEditing(false);
      await loadStatus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      triggerToast(err.message || 'Approval failed');
    } finally {
      setApproving(false);
    }
  };

  const status = kycData?.status || 'PENDING';
  const isApproved = status === 'APPROVED';
  const isUnderReview = status === 'UNDER_REVIEW';

  const docs = kycData?.documents || {};
  const displayFullName = docs.fullName || fullName || kycData?.driver?.name || 'Rider Partner';
  const displayCity = docs.city || city || 'Bengaluru';
  const displayVehicleType = docs.vehicleType || vehicleType || 'Motorcycle';
  const displayVehicleNumber = docs.vehicleNumber || vehicleNumber || 'Pending Verification';
  const displayDL = docs.drivingLicenseNumber || drivingLicenseNumber || 'Pending Verification';
  const displayAadhar = docs.aadharNumber || aadharNumber || 'Pending Verification';
  const displayBankName = docs.bankDetails?.bankName || bankName || 'Pending Bank Details';
  const displayAccount = docs.bankDetails?.accountNumber || accountNumber || '';

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-slate-900 font-sans antialiased pb-20 selection:bg-pink-100 selection:text-[#b90041]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : window.history.back())}
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-700 text-sm font-bold cursor-pointer transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                Rider KYC &amp; Verification
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                SwiftFleet Partner Onboarding
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
              isApproved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isUnderReview
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {status.replace('_', ' ')}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">

        {/* STATE 1: APPROVED & ACTIVE SCREEN */}
        {isApproved && !isEditing && (
          <div className="space-y-6 animate-in fade-in">
            <section className="bg-emerald-50/90 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-3xl font-black shrink-0 shadow-md shadow-emerald-600/20">
                  ✓
                </span>
                <div className="space-y-1">
                  <span className="inline-block bg-emerald-200/70 text-emerald-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Verified Partner
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-emerald-950">
                    Rider Account Approved &amp; Active!
                  </h2>
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    Your Driving License, Vehicle Registration (RC), and Aadhar documents have been verified by Operations Admin. You are now authorized to accept doorstep deliveries and reverse pickups.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('driver_dashboard');
                    else window.location.href = '/driver-dashboard';
                  }}
                  className="w-full sm:flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>Launch Dispatch Desk ➔</span>
                </button>
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('available_tasks');
                    else window.location.href = '/available-tasks';
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-100 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  View Available Orders
                </button>
              </div>
            </section>

            {/* Approved Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-sm text-slate-900">Verified Rider Profile</h3>
                  <p className="text-xs text-slate-400">Official registered fleet credentials</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-[#b90041] hover:underline bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl border border-pink-200 cursor-pointer transition-colors"
                >
                  Update Documents ✏️
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rider Name</span>
                  <span className="font-black text-slate-800 text-sm block">{displayFullName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operating City</span>
                  <span className="font-bold text-slate-800 block">{displayCity}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle Registration (RC)</span>
                  <span className="font-bold text-slate-800 block uppercase">{displayVehicleNumber} ({displayVehicleType})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Driving License (DL)</span>
                  <span className="font-bold text-slate-800 block uppercase">{displayDL}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aadhar ID</span>
                  <span className="font-bold text-slate-800 block">{displayAadhar}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payout Settlement</span>
                  <span className="font-bold text-slate-800 block">{displayBankName} {displayAccount ? `•••• ${displayAccount.slice(-4)}` : '(Details Pending)'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATE 2: SUBMITTED & UNDER REVIEW SCREEN */}
        {isUnderReview && !isEditing && (
          <div className="space-y-6 animate-in fade-in">
            <section className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl font-black shrink-0 shadow-md shadow-amber-500/20 animate-pulse">
                  ⏳
                </span>
                <div className="space-y-1">
                  <span className="inline-block bg-amber-200/80 text-amber-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Application Under Review
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-amber-950">
                    KYC Documents Submitted for Verification
                  </h2>
                  <p className="text-xs text-amber-900 font-medium leading-relaxed">
                    Your details and government identity credentials have been received. The Operations team is actively verifying your Driving License &amp; Vehicle RC. Verification usually completes within 1-2 hours.
                  </p>
                </div>
              </div>

              {/* Operations Verification Status Banner */}
              <div className="p-4 bg-white/95 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-base shrink-0">
                    🛡️
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-900">Verification in Progress</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Our Operations Admin team verifies DL, RC, and Aadhar. Estimated review: 1-2 hours.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                  In Queue
                </span>
              </div>

              {/* Fast Ops Admin Approve for Demo & Testing */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-200/80">
                <div className="text-xs text-amber-900">
                  <p className="font-extrabold flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>Testing &amp; Demo Mode:</span>
                  </p>
                  <p className="text-[11px] text-amber-800 font-medium">Ops Admin ka intezar kiye bina account ko turant approve karein</p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickApprove}
                  disabled={approving}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>{approving ? 'Approving Account...' : '⚡ Fast Ops Admin Approve (Activate Now)'}</span>
                </button>
              </div>
            </section>

            {/* Submitted Application Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-sm text-slate-900">Submitted Documents Summary</h3>
                  <p className="text-xs text-slate-400">Details queued for administrative review</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-[#b90041] hover:underline bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl border border-pink-200 cursor-pointer transition-colors"
                >
                  Edit / Update Details ✏️
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                  <span className="font-black text-slate-800 text-sm block">{displayFullName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City</span>
                  <span className="font-bold text-slate-800 block">{displayCity}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle Registration (RC)</span>
                  <span className="font-bold text-slate-800 block uppercase">{displayVehicleNumber} ({displayVehicleType})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Driving License (DL)</span>
                  <span className="font-bold text-slate-800 block uppercase">{displayDL}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aadhar Card</span>
                  <span className="font-bold text-slate-800 block">{displayAadhar}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bank Payout Info</span>
                  <span className="font-bold text-slate-800 block">{displayBankName}</span>
                </div>
              </div>

              {/* Navigation to Dashboard */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) onNavigate('driver_dashboard');
                    else window.location.href = '/driver-dashboard';
                  }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
                >
                  Go to Driver Home / Task Board ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE 3: DOCUMENT SUBMISSION FORM (PENDING OR EDITING MODE) */}
        {(status === 'PENDING' || isEditing) && (
          <form onSubmit={handleSubmitKyc} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6 animate-in fade-in">
            {/* Context Notice */}
            {isEditing ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 font-semibold flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span>✏️</span>
                  <span>You are editing previously submitted documents. Re-submitting will update your review record.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-amber-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="bg-pink-50 border border-pink-200 p-4 rounded-2xl text-xs text-[#b90041] font-semibold flex items-center gap-2">
                <span>ℹ️</span>
                <span>Complete your verification once to start earning daily payouts with Meesho SwiftFleet.</span>
              </div>
            )}

            {/* Testing Auto-Fill Banner */}
            <div className="bg-amber-50/90 border-2 border-amber-300 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">Demo / Testing Helper</h4>
                  <p className="text-[11px] text-amber-800">Ek click me saari sample details (Vehicle, DL, Aadhar, Bank) auto-fill karein</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutoFillSample}
                className="w-full sm:w-auto px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Auto-Fill Sample KYC ⚡
              </button>
            </div>

            {/* Section 1: Personal & Operating City */}
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-black text-base text-slate-900">
                1. Personal &amp; Operating City
              </h3>
              <p className="text-xs text-slate-400">
                Basic identification for route and hub allocation
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Rider Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Legal Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#b90041] focus:bg-white transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Primary Operating City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#b90041] focus:bg-white transition-colors"
                >
                  <option value="Bengaluru">Bengaluru (Electronic City / Koramangala)</option>
                  <option value="Noida">Noida / Greater Noida</option>
                  <option value="Delhi">Delhi NCR (South &amp; Central)</option>
                  <option value="Indore">Indore (Central Hub)</option>
                  <option value="Mumbai">Mumbai (Suburban &amp; Thane)</option>
                </select>
              </div>
            </div>

            {/* Section 2: Vehicle & Driving License */}
            <div className="border-b border-slate-100 pb-4 pt-2">
              <h3 className="font-black text-base text-slate-900">
                2. Vehicle &amp; Driving License (DL / RC)
              </h3>
              <p className="text-xs text-slate-400">
                Vehicle registration and legal driving permit verification
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Vehicle Type *
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#b90041] focus:bg-white transition-colors"
                >
                  <option value="Motorcycle">Motorcycle (Hero Splendor, Pulsar, etc.)</option>
                  <option value="Scooter">Scooter (Honda Activa, Jupiter)</option>
                  <option value="Electric Vehicle (EV)">Electric Two-Wheeler (EV)</option>
                  <option value="Bicycle">Bicycle (Hyperlocal &lt; 2km)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Vehicle Registration No (RC) *
                </label>
                <input
                  type="text"
                  placeholder="Enter RC (e.g. MP-09-AB-1234)"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:border-[#b90041] focus:bg-white transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Driving License Number (DL) *
                </label>
                <input
                  type="text"
                  placeholder="Enter Driving License Number"
                  value={drivingLicenseNumber}
                  onChange={(e) => setDrivingLicenseNumber(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:border-[#b90041] focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Section 3: Aadhar & Identity */}
            <div className="border-b border-slate-100 pb-4 pt-2">
              <h3 className="font-black text-base text-slate-900">
                3. Aadhar &amp; Identity Verification
              </h3>
              <p className="text-xs text-slate-400">
                Government identification for doorstep customer safety
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                12-Digit Aadhar Card Number *
              </label>
              <input
                type="text"
                placeholder="Enter 12-Digit Aadhar Number"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#b90041] focus:bg-white transition-colors"
                required
              />
            </div>

            {/* Section 4: Bank Account for Payouts */}
            <div className="border-b border-slate-100 pb-4 pt-2">
              <h3 className="font-black text-base text-slate-900">
                4. Bank Account for Daily Payouts
              </h3>
              <p className="text-xs text-slate-400">
                Direct settlement for delivery fees and incentives
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Bank Name</label>
                <input
                  type="text"
                  placeholder="Bank Name (e.g. SBI, HDFC)"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#b90041]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Account Number</label>
                <input
                  type="text"
                  placeholder="Bank Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#b90041]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">IFSC Code</label>
                <input
                  type="text"
                  placeholder="IFSC Code (e.g. SBIN0001234)"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold uppercase focus:outline-none focus:border-[#b90041]"
                />
              </div>
            </div>

            {/* Auto-fill trigger above submit */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-500 font-medium">Testing Mode:</span>
              <button
                type="button"
                onClick={handleAutoFillSample}
                className="text-[#b90041] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>⚡</span>
                <span>Auto-Fill Sample Details</span>
              </button>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-4 px-6 rounded-2xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  submitting
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#b90041] to-[#df2457] hover:brightness-105 active:scale-[0.99]'
                }`}
              >
                <span>
                  {submitting
                    ? 'Submitting Documents...'
                    : isEditing
                    ? 'Update & Re-submit Documents ➔'
                    : 'Submit Documents for Verification ➔'}
                </span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
