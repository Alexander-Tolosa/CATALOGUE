import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useKleoStore } from '../../store/useKleoStore';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import kleoChatbotLogo from '../../assets/kleo_chatbot_logo.png';
import { isAllowedTopic, STANDARD_REFUSAL_RESPONSE } from '../../lib/kleoPrompt';
import { processAIChatMessage } from '../../lib/aiService';
import { checkAndCensorText, triggerEthicalWarning } from '../../lib/ethicalGuard';
import {
  DocumentFile,
  DEFAULT_KNOWLEDGE_BASE,
  chunkText,
  retrieveContext,
  RAGRetrievalResult
} from '../../lib/ragEngine';
import { ChatScenario, InlineCorrection } from '../../types';

interface CitedSource {
  docName: string;
  chunkId: string;
  pageNumber?: number;
  previewText: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  citedSources?: CitedSource[];
  corrections?: InlineCorrection[];
  scenario?: ChatScenario;
}

export const KleoChatRoomView: React.FC = () => {
  const { isDarkMode, profile, addXP, savePhraseToReview, addStruggledWords } = useAppStore();
  const { mood, equippedCosmetics, react, addBondXp } = useKleoStore();

  // Selected Chat Roleplay Scenario State
  const [selectedScenario, setSelectedScenario] = useState<ChatScenario>('free_chat');

  // Auto TTS Speech Output Toggle
  const [autoSpeak, setAutoSpeak] = useState(false);

  // Knowledge Base Documents State
  const [documents, setDocuments] = useState<DocumentFile[]>(() => {
    const saved = localStorage.getItem('catalogue_rag_documents') || localStorage.getItem('catalouge_rag_documents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_KNOWLEDGE_BASE;
  });

  // Chat Messages State (Multi-turn persistent history)
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('catalogue_rag_chat_history') || localStorage.getItem('catalouge_rag_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [inputMsg, setInputMsg] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [savedCorrections, setSavedCorrections] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scenarios Definition List
  const scenariosList: Array<{ id: ChatScenario; label: string; icon: string; promptNote: string }> = [
    { id: 'free_chat', label: 'Free Chat', icon: 'chat', promptNote: 'Ask any grammar or vocab question' },
    { id: 'order_coffee', label: 'Order Coffee', icon: 'local_cafe', promptNote: 'Practice ordering drinks in a café' },
    { id: 'job_interview', label: 'Job Interview', icon: 'work', promptNote: 'Bilingual interview practice' },
    { id: 'hotel_checkin', label: 'Hotel Check-in', icon: 'hotel', promptNote: 'Check in & ask about hotel amenities' },
    { id: 'airport_customs', label: 'Airport Customs', icon: 'flight_land', promptNote: 'Passport control & customs roleplay' }
  ];

  // Persist documents & history
  useEffect(() => {
    localStorage.setItem('catalogue_rag_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('catalogue_rag_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const activeLangName =
    profile.selectedLanguage === 'ko' ? 'Korean' : profile.selectedLanguage === 'ja' ? 'Japanese' : 'English';

  const sanitizeAIReply = (rawText: string): string => {
    let clean = rawText;
    clean = clean.replace(/📌\s*\*\*RAG Reference\*\*.*?:?/gi, '');
    clean = clean.replace(/Meow~! Regarding ".*?":\s*/gi, '');
    clean = clean.replace(/Regarding your query ".*?":\s*/gi, '');
    return clean.trim();
  };

  // Process message through Centralized Unified AI Service
  const handleSend = async (textInput?: string) => {
    const rawText = textInput || inputMsg;
    if (!rawText.trim() || isStreaming) return;

    // Check ethical censorship (# replacement) & trigger warning toast if needed
    const check = checkAndCensorText(rawText);
    if (check.hasInappropriate) {
      triggerEthicalWarning();
    }
    const text = check.censoredText;

    // Strict guardrail check
    if (!isAllowedTopic(text)) {
      const userMsgObj: Message = {
        id: 'u-' + Date.now(),
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const aiRefusalMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: STANDARD_REFUSAL_RESPONSE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsgObj, aiRefusalMsg]);
      if (!textInput) setInputMsg('');
      react('welcome');
      return;
    }

    const userMsgId = 'u-' + Date.now();
    const userMsgObj: Message = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scenario: selectedScenario
    };

    setMessages((prev) => [...prev, userMsgObj]);
    if (!textInput) setInputMsg('');
    setIsStreaming(true);
    react('correct');

    // Call Centralized Unified AI Service
    const aiResult = await processAIChatMessage({
      message: text,
      scenario: selectedScenario,
      language: profile.selectedLanguage,
      userLevel: profile.level,
      struggledVocab: profile.struggledVocab
    });

    // Attach inline corrections to user message if present
    if (aiResult.corrections && aiResult.corrections.length > 0) {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, corrections: aiResult.corrections } : m))
      );
    }

    // Save detected struggled words into global user state for context reuse
    if (aiResult.struggledWords && aiResult.struggledWords.length > 0) {
      addStruggledWords(aiResult.struggledWords, `Identified in ${selectedScenario} roleplay`);
    }

    // Perform RAG citations check for documents
    const ragResult: RAGRetrievalResult = retrieveContext(text, documents, 2);

    addXP(10);
    addBondXp(15);
    react('celebrate');

    let fullResponseText = sanitizeAIReply(aiResult.reply);

    // Word-by-Word Streaming animation
    const words = fullResponseText.split(' ');
    let currentWordIdx = 0;
    const aiMsgId = 'ai-' + Date.now();

    const citedSources: CitedSource[] = ragResult.citedSources || [];

    // Add empty AI message placeholder
    setMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        sender: 'ai',
        text: words[0] || '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citedSources: citedSources.length > 0 ? citedSources : undefined
      }
    ]);

    const streamInterval = setInterval(() => {
      currentWordIdx++;
      if (currentWordIdx < words.length) {
        const nextChunk = words.slice(0, currentWordIdx + 1).join(' ');
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: nextChunk } : m))
        );
      } else {
        clearInterval(streamInterval);
        setIsStreaming(false);
        if (autoSpeak) {
          speakText(aiMsgId, fullResponseText);
        }
      }
    }, 45);
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
  };

  const handleClearHistory = () => {
    if (confirm('Clear entire chat history?')) {
      setMessages([]);
      localStorage.removeItem('catalogue_rag_chat_history');
      localStorage.removeItem('catalouge_rag_chat_history');
    }
  };

  const speakText = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`~_-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = profile.selectedLanguage === 'ja' ? 'ja-JP' : profile.selectedLanguage === 'ko' ? 'ko-KR' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);
    setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = profile.selectedLanguage === 'ja' ? 'ja-JP' : profile.selectedLanguage === 'ko' ? 'ko-KR' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMsg(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSaveCorrectionToReview = (corr: InlineCorrection) => {
    savePhraseToReview({
      term: corr.corrected,
      translation: corr.explanation,
      language: profile.selectedLanguage,
      phonetic: ''
    });
    setSavedCorrections((prev) => ({ ...prev, [corr.id]: true }));
  };

  const handleSelectScenario = (scenarioId: ChatScenario) => {
    setSelectedScenario(scenarioId);
    if (scenarioId === 'free_chat') return;

    let openingText = '';
    const lang = profile.selectedLanguage;

    if (scenarioId === 'order_coffee') {
      openingText = lang === 'ko'
        ? '안녕하세요! 커피 캣탈로그입니다. 무엇을 주문하시겠어요?'
        : lang === 'ja'
        ? 'いらっしゃいませ！Coffee CATALOGUEへようこそ。ご注文はお決まりですか？'
        : 'Welcome to Coffee CATALOGUE! What can I get started for you today?';
    } else if (scenarioId === 'job_interview') {
      openingText = lang === 'ko'
        ? '안녕하세요! 오늘 면접에 응해주셔서 감사합니다. 먼저 간단히 자기소개를 해주세요.'
        : lang === 'ja'
        ? '本日は面接にお越しいただきありがとうございます。まずは簡単に自己紹介をお願いします。'
        : 'Thank you for attending the interview today! Please start with a short self-introduction.';
    } else if (scenarioId === 'hotel_checkin') {
      openingText = lang === 'ko'
        ? '안녕하세요, 호텔 캣탈로그입니다. 체크인 예약을 도와드릴까요?'
        : lang === 'ja'
        ? 'いらっしゃいませ。Hotel CATALOGUEへようこそ。チェックインのご予約のお名前をお伺いできますか？'
        : 'Welcome to Hotel CATALOGUE! May I have your name for the reservation check-in, please?';
    } else if (scenarioId === 'airport_customs') {
      openingText = lang === 'ko'
        ? '입국 심사입니다. 방문 목적과 체류 기간을 말씀해 주세요.'
        : lang === 'ja'
        ? '入国審査です。ご訪問の目的と滞在期間を教えてください。'
        : 'Passport control and customs. What is the purpose of your visit and how long will you stay?';
    }

    const aiMsgObj: Message = {
      id: 'ai-scene-' + Date.now(),
      sender: 'ai',
      text: openingText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scenario: scenarioId
    };
    setMessages((prev) => [...prev, aiMsgObj]);
    react('welcome');
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] max-h-screen overflow-hidden ${
      isDarkMode ? 'bg-[#0F172A] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. Single Sleek Top Header Bar (Human-centered, clean, no technical badges) */}
      <header className={`px-6 py-3 border-b flex items-center justify-between gap-4 shrink-0 shadow-2xs backdrop-blur-md z-10 ${
        isDarkMode ? 'bg-[#0F172A]/90 border-slate-800/80' : 'bg-white/90 border-slate-200'
      }`}>
        {/* Left: Avatar with subtle green online status dot & Tutor details */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-[#FFF4EE] dark:bg-slate-800 border border-[#FDE3D5] dark:border-slate-700/60 overflow-hidden shrink-0 shadow-2xs">
            <img src={kleoChatbotLogo} alt="Kleo AI Tutor" className="w-full h-full object-cover" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-emerald-500/20" title="Online" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm font-bold tracking-tight">Kleo AI Tutor</h2>
            </div>
            <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Level {profile.level} • {activeLangName}
            </span>
          </div>
        </div>

        {/* Center: Streamlined Scenario Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedScenario}
              onChange={(e) => handleSelectScenario(e.target.value as ChatScenario)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F06543]/40 transition-all ${
                isDarkMode
                  ? 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200/80'
              }`}
            >
              {scenariosList.map((sc) => (
                <option key={sc.id} value={sc.id} className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                  Scenario: {sc.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-xs absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              expand_more
            </span>
          </div>
        </div>

        {/* Right: Action Controls */}
        <div className="flex items-center gap-2">
          {/* TTS Auto-Speak Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              autoSpeak
                ? 'bg-[#FFF4EE] border-[#FDE3D5] text-[#F06543] font-bold dark:bg-orange-500/20 dark:border-orange-500/40 dark:text-orange-400'
                : isDarkMode
                ? 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle Auto Voice Output"
          >
            <span className="material-symbols-outlined text-sm">{autoSpeak ? 'volume_up' : 'volume_off'}</span>
            <span className="hidden sm:inline">TTS</span>
          </button>

          {/* Clear History */}
          <button
            onClick={handleClearHistory}
            className={`p-1.5 rounded-xl border text-slate-400 hover:text-rose-500 transition-colors cursor-pointer ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200'
            }`}
            title="Clear Chat History"
          >
            <span className="material-symbols-outlined text-sm">delete_outline</span>
          </button>
        </div>
      </header>

      {/* 2. Conversational Container & Layout Mechanics (Constrained Max-Width max-w-3xl = 768px Centered Canvas) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {/* Centered Timestamp Capsule Pill */}
          <div className="flex justify-center my-2">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-medium text-slate-400 bg-[#161a24]/90 border border-slate-800/80 shadow-xs">
              Today, 10:42 AM
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF4EE] dark:bg-slate-800 border border-[#FDE3D5] dark:border-slate-700 overflow-hidden shrink-0 shadow-xs">
                <img src={kleoChatbotLogo} alt="Kleo AI Tutor" className="w-full h-full object-cover" />
              </div>
              <h3 className={`font-display text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Start Roleplaying with Kleo! 🐾
              </h3>
              <p className={`text-sm max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Choose a scenario like ☕ <b>Order Coffee</b> or 💼 <b>Job Interview</b> above. Kleo will roleplay with you in {activeLangName}, offer gentle corrections, and reinforce your vocabulary.
              </p>
              <div className="flex flex-wrap gap-2.5 justify-center pt-2">
                <button
                  onClick={() => handleSend(profile.selectedLanguage === 'ko' ? '안녕하세요! 커피 주문하고 싶어요.' : profile.selectedLanguage === 'ja' ? 'こんにちは！コーヒーを注文したいです。' : 'Hello! I would like to order a coffee.')}
                  className="px-4 py-2 rounded-xl border border-[#F06543]/40 text-[#F06543] text-xs font-semibold hover:bg-[#FFF4EE] dark:hover:bg-orange-500/10 transition-colors cursor-pointer"
                >
                  ☕ Order Coffee Greeting
                </button>
                <button
                  onClick={() => handleSend(profile.selectedLanguage === 'ko' ? '존댓말과 반말 차이를 설명해 주세요!' : profile.selectedLanguage === 'ja' ? '敬語とタメ口の違いを説明してください！' : 'Explain formal vs informal speech!')}
                  className="px-4 py-2 rounded-xl border border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer"
                >
                  💡 Ask Grammar Question
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.sender === 'user' ? (
                  /* User Message Bubble (Right-aligned, soft rounded corners) */
                  <div className="flex justify-end my-2">
                    <div className="max-w-[85%] sm:max-w-[78%] bg-gradient-to-r from-[#F06543] to-amber-600 dark:from-[#F06543] dark:to-orange-600 text-white px-4 py-3 rounded-2xl sm:rounded-3xl rounded-tr-xs shadow-xs text-sm font-sans leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  /* AI Message Block with Siamese Head Avatar and Dark Card Bubble */
                  <div className="flex items-start gap-3 my-2 max-w-[95%] sm:max-w-[90%]">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-orange-500/30 bg-[#FF6B35]/10 shadow-xs mt-0.5 ring-1 ring-white/10">
                      <img src={kleoChatbotLogo} alt="Kleo AI" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 bg-[#161a23] border border-white/[0.08] text-slate-100 p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl shadow-md space-y-2">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-slate-100">
                        {sanitizeAIReply(msg.text)}
                      </div>

                      {/* Footnote Citation */}
                      {msg.citedSources && msg.citedSources.length > 0 && (
                        <details className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <summary className="cursor-pointer hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-semibold flex items-center gap-1 select-none text-[11px]">
                            <span>✨ {msg.citedSources.length} Reference{msg.citedSources.length > 1 ? 's' : ''}</span>
                          </summary>
                          <div className="mt-1.5 p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 space-y-1.5">
                            {msg.citedSources.map((src, i) => (
                              <div key={i} className="text-[11px] space-y-0.5">
                                <div className="font-semibold text-slate-700 dark:text-slate-300">
                                  • {src.docName.replace(/\.pdf$/i, '').replace(/_/g, ' ')}
                                </div>
                                <p className="italic text-slate-600 dark:text-slate-400 pl-3">{src.previewText}</p>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}

                      {/* Assistant Actions (TTS Speaker & Copy) */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] text-slate-400">
                        <span className="font-medium text-slate-400">{msg.timestamp}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => speakText(msg.id, sanitizeAIReply(msg.text))}
                            className={`p-1 rounded hover:text-white transition-colors cursor-pointer ${
                              isSpeakingId === msg.id ? 'text-[#F06543] opacity-100 animate-pulse' : 'text-slate-400'
                            }`}
                            title="Speak Message (TTS)"
                          >
                            <span className="material-symbols-outlined text-sm">
                              {isSpeakingId === msg.id ? 'volume_up' : 'volume_mute'}
                            </span>
                          </button>
                          <button
                            onClick={() => handleCopy(msg.id, sanitizeAIReply(msg.text))}
                            className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy to Clipboard"
                          >
                            <span className="material-symbols-outlined text-sm">
                              {copiedId === msg.id ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inline Correction Bubble */}
                {msg.corrections && msg.corrections.length > 0 && (
                  <div className="flex justify-end pr-2">
                    <div className={`max-w-[70%] sm:max-w-md p-3 rounded-2xl border backdrop-blur-md space-y-2 shadow-2xs ${
                      isDarkMode
                        ? 'bg-rose-950/30 border-rose-500/30 text-slate-200'
                        : 'bg-rose-50 border-rose-200 text-slate-900'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                          Grammar Tip
                        </span>
                      </div>

                      {msg.corrections.map((corr) => (
                        <div key={corr.id} className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-rose-500 text-sm">close</span>
                            <span className="line-through text-rose-400">{corr.original}</span>
                            <span className="material-symbols-outlined text-emerald-500 text-sm">arrow_forward</span>
                            <span className="font-bold text-emerald-500">{corr.corrected}</span>
                          </div>
                          <p className={`text-[11px] pl-5 border-l-2 border-[#F06543] ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            💡 {corr.explanation}
                          </p>

                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleSaveCorrectionToReview(corr)}
                              disabled={savedCorrections[corr.id]}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                                savedCorrections[corr.id]
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                  : 'bg-[#FFF4EE] border-[#FDE3D5] text-[#F06543] hover:bg-[#F06543] hover:text-white'
                              }`}
                            >
                              <span className="material-symbols-outlined text-xs">
                                {savedCorrections[corr.id] ? 'check' : 'bookmark_add'}
                              </span>
                              <span>{savedCorrections[corr.id] ? 'Saved to Review' : 'Save to Review'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. Footer Input Area (Centered max-w-3xl, Sleek Dark Pill Input) */}
      <footer className={`p-4 border-t shrink-0 shadow-lg ${
        isDarkMode ? 'bg-[#0b0f17] border-slate-800/80' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-3xl mx-auto w-full space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className={`flex items-center gap-2.5 p-2 rounded-2xl border transition-all ${
              isDarkMode
                ? 'bg-[#141824] border-slate-800/90 shadow-lg focus-within:border-slate-700'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            {/* Plus / Voice action on the left */}
            <button
              type="button"
              onClick={startVoiceInput}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer relative shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white shadow-lg animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Voice Input (STT)"
            >
              <span className="material-symbols-outlined text-lg">{isListening ? 'mic' : 'add'}</span>
              {isListening && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Input Box */}
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to speech...'
                  : 'Type your message...'
              }
              className={`flex-1 px-2 py-1.5 text-xs md:text-sm font-medium focus:outline-none bg-transparent ${
                isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
              }`}
            />

            {/* Send Button on the right */}
            {isStreaming ? (
              <button
                type="button"
                onClick={handleStopStreaming}
                className="w-8 h-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
                title="Stop Generating"
              >
                <span className="material-symbols-outlined text-lg">stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  !inputMsg.trim()
                    ? 'text-slate-600 opacity-40 cursor-not-allowed'
                    : 'text-slate-400 hover:text-[#F06543]'
                }`}
                title="Send message"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            )}
          </form>
        </div>
      </footer>
    </div>
  );
};
