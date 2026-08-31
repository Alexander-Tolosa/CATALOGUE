import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Shield,
  Star,
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
  MessageSquare,
  UserPlus
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
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
  | 'friends';

type ContentSubTab = 'about' | 'info' | 'enrolled' | 'completed';

export const ProfilePageView: React.FC = () => {
  const { profile, isDarkMode, selectLanguageTrack } = useAppStore();
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
    bio: 'Tell us a bit about you',
    joinedDate: 'Jun 24, 2021',
    lastActivity: '3 hours ago'
  };

  const displayName = profile.name || personal.fullName || googleUser?.name || 'lexzunder';
  const userAvatar = profile.avatarUrl || personal.avatarUrl || googleUser?.picture;
  const userBanner = profile.bannerUrl || personal.bannerUrl || 'linear-gradient(135deg, #101c36 0%, #1a294d 50%, #0d1629 100%)';
  const isBannerGradient = userBanner.startsWith('linear-gradient') || !userBanner;
  const bannerBackground = userBanner
    ? (isBannerGradient ? userBanner : `url("${userBanner}") center/cover no-repeat`)
    : 'linear-gradient(135deg, #101c36 0%, #1a294d 50%, #0d1629 100%)';

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

  return (
    <div className={`min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 transition-colors ${
      isDarkMode ? 'bg-[#0b0f19] text-white' : 'bg-[#FAF6F0] text-[#2B2725]'
    }`}>
      {/* Main Responsive Grid Layout */}
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN: Sub-navigation Sidebar (3 / 12 cols)
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

            {/* 5. Friends (Direct Switch to Friends Hub) */}
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
            CENTER COLUMN: Main Discord-Style Profile Card & Sub-Tabs Content (6 / 12 cols)
           ======================================================== */}
        <div className={`${activeSubNav === 'profile' ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-9 xl:col-span-9'} space-y-6`}>
          {activeSubNav === 'profile' && (
            <>
              {/* Main Discord-Inspired Profile Card */}
              <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-colors ${
                isDarkMode ? 'bg-[#111624] border-[#1f293d]' : 'bg-white border-slate-200'
              }`}>
                {/* 1. Header Banner */}
                <div
                  className="h-44 sm:h-52 relative overflow-hidden transition-all duration-300 group"
                  style={{
                    background: bannerBackground
                  }}
                >
                  <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                </div>

                {/* 2. Overlapping Avatar & User Identification */}
                <div className="px-6 pb-6 pt-0 relative">
                  <div className="flex items-end justify-between gap-3 -mt-16 sm:-mt-20 mb-4">
                    {/* Circle Avatar with Cyan Gradient Ring & Online Indicator Dot */}
                    <div className="relative shrink-0">
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#38bdf8] via-[#22d3ee] to-[#0ea5e9] shadow-2xl group">
                        <div className="w-full h-full rounded-full overflow-hidden bg-[#161a26] border-2 border-white/40 flex items-center justify-center">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt={displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              viewBox="0 0 100 100"
                              className="w-full h-full object-cover"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="50" cy="50" r="50" fill="#38BDF8" />
                              <path d="M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z" fill="#10B981" />
                              <rect x="44" y="52" width="12" height="18" fill="#8D5B4C" />
                              <ellipse cx="50" cy="46" rx="16" ry="18" fill="#8D5B4C" />
                              <path d="M 44 54 Q 50 60 56 54" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                              <path d="M 33 42 C 33 28 42 22 50 22 C 58 22 67 28 67 42 C 67 33 60 28 50 28 C 40 28 33 33 33 42 Z" fill="#1F2937" />
                            </svg>
                          )}
                        </div>
                      </div>
                      {/* Green Online Status Dot */}
                      <span className={`absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-emerald-500 border-4 shadow-md ${
                        isDarkMode ? 'border-[#111624]' : 'border-white'
                      }`} />
                    </div>

                    {/* Edit Profile Button */}
                    <button
                      onClick={() => {
                        setEditModalInitialTab('visuals');
                        setIsEditModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-102 self-start sm:self-end"
                    >
                      <Edit size={14} /> Edit Profile
                    </button>
                  </div>

                  {/* Display Name */}
                  <div className="space-y-1">
                    <h2 className={`font-display font-black text-2xl sm:text-3xl ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-wide uppercase`}>
                      {displayName}
                    </h2>
                  </div>

                  {/* Details: Bio & Member Since */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-4 text-left">
                    {/* Bio */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                        Bio
                      </span>
                      <p className={`text-xs italic leading-relaxed whitespace-pre-line ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {personal.bio || 'Tell us a bit about you'}
                      </p>
                    </div>

                    {/* Member Since */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                        Member Since
                      </span>
                      <p className={`text-xs font-bold ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        {personal.joinedDate || 'Jun 24, 2021'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs: [Awards & Badges] [Academic Info] [Enrolled Courses] [Completed Courses] */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {(
                  [
                    { id: 'about', label: 'Awards & Badges' },
                    { id: 'info', label: 'Academic Info' },
                    { id: 'enrolled', label: 'Enrolled Courses' },
                    { id: 'completed', label: 'Completed' }
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

              {/* TAB CONTENT: AWARDS & BADGES */}
              {activeContentTab === 'about' && (
                <div className="space-y-6">
                  {/* Certifications Section */}
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
                          <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{course.date}</span>
                        </div>
                        <span className="text-xs font-black text-amber-500">{course.grade}</span>
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

      {/* Add Connection Modal */}
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
