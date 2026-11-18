import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppBottomNav from '../../components/AppBottomNav';
import {
  getDropshipperSettlementsApi,
  submitSettlementClaimApi,
  requestDropshipperWithdrawalApi,
  rechargeDropshipperWalletApi,
  uploadDropshipperAssetApi
} from '../../services/dropshipperService';
import { 
  RefreshCw, 
  Loader2, 
  CheckCircle2,
  Banknote,
  ShoppingCart,
  X,
  Copy,
  Printer,
  Building2,
  Sparkles,
  FileText,
  Check,
  Shield,
  UploadCloud,
  FileCheck,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function DropshipperSettlementTracking({ onNavigate, onBack }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Derive Dropshipper UID
  let userUid = currentUser?.uid || currentUser?.id || '';
  if (!userUid) {
    try {
      const sessionStr = localStorage.getItem('meesho_dropshipper_session');
      if (sessionStr) {
        const parsed = JSON.parse(sessionStr);
        userUid = parsed.dropshipperId || parsed.uid || '';
      }
    } catch (e) {
      console.warn("Could not parse session:", e);
    }
  }
  const effectiveUid = userUid;

  // Live State from PostgreSQL Database
  const [orders, setOrders] = useState([]);
  const [cashouts, setCashouts] = useState([]);
  const [selectedCashoutForReceipt, setSelectedCashoutForReceipt] = useState(null);
  const [serverMetrics, setServerMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(effectiveUid));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in_transit' | 'escrow' | 'settled' | 'rto' | 'disputed'
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL'); // 'ALL' | 'PREPAID' | 'COD'
  const [dateRange, setDateRange] = useState('30_days');

  // Modals state
  const [selectedOrderForTimeline, setSelectedOrderForTimeline] = useState(null);
  const [selectedOrderForSettlement, setSelectedOrderForSettlement] = useState(null);
  const [selectedOrderForClaim, setSelectedOrderForClaim] = useState(null);
  const [claimReason, setClaimReason] = useState('DAMAGED_RETURN');
  const [claimDescription, setClaimDescription] = useState('');
  const [claimProofFile, setClaimProofFile] = useState(null); // { url, name, size }
  const [isUploadingClaimProof, setIsUploadingClaimProof] = useState(false);
  const claimFileInputRef = useRef(null);
  const [toastMessage, setToastMessage] = useState('');

  // Instant Bank Cashout / Withdraw Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('action') === 'withdraw';
    }
    return false;
  });
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccessData, setWithdrawSuccessData] = useState(null);
  const [withdrawError, setWithdrawError] = useState('');

  // Top-Up / Recharge Security Reserve Modal State
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('5000');
  const [topupMethod, setTopupMethod] = useState('UPI');
  const [isToppingUp, setIsToppingUp] = useState(false);

  // Show toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Safe navigation handler
  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path.startsWith('/') ? path : `/${path}`);
    }
  };

  // Safe back handler
  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Instant Bank Cashout Executor
  const handleExecuteWithdraw = async (e) => {
    if (e) e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || isNaN(amount) || amount < 100) {
      setWithdrawError('Minimum withdrawal amount is ₹100');
      return;
    }
    const available = Number(serverMetrics?.settledMargin || 0);
    if (amount > available && available > 0) {
      setWithdrawError(`Requested amount exceeds available balance (₹${available.toLocaleString('en-IN')})`);
      return;
    }

    setWithdrawError('');
    setIsWithdrawing(true);
    try {
      const res = await requestDropshipperWithdrawalApi({
        firebaseUid: effectiveUid,
        amount
      });
      if (res?.success) {
        setWithdrawSuccessData(res);
        triggerToast(`₹${amount.toLocaleString('en-IN')} payout initiated successfully!`);
        setServerMetrics((prev) => prev ? {
          ...prev,
          settledMargin: Math.max(0, (prev.settledMargin || 0) - amount),
          walletBalance: res.newBalance,
          totalCashoutPaid: (prev.totalCashoutPaid || 0) + amount,
          cashoutsCount: (prev.cashoutsCount || 0) + 1
        } : prev);

        const newCashoutRecord = {
          id: `CSH-${(res.transaction?.id || Date.now().toString()).slice(0, 8).toUpperCase()}`,
          amount,
          type: 'debit',
          description: `Instant Bank Payout to ${res.bankAccount || 'Bank'}`,
          utrNumber: res.utrNumber || `UTR-CMS-${Date.now()}`,
          bankAccount: res.bankAccount || 'Verified Bank Account',
          beneficiary: res.beneficiary || 'Verified Partner',
          transferMode: 'IMPS 24x7',
          status: 'SUCCESS',
          date: new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        setCashouts((prev) => [newCashoutRecord, ...prev]);
      } else {
        setWithdrawError(res?.message || 'Failed to process bank cashout');
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      setWithdrawError(err?.response?.data?.message || 'Failed to process bank cashout request');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Top-Up / Recharge Security Reserve Handler
  const handleExecuteTopup = async (e) => {
    if (e) e.preventDefault();
    if (!effectiveUid) {
      triggerToast('User session not detected');
      return;
    }
    const amt = Number(topupAmount);
    if (!amt || isNaN(amt) || amt < 100) {
      triggerToast('Minimum recharge amount is ₹100');
      return;
    }

    try {
      setIsToppingUp(true);
      const res = await rechargeDropshipperWalletApi({
        firebaseUid: effectiveUid,
        amount: amt,
        paymentMethod: topupMethod
      });

      if (res?.success) {
        triggerToast(res.message || `₹${amt.toLocaleString('en-IN')} added to wallet successfully!`);
        setShowTopupModal(false);
        fetchSettlements(true);
      } else {
        triggerToast(res?.message || 'Failed to recharge wallet');
      }
    } catch (err) {
      console.error('Wallet recharge error:', err);
      triggerToast(err?.response?.data?.message || 'Failed to recharge wallet');
    } finally {
      setIsToppingUp(false);
    }
  };

  // Fetch real database settlements
  const fetchSettlements = async (silent = false) => {
    if (!effectiveUid) {
      setOrders([]);
      setCashouts([]);
      setServerMetrics(null);
      setIsLoading(false);
      return;
    }

    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await getDropshipperSettlementsApi(effectiveUid);
      if (res && res.success) {
        setOrders(res.orders || []);
        setServerMetrics(res.metrics || null);
        setCashouts(res.cashouts || []);
      }
    } catch (err) {
      console.error('Error fetching dropshipper settlements:', err);
      triggerToast(err.response?.data?.message || 'Failed to sync live settlements');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!effectiveUid) {
        if (isMounted) setOrders([]);
        return;
      }
      try {
        const res = await getDropshipperSettlementsApi(effectiveUid);
        if (isMounted && res?.success) {
          setOrders(res.orders || []);
          setServerMetrics(res.metrics || null);
        }
      } catch (err) {
        console.error('Error fetching dropshipper settlements:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [effectiveUid]);

  // Financial KPI Metrics (Live dynamic from DB orders with server metrics sync)
  const metrics = useMemo(() => {
    const effectiveWalletBalance = Number(serverMetrics?.walletBalance || 0);
    const SECURITY_RESERVE_TARGET = 5000;
    const reservedBalance = Math.min(effectiveWalletBalance, SECURITY_RESERVE_TARGET);
    const withdrawableBalance = Math.max(0, effectiveWalletBalance - SECURITY_RESERVE_TARGET);
    const reserveProgress = Math.min(100, Math.round((effectiveWalletBalance / SECURITY_RESERVE_TARGET) * 100));
    const isReserveFulfilled = effectiveWalletBalance >= SECURITY_RESERVE_TARGET;

    if (serverMetrics) {
      return {
        ...serverMetrics,
        walletBalance: effectiveWalletBalance,
        securityReserveTarget: SECURITY_RESERVE_TARGET,
        reservedBalance,
        withdrawableBalance,
        reserveProgress,
        isReserveFulfilled
      };
    }

    const totalGov = orders.reduce((sum, o) => sum + (Number(o.sellingPrice) || 0), 0);
    const settledMargin = orders
      .filter((o) => o.settlementStatus === 'Settled')
      .reduce((sum, o) => sum + (Number(o.netMargin) || 0), 0);
    const pendingEscrow = orders
      .filter((o) => o.settlementStatus === 'In Escrow')
      .reduce((sum, o) => sum + (Number(o.netMargin) || 0), 0);
    const reversedAmount = orders
      .filter((o) => o.settlementStatus === 'Reversed')
      .reduce((sum, o) => sum + Math.abs(Number(o.netMargin) || 0), 0);
    const rtoCount = orders.filter((o) => o.orderStatus === 'RTO' || o.orderStatus === 'Returned').length;
    const activeInTransit = orders.filter((o) => o.orderStatus === 'In-Transit').length;

    return {
      totalGov,
      settledMargin,
      pendingEscrow,
      reversedAmount,
      rtoCount,
      activeInTransit,
      totalOrdersCount: orders.length,
      walletBalance: effectiveWalletBalance,
      securityReserveTarget: SECURITY_RESERVE_TARGET,
      reservedBalance,
      withdrawableBalance,
      reserveProgress,
      isReserveFulfilled,
      totalCashoutPaid: 0,
      cashoutsCount: 0
    };
  }, [orders, serverMetrics]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab === 'in_transit' && order.orderStatus !== 'In-Transit') return false;
      if (activeTab === 'escrow' && order.settlementStatus !== 'In Escrow') return false;
      if (activeTab === 'settled' && order.settlementStatus !== 'Settled') return false;
      if (activeTab === 'rto' && order.orderStatus !== 'RTO' && order.orderStatus !== 'Returned') return false;
      if (activeTab === 'disputed' && !order.disputeStatus && order.settlementStatus !== 'Disputed') return false;

      // Payment filter
      if (paymentFilter === 'PREPAID' && !order.paymentMode?.toLowerCase().includes('prepaid')) return false;
      if (paymentFilter === 'COD' && order.paymentMode !== 'COD') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = (order.id || '').toLowerCase().includes(q);
        const matchesAwb = (order.awb || '').toLowerCase().includes(q);
        const matchesCustomer = (order.customerName || '').toLowerCase().includes(q);
        const matchesProduct = (order.productName || '').toLowerCase().includes(q);
        const matchesSku = (order.productSku || '').toLowerCase().includes(q);
        if (!matchesId && !matchesAwb && !matchesCustomer && !matchesProduct && !matchesSku) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, paymentFilter, searchQuery]);

  // Filtered Bank Cashouts
  const filteredCashouts = useMemo(() => {
    if (!searchQuery.trim()) return cashouts;
    const q = searchQuery.toLowerCase().trim();
    return cashouts.filter((c) =>
      (c.id || '').toLowerCase().includes(q) ||
      (c.utrNumber || '').toLowerCase().includes(q) ||
      (c.bankAccount || '').toLowerCase().includes(q) ||
      (c.beneficiary || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    );
  }, [cashouts, searchQuery]);

  // Handle dispute claim proof upload to Supabase Storage bucket
  const handleClaimProofUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      triggerToast('File size must be under 10MB');
      return;
    }

    setIsUploadingClaimProof(true);
    try {
      const res = await uploadDropshipperAssetApi({ file, folder: 'claims' });
      if (res && res.success && res.url) {
        setClaimProofFile({
          url: res.url,
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB'
        });
        triggerToast('Proof image uploaded to cloud CDN successfully!');
      } else {
        triggerToast('Failed to upload proof. Please try again.');
      }
    } catch (err) {
      console.error('Claim proof upload failed:', err);
      triggerToast(err.response?.data?.message || 'Proof upload failed');
    } finally {
      setIsUploadingClaimProof(false);
      if (claimFileInputRef.current) claimFileInputRef.current.value = '';
    }
  };

  // Handle dispute claim submission
  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderForClaim) return;

    setIsSubmittingClaim(true);
    try {
      const res = await submitSettlementClaimApi({
        firebaseUid: effectiveUid,
        orderId: selectedOrderForClaim.dbId || selectedOrderForClaim.id,
        claimReason,
        description: claimDescription,
        proofUrl: claimProofFile?.url || null
      });

      if (res && res.success) {
        const generatedClaimId = res.claimId || `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === selectedOrderForClaim.id
              ? {
                  ...ord,
                  disputeStatus: 'Claim Under Review',
                  claimId: generatedClaimId,
                  settlementStatus: 'Disputed',
                }
              : ord
          )
        );
        triggerToast(`Dispute Claim #${generatedClaimId} submitted successfully! Support team will verify within 24 hours.`);
      }
    } catch (err) {
      console.error('Failed to submit dispute claim:', err);
      triggerToast(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setIsSubmittingClaim(false);
      setSelectedOrderForClaim(null);
      setClaimDescription('');
      setClaimProofFile(null);
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      triggerToast(`${label} copied to clipboard!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] pb-28 text-gray-800 font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999] bg-gray-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-pink-500/40 text-xs sm:text-sm font-semibold flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-top-4">
          <span className="text-pink-400 text-base">✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top App Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 sm:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer"
            title="Go Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span>Settlement & Tracking</span>
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-[#b90041] border border-rose-200">
                  Dropshipper Portal
                </span>
              </h1>
            </div>
            <p className="text-[12px] text-gray-500 hidden sm:block">
              Real-time multi-stage order tracking, logistics updates, RTO reversals & net bank settlement ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => handleNavigation('/dropshipper-rot-manager')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-semibold text-purple-700 border border-purple-200 transition cursor-pointer"
            title="Manage ROT Liability & Return Plans"
          >
            <span>🛡️</span>
            <span>ROT Policy</span>
          </button>
          <button
            onClick={() => handleNavigation('/dropshipper-dashboard?tab=profile')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition cursor-pointer"
          >
            <span>🏦</span>
            <span>Bank Settings</span>
          </button>
          <button
            onClick={() => setShowTopupModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-800 border border-purple-200 transition cursor-pointer"
            title="Add Funds / Top-Up ₹5,000 Safety Reserve"
          >
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>Top-Up Reserve</span>
          </button>
          <button
            onClick={() => {
              setShowWithdrawModal(true);
              setWithdrawError('');
              setWithdrawSuccessData(null);
              setWithdrawAmount(String(metrics.withdrawableBalance || 0));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-200 transition cursor-pointer"
            title="Instant Bank Cashout"
          >
            <Banknote className="w-3.5 h-3.5 text-emerald-700" />
            <span>Withdraw (₹{metrics.withdrawableBalance?.toLocaleString('en-IN')})</span>
          </button>
          <button
            onClick={() => fetchSettlements(true)}
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition cursor-pointer disabled:opacity-60"
            title="Refresh Settlements from Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#b90041]' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => triggerToast('Generating full monthly settlement ledger PDF...')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#b90041] to-[#80145c] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-pink-900/20 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Statement</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-6">

        {/* 🛡️ ₹5,000 AUTO-ACCUMULATING RTO SECURITY CUSHION BANNER */}
        <section className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-4 sm:p-6 border border-purple-800/40 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl shrink-0">
                🛡️
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    RTO Security Cushion Reserve
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    metrics.isReserveFulfilled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {metrics.isReserveFulfilled ? '✓ ₹5,000 Cushion Active' : `${metrics.reserveProgress}% Accumulated`}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                  Your first ₹5,000 in net earnings automatically builds your safety cushion against customer doorstep cancellations & RTO courier freight. 100% of profits above ₹5,000 are instantly withdrawable.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowTopupModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>+ Top-Up Reserve</span>
              </button>
              <button
                onClick={() => {
                  setShowWithdrawModal(true);
                  setWithdrawError('');
                  setWithdrawSuccessData(null);
                  setWithdrawAmount(String(metrics.withdrawableBalance || 0));
                }}
                disabled={!metrics.withdrawableBalance || metrics.withdrawableBalance <= 0}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Banknote className="w-4 h-4" />
                <span>Withdraw (₹{metrics.withdrawableBalance?.toLocaleString('en-IN')})</span>
              </button>
            </div>
          </div>

          {/* Progress Bar & Balances Grid */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Total Wallet Balance:</span>
                <strong className="text-base font-black text-white">₹{metrics.walletBalance?.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Safety Cushion (Hold):</span>
                <strong className="text-base font-black text-purple-300">₹{metrics.reservedBalance?.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-400">/ ₹5,000</span></strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Available for Bank Cashout:</span>
                <strong className="text-base font-black text-emerald-400">₹{metrics.withdrawableBalance?.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.reserveProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>{metrics.reserveProgress}% of ₹5,000 threshold reached</span>
                <span>{metrics.isReserveFulfilled ? 'Withdrawable: 100% of excess' : `₹${Math.max(0, 5000 - metrics.reservedBalance).toLocaleString('en-IN')} remaining to unlock cashouts`}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Top Financial & Operations Metric Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Total Gross Sales */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Gross Order Value</span>
              <span className="w-7 h-7 rounded-lg bg-pink-50 text-[#b90041] flex items-center justify-center text-sm font-bold">🛒</span>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-black text-gray-900">₹{metrics.totalGov.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                <span>{metrics.totalOrdersCount} Total {metrics.totalOrdersCount === 1 ? 'Order' : 'Orders'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Settled Realized Profit */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-800">Settled Margin (Paid)</span>
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">💰</span>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-black text-emerald-700">₹{(metrics.settledMargin || 0).toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Credited to <span className="font-semibold text-gray-700">{orders[0]?.bankAccount || 'Verified Bank'}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Pending Escrow Clearance */}
          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider text-amber-800">In Escrow (Cooling)</span>
              <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">⏳</span>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-black text-amber-700">₹{(metrics.pendingEscrow || 0).toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-amber-600/90 font-medium mt-0.5">
                7-day return window active
              </div>
            </div>
          </div>

          {/* Card 4: RTO / Reversal Deductions */}
          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider text-rose-800">RTO / Returns Reversed</span>
              <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm font-bold">🔄</span>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-black text-rose-700">-₹{(metrics.reversedAmount || 0).toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                {metrics.rtoCount} RTO/Return adjustments
              </div>
            </div>
          </div>

          {/* Card 5: Next Scheduled Payout Cycle */}
          <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 rounded-2xl shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-300 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Next Auto Payout</span>
              <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs">⚡</span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-pink-400">Weekly Auto Batch</div>
              <div className="text-[11px] text-gray-400 mt-0.5 flex items-center justify-between">
                <span>Wallet: ₹{(metrics.walletBalance || 0).toLocaleString('en-IN')}</span>
                <span className="text-emerald-400 font-semibold">IMPS Active</span>
              </div>
              <button
                onClick={() => {
                  setShowWithdrawModal(true);
                  setWithdrawError('');
                  setWithdrawSuccessData(null);
                  setWithdrawAmount(String(metrics.settledMargin || 500));
                }}
                className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-[#b90041] hover:opacity-95 text-white text-[11px] font-black shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Withdraw Margin</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Interactive Search, Filters & Tab Navigation */}
        <section className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-4">
          {/* Top Row: Search + Quick Selects */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID (e.g. ORD-90214), AWB, Customer or SKU..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b90041] focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {/* Payment Mode */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#b90041] cursor-pointer"
              >
                <option value="ALL">All Payments</option>
                <option value="PREPAID">Prepaid (UPI/Card)</option>
                <option value="COD">Cash on Delivery (COD)</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#b90041] cursor-pointer"
              >
                <option value="7_days">Last 7 Days</option>
                <option value="30_days">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          {/* Tab Row */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 pt-3">
            {[
              { id: 'all', label: 'All Orders', count: orders.length, icon: '📑' },
              { id: 'in_transit', label: 'In-Transit', count: orders.filter((o) => o.orderStatus === 'In-Transit').length, icon: '🚚' },
              { id: 'escrow', label: 'In Escrow (Cooling)', count: orders.filter((o) => o.settlementStatus === 'In Escrow').length, icon: '⏳' },
              { id: 'settled', label: 'Settled & Paid', count: orders.filter((o) => o.settlementStatus === 'Settled').length, icon: '✅' },
              { id: 'cashouts', label: 'Bank Cashouts & Payouts', count: cashouts.length, icon: '💸' },
              { id: 'rto', label: 'RTO / Returned', count: orders.filter((o) => o.orderStatus === 'RTO' || o.orderStatus === 'Returned').length, icon: '🔄' },
              { id: 'disputed', label: 'Disputed Claims', count: orders.filter((o) => o.disputeStatus).length, icon: '⚖️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#b90041] text-white shadow-sm shadow-pink-900/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Orders & Settlements Ledger Table / Cards */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>
              {activeTab === 'cashouts' ? (
                <>Showing <strong className="text-gray-900">{filteredCashouts.length}</strong> bank cashout transactions</>
              ) : (
                <>Showing <strong className="text-gray-900">{filteredOrders.length}</strong> orders matching your criteria</>
              )}
            </span>
            <span className="hidden sm:inline">
              {activeTab === 'cashouts' ? 'Instant 24x7 IMPS Payouts into Registered Bank Account' : 'Click any order to view 5-Stage Live Journey & Settlement Math'}
            </span>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-xs flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-[#b90041]" />
              <h3 className="text-sm font-bold text-gray-900 mt-2">Connecting to Real Settlement Ledger...</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Fetching live courier status, 7-day escrow cooling countdowns, and bank payout records from database.
              </p>
            </div>
          ) : activeTab === 'cashouts' ? (
            <div className="space-y-4">
              {/* Bank Cashouts Summary Banner */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Instant Bank Payouts</span>
                    </span>
                    <span className="text-xs text-gray-300 font-mono">• 24x7 IMPS Active</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1.5">
                    ₹{(metrics?.totalCashoutPaid || cashouts.reduce((s, c) => s + c.amount, 0)).toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-emerald-300/80 ml-2">Total Transferred to Bank</span>
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Settled margins are disbursed via IMPS directly into your registered bank account.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowWithdrawModal(true);
                    setWithdrawError('');
                    setWithdrawSuccessData(null);
                    setWithdrawAmount(String(metrics?.settledMargin || 500));
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white text-xs font-black shadow-md flex items-center gap-2 transition cursor-pointer shrink-0"
                >
                  <Banknote className="w-4 h-4" />
                  <span>Request New Bank Cashout</span>
                </button>
              </div>

              {/* Cashout Transactions Table */}
              {filteredCashouts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-xs">
                  <div className="w-16 h-16 mx-auto bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mb-3 border border-emerald-100">
                    💸
                  </div>
                  <h3 className="text-base font-bold text-gray-900">No Bank Cashouts Yet</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto leading-relaxed">
                    When your delivered customer orders complete their cooling period, your margin will be available to transfer directly to your bank account via instant IMPS.
                  </p>
                  <button
                    onClick={() => {
                      setShowWithdrawModal(true);
                      setWithdrawError('');
                      setWithdrawSuccessData(null);
                      setWithdrawAmount(String(metrics?.settledMargin || 500));
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                  >
                    Withdraw Available Margin Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Desktop Table View */}
                  <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] font-bold">
                          <th className="py-3 px-4">Transaction / UTR</th>
                          <th className="py-3 px-4">Date & Time</th>
                          <th className="py-3 px-4">Beneficiary & Bank</th>
                          <th className="py-3 px-4">Mode</th>
                          <th className="py-3 px-4 text-right">Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredCashouts.map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50/80 transition">
                            <td className="py-3 px-4">
                              <div className="font-extrabold text-gray-900">{c.id}</div>
                              <div className="flex items-center gap-1 font-mono text-[10px] text-gray-500 mt-0.5">
                                <span>{c.utrNumber}</span>
                                <button
                                  onClick={() => copyToClipboard(c.utrNumber, 'UTR Number')}
                                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                  title="Copy UTR"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 font-medium whitespace-nowrap">
                              {c.date}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-gray-900 flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                <span>{c.bankAccount}</span>
                              </div>
                              <div className="text-[10px] text-gray-500">Beneficiary: {c.beneficiary}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                                {c.transferMode || 'IMPS'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-black text-sm text-emerald-700">
                              ₹{c.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>TRANSFERRED</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedCashoutForReceipt(c)}
                                className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 font-bold text-[11px] transition flex items-center gap-1 ml-auto cursor-pointer"
                                title="View Official Bank Advice / Receipt"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Receipt</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-2.5">
                    {filteredCashouts.map((c) => (
                      <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div>
                            <span className="font-extrabold text-xs text-gray-900">{c.id}</span>
                            <div className="text-[10px] text-gray-400">{c.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-emerald-700">₹{c.amount.toLocaleString('en-IN')}</div>
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              TRANSFERRED
                            </span>
                          </div>
                        </div>

                        <div className="text-xs space-y-1 text-gray-600">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-gray-400">Bank Account:</span>
                            <span className="font-bold text-gray-800">{c.bankAccount}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-gray-400">Beneficiary:</span>
                            <span className="font-medium text-gray-800">{c.beneficiary}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-gray-400">UTR Reference:</span>
                            <span className="font-mono text-gray-700 flex items-center gap-1">
                              <span>{c.utrNumber}</span>
                              <button
                                onClick={() => copyToClipboard(c.utrNumber, 'UTR Number')}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedCashoutForReceipt(c)}
                          className="w-full py-1.5 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-800 hover:text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Bank Transfer Receipt</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-xs">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-50 to-rose-50 text-[#b90041] rounded-3xl flex items-center justify-center text-4xl mb-4 border border-pink-100 shadow-inner">
                📦
              </div>
              <h3 className="text-base font-bold text-gray-900">No Dropshipping Orders Yet</h3>
              <p className="text-xs text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                Your dropshipper portal is ready. Once customer orders are placed via your synced Shopify store or manually pushed to verified suppliers, real-time tracking checkpoints (Delhivery, Shadowfax, BlueDart), 7-day return cooling countdown, and bank settlements will be logged here.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
                <button
                  onClick={() => handleNavigation('/dropshipper-order-hub')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b90041] to-[#80145c] text-white text-xs font-bold shadow-md hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Push Customer Order</span>
                </button>
                <button
                  onClick={() => handleNavigation('/dropshipper-margin-config')}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Configure Profit Margins</span>
                </button>
                <button
                  onClick={() => handleNavigation('/dropshipper-integrations')}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Connect Store Webhooks</span>
                </button>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-3">
                🔍
              </div>
              <h3 className="text-sm font-bold text-gray-800">No orders found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No tracking or settlement records match your search query or tab filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                  setPaymentFilter('ALL');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {filteredOrders.map((order) => {
                const isSettled = order.settlementStatus === 'Settled';
                const isInEscrow = order.settlementStatus === 'In Escrow';
                const isReversed = order.settlementStatus === 'Reversed';
                const isRTO = order.orderStatus === 'RTO' || order.orderStatus === 'Returned';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-200 hover:border-pink-300 shadow-xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between gap-4"
                  >
                    {/* Top Order Row: ID, Dates, Status Badges */}
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900">{order.id}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{order.orderDate}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <span>{order.courierLogo}</span>
                          <span>{order.awb}</span>
                        </span>
                      </div>

                      {/* Badges Pill Group */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Payment Mode Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            order.paymentMode.includes('Prepaid')
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {order.paymentMode}
                        </span>

                        {/* Logistics Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            order.logisticsStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isRTO
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span>{order.logisticsStatus === 'Delivered' ? '●' : '⚡'}</span>
                          <span>{order.logisticsStatus}</span>
                        </span>

                        {/* Settlement Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isSettled
                              ? 'bg-emerald-100 text-emerald-800'
                              : isInEscrow
                              ? 'bg-amber-100 text-amber-800'
                              : isReversed
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {order.settlementStatus === 'Settled' && '✓ Settled & Deposited'}
                          {order.settlementStatus === 'In Escrow' && `⏳ Escrow (${order.coolingDaysLeft}d left)`}
                          {order.settlementStatus === 'Reversed' && '✕ Margin Reversed'}
                          {order.settlementStatus === 'Disputed' && '⚖️ Under Dispute'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Product Details & Financial Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Product Thumbnail & Details (Col 1-6) */}
                      <div className="md:col-span-6 flex items-center gap-3">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80';
                          }}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {order.productName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-700">
                              {order.productSku}
                            </span>
                            <span>Qty: {order.qty}</span>
                            <span>•</span>
                            <span>Customer: <strong>{order.customerName}</strong> ({order.customerCity})</span>
                          </div>
                          {order.rtoReason && (
                            <div className="mt-1.5 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md inline-block border border-rose-100">
                              ⚠️ Reason: {order.rtoReason}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Financial Math Summary (Col 7-9) */}
                      <div className="md:col-span-3 bg-gray-50 rounded-xl p-2.5 text-xs space-y-1 border border-gray-100">
                        <div className="flex justify-between text-gray-500">
                          <span>Selling Price:</span>
                          <span className="font-semibold text-gray-900">₹{order.sellingPrice}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Base + Shipping:</span>
                          <span className="text-gray-700">-₹{order.supplierBasePrice + order.shippingFee}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xs pt-1 border-t border-gray-200">
                          <span>Net Margin:</span>
                          <span className={order.netMargin >= 0 ? 'text-emerald-700 font-extrabold' : 'text-rose-700 font-extrabold'}>
                            {order.netMargin >= 0 ? `+₹${order.netMargin}` : `-₹${Math.abs(order.netMargin)}`}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons (Col 10-12) */}
                      <div className="md:col-span-3 flex flex-row md:flex-col gap-2 justify-end">
                        <button
                          onClick={() => setSelectedOrderForTimeline(order)}
                          className="flex-1 md:flex-none px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>🔍</span>
                          <span>Track 5-Stage Journey</span>
                        </button>

                        <button
                          onClick={() => setSelectedOrderForSettlement(order)}
                          className="flex-1 md:flex-none px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#b90041] border border-pink-200 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>💰</span>
                          <span>Settlement Math</span>
                        </button>

                        {/* Raise Claim Button if RTO or Reversed */}
                        {isRTO && (
                          <button
                            onClick={() => setSelectedOrderForClaim(order)}
                            className="flex-1 md:flex-none px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>⚠️</span>
                            <span>{order.claimId ? `Dispute #${order.claimId}` : 'Raise Claim / Dispute'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Status Footer */}
                    <div className="bg-gray-50/70 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 border border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>
                          Settlement Cycle: <strong className="text-gray-800">{order.settlementDate}</strong>
                        </span>
                      </div>

                      {order.utrNumber && order.utrNumber.startsWith('UTR') && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200 font-semibold text-gray-700">
                            {order.utrNumber}
                          </span>
                          <button
                            onClick={() => copyToClipboard(order.utrNumber, 'UTR Number')}
                            className="text-pink-600 hover:text-pink-700 font-semibold cursor-pointer underline"
                          >
                            Copy UTR
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: 5-STAGE UNIFIED ORDER & LOGISTICS AUDIT TIMELINE */}
      {/* ========================================================================= */}
      {selectedOrderForTimeline && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedOrderForTimeline(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[82vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="shrink-0 bg-white px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>5-Stage Lifecycle Journey</span>
                  <span className="text-xs font-mono bg-pink-50 text-[#b90041] px-2 py-0.5 rounded-full border border-pink-200">
                    {selectedOrderForTimeline.id}
                  </span>
                </h3>
                <p className="text-xs text-gray-500">
                  AWB: {selectedOrderForTimeline.awb} ({selectedOrderForTimeline.courier})
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForTimeline(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Product mini card */}
              <div className="bg-gray-50 rounded-2xl p-3.5 flex items-center gap-3 border border-gray-100">
                <img
                  src={selectedOrderForTimeline.productImage}
                  alt={selectedOrderForTimeline.productName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {selectedOrderForTimeline.productName}
                  </h4>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Customer: <strong>{selectedOrderForTimeline.customerName}</strong> ({selectedOrderForTimeline.customerCity})
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                    Selling Price: ₹{selectedOrderForTimeline.sellingPrice} | Net Margin: ₹{selectedOrderForTimeline.netMargin}
                  </div>
                </div>
              </div>

              {/* Step Timeline */}
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-200">
                {selectedOrderForTimeline.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Circle icon */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                        step.completed
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-white'
                          : 'bg-gray-200 text-gray-600 ring-4 ring-white'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>

                    {/* Step details */}
                    <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-xs font-bold text-gray-900">{step.step}</span>
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bank Deposit Verification Card */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                  <span className="font-semibold uppercase tracking-wider">Settlement Snapshot</span>
                  <span className="text-emerald-400 font-bold">{selectedOrderForTimeline.settlementStatus}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Beneficiary Account</span>
                    <strong className="text-gray-100">{selectedOrderForTimeline.bankAccount}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Bank UTR Reference</span>
                    <strong className="text-pink-400 font-mono">{selectedOrderForTimeline.utrNumber}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Footer */}
            <div className="shrink-0 p-3.5 sm:p-4 bg-gray-50/95 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrderForTimeline(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FINANCIAL SETTLEMENT & NET MARGIN MATH BREAKDOWN */}
      {/* ========================================================================= */}
      {selectedOrderForSettlement && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedOrderForSettlement(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 max-w-lg w-full max-h-[82vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="shrink-0 bg-white px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>Settlement & Invoice Breakdown</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Detailed cost-margin ledger for Order #{selectedOrderForSettlement.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForSettlement(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <img
                  src={selectedOrderForSettlement.productImage}
                  alt={selectedOrderForSettlement.productName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {selectedOrderForSettlement.productName}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    SKU: {selectedOrderForSettlement.productSku} | Mode: {selectedOrderForSettlement.paymentMode}
                  </div>
                </div>
              </div>

              {/* Detailed Math Breakdown Table */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-700">
                  <span>Customer Final Selling Price</span>
                  <span className="font-bold text-gray-900">+₹{selectedOrderForSettlement.sellingPrice}.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Supplier Base Product Cost</span>
                  <span className="text-rose-600">-₹{selectedOrderForSettlement.supplierBasePrice}.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Logistics & Courier Delivery Fee</span>
                  <span className="text-rose-600">-₹{selectedOrderForSettlement.shippingFee}.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>TCS / GST / Platform TDS (1%)</span>
                  <span className="text-rose-600">-₹{selectedOrderForSettlement.tdsDeduction}.00</span>
                </div>

                {selectedOrderForSettlement.orderStatus === 'RTO' && (
                  <div className="flex justify-between text-rose-700 bg-rose-50 p-2 rounded-lg font-semibold">
                    <span>RTO Reverse Freight Adjustment</span>
                    <span>-₹{selectedOrderForSettlement.shippingFee}.00</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-extrabold text-sm text-gray-900">Net Realized Margin</span>
                  <span
                    className={`font-black text-base ${
                      selectedOrderForSettlement.netMargin >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {selectedOrderForSettlement.netMargin >= 0
                      ? `+₹${selectedOrderForSettlement.netMargin}.00`
                      : `-₹${Math.abs(selectedOrderForSettlement.netMargin)}.00`}
                  </span>
                </div>
              </div>

              {/* Banking & UTR Details */}
              <div className="bg-gray-50 rounded-2xl p-4 text-xs space-y-2 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Settlement Status:</span>
                  <strong className="text-gray-900">{selectedOrderForSettlement.settlementStatus}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payout Date:</span>
                  <strong className="text-gray-900">{selectedOrderForSettlement.settlementDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Account:</span>
                  <strong className="text-gray-900">{selectedOrderForSettlement.bankAccount}</strong>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                  <span className="text-gray-500">UTR / Ref Number:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-gray-800">{selectedOrderForSettlement.utrNumber}</span>
                    <button
                      onClick={() => copyToClipboard(selectedOrderForSettlement.utrNumber, 'UTR Number')}
                      className="text-[#b90041] font-bold cursor-pointer hover:underline text-[11px]"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Footer */}
            <div className="shrink-0 px-5 sm:px-6 py-3 sm:py-3.5 bg-gray-50/95 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => triggerToast('Settlement invoice receipt downloaded as PDF!')}
                className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>📥</span>
                <span>Download Invoice (PDF)</span>
              </button>
              <button
                onClick={() => setSelectedOrderForSettlement(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RTO / RETURN DISPUTE CLAIM DRAWER */}
      {/* ========================================================================= */}
      {selectedOrderForClaim && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => { setSelectedOrderForClaim(null); setClaimProofFile(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 max-w-lg w-full max-h-[82vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="shrink-0 bg-white px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>Raise RTO / Return Dispute Claim</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Claim compensation for incorrect or damaged returns on Order #{selectedOrderForClaim.id}
                </p>
              </div>
              <button
                onClick={() => { setSelectedOrderForClaim(null); setClaimProofFile(null); }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleDisputeSubmit} className="flex flex-col flex-1 overflow-hidden text-xs">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Select Claim Reason</label>
                  <select
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b90041]"
                  >
                    <option value="DAMAGED_RETURN">Damaged Item received during reverse courier</option>
                    <option value="WRONG_ITEM">Wrong / Fake item sent back by customer</option>
                    <option value="FRAUDULENT_RTO">Fraudulent RTO (Courier marked delivered attempt without calling)</option>
                    <option value="EXCESS_SHIPPING_DEDUCTION">Incorrect reverse shipping fee deducted</option>
                    <option value="IN_TRANSIT_DELAY">Parcel stuck in transit / Delayed delivery claim</option>
                    <option value="WEIGHT_DISCREPANCY">Courier weight / freight excess charge discrepancy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Issue Description & Evidence Note</label>
                  <textarea
                    required
                    rows="3"
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                    placeholder="Explain why this RTO or Return deduction should be reimbursed..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#b90041]"
                  />
                </div>

                {/* Real Supabase Cloud Upload Proof */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1 flex items-center justify-between">
                    <span>Upload Unboxing / Parcel Photo Proof</span>
                    <span className="text-[10px] font-semibold text-gray-500">JPG, PNG, PDF up to 10MB</span>
                  </label>

                  <input
                    type="file"
                    ref={claimFileInputRef}
                    onChange={handleClaimProofUpload}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />

                  {isUploadingClaimProof ? (
                    <div className="border-2 border-dashed border-[#b90041]/40 rounded-2xl p-5 text-center bg-pink-50/50 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-[#b90041] animate-spin" />
                      <span className="font-bold text-xs text-[#b90041]">Uploading proof to Supabase Storage CDN...</span>
                      <span className="text-[10px] text-gray-400">Please wait while the asset is safely stored in cloud bucket</span>
                    </div>
                  ) : claimProofFile ? (
                    <div className="border border-emerald-300 bg-emerald-50/70 rounded-2xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {claimProofFile.url.match(/\.(jpg|jpeg|png|webp)/i) ? (
                          <img
                            src={claimProofFile.url}
                            alt="Proof Preview"
                            className="w-12 h-12 rounded-xl object-cover border border-emerald-200 shrink-0 shadow-xs"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                            <FileCheck className="w-6 h-6 text-emerald-700" />
                          </div>
                        )}
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-bold text-emerald-900 truncate">
                            {claimProofFile.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Supabase CDN Linked
                            </span>
                            <span className="text-[10px] text-gray-500">{claimProofFile.size}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={claimProofFile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                          title="View on CDN"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setClaimProofFile(null)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => claimFileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 hover:border-[#b90041] rounded-2xl p-4 text-center bg-gray-50 hover:bg-pink-50/30 transition cursor-pointer group"
                    >
                      <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#b90041] mx-auto mb-1 transition" />
                      <span className="font-bold text-gray-700 group-hover:text-[#b90041] block text-xs transition">
                        Click to upload unboxing photo / courier parcel proof
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Direct auto-upload to Supabase CDN bucket (dropshipper-assets/claims)
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800">
                  ⚠️ <strong>Note:</strong> MShoppy Admin team verifies logistics CCTV and AWB call logs. Approved claims are refunded to your Reseller Wallet within 48 hours.
                </div>
              </div>

              {/* Pinned Submit Buttons */}
              <div className="shrink-0 px-5 sm:px-6 py-3 sm:py-3.5 bg-gray-50/95 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setSelectedOrderForClaim(null); setClaimProofFile(null); }}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingClaim || isUploadingClaimProof}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b90041] to-[#80145c] text-white font-bold shadow-md hover:opacity-95 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSubmittingClaim && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmittingClaim ? 'Submitting Dispute...' : 'Submit Dispute Ticket'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: INSTANT BANK MARGIN CASHOUT / WITHDRAWAL */}
      {/* ======================================================== */}
      {showWithdrawModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 max-w-lg w-full max-h-[82vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-pink-50 to-white px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span>Instant Bank Margin Cashout</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Real-time automated payout via IMPS / NEFT to your verified account
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            {/* Content Body */}
            {withdrawSuccessData ? (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-emerald-900">Withdrawal Initiated Successfully!</h4>
                  <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                    {withdrawSuccessData.message}
                  </p>

                  <div className="p-3.5 bg-white rounded-2xl text-left border border-emerald-100 text-xs space-y-2 shadow-2xs">
                    <div className="flex justify-between text-gray-500">
                      <span>UTR Reference:</span>
                      <span className="font-mono font-bold text-gray-800">{withdrawSuccessData.utrNumber}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Transferred Amount:</span>
                      <span className="font-extrabold text-emerald-700">₹{withdrawSuccessData.amount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Beneficiary Account:</span>
                      <span className="font-semibold text-gray-800">{withdrawSuccessData.bankAccount}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Account Holder:</span>
                      <span className="text-gray-800">{withdrawSuccessData.beneficiary || 'Verified User'}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 pt-1 border-t border-gray-100">
                      <span>Remaining Balance:</span>
                      <span className="font-bold text-gray-900">₹{withdrawSuccessData.newBalance?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 px-5 sm:px-6 py-3 bg-gray-50/95 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecuteWithdraw} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                  {/* Balance & Safety Cushion Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Settled</span>
                      <span className="text-base font-black text-slate-900">₹{(metrics.walletBalance || 0).toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">In wallet ledger</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                      <span className="text-[10px] font-bold text-purple-700 uppercase block">RTO Safety Cushion</span>
                      <span className="text-base font-black text-purple-900">₹{(metrics.reservedBalance || 0).toLocaleString('en-IN')} <span className="text-[10px] text-gray-500 font-normal">/ ₹5,000</span></span>
                      <span className="text-[10px] text-purple-600 block mt-0.5">Mandatory hold</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">Max Cashout Today</span>
                      <span className="text-base font-black text-emerald-700">₹{(metrics.withdrawableBalance || 0).toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">Withdrawable via IMPS</span>
                    </div>
                  </div>

                  {/* Informative Security Cushion State */}
                  {(!metrics.withdrawableBalance || metrics.withdrawableBalance <= 0) ? (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-purple-950 font-bold block">
                            ₹5,000 Safety Cushion in Progress ({metrics.reserveProgress}% Complete)
                          </strong>
                          <p className="text-purple-900/80 mt-0.5 leading-relaxed">
                            Your active orders are building your ₹5,000 safety reserve (₹{Math.max(0, 5000 - (metrics.reservedBalance || 0)).toLocaleString('en-IN')} remaining). All earnings above ₹5,000 will be instantly withdrawable. You can also top-up now to unlock immediate payouts.
                          </p>
                        </div>
                      </div>
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowWithdrawModal(false);
                            setShowTopupModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>+ Top-Up Safety Cushion</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        ₹5,000 Safety Cushion cleared! You can withdraw up to <strong>₹{metrics.withdrawableBalance.toLocaleString('en-IN')}</strong> to your bank.
                      </span>
                    </div>
                  )}

                  {/* Verified Bank Account Details */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-700">Destination Bank Account</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Verified KYC
                      </span>
                    </div>
                    <p className="text-xs text-gray-800 font-semibold">
                      {orders[0]?.bankAccount || 'HDFC Bank ****4419'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Instant direct credit via NPCI IMPS rails. Zero processing charges.
                    </p>
                  </div>

                  {/* Cashout Amount Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Enter Cashout Amount (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="100"
                        max={metrics.withdrawableBalance || 0}
                        step="10"
                        required
                        disabled={!metrics.withdrawableBalance || metrics.withdrawableBalance <= 0}
                        value={withdrawAmount}
                        onChange={(e) => {
                          setWithdrawAmount(e.target.value);
                          setWithdrawError('');
                        }}
                        placeholder="e.g. 1500"
                        className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:opacity-60"
                      />
                    </div>

                    {/* Quick Amount Pills */}
                    {metrics.withdrawableBalance > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 overflow-x-auto text-xs">
                        {[500, 1000, 2500].filter(a => a <= metrics.withdrawableBalance).map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setWithdrawAmount(String(amt))}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 font-semibold transition cursor-pointer text-[11px]"
                          >
                            ₹{amt.toLocaleString('en-IN')}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setWithdrawAmount(String(metrics.withdrawableBalance))}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold hover:bg-emerald-200 transition cursor-pointer text-[11px]"
                        >
                          Max Withdrawable (₹{metrics.withdrawableBalance.toLocaleString('en-IN')})
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Fee Matrix & SLA */}
                  <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 border border-gray-100">
                    <div className="flex justify-between text-gray-500">
                      <span>Payout Gateway Fee:</span>
                      <span className="font-bold text-emerald-700">₹0 (Free Transfer)</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>TDS / Tax Deduction:</span>
                      <span className="text-gray-700">1% (Settled at order level)</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Transfer SLA:</span>
                      <span className="text-gray-700">Instant (Within 15 minutes)</span>
                    </div>
                  </div>

                  {withdrawError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                      ⚠️ {withdrawError}
                    </div>
                  )}
                </div>

                {/* Pinned Submit Action */}
                <div className="shrink-0 px-5 sm:px-6 py-3 sm:py-3.5 bg-gray-50/95 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isWithdrawing || !metrics.withdrawableBalance || metrics.withdrawableBalance <= 0 || Number(withdrawAmount) > metrics.withdrawableBalance}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {isWithdrawing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing Payout...</span>
                      </>
                    ) : (
                      <>
                        <Banknote className="w-4 h-4" />
                        <span>Confirm Instant Cashout</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: TOP-UP / RECHARGE SECURITY RESERVE MODAL */}
      {/* ======================================================== */}
      {showTopupModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowTopupModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full max-h-[82vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-purple-50 via-pink-50 to-white px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs text-xl">
                  🛡️
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Top-Up RTO Security Cushion
                  </h3>
                  <p className="text-xs text-gray-500">
                    Add funds to unlock instant payouts & back high-volume dispatches
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTopupModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleExecuteTopup} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Current Reserve Status */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-1.5">
                <div className="flex justify-between text-purple-900">
                  <span>Current Accumulated Reserve:</span>
                  <strong>₹{(metrics.reservedBalance || 0).toLocaleString('en-IN')} / ₹5,000</strong>
                </div>
                <div className="flex justify-between text-purple-700">
                  <span>Recommended Top-Up to 100%:</span>
                  <span className="font-bold text-purple-950">₹{Math.max(0, 5000 - (metrics.reservedBalance || 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Enter Recharge Amount (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    placeholder="5000"
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Preset Buttons */}
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  {[1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(String(amt))}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-purple-50 hover:text-purple-800 text-gray-700 font-semibold transition cursor-pointer text-[11px]"
                    >
                      +₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                  {5000 - (metrics.reservedBalance || 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setTopupAmount(String(Math.max(100, 5000 - (metrics.reservedBalance || 0))))}
                      className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 font-bold hover:bg-purple-200 transition cursor-pointer text-[11px]"
                    >
                      Fill Reserve (₹{Math.max(0, 5000 - (metrics.reservedBalance || 0)).toLocaleString('en-IN')})
                    </button>
                  )}
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Select Payment Rails
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: '⚡' },
                    { id: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
                    { id: 'CARD', label: 'Debit / Card', icon: '💳' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTopupMethod(mode.id)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        topupMethod === mode.id
                          ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base block">{mode.icon}</span>
                      <span className="text-[11px] block mt-0.5">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Guarantee Note */}
              <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 text-gray-500 border border-gray-100">
                <div className="flex items-center gap-1 text-gray-700 font-semibold">
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>100% Refundable Security Deposit</span>
                </div>
                <p className="text-[10px] leading-relaxed">
                  Your deposited reserve remains in your account. You can request closure and full bank refund anytime if you pause dropshipping operations.
                </p>
              </div>
              </div>

              {/* Pinned Submit Button */}
              <div className="shrink-0 px-5 sm:px-6 py-3 sm:py-3.5 bg-gray-50/95 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTopupModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isToppingUp || !topupAmount || Number(topupAmount) < 100}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 disabled:opacity-50 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isToppingUp ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Top-Up...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Recharge ₹{Number(topupAmount || 0).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: BANK CASHOUT & PAYOUT ADVICE RECEIPT SLIP */}
      {/* ======================================================== */}
      {selectedCashoutForReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[82vh] sm:max-h-[88vh]">
            {/* Receipt Header */}
            <div className="shrink-0 p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white">
                  🏦
                </div>
                <div>
                  <h3 className="text-sm font-black">Official Bank Payout Receipt</h3>
                  <p className="text-[10px] text-emerald-100">Direct IMPS Disbursement Advice</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCashoutForReceipt(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Receipt Body */}
            <div id="cashout-receipt-printable" className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              {/* Status Hero */}
              <div className="text-center p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  <Check className="w-5 h-5 text-emerald-700 stroke-[3]" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Funds Transferred Successfully</div>
                <div className="text-2xl font-black text-gray-900">
                  ₹{Number(selectedCashoutForReceipt.amount || 0).toLocaleString('en-IN')}.00
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  Processed via Instant 24x7 IMPS
                </div>
              </div>

              {/* Key Transaction Facts */}
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl p-3 bg-gray-50/50 space-y-2 text-[11px]">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-gray-500">Receipt ID:</span>
                  <span className="font-mono font-bold text-gray-900">{selectedCashoutForReceipt.id}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500">Bank UTR / Ref No:</span>
                  <span className="font-mono font-bold text-gray-900 flex items-center gap-1">
                    <span>{selectedCashoutForReceipt.utrNumber}</span>
                    <button
                      onClick={() => copyToClipboard(selectedCashoutForReceipt.utrNumber, 'UTR')}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500">Beneficiary Name:</span>
                  <span className="font-bold text-gray-900">{selectedCashoutForReceipt.beneficiary}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500">Credited Bank Account:</span>
                  <span className="font-bold text-gray-900">{selectedCashoutForReceipt.bankAccount}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500">Disbursed From:</span>
                  <span className="font-semibold text-gray-700">Meesho Merchant Escrow Node</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-500">Execution Date & Time:</span>
                  <span className="font-medium text-gray-800">{selectedCashoutForReceipt.date}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-relaxed">
                🔒 This advice serves as official confirmation that dropshipper net margins were debited from the merchant escrow wallet and credited directly to the beneficiary account via NPCI IMPS.
              </div>
            </div>

            {/* Pinned Receipt Footer */}
            <div className="shrink-0 p-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50/50">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCashoutForReceipt(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Navigation */}
      <AppBottomNav activeNav="earnings" onNavigate={handleNavigation} />
    </div>
  );
}
