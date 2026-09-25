import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// System Default Rules Matrix
const INITIAL_FAULT_RULES = [
  {
    id: 'RULE-01',
    category: 'Supplier Fault',
    reason: 'Defective / Damaged / Torn Fabric / Missing Parts',
    supplierShare: 100,
    resellerShare: 0,
    platformSubsidy: 0,
    customerRefund: 100,
    marginReversal: '100% Margin Cancelled (0 Penalty)',
    autoDebitTrigger: 'Hub Reverse Inward QC',
    spfEligible: 'No (Supplier Accountable)',
    status: 'Active',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  },
  {
    id: 'RULE-02',
    category: 'Supplier Fault',
    reason: 'Wrong Product / Incorrect Size / Color Mismatch Sent',
    supplierShare: 100,
    resellerShare: 0,
    platformSubsidy: 0,
    customerRefund: 100,
    marginReversal: '100% Margin Cancelled (0 Penalty)',
    autoDebitTrigger: 'Hub Reverse Inward QC',
    spfEligible: 'No (Dispatch Discrepancy)',
    status: 'Active',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  },
  {
    id: 'RULE-03',
    category: 'Buyer Remorse / Fit Issue',
    reason: 'Size Fitting Issue / Changed Mind / Style Preference',
    supplierShare: 0,
    resellerShare: 100, // or split per Reseller Protection Tier
    platformSubsidy: 0,
    customerRefund: 100,
    marginReversal: '100% Margin Cancelled + Base ROT Deducted',
    autoDebitTrigger: 'Driver Doorstep QC Pass',
    spfEligible: 'Yes (Supplier Restocked 0 Loss)',
    status: 'Active',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  {
    id: 'RULE-04',
    category: 'Dropshipper Error',
    reason: 'Misleading Description / False Fabric Claim in Catalog Link',
    supplierShare: 0,
    resellerShare: 100,
    platformSubsidy: 0,
    customerRefund: 100,
    marginReversal: '100% Margin Cancelled + ₹70 ROT Penalty',
    autoDebitTrigger: 'Customer Escalation Audit',
    spfEligible: 'Supplier Paid Full Base Price',
    status: 'Active',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  {
    id: 'RULE-05',
    category: 'Courier RTO (Undelivered)',
    reason: 'Customer Unreachable / Doorstep COD Refusal / Fake Address',
    supplierShare: 0,
    resellerShare: 0,
    platformSubsidy: 100,
    customerRefund: 0,
    marginReversal: 'Margin Cancelled (0 Penalty if RTO < 15%)',
    autoDebitTrigger: 'Courier RTO Return Manifested',
    spfEligible: 'Platform Subsidized Freight Pool',
    status: 'Active',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  {
    id: 'RULE-06',
    category: 'Fraudulent / Swapped Return',
    reason: 'Customer Returned Old/Used Clothes or Empty Box',
    supplierShare: 0,
    resellerShare: 0,
    platformSubsidy: 100,
    customerRefund: 0,
    marginReversal: 'Customer Account Blacklisted',
    autoDebitTrigger: 'SPF Tribunal Approved',
    spfEligible: '100% Supplier Reimbursement via SPF',
    status: 'Active',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
];

// Courier Weight Slabs & Freight Rate Cards
const INITIAL_WEIGHT_SLABS = [
  { slab: '0 - 500g (Light Apparel/Jewellery)', baseLocal: 45, baseRegional: 55, baseNational: 65, remoteSurcharge: 25 },
  { slab: '500g - 1kg (Footwear/Handbags)', baseLocal: 60, baseRegional: 75, baseNational: 85, remoteSurcharge: 30 },
  { slab: '1kg - 2kg (Winterwear/Home Sets)', baseLocal: 85, baseRegional: 105, baseNational: 125, remoteSurcharge: 45 },
  { slab: '> 2kg (Per Addl. 500g increment)', baseLocal: 25, baseRegional: 35, baseNational: 40, remoteSurcharge: 15 },
];

export default function AdminRotRulesConfigurator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('fault-matrix'); // 'fault-matrix' | 'rate-card' | 'simulator' | 'audit-log'
  const [rules, setRules] = useState(INITIAL_FAULT_RULES);
  const [weightSlabs, setWeightSlabs] = useState(INITIAL_WEIGHT_SLABS);
  const [editingRule, setEditingRule] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Simulator State
  const [simReason, setSimReason] = useState('RULE-01');
  const [simWeightSlab, setSimWeightSlab] = useState('0 - 500g (Light Apparel/Jewellery)');
  const [simZone, setSimZone] = useState('National'); // 'Local' | 'Regional' | 'National'
  const [simSellingPrice, setSimSellingPrice] = useState(1299);
  const [simBasePrice, setSimBasePrice] = useState(849);
  const [simResellerMargin, setSimResellerMargin] = useState(380);
  const [simResellerPlan, setSimResellerPlan] = useState('Standard'); // 'Standard' | 'Zero-Risk Lite' | 'High Margin Pro'

  // Calculate simulated ROT
  const currentSlabData = weightSlabs.find((s) => s.slab === simWeightSlab) || weightSlabs[0];
  const baseRotCharge =
    simZone === 'Local'
      ? currentSlabData.baseLocal
      : simZone === 'Regional'
      ? currentSlabData.baseRegional
      : currentSlabData.baseNational;

  const selectedRule = rules.find((r) => r.id === simReason) || rules[0];

  let calculatedSupplierRot = 0;
  let calculatedResellerRot = 0;
  let calculatedPlatformRot = 0;

  if (selectedRule.id === 'RULE-01' || selectedRule.id === 'RULE-02') {
    // Supplier Fault
    calculatedSupplierRot = baseRotCharge;
  } else if (selectedRule.id === 'RULE-03') {
    // Buyer Remorse - depends on Reseller plan
    if (simResellerPlan === 'Zero-Risk Lite') {
      calculatedPlatformRot = baseRotCharge; // Subsidized by Reseller ₹15 fee pool
    } else if (simResellerPlan === 'High Margin Pro') {
      calculatedResellerRot = baseRotCharge;
    } else {
      // Standard (50-50 or defined %):
      calculatedResellerRot = Math.round(baseRotCharge * (selectedRule.resellerShare / 100));
      calculatedSupplierRot = Math.round(baseRotCharge * (selectedRule.supplierShare / 100));
    }
  } else if (selectedRule.id === 'RULE-04') {
    // Dropshipper error
    calculatedResellerRot = baseRotCharge + 70; // Penalty added
  } else {
    // RTO or Fraud
    calculatedPlatformRot = baseRotCharge;
  }

  const handleUpdateRule = (e) => {
    e.preventDefault();
    if (!editingRule) return;

    setRules((prev) => prev.map((r) => (r.id === editingRule.id ? editingRule : r)));
    setEditingRule(null);
    setSaveSuccessMsg('System ROT Business Rule updated and deployed live to settlement microservice!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-900 pb-20 font-sans">
      {/* Top Breadcrumb & Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin-returns')}
              className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 flex items-center gap-1.5 text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>Back to Returns Hub</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[#b90041]/10 text-[#b90041] border border-[#b90041]/20">
                  Core Engine
                </span>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#b90041]">rule_settings</span>
                  ROT Business Rules & Freight Policy Engine
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage Return Order Transit (ROT) fault attribution, reverse rate cards, and automated settlement deductions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/dropshipper-rot-manager')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition"
            >
              <span className="material-symbols-outlined text-sm text-purple-600">storefront</span>
              Dropshipper View
            </button>
            <button
              onClick={() => navigate('/supplier-rot-ledger')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition"
            >
              <span className="material-symbols-outlined text-sm text-blue-600">inventory_2</span>
              Supplier Ledger
            </button>
            <button
              onClick={() => {
                setSaveSuccessMsg('System Rules Engine Synced with Core Settlement Database');
                setTimeout(() => setSaveSuccessMsg(''), 3500);
              }}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#b90041] to-[#900033] hover:from-[#a00038] hover:to-[#80002d] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              Sync Rules
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {saveSuccessMsg && (
          <div className="bg-emerald-50 border-t border-b border-emerald-200 px-4 py-2 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
            {saveSuccessMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-slate-100 overflow-x-auto">
          {[
            { id: 'fault-matrix', label: 'Fault Attribution Matrix', icon: 'splitscreen' },
            { id: 'rate-card', label: 'Courier Weight Slabs & Rates', icon: 'local_shipping' },
            { id: 'simulator', label: 'Interactive ROT Simulator', icon: 'calculate' },
            { id: 'audit-log', label: 'Settlement Auto-Triggers', icon: 'bolt' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-[#b90041] text-[#b90041] bg-[#b90041]/5'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Top Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#b90041]/10 text-[#b90041] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">gavel</span>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">Active Fault Rules</div>
              <div className="text-xl font-extrabold text-slate-900">{rules.length} Standard Policies</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-xs">check_circle</span> 100% Automated Logic
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">local_shipping</span>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">Avg. ROT Freight / Order</div>
              <div className="text-xl font-extrabold text-slate-900">₹68.40</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Surface Reverse Logistics</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">shield</span>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">Platform SPF Subsidy Pool</div>
              <div className="text-xl font-extrabold text-slate-900">₹14.85 Lakh</div>
              <div className="text-[11px] text-purple-600 font-medium mt-0.5">Fraud & Courier RTO Pool</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">handshake</span>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">Dispute Resolution Rate</div>
              <div className="text-xl font-extrabold text-slate-900">96.4%</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Auto-Reconciled &lt; 24h</div>
            </div>
          </div>
        </div>

        {/* TAB 1: FAULT ATTRIBUTION MATRIX */}
        {activeTab === 'fault-matrix' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#b90041]">balance</span>
                    System-Defined ROT Liability & Fault Rules Matrix
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Defines who absorbs the reverse transit cost when a customer triggers a return request.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Settlement Engine
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Rule ID & Category</th>
                      <th className="py-3 px-4">Customer Return Reason</th>
                      <th className="py-3 px-4 text-center">Supplier ROT %</th>
                      <th className="py-3 px-4 text-center">Reseller ROT %</th>
                      <th className="py-3 px-4 text-center">Platform Subsidized</th>
                      <th className="py-3 px-4">Reseller Margin Impact</th>
                      <th className="py-3 px-4">Auto-Debit Trigger</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">{rule.id}</div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mt-0.5 ${rule.badgeColor}`}>
                            {rule.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs">
                          {rule.reason}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded font-extrabold text-xs ${
                              rule.supplierShare === 100
                                ? 'bg-rose-100 text-rose-700'
                                : rule.supplierShare > 0
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {rule.supplierShare}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded font-extrabold text-xs ${
                              rule.resellerShare === 100
                                ? 'bg-purple-100 text-purple-700'
                                : rule.resellerShare > 0
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {rule.resellerShare}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded font-extrabold text-xs ${
                              rule.platformSubsidy === 100 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {rule.platformSubsidy}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{rule.marginReversal}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Cust. Refund: {rule.customerRefund}%</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-700 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-amber-600">electric_bolt</span>
                            {rule.autoDebitTrigger}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">SPF: {rule.spfEligible}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setEditingRule(rule)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">edit</span>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Explanatory Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-rose-50 border border-rose-200/70 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-rose-800 font-extrabold text-xs uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-base">inventory</span>
                  1. Supplier Fault Rule
                </div>
                <p className="text-xs text-rose-900/80 leading-relaxed">
                  Agar supplier ne defective, wrong size ya damaged product bheja hai, toh reverse logistics (ROT) ka 100% cost supplier ke payout se deduct hota hai. Reseller aur customer par zero penalty lagti hai.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200/70 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-purple-800 font-extrabold text-xs uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-base">person</span>
                  2. Buyer Remorse / Reseller Plan
                </div>
                <p className="text-xs text-purple-900/80 leading-relaxed">
                  Agar customer size fitting ya change-of-mind ke kaaran return karta hai, toh ROT Reseller ke chosen Return Protection Plan ke hisaab se deduct hota hai. Supplier ki inventory restock hoti hai.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200/70 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-blue-800 font-extrabold text-xs uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  3. SPF Protection Pool
                </div>
                <p className="text-xs text-blue-900/80 leading-relaxed">
                  Fraudulent ya swapped parcel case mein Supplier Protection Fund (SPF) se 100% claim approve hota hai aur reverse transit platform dwara absorb kiya jata hai.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURIER WEIGHT SLABS & RATE CARD */}
        {activeTab === 'rate-card' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#b90041]">scale</span>
                    Reverse Order Transit (ROT) Rate Card & Weight Slabs
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Standard negotiated reverse courier rates across Delhivery, Shadowfax, Xpressbees & Ecom Express.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Dead / Volumetric Weight Slab</th>
                      <th className="py-3 px-4 text-center">Intra-City / Local</th>
                      <th className="py-3 px-4 text-center">Regional (Same State)</th>
                      <th className="py-3 px-4 text-center">National (Metro to Non-Metro)</th>
                      <th className="py-3 px-4 text-center">Special Remote Surcharge</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {weightSlabs.map((slab, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-400 text-base">package_2</span>
                          {slab.slab}
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">
                          ₹{slab.baseLocal}.00
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">
                          ₹{slab.baseRegional}.00
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-[#b90041]">
                          ₹{slab.baseNational}.00
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-600 font-semibold">
                          +₹{slab.remoteSurcharge}.00
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Active Standard
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Courier Integrations */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">hub</span>
                Integrated Reverse Logistics Partners API Status
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Delhivery Reverse API', status: 'Connected', ping: '24ms', fee: 'Base ₹55' },
                  { name: 'Shadowfax Express QC', status: 'Connected', ping: '18ms', fee: 'Base ₹50' },
                  { name: 'Xpressbees Surface', status: 'Connected', ping: '32ms', fee: 'Base ₹52' },
                  { name: 'BlueDart Air Return', status: 'Standby', ping: '12ms', fee: 'Base ₹85' },
                ].map((c, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="text-xs font-bold text-slate-800">{c.name}</div>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {c.status}
                      </span>
                      <span className="text-slate-400 font-mono">{c.ping}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{c.fee}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE ROT SIMULATOR & CALCULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
            {/* Input Configurator (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#b90041]">calculate</span>
                  Live Return Order & ROT Settlement Simulator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulate real-time business rule execution for any return scenario before applying to orders.
                </p>
              </div>

              {/* Form Controls */}
              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Customer Return Reason
                  </label>
                  <select
                    value={simReason}
                    onChange={(e) => setSimReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#b90041]/30"
                  >
                    {rules.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id}: {r.reason} ({r.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parcel Weight Slab
                    </label>
                    <select
                      value={simWeightSlab}
                      onChange={(e) => setSimWeightSlab(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#b90041]/30"
                    >
                      {weightSlabs.map((s, idx) => (
                        <option key={idx} value={s.slab}>
                          {s.slab}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Transit Zone Multiplier
                    </label>
                    <select
                      value={simZone}
                      onChange={(e) => setSimZone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#b90041]/30"
                    >
                      <option value="Local">Local / Intra-City (1.0x)</option>
                      <option value="Regional">Regional / Same State (1.15x)</option>
                      <option value="National">National (1.35x)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Customer Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      value={simSellingPrice}
                      onChange={(e) => setSimSellingPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Supplier Base Price (₹)
                    </label>
                    <input
                      type="number"
                      value={simBasePrice}
                      onChange={(e) => setSimBasePrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Reseller Margin Added (₹)
                    </label>
                    <input
                      type="number"
                      value={simResellerMargin}
                      onChange={(e) => setSimResellerMargin(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reseller Return Liability Plan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Standard', 'Zero-Risk Lite', 'High Margin Pro'].map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setSimResellerPlan(plan)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                          simResellerPlan === plan
                            ? 'bg-[#b90041]/10 border-[#b90041] text-[#b90041]'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Settlement Breakdown (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <h3 className="text-sm font-extrabold flex items-center gap-1.5 text-amber-400">
                  <span className="material-symbols-outlined text-base">receipt_long</span>
                  Calculated Settlement Impact
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  Real-Time Audit
                </span>
              </div>

              {/* ROT Cost Summary */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Base Reverse Logistics (ROT):</span>
                  <span className="font-extrabold text-white">₹{baseRotCharge}.00</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Transit Zone:</span>
                  <span className="font-semibold text-slate-200">{simZone}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700">
                  <span className="text-amber-300 font-bold">Total Applicable ROT:</span>
                  <span className="text-sm font-black text-amber-400">₹{baseRotCharge}.00</span>
                </div>
              </div>

              {/* Party-wise Debit Allocation */}
              <div className="space-y-2.5 text-xs">
                <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                  Account-Wise Debit Distribution:
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-400 text-sm">inventory_2</span>
                    <span className="text-rose-200 font-semibold">Supplier Account Debit:</span>
                  </div>
                  <span className="font-mono font-bold text-rose-400">
                    {calculatedSupplierRot > 0 ? `-₹${calculatedSupplierRot}.00` : '₹0.00 (Protected)'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-400 text-sm">account_balance_wallet</span>
                    <span className="text-purple-200 font-semibold">Dropshipper/Reseller Debit:</span>
                  </div>
                  <span className="font-mono font-bold text-purple-300">
                    {calculatedResellerRot > 0 ? `-₹${calculatedResellerRot}.00` : '₹0.00 (No Charge)'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400 text-sm">shield</span>
                    <span className="text-blue-200 font-semibold">Platform Subsidy / SPF:</span>
                  </div>
                  <span className="font-mono font-bold text-blue-300">
                    {calculatedPlatformRot > 0 ? `₹${calculatedPlatformRot}.00 (Covered)` : '₹0.00'}
                  </span>
                </div>
              </div>

              {/* Customer Refund Verdict */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <span className="material-symbols-outlined text-base">price_check</span>
                  Buyer Refund Amount:
                </div>
                <div className="text-sm font-black text-emerald-400 font-mono">
                  ₹{simSellingPrice}.00 (100% Instant Refund)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SETTLEMENT AUTO-TRIGGERS */}
        {activeTab === 'audit-log' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b90041]">bolt</span>
                Automated Settlement Trigger & Cooling Period Engine
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rules governing when margin reversals and ROT deductions transition from Escrow to Bank Ledger.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">schedule</span>
                  7-Day Return Window Cooling Period
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Har delivered order ka reseller margin 7 dino tak <strong>"Escrow Hold"</strong> mein rehta hai. Agar 7 din mein koi return request nahi aati, toh automated cron job next payout cycle mein 100% bank transfer kar deta hai.
                </p>
                <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Status: Active (Default 7 Calendar Days)
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600">warning</span>
                  High COD RTO Auto-Surcharge Trigger
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Agar kisi Dropshipper ya Reseller ka monthly COD rejection rate <strong>15% se zyada</strong> ho jata hai, toh system unke future RTO parcels par ₹45 surcharge auto-debit trigger kar deta hai to prevent spam orders.
                </p>
                <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  Threshold: 15.0% Monthly RTO Rate
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EDIT RULE MODAL */}
      {editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b90041]">tune</span>
                Edit Business Rule: {editingRule.id}
              </h3>
              <button
                onClick={() => setEditingRule(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateRule} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Return Reason</label>
                <input
                  type="text"
                  value={editingRule.reason}
                  onChange={(e) => setEditingRule({ ...editingRule, reason: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supplier ROT Share (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingRule.supplierShare}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        supplierShare: Number(e.target.value),
                        resellerShare: 100 - Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reseller ROT Share (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingRule.resellerShare}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        resellerShare: Number(e.target.value),
                        supplierShare: 100 - Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Margin Reversal Policy
                </label>
                <input
                  type="text"
                  value={editingRule.marginReversal}
                  onChange={(e) => setEditingRule({ ...editingRule, marginReversal: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#b90041] hover:bg-[#a00038] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save Rule Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
