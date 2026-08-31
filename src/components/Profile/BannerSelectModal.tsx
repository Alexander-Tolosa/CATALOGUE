import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Sparkles, Upload, RotateCcw, Check } from 'lucide-react';
import { BANNER_PRESETS } from '../../lib/profilePresets';

interface BannerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBanner?: string;
  onSelectBanner: (bannerUrl: string) => void;
  isDarkMode?: boolean;
}

export const BannerSelectModal: React.FC<BannerSelectModalProps> = ({
  isOpen,
  onClose,
  currentBanner,
  onSelectBanner,
  isDarkMode = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        onSelectBanner(result);
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
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
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

        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <ImageIcon size={18} />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-slate-100">
                Change Profile Banner
              </h3>
              <p className="text-[11px] text-slate-400">Upload a custom cover image or choose a theme preset</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Upload Button Box */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-rose-600/30 hover:from-sky-600/40 hover:via-indigo-600/40 hover:to-rose-600/40 border border-white/10 hover:border-white/25 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Upload size={20} className="text-sky-400" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-sm text-white block">
                Upload from Gallery or Files
              </span>
              <span className="text-[11px] text-slate-400">
                Supports JPG, PNG, GIF, WebP (up to 8MB)
              </span>
            </div>
          </button>

          {/* Theme Preset Gradients */}
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" /> Signature Banner Presets
            </span>
            <div className="grid grid-cols-2 gap-3">
              {BANNER_PRESETS.map((preset) => {
                const isSelected = currentBanner === preset.gradient;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectBanner(preset.gradient);
                      onClose();
                    }}
                    className={`h-20 rounded-2xl relative overflow-hidden border-2 transition-all cursor-pointer group hover:scale-102 shadow-md ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/50'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ background: preset.gradient }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white drop-shadow-md truncate">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset / Remove Banner Button */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
            <button
              onClick={() => {
                onSelectBanner('linear-gradient(135deg, #101c36 0%, #1a294d 50%, #0d1629 100%)');
                onClose();
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
            >
              <RotateCcw size={13} /> Reset to Default Dark Banner
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
