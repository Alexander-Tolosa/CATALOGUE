import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ChevronRight, X, Printer, CheckCircle2, FileText, Download, ExternalLink, Sparkles } from 'lucide-react';
import { CertificateAward } from '../../types';
import { useAppStore } from '../../store/useAppStore';

export const CERTIFICATES_DATA: CertificateAward[] = [
  {
    id: 'cert-1',
    title: 'Certificate of completion',
    course: 'Grade 9 BL Ma. Teresa - Araling Panlipunan (Ekonomiks)',
    awardedDate: 'Oct 5, 2020',
    issuer: 'Department of Education & CLASE Secondary Academic Board',
    grade: '98.5% (High Honors)',
    certificateNumber: 'DEPED-AP-2020-09482',
    skillsCovered: ['Macroeconomics', 'Philippine Economic History', 'Social Research', 'Statistical Analysis']
  },
  {
    id: 'cert-2',
    title: 'Certificate of Excellence in Korean Hangul',
    course: 'Korean Language & Cultural Foundations Level 1',
    awardedDate: 'Nov 14, 2023',
    issuer: 'CATALOGUE Language Academy & Global Polyglot Center',
    grade: 'A+ (Distinction)',
    certificateNumber: 'CAT-KO-2023-8821',
    skillsCovered: ['Hangul Jamo Alphabet', 'Syllable Block Formation', 'Polite Banmal vs Jondaetmal', 'Basic Conversation']
  },
  {
    id: 'cert-3',
    title: "Dean's Lister Academic Honor Certificate",
    course: 'College of Liberal Arts, Sciences and Education (CLASE) - BSIT',
    awardedDate: 'Jan 20, 2024',
    issuer: 'CLASE Academic Affairs & University Registrar',
    grade: 'GWA 1.25 (Top 5%)',
    certificateNumber: 'CLASE-DL-2024-0012',
    skillsCovered: ['Computer Programming 2', 'Data Structures & Algorithms', 'Discrete Mathematics', 'Web Development']
  },
  {
    id: 'cert-4',
    title: 'Certificate of Achievement in HCI UI/UX',
    course: 'CSIT 223 - Human Computer Interaction / BSIT 2C',
    awardedDate: 'Dec 12, 2025',
    issuer: 'College of Information Technology Faculty Board',
    grade: '99% Perfect Score',
    certificateNumber: 'CSIT-HCI-2025-2234',
    skillsCovered: ['Usability Engineering', 'Heuristic Evaluation', 'Figma Prototyping', 'Accessibility (WCAG 2.1)']
  }
];

interface CertificationsSectionProps {
  onViewAll?: () => void;
  showAll?: boolean;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ onViewAll, showAll = false }) => {
  const { isDarkMode, profile } = useAppStore();
  const [selectedCert, setSelectedCert] = useState<CertificateAward | null>(null);

  const certificates = showAll ? CERTIFICATES_DATA : CERTIFICATES_DATA.slice(0, 2);

  return (
    <div className="space-y-4">
      {/* Header with Title and Count */}
      <div className="flex items-center justify-between">
        <button
          onClick={onViewAll}
          className={`group flex items-center gap-2.5 text-base md:text-lg font-black tracking-tight cursor-pointer transition-colors ${
            isDarkMode ? 'text-white hover:text-sky-400' : 'text-slate-900 hover:text-[#F06543]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#F06543]" />
            <span>Certifications</span>
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
            isDarkMode ? 'bg-[#1b253b] text-slate-300' : 'bg-slate-200 text-slate-800'
          }`}>
            {CERTIFICATES_DATA.length}
          </span>
          {onViewAll && (
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>
      </div>

      {/* Official Verified Certificates Table */}
      <div className={`rounded-2xl border overflow-hidden transition-colors shadow-xs ${
        isDarkMode ? 'bg-[#101625] border-[#1d273d]' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-bold tracking-wider uppercase text-[11px] ${
                isDarkMode ? 'bg-[#151c2e] border-[#1e293b] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <th className="py-3 px-4 sm:px-6 w-5/12">Certificate</th>
                <th className="py-3 px-4 sm:px-6 w-5/12">Course</th>
                <th className="py-3 px-4 sm:px-6 w-2/12 text-right sm:text-left">Awarded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {certificates.map((cert) => (
                <tr
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`cursor-pointer transition-colors group ${
                    isDarkMode ? 'hover:bg-[#182136]' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      {/* Certificate Document Icon */}
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs ${
                        isDarkMode ? 'bg-slate-800/70 border-slate-700 text-slate-300' : 'bg-orange-50 border-orange-200 text-[#F06543]'
                      }`}>
                        <FileText size={16} />
                      </div>
                      <span className={`font-semibold text-xs transition-colors ${
                        isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-900 group-hover:text-[#F06543]'
                      }`}>
                        {cert.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="font-semibold text-sky-400 hover:underline">
                      {cert.course}
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 sm:px-6 text-xs whitespace-nowrap ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {cert.awardedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Certificate View Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden ${
                isDarkMode ? 'bg-[#0f1422] border-[#222d46] text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-700/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm">Verified Academic Certificate</h3>
                    <p className="text-[11px] text-slate-400">ID: {selectedCert.certificateNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Certificate Canvas Sheet */}
              <div className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent">
                <div className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed relative text-center space-y-4 ${
                  isDarkMode ? 'border-amber-500/30 bg-[#141a2c]' : 'border-amber-400/40 bg-amber-50/40'
                }`}>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={13} /> Official Academic Credential
                  </div>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-amber-500">
                    {selectedCert.title.toUpperCase()}
                  </h2>
                  <p className="text-xs text-slate-400">This certifies that</p>
                  <p className="font-display font-extrabold text-lg sm:text-xl text-sky-400">
                    {profile.name || 'ALEXANDER MICHAEL TOLOSA'}
                  </p>
                  <p className="text-xs max-w-md mx-auto text-slate-300">
                    has successfully met all curriculum requirements and competencies for
                  </p>
                  <p className="font-bold text-sm text-slate-200">
                    {selectedCert.course}
                  </p>

                  <div className="pt-4 grid grid-cols-2 gap-4 border-t border-slate-700/40 text-left text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Awarded Date</span>
                      <span className="font-bold text-slate-200">{selectedCert.awardedDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Grade / Rating</span>
                      <span className="font-bold text-emerald-400">{selectedCert.grade || 'Passed with High Honors'}</span>
                    </div>
                  </div>

                  <div className="pt-2 text-left">
                    <span className="text-[10px] text-slate-400 block font-semibold mb-1">Competencies & Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCert.skillsCovered.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Digitally signed by {selectedCert.issuer}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Printer size={14} /> Print
                    </button>
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="px-4 py-2 rounded-xl bg-[#F06543] hover:bg-[#E05432] text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Backward-compatible alias export
export const AwardsSection = CertificationsSection;
