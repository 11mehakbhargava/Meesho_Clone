import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavDrawer from '../../components/NavDrawer';
import AppBottomNav from '../../components/AppBottomNav';

const affiliateProducts = [
  {
    id: 1,
    title: "Premium Quartz Watch",
    commissionRate: "12%",
    maxEarn: "₹450/sale",
    code: "AFF-WATCH-89",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrcNuIWxjyyKLS-BgOPoozPh62q1yC8cEOIdnaciIgw5pym48RaNNbCJFPfWDkrewgNLiVlj_1AgvCOi9t4eL4rWT1V5ZRacyRtIE9uUgQJIpIMxe-xP-LXmYdK4lWHhURbHm9L0Vf7wnl4Qwb5a0ziAdFjtSpcByYdI_SV6gBjXXfgRLb_lh8zrxfhf_bZfDIOsSnIsCh_7uofLROWus5kgeK0OwcEHUzriM4yQCaR4i3-rfsxpS0vjhmSD4h0Es4J5cNUMtM_U4"
  },
  {
    id: 2,
    title: "Ultra-Light Sports Sneakers",
    commissionRate: "15%",
    maxEarn: "₹290/sale",
    code: "AFF-SNEAK-32",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3_8ZOO_rGEA4Ew8OyI60VoxNLVmp16xo1vSyzeX1FrKnrgbGmD4VWI5f9JThMwf3qFEuOwRTze7ft49f4xOpIAnYrs-b3DpYVkoXdI57h9mgdb2SL70A5bS3cYVzT1DOTSmiY3s2Iv-0ZoTvdTyxy5msJci8ELPVdImFsJxq8GwtS8jFifs_q4wce3_p5nPYtQpt6egJO-qBaZ6wjvVMMG1SlFuJnTfXgicfGgDPz_JSNSRc3lvnWmTyJkwxisQJ6ZQrxNX66aqI"
  },
  {
    id: 3,
    title: "Organic Vitamin C Serum",
    commissionRate: "20%",
    maxEarn: "₹180/sale",
    code: "AFF-GLOW-11",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHSLa0kcwcYkzDmUKRl6Ja6YTEEwpAqwCiMePFc7t0C3YbN6IutQd5UxHkO57A7gj7P2I4z2t4BlRwe1DhYqQBzOTb1MQln-6R-w040wzmHroBmqevm7Q4vIass1lTzHNrL9xXWSubKKnbBIlmmltF14FFwhO9vkwz0SqVHByBsPd49QUi51AoVHU72XyIsMM9LU6nG2IMV6FG7cdgVuvItT0fBtbxuT9epX2tuSCEU2j4v_qlWvEPjgr37yNn4OLJjcR3MM8wwYw"
  }
];

export default function AffiliateProgram() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('weekly');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedToast, setCopiedToast] = useState('');

  const handleCopyLink = (prod) => {
    const affiliateUrl = `https://meesho.com/affiliate/${prod.code}?ref=RESELLER_PRO`;
    navigator.clipboard.writeText(affiliateUrl);
    setCopiedId(prod.id);
    setCopiedToast(`Copied tracking link for "${prod.title}"!`);

    setTimeout(() => {
      setCopiedId(null);
      setCopiedToast('');
    }, 2500);
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/20 min-h-screen pb-32">
      {/* TopAppBar - Full Width */}
      <header className="w-full top-0 sticky z-50 bg-[#F8F9FB] border-b border-gray-100">
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-16 py-3.5 w-full">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-1 rounded-full hover:bg-gray-100 active:scale-95 transition-transform duration-150 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#191C1E] text-2xl">arrow_back</span>
            </button>
            <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg sm:text-xl tracking-tight text-[#191C1E]">
              Earn with Us
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl font-extrabold text-[#FF3F6C]">Affiliate Program</span>
            <button 
              onClick={() => navigate('/affiliate-panel')} 
              className="active:scale-95 transition-transform duration-150 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#191C1E]" data-icon="help_outline">help_outline</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-8">
        {copiedToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-3 px-4 rounded-2xl text-center shadow-lg animate-fade-in">
            ✅ {copiedToast}
          </div>
        )}

        {/* Wallet / Available Balance Section */}
        <section className="relative overflow-hidden rounded-3xl bg-secondary-container p-6 md:p-8 text-on-secondary-container shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <p className="font-label text-xs uppercase tracking-widest opacity-80 font-bold">
                Available Balance
              </p>
              <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-white">
                ₹12,450.00
              </h2>
              <p className="text-sm opacity-90 text-white/90 font-medium">
                +₹840 earned this week
              </p>
            </div>
            <button 
              onClick={() => navigate('/withdraw-earnings')}
              className="w-full md:w-auto bg-white text-secondary font-bold px-8 py-4 rounded-xl active:scale-95 transition-all shadow-lg hover:shadow-secondary-container/20 cursor-pointer text-sm"
            >
              Withdraw Commission
            </button>
          </div>
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        </section>

        {/* Overview Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] flex flex-col gap-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <span className="font-headline font-bold text-on-surface-variant text-sm">Total Sales Generated</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-on-surface">1,284</p>
              <p className="text-emerald-600 text-xs font-bold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +12% vs last month
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] flex flex-col gap-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="font-headline font-bold text-on-surface-variant text-sm">Lifetime Commission</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-on-surface">₹48,200</p>
              <p className="text-emerald-600 text-xs font-bold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +8.4% growth
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] flex flex-col gap-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-800">
                <span className="material-symbols-outlined">ads_click</span>
              </div>
              <span className="font-headline font-bold text-on-surface-variant text-sm">Link Clicks</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-on-surface">14.2k</p>
              <p className="text-amber-600 text-xs font-bold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +4.5% conversion rate
              </p>
            </div>
          </div>
        </section>

        {/* Performance Chart Section */}
        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="font-headline text-xl font-bold">Commission Performance</h3>
              <p className="text-on-surface-variant text-xs mt-0.5">
                {chartPeriod === 'weekly' ? 'Commission earned over the last 7 days' : 'Last 30 days breakdown'}
              </p>
            </div>
            <div className="flex gap-2 bg-surface-container-low p-1 rounded-full">
              <button
                onClick={() => setChartPeriod('daily')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  chartPeriod === 'daily' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setChartPeriod('weekly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  chartPeriod === 'weekly' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* Visualization Bars */}
          <div className="h-56 w-full flex items-end justify-between gap-2 md:gap-4 px-2 pt-6">
            {[
              { day: "MON", height: "35%", val: "₹650" },
              { day: "TUE", height: "48%", val: "₹920" },
              { day: "WED", height: "65%", val: "₹1,450" },
              { day: "THU", height: "92%", val: "₹2,100", active: true },
              { day: "FRI", height: "55%", val: "₹1,200" },
              { day: "SAT", height: "78%", val: "₹1,780" },
              { day: "SUN", height: "40%", val: "₹820" }
            ].map((item) => (
              <div key={item.day} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                <span className="text-[10px] font-bold text-on-surface-variant mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.val}
                </span>
                <div 
                  style={{ height: item.height }} 
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                    item.active 
                      ? 'bg-primary shadow-lg shadow-primary/30' 
                      : 'bg-surface-container-high group-hover:bg-primary/30'
                  }`}
                />
                <p className={`text-[11px] text-center mt-2 font-bold ${item.active ? 'text-primary font-black' : 'text-on-surface-variant'}`}>
                  {item.day}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Active High-Commission Products */}
        <section className="space-y-4">
          <div>
            <h3 className="font-headline text-xl font-bold">Trending for Affiliates</h3>
            <p className="text-on-surface-variant text-xs">Products with highest commission multiplier</p>
          </div>

          <div className="space-y-3">
            {affiliateProducts.map((prod) => {
              const isCopied = copiedId === prod.id;
              return (
                <div
                  key={prod.id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md"
                >
                  <div className="w-16 h-16 rounded-xl bg-surface-container-low overflow-hidden flex-shrink-0">
                    <img className="w-full h-full object-cover" alt={prod.title} src={prod.image} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-on-surface text-sm truncate">{prod.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        {prod.commissionRate} Comm.
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        Earn up to {prod.maxEarn}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyLink(prod)}
                    className={`transition-all px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isCopied ? 'check' : 'link'}
                    </span>
                    {isCopied ? 'Copied!' : 'Get Link'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Universal Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="home" />

      {/* Navigation Drawer */}
      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
