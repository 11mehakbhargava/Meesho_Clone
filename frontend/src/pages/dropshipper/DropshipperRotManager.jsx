import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBottomNav from '../../components/AppBottomNav';

// Mock Dropshipper Return & ROT Liability Ledger
const INITIAL_DROPSHIPPER_RETURNS = [
  {
    id: 'DSH-RET-901',
    orderId: 'ORD-90214',
    returnId: 'RET-8921',
    productName: 'Banarasi Silk Embroidered Kurti - Pink (M)',
    productSku: 'BSK-PNK-M',
    productImg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
    sellingPrice: 1299,
    supplierPrice: 849,
    earnedMargin: 380,
    reversedMargin: 380,
    customerReturnReason: 'Size fitting tight / Too small',
    faultAttribution: 'Buyer Remorse (Fit Issue)',
    rotLiability: 'Plan Covered (Shared Shield 50%)',
    rotAmount: 35, // 50% of ₹70
    netResellerDebit: 415, // 380 margin reversed + 35 ROT
    walletStatus: 'Adjusted in Escrow Payout',
    orderDate: '21 Oct 2024',
    returnDate: '24 Oct 2024',
    disputeStatus: null,
  },
  {
    id: 'DSH-RET-902',
    orderId: 'ORD-90185',
    returnId: 'RET-8890',
    productName: 'Men Slim Fit Stretchable Denim Jeans - Dark Blue (32)',
    productSku: 'DNM-DBLU-32',
    productImg: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80',
    sellingPrice: 999,
    supplierPrice: 649,
    earnedMargin: 290,
    reversedMargin: 290,
    customerReturnReason: 'Torn waistband / Defective zipper',
    faultAttribution: 'Supplier Quality Defect',
    rotLiability: '₹0 (100% Supplier Absorbed)',
    rotAmount: 0,
    netResellerDebit: 290, // Only margin cancelled, 0 ROT
    walletStatus: 'Margin Reversed (Zero Penalty)',
    orderDate: '23 Oct 2024',
    returnDate: '25 Oct 2024',
    disputeStatus: null,
  },
  {
    id: 'DSH-RET-903',
    orderId: 'ORD-87941',
    returnId: 'RET-8812',
    productName: 'Georgette Printed Saree - Royal Blue',
    productSku: 'SAR-GEO-BLU',
    productImg: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&auto=format&fit=crop&q=80',
    sellingPrice: 849,
    supplierPrice: 599,
    earnedMargin: 200,
    reversedMargin: 200,
    customerReturnReason: 'Color variation from Instagram photo',
    faultAttribution: 'Catalog / Customer Preference',
    rotLiability: 'Full Reseller Liability (High Margin Pro)',
    rotAmount: 65,
    netResellerDebit: 265,
    walletStatus: 'Debited from Current Balance',
    orderDate: '19 Oct 2024',
    returnDate: '22 Oct 2024',
    disputeStatus: 'Dispute Filed: Color Accurate in Catalog (Reviewing)',
  },
];

export default function DropshipperRotManager() {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState('Shared Shield'); // 'Zero-Risk Lite' | 'Shared Shield' | 'High Margin Pro'
  const [returnsList, setReturnsList] = useState(INITIAL_DROPSHIPPER_RETURNS);
  const [filterType, setFilterType] = useState('ALL');
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [disputeNote, setDisputeNote] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Break-even calculator state
  const [calcSellingPrice, setCalcSellingPrice] = useState(999);
  const [calcSupplierPrice, setCalcSupplierPrice] = useState(649);
  const [calcEstReturnRate, setCalcEstReturnRate] = useState(8); // %

  const grossMargin = calcSellingPrice - calcSupplierPrice;
  const avgRotPerReturn = activePlan === 'Zero-Risk Lite' ? 0 : activePlan === 'Shared Shield' ? 35 : 65;
  const planInsuranceFee = activePlan === 'Zero-Risk Lite' ? 15 : 0;
  const expectedReturnCostPer100Orders = (calcEstReturnRate * (grossMargin + avgRotPerReturn));
  const netEstimatedProfitPer100Orders = (100 * grossMargin) - expectedReturnCostPer100Orders - (100 * planInsuranceFee);
  const netProfitPerOrder = Math.round(netEstimatedProfitPer100Orders / 100);

  const totalRotPaid = returnsList.reduce((acc, curr) => acc + curr.rotAmount, 0);
  const totalMarginReversed = returnsList.reduce((acc, curr) => acc + curr.reversedMargin, 0);

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (!selectedReturn) return;

    setReturnsList((prev) =>
      prev.map((item) =>
        item.id === selectedReturn.id
          ? {
              ...item,
              disputeStatus: 'Dispute Raised with Admin Tribunal (Reviewing)',
            }
          : item
      )
    );

    setDisputeModalOpen(false);
    setToastMsg(`Dispute raised for Order #${selectedReturn.orderId}. ROT debit put on temporary freeze.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-900 pb-24 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dropshipper-settlements')}
              className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 flex items-center gap-1.5 text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>Settlement Hub</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-700 border border-purple-500/20">
                  Dropshipper Policy
                </span>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">policy</span>
                  Dropshipper Return & ROT Liability Manager
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your return liability tier, audit margin reversals, and dispute wrongful ROT deductions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/reseller-returns')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition"
            >
              <span className="material-symbols-outlined text-sm text-slate-600">receipt_long</span>
              Returns Ledger
            </button>
            <button
              onClick={() => navigate('/admin-rot-rules')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition"
            >
              <span className="material-symbols-outlined text-sm text-[#b90041]">rule_settings</span>
              System Rules
            </button>
          </div>
        </div>

        {/* Global Toast */}
        {toastMsg && (
          <div className="bg-emerald-50 border-t border-b border-emerald-200 px-4 py-2 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
            {toastMsg}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Financial Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">shield</span>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">Active Return Plan</div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">{activePlan}</div>
              <div className="text-[11px] text-purple-600 font-medium mt-0.5">50% ROT Remorse Shield</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">money_off</span>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">Total Margin Reversals</div>
              <div className="text-xl font-extrabold text-rose-600">₹{totalMarginReversed}.00</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">3 Returned Items</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">local_shipping</span>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">ROT Debited from Wallet</div>
              <div className="text-xl font-extrabold text-amber-600">₹{totalRotPaid}.00</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Reverse Freight Share</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">Net Retained Earnings</div>
              <div className="text-xl font-extrabold text-emerald-600">₹42,850.00</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">95.8% Margin Protected</div>
            </div>
          </div>
        </div>

        {/* PLAN SELECTION CARDS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">verified_user</span>
                Select Your Dropshipper Return & ROT Protection Plan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose how return reverse logistics costs are handled for your customer orders.
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full self-start sm:self-auto">
              Current Tier: {activePlan}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {[
              {
                id: 'Zero-Risk Lite',
                name: 'Zero-Risk Lite Plan',
                tag: '100% Peace of Mind',
                cost: '₹15 / Shipped Order',
                rotOnRemorse: '₹0 (100% Platform Covered)',
                rotOnDefect: '₹0 (Supplier Pays)',
                bestFor: 'Beginners & High-Volume Resellers',
                badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              },
              {
                id: 'Shared Shield',
                name: 'Shared Shield (Standard)',
                tag: 'Recommended Default',
                cost: '₹0 Upfront Fee',
                rotOnRemorse: '50% ROT (Avg ₹35 / Return)',
                rotOnDefect: '₹0 (Supplier Pays)',
                bestFor: 'Standard Fashion & Home Catalogs',
                badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
              },
              {
                id: 'High Margin Pro',
                name: 'High Margin Pro',
                tag: 'Max Profit Potential',
                cost: '₹0 Upfront + Lowest Base Price',
                rotOnRemorse: '100% ROT (Avg ₹65 / Return)',
                rotOnDefect: '₹0 (Supplier Pays)',
                bestFor: 'Electronics & High-Margin Premium',
                badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
              },
            ].map((plan) => (
              <div
                key={plan.id}
                onClick={() => {
                  setActivePlan(plan.id);
                  setToastMsg(`Switched return protection tier to ${plan.name}`);
                  setTimeout(() => setToastMsg(''), 3000);
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                  activePlan === plan.id
                    ? 'border-purple-600 bg-purple-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {activePlan === plan.id && (
                  <span className="absolute -top-2.5 right-4 bg-purple-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wide">
                    Active Plan
                  </span>
                )}
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mb-2 ${plan.badgeColor}`}>
                    {plan.tag}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">{plan.name}</h3>
                  <div className="text-xs font-bold text-purple-700 mt-1">{plan.cost}</div>

                  <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Buyer Remorse ROT:</span>
                      <span className="font-bold text-slate-800">{plan.rotOnRemorse}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Supplier Defect ROT:</span>
                      <span className="font-bold text-emerald-600">{plan.rotOnDefect}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2">Best for: {plan.bestFor}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition ${
                    activePlan === plan.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {activePlan === plan.id ? 'Selected Tier' : 'Switch to this Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RETURN ORDERS & ROT DEDUCTION LEDGER */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">receipt_long</span>
                Returned Orders & Margin Reversal Audit
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact mathematical breakdown of reversed margins and applicable ROT reverse freight.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {['ALL', 'ROT_CHARGED', 'ZERO_ROT'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    filterType === tab
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'ALL' ? 'All Returns' : tab === 'ROT_CHARGED' ? 'ROT Debited' : '₹0 ROT Protected'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order & Return ID</th>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Customer Reason & Fault</th>
                  <th className="py-3 px-4 text-center">Margin Reversed</th>
                  <th className="py-3 px-4 text-center">ROT Charged</th>
                  <th className="py-3 px-4 text-center">Total Net Debit</th>
                  <th className="py-3 px-4">Status & Dispute</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {returnsList
                  .filter((item) =>
                    filterType === 'ALL'
                      ? true
                      : filterType === 'ROT_CHARGED'
                      ? item.rotAmount > 0
                      : item.rotAmount === 0
                  )
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{item.orderId}</div>
                        <div className="text-[11px] text-purple-600 font-semibold">{item.returnId}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.returnDate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.productImg}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-800 line-clamp-1">{item.productName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">SKU: {item.productSku}</div>
                            <div className="text-[10px] text-slate-600 font-medium">
                              Sell: ₹{item.sellingPrice} | Base: ₹{item.supplierPrice}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-slate-800">{item.customerReturnReason}</div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mt-1 ${
                            item.rotAmount > 0
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {item.faultAttribution}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600">
                        -₹{item.reversedMargin}.00
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        {item.rotAmount > 0 ? (
                          <span className="text-amber-600">-₹{item.rotAmount}.00</span>
                        ) : (
                          <span className="text-emerald-600">₹0.00</span>
                        )}
                        <div className="text-[9px] text-slate-400">{item.rotLiability}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-black text-slate-900">
                        -₹{item.netResellerDebit}.00
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-700">{item.walletStatus}</div>
                        {item.disputeStatus && (
                          <div className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 mt-1 inline-block">
                            {item.disputeStatus}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedReturn(item);
                            setDisputeModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">gavel</span>
                          Dispute
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BREAK-EVEN PROFITABILITY CALCULATOR */}
        <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white p-5 sm:p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2 text-purple-300">
                <span className="material-symbols-outlined text-lg">calculate</span>
                Dropshipper Net Margin & Return Break-Even Simulator
              </h3>
              <p className="text-xs text-purple-200/70 mt-0.5">
                Calculate expected net profit after accounting for return rates and ROT liability.
              </p>
            </div>
            <span className="text-xs bg-purple-400/20 text-purple-300 font-bold px-3 py-1 rounded-full border border-purple-400/30">
              Live Projections
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Customer Price (₹)</label>
                <input
                  type="number"
                  value={calcSellingPrice}
                  onChange={(e) => setCalcSellingPrice(Number(e.target.value))}
                  className="w-full bg-purple-900/40 border border-purple-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Supplier Base Price (₹)</label>
                <input
                  type="number"
                  value={calcSupplierPrice}
                  onChange={(e) => setCalcSupplierPrice(Number(e.target.value))}
                  className="w-full bg-purple-900/40 border border-purple-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Est. Return Rate (%)</label>
                <input
                  type="number"
                  value={calcEstReturnRate}
                  onChange={(e) => setCalcEstReturnRate(Number(e.target.value))}
                  className="w-full bg-purple-900/40 border border-purple-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="lg:col-span-5 bg-purple-900/50 border border-purple-700/60 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-purple-300 font-semibold">Net Expected Profit / Order</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                  ₹{netProfitPerOrder}.00
                </div>
                <div className="text-[11px] text-purple-200/80 mt-1">
                  Gross: ₹{grossMargin} | Avg ROT Risk: ₹{Math.round((calcEstReturnRate / 100) * avgRotPerReturn)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-purple-300 font-semibold">Profit / 100 Orders</div>
                <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                  ₹{netEstimatedProfitPer100Orders.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* DISPUTE MODAL */}
      {disputeModalOpen && selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">gavel</span>
                Dispute False Return Reason: {selectedReturn.orderId}
              </h3>
              <button
                onClick={() => setDisputeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleDisputeSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product & Customer Claim
                </label>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1">
                  <div><strong>Item:</strong> {selectedReturn.productName}</div>
                  <div><strong>Customer Claimed:</strong> "{selectedReturn.customerReturnReason}"</div>
                  <div><strong>ROT Debit Applied:</strong> ₹{selectedReturn.rotAmount}.00</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dispute Grounds & Evidence
                </label>
                <textarea
                  rows="3"
                  value={disputeNote}
                  onChange={(e) => setDisputeNote(e.target.value)}
                  placeholder="Explain why customer return reason was inaccurate (e.g. Catalog clearly specified fabric type, WhatsApp chat screenshot attached)."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 placeholder-slate-400"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  Submit Dispute to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav */}
      <AppBottomNav active="wallet" />
    </div>
  );
}
