import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  ArrowRight,
  Radio,
  X,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Users
} from 'lucide-react';
import { useFriendsStore } from '../../store/useFriendsStore';
import { useAppStore } from '../../store/useAppStore';
import { AppView } from '../../types';

interface OverviewRightSidebarProps {
  onNavigate: (view: AppView) => void;
}

// Neumorphism style tokens for other elements
const neumorphicCard = {
  dark: 'bg-[#121624] border border-white/[0.04] shadow-[-6px_-6px_16px_rgba(255,255,255,0.03),6px_6px_18px_rgba(0,0,0,0.65)]',
  light: 'bg-[#eef2f7] border border-white/60 shadow-[-8px_-8px_16px_rgba(255,255,255,0.9),8px_8px_16px_rgba(166,180,200,0.55)]',
};

const neumorphicButton = {
  dark: 'bg-[#121624] shadow-[-3px_-3px_8px_rgba(255,255,255,0.04),3px_3px_8px_rgba(0,0,0,0.6)] hover:shadow-[-1px_-1px_4px_rgba(255,255,255,0.04),1px_1px_4px_rgba(0,0,0,0.6)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.04)]',
  light: 'bg-[#eef2f7] shadow-[-4px_-4px_8px_rgba(255,255,255,0.9),4px_4px_8px_rgba(166,180,200,0.5)] hover:shadow-[-2px_-2px_4px_rgba(255,255,255,0.9),2px_2px_4px_rgba(166,180,200,0.5)] active:shadow-[inset_2px_2px_5px_rgba(166,180,200,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]',
};

const neumorphicInset = {
  dark: 'bg-[#0f121d] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.7),inset_-3px_-3px_6px_rgba(255,255,255,0.03)] border border-white/[0.02]',
  light: 'bg-[#eef2f7] shadow-[inset_3px_3px_6px_rgba(166,180,200,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] border border-white/40',
};

interface CalendarDay {
  day: number;
  isOtherMonth: boolean;
  isToday: boolean;
}

function buildCalendarGrid(year: number, month: number, today: Date): CalendarDay[] {
  // Monday start: 0=Mon, 1=Tue, ..., 6=Sun
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const grid: CalendarDay[] = [];

  // Previous month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    grid.push({ day: daysInPrevMonth - i, isOtherMonth: true, isToday: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push({
      day: d,
      isOtherMonth: false,
      isToday: year === todayYear && month === todayMonth && d === todayDate,
    });
  }

  // Next month fill (fill to 35 or 42 cells)
  const totalCells = grid.length > 35 ? 42 : 35;
  const remaining = totalCells - grid.length;
  for (let d = 1; d <= remaining; d++) {
    grid.push({ day: d, isOtherMonth: true, isToday: false });
  }

  return grid;
}

export const OverviewRightSidebar: React.FC<OverviewRightSidebarProps> = ({ onNavigate }) => {
  const { isDarkMode, profile } = useAppStore();
  const { friends, setActiveChatFriendId } = useFriendsStore();

  // Use the real current date from the user's system
  const realToday = useMemo(() => new Date(), []);

  // Calendar navigation state — start on the current month
  const [viewYear, setViewYear] = useState(realToday.getFullYear());
  const [viewMonth, setViewMonth] = useState(realToday.getMonth());

  const [isCalendarHidden, setIsCalendarHidden] = useState(false);
  const [isOnlineHidden, setIsOnlineHidden] = useState(false);
  const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false);

  const fullMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Dynamically compute the calendar grid
  const calendarDays = useMemo(
    () => buildCalendarGrid(viewYear, viewMonth, realToday),
    [viewYear, viewMonth, realToday]
  );

  // Format today for the full calendar modal
  const todayFormatted = `${fullMonthNames[realToday.getMonth()]} ${realToday.getDate()}, ${realToday.getFullYear()}`;

  // Neumorphic card class helper for other cards
  const neuCard = isDarkMode ? neumorphicCard.dark : neumorphicCard.light;
  const neuBtn = isDarkMode ? neumorphicButton.dark : neumorphicButton.light;
  const neuInset = isDarkMode ? neumorphicInset.dark : neumorphicInset.light;

  // Online friends filter
  const onlineFriends = friends.filter((f) => f.isOnline);

  return (
    <aside className="w-72 xl:w-80 space-y-5 shrink-0 hidden lg:block select-none">
      {/* ========================================================
          CARD 1: Calendar — Neumorphism
         ======================================================== */}
      {!isCalendarHidden ? (
        <div
          className={`p-6 rounded-[28px] space-y-5 transition-all duration-300 ${
            isDarkMode
              ? 'bg-[#1a1e2d] border border-white/[0.03] shadow-[-6px_-6px_18px_rgba(255,255,255,0.035),6px_6px_20px_rgba(0,0,0,0.7)]'
              : 'bg-[#eef2f7] border border-white/60 shadow-[-8px_-8px_18px_rgba(255,255,255,0.9),8px_8px_18px_rgba(166,180,200,0.55)]'
          }`}
        >
          {/* Header: Month & Year + Neumorphic Arrow Buttons */}
          <div className="flex items-center justify-between">
            <span
              className={`font-display font-extrabold text-base tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {fullMonthNames[viewMonth]} {viewYear}
            </span>

            {/* Neumorphic Rounded Arrow Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                  isDarkMode
                    ? 'bg-[#1a1e2d] text-[#2dd4bf] hover:text-[#5eead4] shadow-[-2px_-2px_6px_rgba(255,255,255,0.04),2px_2px_6px_rgba(0,0,0,0.65)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7),inset_-2px_-2px_4px_rgba(255,255,255,0.04)]'
                    : 'bg-[#eef2f7] text-[#fb7185] hover:text-[#f43f5e] shadow-[-3px_-3px_6px_rgba(255,255,255,0.9),3px_3px_6px_rgba(166,180,200,0.5)] active:shadow-[inset_2px_2px_4px_rgba(166,180,200,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]'
                }`}
              >
                <ArrowLeft size={14} strokeWidth={2.5} />
              </button>
              <button
                onClick={handleNextMonth}
                aria-label="Next Month"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                  isDarkMode
                    ? 'bg-[#1a1e2d] text-[#2dd4bf] hover:text-[#5eead4] shadow-[-2px_-2px_6px_rgba(255,255,255,0.04),2px_2px_6px_rgba(0,0,0,0.65)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7),inset_-2px_-2px_4px_rgba(255,255,255,0.04)]'
                    : 'bg-[#eef2f7] text-[#fb7185] hover:text-[#f43f5e] shadow-[-3px_-3px_6px_rgba(255,255,255,0.9),3px_3px_6px_rgba(166,180,200,0.5)] active:shadow-[inset_2px_2px_4px_rgba(166,180,200,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]'
                }`}
              >
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Days of the Week: Mo Tu We Th Fr Sa Su */}
          <div
            className={`grid grid-cols-7 text-center text-[11px] font-semibold tracking-wide ${
              isDarkMode ? 'text-slate-400/80' : 'text-slate-400'
            }`}
          >
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
            <span>Su</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold">
            {calendarDays.map((item, index) => {
              if (item.isToday) {
                return (
                  <div key={index} className="flex items-center justify-center">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-transform hover:scale-105 ${
                        isDarkMode
                          ? 'bg-[#06b6d4] text-[#101422] shadow-[-2px_-2px_6px_rgba(255,255,255,0.25),2px_2px_8px_rgba(0,0,0,0.6)] shadow-[0_0_14px_rgba(6,182,212,0.45)]'
                          : 'bg-[#fb7185] text-white shadow-[-2px_-2px_6px_rgba(255,255,255,0.7),2px_2px_8px_rgba(200,80,100,0.4)] shadow-[0_4px_12px_rgba(251,113,133,0.4)]'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center h-7 rounded-full transition-all ${
                    item.isOtherMonth
                      ? isDarkMode
                        ? 'text-slate-600/50 font-normal'
                        : 'text-slate-300 font-normal'
                      : isDarkMode
                        ? 'text-slate-200 hover:text-white font-medium cursor-pointer hover:bg-[#1a1e2d] hover:shadow-[-2px_-2px_5px_rgba(255,255,255,0.04),2px_2px_5px_rgba(0,0,0,0.5)]'
                        : 'text-slate-800 hover:text-slate-950 font-medium cursor-pointer hover:bg-[#eef2f7] hover:shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(166,180,200,0.4)]'
                  }`}
                >
                  <span>{item.day}</span>
                </div>
              );
            })}
          </div>

          {/* Footer: Full calendar & Hide */}
          <div
            className={`pt-3 border-t flex items-center justify-between text-[11px] font-semibold ${
              isDarkMode
                ? 'border-black/30 shadow-[0_-1px_0_rgba(255,255,255,0.03)]'
                : 'border-white/60 shadow-[0_-1px_0_rgba(166,180,200,0.2)]'
            }`}
          >
            <button
              onClick={() => setIsFullCalendarOpen(true)}
              className={`transition-colors cursor-pointer ${
                isDarkMode ? 'text-[#2dd4bf] hover:text-[#5eead4]' : 'text-[#fb7185] hover:text-[#f43f5e]'
              }`}
            >
              full calendar
            </button>
            <button
              onClick={() => setIsCalendarHidden(true)}
              className={`transition-colors cursor-pointer ${
                isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              hide
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCalendarHidden(false)}
          className={`w-full py-3 px-5 rounded-[22px] text-xs font-bold flex items-center justify-between transition-all ${
            isDarkMode
              ? 'bg-[#1a1e2d] text-slate-300 hover:text-white border border-white/[0.03] shadow-[-4px_-4px_12px_rgba(255,255,255,0.03),4px_4px_12px_rgba(0,0,0,0.6)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]'
              : 'bg-[#eef2f7] text-slate-700 hover:text-slate-900 border border-white/60 shadow-[-5px_-5px_12px_rgba(255,255,255,0.8),5px_5px_12px_rgba(166,180,200,0.5)] active:shadow-[inset_2px_2px_4px_rgba(166,180,200,0.5)]'
          }`}
        >
          <span
            className={`flex items-center gap-2 font-extrabold ${
              isDarkMode ? 'text-[#2dd4bf]' : 'text-[#fb7185]'
            }`}
          >
            <CalendarIcon size={15} /> Show Calendar
          </span>
          <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#2dd4bf]' : 'text-[#fb7185]'}`}>
            show
          </span>
        </button>
      )}

      {/* ========================================================
          CARD 2: Online Friends — Neumorphism
         ======================================================== */}
      {!isOnlineHidden ? (
        <div className={`p-5 rounded-3xl space-y-4 transition-all duration-300 ${neuCard}`}>
          {/* Header with Red Bullseye / Online Indicator */}
          <div className="flex items-center gap-2 text-[#e11d48] font-black text-sm">
            <div className={`p-1.5 rounded-xl ${neuBtn}`}>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#e11d48] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
              </div>
            </div>
            <span className="text-xs font-black tracking-wide">Online</span>
          </div>

          {/* Online Friends List */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-1 pb-2">
            {/* Friend 1: Adrian Justin Salinas */}
            <div
              onClick={() => {
                const target = friends.find(f => f.name.toLowerCase().includes('adrian')) || friends[2];
                if (target) setActiveChatFriendId(target.id);
              }}
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              title="Adrian Justin Salinas (Online)"
            >
              <div className="relative p-1 rounded-full bg-[#121624] shadow-[-3px_-3px_8px_rgba(255,255,255,0.04),3px_3px_8px_rgba(0,0,0,0.6)] group-hover:shadow-[-1px_-1px_4px_rgba(255,255,255,0.04),1px_1px_4px_rgba(0,0,0,0.6)] transition-all">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="ADRIAN J"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-white font-black text-xs">AJ</span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121624]" />
              </div>
              <span className={`text-[10px] font-black group-hover:text-sky-400 uppercase tracking-tight max-w-[70px] truncate text-center ${
                isDarkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                ADRIAN J...
              </span>
            </div>

            {/* Friend 2: Deghne Gabriel Agana / Tim Gabriel */}
            <div
              onClick={() => {
                const target = friends.find(f => f.name.toLowerCase().includes('deghne') || f.name.toLowerCase().includes('gabriel')) || friends[4];
                if (target) setActiveChatFriendId(target.id);
              }}
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              title="Deghne Gabriel Agana (Online)"
            >
              <div className="relative p-1 rounded-full bg-[#121624] shadow-[-3px_-3px_8px_rgba(255,255,255,0.04),3px_3px_8px_rgba(0,0,0,0.6)] group-hover:shadow-[-1px_-1px_4px_rgba(255,255,255,0.04),1px_1px_4px_rgba(0,0,0,0.6)] transition-all">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#2dd4bf] flex items-center justify-center p-0.5">
                  <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
                    <circle cx="50" cy="50" r="48" fill="#2DD4BF" />
                    <path d="M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z" fill="#0284C7" />
                    <rect x="44" y="52" width="12" height="18" fill="#8D5B4C" />
                    <ellipse cx="50" cy="46" rx="16" ry="18" fill="#8D5B4C" />
                    <path d="M 30 40 C 30 20 40 18 50 18 C 60 18 70 20 70 40 C 70 65 66 76 66 76 C 60 55 58 40 50 40 C 42 40 40 55 34 76 C 34 76 30 65 30 40 Z" fill="#111827" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121624]" />
              </div>
              <span className={`text-[10px] font-black group-hover:text-sky-400 uppercase tracking-tight max-w-[70px] truncate text-center ${
                isDarkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                TIM GABRI...
              </span>
            </div>

            {/* Friend 3: Paulo Miguel Tolosa */}
            <div
              onClick={() => {
                const target = friends[0];
                if (target) setActiveChatFriendId(target.id);
              }}
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              title="Paulo Miguel Tolosa (Online)"
            >
              <div className="relative p-1 rounded-full bg-[#121624] shadow-[-3px_-3px_8px_rgba(255,255,255,0.04),3px_3px_8px_rgba(0,0,0,0.6)] group-hover:shadow-[-1px_-1px_4px_rgba(255,255,255,0.04),1px_1px_4px_rgba(0,0,0,0.6)] transition-all">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-xs">
                  PT
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121624]" />
              </div>
              <span className={`text-[10px] font-black group-hover:text-sky-400 uppercase tracking-tight max-w-[70px] truncate text-center ${
                isDarkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                PAULO M...
              </span>
            </div>
          </div>

          {/* Bottom Link: [hide] */}
          <div className={`pt-3 border-t flex items-center justify-end text-xs font-semibold ${
            isDarkMode ? 'border-white/[0.04]' : 'border-black/[0.05]'
          }`}>
            <button
              onClick={() => setIsOnlineHidden(true)}
              className="text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              hide
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOnlineHidden(false)}
          className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${neuBtn}`}
        >
          <span className="flex items-center gap-2 text-[#e11d48]">
            <Radio size={14} /> Show Online Friends
          </span>
          <span className="text-sky-400 text-[11px]">show</span>
        </button>
      )}

      {/* Full Calendar Modal — Neumorphism */}
      <AnimatePresence>
        {isFullCalendarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-3xl p-6 space-y-4 ${neuCard}`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${
                isDarkMode ? 'border-white/[0.06]' : 'border-black/[0.06]'
              }`}>
                <div className="flex items-center gap-2 text-[#e11d48]">
                  <CalendarIcon size={20} />
                  <h3 className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Full Academic & Study Calendar</h3>
                </div>
                <button
                  onClick={() => setIsFullCalendarOpen(false)}
                  className={`p-1.5 rounded-xl transition-all ${neuBtn} ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className={`p-3.5 rounded-2xl flex items-center justify-between ${neuInset}`}>
                  <div>
                    <span className="text-amber-400 font-bold block">🔥 Today • {todayFormatted}</span>
                    <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Daily Study Goal (10 mins)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <div className={`p-3.5 rounded-2xl flex items-center justify-between ${neuInset}`}>
                  <div>
                    <span className="text-sky-400 font-bold block">📚 CSIT 223 Midterm Project</span>
                    <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>UI/UX Wireframe Submission</span>
                  </div>
                  <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Due Aug 22, 2026</span>
                </div>

                <div className={`p-3.5 rounded-2xl flex items-center justify-between ${neuInset}`}>
                  <div>
                    <span className="text-purple-400 font-bold block">🐾 Kleo Polyglot Circle</span>
                    <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Korean Conversation Roleplay</span>
                  </div>
                  <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Aug 25, 2026</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsFullCalendarOpen(false)}
                  className={`px-5 py-2.5 rounded-xl bg-[#e11d48] text-white font-bold text-xs shadow-[-2px_-2px_6px_rgba(255,255,255,0.25),3px_3px_8px_rgba(0,0,0,0.5)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)] transition-all`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
};
