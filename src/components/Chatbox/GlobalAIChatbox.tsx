import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  HelpCircle,
  BookOpen,
  Maximize2,
  Minimize2,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Plus
} from 'lucide-react';
import { isAllowedTopic, STANDARD_REFUSAL_RESPONSE } from '../../lib/kleoPrompt';
import { useAppStore } from '../../store/useAppStore';
import { useKleoStore } from '../../store/useKleoStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { checkAndCensorText, triggerEthicalWarning } from '../../lib/ethicalGuard';
import { processAIChatMessage } from '../../lib/aiService';
import { ChatScenario } from '../../types';
import kleoChatbotLogo from '../../assets/kleo_chatbot_logo.png';

interface GlobalAIChatboxProps {
  currentLanguage: string;
  activeLessonTitle?: string;
}

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  scenario?: ChatScenario;
};

export const GlobalAIChatbox: React.FC<GlobalAIChatboxProps> = ({
  currentLanguage,
  activeLessonTitle = 'Hangul Foundations'
}) => {
  const { isChatbotOpen, setIsChatbotOpen, profile, addXP, savePhraseToReview } = useAppStore();
  const { react } = useKleoStore();
  const { t } = useTranslation();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedScenario] = useState<ChatScenario>('free_chat');
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: t.chatbox.greeting,
      timestamp: '10:42 AM',
      scenario: 'free_chat'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatbotOpen) {
      scrollToBottom();
    }
  }, [messages, isSending, isChatbotOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (userQuery?: string) => {
    const rawText = userQuery || inputMsg;
    if (!rawText.trim() || isSending) return;

    // Ethical restriction check & '#' censorship
    const check = checkAndCensorText(rawText);
    if (check.hasInappropriate) {
      triggerEthicalWarning();
    }
    const textToSend = check.censoredText;

    const userMsgObj: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      scenario: selectedScenario
    };

    setMessages(prev => [...prev, userMsgObj]);
    if (!userQuery) setInputMsg('');
    setIsSending(true);

    try {
      // Direct Ethical Policy refusal check
      if (!isAllowedTopic(textToSend)) {
        setTimeout(() => {
          const refusalMsg: Message = {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: STANDARD_REFUSAL_RESPONSE,
            timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            scenario: selectedScenario
          };
          setMessages(prev => [...prev, refusalMsg]);
          setIsSending(false);
          react('error');
        }, 500);
        return;
      }

      // Call AI Service (Gemini API with fallback)
      const response = await processAIChatMessage({
        message: textToSend,
        language: profile.selectedLanguage,
        userLevel: profile.level,
        scenario: selectedScenario,
        struggledVocab: profile.struggledVocab,
        history: messages.slice(-6).map(m => ({
          sender: m.sender,
          text: m.text
        }))
      });

      const aiMsgObj: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        scenario: selectedScenario
      };

      setMessages(prev => [...prev, aiMsgObj]);
      addXP(5);
      react('celebrate');
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: `Meow~ I'm here! Let's practice ${
          profile.selectedLanguage === 'ko' ? 'Korean' : profile.selectedLanguage === 'ja' ? 'Japanese' : 'English'
        }. You said: "${textToSend}". Practice saying it politely!`,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        scenario: selectedScenario
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // If chatbot is closed, show floating button at bottom-right of dashboard (positioned above mobile bottom nav on mobile)
  if (!isChatbotOpen) {
    return (
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30">
        <motion.button
          onClick={() => setIsChatbotOpen(true)}
          whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
          whileTap={{ scale: 0.92 }}
          className="relative group w-14 h-14 md:w-16 md:h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#FF6B35] to-[#f97316] shadow-[0_8px_25px_rgba(255,107,53,0.45)] hover:shadow-[0_12px_30px_rgba(255,107,53,0.65)] transition-shadow border-2 border-white/80 dark:border-slate-800 cursor-pointer flex items-center justify-center"
          title="Chat with Kleo AI"
        >
          {/* Circular Siamese Cat Head Only */}
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={kleoChatbotLogo}
              alt="Kleo AI Chat"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Active Status Pulse Indicator */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping pointer-events-none" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full pointer-events-none" />
        </motion.button>
      </div>
    );
  }

  // Active Chatbot Container (Floating Widget or Full Screen Overlay)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`fixed z-[999] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden bg-[#0e121b]/98 backdrop-blur-2xl transition-all duration-300 ${
          isFullscreen
            ? 'inset-3 sm:inset-6 rounded-3xl'
            : 'bottom-20 right-2 left-2 sm:left-auto sm:right-6 sm:bottom-6 sm:w-full max-w-sm sm:max-w-md h-[560px] rounded-3xl'
        }`}
      >
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 bg-[#121622]/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-orange-500/40 overflow-hidden shadow-xs shrink-0 bg-[#FF6B35]/10 flex items-center justify-center ring-1 ring-white/10">
              <img src={kleoChatbotLogo} alt="Kleo AI Tutor" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-display font-black text-white text-sm sm:text-base tracking-tight">
                Kleo
              </h3>
            </div>
          </div>

          {/* Action Buttons: Fullscreen & Close */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Close Chatbot"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Stream Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm no-scrollbar">
          {/* Centered Timestamp Capsule Pill (Matching Reference Format) */}
          <div className="flex justify-center my-2">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-medium text-slate-400 bg-[#161a24]/90 border border-slate-800/80 shadow-xs">
              Today, 10:42 AM
            </span>
          </div>

          {messages.map(m => (
            <div key={m.id}>
              {m.sender === 'ai' ? (
                /* AI Message with Siamese Head Avatar and Rounded Dark Surface */
                <div className="flex items-start gap-3 my-2 max-w-[95%] sm:max-w-[90%]">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-orange-500/30 bg-[#FF6B35]/10 shadow-xs mt-0.5 ring-1 ring-white/10">
                    <img src={kleoChatbotLogo} alt="Kleo AI" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 bg-[#161a23] border border-white/[0.08] text-slate-100 p-4 rounded-2xl sm:rounded-3xl shadow-md space-y-2">
                    <p className="whitespace-pre-line leading-relaxed font-sans text-xs sm:text-sm text-slate-100 font-normal">
                      {m.text}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] text-slate-400">
                      <span className="font-medium text-slate-400">{m.timestamp}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeak(m.id, m.text)}
                          className={`p-1 rounded hover:text-white transition-colors cursor-pointer ${
                            speakingId === m.id ? 'text-[#FF6B35] animate-pulse' : ''
                          }`}
                          title="Listen TTS"
                        >
                          <Volume2 size={13} />
                        </button>
                        <button
                          onClick={() => handleCopy(m.id, m.text)}
                          className="p-1 rounded hover:text-white transition-colors cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === m.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* User Message (Right Aligned) */
                <div className="flex justify-end my-2">
                  <div className="max-w-[85%] sm:max-w-[78%] bg-gradient-to-r from-[#F06543] to-[#ff7849] text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl rounded-tr-xs shadow-md text-xs sm:text-sm font-sans leading-relaxed">
                    <p className="whitespace-pre-line">{m.text}</p>
                    <span className="text-[9px] mt-1 block text-right text-orange-100 font-mono">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-start gap-3 my-2">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-orange-500/30 bg-[#FF6B35]/10 shadow-xs mt-0.5">
                <img src={kleoChatbotLogo} alt="Kleo AI" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#161a23] border border-white/[0.08] text-slate-400 p-3.5 rounded-2xl rounded-tl-xs flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce [animation-delay:0.4s]" />
                <span className="font-bold text-[#FF6B35] text-xs">{t.chatbox.thinking}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box (Matching Reference Format) */}
        <div className="p-3 sm:p-4 bg-[#0c101a]/95 border-t border-slate-800/80 backdrop-blur-md">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="w-full flex items-center gap-2.5 bg-[#141824] border border-slate-800/90 focus-within:border-slate-700/80 rounded-2xl px-3 py-2.5 shadow-inner transition-colors"
          >
            {/* Plus Action Button on the left */}
            <button
              type="button"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0"
              title="Add attachment or action"
            >
              <Plus size={18} />
            </button>

            {/* Input */}
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              placeholder={t.chatbox.placeholder}
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />

            {/* Send Button on the right */}
            <button
              type="submit"
              disabled={!inputMsg.trim() || isSending}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#F06543] disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer shrink-0"
              title={t.chatbox.send}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
