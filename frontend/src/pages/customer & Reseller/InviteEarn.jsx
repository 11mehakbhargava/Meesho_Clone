import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getReferralStats } from '../../services/ecommerceService';

export default function InviteEarn({ onNavigate, onBack }) {
  const navigate = useNavigate();

  // Navigation helpers
  const handleNav = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Get current user details from storage
  const customerUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('mshoppy_customer_user') || '{}');
    } catch {
      return {};
    }
  }, []);

  // UI state
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showMyInvites, setShowMyInvites] = useState(false);
  const [expandedFriends, setExpandedFriends] = useState({});

  const toggleExpandFriend = (id) => {
    setExpandedFriends((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  // Real Dynamic State from Backend
  const [referralData, setReferralData] = useState({
    referralCode: '',
    referralLink: '',
    totalInvited: 0,
    deliveredCount: 0,
    totalCashEarned: 0,
    maxPotentialCash: 1230,
    walletBalance: 0,
    milestones: Array.from({ length: 10 }, (_, i) => {
      const num = i + 1;
      const suffix = num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th';
      return {
        id: num,
        amount: 123,
        label: `${num}${suffix} Invite`,
        unlocked: false,
        statusText: num === 1 ? 'Pending' : 'Locked'
      };
    }),
    friends: [],
    suggestedContacts: []
  });

  // LocalStorage persistence helpers so custom added friends & invite status NEVER disappear on refresh
  const STORAGE_CUSTOM_CONTACTS = 'mshoppy_custom_contacts';
  const STORAGE_INVITED_MAP = 'mshoppy_invited_contacts_map';

  const getSavedCustomContacts = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_CUSTOM_CONTACTS) || '[]');
    } catch {
      return [];
    }
  };

  const getSavedInvitedMap = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_INVITED_MAP) || '{}');
    } catch {
      return {};
    }
  };

  const [activeContacts, setActiveContacts] = useState(() => {
    const custom = getSavedCustomContacts();
    const map = getSavedInvitedMap();
    return custom.map((c) => ({
      ...c,
      invited: !!map[c.id] || !!map[(c.phone || '').replace(/[^0-9]/g, '').slice(-10)] || !!c.invited
    }));
  });

  // Fetch real database referral statistics on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getReferralStats()
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setReferralData(data);
          
          const customList = getSavedCustomContacts();
          const invitedMap = getSavedInvitedMap();

          // Merge custom contacts first, then backend suggestions
          const combined = [...customList, ...(data.suggestedContacts || [])];
          const seen = new Set();
          const merged = [];

          for (const c of combined) {
            const cleanP = (c.phone || '').replace(/[^0-9]/g, '').slice(-10);
            const key = cleanP || c.id;
            if (seen.has(key)) continue;
            seen.add(key);

            merged.push({
              ...c,
              invited: !!invitedMap[key] || !!invitedMap[c.id] || !!c.invited
            });
          }

          setActiveContacts(merged);
        }
      })
      .catch((err) => {
        console.error('Failed to load real referral stats:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Persistent / dynamic referral code and link
  const currentReferralCode = referralData.referralCode || (
    customerUser?.phone
      ? `MSHOPPY${customerUser.phone.slice(-4)}`
      : 'MSHOPPY2026'
  );
  const currentReferralLink = referralData.referralLink || `${window.location.origin}/?ref=${currentReferralCode}`;

  const pendingCount = referralData.pendingCount ?? Math.max(0, (referralData.totalInvited || referralData.friends?.length || 0) - (referralData.deliveredCount || 0));
  const successfulFriends = (referralData.friends || []).filter((f) => f.hasDelivered);
  const pendingFriends = (referralData.friends || []).filter((f) => !f.hasDelivered);

  // Filtered contacts based on search query
  const filteredContacts = activeContacts.filter((c) =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery)
  );

  // Copy referral link/code
  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentReferralLink);
    setCopiedCode(true);
    toast.success('Referral link copied to clipboard! 📋');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentReferralCode);
    setCopiedCode(true);
    toast.success(`Referral code ${currentReferralCode} copied!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Build personalized WhatsApp invite message
  const getInviteMessage = (friendName) => {
    const greeting = friendName ? `Hey ${friendName}!` : 'Hey!';
    return `${greeting} Shop amazing quality fashion, beauty & home essentials at lowest wholesale prices on MShoppy!\n\nUse my exclusive invite link to get flat 20% OFF on your first order:\n👉 ${currentReferralLink}\n\nOr use referral code: *${currentReferralCode}* at checkout.\nHappy Shopping! 🛍️✨`;
  };

  // WhatsApp share
  const handleShareWhatsApp = (contact) => {
    const message = getInviteMessage(contact?.name);
    const encoded = encodeURIComponent(message);
    const cleanPhone = contact?.phone ? contact.phone.replace(/[^0-9]/g, '') : '';
    const whatsappUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    if (contact) {
      const cleanP = (contact.phone || '').replace(/[^0-9]/g, '').slice(-10);
      const invitedMap = getSavedInvitedMap();
      if (cleanP) invitedMap[cleanP] = true;
      invitedMap[contact.id] = true;
      localStorage.setItem(STORAGE_INVITED_MAP, JSON.stringify(invitedMap));

      setActiveContacts((prev) =>
        prev.map((c) => {
          const match = c.id === contact.id || ((c.phone || '').replace(/[^0-9]/g, '').slice(-10) === cleanP);
          return match ? { ...c, invited: true } : c;
        })
      );
      toast.success(`Invite sent to ${contact.name}! 🚀`);
    }

    window.open(whatsappUrl, '_blank');
  };

  // Generic native share or copy fallback
  const handleNativeShare = async () => {
    const shareData = {
      title: 'Shop on MShoppy & Get 20% OFF!',
      text: `Join MShoppy using my invite code ${currentReferralCode} and get 20% OFF on your first order! 🛍️`,
      url: currentReferralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Modern Mobile Native Contacts Picker (if supported by device)
  const handlePickPhoneContacts = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel'];
        const contacts = await navigator.contacts.select(props, { multiple: true });
        if (contacts && contacts.length > 0) {
          const newItems = contacts.map((c, i) => ({
            id: `device_${Date.now()}_${i}`,
            name: c.name?.[0] || 'Phone Contact',
            phone: c.tel?.[0] || '',
            invited: false,
            avatar: (c.name?.[0] || 'P').slice(0, 2).toUpperCase(),
            color: 'bg-indigo-100 text-indigo-700'
          }));
          const existingCustom = getSavedCustomContacts();
          const updated = [...newItems, ...existingCustom];
          localStorage.setItem(STORAGE_CUSTOM_CONTACTS, JSON.stringify(updated));
          setActiveContacts((prev) => [...newItems, ...prev]);
          toast.success(`Imported ${newItems.length} contacts from your phone! 📱`);
        }
      } catch (err) {
        console.warn('Native contacts pick cancelled or unsupported:', err);
      }
    } else {
      setShowAddContactModal(true);
    }
  };

  // Add custom contact manually
  const handleAddCustomContact = (e) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) {
      toast.error('Please enter friend name and phone number');
      return;
    }
    const cleanDigits = newContactPhone.trim().replace(/[^0-9]/g, '');
    const custom = {
      id: `custom_${Date.now()}`,
      name: newContactName.trim(),
      phone: cleanDigits.length === 10 ? `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}` : newContactPhone.trim(),
      rawPhone: cleanDigits,
      invited: false,
      avatar: newContactName.trim().slice(0, 2).toUpperCase(),
      color: 'bg-emerald-100 text-emerald-700'
    };

    const existingCustom = getSavedCustomContacts();
    const updated = [custom, ...existingCustom.filter(c => (c.phone || '').replace(/[^0-9]/g, '').slice(-10) !== cleanDigits.slice(-10))];
    localStorage.setItem(STORAGE_CUSTOM_CONTACTS, JSON.stringify(updated));

    setActiveContacts((prev) => [custom, ...prev.filter(c => (c.phone || '').replace(/[^0-9]/g, '').slice(-10) !== cleanDigits.slice(-10))]);
    setShowAddContactModal(false);
    setNewContactName('');
    setNewContactPhone('');
    toast.success(`Added ${custom.name}! Click 'Invite Now' to send on WhatsApp.`);
  };

  // ── MY INVITES VIEW (Matching Screenshots 2 & 3) ──────────────────
  if (showMyInvites) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] text-slate-900 pb-28 select-none">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowMyInvites(false)}
              className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Back to Invite & Earn"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>

            <h1 className="font-extrabold text-sm sm:text-base tracking-wider text-slate-900 uppercase">
              MY INVITES
            </h1>

            <div className="w-9 h-9 -mr-2" />
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 pt-3 space-y-4">
          {/* Total Earnings Card (Exact Image 2) */}
          <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Earnings</span>
              <button
                type="button"
                onClick={() => handleNav('/user-dashboard1?tab=profile')}
                className="text-xs font-bold text-[#9f0038] hover:text-[#840032] flex items-center gap-0.5 cursor-pointer"
              >
                <span>Wallet Balance</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#840032] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                ₹{referralData.totalCashEarned}
              </span>
            </div>

            {/* Two Side-by-Side Summary Cards: Successful & Pending */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Successful Card (Green) */}
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-1">
                <span className="text-xs font-bold text-emerald-800 block">Successful</span>
                <p className="text-2xl font-black text-slate-900">
                  {referralData.deliveredCount}
                </p>
                <span className="text-[11px] font-semibold text-slate-600 block">
                  Earned: ₹{referralData.totalCashEarned}
                </span>
              </div>

              {/* Pending Card (Orange) */}
              <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-1">
                <span className="text-xs font-bold text-amber-800 block">Pending</span>
                <p className="text-2xl font-black text-slate-900">
                  {pendingCount}
                </p>
                <span className="text-[11px] font-semibold text-slate-600 block">
                  Pending: ₹{pendingCount * 123}
                </span>
              </div>
            </div>
          </section>

          {/* Pending Friends Section (Matching Image 2 & 3) */}
          {pendingFriends.length > 0 && (
            <section className="space-y-2.5">
              <h3 className="font-black text-sm text-slate-900 px-1">
                Pending ({pendingFriends.length})
              </h3>

              <div className="space-y-2.5">
                {pendingFriends.map((friend) => {
                  const isExpanded = expandedFriends[friend.id] !== false;
                  return (
                    <div
                      key={friend.id}
                      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${friend.color}`}>
                          {friend.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-slate-900 truncate">
                            {friend.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {friend.phone}
                          </p>
                        </div>
                      </div>

                      {/* Dropdown status row (Image 2) */}
                      <button
                        type="button"
                        onClick={() => toggleExpandFriend(friend.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-base text-[#9f0038]">
                            inventory_2
                          </span>
                          <span className="text-xs font-semibold text-slate-700 truncate">
                            {friend.statusDetail || 'Waiting for their order to be delivered'}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      {/* 3-Step Progress Tracker (Image 3) */}
                      {isExpanded && (
                        <div className="pt-4 pb-3 px-3 bg-slate-50/50 rounded-xl border border-slate-100/80">
                          <div className="relative flex items-center justify-between max-w-xs mx-auto">
                            {/* Track Line */}
                            <div className="absolute top-4 left-6 right-6 h-[2px] bg-slate-200 -z-0" />
                            <div
                              className="absolute top-4 left-6 h-[2px] bg-emerald-500 transition-all duration-500 -z-0"
                              style={{ width: friend.hasDelivered ? '100%' : '50%' }}
                            />

                            {/* Step 1: App Installed */}
                            <div className="flex flex-col items-center relative z-10">
                              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[3] text-white" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 mt-1.5 whitespace-nowrap">
                                App Installed
                              </span>
                            </div>

                            {/* Step 2: Order Delivered */}
                            <div className="flex flex-col items-center relative z-10">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xs transition-all ${
                                friend.hasDelivered
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              }`}>
                                {friend.hasDelivered ? (
                                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[3] text-white" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <span className="material-symbols-outlined text-sm text-slate-500">
                                    inventory_2
                                  </span>
                                )}
                              </div>
                              <span className={`text-[10px] font-bold mt-1.5 whitespace-nowrap ${
                                friend.hasDelivered ? 'text-emerald-700' : 'text-slate-600'
                              }`}>
                                Order Delivered
                              </span>
                            </div>

                            {/* Step 3: Cash Earned */}
                            <div className="flex flex-col items-center relative z-10">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xs transition-all ${
                                friend.hasDelivered
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              }`}>
                                {friend.hasDelivered ? (
                                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[3] text-white" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <span className="font-extrabold text-xs text-slate-500">₹</span>
                                )}
                              </div>
                              <span className={`text-[10px] font-bold mt-1.5 whitespace-nowrap ${
                                friend.hasDelivered ? 'text-emerald-700' : 'text-slate-600'
                              }`}>
                                Cash Earned
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Successful Friends Section */}
          {successfulFriends.length > 0 && (
            <section className="space-y-2.5">
              <h3 className="font-black text-sm text-emerald-800 px-1">
                Successful ({successfulFriends.length})
              </h3>

              <div className="space-y-2.5">
                {successfulFriends.map((friend) => {
                  const isExpanded = expandedFriends[friend.id] !== false;
                  return (
                    <div
                      key={friend.id}
                      className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${friend.color}`}>
                          {friend.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-slate-900 truncate">
                            {friend.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {friend.phone}
                          </p>
                        </div>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          +₹123 Earned
                        </span>
                      </div>

                      {/* Dropdown status row */}
                      <button
                        type="button"
                        onClick={() => toggleExpandFriend(friend.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 cursor-pointer hover:bg-emerald-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-base text-emerald-600">
                            check_circle
                          </span>
                          <span className="text-xs font-bold text-emerald-800 truncate">
                            1st Order Delivered! Cash Credited 🎉
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      {/* 3-Step Progress Tracker (All 3 Green) */}
                      {isExpanded && (
                        <div className="pt-4 pb-3 px-3 bg-emerald-50/30 rounded-xl border border-emerald-100">
                          <div className="relative flex items-center justify-between max-w-xs mx-auto">
                            <div className="absolute top-4 left-6 right-6 h-[2px] bg-emerald-500 -z-0" />

                            <div className="flex flex-col items-center relative z-10">
                              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[3] text-white" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-800 mt-1.5 whitespace-nowrap">
                                App Installed
                              </span>
                            </div>

                            <div className="flex flex-col items-center relative z-10">
                              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[3] text-white" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-800 mt-1.5 whitespace-nowrap">
                                Order Delivered
                              </span>
                            </div>

                            <div className="flex flex-col items-center relative z-10">
                              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[3] text-white" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-800 mt-1.5 whitespace-nowrap">
                                Cash Earned
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Empty state if zero invites */}
          {referralData.friends.length === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-[#9f0038] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
              <p className="text-sm font-bold text-slate-700">No invites yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Share your invite link with friends. When they install the app and place their first order, you'll earn ₹123!
              </p>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900 pb-28 select-none">
      {/* ── Top Header Bar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Go Back"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>

          <h1 className="font-extrabold text-sm sm:text-base tracking-wider text-slate-900 uppercase">
            INVITE &amp; EARN
          </h1>

          <button
            type="button"
            onClick={() => setShowFaqModal(true)}
            className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Help & Terms"
            title="How Invite & Earn Works"
          >
            <span className="material-symbols-outlined text-2xl">help</span>
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-3 space-y-4">
        {/* ── Hero Section (Invite New Friends / Earn Cash) ─────────── */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs relative overflow-hidden text-center">
          {/* Subtle Confetti Decorative Accents */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-100/60 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100/60 rounded-full blur-xl pointer-events-none" />

          <p className="text-xs sm:text-sm font-bold text-slate-600 tracking-wide">
            Invite New Friends
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Earn Cash
          </h2>

          {/* 3 Steps Illustration Flow */}
          <div className="mt-6 grid grid-cols-5 items-center gap-1 text-center">
            {/* Step 1: Share Link */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-13 h-13 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-2xl text-[#9f0038]">
                  share
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-tight mt-2">
                Share Product/
                <br />
                Invite Link
              </p>
            </div>

            {/* Step 1 -> 2 Arrow */}
            <div className="col-span-1 flex justify-center text-[#9f0038] opacity-70">
              <span className="material-symbols-outlined text-xl">trending_flat</span>
            </div>

            {/* Step 2: Friends 1st Order Delivered */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shadow-xs relative">
                <span className="material-symbols-outlined text-2xl text-amber-600">
                  local_shipping
                </span>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-black">
                  ✓
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-tight mt-2">
                Friends 1st
                <br />
                Order Delivered
              </p>
            </div>

            {/* Step 2 -> 3 Arrow */}
            <div className="col-span-1 flex justify-center text-[#9f0038] opacity-70">
              <span className="material-symbols-outlined text-xl">trending_flat</span>
            </div>

            {/* Step 3: Earn Cash in Wallet Balance */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-13 h-13 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-2xl text-[#9f0038]">
                  account_balance_wallet
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-tight mt-2">
                Earn Cash in
                <br />
                Wallet Balance
              </p>
            </div>
          </div>
        </section>

        {/* ── 10 Invites Milestones (Exact Clean Card Matching Reference) ──── */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs">
          {/* Header Row: Total Earnings | Pending ... View All > (Matching Screenshot 1) */}
          <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-6 sm:gap-8">
              <div>
                <p className="text-[11px] font-bold text-slate-500">Total Earnings</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  ₹{referralData.totalCashEarned}
                </p>
              </div>
              <div className="h-8 w-[1px] bg-slate-200" />
              <div>
                <p className="text-[11px] font-bold text-slate-500">Pending</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {pendingCount}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMyInvites(true)}
              className="text-xs font-black text-[#9f0038] hover:text-[#840032] flex items-center gap-0.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <span>View All</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>

          {/* Horizontally scrollable container so all 10 milestones display cleanly */}
          <div className="overflow-x-auto no-scrollbar py-2 -mx-2 px-2 scroll-smooth">
            <div className="relative min-w-[760px] sm:min-w-[800px] px-6">
              {/* Horizontal Connecting Track Line with Dynamic Green Progress */}
              <div className="absolute top-7 left-10 right-10 h-[2px] bg-slate-200 overflow-hidden -z-0">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (referralData.deliveredCount / 10) * 100)}%`
                  }}
                />
              </div>

              {/* 10 Connected Milestone Circles */}
              <div className="grid grid-cols-10 gap-2 relative z-10 text-center">
                {referralData.milestones.map((m) => (
                  <div key={m.id} className="flex flex-col items-center">
                    {/* Circle with ₹123 */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center border-2 transition-all relative ${
                        m.unlocked
                          ? 'bg-emerald-50/40 border-emerald-500 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="font-bold text-xs sm:text-sm tracking-tight">
                        ₹{m.amount}
                      </span>

                      {/* Clean Vector Lock / Unlock Badge at bottom of circle */}
                      {m.unlocked ? (
                        <div className="absolute -bottom-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-[3] text-white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="absolute -bottom-1.5 w-5 h-5 rounded-full bg-[#9f005b] text-white flex items-center justify-center shadow-xs">
                          <svg className="w-2.5 h-2.5 fill-current text-white" viewBox="0 0 24 24">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Label below circle */}
                    <span className="mt-2.5 text-xs font-medium text-slate-700 whitespace-nowrap">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Your Real Referral Code & Copy Chip ──────────────────── */}
        <section className="bg-gradient-to-r from-rose-50 via-purple-50 to-pink-50 rounded-2xl p-4 border border-rose-100 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Your Referral Code
            </p>
            <p className="text-base font-black text-[#9f0038] tracking-widest font-mono">
              {currentReferralCode}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="px-3.5 py-1.5 bg-white border border-rose-200 text-[#9f0038] hover:bg-rose-50 text-xs font-black rounded-xl transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">
              {copiedCode ? 'check' : 'content_copy'}
            </span>
            <span>{copiedCode ? 'Copied' : 'Copy'}</span>
          </button>
        </section>

        {/* ── Real Invited Friends From Database (If Any) ──────────── */}
        {referralData.friends.length > 0 && (
          <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900">
                Your Invited Friends ({referralData.friends.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {referralData.friends.map((friend) => (
                <div key={friend.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${friend.color}`}>
                      {friend.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-800 truncate">
                        {friend.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {friend.phone}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${friend.statusClass}`}>
                    {friend.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── "Invite new friends" Section ──────────────────────────── */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight">
              Invite new friends
            </h3>

            {/* Quick Add Custom Friend or Mobile Contact import button */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePickPhoneContacts}
                className="text-[11px] font-bold text-[#9f0038] hover:text-[#840032] flex items-center gap-0.5 cursor-pointer bg-rose-50 px-2.5 py-1 rounded-full transition-colors"
                title="Add any friend number or select from phone"
              >
                <span className="material-symbols-outlined text-xs">add</span>
                <span>Add Friend</span>
              </button>
            </div>
          </div>

          {/* Search Bar matching screenshot */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search friends to invite"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9f0038] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Contact List */}
          <div className="divide-y divide-slate-100">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-1 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${contact.color}`}
                    >
                      {contact.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                        {contact.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {contact.phone}
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp "Invite Now" pill button */}
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(contact)}
                    className={`px-3.5 py-1.5 rounded-full border text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      contact.invited
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-[#9f0038] text-[#9f0038] hover:bg-rose-50 shadow-2xs'
                    }`}
                  >
                    {/* WhatsApp Green Icon */}
                    <svg
                      className="w-3.5 h-3.5 fill-current text-[#25D366] shrink-0"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.029-.475-1.708-.702-2.8-2.457-2.885-2.57-.085-.113-.687-.914-.687-1.745 0-.83.434-1.238.588-1.408.155-.17.339-.212.453-.212.113 0 .227.001.326.006.104.005.244-.04.382.292.144.344.492 1.201.536 1.288.044.088.073.19.014.305-.059.115-.089.186-.176.289-.088.102-.185.228-.264.307-.089.088-.182.185-.078.363.104.178.463.764.994 1.238.683.61 1.258.799 1.437.888.179.089.284.074.39-.045.106-.119.456-.531.577-.714.122-.182.244-.153.409-.092.164.061 1.042.491 1.221.58.179.089.298.133.342.207.045.074.045.431-.099.836z" />
                    </svg>
                    <span>{contact.invited ? 'Sent ✓' : 'Invite Now'}</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                <p>No contacts found matching "{searchQuery}".</p>
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(true)}
                  className="px-4 py-2 bg-rose-50 text-[#9f0038] font-bold rounded-xl text-xs hover:bg-rose-100 cursor-pointer"
                >
                  + Add Friend by Phone Number
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── Fixed Bottom Action Bar (Matching Screenshot) ─────────── */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 p-3 sm:p-4 shadow-xl">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          {/* Primary WhatsApp Button: Solid Meesho Magenta */}
          <button
            type="button"
            onClick={() => handleShareWhatsApp()}
            className="flex-1 bg-[#9f0038] hover:bg-[#840032] text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
          >
            {/* WhatsApp Logo */}
            <svg
              className="w-5 h-5 fill-current text-white shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.029-.475-1.708-.702-2.8-2.457-2.885-2.57-.085-.113-.687-.914-.687-1.745 0-.83.434-1.238.588-1.408.155-.17.339-.212.453-.212.113 0 .227.001.326.006.104.005.244-.04.382.292.144.344.492 1.201.536 1.288.044.088.073.19.014.305-.059.115-.089.186-.176.289-.088.102-.185.228-.264.307-.089.088-.182.185-.078.363.104.178.463.764.994 1.238.683.61 1.258.799 1.437.888.179.089.284.074.39-.045.106-.119.456-.531.577-.714.122-.182.244-.153.409-.092.164.061 1.042.491 1.221.58.179.089.298.133.342.207.045.074.045.431-.099.836z" />
            </svg>
            <span>Invite Via Whatsapp</span>
          </button>

          {/* Secondary Share Icon Button */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-12 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs active:scale-95"
            title="Share via other apps or Copy link"
            aria-label="Share"
          >
            <span className="material-symbols-outlined text-xl text-slate-700">
              share
            </span>
          </button>
        </div>
      </footer>

      {/* ── Add Friend Modal (Custom Friend Input) ─────────────────── */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-black text-base text-slate-900">
                Invite a Friend
              </h4>
              <button
                type="button"
                onClick={() => setShowAddContactModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomContact} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Friend's Name
                </label>
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#9f0038] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number (WhatsApp)
                </label>
                <input
                  type="tel"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#9f0038] focus:bg-white"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#9f0038] text-white font-bold text-xs rounded-xl hover:bg-[#840032] cursor-pointer"
                >
                  Save &amp; Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Help / Rules Modal (Triggered by '?' icon) ─────────────── */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-black text-base text-slate-900">
                How Invite &amp; Earn Works
              </h4>
              <button
                type="button"
                onClick={() => setShowFaqModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-[#9f0038] font-black flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <p>
                  <strong>Share your invite link</strong> with your friends and family on WhatsApp or other social apps.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-[#9f0038] font-black flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <p>
                  Your friend clicks the link, signs up, and places their <strong>1st order</strong> on MShoppy.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-[#9f0038] font-black flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <p>
                  Once their 1st order is successfully delivered, <strong>₹123 cash</strong> is automatically credited to your Wallet Balance!
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-amber-800 text-[11px] font-medium">
                💡 You can use your Wallet Balance to purchase any items or withdraw it straight to your bank account!
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFaqModal(false)}
              className="w-full py-2.5 bg-[#9f0038] text-white rounded-xl font-bold text-xs hover:bg-[#840032] transition-colors cursor-pointer"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
