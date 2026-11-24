import React, { useState, useEffect } from 'react';
import AppBottomNav from '../../components/AppBottomNav';
import { fetchTaskDetails, verifyDeliveryOtp } from '../../services/driverService';

export default function ActiveDeliveryMobile({ onNavigate = () => {}, onBack }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDelivered, setIsDelivered] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [driverOtp, setDriverOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const loadTask = async () => {
    const savedTaskId = localStorage.getItem('mshoppy_active_task_id') || localStorage.getItem('mshoppy_selected_task_id');
    setLoading(true);
    try {
      if (savedTaskId) {
        const data = await fetchTaskDetails(savedTaskId);
        setTask(data);
      }
    } catch (err) {
      console.warn('Could not load active delivery task:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, []);

  const handleOpenDeliveryModal = () => {
    if (isDelivered) return;
    setDriverOtp('');
    setOtpError('');
    setShowOtpModal(true);
  };

  const handleVerifyOtpAndDeliver = async () => {
    if (!driverOtp || driverOtp.trim().length !== 4) {
      setOtpError('Please enter the 4-digit OTP provided by the customer.');
      return;
    }

    const taskId = task?.taskId || localStorage.getItem('mshoppy_active_task_id');
    if (!taskId) {
      setOtpError('No active task ID found.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');
    try {
      await verifyDeliveryOtp(taskId, driverOtp.trim());
      setShowOtpModal(false);
      setIsDelivered(true);
      triggerToast('OTP Verified! Delivery Confirmed & ₹55.00 credited to wallet 🎉');
      localStorage.removeItem('mshoppy_active_task_id');
      setTimeout(() => {
        onNavigate('driver_earnings');
      }, 1200);
    } catch (err) {
      setOtpError(err.message || 'Invalid OTP! Please check with customer.');
    } finally {
      setIsVerifying(false);
    }
  };

  const customerName = task?.customer?.name || 'Customer Priya';
  const rawCustomerDigits = (task?.customer?.phone || '').toString().replace(/\D/g, '').slice(-10);
  const customerPhone = rawCustomerDigits ? `+91 ${rawCustomerDigits}` : '+91 98765 43210';
  const dialCustomerPhone = rawCustomerDigits ? `+91${rawCustomerDigits}` : '+919876543210';
  const customerAddress = task?.customer?.address || 'Flat 402, Royal Palms, Koramangala, Bangalore';
  const isCod = task?.payment?.method === 'COD';
  const totalAmount = task?.payment?.totalAmount || 0;
  const orderNumber = task?.orderId ? task.orderId.slice(-8).toUpperCase() : 'MSH-99281';

  return (
    <div className="bg-[#fcf9f8] font-sans text-[#1c1b1b] min-h-screen flex flex-col relative antialiased selection:bg-pink-100 selection:text-pink-600 pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('driver_dashboard'))}
              className="p-2 hover:bg-slate-100 rounded-full text-[#b90041] cursor-pointer transition-colors"
              title="Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div
              onClick={() => onNavigate('driver_dashboard')}
              className="cursor-pointer"
            >
              <h1 className="font-extrabold tracking-tight text-base sm:text-lg text-[#b90041] leading-none">
                Live Active Navigation GPS
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Order #{orderNumber} • Destination
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('order_driver')}
              className="px-3.5 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#b90041] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              <span>Order Details</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Live GPS Route Canvas */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative h-[420px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-[#e8ecef]">
              {/* Dynamic Live OpenStreetMap Canvas */}
              <iframe
                title="Live GPS Route Navigation"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(customerAddress?.toLowerCase().includes('indore') ? 75.83 : 77.56)},${(customerAddress?.toLowerCase().includes('indore') ? 22.69 : 12.94)},${(customerAddress?.toLowerCase().includes('indore') ? 75.92 : 77.65)},${(customerAddress?.toLowerCase().includes('indore') ? 22.76 : 13.01)}&layer=mapnik&marker=${(customerAddress?.toLowerCase().includes('indore') ? '22.7196,75.8577' : '12.9716,77.5946')}`}
                className="w-full h-full border-0 pointer-events-none filter contrast-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

              {/* Turn-by-Turn Instruction Banner */}
              <div className="absolute top-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
                    <span className="material-symbols-outlined text-2xl">turn_left</span>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      Turn-by-Turn Route
                    </p>
                    <p className="font-extrabold text-sm sm:text-base line-clamp-1">
                      {customerAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Route Pins */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[32%] left-[26%] flex flex-col items-center">
                  <div className="bg-[#b90041] text-white p-2.5 rounded-full shadow-2xl border-2 border-white">
                    <span className="material-symbols-outlined text-lg">inventory_2</span>
                  </div>
                  <div className="bg-white/95 px-2.5 py-0.5 mt-1 rounded-md shadow-md border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-[#b90041]">Pickup Hub</span>
                  </div>
                </div>

                <div className="absolute bottom-[28%] right-[24%] flex flex-col items-center">
                  <div className="bg-[#008644] text-white p-3 rounded-full shadow-2xl border-4 border-white animate-bounce">
                    <span className="material-symbols-outlined text-xl">location_on</span>
                  </div>
                  <div className="bg-white/95 px-2.5 py-0.5 mt-1 rounded-md shadow-md border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-[#008644]">Customer Drop</span>
                  </div>
                </div>
              </div>

              {/* Status Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    ETA to Destination
                  </span>
                  <span className="text-xl font-black text-[#1c1b1b]">
                    {isDelivered ? 'Arrived & Delivered' : '12 Mins • 2.4 km'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/91${rawCustomerDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-700"
                    title="WhatsApp Customer (+91)"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:+91${rawCustomerDigits}`}
                    className="px-3.5 py-2 bg-emerald-50 text-[#008644] rounded-xl font-bold text-xs flex items-center gap-1.5 border border-emerald-200"
                    title="Direct Call"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info & OTP Action */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#b90041] flex items-center justify-center font-black text-xl">
                  {customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#1c1b1b]">{customerName}</h3>
                  <p className="text-xs text-slate-500">{customerPhone}</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <p className="font-bold text-slate-400 text-[10px] uppercase">Drop Address</p>
                <p className="font-bold text-slate-800 mt-0.5">{customerAddress}</p>
              </div>

              {isCod && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs flex justify-between items-center">
                  <span className="font-bold text-amber-900">COD Cash to Collect:</span>
                  <span className="font-black text-amber-900 text-base">₹{totalAmount}</span>
                </div>
              )}

              <button
                onClick={handleOpenDeliveryModal}
                disabled={isDelivered}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  isDelivered
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-gradient-to-r from-[#b90041] to-[#df2457] text-white shadow-pink-500/25 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {isDelivered ? 'verified' : 'check_circle'}
                </span>
                <span>{isDelivered ? 'DELIVERED (CREDITED)' : 'ARRIVED AT CUSTOMER (ENTER OTP)'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* OTP Delivery Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="text-center">
              <div className="w-14 h-14 bg-pink-50 text-[#b90041] rounded-2xl mx-auto flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-3xl">key</span>
              </div>
              <h3 className="font-black text-lg text-slate-900">Verify Customer OTP</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ask customer {customerName} for the 4-digit code sent via SMS/Email.
              </p>
              {task?.expectedOtp && (
                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-950">
                  <span className="font-semibold">Customer OTP: <strong className="font-mono text-sm font-black text-[#b90041]">{task.expectedOtp}</strong></span>
                  <button
                    type="button"
                    onClick={() => setDriverOtp(task.expectedOtp)}
                    className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded-lg font-bold text-[11px] cursor-pointer transition-colors shadow-xs"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="• • • •"
                maxLength={4}
                value={driverOtp}
                onChange={(e) => setDriverOtp(e.target.value)}
                className="w-full text-center text-3xl font-black tracking-widest py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#b90041]"
              />
              {otpError && (
                <p className="text-xs font-bold text-rose-600 mt-2 text-center">{otpError}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtpAndDeliver}
                disabled={isVerifying}
                className="flex-1 py-3 rounded-xl bg-[#b90041] text-white font-black text-xs shadow-md active:scale-95 cursor-pointer"
              >
                {isVerifying ? 'Verifying...' : 'Confirm Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Bottom Navigation */}
      <AppBottomNav activeNav="tasks" onNavigate={onNavigate} />
    </div>
  );
}
