import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ initialHours = 4, initialMinutes = 31, initialSeconds = 22, className = '' }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Total seconds
    return initialHours * 3600 + initialMinutes * 60 + initialSeconds;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className={`inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-black text-rose-600 bg-rose-50/90 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/60 px-2 py-0.5 rounded-md shadow-2xs ${className}`}>
      <span className="animate-pulse">⏳</span>
      <span>{hours}h : {minutes}m : {seconds}s</span>
    </div>
  );
}
