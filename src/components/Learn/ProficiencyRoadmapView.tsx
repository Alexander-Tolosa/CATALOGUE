import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  BookOpen,
  ShieldCheck,
  Download,
  ExternalLink,
  GraduationCap,
  Star,
  Search,
  Building2
} from 'lucide-react';
import { Language, ProficiencyLevel, OnlineCourse } from '../../types/proficiency';
import { CourseDetailModal } from './CourseDetailModal';
import { CredibilityAttributionModal } from './CredibilityAttributionModal';
import { FlagIcon } from '../Common/FlagIcon';
import { useAppStore } from '../../store/useAppStore';
import {
  getCoursesForLanguage,
  getCoursesForLevel,
  FALLBACK_LEVELS_BY_LANG
} from '../../data/proficiencyCoursesData';

interface ProficiencyRoadmapViewProps {
  initialLanguage?: string;
}

export const ProficiencyRoadmapView: React.FC<ProficiencyRoadmapViewProps> = ({
  initialLanguage
}) => {
  const { profile, selectLanguageTrack } = useAppStore();
  const currentLangCode = profile.selectedLanguage || initialLanguage || 'ko';

  const [languages, setLanguages] = useState<Language[]>([]);
  const [levels, setLevels] = useState<ProficiencyLevel[]>([]);
  const [loading, setLoading] = useState(true);

  // Course Directory Filter State
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [courseSearchQuery, setCourseSearchQuery] = useState('');

  // Modals
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<OnlineCourse | null>(null);
  const [isCredibilityModalOpen, setIsCredibilityModalOpen] = useState(false);

  // Fetch languages list
  useEffect(() => {
    async function loadLanguages() {
      try {
        const res = await fetch('/api/languages');
        const data = await res.json();
        if (data.languages) {
          setLanguages(data.languages);
          return;
        }
      } catch (err) {
        console.warn('API fetch languages failed, using local standard languages:', err);
      }
      setLanguages([
        { id: 'lang-ko', name: 'Korean', code: 'ko' },
        { id: 'lang-ja', name: 'Japanese', code: 'ja' },
        { id: 'lang-en', name: 'English', code: 'en' }
      ]);
    }
    loadLanguages();
  }, []);

  // Fetch levels with user progress for selected language
  const fetchLevels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/languages/${currentLangCode}/levels?userId=usr-1`);
      const data = await res.json();
      if (data.levels && data.levels.length > 0) {
        // Ensure courses are populated on each level
        const enrichedLevels = data.levels.map((lvl: ProficiencyLevel) => ({
          ...lvl,
          courses: lvl.courses && lvl.courses.length > 0 ? lvl.courses : getCoursesForLevel(lvl.id),
          courseCount: lvl.courses?.length || getCoursesForLevel(lvl.id).length
        }));
        setLevels(enrichedLevels);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('API fetch levels failed, loading local rich fallback:', err);
    }

    // High quality local fallback with courses populated
    const fallbackList = FALLBACK_LEVELS_BY_LANG[currentLangCode] || FALLBACK_LEVELS_BY_LANG.ko;
    setLevels(fallbackList);
    setLoading(false);
  }, [currentLangCode]);

  useEffect(() => {
    fetchLevels();
    setSelectedLevelFilter('all');
  }, [fetchLevels]);

  const passedCount = levels.filter((l) => l.status === 'passed').length;
  const progressPercent = levels.length > 0 ? Math.round((passedCount / levels.length) * 100) : 0;

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'ko':
        return { name: 'Korean', standard: 'TOPIK Standard (Level 1–6)', flagCode: 'kr' as const };
      case 'ja':
        return { name: 'Japanese', standard: 'JLPT Standard (N5–N1)', flagCode: 'jp' as const };
      case 'en':
      default:
        return { name: 'English', standard: 'CEFR Standard (A1–C2)', flagCode: 'gb' as const };
    }
  };

  const currentInfo = getLanguageLabel(currentLangCode);

  // Filtered courses for Course Hub
  const allLanguageCourses = getCoursesForLanguage(currentLangCode);
  const filteredCourses = allLanguageCourses.filter((course) => {
    const matchesLevel =
      selectedLevelFilter === 'all' || course.levelCode.toLowerCase() === selectedLevelFilter.toLowerCase();
    const query = courseSearchQuery.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(query) ||
      course.provider.toLowerCase().includes(query) ||
      course.institution.toLowerCase().includes(query) ||
      (course.instructor && course.instructor.toLowerCase().includes(query)) ||
      course.learningPoints.some((p) => p.toLowerCase().includes(query));
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="pt-20 px-4 md:px-8 pb-20 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      {/* Main Roadmap & Courses Area */}
      <section className="flex-1 w-full space-y-6">
        {/* Language Track Selector Header */}
        <div className="p-6 rounded-3xl bg-[#0f1523] border border-slate-800/80 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 block">
              Accredited Language Proficiency System
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <FlagIcon code={currentInfo.flagCode} size="md" className="rounded-xs shadow-sm" />
              <span>{currentInfo.name} Proficiency Track</span>
            </h1>
            <p className="text-xs text-slate-400">{currentInfo.standard}</p>
          </div>

          {/* 3-Language Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            {(['ko', 'ja', 'en'] as const).map((lang) => {
              const info = getLanguageLabel(lang);
              const isActive = currentLangCode === lang;
              return (
                <button
                  key={lang}
                  onClick={() => selectLanguageTrack(lang)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 scale-102'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <FlagIcon code={info.flagCode} size="sm" className="rounded-2xs shadow-2xs" />
                  <span>{info.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accredited Online Courses Header & Anti-Plagiarism Ledger */}
        <div className="flex items-center justify-between gap-3 p-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2.5 text-white">
            <GraduationCap size={18} className="text-emerald-400" />
            <span className="text-sm font-black">Accredited Online Courses Hub</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black border border-emerald-500/30">
              {allLanguageCourses.length} Courses
            </span>
          </div>

          <button
            onClick={() => setIsCredibilityModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20 transition-all cursor-pointer"
          >
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">Anti-Plagiarism & Sources</span>
            <span className="sm:hidden">Sources</span>
          </button>
        </div>

        {/* ACCREDITED ONLINE COURSES DIRECTORY */}
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={courseSearchQuery}
                    onChange={(e) => setCourseSearchQuery(e.target.value)}
                    placeholder={`Search ${currentInfo.name} courses, institutions, keywords...`}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">
                    {filteredCourses.length} Course{filteredCourses.length === 1 ? '' : 's'} Available
                  </span>
                </div>
              </div>

              {/* Level Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedLevelFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedLevelFilter === 'all'
                      ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All Levels
                </button>

                {levels.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevelFilter(lvl.code)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      selectedLevelFilter.toLowerCase() === lvl.code.toLowerCase()
                        ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{lvl.code}</span>
                    <span className="text-[10px] opacity-70">
                      ({(lvl.courses || getCoursesForLevel(lvl.id)).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        Level {course.levelCode} • {course.levelName}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-black bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800 shrink-0">
                        <Star size={12} className="fill-amber-400" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-sky-400 transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-sky-400 font-bold flex items-center gap-1.5 pt-1">
                        <Building2 size={12} />
                        <span>{course.provider}</span>
                      </p>
                      {course.instructor && (
                        <p className="text-[11px] text-slate-400 pt-0.5">
                          Taught by {course.instructor}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Competency Highlights */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                        Core Competencies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {course.learningPoints.slice(0, 2).map((pt, pIdx) => (
                          <span
                            key={pIdx}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 text-[11px] text-slate-300 border border-slate-800 flex items-center gap-1"
                          >
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                            <span>{pt}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Attribution & Plagiarism Protection Statement */}
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                      <div className="flex items-center gap-1 font-bold text-emerald-400">
                        <ShieldCheck size={12} />
                        <span>Accredited Academic Attribution</span>
                      </div>
                      <p className="line-clamp-2 italic">
                        "{course.attributionStatement}"
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedCourseForDetail(course)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      View Full Syllabus
                    </button>
                    <a
                      href={course.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                    >
                      <span>Open Course</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="py-20 text-center text-slate-400 text-xs space-y-3 bg-[#0b0f19] rounded-3xl border border-slate-800">
                <BookOpen size={36} className="mx-auto text-slate-600" />
                <p className="font-bold text-sm text-slate-300">
                  No courses found matching "{courseSearchQuery}"
                </p>
                <p className="text-slate-500">
                  Try clearing your search query or selecting a different level filter.
                </p>
                <button
                  onClick={() => {
                    setCourseSearchQuery('');
                    setSelectedLevelFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-sky-400 text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
      </section>

      {/* Right Sidebar: Track Overview, Certificate & Academic Standard */}
      <aside className="w-full lg:w-84 space-y-6 shrink-0">
        {/* Progress Card */}
        <div className="p-6 rounded-3xl bg-[#0f1523] border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Track Progress</span>
            <span className="text-sm font-black text-sky-400">{progressPercent}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-xl font-black text-white">{passedCount}</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">Levels Passed</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-xl font-black text-sky-400">{levels.length}</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">Total Milestones</p>
            </div>
          </div>
        </div>

        {/* Academic Credibility & Anti-Plagiarism Protection Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#0f172a] to-[#0a0f1d] border border-emerald-500/30 shadow-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                Academic Integrity
              </span>
              <h4 className="text-sm font-black text-white">Plagiarism-Free Policy</h4>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            All online courses and syllabi are indexed under academic fair-use guidelines with transparent attribution to their original authors and accredited institutions.
          </p>

          <button
            onClick={() => setIsCredibilityModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-colors cursor-pointer"
          >
            <span>View Citations & Sources Ledger</span>
            <ExternalLink size={12} />
          </button>
        </div>

        {/* Official Certificate Information Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#12192c] via-[#0f1523] to-[#0a0e18] border border-amber-500/30 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Award size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">Graduation Credential</span>
              <h4 className="text-sm font-black text-white">Landscape A4 Certificate</h4>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Upon successfully passing the final proficiency evaluation ({currentInfo.standard.split(' ')[0]}), an official verified Certificate of Proficiency with an immutable QR code is automatically generated.
          </p>

          <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>Cryptographically verifiable online</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Download size={14} className="text-sky-400 shrink-0" />
              <span>Exportable high-resolution PDF format</span>
            </div>
          </div>
        </div>

        {/* Academic Standard Overview */}
        <div className="p-6 rounded-3xl bg-[#0f1523] border border-slate-800 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen size={14} className="text-sky-400" />
            <span>Academic Standard</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentLangCode === 'ko' && (
              <>
                The <strong>Test of Proficiency in Korean (TOPIK)</strong> is administered to assess and certify the Korean language skills of non-native speakers across Levels 1 through 6.
              </>
            )}
            {currentLangCode === 'ja' && (
              <>
                The <strong>Japanese-Language Proficiency Test (JLPT)</strong> evaluates Japanese proficiency from foundational N5 through mastery level N1.
              </>
            )}
            {currentLangCode === 'en' && (
              <>
                The <strong>Common European Framework of Reference for Languages (CEFR)</strong> is the international benchmark for grading language proficiency from A1 to C2.
              </>
            )}
          </p>
        </div>
      </aside>



      {/* Course Detail Modal (Detailed Syllabus, Objectives & Direct Outbound Launch) */}
      <AnimatePresence>
        {selectedCourseForDetail && (
          <CourseDetailModal
            course={selectedCourseForDetail}
            onClose={() => setSelectedCourseForDetail(null)}
          />
        )}
      </AnimatePresence>

      {/* Citations & Anti-Plagiarism Ledger Modal */}
      <AnimatePresence>
        {isCredibilityModalOpen && (
          <CredibilityAttributionModal
            onClose={() => setIsCredibilityModalOpen(false)}
            initialLanguage={currentLangCode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
