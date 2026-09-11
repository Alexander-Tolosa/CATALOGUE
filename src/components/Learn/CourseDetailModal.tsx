import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  ExternalLink,
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Building2,
  FileText
} from 'lucide-react';
import { OnlineCourse } from '../../types/proficiency';

interface CourseDetailModalProps {
  course: OnlineCourse;
  onClose: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose
}) => {
  const getLangFlag = (code: string) => {
    switch (code.toLowerCase()) {
      case 'ko':
        return '🇰🇷';
      case 'ja':
        return '🇯🇵';
      case 'en':
      default:
        return '🇬🇧';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-3xl bg-[#0b0f19] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-[#0f1523] flex items-start justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                <span>{getLangFlag(course.languageCode)}</span>
                <span>Level {course.levelCode} • {course.levelName}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                {course.courseType}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 leading-snug">
              {course.title}
            </h2>
            <p className="text-xs text-sky-400 font-bold flex items-center gap-1.5 pt-0.5">
              <Building2 size={13} />
              <span>{course.provider}</span>
              {course.instructor && (
                <>
                  <span className="text-slate-600">•</span>
                  <UserCheck size={13} />
                  <span>{course.instructor}</span>
                </>
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400">
                <Star size={14} className="fill-amber-400" />
                <span className="text-sm font-black">{course.rating.toFixed(1)}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase">
                {course.reviewCount.toLocaleString()} Reviews
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-sky-400">
                <Clock size={14} />
                <span className="text-sm font-black">{course.duration.split(' ')[0]} {course.duration.split(' ')[1]}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase">Estimated Duration</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400">
                <Award size={14} />
                <span className="text-sm font-black">Accredited</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase">Standard Curriculum</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-indigo-400">
                <ShieldCheck size={14} />
                <span className="text-sm font-black">Verified</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase">Anti-Plagiarism Credit</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen size={14} className="text-sky-400" />
              <span>Course Overview & Academic Scope</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
              {course.description}
            </p>
          </div>

          {/* Key Learning Objectives */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Key Proficiency Competencies</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.learningPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus Modules */}
          {course.syllabus && course.syllabus.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText size={14} className="text-sky-400" />
                <span>Curriculum Modules & Syllabus ({course.syllabus.length})</span>
              </h3>
              <div className="space-y-2.5">
                {course.syllabus.map((module, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">
                        {module.weekOrUnit}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {module.topics.length} Key Topics
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {module.title}
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {module.topics.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-[11px] text-slate-300 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Credibility & Anti-Plagiarism Attribution Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#0f172a] to-[#0a101d] border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 block">
                  Plagiarism Prevention & Intellectual Property Protection
                </span>
                <h4 className="text-xs sm:text-sm font-black text-white">
                  Original Authorship & Licensing Statement
                </h4>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {course.attributionStatement}
            </p>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1 text-slate-400">
              <div>
                <strong className="text-slate-300">Originating Institution:</strong> {course.institution}
              </div>
              <div>
                <strong className="text-slate-300">Licensing:</strong> {course.license}
              </div>
              <div>
                <strong className="text-slate-300">Canonical Link:</strong>{' '}
                <a
                  href={course.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 underline break-all hover:text-sky-300"
                >
                  {course.sourceUrl}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with External Link CTA */}
        <div className="p-5 border-t border-slate-800 bg-[#0f1523] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 text-center sm:text-left">
            Launches official course page on {course.provider.split(' ')[0]}.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Back
            </button>
            <a
              href={course.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 hover:scale-102 transition-all cursor-pointer"
            >
              <span>Open Official Course</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
