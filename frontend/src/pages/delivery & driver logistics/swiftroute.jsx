import React, { useState } from 'react';

export default function SwiftRoute({ onNavigate = () => {}, onBack }) {
  const [stops, setStops] = useState([
    {
      id: 1,
      name: 'Hub Pickup: Indiranagar Fulfilment',
      type: 'pickup',
      address: 'Plot 14, 100ft Road, Indiranagar',
      packages: 6,
      eta: '09:30 AM',
      isCompleted: true,
      time: 'Completed at 09:28 AM',
    },
    {
      id: 2,
      name: 'Customer Drop: Priya Sharma',
      type: 'drop',
      address: 'Flat 402, Lotus Apt, Sector 15, HSR Layout',
      packages: 2,
      eta: '10:05 AM',
      isCompleted: false,
      contact: '+91 98765 43210',
      cod: false,
    },
    {
      id: 3,
      name: 'Customer Drop: Rahul Varma',
      type: 'drop',
      address: 'Villa 12, Palm Meadows, Whitefield',
      packages: 1,
      eta: '10:35 AM',
      isCompleted: false,
      contact: '+91 91234 56789',
      cod: true,
      codAmount: 850,
    },
    {
      id: 4,
      name: 'Customer Drop: Sneha Kapoor',
      type: 'drop',
      address: 'B-304, Prestige Tech Vista, Kadubeesanahalli',
      packages: 3,
      eta: '11:15 AM',
      isCompleted: false,
      contact: '+91 99887 66554',
      cod: false,
    },
  ]);

  const [batterySaveMode, setBatterySaveMode] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleToggleStop = (id) => {
    setStops((prev) =>
      prev.map((stop) => {
        if (stop.id === id) {
          const next = !stop.isCompleted;
          triggerToast(next ? `Stop #${id} marked as Completed! ✓` : `Stop #${id} marked pending`);
          return { ...stop, isCompleted: next };
        }
        return stop;
      })
    );
  };

  const handleOptimizeRoute = () => {
    triggerToast('AI Route Optimizer re-sequenced stops to save 18 mins & 3.2 km! ⚡');
  };

  const completedCount = stops.filter((s) => s.isCompleted).length;

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] min-h-screen font-sans antialiased pb-32 selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('driver_dashboard'))}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#b90041] text-white flex items-center justify-center shadow-md shadow-pink-500/20">
              <span className="material-symbols-outlined text-2xl">route</span>
            </div>
            <div>
              <h1 className="font-black text-lg text-[#1c1b1b] tracking-tight">SwiftRoute AI</h1>
              <p className="text-[11px] text-slate-500 font-bold">Kinetic Multi-Stop Navigator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBatterySaveMode(!batterySaveMode);
                triggerToast(batterySaveMode ? 'High Contrast GPS mode active' : 'Battery Saver GPS mode enabled 🔋');
              }}
              className={`p-2 rounded-2xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                batterySaveMode ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-lg">battery_saver</span>
            </button>
            <button
              onClick={handleOptimizeRoute}
              className="bg-gradient-to-r from-[#b90041] to-[#df2457] text-white px-3.5 py-2 rounded-2xl text-xs font-black shadow-md active:scale-95 transition-transform cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">auto_fix_high</span>
              <span>Optimize</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-5 space-y-5">
        {/* Progress Metric Banner */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Route Progress
              </span>
              <h2 className="text-xl font-black text-[#1c1b1b]">
                {completedCount} of {stops.length} Stops Completed
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-[#008644] bg-green-50 px-2.5 py-1 rounded-full">
                {Math.round((completedCount / stops.length) * 100)}% Done
              </span>
            </div>
          </div>

          {/* Mini Linear Progress */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#b90041] to-[#df2457] transition-all duration-300"
              style={{ width: `${(completedCount / stops.length) * 100}%` }}
            />
          </div>
        </section>

        {/* Multi-Stop Sequence List */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-extrabold text-[#1c1b1b] uppercase tracking-wider">
              Sequence List ({stops.length})
            </h3>
            <span className="text-xs font-bold text-slate-400">Live Geo-Sequenced</span>
          </div>

          <div className="space-y-3">
            {stops.map((stop, idx) => (
              <div
                key={stop.id}
                className={`bg-white rounded-3xl p-5 border transition-all ${
                  stop.isCompleted
                    ? 'border-emerald-100 bg-emerald-50/20 opacity-80'
                    : 'border-slate-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        stop.isCompleted
                          ? 'bg-emerald-500 text-white'
                          : stop.type === 'pickup'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-pink-100 text-[#b90041]'
                      }`}
                    >
                      {stop.isCompleted ? (
                        <span className="material-symbols-outlined text-lg">check</span>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-[#1c1b1b]">{stop.name}</h4>
                        {stop.cod && (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            COD ₹{stop.codAmount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{stop.address}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-slate-400">
                        <span>📦 {stop.packages} Pkgs</span>
                        <span>•</span>
                        <span className="text-[#b90041]">{stop.eta}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStop(stop.id)}
                    className={`p-2 rounded-2xl text-xs font-bold flex items-center transition-all cursor-pointer ${
                      stop.isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {stop.isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </button>
                </div>

                {!stop.isCompleted && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('active_delivery')}
                      className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm text-emerald-400">
                        near_me
                      </span>
                      <span>Navigate Map</span>
                    </button>
                    {stop.contact && (
                      <button
                        onClick={() => triggerToast(`Dialing ${stop.contact}... 📞`)}
                        className="px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-[#b90041] font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">call</span>
                        <span>Call</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Complete Route Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 p-4 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Duration</span>
            <p className="font-black text-lg text-[#1c1b1b]">1h 45m (8.4 km)</p>
          </div>
          <button
            onClick={() => onNavigate('active_delivery')}
            className="flex-1 max-w-xs h-13 bg-gradient-to-r from-[#b90041] to-[#df2457] text-white rounded-2xl font-black text-sm shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <span>Navigate Active Map</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
