import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, XCircle, Download, Award, Calendar, User, Globe, ArrowLeft, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';

interface PublicVerifyPageProps {
  code: string;
  onNavigateHome?: () => void;
}

interface VerificationData {
  valid: boolean;
  certificateCode: string;
  userName: string;
  language: string;
  level: string;
  issuedAt: string;
  pdfUrl?: string;
  institution?: string;
  error?: string;
}

export const PublicVerifyPage: React.FC<PublicVerifyPageProps> = ({ code, onNavigateHome }) => {
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function verify() {
      try {
        const res = await fetch(`/api/certificates/verify/${code}`);
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) {
          setData({
            valid: false,
            certificateCode: code,
            userName: '',
            language: '',
            level: '',
            issuedAt: '',
            error: 'Network connection failed during verification check.'
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    verify();
    return () => {
      isMounted = false;
    };
  }, [code]);

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-sky-500/20 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-[#0e1424] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Brand Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-cyan-300 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
              C
            </div>
            <div>
              <span className="font-display font-black text-sm tracking-wider text-white">CATALOGUE</span>
              <span className="text-[10px] text-slate-400 block font-medium">Public Credential Verification Engine</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onNavigateHome) onNavigateHome();
              else window.location.href = '/';
            }}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Catalogue Home</span>
          </button>
        </div>

        {/* Verification Status Banner */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={36} className="animate-spin text-sky-400" />
            <p className="text-xs font-semibold">Querying distributed certificate verification registry...</p>
          </div>
        ) : data && data.valid ? (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400/80 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                <ShieldCheck size={44} />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Officially Verified Credential
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  Authentic Certificate of Proficiency
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Registry ID: {data.certificateCode}
                </p>
              </div>
            </div>

            {/* Credential Data Table */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 divide-y divide-slate-800/80 text-xs">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <User size={16} className="text-sky-400" />
                  <span className="font-medium">Certified Recipient</span>
                </div>
                <span className="font-extrabold text-white sm:text-sm">{data.userName}</span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Globe size={16} className="text-sky-400" />
                  <span className="font-medium">Language Evaluated</span>
                </div>
                <span className="font-bold text-slate-200">{data.language}</span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Award size={16} className="text-amber-400" />
                  <span className="font-medium">Standard & Proficiency</span>
                </div>
                <span className="font-extrabold text-amber-300 sm:text-sm">{data.level}</span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Calendar size={16} className="text-sky-400" />
                  <span className="font-medium">Issuance Date</span>
                </div>
                <span className="font-semibold text-slate-300">
                  {new Date(data.issuedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="font-medium">Issuing Authority</span>
                </div>
                <span className="font-bold text-emerald-400">{data.institution || 'CATALOUGE Academic Academy'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={`/api/certificates/${data.certificateCode}/download`}
                download
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Download size={15} />
                <span>Download Official Certificate PDF</span>
              </a>

              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Verification link copied to clipboard!');
                  }
                }}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                Share Credential
              </button>
            </div>
          </div>
        ) : (
          /* Invalid / Not Found Screen */
          <div className="text-center space-y-6 py-6">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-400 border-2 border-rose-400/80 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/10">
              <XCircle size={44} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/15 text-rose-300 border border-rose-500/30">
                Invalid Credential
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                Certificate Could Not Be Verified
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                The identifier <strong className="text-rose-400 font-mono">{code}</strong> does not match any officially issued credential in the CATALOGUE verification registry.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  if (onNavigateHome) onNavigateHome();
                  else window.location.href = '/';
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
