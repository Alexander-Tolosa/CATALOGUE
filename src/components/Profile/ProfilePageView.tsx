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
  UserPlus,
  Camera,
  Upload,
  Palette
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { AVATAR_PRESETS, BANNER_PRESETS } from '../../lib/profilePresets';
import { CertificationsSection } from './AwardsSection';
import { FriendsHub } from './FriendsHub';
import { SecuritySignInSection } from './SecuritySignInSection';
import { EditProfileModal } from './EditProfileModal';
import { SettingsView } from '../Settings/SettingsView';
import { LogoutModal } from '../Navigation/LogoutModal';

type SubNavTab =
  | 'profile'
  | 'settings'
  | 'privacy'
  | 'certifications'
  | 'portfolio'
  | 'photos'
  | 'parents'
  | 'mentors'
  | 'friends';

type ContentSubTab = 'about' | 'info' | 'enrolled' | 'completed' | 'groups';

export const ProfilePageView: React.FC = () => {
  const { profile, isDarkMode, selectLanguageTrack, updatePersonalInfo } = useAppStore();
  const { googleUser, logout } = useAuthStore();
  const { friends, setActiveChatFriendId } = useFriendsStore();
  const { t } = useTranslation();

  const [activeSubNav, setActiveSubNav] = useState<SubNavTab>('profile');
  const [activeContentTab, setActiveContentTab] = useState<ContentSubTab>('about');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalInitialTab, setEditModalInitialTab] = useState<'visuals' | 'about' | 'info'>('visuals');
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
  const userAvatar = profile.avatarUrl || personal.avatarUrl || googleUser?.picture;
  const userBanner = profile.bannerUrl || personal.bannerUrl || 'linear-gradient(135deg, #1b6875 0%, #2ea2b0 35%, #1e7887 70%, #155561 100%)';
  const isBannerGradient = userBanner.startsWith('linear-gradient') || !userBanner;
  const bannerBackground = userBanner
    ? (isBannerGradient ? userBanner : `url("${userBanner}") center/cover no-repeat`)
    : 'linear-gradient(135deg, #1b6875 0%, #2ea2b0 35%, #1e7887 70%, #155561 100%)';

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
    <div className={`min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 transition-colors ${
      isDarkMode ? 'bg-[#0b0f19] text-white' : 'bg-[#FAF6F0] text-[#2B2725]'
    }`}>
      {/* Main Responsive Grid Layout */}
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
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

            {/* 4. Certifications */}
            <button
              onClick={() => setActiveSubNav('certifications')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeSubNav === 'certifications'
                  ? 'bg-rose-500/15 text-[#e11d48] font-black border border-rose-500/30 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeSubNav === 'certifications' ? 'bg-[#e11d48]' : 'bg-transparent'}`} />
              <Award size={16} className={activeSubNav === 'certifications' ? 'text-[#e11d48]' : 'text-slate-400'} />
              <span>Certifications</span>
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
            CENTER COLUMN: Main Banner & Sub-Tabs Content (6 / 12 cols)
           ======================================================== */}
        <div className={`${activeSubNav === 'profile' ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-9 xl:col-span-9'} space-y-6`}>
          {activeSubNav === 'profile' && (
            <>
              {/* Main Banner Header (Matching Screenshot Exactly) */}
              <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-colors ${
                isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
              }`}>
                {/* Polygonal Cyan Geometric or Custom Banner Texture */}
                <div
                  className="h-36 sm:h-44 relative overflow-hidden flex items-start justify-between p-4 transition-all duration-300 group"
                  style={{
                    background: bannerBackground
                  }}
                >
                  {/* Geometric Polygonal Overlay Grid if gradient */}
                  {isBannerGradient && (
                    <svg
                      className="absolute inset-0 w-full h-full opacity-35 mix-blend-overlay pointer-events-none"
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
                  )}

                  {/* Change Banner Action Button */}
                  <button
                    onClick={() => {
                      setEditModalInitialTab('visuals');
                      setIsEditModalOpen(true);
                    }}
                    className="relative z-10 px-3 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-md border border-white/20 text-slate-200 text-xs font-bold tracking-wide shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
                    title="Change Profile Banner"
                  >
                    <Camera size={13} />
                    <span>Edit Banner</span>
                  </button>

                  {/* Student Pill Badge (Upper Right) */}
                  <div className="relative z-10 px-3.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-slate-200 text-xs font-bold tracking-wide shadow-sm">
                    Student
                  </div>
                </div>

                {/* Overlapping Avatar & User Metadata */}
                <div className="px-6 pb-6 pt-0 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
                    {/* Circle Avatar with Cyan Gradient Ring & Camera Edit Badge */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#38bdf8] to-[#22d3ee] shadow-2xl shrink-0 group">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#161a26] border-2 border-white/40 flex items-center justify-center">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
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

                      {/* Direct Edit Avatar Badge Button */}
                      <button
                        onClick={() => {
                          setEditModalInitialTab('visuals');
                          setIsEditModalOpen(true);
                        }}
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#F06543] hover:bg-[#e05432] text-white border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                        title="Change Profile Picture"
                      >
                        <Camera size={14} />
                      </button>
                    </div>

                    {/* Red "Edit" Button (Matching Screenshot) */}
                    <button
                      onClick={() => {
                        setEditModalInitialTab('visuals');
                        setIsEditModalOpen(true);
                      }}
                      className="px-5 py-2 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-end"
                    >
                      <Edit size={14} />
                      <span>{t.profile.editProfile}</span>
                    </button>
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <h2 className={`font-display font-black text-xl sm:text-2xl ${isDarkMode ? 'text-slate-100' : 'text-slate-900'} tracking-wide uppercase`}>
                      {displayName}
                    </h2>
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
                    isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`font-display font-black text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                        About
                      </h3>
                      <button
                        onClick={() => {
                          setEditModalInitialTab('visuals');
                          setIsEditModalOpen(true);
                        }}
                        className="text-xs font-bold text-[#e11d48] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit size={13} /> Edit About
                      </button>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed whitespace-pre-line`}>
                      {personal.bio || 'There is currently no information about this member.'}
                    </p>
                  </div>

                  {/* Certifications Section (Matching Screenshot) */}
                  <CertificationsSection onViewAll={() => setActiveSubNav('certifications')} />
                </div>
              )}

              {/* TAB CONTENT: INFO (PERSONAL INFO) */}
              {activeContentTab === 'info' && (
                <div className={`p-6 rounded-3xl border space-y-5 transition-colors ${
                  isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-display font-black text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'} flex items-center gap-2`}>
                      <User size={18} className="text-[#e11d48]" /> Personal & Student Information
                    </h3>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-xs font-bold text-[#e11d48] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit size={13} /> Edit Info
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Student ID</span>
                      <span className="font-extrabold">{personal.studentId}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Year Level & Section</span>
                      <span className="font-extrabold">{personal.yearLevel}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Institutional Email</span>
                      <span className="font-extrabold text-sky-400">{personal.email}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Mobile Phone</span>
                      <span className="font-extrabold">{personal.phone}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Date of Birth</span>
                      <span className="font-extrabold">{personal.dateOfBirth}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Permanent Address</span>
                      <span className="font-extrabold">{personal.address}</span>
                    </div>
                  </div>

                  {personal.emergencyContact && (
                    <div className={`pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                      <h4 className="font-extrabold text-xs text-sky-400 mb-2">Emergency Contact</h4>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-medium`}>
                        {personal.emergencyContact.name} ({personal.emergencyContact.relationship}) —{' '}
                        <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{personal.emergencyContact.phone}</strong>
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
                  <h3 className={`font-display font-black text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'} flex items-center gap-2`}>
                    <BookOpen size={18} className="text-sky-400" /> Active Enrolled Courses
                  </h3>
                  <div className="space-y-3">
                    {enrolledCourses.map((course, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border space-y-2 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black text-[#F06543] uppercase tracking-wider">{course.code}</span>
                            <h4 className={`font-extrabold text-xs ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{course.name}</h4>
                            <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{course.instructor}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                            {course.status}
                          </span>
                        </div>
                        <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
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
                  <h3 className={`font-display font-black text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'} flex items-center gap-2`}>
                    <CheckCircle2 size={18} className="text-emerald-500" /> Completed Courses & Milestones
                  </h3>
                  <div className="space-y-3">
                    {completedCourses.map((course, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div>
                          <span className="text-[10px] font-black text-emerald-500 uppercase">{course.code}</span>
                          <h4 className={`font-extrabold text-xs ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{course.name}</h4>
                          <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Completed on: {course.date}</span>
                        </div>
                        <span className="text-xs font-black text-amber-500">{course.grade}</span>
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
                  <h3 className={`font-display font-black text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'} flex items-center gap-2`}>
                    <Users size={18} className="text-purple-400" /> Student Organizations & Groups
                  </h3>
                  <div className="space-y-3">
                    {groupsList.map((group, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div>
                          <span className="text-[10px] font-black text-purple-400 uppercase">{group.category}</span>
                          <h4 className={`font-extrabold text-xs ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{group.name}</h4>
                          <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{group.role} • {group.members} active members</span>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-purple-500/15 text-purple-400 text-[10px] font-black">
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

          {activeSubNav === 'certifications' && (
            <div className={`p-6 rounded-3xl border space-y-6 ${
              isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
            }`}>
              <CertificationsSection showAll={true} />
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
            <div className={`p-6 rounded-3xl border space-y-6 ${
              isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-display font-black text-lg flex items-center gap-2 ${
                    isDarkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    <ImageIcon size={20} className="text-amber-500" /> Profile Media & Gallery
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Manage your profile pictures, custom cover banners, and preset visual themes.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditModalInitialTab('visuals');
                    setIsEditModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F06543] to-[#ea580c] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Upload size={14} /> Upload Custom Files
                </button>
              </div>

              {/* Current Active Media Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-sky-500">Active Profile Picture</span>
                    <button
                      onClick={() => {
                        setEditModalInitialTab('visuals');
                        setIsEditModalOpen(true);
                      }}
                      className={`text-[10px] font-bold underline cursor-pointer ${
                        isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-sky-400/50 shadow-md bg-slate-950 flex items-center justify-center shrink-0">
                      {userAvatar ? (
                        <img src={userAvatar} alt="Active Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-sky-300">Default</span>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs truncate max-w-[180px] ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>{displayName}</h4>
                      <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Custom user picture
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-500">Active Cover Banner</span>
                    <button
                      onClick={() => {
                        setEditModalInitialTab('visuals');
                        setIsEditModalOpen(true);
                      }}
                      className={`text-[10px] font-bold underline cursor-pointer ${
                        isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Change
                    </button>
                  </div>
                  <div
                    className="h-14 rounded-xl border border-white/10 overflow-hidden relative shadow-sm"
                    style={{ background: bannerBackground }}
                  >
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-between px-3">
                      <span className="text-[10px] font-bold text-white drop-shadow-sm">Theme Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar Presets Gallery Grid */}
              <div className="space-y-3 pt-2">
                <span className={`text-xs font-black uppercase flex items-center gap-1.5 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Sparkles size={14} className="text-amber-500" /> Avatar Presets Gallery (Click to Apply)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => updatePersonalInfo({ avatarUrl: preset.url })}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                        profile.avatarUrl === preset.url
                          ? 'bg-[#F06543]/20 border-[#F06543] ring-1 ring-[#F06543]/50 shadow-sm'
                          : isDarkMode
                          ? 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:scale-[1.02]'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-400 hover:scale-[1.02]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-950">
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left overflow-hidden">
                        <h4 className={`font-bold text-xs truncate ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>{preset.name}</h4>
                        <span className={`text-[10px] ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>{preset.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Banner Presets Gallery Grid */}
              <div className="space-y-3 pt-2">
                <span className={`text-xs font-black uppercase flex items-center gap-1.5 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Palette size={14} className="text-sky-500" /> Banner Theme Presets (Click to Apply)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BANNER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => updatePersonalInfo({ bannerUrl: preset.gradient })}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer relative overflow-hidden ${
                        profile.bannerUrl === preset.gradient
                          ? 'border-sky-400 ring-2 ring-sky-400/50 shadow-md scale-[1.02]'
                          : 'border-slate-800 hover:border-slate-600 hover:scale-[1.02]'
                      }`}
                      style={{ background: preset.gradient }}
                    >
                      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="text-[9px] font-black uppercase text-white/90 bg-black/40 px-2 py-0.5 rounded-full">
                          {preset.category}
                        </span>
                        {profile.bannerUrl === preset.gradient && (
                          <span className="w-4 h-4 rounded-full bg-white text-sky-600 flex items-center justify-center shadow-xs">
                            <CheckCircle2 size={12} />
                          </span>
                        )}
                      </div>
                      <span className="relative z-10 text-[11px] font-black text-white drop-shadow-md truncate">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
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
            RIGHT COLUMN: Account Widget (3 / 12 cols)
           ======================================================== */}
        {activeSubNav === 'profile' && (
          <div className="lg:col-span-3 xl:col-span-3 space-y-6">
            {/* Account Card */}
            <div className={`p-5 rounded-3xl border shadow-xl space-y-4 transition-colors ${
              isDarkMode ? 'bg-[#0f1422] border-[#1d273d]' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-[#e11d48] font-black text-xs">
                <User size={16} />
                <span>Account</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Joined */}
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Calendar size={14} className="text-slate-500" />
                  <span className="text-[11px]">Joined <strong className={`ml-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{personal.joinedDate}</strong></span>
                </div>

                {/* Last Activity */}
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Clock size={14} className="text-slate-500" />
                  <span className="text-[11px]">Last activity <strong className={`ml-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{personal.lastActivity}</strong></span>
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
                  className={`w-full flex items-center gap-2 ${isDarkMode ? 'text-slate-400 hover:text-rose-400' : 'text-slate-600 hover:text-rose-600'} font-semibold text-xs transition-colors cursor-pointer text-left`}
                >
                  <LogOut size={14} />
                  <span>Force logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTab={editModalInitialTab}
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
