import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  ArrowRight,
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
import { useTranslation } from '../../lib/i18n/useTranslation';
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
  const { t } = useTranslation();

  // Use the real current date from the user's system
  const realToday = useMemo(() => new Date(), []);

  // Calendar navigation state — start on the current month
  const [viewYear, setViewYear] = useState(realToday.getFullYear());
  const [viewMonth, setViewMonth] = useState(realToday.getMonth());

  const [isCalendarHidden, setIsCalendarHidden] = useState(false);
  const [isOnlineHidden, setIsOnlineHidden] = useState(false);
  const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false);

  const fullMonthNames = t.calendar.monthNames;

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

  // Friends Card State
  const [activeFriendsTab, setActiveFriendsTab] = useState<'following' | 'followers'>('following');
  const [isFriendsExpanded, setIsFriendsExpanded] = useState(false);

  // Character / Illustrated Avatar Renderer (matching reference style)
  const renderFriendAvatar = (index: number, friend: any) => {
    if (index === 0) {
      // Purple background character (matching item 1 in reference)
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden bg-[#581c87] flex items-center justify-center p-0.5 relative shrink-0 shadow-inner">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="#6B21A8" />
            <path d="M 26 92 C 26 74 36 68 50 68 C 64 68 74 74 74 92 Z" fill="#1E1B4B" />
            <ellipse cx="50" cy="50" rx="20" ry="18" fill="#E8B595" />
            <rect x="43" y="58" width="14" height="12" fill="#E8B595" />
            {/* Hair */}
            <path d="M 28 42 C 28 26 38 22 50 22 C 62 22 72 26 72 42 C 68 36 62 38 56 34 C 50 38 44 34 38 38 C 32 36 28 42 28 42 Z" fill="#451A03" />
            {/* Eyes & Smile */}
            <circle cx="43" cy="48" r="2.5" fill="#1E1B4B" />
            <circle cx="57" cy="48" r="2.5" fill="#1E1B4B" />
            <path d="M 46 56 Q 50 60 54 56" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );
    }
    if (index === 1) {
      // Green background character (matching item 2 in reference)
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden bg-[#15803d] flex items-center justify-center p-0.5 relative shrink-0 shadow-inner">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="#16A34A" />
            <path d="M 26 92 C 26 74 36 68 50 68 C 64 68 74 74 74 92 Z" fill="#14532D" />
            <ellipse cx="50" cy="50" rx="20" ry="18" fill="#C68A4C" />
            <rect x="43" y="58" width="14" height="12" fill="#C68A4C" />
            {/* Hair */}
            <path d="M 28 40 C 28 24 38 20 50 20 C 62 20 72 24 72 40 C 68 34 60 36 50 32 C 40 36 32 34 28 40 Z" fill="#3B1E08" />
            {/* Smirk & Eyes */}
            <circle cx="42" cy="48" r="2.5" fill="#14532D" />
            <circle cx="58" cy="48" r="2.5" fill="#14532D" />
            <path d="M 45 56 Q 52 61 58 55" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );
    }
    if (index === 2) {
      // Red background monkey character (matching item 3 in reference)
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden bg-[#991b1b] flex items-center justify-center p-0.5 relative shrink-0 shadow-inner">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="#DC2626" />
            {/* Ears */}
            <circle cx="28" cy="48" r="8" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="72" cy="48" r="8" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
            {/* Head */}
            <ellipse cx="50" cy="54" rx="22" ry="20" fill="#78350F" />
            <path d="M 50 32 C 50 24 53 22 55 26 C 57 30 52 32 50 32 Z" fill="#78350F" />
            {/* Face Muzzle */}
            <ellipse cx="50" cy="60" rx="15" ry="12" fill="#FED7AA" />
            <circle cx="44" cy="52" r="3" fill="#1E293B" />
            <circle cx="56" cy="52" r="3" fill="#1E293B" />
            <ellipse cx="50" cy="58" rx="3" ry="2" fill="#78350F" />
            <path d="M 44 63 Q 50 70 56 63" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="#DC2626" />
          </svg>
        </div>
      );
    }
    // Fallback gradient with initials
    return (
      <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${friend.avatarColor || 'from-sky-400 to-indigo-600'} flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md`}>
        {friend.avatarInitials || friend.name.substring(0, 2).toUpperCase()}
      </div>
    );
  };

  // Following & Followers lists with XP points (matching reference layout)
  const followingFriends = useMemo(() => [
    { ...friends[0], name: 'mike', xp: 65282, isOnline: true },
    { ...(friends[2] || friends[0]), name: 'Michael Ellis', xp: 19309, isOnline: true },
    { ...(friends[4] || friends[1]), name: 'Mike', xp: 14436, isOnline: true },
    { ...(friends[1] || friends[0]), name: 'Ashjan Quimpo', xp: 12850, isOnline: true },
    { ...(friends[3] || friends[0]), name: 'Matthew Tabat', xp: 9420, isOnline: false },
  ], [friends]);

  const followersFriends = useMemo(() => [
    { ...(friends[5] || friends[0]), name: 'Maria Santos', xp: 48920, isOnline: true },
    { ...(friends[3] || friends[1]), name: 'Matthew Tabat', xp: 28410, isOnline: false },
    { ...(friends[1] || friends[2]), name: 'Ashjan Quimpo', xp: 21300, isOnline: true },
    { ...friends[0], name: 'Paulo Miguel', xp: 65282, isOnline: true },
  ], [friends]);

  const currentFriendList = activeFriendsTab === 'following' ? followingFriends : followersFriends;
  const displayedFriends = isFriendsExpanded ? currentFriendList : currentFriendList.slice(0, 3);

  // Neumorphic card class helper for other cards
  const neuCard = isDarkMode ? neumorphicCard.dark : neumorphicCard.light;
  const neuBtn = isDarkMode ? neumorphicButton.dark : neumorphicButton.light;
  const neuInset = isDarkMode ? neumorphicInset.dark : neumorphicInset.light;

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

          {/* Days of the Week */}
          <div
            className={`grid grid-cols-7 text-center text-[11px] font-semibold tracking-wide ${
              isDarkMode ? 'text-slate-400/80' : 'text-slate-400'
            }`}
          >
            {t.calendar.daysShort.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
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
                          ? 'bg-gradient-to-tr from-[#f97316] to-[#fb923c] text-white shadow-[-2px_-2px_6px_rgba(255,255,255,0.25),2px_2px_8px_rgba(0,0,0,0.6)] shadow-[0_0_14px_rgba(249,115,22,0.55)]'
                          : 'bg-gradient-to-tr from-[#f06543] to-[#f97316] text-white shadow-[-2px_-2px_6px_rgba(255,255,255,0.7),2px_2px_8px_rgba(240,101,67,0.4)] shadow-[0_4px_12px_rgba(240,101,67,0.45)]'
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
                isDarkMode ? 'text-[#f97316] hover:text-[#fb923c]' : 'text-[#f06543] hover:text-[#ea580c]'
              }`}
            >
              {t.calendar.viewFullCalendar}
            </button>
            <button
              onClick={() => setIsCalendarHidden(true)}
              className={`transition-colors cursor-pointer ${
                isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {t.common.close}
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
              isDarkMode ? 'text-[#f97316]' : 'text-[#f06543]'
            }`}
          >
            <CalendarIcon size={15} /> {t.calendar.title}
          </span>
          <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#f97316]' : 'text-[#f06543]'}`}>
            {t.calendar.title}
          </span>
        </button>
      )}

      {/* ========================================================
          CARD 2: Following / Followers (Reference Redesign)
         ======================================================== */}
      {!isOnlineHidden ? (
        <div
          className={`rounded-[28px] overflow-hidden transition-all duration-300 ${
            isDarkMode
              ? 'bg-[#1a1e2d] border border-white/[0.03] shadow-[-6px_-6px_18px_rgba(255,255,255,0.035),6px_6px_20px_rgba(0,0,0,0.7)]'
              : 'bg-[#eef2f7] border border-white/60 shadow-[-8px_-8px_18px_rgba(255,255,255,0.9),8px_8px_18px_rgba(166,180,200,0.55)]'
          }`}
        >
          {/* Top Tabs: FOLLOWING / FOLLOWERS (Orange sliding pill animation) */}
          <div className="p-3 pb-1.5">
            <div
              className={`grid grid-cols-2 gap-1.5 p-1 rounded-2xl relative ${
                isDarkMode
                  ? 'bg-[#121624] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]'
                  : 'bg-slate-200/70 shadow-[inset_2px_2px_4px_rgba(166,180,200,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]'
              }`}
            >
              {/* Following Button */}
              <button
                onClick={() => setActiveFriendsTab('following')}
                className="relative py-2 px-3 rounded-xl text-xs font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer flex items-center justify-center select-none"
              >
                {activeFriendsTab === 'following' && (
                  <motion.div
                    layoutId="activeFriendsTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff6b4a] to-[#f05a36] shadow-[0_4px_14px_rgba(240,90,54,0.45)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    activeFriendsTab === 'following'
                      ? 'text-white'
                      : isDarkMode
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.calendar.following}
                </span>
              </button>

              {/* Followers Button */}
              <button
                onClick={() => setActiveFriendsTab('followers')}
                className="relative py-2 px-3 rounded-xl text-xs font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer flex items-center justify-center select-none"
              >
                {activeFriendsTab === 'followers' && (
                  <motion.div
                    layoutId="activeFriendsTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff6b4a] to-[#f05a36] shadow-[0_4px_14px_rgba(240,90,54,0.45)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    activeFriendsTab === 'followers'
                      ? 'text-white'
                      : isDarkMode
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.calendar.followers}
                </span>
              </button>
            </div>
          </div>

          {/* User List with slide in/out transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFriendsTab + (isFriendsExpanded ? '-expanded' : '-collapsed')}
              initial={{ opacity: 0, x: activeFriendsTab === 'following' ? -14 : 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeFriendsTab === 'following' ? 14 : -14 }}
              transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
              className="p-4 space-y-2.5"
            >
              {displayedFriends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.04 }}
                  onClick={() => {
                    setActiveChatFriendId(friend.id);
                  }}
                  className={`flex items-center gap-3.5 p-2 rounded-2xl cursor-pointer transition-all ${
                    isDarkMode
                      ? 'hover:bg-white/[0.04] active:bg-white/[0.02]'
                      : 'hover:bg-black/[0.03] active:bg-black/[0.02]'
                  }`}
                  title={`Chat with ${friend.name}`}
                >
                  {/* Character / Illustrated Avatar */}
                  <div className="relative shrink-0">
                    {renderFriendAvatar(index, friend)}
                    {/* Online status indicator dot */}
                    {friend.isOnline && (
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 ${
                          isDarkMode ? 'border-[#1a1e2d]' : 'border-[#eef2f7]'
                        }`}
                      />
                    )}
                  </div>

                  {/* Name & XP info */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-bold text-sm truncate ${
                        isDarkMode ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      {friend.name}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {friend.xp.toLocaleString()} XP
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Footer: View more & Hide */}
          <div
            className={`px-5 py-3 border-t flex items-center justify-between text-xs font-bold ${
              isDarkMode
                ? 'border-black/30 bg-[#161a27]/40 shadow-[0_-1px_0_rgba(255,255,255,0.03)]'
                : 'border-slate-200/80 bg-white/40 shadow-[0_-1px_0_rgba(166,180,200,0.2)]'
            }`}
          >
            <button
              onClick={() => setIsFriendsExpanded(!isFriendsExpanded)}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <span>
                {isFriendsExpanded
                  ? t.calendar.showLess
                  : `${t.calendar.viewMore} (${Math.max(1, currentFriendList.length - 3)})`}
              </span>
              <ChevronRight
                size={16}
                className={`transition-transform duration-200 ${
                  isFriendsExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>

            <button
              onClick={() => setIsOnlineHidden(true)}
              className={`text-[11px] transition-colors cursor-pointer font-semibold ${
                isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.calendar.hide}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOnlineHidden(false)}
          className={`w-full py-3 px-5 rounded-[22px] text-xs font-bold flex items-center justify-between transition-all ${
            isDarkMode
              ? 'bg-[#1a1e2d] text-slate-300 hover:text-white border border-white/[0.03] shadow-[-4px_-4px_12px_rgba(255,255,255,0.03),4px_4px_12px_rgba(0,0,0,0.6)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]'
              : 'bg-[#eef2f7] text-slate-700 hover:text-slate-900 border border-white/60 shadow-[-5px_-5px_12px_rgba(255,255,255,0.8),5px_5px_12px_rgba(166,180,200,0.5)] active:shadow-[inset_2px_2px_4px_rgba(166,180,200,0.5)]'
          }`}
        >
          <span
            className={`flex items-center gap-2 font-extrabold ${
              isDarkMode ? 'text-sky-400' : 'text-sky-600'
            }`}
          >
            <Users size={15} /> {t.calendar.showFriends}
          </span>
          <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
            {t.calendar.show}
          </span>
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
