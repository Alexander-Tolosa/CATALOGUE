import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Loader2,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { LevelDetail, OnlineCourse } from '../../types/proficiency';
import { getCoursesForLevel, FALLBACK_LEVELS_BY_LANG } from '../../data/proficiencyCoursesData';
import { CourseDetailModal } from './CourseDetailModal';

interface LevelDetailModalProps {
  levelId: string;
  onClose: () => void;
  onStartQuiz: (level: LevelDetail) => void;
}

export const LevelDetailModal: React.FC<LevelDetailModalProps> = ({
  levelId,
  onClose,
  onStartQuiz
}) => {
  const [levelDetail, setLevelDetail] = useState<LevelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'courses'>('curriculum');
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<OnlineCourse | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLevel() {
      try {
        const res = await fetch(`/api/levels/${levelId}`);
        const data = await res.json();
        if (isMounted && data.level) {
          const courses = data.level.courses?.length > 0
            ? data.level.courses
            : getCoursesForLevel(levelId);
          setLevelDetail({ ...data.level, courses });
          if (data.level.lessons?.length > 0) {
            setExpandedLessonId(data.level.lessons[0].id);
          }
          return;
        }
      } catch (err) {
        console.warn('Backend level fetch failed, using local fallback:', err);
      }

      // Fallback from local data
      if (isMounted) {
        let foundLevel: any = null;
        for (const lang of Object.keys(FALLBACK_LEVELS_BY_LANG)) {
          const match = FALLBACK_LEVELS_BY_LANG[lang].find((l) => l.id === levelId);
          if (match) {
            foundLevel = match;
            break;
          }
        }

        if (foundLevel) {
          const courses = getCoursesForLevel(levelId);
          setLevelDetail({
            id: foundLevel.id,
            languageId: foundLevel.languageId,
            languageName: foundLevel.id.startsWith('ko') ? 'Korean' : foundLevel.id.startsWith('ja') ? 'Japanese' : 'English',
            languageCode: foundLevel.id.startsWith('ko') ? 'ko' : foundLevel.id.startsWith('ja') ? 'ja' : 'en',
            code: foundLevel.code,
            name: foundLevel.name,
            order: foundLevel.order,
            description: foundLevel.description,
            lessons: [
              {
                id: `${foundLevel.id}-les-1`,
                levelId: foundLevel.id,
                title: `${foundLevel.code} Core Linguistic Framework`,
                content: `Master foundational grammatical structures, core phonetics, and contextual discourse for ${foundLevel.name}. Review the accompanying accredited online courses below for supplementary practice.`,
                order: 1
              },
              {
                id: `${foundLevel.id}-les-2`,
                levelId: foundLevel.id,
                title: `${foundLevel.code} Practical Conversational Application`,
                content: `Apply situational expressions, vocabulary expansions, and test-taking strategies required for official ${foundLevel.code} standard assessment.`,
                order: 2
              }
            ],
            courses,
            quiz: {
              id: `${foundLevel.id}-quiz`,
              levelId: foundLevel.id,
              passThreshold: 0.8,
              questions: [
                {
                  id: `${foundLevel.id}-q1`,
                  prompt: `Which approach best demonstrates mastery of ${foundLevel.name}?`,
                  choices: [
                    'Consistently applying standard grammatical patterns and vocabulary',
                    'Ignoring formal and informal speech registers',
                    'Relying solely on mechanical translation tools',
                    'Skipping foundational phonetics and pronunciation'
                  ]
                },
                {
                  id: `${foundLevel.id}-q2`,
                  prompt: `What is the primary academic standard benchmark for this ${foundLevel.code} level?`,
                  choices: [
                    'Standard accredited proficiency assessment criteria',
                    'Informal colloquial slang exclusively',
                    'Rote memorization without contextual comprehension',
                    'Single-word disjointed vocabulary'
                  ]
                }
              ]
            }
          });
          setExpandedLessonId(`${foundLevel.id}-les-1`);
        }
        setLoading(false);
      }
    }

    loadLevel();
    return () => {
      isMounted = false;
    };
  }, [levelId]);

  const matchedCourses = levelDetail?.courses || getCoursesForLevel(levelId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-3xl bg-[#0b0f19] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#0f1523]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Proficiency Level Curriculum
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {levelDetail ? levelDetail.code : ''}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {levelDetail ? levelDetail.name : 'Loading Level...'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs (Curriculum vs. Matched Courses) */}
        <div className="px-6 pt-3 pb-0 border-b border-slate-800 bg-[#0d121f] flex items-center gap-2">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`pb-3 px-3 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'curriculum'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={14} />
            <span>Curriculum Lessons & Quiz ({levelDetail?.lessons.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 px-3 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'courses'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap size={15} />
            <span>Accredited Online Courses ({matchedCourses.length})</span>
            {matchedCourses.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                Verified
              </span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-sky-400" />
              <p className="text-xs font-semibold">Loading curriculum & accredited resources...</p>
            </div>
          ) : levelDetail ? (
            <>
              {/* TAB 1: CURRICULUM LESSONS & QUIZ */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  {/* Level Overview Card */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-black tracking-wider uppercase text-sky-400">
                      Proficiency Competencies
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {levelDetail.description}
                    </p>
                  </div>

                  {/* Lessons Accordion */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <BookOpen size={14} className="text-sky-400" />
                        <span>Curriculum Lessons ({levelDetail.lessons.length})</span>
                      </h3>
                      <span className="text-[11px] text-slate-500">Read before taking the quiz</span>
                    </div>

                    <div className="space-y-2.5">
                      {levelDetail.lessons.map((lesson, idx) => {
                        const isExpanded = expandedLessonId === lesson.id;
                        return (
                          <div
                            key={lesson.id}
                            className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors hover:border-slate-700"
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                              className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-slate-800 text-sky-400 text-xs font-black flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="font-bold text-xs sm:text-sm text-slate-100">
                                  {lesson.title}
                                </span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp size={16} className="text-slate-400" />
                              ) : (
                                <ChevronDown size={16} className="text-slate-400" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 bg-slate-950/40 text-xs text-slate-300 leading-relaxed">
                                {lesson.content}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Assessment Card */}
                  {levelDetail.quiz && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-transparent border border-sky-500/30 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <Award size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Proficiency Evaluation
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          {levelDetail.quiz.questions.length} Questions •{' '}
                          {Math.round(levelDetail.quiz.passThreshold * 100)}% Passing Threshold
                        </p>
                      </div>
                      <button
                        onClick={() => onStartQuiz(levelDetail)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/20 hover:scale-105 transition-all shrink-0 cursor-pointer"
                      >
                        <span>Start Quiz</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* Online Course Teaser Banner */}
                  {matchedCourses.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            {matchedCourses.length} Accredited Course{matchedCourses.length === 1 ? '' : 's'} Matched to this Level
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Learn from {matchedCourses.map((c) => c.provider.split(' ')[0]).join(', ')} with verified citations.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('courses')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                      >
                        <span>View Courses</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ACCREDITED ONLINE COURSES */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  {/* Academic Integrity & Anti-Plagiarism Header Notice */}
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                    <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-emerald-300">
                        Academic Attribution & Plagiarism Prevention
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        These courses are curated from world-leading universities and broadcasters to match this exact proficiency level ({levelDetail.code}). All intellectual property, syllabi, and author credits are fully attributed to their original creators with verified direct links.
                      </p>
                    </div>
                  </div>

                  {/* Course Cards Grid */}
                  <div className="space-y-4">
                    {matchedCourses.map((course) => (
                      <div
                        key={course.id}
                        className="p-5 rounded-3xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-wider">
                                {course.provider}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
                                {course.courseType}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-white pt-1">
                              {course.title}
                            </h3>
                            {course.instructor && (
                              <p className="text-xs text-slate-400">
                                Instructor: <span className="text-slate-200 font-semibold">{course.instructor}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center sm:flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-1 text-amber-400 text-xs font-black bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                              <Star size={13} className="fill-amber-400" />
                              <span>{course.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                              <Clock size={11} />
                              <span>{course.duration.split(' ')[0]} {course.duration.split(' ')[1]}</span>
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Learning Points Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {course.learningPoints.slice(0, 3).map((pt, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-2.5 py-1 rounded-xl bg-slate-900 text-[11px] text-slate-300 border border-slate-800/80 flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>{pt}</span>
                            </span>
                          ))}
                        </div>

                        {/* Attribution / Credibility Bar */}
                        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[10px] uppercase tracking-wider">
                            <ShieldCheck size={12} />
                            <span>Attribution & Licensing</span>
                          </div>
                          <p className="text-[10px] leading-snug">
                            {course.license}
                          </p>
                          <p className="text-[10px] text-slate-500 italic">
                            "{course.attributionStatement}"
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                          <button
                            onClick={() => setSelectedCourseForDetail(course)}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                          >
                            View Syllabus & Details
                          </button>
                          <a
                            href={course.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                          >
                            <span>Open Official Course</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    ))}

                    {matchedCourses.length === 0 && (
                      <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                        <GraduationCap size={32} className="mx-auto text-slate-600" />
                        <p className="font-bold">No online courses indexed for this level yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-rose-400 text-xs font-bold">
              Level could not be loaded. Please try again.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0f1523] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {activeTab === 'curriculum'
              ? 'Passing unlocks the subsequent level on your roadmap.'
              : 'Courses link directly to verified official institution providers.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>

      {/* Sub-modal: Deep Course Details & Full Syllabus */}
      <AnimatePresence>
        {selectedCourseForDetail && (
          <CourseDetailModal
            course={selectedCourseForDetail}
            onClose={() => setSelectedCourseForDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
