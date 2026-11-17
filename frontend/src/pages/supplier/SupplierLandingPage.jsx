import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  IndianRupee,
  TrendingUp,
  Truck,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronUp,
  Percent,
  Package,
  Layers,
  Store,
  FileSpreadsheet,
  Headphones,
  Check,
  Building2,
  Users,
  Award,
  Zap,
  HelpCircle,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function SupplierLandingPage({ onNavigate }) {
  const navigate = useNavigate();

  const handleNav = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  // Quick Registration Hero Input State
  const [quickPhone, setQuickPhone] = useState('');
  const [quickGstin, setQuickGstin] = useState('');

  const handleQuickRegisterSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = quickPhone.trim().replace(/\D/g, '');
    const cleanGst = quickGstin.trim().toUpperCase();
    
    // Store in session so SupplierRegister can pre-fill
    if (cleanPhone) sessionStorage.setItem('mshoppy_supplier_prefill_phone', cleanPhone);
    if (cleanGst) sessionStorage.setItem('mshoppy_supplier_prefill_gstin', cleanGst);
    
    handleNav('/supplier-register');
  };

  // Profit Calculator State
  const [calcCategory, setCalcCategory] = useState('ethnic');
  const [sellingPrice, setSellingPrice] = useState(650);

  const categoriesConfig = {
    ethnic: { name: 'Women Ethnic Wear (Sarees, Kurtis)', otherCommissionRate: 0.18, fixedClosingFee: 30 },
    western: { name: 'Western Wear (Tees, Dresses)', otherCommissionRate: 0.19, fixedClosingFee: 25 },
    men: { name: 'Men Fashion & Streetwear', otherCommissionRate: 0.18, fixedClosingFee: 28 },
    beauty: { name: 'Beauty & Skincare', otherCommissionRate: 0.16, fixedClosingFee: 20 },
    electronics: { name: 'Electronics & Audio', otherCommissionRate: 0.15, fixedClosingFee: 35 },
    home: { name: 'Home & Kitchen Essentials', otherCommissionRate: 0.17, fixedClosingFee: 25 },
  };

  const calcResults = useMemo(() => {
    const cfg = categoriesConfig[calcCategory] || categoriesConfig.ethnic;
    const price = Number(sellingPrice) || 0;

    // Other Marketplaces (18% commission + closing fee + payment gateway)
    const otherComm = Math.round(price * cfg.otherCommissionRate);
    const otherClosing = cfg.fixedClosingFee;
    const otherGateway = Math.round(price * 0.02);
    const otherDeductions = otherComm + otherClosing + otherGateway;
    const otherPayout = Math.max(0, price - otherDeductions);

    // MShoppy (0% Commission, 0 Closing Fee, 1% TCS + 1% TDS standard)
    const mshoppyTcsTds = Math.round(price * 0.02);
    const mshoppyPayout = Math.max(0, price - mshoppyTcsTds);

    const savingsPerOrder = mshoppyPayout - otherPayout;
    const annualSavings100Orders = savingsPerOrder * 100 * 12;

    return {
      price,
      otherComm,
      otherClosing,
      otherGateway,
      otherDeductions,
      otherPayout,
      mshoppyTcsTds,
      mshoppyPayout,
      savingsPerOrder,
      annualSavings100Orders,
    };
  }, [calcCategory, sellingPrice]);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      q: 'Why should I sell on MShoppy instead of Amazon or Flipkart?',
      a: 'MShoppy charges 0% Commission across all categories. Unlike other marketplaces that cut 18% to 28% in referral fees and closing charges, you take home virtually 100% of your listed price. Furthermore, MShoppy offers zero penalty on RTO (Return to Origin) cancellations, automated 7-day bank payouts, and does not require costly brand registry or UPC barcodes.'
    },
    {
      q: 'What documents are required to start selling on MShoppy?',
      a: 'To register as a supplier, you only need three things: 1) A valid GSTIN (Regular or Composition scheme), 2) An active Bank Account (Account number & IFSC for daily/weekly settlement payouts), and 3) A registered pickup address with pincode where courier riders can collect your parcels.'
    },
    {
      q: 'Do I need to send my inventory to a central fulfillment warehouse (like Amazon FBA)?',
      a: 'No! MShoppy operates on a 100% doorstep pickup model. You store products in your own shop, home, or warehouse. When you receive an order, simply pack it, paste the printable barcode shipping label, and our logistics partners (Delhivery, Shadowfax, Xpressbees) will pick it up directly from your doorstep.'
    },
    {
      q: 'When and how do I receive payments for my sales?',
      a: 'Payments are automatically transferred directly to your bank account via NEFT/RTGS within 7 to 10 days of the product being delivered to the customer. You can track upcoming, in-transit, and settled payouts in real time on your Settlements Dashboard.'
    },
    {
      q: 'What is MShoppy policy on RTO (Return to Origin) and Customer Returns?',
      a: 'If a customer refuses or is unavailable at delivery (RTO), MShoppy charges ₹0 return shipping penalty to the supplier. For customer returns (size or defect issues), if you receive a damaged or wrong product, you can upload unboxing proof on our Supplier Safety Claim Desk to claim financial compensation.'
    },
    {
      q: 'Can I upload products in bulk, or do I have to add them one by one?',
      a: 'Both! You can list items individually using our adaptive form (which automatically shows size/color toggles for fashion and hides them for non-apparel like facewash), or you can download our 1-click Excel/CSV template to upload 50+ to 100+ products at once.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#b7004d] selection:text-white">
      {/* ======================================================== */}
      {/* 1. TOP HEADER NAVIGATION BAR */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div 
            onClick={() => handleNav('/supplier')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#850d3a] to-[#d82a62] text-white flex items-center justify-center font-black text-xl shadow-md shadow-pink-900/20 group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">MShoppy</span>
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#b7004d] text-[10px] font-extrabold uppercase tracking-wide">
                  Supplier Hub
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">India's 0% Commission Wholesale Portal</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#benefits" className="hover:text-[#b7004d] transition-colors">Why MShoppy</a>
            <a href="#calculator" className="hover:text-[#b7004d] transition-colors">Profit Calculator</a>
            <a href="#how-it-works" className="hover:text-[#b7004d] transition-colors">How It Works</a>
            <a href="#faqs" className="hover:text-[#b7004d] transition-colors">FAQs</a>
          </nav>

          {/* Action Buttons: Login & Start Selling */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => handleNav('/supplier-login')}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl border border-slate-200 hover:border-[#b7004d] text-slate-700 hover:text-[#b7004d] font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer bg-white"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/supplier-register')}
              className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#b7004d] to-[#d82a62] hover:from-[#9b1147] hover:to-[#b7004d] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Start Selling</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION WITH VALUE PROPOSITION & QUICK SIGNUP */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pink-50/60 via-rose-50/30 to-white pt-10 sm:pt-16 pb-16 lg:pb-24 border-b border-pink-100/60">
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-rose-200/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & Pillars */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-[#b7004d] text-xs font-black tracking-wide uppercase shadow-xs">
                <Sparkles className="w-4 h-4 text-[#b7004d]" />
                <span>India's Most Supplier-Friendly E-Commerce Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Sell Online to <span className="text-[#b7004d] underline decoration-pink-300 decoration-wavy decoration-2">14 Crore+</span> Customers at <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-2xl border border-emerald-200 inline-block mt-1 sm:mt-0">0% Commission</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-medium leading-relaxed">
                Grow your wholesale & manufacturing business across 28,000+ pin codes. No commission cuts, no cancellation penalties, and guaranteed 7-day payments directly to your bank account.
              </p>

              {/* Highlights Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                {[
                  '0% Commission on all product categories',
                  '₹0 Penalty on RTO (Return to Origin)',
                  'Doorstep parcel pickup by top couriers',
                  '7-Day direct bank settlement cycle',
                  'No Brand Registry / UPC barcode required',
                  'Real-time order chime & label printing'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Mobile Quick Action Link */}
              <div className="pt-2 lg:hidden">
                <button
                  type="button"
                  onClick={() => handleNav('/supplier-register')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#b7004d] to-[#d82a62] text-white font-black text-base shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2"
                >
                  <span>Start Selling on MShoppy</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Column: High-Conversion Quick Register Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-xl shadow-pink-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/50 rounded-bl-full pointer-events-none" />

                <div className="space-y-1 mb-6">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#b7004d] uppercase tracking-wider">
                    <Store className="w-4 h-4" />
                    <span>Free Supplier Registration</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Start Your Seller Journey
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Takes only 5 minutes. No upfront registration fee.
                  </p>
                </div>

                <form onSubmit={handleQuickRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Enter Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-black text-slate-500 border-r border-slate-200 pr-2.5">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={quickPhone}
                        onChange={(e) => setQuickPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-16 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-[#b7004d] focus:ring-2 focus:ring-pink-100 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      GSTIN (Optional for now)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={quickGstin}
                      onChange={(e) => setQuickGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 uppercase focus:bg-white focus:border-[#b7004d] focus:ring-2 focus:ring-pink-100 outline-none transition"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">You can also add GSTIN later inside your KYC Hub.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#b7004d] to-[#d82a62] hover:from-[#9b1147] hover:to-[#b7004d] text-white font-extrabold text-sm shadow-md shadow-pink-600/30 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>Register as Supplier</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="pt-2 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">
                      Already have a supplier account?{' '}
                      <button
                        type="button"
                        onClick={() => handleNav('/supplier-login')}
                        className="text-[#b7004d] font-bold hover:underline cursor-pointer"
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>

          </div>

          {/* Trust Metric Counters Banner */}
          <div className="mt-14 pt-8 border-t border-pink-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">11 Lakh+</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trusted Suppliers</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-4xl font-black text-[#b7004d] tracking-tight">0%</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commission Fee</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">7 Days</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Automated Bank Settlement</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-4xl font-black text-emerald-700 tracking-tight">28,000+</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pan-India Pincodes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE PROFIT & SAVINGS CALCULATOR (MEESHO SPECIAL) */}
      {/* ======================================================== */}
      <section id="calculator" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5" />
              <span>Transparent Math</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              See How Much More You Earn on MShoppy
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Compare your net take-home earnings on MShoppy’s 0% Commission model versus typical 18%–25% commission marketplaces.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50/50 via-white to-slate-50 rounded-3xl border border-pink-200/80 p-6 sm:p-10 shadow-lg shadow-pink-900/5 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Inputs Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                    1. Select Your Product Category
                  </label>
                  <select
                    value={calcCategory}
                    onChange={(e) => setCalcCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-[#b7004d] focus:ring-2 focus:ring-pink-100 outline-none transition cursor-pointer"
                  >
                    {Object.entries(categoriesConfig).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                      2. Enter Product Selling Price
                    </label>
                    <span className="text-lg font-black text-[#b7004d]">
                      ₹{Number(sellingPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={150}
                    max={3000}
                    step={50}
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full accent-[#b7004d] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1">
                    <span>₹150</span>
                    <span>₹1,500</span>
                    <span>₹3,000</span>
                  </div>
                </div>

                {/* Savings Callout Pill */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Extra Profit Per Order</span>
                    <p className="text-2xl font-black text-emerald-700">
                      +₹{calcResults.savingsPerOrder.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-800">Annual Gain (100 orders/mo)</span>
                    <p className="text-sm font-black text-emerald-700">
                      ₹{calcResults.annualSavings100Orders.toLocaleString('en-IN')} extra
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison Breakdown Cards Column */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Card 1: Other Marketplaces */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Other Platforms</span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">~20% Cut</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Listing Price:</span>
                      <span className="font-bold">₹{calcResults.price}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Commission:</span>
                      <span>-₹{calcResults.otherComm}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Closing & Fixed Fee:</span>
                      <span>-₹{calcResults.otherClosing}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Payment Gateway (2%):</span>
                      <span>-₹{calcResults.otherGateway}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">You Receive</span>
                    <p className="text-xl font-black text-slate-800">
                      ₹{calcResults.otherPayout.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Card 2: MShoppy 0% Commission */}
                <div className="bg-white rounded-2xl p-5 border-2 border-[#b7004d] shadow-md shadow-pink-600/10 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#b7004d] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                    Best for Sellers
                  </div>

                  <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                    <span className="text-xs font-black text-[#b7004d] uppercase tracking-wide">MShoppy</span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">0% Commission</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Listing Price:</span>
                      <span className="font-bold">₹{calcResults.price}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Commission (0%):</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Closing Fee:</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Govt TCS / TDS (2%):</span>
                      <span>-₹{calcResults.mshoppyTcsTds}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-pink-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">You Receive</span>
                    <p className="text-2xl font-black text-[#b7004d]">
                      ₹{calcResults.mshoppyPayout.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WHY SELL ON MSHOPPY (MEESHO'S 6 CORE PILLARS) */}
      {/* ======================================================== */}
      <section id="benefits" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#b7004d] text-xs font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Supplier First Benefits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Built for Wholesalers & Manufacturers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              We eliminated the complex rules, hidden fees, and harsh penalties of legacy marketplaces so you can focus on making and selling quality goods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#b7004d] flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
                0% Commission Fee
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Keep every rupee you earn. Whether you sell fashion, electronics, or home essentials, MShoppy charges zero commission on your orders.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
                ₹0 Penalty on RTO
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If an undelivered parcel returns to origin because the customer was unreachable or cancelled at the door, you pay zero cancellation penalty.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
                7-Day Payment Cycle
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Faster working capital rotation. Payouts are directly credited to your registered bank account via NEFT/IMPS within 7 days of delivery.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
                No UPC or Brand Gatekeeping
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Start selling instantly with just your GSTIN. No expensive GS1 barcodes, no trademark applications, and no brand authorization gatekeeping.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
                Doorstep Courier Pickup
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No need to travel to courier hubs. Delhivery, Shadowfax, and Xpressbees riders pick up packed parcels directly from your warehouse door.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#b7004d] flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
                Live Order Chime & Radar
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Never miss an order. Get real-time melodic sound alerts the instant a customer orders, with 1-click printable shipping labels and manifests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. HOW IT WORKS (4 SIMPLE STEPS) */}
      {/* ======================================================== */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#b7004d] text-xs font-black uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Step-by-Step Guide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How to Start Selling in 4 Simple Steps
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              From free registration to your first bank payout, here is how MShoppy works for every merchant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 relative">
            {[
              {
                step: '01',
                title: 'Register in 5 Mins',
                desc: 'Sign up with your phone number, GSTIN, and active bank account details for direct payouts.',
                icon: Store,
                color: 'bg-pink-50 text-[#b7004d]'
              },
              {
                step: '02',
                title: 'Upload Your Catalog',
                desc: 'Add items 1-by-1 with adaptive size/color toggles, or download our Excel template for bulk upload.',
                icon: FileSpreadsheet,
                color: 'bg-indigo-50 text-indigo-700'
              },
              {
                step: '03',
                title: 'Pack & Print Label',
                desc: 'Hear the 3.5s order chime, pack your parcel, and print the auto-generated barcode shipping label.',
                icon: Package,
                color: 'bg-amber-50 text-amber-700'
              },
              {
                step: '04',
                title: 'Handover & Get Paid',
                desc: 'Courier rider collects parcel from your door. Money is deposited in your bank within 7 days.',
                icon: IndianRupee,
                color: 'bg-emerald-50 text-emerald-700'
              }
            ].map((st, idx) => {
              const IconComp = st.icon;
              return (
                <div key={idx} className="bg-slate-50/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-300 tracking-tight">
                      {st.step}
                    </span>
                    <div className={`w-10 h-10 rounded-2xl ${st.color} flex items-center justify-center`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 tracking-tight mb-1">
                      {st.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => handleNav('/supplier-register')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#b7004d] hover:bg-[#9b1147] text-white font-black text-sm shadow-lg shadow-pink-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. WHAT YOU NEED TO START SELLING (CHECKLIST) */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-pink-900 via-[#850d3a] to-[#b7004d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold text-pink-200 uppercase tracking-widest">Simple Onboarding</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                All You Need to Start Selling
              </h2>
              <p className="text-sm text-pink-100/90 leading-relaxed font-medium">
                No complex paperwork or legal fees. Have these three essentials ready to activate your wholesale merchant account immediately.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="text-sm font-black tracking-tight">Active GSTIN</h4>
                <p className="text-xs text-pink-100/80">Regular or Composition GST for inter-state wholesale commerce.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="text-sm font-black tracking-tight">Bank Account</h4>
                <p className="text-xs text-pink-100/80">Current or Savings account in your or business name for 7-day NEFT settlements.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="text-sm font-black tracking-tight">Pickup Address</h4>
                <p className="text-xs text-pink-100/80">Warehouse or store address with pincode for courier doorstep parcel collection.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      {/* ======================================================== */}
      <section id="faqs" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#b7004d] text-xs font-black uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Everything you need to know about selling on MShoppy, commission policies, and daily dispatch.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isOpen ? 'border-[#b7004d] bg-pink-50/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      {f.q}
                    </span>
                    <span className="shrink-0 text-slate-400">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#b7004d]" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-pink-100/60 font-medium">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. FOOTER CALL TO ACTION */}
      {/* ======================================================== */}
      <footer className="bg-slate-950 text-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-slate-800 text-center md:text-left">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Ready to Grow Your Business Across India?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Join 11 Lakh+ suppliers selling at 0% Commission with doorstep pickup.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleNav('/supplier-login')}
                className="px-5 py-3 rounded-2xl border border-slate-700 hover:border-slate-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                Supplier Login
              </button>
              <button
                type="button"
                onClick={() => handleNav('/supplier-register')}
                className="px-6 py-3 rounded-2xl bg-[#b7004d] hover:bg-[#9b1147] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-900/30 transition cursor-pointer"
              >
                Register Now
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} MShoppy Supplier Hub. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => handleNav('/supplier-login')} className="hover:text-white transition">Supplier Login</button>
              <button onClick={() => handleNav('/supplier-register')} className="hover:text-white transition">Register</button>
              <button onClick={() => handleNav('/policy/terms')} className="hover:text-white transition">Terms of Service</button>
              <button onClick={() => handleNav('/policy/privacy')} className="hover:text-white transition">Privacy Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
