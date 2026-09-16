import React, { useState } from 'react';

const PRESET_BANNERS = [
  {
    name: 'Summer Fashion',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMgkr5Vew4ln1plf59FFQrJ2lmVpKPwxkMyFJHIhTBf9iICdZ-bof9i5xPCSrRkrH2u9SNX6_hxGJzsR_bqV3xmqp-rzFM2Q0u3gRbMYIzdV6792bSXJ7j4ynGP1W-GW8YdOPl3xY1ADMBJX2gGXX6hwFPDsVKP5oV1x9d0M_GOYthk50L7Qw6kHPoLRfL_URcOAOWdrZUmHUmgmMgt6zf3W_q_BZc0L9EQZaraFrRw-qcLf69WuoIuas6aiw_Nx3wOpk0YwYUIws',
  },
  {
    name: 'Ethnic Festival',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Smart Gadgets',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  },
];

export function CampaignCreationFlowAdmin({ onNavigate, onCancel }) {
  // Wizard Step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Details
  const [campaignName, setCampaignName] = useState('Summer Luxe Festival');
  const [objective, setObjective] = useState('growth');
  const [region, setRegion] = useState('Pan India');
  const [resellerTier, setResellerTier] = useState('Superstar (Top 5%)');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-30');

  // Step 2: Audience
  const [category, setCategory] = useState('Ethnic & Western Wear');
  const [minRating, setMinRating] = useState('4.0+ Stars');
  const [bonusCommission, setBonusCommission] = useState(20);
  const [targetAudienceSize, setTargetAudienceSize] = useState('1,250,000');

  // Step 3: Creative & Messaging
  const [bannerHeadline, setBannerHeadline] = useState('Summer Luxe Festival');
  const [badgeText, setBadgeText] = useState('LIVE NOW');
  const [rewardSubtitle, setRewardSubtitle] = useState('Reseller Rewards: 20% Bonus');
  const [rewardNote, setRewardNote] = useState('On every share that leads to a sale.');
  const [ctaText, setCtaText] = useState('Share to WhatsApp');
  const [bannerImageUrl, setBannerImageUrl] = useState(PRESET_BANNERS[0].url);

  // Step 4: Budget & Schedule
  const [dailyBudget, setDailyBudget] = useState(25000);
  const [campaignPriority, setCampaignPriority] = useState('High');
  const [payoutPool, setPayoutPool] = useState('5,00,000');

  // Interactive state
  const [toastMessage, setToastMessage] = useState(null);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [previewShared, setPreviewShared] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveDraft = () => {
    showToast(`Draft "${campaignName}" saved successfully!`);
  };

  const handleLaunchSuccess = () => {
    setIsLaunched(true);
    showToast(`🚀 Campaign "${campaignName}" is now LIVE!`);
    setTimeout(() => {
      setIsLaunchModalOpen(false);
    }, 2000);
  };

  // Dynamic Reach based on budget and tier
  const calculateEstimatedReach = () => {
    const base = dailyBudget * 45;
    if (base >= 1000000) {
      return `${(base / 1000000).toFixed(1)}M`;
    }
    return `${Math.round(base / 1000)}k`;
  };

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen flex flex-col font-['Inter',sans-serif] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#b90041] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 shadow-xs font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('dashboard')}>
            <span className="text-2xl font-black text-[#FF3F6C] tracking-tight">CuratorAdmin</span>
            <span className="text-[10px] bg-pink-100 text-[#FF3F6C] font-bold px-2 py-0.5 rounded-full uppercase">
              Pro
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="text-slate-500 hover:text-[#FF3F6C] font-medium text-sm transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              type="button"
              className="text-[#FF3F6C] font-bold text-sm border-b-2 border-[#FF3F6C] pb-0.5"
            >
              Campaigns
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('catalog')}
              className="text-slate-500 hover:text-[#FF3F6C] font-medium text-sm transition-colors cursor-pointer"
            >
              Catalog
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search campaigns..."
              className="bg-slate-100 border-none rounded-full px-4 py-2 text-sm w-60 focus:ring-2 focus:ring-[#b90041] focus:bg-white text-slate-700"
            />
            <span className="material-symbols-outlined absolute right-3 top-2 text-slate-400 text-lg">
              search
            </span>
          </div>
          <button
            type="button"
            onClick={() => showToast('No new notifications')}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-[#b90041] font-bold text-xs shadow-xs">
            CA
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* ===================== Sidebar Navigation ===================== */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 bg-slate-50 dark:bg-slate-950 p-4 space-y-2 sticky top-[61px] h-[calc(100vh-61px)] flex-shrink-0 z-30">
          <div className="mb-6 px-3 pt-2">
            <div className="text-lg font-black text-[#FF3F6C] font-['Plus_Jakarta_Sans',sans-serif]">
              Marketing Desk
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Campaign Engine
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-[#FF3F6C] hover:bg-white rounded-xl hover:shadow-xs transition-all font-medium text-sm cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-3 px-4 py-2.5 bg-white text-[#FF3F6C] rounded-xl shadow-xs font-bold text-sm cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-xl">campaign</span>
              <span>Marketing Campaign</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('catalog')}
              className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-[#FF3F6C] hover:bg-white rounded-xl hover:shadow-xs transition-all font-medium text-sm cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-xl">inventory_2</span>
              <span>Inventory Catalog</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('orders')}
              className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-[#FF3F6C] hover:bg-white rounded-xl hover:shadow-xs transition-all font-medium text-sm cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              <span>Orders Dispatch</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Analytics module is updating...')}
              className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-[#FF3F6C] hover:bg-white rounded-xl hover:shadow-xs transition-all font-medium text-sm cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-xl">analytics</span>
              <span>Live Analytics</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-auto space-y-1">
            <button
              type="button"
              onClick={() => showToast('Help Center available at support@meesho.com')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-[#FF3F6C] font-medium text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">help</span>
              <span>Help Center</span>
            </button>
            <button
              type="button"
              onClick={() => onCancel && onCancel()}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl font-medium text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span>Exit Flow</span>
            </button>
          </div>
        </aside>

        {/* ===================== Main Wizard Content ===================== */}
        <main className="flex-1 p-6 md:p-10 bg-slate-100/70 overflow-y-auto">
          {/* Header Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  Create Campaign
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Step {currentStep} of 4
                </span>
              </div>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Design and launch your next social commerce breakout across reseller networks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all active:scale-95 cursor-pointer text-sm"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => setIsLaunchModalOpen(true)}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#b90041] to-[#df2457] hover:shadow-lg transition-all active:scale-95 shadow-md cursor-pointer text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
                Launch Campaign
              </button>
            </div>
          </div>

          {/* Stepper Wizard Bar */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center w-full max-w-2xl px-2">
              {[
                { step: 1, label: 'Details', icon: 'edit_note' },
                { step: 2, label: 'Audience', icon: 'groups' },
                { step: 3, label: 'Creative', icon: 'photo_library' },
                { step: 4, label: 'Budget', icon: 'payments' },
              ].map((s, idx, arr) => {
                const isCompleted = currentStep > s.step;
                const isActive = currentStep === s.step;
                return (
                  <React.Fragment key={s.step}>
                    <div className="flex flex-col items-center relative flex-1">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(s.step)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#b90041] text-white ring-4 ring-pink-100 shadow-md scale-105'
                            : isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-400 border-2 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isCompleted ? (
                          <span className="material-symbols-outlined text-lg">check</span>
                        ) : (
                          s.step
                        )}
                      </button>
                      <span
                        className={`absolute top-12 text-xs font-bold whitespace-nowrap transition-colors ${
                          isActive
                            ? 'text-[#b90041]'
                            : isCompleted
                            ? 'text-emerald-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div
                        className={`h-1 flex-1 -mt-7 transition-colors ${
                          currentStep > s.step ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Content Grid: Form (Col 7) + Live Preview (Col 5) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-12">
            {/* Left Column: Multi-Step Forms */}
            <div className="xl:col-span-7 space-y-6">
              {/* STEP 1: Details */}
              {currentStep === 1 && (
                <div className="bg-white p-7 rounded-2xl shadow-xs border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                        Campaign Details
                      </h2>
                      <p className="text-xs text-slate-500">Configure core campaign parameters</p>
                    </div>
                    <span className="material-symbols-outlined text-[#b90041] text-2xl">campaign</span>
                  </div>

                  {/* Campaign Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 block">Campaign Name</label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => {
                        setCampaignName(e.target.value);
                        setBannerHeadline(e.target.value);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#b90041] focus:bg-white font-medium text-slate-900"
                      placeholder="e.g. Summer Luxe Festival"
                    />
                  </div>

                  {/* Primary Objective */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">
                      Primary Objective
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'growth', label: 'Growth', icon: 'trending_up', desc: 'Boost new orders' },
                        { id: 'retention', label: 'Retention', icon: 'sync', desc: 'Re-engage resellers' },
                        { id: 'awareness', label: 'Awareness', icon: 'visibility', desc: 'Catalog impressions' },
                      ].map((obj) => (
                        <button
                          key={obj.id}
                          type="button"
                          onClick={() => setObjective(obj.id)}
                          className={`p-4 rounded-xl flex flex-col items-center text-center cursor-pointer transition-all border-2 ${
                            objective === obj.id
                              ? 'border-[#b90041] bg-pink-50/50 shadow-xs'
                              : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-2xl mb-1.5 ${
                              objective === obj.id ? 'text-[#b90041]' : 'text-slate-400'
                            }`}
                          >
                            {obj.icon}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              objective === obj.id ? 'text-[#b90041]' : 'text-slate-700'
                            }`}
                          >
                            {obj.label}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">{obj.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Region & Reseller Tier */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">Target Region</label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#b90041] focus:bg-white font-medium text-slate-800"
                      >
                        <option>Pan India</option>
                        <option>North India (Metros)</option>
                        <option>South India (Tier 1)</option>
                        <option>West India (Mumbai/Pune)</option>
                        <option>East India & Bengal</option>
                        <option>Rural & Semi-Urban Clusters</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">Reseller Tier</label>
                      <select
                        value={resellerTier}
                        onChange={(e) => setResellerTier(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#b90041] focus:bg-white font-medium text-slate-800"
                      >
                        <option>Superstar (Top 5%)</option>
                        <option>Rising Star (Active)</option>
                        <option>New Resellers (&lt;30 days)</option>
                        <option>Lapsed Resellers (Re-activation)</option>
                        <option>All Registered Resellers</option>
                      </select>
                    </div>
                  </div>

                  {/* Campaign Schedule Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#b90041] text-slate-700"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#b90041] text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Audience */}
              {currentStep === 2 && (
                <div className="bg-white p-7 rounded-2xl shadow-xs border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                        Target Audience & Category
                      </h2>
                      <p className="text-xs text-slate-500">
                        Target specific reseller segments and categories
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#b90041] text-2xl">group</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 block">
                      Target Product Categories
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#b90041] font-medium"
                    >
                      <option>Ethnic & Western Wear</option>
                      <option>Sarees & Kurtis Collection</option>
                      <option>Jewellery & Accessories</option>
                      <option>Home & Kitchen Essentials</option>
                      <option>Electronics & Smart Wearables</option>
                      <option>Footwear & Bags</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">
                        Minimum Reseller Rating
                      </label>
                      <select
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#b90041]"
                      >
                        <option>4.0+ Stars (Trusted Resellers)</option>
                        <option>4.5+ Stars (Top Rated Only)</option>
                        <option>3.5+ Stars (Broad Inclusion)</option>
                        <option>Any Rating</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">
                        Reseller Bonus Commission (%)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="5"
                          max="40"
                          step="5"
                          value={bonusCommission}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setBonusCommission(val);
                            setRewardSubtitle(`Reseller Rewards: ${val}% Bonus`);
                          }}
                          className="flex-1 accent-[#b90041]"
                        />
                        <span className="font-bold text-[#b90041] w-12 text-center text-sm bg-pink-50 py-1.5 rounded-lg">
                          +{bonusCommission}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-600 text-2xl">
                        verified_user
                      </span>
                      <div>
                        <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                          Estimated Matching Resellers
                        </div>
                        <div className="text-lg font-black text-emerald-900">{targetAudienceSize} Active Resellers</div>
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                      High Conversion Potential
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 3: Creative & Messaging */}
              {currentStep === 3 && (
                <div className="bg-white p-7 rounded-2xl shadow-xs border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                        Creative Banner & Copy
                      </h2>
                      <p className="text-xs text-slate-500">
                        Customize what resellers see in the Meesho mobile app
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#b90041] text-2xl">design_services</span>
                  </div>

                  {/* Banner Preset Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Choose Banner Template</label>
                    <div className="grid grid-cols-3 gap-3">
                      {PRESET_BANNERS.map((preset) => (
                        <div
                          key={preset.name}
                          onClick={() => setBannerImageUrl(preset.url)}
                          className={`relative rounded-xl overflow-hidden cursor-pointer border-2 group h-24 transition-all ${
                            bannerImageUrl === preset.url
                              ? 'border-[#b90041] ring-2 ring-pink-200'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                            <span className="text-white text-xs font-bold">{preset.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Headline & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">Banner Headline</label>
                      <input
                        type="text"
                        value={bannerHeadline}
                        onChange={(e) => setBannerHeadline(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#b90041]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">Badge Tag</label>
                      <input
                        type="text"
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#b90041]"
                      />
                    </div>
                  </div>

                  {/* Reward text & CTA button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">Rewards Subtitle</label>
                      <input
                        type="text"
                        value={rewardSubtitle}
                        onChange={(e) => setRewardSubtitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#b90041]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">CTA Action Text</label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#b90041]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 block">Rewards Disclaimer</label>
                    <input
                      type="text"
                      value={rewardNote}
                      onChange={(e) => setRewardNote(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#b90041]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Budget & Schedule */}
              {currentStep === 4 && (
                <div className="bg-white p-7 rounded-2xl shadow-xs border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                        Budget & Payout Allocation
                      </h2>
                      <p className="text-xs text-slate-500">Configure financial bounds and campaign priority</p>
                    </div>
                    <span className="material-symbols-outlined text-[#b90041] text-2xl">account_balance_wallet</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-slate-700">Daily Advertising Budget</label>
                      <span className="text-base font-black text-[#b90041]">
                        ₹{dailyBudget.toLocaleString('en-IN')} / day
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="100000"
                      step="5000"
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(parseInt(e.target.value, 10))}
                      className="w-full accent-[#b90041]"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>₹5,000</span>
                      <span>₹50,000</span>
                      <span>₹1,00,000</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">
                        Campaign Priority
                      </label>
                      <select
                        value={campaignPriority}
                        onChange={(e) => setCampaignPriority(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#b90041] font-medium"
                      >
                        <option>High (Top Banner Placement)</option>
                        <option>Urgent / Flash Event</option>
                        <option>Standard Distribution</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 block">
                        Total Reseller Bonus Pool
                      </label>
                      <input
                        type="text"
                        value={payoutPool}
                        onChange={(e) => setPayoutPool(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#b90041] font-medium"
                        placeholder="₹5,00,000"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 bg-pink-50/60 rounded-xl border border-pink-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Duration:</span>
                      <span className="font-bold text-slate-900">15 Days ({startDate} to {endDate})</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Estimated Ad Spend:</span>
                      <span className="font-bold text-slate-900">₹{(dailyBudget * 15).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Bonus Incentive Pool:</span>
                      <span className="font-bold text-[#b90041]">₹{payoutPool}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    currentStep === 1
                      ? 'text-slate-300 bg-transparent cursor-not-allowed'
                      : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 cursor-pointer shadow-xs active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Previous Step
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-[#b90041] hover:bg-[#df2457] transition-all shadow-md active:scale-95 cursor-pointer text-sm"
                  >
                    Continue to {currentStep === 1 ? 'Audience' : currentStep === 2 ? 'Creative' : 'Budget'}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsLaunchModalOpen(true)}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md active:scale-95 cursor-pointer text-sm"
                  >
                    Review & Launch
                    <span className="material-symbols-outlined text-lg">rocket_launch</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Live Mobile Preview */}
            <div className="xl:col-span-5 flex flex-col items-center">
              <div className="sticky top-20 w-full flex flex-col items-center">
                <div className="flex items-center justify-between w-[300px] mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live App Preview
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Real-time sync</span>
                </div>

                {/* Mobile Phone Mockup */}
                <div className="relative w-[300px] h-[590px] bg-[#191C1E] rounded-[3rem] p-3.5 border-[6px] border-[#2e3132] shadow-2xl">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#191C1E] rounded-b-2xl z-30 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-black/60 mr-2"></div>
                    <div className="w-10 h-1.5 rounded-full bg-black/40"></div>
                  </div>

                  {/* Inner Screen */}
                  <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden flex flex-col relative">
                    {/* Status Bar */}
                    <div className="h-7 w-full flex justify-between items-center px-6 pt-2 select-none bg-white">
                      <span className="text-[10px] font-bold text-slate-800">9:41</span>
                      <div className="flex items-center gap-1 text-slate-800">
                        <span className="material-symbols-outlined text-xs">signal_cellular_4_bar</span>
                        <span className="material-symbols-outlined text-xs">wifi</span>
                        <span className="material-symbols-outlined text-xs">battery_full</span>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 bg-white">
                      <span className="material-symbols-outlined text-lg text-slate-700">menu</span>
                      <span className="font-black text-[#b90041] text-sm tracking-tight font-['Plus_Jakarta_Sans']">
                        MEESHO
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-slate-700">favorite_border</span>
                        <span className="material-symbols-outlined text-lg text-slate-700">shopping_cart</span>
                      </div>
                    </div>

                    {/* App Body - Scrollable content */}
                    <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
                      {/* Search bar inside mockup */}
                      <div className="bg-slate-100 rounded-full px-3 py-1.5 flex items-center gap-2 text-slate-400 text-xs">
                        <span className="material-symbols-outlined text-sm">search</span>
                        <span>Search sarees, dresses, electronics...</span>
                      </div>

                      {/* Live Campaign Banner */}
                      <div className="w-full rounded-xl overflow-hidden relative shadow-sm group">
                        <div className="w-full h-40 bg-slate-200 relative overflow-hidden">
                          <img
                            src={bannerImageUrl}
                            alt="Campaign Banner Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-3">
                            <span className="text-white text-[10px] font-extrabold bg-[#b90041] px-2 py-0.5 rounded w-fit mb-1 shadow-xs tracking-wider">
                              {badgeText}
                            </span>
                            <h4 className="text-white font-black text-base leading-tight drop-shadow-sm font-['Plus_Jakarta_Sans']">
                              {bannerHeadline}
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Reseller Bonus Card */}
                      <div className="bg-pink-50 p-3 rounded-xl border border-pink-100">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="material-symbols-outlined text-[#b90041] text-sm">
                            military_tech
                          </span>
                          <span className="text-[#b90041] font-black text-[11px] uppercase tracking-wider">
                            RESELLER EXCLUSIVE
                          </span>
                        </div>
                        <p className="text-slate-900 text-xs font-bold leading-snug">
                          {rewardSubtitle}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{rewardNote}</p>
                      </div>

                      {/* WhatsApp Share Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewShared(true);
                          setTimeout(() => setPreviewShared(false), 2000);
                        }}
                        className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 rounded-full flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">share</span>
                        <span className="font-bold text-xs">
                          {previewShared ? 'Shared Demo Link!' : ctaText}
                        </span>
                      </button>

                      {/* Feed Mini Items */}
                      <div className="pt-1">
                        <div className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                          Trending Catalogs
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-100 rounded-lg p-2 flex flex-col gap-1">
                            <div className="h-16 bg-slate-200 rounded-md"></div>
                            <div className="h-2 w-16 bg-slate-300 rounded"></div>
                            <div className="h-2 w-10 bg-slate-300 rounded"></div>
                          </div>
                          <div className="bg-slate-100 rounded-lg p-2 flex flex-col gap-1">
                            <div className="h-16 bg-slate-200 rounded-md"></div>
                            <div className="h-2 w-16 bg-slate-300 rounded"></div>
                            <div className="h-2 w-10 bg-slate-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estimated Reach Card */}
                <div className="mt-6 w-[300px] bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Est. Total Reach
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xl font-black text-[#4d41df] font-['Plus_Jakarta_Sans']">
                        {calculateEstimatedReach()}
                      </span>
                      <span className="material-symbols-outlined text-emerald-600 text-sm">
                        trending_up
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Based on ₹{dailyBudget.toLocaleString('en-IN')}/day budget
                    </span>
                  </div>
                  <div className="w-16 h-10 flex items-end gap-1">
                    <div className="w-2.5 h-4 bg-indigo-100 rounded-t-xs"></div>
                    <div className="w-2.5 h-6 bg-indigo-200 rounded-t-xs"></div>
                    <div className="w-2.5 h-8 bg-indigo-400 rounded-t-xs"></div>
                    <div className="w-2.5 h-10 bg-[#4d41df] rounded-t-xs"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Launch Confirmation Modal */}
      {isLaunchModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {isLaunched ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
                  Campaign Published!
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  "{campaignName}" is now active and broadcasting to {calculateEstimatedReach()} resellers
                  across {region}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-full bg-pink-100 text-[#b90041] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-xl">rocket_launch</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                      Launch Marketing Campaign
                    </h3>
                    <p className="text-xs text-slate-500">Ready to distribute across the reseller network</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Campaign:</span>
                    <span className="font-bold text-slate-800">{campaignName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Region:</span>
                    <span className="font-bold text-slate-800">{region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reseller Bonus:</span>
                    <span className="font-bold text-emerald-600">+{bonusCommission}% Bonus</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Daily Budget:</span>
                    <span className="font-bold text-slate-800">₹{dailyBudget.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  By launching, notifications and live feed banners will immediately be scheduled for qualified resellers.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLaunchModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLaunchSuccess}
                    className="flex-1 py-2.5 rounded-xl bg-[#b90041] hover:bg-[#df2457] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Confirm & Launch
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignCreationFlowAdmin;
