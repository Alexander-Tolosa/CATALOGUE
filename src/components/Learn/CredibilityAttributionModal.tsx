import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Search,
  CheckCircle2,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { CITATIONS_LEDGER } from '../../data/proficiencyCoursesData';
import { LanguageCitationsSummary } from '../../types/proficiency';

interface CredibilityAttributionModalProps {
  onClose: () => void;
  initialLanguage?: string;
}

export const CredibilityAttributionModal: React.FC<CredibilityAttributionModalProps> = ({
  onClose,
  initialLanguage = 'all'
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCitations = CITATIONS_LEDGER.filter((citation) => {
    const matchesLang =
      selectedLanguage === 'all' || citation.language.toLowerCase() === selectedLanguage.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      citation.ownerName.toLowerCase().includes(query) ||
      citation.institution.toLowerCase().includes(query) ||
      citation.platform.toLowerCase().includes(query) ||
      citation.courseTitles.some((t) => t.toLowerCase().includes(query));
    return matchesLang && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-[#0b0f19] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-[#0f1523] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Academic Honesty & Integrity
                </span>
                <span className="text-[10px] font-bold text-slate-400">Zero Plagiarism Policy</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Academic Credibility & Citations Ledger
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Anti-Plagiarism Policy Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-950/40 via-[#0f172a] to-emerald-950/30 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Info size={20} className="text-sky-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Plagiarism-Free Standard:</strong> CATALOGUE adheres to international academic fair use and open reference guidelines. All accredited online courses, curriculum frameworks, and external syllabi are explicitly attributed to their original universities, broadcasting authorities, and creators with direct verification links.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="p-5 border-b border-slate-800 bg-[#0d121f] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Language Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {[
              { id: 'all', label: 'All Languages' },
              { id: 'ko', label: '🇰🇷 Korean' },
              { id: 'ja', label: '🇯🇵 Japanese' },
              { id: 'en', label: '🇬🇧 English' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedLanguage(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedLanguage === tab.id
                    ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search university, author, course..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Citations List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
            <span>
              Showing {filteredCitations.length} Credited Institution{filteredCitations.length === 1 ? '' : 's'}
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>100% Verified Authorship</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCitations.map((citation, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-sky-400 block">
                        {citation.language === 'ko'
                          ? '🇰🇷 Korean TOPIK'
                          : citation.language === 'ja'
                          ? '🇯🇵 Japanese JLPT'
                          : '🇬🇧 English CEFR'}
                        {' • Levels: '}
                        {citation.levelCodes.join(', ')}
                      </span>
                      <h3 className="text-sm font-black text-white mt-0.5">
                        {citation.ownerName}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {citation.institution}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 shrink-0">
                      {citation.platform.split(' ')[0]}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      Indexed Courses:
                    </span>
                    <ul className="mt-1 space-y-1">
                      {citation.courseTitles.map((title, tIdx) => (
                        <li
                          key={tIdx}
                          className="text-xs text-slate-200 font-semibold flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                          <span>{title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-300 space-y-1">
                    <div className="font-bold text-amber-300/90 text-[10px] uppercase tracking-wide">
                      License & Fair-Use:
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      {citation.license}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-snug italic pt-0.5">
                      "{citation.plagiarismDisclosure}"
                    </p>
                  </div>
                </div>

                <a
                  href={citation.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
                >
                  <span>Visit Official Source</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>

          {filteredCitations.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-xs space-y-2">
              <BookOpen size={32} className="mx-auto text-slate-600" />
              <p className="font-bold">No citations found matching your filter.</p>
              <p className="text-slate-500">Try adjusting your search keywords or language selector.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0d121f] flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px]">
            CATALOGUE Academic Honesty Guarantee • All rights reserved to their respective creators.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
