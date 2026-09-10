import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  ChevronRight,
  X,
  Printer,
  CheckCircle2,
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CertificateAward } from '../../types';
import { EarnedCertificate } from '../../types/proficiency';
import { useAppStore } from '../../store/useAppStore';

export const STATIC_CERTIFICATES: CertificateAward[] = [
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

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  onViewAll,
  showAll = false
}) => {
  const { isDarkMode, profile } = useAppStore();
  const [apiCertificates, setApiCertificates] = useState<EarnedCertificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<{
    id: string;
    title: string;
    course: string;
    awardedDate: string;
    issuer: string;
    grade?: string;
    certificateNumber: string;
    skillsCovered?: string[];
    isApiCert?: boolean;
  } | null>(null);

  // Fetch verified language certificates from API
  useEffect(() => {
    async function fetchUserCertificates() {
      try {
        const res = await fetch('/api/certificates/user/usr-1');
        const data = await res.json();
        if (data.certificates && Array.isArray(data.certificates)) {
          setApiCertificates(data.certificates);
        }
      } catch (err) {
        console.error('Failed to load certificates from API:', err);
      }
    }
    fetchUserCertificates();
  }, []);

  // Map API certificates to display format
  const mappedApiCerts = apiCertificates.map((ac) => ({
    id: ac.id,
    title: `Certificate of Proficiency in ${ac.languageName}`,
    course: `${ac.levelName} (${ac.languageName})`,
    awardedDate: new Date(ac.issuedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    issuer: 'CATALOUGE Language Academy (Standardized Board)',
    grade: 'Proficiency Exam Passed (Score ≥ 80%)',
    certificateNumber: ac.certificateCode,
    skillsCovered: [
      `${ac.languageName} Grammar`,
      'Spaced Repetition Vocabulary',
      'Dialogue & Listening Comprehension',
      'Standardized Proficiency Evaluation'
    ],
    isApiCert: true
  }));

  const allCombinedCerts = [...mappedApiCerts, ...STATIC_CERTIFICATES];
  const displayedCerts = showAll ? allCombinedCerts : allCombinedCerts.slice(0, 3);

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
            <Award className="w-5 h-5 text-amber-400" />
            <span>Earned Language & Academic Certifications</span>
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
            isDarkMode ? 'bg-[#1b253b] text-slate-300' : 'bg-slate-200 text-slate-800'
          }`}>
            {allCombinedCerts.length}
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
                <th className="py-3 px-4 sm:px-6 w-5/12">Certificate & Identifier</th>
                <th className="py-3 px-4 sm:px-6 w-4/12">Proficiency Standard</th>
                <th className="py-3 px-4 sm:px-6 w-3/12 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {displayedCerts.map((cert) => (
                <tr
                  key={cert.id}
                  className={`transition-colors group ${
                    isDarkMode ? 'hover:bg-[#182136]' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3.5 px-4 sm:px-6 cursor-pointer" onClick={() => setSelectedCert(cert)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-xs ${
                        cert.isApiCert
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : isDarkMode
                          ? 'bg-slate-800/70 border-slate-700 text-slate-300'
                          : 'bg-orange-50 border-orange-200 text-[#F06543]'
                      }`}>
                        <Award size={18} />
                      </div>
                      <div>
                        <span className={`font-bold text-xs block transition-colors ${
                          isDarkMode ? 'text-slate-100 group-hover:text-sky-300' : 'text-slate-900 group-hover:text-[#F06543]'
                        }`}>
                          {cert.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {cert.certificateNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 cursor-pointer" onClick={() => setSelectedCert(cert)}>
                    <span className="font-semibold text-sky-400">
                      {cert.course}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      Awarded {cert.awardedDate}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/api/certificates/${cert.certificateNumber}/download`}
                        download
                        className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                        title="Download official landscape A4 PDF"
                      >
                        <Download size={13} />
                        <span>PDF</span>
                      </a>

                      <a
                        href={`/verify/${cert.certificateNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold inline-flex items-center gap-1 border border-slate-700 transition-colors"
                        title="Verify authentic credential online"
                      >
                        <ShieldCheck size={13} className="text-emerald-400" />
                        <span>Verify</span>
                      </a>
                    </div>
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
                    <h3 className="font-extrabold text-sm">Verified Credential Preview</h3>
                    <p className="text-[11px] text-slate-400 font-mono">ID: {selectedCert.certificateNumber}</p>
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
                  <h2 className="font-display font-black text-xl sm:text-2xl text-amber-400">
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

                  {selectedCert.skillsCovered && (
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
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Digitally certified by {selectedCert.issuer}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/api/certificates/${selectedCert.certificateNumber}/download`}
                      download
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Download size={14} /> Download PDF
                    </a>
                    <a
                      href={`/verify/${selectedCert.certificateNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                    >
                      <ShieldCheck size={14} className="text-emerald-400" /> Verify Online
                    </a>
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      Close
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

export const AwardsSection = CertificationsSection;
