import React, { useState, useEffect } from 'react';
import AppBottomNav from '../../components/AppBottomNav';
import { fetchTaskDetails, startDeliveryRun, verifyDeliveryOtp } from '../../services/driverService';

export default function OrderDetailsDriver({ onNavigate = () => {}, onBack }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDelivered, setIsDelivered] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 0: Assigned, 1: Picked up, 2: Out for Delivery, 3: Delivered
  const [otpCode, setOtpCode] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const loadTask = async () => {
    const savedTaskId = localStorage.getItem('mshoppy_selected_task_id') || localStorage.getItem('mshoppy_active_task_id');
    setLoading(true);
    try {
      if (savedTaskId) {
        const data = await fetchTaskDetails(savedTaskId);
        setTask(data);
        if (data.status === 'delivered') {
          setIsDelivered(true);
          setCurrentStep(3);
        } else if (data.status === 'in_transit') {
          setCurrentStep(2);
        } else if (data.status === 'assigned') {
          setCurrentStep(1);
        }
      }
    } catch (err) {
      console.warn('Could not load task details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, []);

  const handleStartRun = async () => {
    if (!task?.taskId) return;
    setIsActionLoading(true);
    try {
      await startDeliveryRun(task.taskId);
      setCurrentStep(2);
      triggerToast('Package picked up! Delivery OTP dispatched to customer. 🚀');
      localStorage.setItem('mshoppy_active_task_id', task.taskId);
      setTimeout(() => {
        onNavigate('active_delivery');
      }, 600);
    } catch (err) {
      triggerToast(err.message || 'Failed to start run');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCompleteDelivery = async () => {
    if (!task?.taskId) return;
    if (!otpCode || otpCode.trim().length !== 4) {
      triggerToast('Please enter valid 4-digit customer OTP');
      return;
    }

    setIsActionLoading(true);
    try {
      await verifyDeliveryOtp(task.taskId, otpCode.trim());
      setIsDelivered(true);
      setCurrentStep(3);
      triggerToast('Delivery Completed! ₹55.00 credited to driver wallet 🎉');
      setTimeout(() => {
        onNavigate('driver_earnings');
      }, 1200);
    } catch (err) {
      triggerToast(err.message || 'OTP verification failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const timelineSteps = [
    { title: 'Task Assigned', time: 'Dispatched to Fleet' },
    { title: 'Picked up from Warehouse', time: task?.pickupAddress || 'Central Hub' },
    { title: 'Out for Delivery', time: 'Heading to Customer Address' },
    { title: 'Delivered', time: isDelivered ? 'Handover Confirmed' : 'Awaiting Customer OTP' },
  ];

  const customerName = task?.customer?.name || 'Customer';
  const rawCustomerDigits = (task?.customer?.phone || '').toString().replace(/\D/g, '').slice(-10);
  const customerPhone = rawCustomerDigits ? `+91 ${rawCustomerDigits}` : '+91 98765 43210';
  const dialCustomerPhone = rawCustomerDigits ? `+91${rawCustomerDigits}` : '+919876543210';
  const deliveryAddress = task?.customer?.address || 'Street Address, City';
  const items = task?.items || [];
  const payout = task?.payout || 55;
  const isCod = task?.payment?.method === 'COD';
  const totalAmount = task?.payment?.totalAmount || 0;

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] min-h-screen w-full max-w-full overflow-x-hidden font-sans antialiased selection:bg-pink-100 selection:text-pink-600 pb-32">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between px-3 sm:px-6 lg:px-8 h-14 sm:h-16 max-w-7xl mx-auto w-full gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('available_tasks'))}
              className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 active:scale-95 text-[#b90041] cursor-pointer transition-colors shrink-0"
              title="Back"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">arrow_back</span>
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0 flex-wrap sm:flex-nowrap">
                <h1 className="font-extrabold text-sm sm:text-lg text-[#1c1b1b] leading-tight whitespace-nowrap">
                  Order Details
                </h1>
                <span className="text-[10px] sm:text-xs font-bold text-[#b90041] bg-pink-50 px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                  #{task?.orderId ? task.orderId.slice(-8).toUpperCase() : 'PARCEL'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate block">
                {task?.customer?.city || 'City Delivery'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => onNavigate('active_delivery')}
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#b90041] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0 whitespace-nowrap"
              title="Live GPS Map"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">explore</span>
              <span>GPS Map</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Order Summary, Customer Details, Items (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Status & Estimated Earnings Banner */}
            <section className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              <div className="sm:col-span-7 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Current Status
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#b90041] mt-0.5">
                    {isDelivered
                      ? 'Delivered Successfully'
                      : currentStep === 2
                      ? 'Out for Delivery (In Transit)'
                      : 'Assigned to You'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Order ID: {task?.orderId || 'Loading...'}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="bg-emerald-50 text-[#008644] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">speed</span>
                    <span>{isCod ? 'Cash on Delivery' : 'Prepaid'}</span>
                  </div>
                  <div
                    onClick={() => onNavigate('active_delivery')}
                    className="bg-pink-50 text-[#b90041] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-pink-100"
                  >
                    <span className="material-symbols-outlined text-sm">route</span>
                    <span>View Live Map ➔</span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('driver_earnings')}
                className="sm:col-span-5 bg-gradient-to-br from-[#b90041] to-[#df2457] text-white rounded-3xl p-5 shadow-lg shadow-pink-500/20 flex flex-col justify-between items-start sm:items-end sm:text-right cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <div>
                  <p className="text-xs uppercase font-bold text-pink-100 tracking-wider">
                    Trip Payout ➔
                  </p>
                  <h3 className="text-3xl sm:text-4xl font-black leading-none mt-1">₹{payout}.00</h3>
                </div>
                <div className="mt-3 text-[11px] font-medium text-pink-100 bg-white/20 px-3 py-1 rounded-full">
                  Instant Wallet Credit on Delivery
                </div>
              </div>
            </section>

            {/* Customer Details Card */}
            <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#b90041] flex items-center justify-center font-black text-xl">
                    {customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#1c1b1b]">{customerName}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        <span>Verified Customer</span>
                      </span>
                      <span className="text-slate-400 font-medium">
                        • {task?.customer?.totalOrdersPlaced > 1 ? `${task.customer.totalOrdersPlaced} Orders Placed` : '1st Order'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Call & WhatsApp Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/91${rawCustomerDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-3.5 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-1.5 font-bold text-xs transition-all shadow-sm cursor-pointer"
                    title="Chat on WhatsApp (+91)"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:+91${rawCustomerDigits}`}
                    className="h-11 px-3.5 rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200 flex items-center justify-center gap-1.5 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
                    title="Direct Phone Call"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-[#fafbfc] border border-slate-100 p-3.5 rounded-2xl flex items-start gap-3">
                <span className="material-symbols-outlined text-[#b90041] text-xl mt-0.5">location_on</span>
                <div className="flex-1 text-xs">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Delivery Destination</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{deliveryAddress}</p>
                </div>
              </div>

              {/* Items in Package */}
              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Items in Parcel ({items.length || 1})
                </p>
                {items.length === 0 ? (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500">
                    Package loaded from warehouse manifest.
                  </div>
                ) : (
                  items.map((it, idx) => (
                    <div key={idx} className="bg-[#fcf9f8] p-3 rounded-2xl flex items-center gap-3 border border-slate-100">
                      <img
                        src={it.image}
                        alt={it.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="flex-1 text-xs">
                        <p className="font-extrabold text-[#1c1b1b] line-clamp-1">{it.title}</p>
                        <p className="text-slate-400 mt-0.5">
                          Qty: {it.quantity} • Size: {it.size} • ₹{it.price}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* COD Amount Notification */}
              {isCod && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-700">payments</span>
                    <span className="font-bold text-amber-900">Cash on Delivery (COD)</span>
                  </div>
                  <span className="font-black text-amber-900 text-base">Collect ₹{totalAmount}</span>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Timeline & Handover Verification (5 cols) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            {/* Timeline Section */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Delivery Trip Timeline
              </h3>
              <div className="space-y-4 relative pl-2">
                {timelineSteps.map((step, idx) => {
                  const isPassed = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div key={idx} className="flex gap-3 relative">
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 ${
                          isCurrent
                            ? 'bg-[#b90041] ring-4 ring-pink-500/20 animate-pulse'
                            : isPassed
                            ? 'bg-[#008644]'
                            : 'bg-slate-200'
                        }`}
                      />
                      <div>
                        <p className={`text-xs font-bold ${isCurrent ? 'text-[#b90041]' : isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </p>
                        <p className="text-[11px] text-slate-400">{step.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Handover OTP Box */}
            {currentStep >= 2 && !isDelivered && (
              <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Customer Handover OTP
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Required
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Enter 4-Digit Customer OTP"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-black p-3 bg-[#f8f9fb] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <p className="text-[11px] text-slate-400 text-center">
                  Ask customer for delivery verification OTP received on SMS/Email.
                </p>
              </section>
            )}

            {/* Action Buttons */}
            {currentStep === 1 && (
              <button
                onClick={handleStartRun}
                disabled={isActionLoading}
                className="w-full h-14 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 shadow-xl bg-gradient-to-r from-[#b90041] to-[#df2457] text-white shadow-pink-500/30 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">two_wheeler</span>
                <span>{isActionLoading ? 'Starting Run...' : 'START DELIVERY RUN ➔'}</span>
              </button>
            )}

            {currentStep >= 2 && (
              <button
                onClick={handleCompleteDelivery}
                disabled={isDelivered || isActionLoading}
                className={`w-full h-14 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  isDelivered
                    ? 'bg-green-600 text-white shadow-green-600/30 cursor-default'
                    : 'bg-gradient-to-r from-[#008644] to-[#047857] text-white shadow-emerald-500/30 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {isDelivered ? 'verified' : 'task_alt'}
                </span>
                <span>
                  {isDelivered ? 'DELIVERY COMPLETED (CREDITED)' : isActionLoading ? 'Verifying...' : 'VERIFY OTP & COMPLETE DELIVERY'}
                </span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />
    </div>
  );
}
