import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Sparkles, Upload, Check } from 'lucide-react';
import { AVATAR_PRESETS } from '../../lib/profilePresets';

interface AvatarSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  recentAvatars: string[];
  onSelectAvatar: (avatarUrl: string) => void;
  isDarkMode?: boolean;
}

export const AvatarSelectModal: React.FC<AvatarSelectModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  recentAvatars,
  onSelectAvatar,
  isDarkMode = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPresets, setShowPresets] = useState(false);

  if (!isOpen) return null;

  // Ensure we always have 6 recent avatars to display (fallback to presets if fewer than 6)
  const defaultFallbacks = AVATAR_PRESETS.map((p) => p.url);
  const displayRecent = [
    ...recentAvatars,
    ...defaultFallbacks.filter((url) => !recentAvatars.includes(url))
  ].slice(0, 6);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        onSelectAvatar(result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn select-none">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
          isDarkMode ? 'bg-[#181f33] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h3 className="font-display font-black text-lg text-slate-100">
            Select an Image
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Top Options: Upload Image & Choose Preset */}
          <div className="grid grid-cols-2 gap-3">
            {/* Upload Image Card */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl bg-[#232c45] hover:bg-[#2b3755] border border-white/5 hover:border-white/15 transition-all cursor-pointer group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:scale-110 transition-all shadow-inner">
                <ImageIcon size={20} />
              </div>
              <span className="font-bold text-xs text-slate-200 group-hover:text-white">
                Upload Image
              </span>
            </button>

            {/* Choose Preset Card */}
            <button
              onClick={() => setShowPresets(!showPresets)}
              className={`flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl border transition-all cursor-pointer group shadow-md ${
                showPresets
                  ? 'bg-indigo-600/30 border-indigo-500/50 text-white'
                  : 'bg-[#232c45] hover:bg-[#2b3755] border-white/5 hover:border-white/15 text-slate-200'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:scale-110 transition-all shadow-inner">
                <Sparkles size={20} className="text-amber-400" />
              </div>
              <span className="font-bold text-xs">
                {showPresets ? 'Hide Presets' : 'Choose Preset'}
              </span>
            </button>
          </div>

          {/* Preset Gallery if toggled */}
          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  Preset Avatars
                </span>
                <div className="grid grid-cols-4 gap-2.5 max-h-40 overflow-y-auto no-scrollbar p-1">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectAvatar(preset.url);
                        onClose();
                      }}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group hover:scale-105 ${
                        currentAvatar === preset.url
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                          : 'border-white/10 hover:border-white/40'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Avatars Section (Pic 3 Reference) */}
          <div className="space-y-3">
            <div>
              <h4 className="font-black text-sm text-slate-100">
                Recent Avatars
              </h4>
              <p className="text-xs text-slate-400">
                Access your 6 most recent avatar uploads.
              </p>
            </div>

            {/* 6 Avatar Circular Thumbnails */}
            <div className="flex items-center justify-between gap-2 pt-1">
              {displayRecent.map((url, idx) => {
                const isSelected = currentAvatar === url;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectAvatar(url);
                      onClose();
                    }}
                    className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer group hover:scale-110 shadow-lg ${
                      isSelected
                        ? 'border-emerald-500 ring-3 ring-emerald-500/50 scale-105'
                        : 'border-slate-700/80 hover:border-slate-400 bg-slate-900'
                    }`}
                    title={`Recent Avatar #${idx + 1}`}
                  >
                    <img src={url} alt={`Recent ${idx + 1}`} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                        <Check size={14} className="text-emerald-400 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra Info Banner / Nitro Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Supported formats: <strong className="text-slate-200">JPG, PNG, GIF, WebP</strong>
            </span>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
              Instant Sync
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
