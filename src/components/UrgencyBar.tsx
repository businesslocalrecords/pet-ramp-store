import React, { useState, useEffect } from 'react';
import { Flame, Eye, Timer } from 'lucide-react';

/**
 * Urgency / scarcity bar shown at the top of the page.
 * Rotates social-proof messages (viewers, recent orders) and runs a countdown.
 */
export const UrgencyBar: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => {
    // Reset end of day for "today's offer ends in" countdown
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  });

  const messages = [
    { icon: Eye, text: '27 people are viewing this ramp right now', tone: 'viewers' },
    { icon: Flame, text: 'Only 41 units left at today’s launch price', tone: 'stock' },
    { icon: Timer, text: 'Free express shipping ends at midnight', tone: 'timer' },
    { icon: Flame, text: '18 orders placed in the last 24 hours', tone: 'orders' },
  ];

  // Rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const current = messages[messageIndex];
  const Icon = current.icon;

  return (
    <div className="relative bg-stone-900 text-stone-100 overflow-hidden">
      {/* Animated gold shimmer line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-x-6 gap-y-1 text-sm flex-wrap">
        {/* Rotating social proof */}
        <div className="flex items-center gap-2 transition-all duration-500" key={messageIndex}>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20">
            <Icon className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <span className="font-medium animate-fade-in" key={messageIndex}>
            {current.text}
          </span>
        </div>

        <span className="hidden sm:inline text-stone-700">|</span>

        {/* Countdown */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 hidden sm:inline">Offer ends in</span>
          <span className="font-mono font-bold text-amber-400 tabular-nums tracking-wider">
            {formatTime(timeLeft)}
          </span>
        </div>

        <span className="hidden md:inline text-stone-700">|</span>

        {/* Promo line */}
        <span className="hidden md:inline font-semibold">
          Use code <span className="text-amber-400 font-bold">RAMP20</span> for 20% off
        </span>
      </div>
    </div>
  );
};