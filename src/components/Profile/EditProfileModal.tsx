import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Check,
  User,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Camera,
  RotateCcw,
  Palette,
  Eye,
  FileText
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AVATAR_PRESETS, BANNER_PRESETS } from '../../lib/profilePresets';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'visuals' | 'about' | 'info';
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'visuals'
}) => {
  const { profile, isDarkMode, updatePersonalInfo } = useAppStore();

  const [activeTab, setActiveTab] = useState<'visuals' | 'about' | 'info'>(initialTab);

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

  const [displayName, setDisplayName] = useState(profile.name || personal.fullName || 'ALEXANDER MICHAEL TOLOSA');
  const [avatarUrl, setAvatarUrl] = useState<string>(profile.avatarUrl || personal.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState<string>(profile.bannerUrl || personal.bannerUrl || '');
  const [bio, setBio] = useState<string>(personal.bio || 'Tell us a bit about you');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setDisplayName(profile.name || personal.fullName || 'ALEXANDER MICHAEL TOLOSA');
      setAvatarUrl(profile.avatarUrl || personal.avatarUrl || '');
      setBannerUrl(profile.bannerUrl || personal.bannerUrl || '');
      setBio(personal.bio || 'Tell us a bit about you');
    }
  }, [isOpen, initialTab, profile.name, profile.avatarUrl, profile.bannerUrl, personal.bio]);

  const [formData, setFormData] = useState({
    fullName: personal.fullName || profile.name,
    studentId: personal.studentId,
    department: personal.department,
    program: personal.program,
    yearLevel: personal.yearLevel,
    email: personal.email,
    phone: personal.phone,
    dateOfBirth: personal.dateOfBirth,
    address: personal.address,
    emergencyName: personal.emergencyContact?.name || '',
    emergencyRelationship: personal.emergencyContact?.relationship || '',
    emergencyPhone: personal.emergencyContact?.phone || ''
  });

  const [savedToast, setSavedToast] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle avatar file upload from disk
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle banner file upload from disk
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setBannerUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = displayName.trim() || formData.fullName.trim() || 'Learner';

    updatePersonalInfo({
      name: finalName,
      fullName: formData.fullName.trim() || finalName,
      avatarUrl: avatarUrl || undefined,
      bannerUrl: bannerUrl || undefined,
      bio: bio.trim() || 'Tell us a bit about you',
      studentId: formData.studentId,
      department: formData.department,
      program: formData.program,
      yearLevel: formData.yearLevel,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      emergencyContact: {
        name: formData.emergencyName,
        relationship: formData.emergencyRelationship,
        phone: formData.emergencyPhone
      }
    });

    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 700);
  };

  // Compute banner style for live preview
  const isBannerGradient = bannerUrl.startsWith('linear-gradient') || !bannerUrl;
  const bannerBackground = bannerUrl
    ? (isBannerGradient ? bannerUrl : `url("${bannerUrl}") center/cover no-repeat`)
    : 'linear-gradient(135deg, #101c36 0%, #1a294d 50%, #0d1629 100%)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-fadeIn select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        className={`w-full max-w-3xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isDarkMode ? 'bg-[#0e1322] border-[#222d46] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700/40 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#F06543] to-[#ff845e] text-white flex items-center justify-center shadow-md">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                <span>Edit Profile</span>
              </h3>
              <p className="text-[11px] text-slate-400">Customize your profile picture, banner, display name, and about bio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Single "Profile" Tab Label */}
        <div className="px-5 pt-3 border-b border-slate-700/30 flex items-center gap-2 bg-slate-950/20">
          <div className="pb-2.5 px-3.5 text-xs font-black tracking-wide border-b-2 border-[#F06543] text-[#F06543] flex items-center gap-1.5">
            <User size={15} />
            <span>Profile</span>
          </div>
        </div>

        {/* Real-time Interactive Profile Header Preview */}
        <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye size={13} className="text-sky-400" /> Live Profile Card Preview
            </span>
            <span className="text-[10px] font-bold text-emerald-400">Updates in real-time</span>
          </div>

          <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#111624] relative text-left">
            {/* Banner Preview Area */}
            <div
              className="h-28 sm:h-32 relative overflow-hidden transition-all duration-300"
              style={{ background: bannerBackground }}
            >
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>

            {/* Overlapping Avatar & Display Name */}
            <div className="px-5 pb-5 pt-0 relative">
              <div className="flex items-end justify-between gap-3 -mt-12 sm:-mt-14 mb-3">
                {/* Avatar with Ring & Green Online Status Dot */}
                <div className="relative shrink-0">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-[#38bdf8] via-[#22d3ee] to-[#0ea5e9] shadow-2xl">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#161a26] border-2 border-white/50 flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Preview Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <svg viewBox="0 0 100 100" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  {/* Green Online Dot */}
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-3 border-[#111624] shadow-sm" />
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-1">
                <h4 className="font-display font-black text-lg sm:text-xl text-white tracking-wide uppercase">
                  {displayName || 'ALEXANDER MICHAEL TOLOSA'}
                </h4>
              </div>

              {/* Detail Fields: Bio & Member Since */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3 text-left">
                {/* Bio */}
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider mb-0.5">Bio</span>
                  <p className="text-xs text-slate-300 italic whitespace-pre-line">
                    {bio || 'Tell us a bit about you'}
                  </p>
                </div>

                {/* Member Since */}
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider mb-0.5">Member Since</span>
                  <p className="text-xs font-bold text-slate-200">{personal.joinedDate || 'Jun 24, 2021'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs no-scrollbar">
          {/* Section 1: Display Name */}
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${
            isDarkMode ? 'bg-[#121829] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className={`font-black text-xs uppercase tracking-wider block ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. ALEXANDER MICHAEL TOLOSA"
              required
              className={`w-full px-4 py-2.5 rounded-xl border font-bold text-xs outline-none transition-all ${
                isDarkMode ? 'bg-[#161f33] border-slate-700 text-white focus:border-[#F06543]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#F06543]'
              }`}
            />
          </div>

          {/* Section 2: About Me / Bio */}
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
            isDarkMode ? 'bg-[#121829] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#e11d48]" />
                <label className={`font-black text-xs uppercase tracking-wider block ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  About Me / Bio
                </label>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {bio.length} characters
              </span>
            </div>

            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share a short bio, your language goals, or background story..."
              className={`w-full p-4 rounded-xl border font-sans text-xs leading-relaxed outline-none transition-all resize-none ${
                isDarkMode ? 'bg-[#161f33] border-slate-700 text-white focus:border-[#e11d48]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#e11d48]'
              }`}
            />
          </div>

          {/* Section 3: Profile Picture (Avatar) */}
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-[#121829] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-[#F06543]" />
                <h4 className={`font-black text-xs uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Profile Picture</h4>
              </div>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="text-[11px] font-bold text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} /> Reset to Default
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Avatar Preview Thumbnail */}
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#38bdf8] to-[#22d3ee] shrink-0 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#161a26] border border-white/40 flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Current" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-sky-300">Default</span>
                  )}
                </div>
              </div>

              {/* Actions: Upload File */}
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="file"
                  ref={avatarFileInputRef}
                  onChange={handleAvatarFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F06543] to-[#ea580c] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Upload size={14} /> Upload from Files
                  </button>
                  <span className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP, SVG (Max 5MB)</span>
                </div>
              </div>
            </div>

            {/* Avatar Gallery Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-700/30">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Sparkles size={13} className="text-amber-400" /> Or Choose from Avatar Gallery Presets:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className={`p-1.5 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F06543]/20 border-[#F06543] ring-2 ring-[#F06543]/40 shadow-sm scale-105'
                          : isDarkMode
                          ? 'bg-[#0f1422] border-slate-800 hover:border-slate-600 hover:scale-102'
                          : 'bg-white border-slate-200 hover:border-slate-400 hover:scale-102'
                      }`}
                      title={preset.name}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-xs bg-slate-900">
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] font-bold truncate max-w-full text-center">
                        {preset.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Profile Cover Banner */}
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-[#121829] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-sky-400" />
                <h4 className={`font-black text-xs uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Profile Cover Banner</h4>
              </div>
              {bannerUrl && (
                <button
                  type="button"
                  onClick={() => setBannerUrl('')}
                  className="text-[11px] font-bold text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} /> Reset to Default
                </button>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                ref={bannerFileInputRef}
                onChange={handleBannerFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => bannerFileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Upload size={14} /> Upload Banner Image / Photo
              </button>
              <span className="text-[11px] text-slate-400">Supports high-res widescreen photos & wallpapers (Max 8MB)</span>
            </div>

            {/* Banner Gallery Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-700/30">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Sparkles size={13} className="text-amber-400" /> Or Choose from Theme Banner Presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {BANNER_PRESETS.map((preset) => {
                  const isSelected = bannerUrl === preset.gradient;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setBannerUrl(preset.gradient)}
                      className={`p-2 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer overflow-hidden relative ${
                        isSelected
                          ? 'border-sky-400 ring-2 ring-sky-400/50 shadow-md scale-[1.02]'
                          : isDarkMode
                          ? 'border-slate-800 hover:border-slate-600 hover:scale-[1.01]'
                          : 'border-slate-200 hover:border-slate-400 hover:scale-[1.01]'
                      }`}
                      style={{ background: preset.gradient }}
                    >
                      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="text-[9px] font-black uppercase text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                          {preset.category}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-white text-sky-600 flex items-center justify-center shadow-xs">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <span className="relative z-10 text-[11px] font-black text-white drop-shadow-md truncate">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Save & Cancel Buttons */}
          <div className="pt-4 border-t border-slate-700/40 flex items-center justify-between gap-3 sticky bottom-0 bg-[#0e1322]/95 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:brightness-110 text-white text-xs font-extrabold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              {savedToast ? (
                <>
                  <Check size={16} /> Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
