import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
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

export const OverviewRightSidebar: React.FC<OverviewRightSidebarProps> = ({ onNavigate }) => {
  const { isDarkMode, profile } = useAppStore();
  const { friends, setActiveChatFriendId } = useFriendsStore();

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 18)); // Aug 18, 2026
  const [isCalendarHidden, setIsCalendarHidden] = useState(false);
  const [isOnlineHidden, setIsOnlineHidden] = useState(false);
  const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false);


  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar Days Calculation for Aug 2026 (or active month)
  // Aug 1, 2026 starts on Saturday (column 6)
  // July preceding days: 26, 27, 28, 29, 30, 31
  const calendarDays = [
    { day: 26, isOtherMonth: true },
    { day: 27, isOtherMonth: true },
    { day: 28, isOtherMonth: true },
    { day: 29, isOtherMonth: true },
    { day: 30, isOtherMonth: true },
    { day: 31, isOtherMonth: true },
    { day: 1, isOtherMonth: false },
    { day: 2, isOtherMonth: false },
    { day: 3, isOtherMonth: false },
    { day: 4, isOtherMonth: false },
    { day: 5, isOtherMonth: false },
    { day: 6, isOtherMonth: false },
    { day: 7, isOtherMonth: false },
    { day: 8, isOtherMonth: false },
    { day: 9, isOtherMonth: false },
    { day: 10, isOtherMonth: false },
    { day: 11, isOtherMonth: false },
    { day: 12, isOtherMonth: false },
    { day: 13, isOtherMonth: false },
    { day: 14, isOtherMonth: false },
    { day: 15, isOtherMonth: false },
    { day: 16, isOtherMonth: false },
    { day: 17, isOtherMonth: false },
    { day: 18, isOtherMonth: false, isToday: true }, // Highlighted red active day
    { day: 19, isOtherMonth: false },
    { day: 20, isOtherMonth: false },
    { day: 21, isOtherMonth: false },
    { day: 22, isOtherMonth: false },
    { day: 23, isOtherMonth: false },
    { day: 24, isOtherMonth: false },
    { day: 25, isOtherMonth: false },
    { day: 26, isOtherMonth: false },
    { day: 27, isOtherMonth: false },
    { day: 28, isOtherMonth: false },
    { day: 29, isOtherMonth: false },
    { day: 30, isOtherMonth: false },
    { day: 31, isOtherMonth: false },
    { day: 1, isOtherMonth: true },
    { day: 2, isOtherMonth: true },
    { day: 3, isOtherMonth: true },
    { day: 4, isOtherMonth: true },
    { day: 5, isOtherMonth: true }
  ];

  // Online friends filter
  const onlineFriends = friends.filter((f) => f.isOnline);

  return (
    <aside className="w-72 xl:w-80 space-y-4 shrink-0 hidden lg:block select-none">
      {/* ========================================================
          CARD 1: Calendar (Matching Picture 1)
         ======================================================== */}
      {!isCalendarHidden ? (
        <div
          className={`p-5 rounded-3xl border shadow-xl space-y-4 transition-colors ${
            isDarkMode ? 'bg-[#101422] border-[#1d2338]' : 'bg-white border-slate-200'
          }`}
        >
          {/* Header with Red Calendar Icon */}
          <div className="flex items-center gap-2 text-[#e11d48] font-black text-sm">
            <CalendarIcon size={16} className="stroke-[2.5]" />
            <span className="text-xs font-black tracking-wide">Calendar</span>
          </div>

          {/* Month Switcher: < Aug 2026 > */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-display font-black text-sm text-slate-100">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days of the Week Headers: S M T W T F S */}
          <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-400">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          {/* Days Grid (42 cells: 6 rows x 7 cols) */}
          <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs font-extrabold">
            {calendarDays.map((item, index) => {
              if (item.isToday) {
                return (
                  <div key={index} className="flex items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-[#e11d48] text-white flex items-center justify-center font-black text-xs shadow-md">
                      {item.day}
                    </span>
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center h-6 ${
                    item.isOtherMonth ? 'text-slate-500/70 font-semibold' : 'text-slate-200'
                  }`}
                >
                  <span>{item.day}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom Links: [full calendar] [hide] */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold">
            <button
              onClick={() => setIsFullCalendarOpen(true)}
              className="text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              full calendar
            </button>
            <button
              onClick={() => setIsCalendarHidden(true)}
              className="text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              hide
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCalendarHidden(false)}
          className="w-full py-2 px-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white flex items-center justify-between"
        >
          <span className="flex items-center gap-2 text-[#e11d48]">
            <CalendarIcon size={14} /> Show Calendar
          </span>
          <span className="text-sky-400 text-[11px]">show</span>
        </button>
      )}

      {/* ========================================================
          CARD 3: Online (Online Friends - Matching Picture 1)
         ======================================================== */}
      {!isOnlineHidden ? (
        <div
          className={`p-5 rounded-3xl border shadow-xl space-y-4 transition-colors ${
            isDarkMode ? 'bg-[#101422] border-[#1d2338]' : 'bg-white border-slate-200'
          }`}
        >
          {/* Header with Red Bullseye / Online Indicator */}
          <div className="flex items-center gap-2 text-[#e11d48] font-black text-sm">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#e11d48] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
            </div>
            <span className="text-xs font-black tracking-wide">Online</span>
          </div>

          {/* Online Friends List: Avatar + Name (e.g. ADRIAN J..., TIM GABRI...) */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-1 pb-2">
            {/* Friend 1: Adrian Justin Salinas */}
            <div
              onClick={() => {
                const target = friends.find(f => f.name.toLowerCase().includes('adrian')) || friends[2];
                if (target) setActiveChatFriendId(target.id);
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
              title="Adrian Justin Salinas (Online)"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 border-2 border-white/20 group-hover:scale-105 transition-transform flex items-center justify-center">
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
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#101422]" />
              </div>
              <span className="text-[10px] font-black text-slate-100 group-hover:text-sky-400 uppercase tracking-tight max-w-[70px] truncate text-center">
                ADRIAN J...
              </span>
            </div>

            {/* Friend 2: Deghne Gabriel Agana / Tim Gabriel */}
            <div
              onClick={() => {
                const target = friends.find(f => f.name.toLowerCase().includes('deghne') || f.name.toLowerCase().includes('gabriel')) || friends[4];
                if (target) setActiveChatFriendId(target.id);
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
              title="Deghne Gabriel Agana (Online)"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#2dd4bf] border-2 border-white/20 group-hover:scale-105 transition-transform flex items-center justify-center p-1">
                  {/* Long hair illustrated user vector (Matching Picture 1) */}
                  <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
                    <circle cx="50" cy="50" r="48" fill="#2DD4BF" />
                    <path d="M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z" fill="#0284C7" />
                    <rect x="44" y="52" width="12" height="18" fill="#8D5B4C" />
                    <ellipse cx="50" cy="46" rx="16" ry="18" fill="#8D5B4C" />
                    {/* Long Hair */}
                    <path d="M 30 40 C 30 20 40 18 50 18 C 60 18 70 20 70 40 C 70 65 66 76 66 76 C 60 55 58 40 50 40 C 42 40 40 55 34 76 C 34 76 30 65 30 40 Z" fill="#111827" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#101422]" />
              </div>
              <span className="text-[10px] font-black text-slate-100 group-hover:text-sky-400 uppercase tracking-tight max-w-[70px] truncate text-center">
                TIM GABRI...
              </span>
            </div>

            {/* Friend 3: Paulo Miguel Tolosa */}
            <div
              onClick={() => {
                const target = friends[0];
                if (target) setActiveChatFriendId(target.id);
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
              title="Paulo Miguel Tolosa (Online)"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 border-2 border-white/20 group-hover:scale-105 transition-transform flex items-center justify-center text-white font-black text-xs">
                  PT
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#101422]" />
              </div>
              <span className="text-[10px] font-black text-slate-100 group-hover:text-sky-400 uppercase tracking-tight max-w-[70px] truncate text-center">
                PAULO M...
              </span>
            </div>
          </div>

          {/* Bottom Link: [hide] */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-end text-xs font-semibold">
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
          className="w-full py-2 px-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white flex items-center justify-between"
        >
          <span className="flex items-center gap-2 text-[#e11d48]">
            <Radio size={14} /> Show Online Friends
          </span>
          <span className="text-sky-400 text-[11px]">show</span>
        </button>
      )}

      {/* Full Calendar Modal */}
      <AnimatePresence>
        {isFullCalendarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 space-y-4 ${
                isDarkMode ? 'bg-[#101422] border-[#1d2338] text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-[#e11d48]">
                  <CalendarIcon size={20} />
                  <h3 className="font-black text-base text-white">Full Academic & Study Calendar</h3>
                </div>
                <button
                  onClick={() => setIsFullCalendarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-amber-400 font-bold block">🔥 Today • Aug 18, 2026</span>
                    <span className="text-slate-200 font-bold">Daily Study Goal (10 mins)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-sky-400 font-bold block">📚 CSIT 223 Midterm Project</span>
                    <span className="text-slate-200 font-bold">UI/UX Wireframe Submission</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">Due Aug 22, 2026</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-purple-400 font-bold block">🐾 Kleo Polyglot Circle</span>
                    <span className="text-slate-200 font-bold">Korean Conversation Roleplay</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">Aug 25, 2026</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsFullCalendarOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#e11d48] text-white font-bold text-xs"
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
