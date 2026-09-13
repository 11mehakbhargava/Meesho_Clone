import React, { useState } from 'react';

export default function MeeshoVelocity() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isHyperSpeedActive, setIsHyperSpeedActive] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const dispatchQueue = [
    {
      id: 'VEL-9901',
      zone: 'Koramangala Sector 4',
      status: 'Express Dispatch',
      timeRemaining: '14 mins',
      rider: 'Vikram S. (Rider #882)',
      speed: '34 km/h',
    },
    {
      id: 'VEL-9902',
      zone: 'Indiranagar 100ft Rd',
      status: 'Picking Up',
      timeRemaining: '22 mins',
      rider: 'Ramesh K. (Rider #619)',
      speed: '28 km/h',
    },
    {
      id: 'VEL-9903',
      zone: 'HSR Layout Sector 1',
      status: 'Out for Delivery',
      timeRemaining: '08 mins',
      rider: 'Anil P. (Rider #404)',
      speed: '41 km/h',
    },
  ];

  return (
    <div className="bg-[#f9f9fb] text-[#191c1e] min-h-screen font-sans antialiased pb-32 selection:bg-indigo-100 selection:text-indigo-800">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2f06be] to-[#4834d4] text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <span className="material-symbols-outlined text-2xl">bolt</span>
            </div>
            <div>
              <h1 className="font-black text-lg text-[#191c1e] tracking-tight">
                Meesho Velocity
              </h1>
              <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider">
                Ultra-Speed Logistics Grid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsHyperSpeedActive(!isHyperSpeedActive);
                triggerToast(isHyperSpeedActive ? 'Switched to Standard Grid' : 'HyperSpeed Dispatch Grid Active! ⚡');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                isHyperSpeedActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>HYPERSPEED</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Metric Cards Bento */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-[#2f06be] to-[#4834d4] text-white p-5 rounded-3xl shadow-lg shadow-indigo-500/20 col-span-2 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-indigo-200 tracking-wider">
                Average Delivery Time
              </p>
              <h2 className="text-4xl md:text-5xl font-black mt-1">28 Mins</h2>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-300 font-bold bg-white/10 px-3 py-1 rounded-full w-max backdrop-blur-sm">
              <span className="material-symbols-outlined text-sm">speed</span>
              <span>Top 2% Ultra-Fast Fleet</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="material-symbols-outlined text-emerald-600 text-2xl">verified</span>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">On-Time Rate</p>
              <h3 className="text-2xl font-black text-[#191c1e]">98.4%</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="material-symbols-outlined text-indigo-600 text-2xl">two_wheeler</span>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Active Couriers</p>
              <h3 className="text-2xl font-black text-[#191c1e]">342</h3>
            </div>
          </div>
        </section>

        {/* Live Velocity Dispatch Queue */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <div>
              <h3 className="text-base font-extrabold text-[#191c1e]">Active Velocity Dispatch</h3>
              <p className="text-xs text-slate-400">Live real-time delivery telemetry</p>
            </div>
            <button
              onClick={() => triggerToast('Refreshing real-time courier telemetry...')}
              className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              <span>Live Sync</span>
            </button>
          </div>

          <div className="space-y-3">
            {dispatchQueue.map((item) => (
              <div
                key={item.id}
                onClick={() => triggerToast(`Tracking telemetry for ${item.id} (${item.rider})`)}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">bolt</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#191c1e]">{item.id}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{item.zone}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-black text-indigo-600">{item.timeRemaining}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ETA</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <span className="font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-slate-400">person</span>
                    {item.rider}
                  </span>
                  <span className="font-black text-emerald-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">speed</span>
                    Speed: {item.speed}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Heatmap Preview */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#191c1e]">
              Urban Demand & Speed Coverage
            </h3>
            <span className="text-xs font-bold text-emerald-600">High Efficiency Zone</span>
          </div>

          <div className="relative h-48 rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&auto=format&fit=crop&q=80"
              alt="Demand Heatmap"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-indigo-900/30 backdrop-blur-[1px]" />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-indigo-900 shadow-lg">
              🚀 34 Express Nodes Active in Bengaluru Metro
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
