import React from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="glass-card w-full max-w-md p-6 rounded-3xl border border-[#ffb4ab]/30 shadow-2xl space-y-6 text-center relative overflow-hidden bg-[#090e1c]/95">
        {/* Top Glow Backdrop */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#93000a]/20 blur-3xl rounded-full pointer-events-none" />

        {/* Icon & Title */}
        <div className="space-y-3 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#93000a]/30 border border-[#ffb4ab]/40 flex items-center justify-center text-[#ffb4ab] shadow-inner">
            <span className="material-symbols-outlined text-3xl">logout</span>
          </div>

          <h3 className="font-display font-extrabold text-2xl text-white">Log Out of CATalouge?</h3>
          <p className="text-xs text-[#bacac9] leading-relaxed max-w-xs mx-auto">
            Are you sure you want to end your active study session? Your streak and daily progress remain safely saved.
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-[#161b2b] border border-white/10 hover:bg-[#25293a] text-[#bacac9] font-bold text-xs transition-all active:scale-95"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="py-3 px-4 rounded-xl bg-[#93000a] border border-[#ffb4ab]/40 hover:bg-[#690005] text-[#ffb4ab] font-black text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Confirm Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
