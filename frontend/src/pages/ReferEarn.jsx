import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavDrawer from "../components/NavDrawer";

export default function ReferEarn({ onBack }) {
  const navigate = useNavigate();
  const referralCode = "MISH100X";
  const [copied, setCopied] = useState(false);
  const [activeNav, setActiveNav] = useState("account");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleWhatsAppShare = () => {
    const message = `Join me on The Atelier! Use my referral code ${referralCode} to get 25% OFF on your first order. Download now!`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="bg-[#f8f9fb] font-sans text-[#191c1e] min-h-screen selection:bg-[#b90041]/20">

      {/* ================= HEADER ================= */}
      <header className="w-full sticky top-0 z-50 bg-[#F8F9FB] border-b border-[#F2F4F6]">
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-16 py-3.5 w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              aria-label="Back"
              className="p-1.5 rounded-full hover:bg-gray-100 active:scale-95 transition-transform duration-150 text-[#191C1E] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg tracking-tight text-[#191C1E]">
              Earn with Us
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xl font-extrabold text-[#FF3F6C]">Refer &amp; Earn</span>
            <button
              aria-label="Help"
              className="active:scale-95 transition-transform duration-150 text-[#191C1E] cursor-pointer"
            >
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </div>

        <div className="bg-[#F2F4F6] h-1 w-full"></div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="w-full max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 pb-32">

        {/* ================= HERO ================= */}
        <section className="px-6 pt-8 pb-10 overflow-hidden relative">
          <div className="flex flex-col items-center text-center space-y-6">

            <div className="relative w-full aspect-[4/3] flex items-center justify-center">

              <div className="absolute inset-0 bg-[#b90041]/5 rounded-3xl -rotate-2"></div>

              <img
                alt="Friends celebrating and sharing"
                className="w-full h-full object-cover rounded-3xl shadow-xl rotate-1 relative z-10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDNDeTW1jqZyZOnSw-BAICbGCCrKCvBCaC6rCymCMJE2Md01F8pa4Dv_iMMy_Q9f1pwowrZLJ44ehcGjI0BkMtEHH2YybaMTGWdxzpFNUZh_g0gctSzaWY11AqSCYY3T63MVVxKUSq3wek9585b-BZU7uep2rmeI_ROFP-nwk-h6HVmC-ACGtbCLARgu79XkZtaLQZTYNzXgKSeROLf5KcHbHOEYkbkIDbatFzLSrZm_F5VShwd6xE0R0e4nIHt9ceRRd1lOofyoc"
              />
            </div>

            <div className="space-y-2">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-3xl text-[#191c1e] tracking-tight leading-tight">
                Earn <span className="text-[#b90041]">₹100</span> for every referral
              </h2>

              <p className="text-[#5b4042] text-sm font-medium">
                Your friends get 25% off their first order too!
              </p>
            </div>

          </div>
        </section>

        {/* ================= REFERRAL CODE ================= */}
        <section className="px-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-[0_12px_32px_rgba(25,28,30,0.06)] space-y-6">

            <div className="space-y-3">

              <label className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b4042]/60 block text-center">
                Your Personal Code
              </label>

              <div className="flex items-center justify-between bg-[#f2f4f6] p-2 pr-2 pl-6 rounded-2xl">

                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl tracking-widest text-[#191c1e]">
                  {referralCode}
                </span>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="bg-[#df2457] text-[#fffbff] px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  {copied ? "COPIED! ✓" : "COPY"}
                </button>

              </div>
            </div>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full bg-gradient-to-br from-[#b90041] to-[#df2457] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-[#b90041]/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>

              <span>SHARE ON WHATSAPP</span>
            </button>

          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="px-6 mb-12">

          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xl mb-8">
            How it works
          </h3>

          <div className="space-y-10 relative">

            <div className="absolute left-6 top-4 bottom-4 w-px bg-[#e1e2e4]"></div>

            {/* STEP 1 */}
            <div className="flex gap-6 items-start relative z-10">

              <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#c4c0ff] flex items-center justify-center text-[#100069]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base mb-1">
                  Share
                </h4>

                <p className="text-sm text-[#5b4042] leading-relaxed">
                  Send your referral link or code to your friends and family.
                </p>
              </div>

            </div>

            {/* STEP 2 */}
            <div className="flex gap-6 items-start relative z-10">

              <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#5fde88] flex items-center justify-center text-[#00210c]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base mb-1">
                  Friend Orders
                </h4>

                <p className="text-sm text-[#5b4042] leading-relaxed">
                  Your friend completes their first order using your referral code.
                </p>
              </div>

            </div>

            {/* STEP 3 */}
            <div className="flex gap-6 items-start relative z-10">

              <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#ffd9dc] flex items-center justify-center text-[#400011]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m0 0h19.5m-19.5 0V4.5A2.25 2.25 0 014.5 2.25h15A2.25 2.25 0 0121.75 4.5V6m0 0v12.75A2.25 2.25 0 0119.5 21H4.5A2.25 2.25 0 012.25 18.75V6"
                  />
                </svg>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base mb-1">
                  You Earn
                </h4>

                <p className="text-sm text-[#5b4042] leading-relaxed">
                  You receive ₹100 directly in your wallet once the return period ends.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ================= MY REFERRALS ================= */}
        <section className="px-6 mb-8">

          <div className="bg-[#e7e8ea] p-6 rounded-3xl">

            <div className="flex justify-between items-center mb-6">

              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#191c1e]">
                My Referrals
              </h3>

              <button
                type="button"
                onClick={() => setShowReferralsModal(true)}
                className="text-[#b90041] font-bold text-sm cursor-pointer hover:underline"
              >
                View Details
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-white p-4 rounded-2xl shadow-sm">

                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5b4042] mb-1">
                  Total Referrals
                </p>

                <p className="text-2xl font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#4d41df]">
                  24
                </p>

              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm">

                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5b4042] mb-1">
                  Total Earnings
                </p>

                <p className="text-2xl font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#b90041]">
                  ₹2,400
                </p>

              </div>

            </div>

          </div>
        </section>

      </main>
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 sm:px-12 md:px-24 lg:px-48 pb-6 pt-2 bg-white/90 backdrop-blur-md z-50 border-t border-[#191C1E]/10 shadow-[0_-12px_32px_rgba(25,28,30,0.06)] rounded-t-3xl">

        {/* HOME */}
        <button
          onClick={() => { setActiveNav("home"); navigate("/reseller-home"); }}
          className={`flex flex-col items-center justify-center px-3 py-1.5 transition-colors active:scale-90 duration-200 cursor-pointer ${
            activeNav === "home"
              ? "text-[#FF3F6C]"
              : "text-[#191C1E]/60"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>

          <span className="text-[10px] font-medium uppercase tracking-wider mt-1">
            Home
          </span>
        </button>

        {/* CATEGORIES */}
        <button
          onClick={() => { setActiveNav("categories"); navigate("/reseller-home"); }}
          className={`flex flex-col items-center justify-center px-3 py-1.5 transition-colors active:scale-90 duration-200 cursor-pointer ${
            activeNav === "categories"
              ? "text-[#FF3F6C]"
              : "text-[#191C1E]/60"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>

          <span className="text-[10px] font-medium uppercase tracking-wider mt-1">
            Categories
          </span>
        </button>

        {/* ORDERS */}
        <button
          onClick={() => { setActiveNav("orders"); navigate("/notifications"); }}
          className={`flex flex-col items-center justify-center px-3 py-1.5 transition-colors active:scale-90 duration-200 cursor-pointer ${
            activeNav === "orders"
              ? "text-[#FF3F6C]"
              : "text-[#191C1E]/60"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>

          <span className="text-[10px] font-medium uppercase tracking-wider mt-1">
            My Orders
          </span>
        </button>

        {/* COMMUNITY */}
        <button
          onClick={() => { setActiveNav("community"); navigate("/community-hub"); }}
          className={`flex flex-col items-center justify-center px-3 py-1.5 transition-colors active:scale-90 duration-200 cursor-pointer ${
            activeNav === "community"
              ? "text-[#FF3F6C]"
              : "text-[#191C1E]/60"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>

          <span className="text-[10px] font-medium uppercase tracking-wider mt-1">
            Community
          </span>
        </button>

        {/* ACCOUNT */}
        <button
          onClick={() => setActiveNav("account")}
          className={`flex flex-col items-center justify-center rounded-2xl px-3 py-1.5 active:scale-90 transition-transform duration-200 cursor-pointer ${
            activeNav === "account"
              ? "text-[#FF3F6C] bg-[#FF3F6C]/10 font-semibold"
              : "text-[#191C1E]/60"
          }`}
        >
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>

          <span className="text-[10px] font-medium uppercase tracking-wider mt-1">
            Account
          </span>
        </button>

      </nav>

      {/* Navigation Drawer */}
      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}