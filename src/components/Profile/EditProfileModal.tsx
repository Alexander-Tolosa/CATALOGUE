import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, User, Mail, Phone, BookOpen, GraduationCap, MapPin, Calendar, HeartHandshake } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, isDarkMode, updatePersonalInfo } = useAppStore();

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

  const [formData, setFormData] = useState({
    fullName: personal.fullName,
    studentId: personal.studentId,
    department: personal.department,
    program: personal.program,
    yearLevel: personal.yearLevel,
    email: personal.email,
    phone: personal.phone,
    dateOfBirth: personal.dateOfBirth,
    address: personal.address,
    bio: personal.bio,
    emergencyName: personal.emergencyContact?.name || '',
    emergencyRelationship: personal.emergencyContact?.relationship || '',
    emergencyPhone: personal.emergencyContact?.phone || ''
  });

  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalInfo({
      name: formData.fullName,
      fullName: formData.fullName,
      studentId: formData.studentId,
      department: formData.department,
      program: formData.program,
      yearLevel: formData.yearLevel,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      bio: formData.bio,
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
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-2xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
          isDarkMode ? 'bg-[#0f1422] border-[#222d46] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-700/40 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F06543]/20 text-[#F06543] flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100">Edit Member Profile & Personal Info</h3>
              <p className="text-[11px] text-slate-400">Update your student information and profile bio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Full Name & Student ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Full Student Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Student ID Number</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>

          {/* Department & Program */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-300 block mb-1">College / Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Degree Program</label>
              <input
                type="text"
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Institutional Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Mobile Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>

          {/* Bio / About */}
          <div>
            <label className="font-bold text-slate-300 block mb-1">About / Member Biography</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className={`w-full px-3.5 py-2.5 rounded-xl border outline-none resize-none ${
                isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          {/* Emergency Contact */}
          <div className="pt-2 border-t border-slate-800/60">
            <h4 className="font-extrabold text-xs text-sky-400 mb-2 flex items-center gap-1.5">
              <HeartHandshake size={14} /> Emergency Guardian Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Contact Person</label>
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Relationship</label>
                <input
                  type="text"
                  value={formData.emergencyRelationship}
                  onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-700/40 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Check size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
