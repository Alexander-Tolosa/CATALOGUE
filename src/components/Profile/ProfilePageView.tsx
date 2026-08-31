import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Shield,
  Star,
  Folder,
  Image as ImageIcon,
  Users,
  UserCheck,
  Award,
  Calendar,
  Clock,
  Key,
  LogOut,
  ChevronRight,
  Edit,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  HeartHandshake,
  MessageSquare,
  UserPlus
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { AwardsSection } from './AwardsSection';
import { FriendsHub } from './FriendsHub';
import { SecuritySignInSection } from './SecuritySignInSection';
import { EditProfileModal } from './EditProfileModal';
import { SettingsView } from '../Settings/SettingsView';
import { LogoutModal } from '../Navigation/LogoutModal';

type SubNavTab =
  | 'profile'
  | 'settings'
  | 'privacy'
  | 'awards'
  | 'portfolio'
  | 'photos'
  | 'parents'
  | 'mentors'
  | 'friends';

type ContentSubTab = 'about' | 'info' | 'enrolled' | 'completed' | 'groups';

export const ProfilePageView: React.FC = () => {
  const { profile, isDarkMode, selectLanguageTrack } = useAppStore();
  const { googleUser, logout } = useAuthStore();
  const { friends, setActiveChatFriendId } = useFriendsStore();
  const { t } = useTranslation();

  const [activeSubNav, setActiveSubNav] = useState<SubNavTab>('profile');
  const [activeContentTab, setActiveContentTab] = useState<ContentSubTab>('about');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const personal = profile.personalInfo || {
    fullName: profile.name || 'ALEXANDER MICHAEL TOLOSA',
    studentId: '2020-09482',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    yearLevel: 'BSIT 2nd Year (Section 2C)',
    email: 'alexander.tolosa@clase.edu.ph',
    phone: '+63 912 345 6789',
    dateOfBirth: 'March 15, 2002',
    address: 'Iloilo City, Philippines',
    emergencyContact: {
      name: 'Maria Teresa Tolosa',
      relationship: 'Mother / Guardian',
      phone: '+63 918 765 4321'
    },
    bio: 'There is currently no information about this member.',
    joinedDate: 'Sep 4, 2020',
    lastActivity: '3 hours ago'
  };

  const displayName = (profile.name || googleUser?.name || 'ALEXANDER MICHAEL TOLOSA').toUpperCase();

  const enrolledCourses = [
    {
      code: 'CSIT 223',
      name: 'Human-Computer Interaction (HCI) / BSIT 2C',
      instructor: 'Prof. J. Dela Cruz',
      progress: 88,
      status: 'In Progress'
    },
    {
      code: 'KOR 101',
      name: 'Korean Language & Cultural Foundations',
      instructor: 'Kleo AI Language Academy',
      progress: 74,
      status: 'In Progress'
    },
    {
      code: 'JPN 101',
      name: 'Japanese Script Foundations & Grammar',
      instructor: 'Kleo AI Language Academy',
      progress: 45,
      status: 'In Progress'
    },
    {
      code: 'IT 221',
      name: 'Data Structures & Algorithm Design',
      instructor: 'Dr. R. Santos',
      progress: 92,
      status: 'In Progress'
    }
  ];

  const completedCourses = [
    {
      code: 'AP 9',
      name: 'Grade 9 BL Ma. Teresa - Araling Panlipunan (Ekonomiks)',
      date: 'Oct 5, 2020',
      grade: '98.5% (High Honors)'
    },
    {
      code: 'TLE 10',
      name: 'Technology & Livelihood Education (TLE 10 - BLELIAS)',
      date: 'Aug 10, 2022',
      grade: 'First Honors'
    },
    {
      code: 'CSIT 111',
      name: 'Introduction to Computing & Logic',
      date: 'Dec 18, 2023',
      grade: 'GWA 1.20'
    }
  ];

  const groupsList = [
    {
      name: 'CLASE IT Student Guild',
      role: 'Active Member (Section 2C)',
      members: 142,
      category: 'Department Society'
    },
    {
      name: 'CATALOGUE Polyglot Study Circle',
      role: 'Korean & Japanese Study Lead',
      members: 89,
      category: 'Language Exchange'
    },
    {
      name: 'Google Developer Student Clubs (GDSC)',
      role: 'UI/UX Track Member',
      members: 210,
      category: 'Tech Student Organization'
    }
  ];

  return (
    <div className={`min-h-screen pt-20 sm:pt-24 pb-20 px-3 sm:px-6 md:px-8 transition-colors ${
      isDarkMode ? 'bg-[#0b0f19] text-white' : 'bg-[#FAF6F0] text-[#2B2725]'
    }`}>
      {/* Main 3-Column Profile Layout Matching Screenshot */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================
            LEFT COLUMN: Sub-navigation Sidebar (2.5 / 12 cols)
            Matching the exact list from the screenshot
           ======================================================== */}
        <div className="lg:col-span-3 space-y-2">
          <div className={`p-3.5 rounded-3xl border shadow-xl space-y-1 transition-colors ${
            isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
          }`}>
            {/* 1. Profile */}
            <button
              onClick={() => setActiveSubNav('profile')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeSubNav === 'profile'
                  ? 'bg-rose-500/15 text-[#e11d48] font-black border border-rose-500/30 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeSubNav === 'profile' ? 'bg-[#e11d48] ring-2 ring-rose-500/40' : 'bg-slate-500'}`} />
              <User size={16} className={activeSubNav === 'profile' ? 'text-[#e11d48]' : 'text-slate-400'} />
              <span>Profile</span>
            </button>

            {/* 2. Settings */}
            <button
              onClick={() => setActiveSubNav('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeSubNav === 'settings'
                  ? 'bg-rose-500/15 text-[#e11d48] font-black border border-rose-500/30 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeSubNav === 'settings' ? 'bg-[#e11d48]' : 'bg-transparent'}`} />
              <Settings size={16} className={activeSubNav === 'settings' ? 'text-[#e11d48]' : 'text-slate-400'} />
              <span>Settings</span>
            </button>

            {/* 3. Privacy / Security & Sign-in */}
            <button
              onClick={() => setActiveSubNav('privacy')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeSubNav === 'privacy'
                  ? 'bg-rose-500/15 text-[#e11d48] font-black border border-rose-500/30 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeSubNav === 'privacy' ? 'bg-[#e11d48]' : 'bg-transparent'}`} />
              <Shield size={16} className={activeSubNav === 'privacy' ? 'text-[#e11d48]' : 'text-slate-400'} />
              <span>Security & Sign-in</span>
            </button>

            {/* 4. Awards */}
            <button
              onClick={() => setActiveSubNav('awards')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeSubNav === 'awards'
                  ? 'bg-rose-500/15 text-[#e11d48] font-black border border-rose-500/30 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeSubNav === 'awards' ? 'bg-[#e11d48]' : 'bg-transparent'}`} />
              <Star size={16} className={activeSubNav === 'awards' ? 'text-[#e11d48]' : 'text-slate-400'} />
              <span>Awards (40)</span>
            </button>

            {/* 5. Portfolio */}
            <button
              onClick={() => setActiveSubNav('portfolio')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeSubNav === 'portfolio'
                  ? 'bg-rose-500/15 text-[#e11d48] font-black border border-rose-500/30 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeSubNav === 'portfolio' ? 'bg-[#e11d48]' : 'bg-transparent'}`} />
              <Folder size={16} className={activeSubNav === 'portfolio' ? 'text-[#e11d48]' : 'text-slate-400'} />
              <span>Portfolio</span>
            </button>

            {/* 6. Photos */}
            <button
              onClick={() => setActiveSubNav('photos')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeSubNav === 'photos'
                  ? 'bg-rose-500/15 text-[#e11d48] font-black border border-rose-500/30 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeSubNav === 'photos' ? 'bg-[#e11d48]' : 'bg-transparent'}`} />
              <ImageIcon size={16} className={activeSubNav === 'photos' ? 'text-[#e11d48]' : 'text-slate-400'} />
              <span>Photos</span>
            </button>

            {/* 7. Parents */}
            <button
              onClick={() => setActiveSubNav('parents')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeSubNav === 'parents'
                  ? 'bg-rose-500/15 text-[#e11d48] font-black border border-rose-500/30 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeSubNav === 'parents' ? 'bg-[#e11d48]' : 'bg-transparent'}`} />
              <HeartHandshake size={16} className={activeSubNav === 'parents' ? 'text-[#e11d48]' : 'text-slate-400'} />
              <span>Parents</span>
            </button>

            {/* 8. Mentors */}
            <button
              onClick={() => setActiveSubNav('mentors')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeSubNav === 'mentors'
                  ? 'bg-rose-500/15 text-[#e11d48] font-black border border-rose-500/30 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeSubNav === 'mentors' ? 'bg-[#e11d48]' : 'bg-transparent'}`} />
              <GraduationCap size={16} className={activeSubNav === 'mentors' ? 'text-[#e11d48]' : 'text-slate-400'} />
              <span>Mentors</span>
            </button>

            {/* 9. Friends (Direct Switch to Friends Hub) */}
            <button
              onClick={() => setActiveSubNav('friends')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeSubNav === 'friends'
                  ? 'bg-rose-500/15 text-[#e11d48] font-black border border-rose-500/30 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeSubNav === 'friends' ? 'bg-[#e11d48]' : 'bg-transparent'}`} />
              <Users size={16} className={activeSubNav === 'friends' ? 'text-[#e11d48]' : 'text-slate-400'} />
              <span>Friends ({friends.length})</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            CENTER COLUMN: Main Banner & Sub-Tabs Content (6.5 / 12 cols)
           ======================================================== */}
        <div className="lg:col-span-6 space-y-6">
          {activeSubNav === 'profile' && (
            <>
              {/* Main Banner Header (Matching Screenshot Exactly) */}
              <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-colors ${
                isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
              }`}>
                {/* Polygonal Cyan Geometric Banner Texture */}
                <div
                  className="h-36 sm:h-44 relative overflow-hidden flex items-start justify-end p-4"
                  style={{
                    background: 'linear-gradient(135deg, #1b6875 0%, #2ea2b0 35%, #1e7887 70%, #155561 100%)'
                  }}
                >
                  {/* Geometric Polygonal Overlay Grid */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-35 mix-blend-overlay"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern id="polyGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60 Z" fill="rgba(255,255,255,0.06)" />
                        <path d="M 60 60 L 60 0 0 60 Z" fill="rgba(0,0,0,0.06)" />
                        <path d="M 0 0 L 60 60" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#polyGrid)" />
                  </svg>

                  {/* Student Pill Badge (Upper Right) */}
                  <div className="relative z-10 px-3.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-slate-200 text-xs font-bold tracking-wide shadow-sm">
                    Student
                  </div>
                </div>

                {/* Overlapping Avatar & User Metadata */}
                <div className="px-6 pb-6 pt-0 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
                    {/* Circle Avatar with Cyan Gradient Ring */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#38bdf8] to-[#22d3ee] shadow-2xl shrink-0">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#161a26] border-2 border-white/40 flex items-center justify-center">
                        {googleUser?.picture ? (
                          <img
                            src={googleUser.picture}
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          /* Illustrated User Avatar (Matching Screenshot Vector) */
                          <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full object-cover"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="50" cy="50" r="50" fill="#38BDF8" />
                            {/* Shirt */}
                            <path
                              d="M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z"
                              fill="#10B981"
                            />
                            {/* Neck */}
                            <rect x="44" y="52" width="12" height="18" fill="#8D5B4C" />
                            {/* Face */}
                            <ellipse cx="50" cy="46" rx="16" ry="18" fill="#8D5B4C" />
                            {/* Smile */}
                            <path
                              d="M 44 54 Q 50 60 56 54"
                              stroke="#FFFFFF"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              fill="none"
                            />
                            {/* Hair */}
                            <path
                              d="M 33 42 C 33 28 42 22 50 22 C 58 22 67 28 67 42 C 67 33 60 28 50 28 C 40 28 33 33 33 42 Z"
                              fill="#1F2937"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Red "Edit" Button (Matching Screenshot) */}
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-5 py-2 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-end"
                    >
                      <Edit size={14} />
                      <span>{t.profile.editProfile}</span>
                    </button>
                  </div>

                  {/* Name & Academic Department Subtitles */}
                  <div className="space-y-1">
                    <h2 className="font-display font-black text-xl sm:text-2xl text-slate-100 tracking-wide uppercase">
                      {displayName}
                    </h2>
                    <p className="text-xs font-bold text-sky-400">
                      {personal.department}
                    </p>
                    <p className="text-xs font-semibold text-slate-400">
                      Program: {personal.program}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs: [About] [Info] [Enrolled] [Completed] [Groups] (Matching Screenshot) */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {(
                  [
                    { id: 'about', label: 'About' },
                    { id: 'info', label: 'Info' },
                    { id: 'enrolled', label: 'Enrolled' },
                    { id: 'completed', label: 'Completed' },
                    { id: 'groups', label: 'Groups' }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveContentTab(tab.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      activeContentTab === tab.id
                        ? 'bg-[#e11d48] text-white shadow-md'
                        : isDarkMode
                        ? 'bg-[#151c2e] text-slate-300 hover:bg-slate-800'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT: ABOUT */}
              {activeContentTab === 'about' && (
                <div className="space-y-6">
                  {/* About Member Text */}
                  <div className={`p-6 rounded-3xl border space-y-3 transition-colors ${
                    isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
                  }`}>
                    <h3 className="font-display font-black text-base text-slate-100">
                      About
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {personal.bio || 'There is currently no information about this member.'}
                    </p>
                  </div>

                  {/* Awards Section (Matching Screenshot) */}
                  <AwardsSection onViewAll={() => setActiveSubNav('awards')} />
                </div>
              )}

              {/* TAB CONTENT: INFO (PERSONAL INFO) */}
              {activeContentTab === 'info' && (
                <div className={`p-6 rounded-3xl border space-y-5 transition-colors ${
                  isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-black text-base text-slate-100 flex items-center gap-2">
                      <User size={18} className="text-[#e11d48]" /> Personal & Student Information
                    </h3>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-xs font-bold text-[#e11d48] hover:underline flex items-center gap-1"
                    >
                      <Edit size={13} /> Edit Info
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Student ID</span>
                      <span className="font-extrabold text-slate-200">{personal.studentId}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Year Level & Section</span>
                      <span className="font-extrabold text-slate-200">{personal.yearLevel}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Institutional Email</span>
                      <span className="font-extrabold text-sky-400">{personal.email}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Mobile Phone</span>
                      <span className="font-extrabold text-slate-200">{personal.phone}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Date of Birth</span>
                      <span className="font-extrabold text-slate-200">{personal.dateOfBirth}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Permanent Address</span>
                      <span className="font-extrabold text-slate-200">{personal.address}</span>
                    </div>
                  </div>

                  {personal.emergencyContact && (
                    <div className="pt-2 border-t border-slate-800">
                      <h4 className="font-extrabold text-xs text-sky-400 mb-2">Emergency Contact</h4>
                      <p className="text-xs text-slate-300 font-medium">
                        {personal.emergencyContact.name} ({personal.emergencyContact.relationship}) —{' '}
                        <strong className="text-white">{personal.emergencyContact.phone}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: ENROLLED */}
              {activeContentTab === 'enrolled' && (
                <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
                  isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-display font-black text-base text-slate-100 flex items-center gap-2">
                    <BookOpen size={18} className="text-sky-400" /> Active Enrolled Courses
                  </h3>
                  <div className="space-y-3">
                    {enrolledCourses.map((course, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black text-[#F06543] uppercase tracking-wider">{course.code}</span>
                            <h4 className="font-extrabold text-xs text-slate-100">{course.name}</h4>
                            <span className="text-[11px] text-slate-400">{course.instructor}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                            {course.status}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#F06543] h-full rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: COMPLETED */}
              {activeContentTab === 'completed' && (
                <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
                  isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-display font-black text-base text-slate-100 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" /> Completed Courses & Milestones
                  </h3>
                  <div className="space-y-3">
                    {completedCourses.map((course, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black text-emerald-400 uppercase">{course.code}</span>
                          <h4 className="font-extrabold text-xs text-slate-100">{course.name}</h4>
                          <span className="text-[11px] text-slate-400">Completed on: {course.date}</span>
                        </div>
                        <span className="text-xs font-black text-amber-400">{course.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: GROUPS */}
              {activeContentTab === 'groups' && (
                <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
                  isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-display font-black text-base text-slate-100 flex items-center gap-2">
                    <Users size={18} className="text-purple-400" /> Student Organizations & Groups
                  </h3>
                  <div className="space-y-3">
                    {groupsList.map((group, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black text-purple-400 uppercase">{group.category}</span>
                          <h4 className="font-extrabold text-xs text-slate-100">{group.name}</h4>
                          <span className="text-[11px] text-slate-400">{group.role} • {group.members} active members</span>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-purple-500/15 text-purple-300 text-[10px] font-black">
                          Joined
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* SUB-NAV VIEWS */}
          {activeSubNav === 'settings' && (
            <SettingsView profile={profile} onSelectLanguage={selectLanguageTrack} />
          )}

          {activeSubNav === 'privacy' && (
            <SecuritySignInSection />
          )}

          {activeSubNav === 'awards' && (
            <div className={`p-6 rounded-3xl border space-y-6 ${
              isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
            }`}>
              <AwardsSection showAll={true} />
            </div>
          )}

          {activeSubNav === 'friends' && (
            <FriendsHub />
          )}

          {activeSubNav === 'portfolio' && (
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
            }`}>
              <h3 className="font-display font-black text-lg text-slate-100 flex items-center gap-2">
                <Folder size={20} className="text-[#F06543]" /> Student Portfolio
              </h3>
              <p className="text-xs text-slate-400">
                Showcase of academic software projects, HCI wireframe prototypes, and language translation scripts.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-black text-sky-400 uppercase">HCI Prototype</span>
                  <h4 className="font-bold text-xs text-white">CATALOGUE Web UI System</h4>
                  <p className="text-[11px] text-slate-400">React + Tailwind high fidelity learning platform prototype.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-black text-emerald-400 uppercase">Language Tool</span>
                  <h4 className="font-bold text-xs text-white">Korean Banmal to Jondaetmal Parser</h4>
                  <p className="text-[11px] text-slate-400">AI contextual politeness engine for natural language dialogues.</p>
                </div>
              </div>
            </div>
          )}

          {activeSubNav === 'photos' && (
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
            }`}>
              <h3 className="font-display font-black text-lg text-slate-100 flex items-center gap-2">
                <ImageIcon size={20} className="text-amber-400" /> Academic & Campus Photos
              </h3>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="aspect-video rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-700">
                    CLASE Event #{item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubNav === 'parents' && (
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
            }`}>
              <h3 className="font-display font-black text-lg text-slate-100 flex items-center gap-2">
                <HeartHandshake size={20} className="text-rose-400" /> Parent & Guardian Portal Access
              </h3>
              <p className="text-xs text-slate-400">
                Authorized guardian linked: <strong>Maria Teresa Tolosa</strong> (Mother)
              </p>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Guardian Access Active
                </span>
                <p className="text-slate-300">Grade reports & milestone progress notifications are sent monthly.</p>
              </div>
            </div>
          )}

          {activeSubNav === 'mentors' && (
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
            }`}>
              <h3 className="font-display font-black text-lg text-slate-100 flex items-center gap-2">
                <GraduationCap size={20} className="text-sky-400" /> Academic Advisors & Language Mentors
              </h3>
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-white">Prof. J. Dela Cruz, MIT</h4>
                    <p className="text-[11px] text-slate-400">Academic Adviser • CLASE Information Technology</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-400 font-bold text-xs">
                    Message
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-white">Kleo AI Language Mentor</h4>
                    <p className="text-[11px] text-slate-400">AI Polyglot Coach • Korean & Japanese</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-[#F06543]/20 text-[#F06543] font-bold text-xs">
                    Consult
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            RIGHT COLUMN: Account & Friends Widgets (3.5 / 12 cols)
            Matching the exact cards from the screenshot
           ======================================================== */}
        <div className="lg:col-span-3 space-y-6">
          {/* 1. Account Card (Matching Screenshot) */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-4 transition-colors ${
            isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2 text-[#e11d48] font-black text-xs">
              <User size={16} />
              <span>Account</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Joined */}
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={14} className="text-slate-500" />
                <span className="text-[11px]">Joined <strong className="text-slate-200 ml-1">{personal.joinedDate}</strong></span>
              </div>

              {/* Last Activity */}
              <div className="flex items-center gap-2 text-slate-400">
                <Clock size={14} className="text-slate-500" />
                <span className="text-[11px]">Last activity <strong className="text-slate-200 ml-1">{personal.lastActivity}</strong></span>
              </div>

              {/* Login Credentials Link */}
              <button
                onClick={() => setActiveSubNav('privacy')}
                className="w-full pt-2 flex items-center gap-2 text-sky-400 hover:underline font-semibold text-xs cursor-pointer text-left"
              >
                <Key size={14} />
                <span>Login credentials</span>
              </button>

              {/* Force Logout Action */}
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center gap-2 text-slate-400 hover:text-rose-400 font-semibold text-xs transition-colors cursor-pointer text-left"
              >
                <LogOut size={14} />
                <span>Force logout</span>
              </button>
            </div>
          </div>

          {/* 2. Friends 14 > Card (Matching Screenshot) */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-4 transition-colors ${
            isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
          }`}>
            {/* Friends Header with Count and Arrow */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveSubNav('friends')}
                className="flex items-center gap-2 text-[#e11d48] font-black text-xs hover:underline cursor-pointer"
              >
                <Users size={16} />
                <span>Friends</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-[#e11d48] font-black text-[10px]">
                  {friends.length}
                </span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => setActiveSubNav('friends')}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Add Friend"
              >
                <UserPlus size={15} />
              </button>
            </div>

            {/* Quick Friend List (Paulo Miguel Tolosa, Ashjan Quimpo, Adrian Justin Salinas, Matthew Tabat, Deghne Gabriel Agana) */}
            <div className="space-y-3">
              {friends.slice(0, 5).map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setActiveChatFriendId(friend.id)}
                  className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${friend.avatarColor || 'from-sky-400 to-indigo-600'} flex items-center justify-center text-white font-black text-[10px] border border-white/20`}>
                        {friend.avatarInitials || friend.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#0f1422] ${
                          friend.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white truncate">
                      {friend.name}
                    </span>
                  </div>

                  <MessageSquare
                    size={14}
                    className="text-slate-500 group-hover:text-[#F06543] shrink-0 transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* View All Friends / Meet Online CTA */}
            <button
              onClick={() => setActiveSubNav('friends')}
              className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs text-center block transition-colors cursor-pointer"
            >
              View All & Meet Friends Online →
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Log Out Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logout();
        }}
      />
    </div>
  );
};
