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
  Coffee,
  Briefcase,
  Hotel,
  Plane,
  MessageCircle
} from 'lucide-react';
import { isAllowedTopic, STANDARD_REFUSAL_RESPONSE } from '../../lib/kleoPrompt';
import { useAppStore } from '../../store/useAppStore';
import { useKleoStore } from '../../store/useKleoStore';
import { checkAndCensorText, triggerEthicalWarning } from '../../lib/ethicalGuard';
import { processAIChatMessage } from '../../lib/aiService';
import { ChatScenario } from '../../types';

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

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<ChatScenario>('free_chat');
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Meow~ I'm Kleo, your Siamese cat AI Language Tutor for CATalouge! 🐾\nI am ready to practice Japanese, Korean, or English with you. Ask me grammar rules, vocabulary breakdowns, or try our roleplay scenarios!`,
      timestamp: 'Just now',
      scenario: 'free_chat'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenariosList: Array<{ id: ChatScenario; label: string; icon: React.ReactNode; prompt: string }> = [
    { id: 'free_chat', label: 'Free Chat', icon: <MessageCircle size={14} />, prompt: 'Free conversation & grammar questions' },
    { id: 'order_coffee', label: 'Order Coffee', icon: <Coffee size={14} />, prompt: 'Roleplay ordering drinks at a café' },
    { id: 'job_interview', label: 'Job Interview', icon: <Briefcase size={14} />, prompt: 'Bilingual job interview roleplay' },
    { id: 'hotel_checkin', label: 'Hotel Check-in', icon: <Hotel size={14} />, prompt: 'Check-in & hotel receptionist roleplay' },
    { id: 'airport_customs', label: 'Airport Customs', icon: <Plane size={14} />, prompt: 'Customs & passport inspection practice' }
  ];

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

    const userMsgId = 'u-' + Date.now();
    const userMsgObj: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scenario: selectedScenario
    };

    setMessages(prev => [...prev, userMsgObj]);
    if (!userQuery) setInputMsg('');
    setIsSending(true);
    react('correct');

    // Kleo Topic Guardrail check
    if (!isAllowedTopic(textToSend)) {
      setTimeout(() => {
        const refusalMsg: Message = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: STANDARD_REFUSAL_RESPONSE,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          scenario: selectedScenario
        };
        setMessages(prev => [...prev, refusalMsg]);
        setIsSending(false);
        react('welcome');
      }, 500);
      return;
    }

    try {
      const response = await processAIChatMessage({
        message: textToSend,
        scenario: selectedScenario,
        language: profile.selectedLanguage,
        userLevel: profile.level,
        struggledVocab: profile.struggledVocab
      });

      const aiMsgObj: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scenario: selectedScenario
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleScenarioChange = (s: ChatScenario) => {
    setSelectedScenario(s);
    const targetPrompt = scenariosList.find(item => item.id === s)?.prompt || '';
    const welcomeMsg: Message = {
      id: 'ai-' + Date.now(),
      sender: 'ai',
      text: `Meow~ Switched mode to [${s.replace('_', ' ').toUpperCase()}]! 🐾\n${targetPrompt}. Let's get started!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scenario: s
    };
    setMessages(prev => [...prev, welcomeMsg]);
  };

  // If chatbot is closed, show floating button at bottom-right of dashboard
  if (!isChatbotOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsChatbotOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#f97316] text-white shadow-[0_8px_25px_rgba(255,107,53,0.45)] border border-orange-400/40 cursor-pointer"
          title="Chat with Kleo AI"
        >
          {/* Animated Mascot Badge */}
          <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg animate-bounce">
            🐾
          </span>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-tight leading-none">Kleo AI Chat</span>
            <span className="text-[10px] text-orange-100 font-medium">Click to talk</span>
          </div>

          {/* Active Status Pulse Indicator */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
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
        className={`fixed z-[999] border border-[#FF6B35]/40 shadow-2xl flex flex-col overflow-hidden bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 ${
          isFullscreen
            ? 'inset-3 sm:inset-6 rounded-3xl'
            : 'bottom-6 right-6 w-full max-w-sm sm:max-w-md h-[580px] rounded-3xl'
        }`}
      >
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B35]/20 border border-[#FF6B35]/40 flex items-center justify-center text-xl text-[#FF6B35] shadow-inner">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-white text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                  Kleo AI Language Tutor
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/30 uppercase">
                  {profile.selectedLanguage.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Context: {activeLessonTitle}
              </span>
            </div>
          </div>

          {/* Action Buttons: Fullscreen & Close */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Close Chatbot"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Roleplay Scenarios Bar */}
        <div className="p-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {scenariosList.map(s => {
            const isSelected = selectedScenario === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleScenarioChange(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#f97316] text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message Stream Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[78%] p-3.5 rounded-2xl relative ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#ff7849] text-white font-medium rounded-tr-none shadow-md'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none shadow-sm'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 mb-2 text-[10px] text-slate-400">
                    <span className="font-bold text-[#FF6B35] flex items-center gap-1">
                      🐾 Kleo AI
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSpeak(m.id, m.text)}
                        className={`p-1 rounded hover:text-white transition-colors ${
                          speakingId === m.id ? 'text-[#FF6B35] animate-pulse' : ''
                        }`}
                        title="Listen TTS"
                      >
                        <Volume2 size={13} />
                      </button>
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="p-1 rounded hover:text-white transition-colors"
                        title="Copy text"
                      >
                        {copiedId === m.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                )}

                <p className="whitespace-pre-line leading-relaxed font-sans">{m.text}</p>

                <span className={`text-[9px] mt-1.5 block text-right font-mono ${
                  m.sender === 'user' ? 'text-orange-100' : 'text-slate-500'
                }`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="bg-slate-900/90 border border-slate-800 text-slate-400 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce [animation-delay:0.4s]" />
                <span className="font-bold text-[#FF6B35]">Kleo is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2 bg-slate-900/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          <button
            onClick={() => handleSend('Explain formal vs informal speech')}
            className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:bg-[#FF6B35] hover:text-white shrink-0 transition-colors font-bold cursor-pointer"
          >
            💡 Honorifics
          </button>
          <button
            onClick={() => handleSend('Give me a quick quiz')}
            className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:bg-[#FF6B35] hover:text-white shrink-0 transition-colors font-bold cursor-pointer"
          >
            🎯 Quiz Me
          </button>
          <button
            onClick={() => handleSend('Translate "Where is the train station?"')}
            className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:bg-[#FF6B35] hover:text-white shrink-0 transition-colors font-bold cursor-pointer"
          >
            🌐 Quick Translate
          </button>
        </div>

        {/* Message Input Box */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Ask Kleo any ${
              profile.selectedLanguage === 'ko' ? 'Korean' : profile.selectedLanguage === 'ja' ? 'Japanese' : 'English'
            } question...`}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMsg.trim() || isSending}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#f97316] text-white hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 flex items-center justify-center shrink-0 shadow-md cursor-pointer"
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
