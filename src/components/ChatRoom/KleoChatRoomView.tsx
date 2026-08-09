import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useKleoStore } from '../../store/useKleoStore';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import { isAllowedTopic, STANDARD_REFUSAL_RESPONSE } from '../../lib/kleoPrompt';
import { processAIChatMessage } from '../../lib/aiService';
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
    const saved = localStorage.getItem('catalouge_rag_documents');
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
    const saved = localStorage.getItem('catalouge_rag_chat_history');
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
  const [selectedModel, setSelectedModel] = useState<'rag' | 'fast' | 'pro'>('rag');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [savedCorrections, setSavedCorrections] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    localStorage.setItem('catalouge_rag_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('catalouge_rag_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Click outside listener for model dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLangName =
    profile.selectedLanguage === 'ko' ? 'Korean' : profile.selectedLanguage === 'ja' ? 'Japanese' : 'English';

  // Process message through Centralized Unified AI Service
  const handleSend = async (textInput?: string) => {
    const text = textInput || inputMsg;
    if (!text.trim() || isStreaming) return;

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

    let fullResponseText = aiResult.reply;
    if (ragResult.snippets.length > 0) {
      fullResponseText += `\n\n**RAG Reference** (${ragResult.citedSources.map(s => s.docName).join(', ')}):\n> "${ragResult.snippets[0].text.slice(0, 150)}..."`;
    }

    // Word-by-Word Streaming animation
    const words = fullResponseText.split(' ');
    let currentWordIdx = 0;
    const aiMsgId = 'ai-' + Date.now();

    const initialAiMsg: Message = {
      id: aiMsgId,
      sender: 'ai',
      text: words[0] || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citedSources: ragResult.citedSources.length > 0 ? ragResult.citedSources : undefined
    };

    setMessages((prev) => [...prev, initialAiMsg]);

    streamTimerRef.current = setInterval(() => {
      currentWordIdx++;
      if (currentWordIdx < words.length) {
        const nextChunk = words.slice(0, currentWordIdx + 1).join(' ');
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: nextChunk } : m))
        );
      } else {
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
        setIsStreaming(false);

        // Auto-Speak Response if TTS toggle is ON
        if (autoSpeak) {
          speakText(aiMsgId, fullResponseText);
        }
      }
    }, 35);
  };

  const handleStopStreaming = () => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setIsStreaming(false);
  };

  const handleRegenerate = () => {
    if (isStreaming || messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear entire Kleo chat history?')) {
      setMessages([]);
      localStorage.removeItem('catalouge_rag_chat_history');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const docId = 'doc-' + Date.now();
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      const chunks = chunkText(content, docId, file.name);

      const newDoc: DocumentFile = {
        id: docId,
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chunks
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setIsUploadModalOpen(false);
      alert(`Uploaded "${file.name}" into Kleo's Knowledge Base (${chunks.length} chunks generated)!`);
    };

    reader.readAsText(file);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  // Text-To-Speech (TTS)
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

  // Speech-To-Text (STT Voice Input)
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

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] max-h-screen overflow-hidden ${
      isDarkMode ? 'bg-[#0b0f17] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Header Bar */}
      <header className={`px-4 py-3 border-b flex items-center justify-between gap-4 shrink-0 shadow-xs backdrop-blur-md ${
        isDarkMode ? 'bg-[#111827]/90 border-[#1e293b]' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FF6B35]/5 border border-[#FF6B35]/40 flex items-center justify-center p-1 shadow-md">
            <KleoAvatar mood={mood} equippedCosmetics={equippedCosmetics} size={40} />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111827] shadow-xs" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm font-bold tracking-tight">Kleo AI Tutor</h2>
              <span className="bg-orange-500/10 border border-orange-500/30 text-[#f97316] font-bold text-[9px] uppercase px-1.5 py-0.5 rounded-full">
                Unified AI Pipeline
              </span>
            </div>
            <span className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Level {profile.level} • {activeLangName} • RAG Vector Store Active
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* TTS Auto-Speak Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              autoSpeak
                ? 'bg-orange-500/10 border-orange-500/40 text-orange-500 font-bold'
                : isDarkMode
                ? 'bg-[#1e293b] border-slate-800 text-slate-400'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title="Toggle Auto Voice Output on AI Replies"
          >
            <span className="material-symbols-outlined text-sm">{autoSpeak ? 'volume_up' : 'volume_off'}</span>
            <span className="hidden sm:inline">Auto TTS</span>
          </button>

          {/* Context Files Drawer Toggle */}
          <button
            onClick={() => setIsContextDrawerOpen(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#1e293b] border-slate-800 text-slate-200 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-[#f97316]">folder_open</span>
            <span className="hidden sm:inline">RAG Knowledge</span>
            <span className="bg-[#f97316] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {documents.length}
            </span>
          </button>

          {/* Clear History */}
          <button
            onClick={handleClearHistory}
            className={`p-2 rounded-xl border text-slate-400 hover:text-rose-500 transition-colors cursor-pointer ${
              isDarkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
            title="Clear Chat History"
          >
            <span className="material-symbols-outlined text-sm">delete_outline</span>
          </button>
        </div>
      </header>

      {/* Scenario / Persona Selection Toolbar */}
      <div className={`px-4 py-2.5 border-b flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 ${
        isDarkMode ? 'bg-[#0f1422] border-[#1e293b]' : 'bg-slate-100/80 border-slate-200'
      }`}>
        <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">theater_comedy</span>
          Roleplay Persona:
        </span>
        {scenariosList.map((sc) => {
          const isActive = selectedScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20 scale-[1.02]'
                  : isDarkMode
                  ? 'bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title={sc.promptNote}
            >
              <span className="material-symbols-outlined text-sm">{sc.icon}</span>
              <span>{sc.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Stream Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center p-2 shadow-lg">
              <KleoAvatar mood="happy" equippedCosmetics={equippedCosmetics} size={54} />
            </div>
            <h3 className={`font-display text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Start Roleplaying with Kleo! 🐾
            </h3>
            <p className={`text-xs max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Select a scenario above like ☕ <b>Order Coffee</b> or 💼 <b>Job Interview</b>. Kleo will roleplay with you in {activeLangName}, provide inline grammar corrections, and track vocabulary you struggle with!
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button
                onClick={() => handleSend(profile.selectedLanguage === 'ko' ? '안녕하세요! 커피 주문하고 싶어요.' : profile.selectedLanguage === 'ja' ? 'こんにちは！コーヒーを注文したいです。' : 'Hello! I would like to order a coffee.')}
                className="px-3.5 py-1.5 rounded-xl border border-orange-500/40 text-orange-500 text-xs font-semibold hover:bg-orange-500/10 transition-colors"
              >
                ☕ Try Coffee Order Greeting
              </button>
              <button
                onClick={() => handleSend(profile.selectedLanguage === 'ko' ? '존댓말과 반말의 차이를 설명해 줘!' : profile.selectedLanguage === 'ja' ? '丁寧語の使い方を教えて！' : 'Explain formal vs informal speech!')}
                className="px-3.5 py-1.5 rounded-xl border border-amber-500/40 text-amber-500 text-xs font-semibold hover:bg-amber-500/10 transition-colors"
              >
                💡 Ask Grammar Question
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              <div className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center p-0.5 shrink-0 shadow-xs">
                    <KleoAvatar mood={mood} equippedCosmetics={equippedCosmetics} size={28} />
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm space-y-2 relative group ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none'
                    : isDarkMode
                    ? 'bg-[#111827] border border-[#1e293b] text-slate-100 rounded-tl-none'
                    : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                }`}>
                  {/* Sender & Timestamp */}
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 border-b border-black/10 dark:border-white/10 pb-1.5 mb-1">
                    <span className="font-bold uppercase tracking-wider">
                      {msg.sender === 'user' ? 'You' : 'Kleo AI'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Content */}
                  <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* Cited RAG Sources Badge */}
                  {msg.citedSources && msg.citedSources.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/20 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">auto_awesome</span>
                        Cited RAG Knowledge Sources:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citedSources.map((src, i) => (
                          <span
                            key={i}
                            className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">description</span>
                            <span>{src.docName} (p.{src.pageNumber || 1})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assistant Controls (TTS Speak, Copy) */}
                  {msg.sender === 'ai' && (
                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-700/20 dark:border-slate-800">
                      <button
                        onClick={() => speakText(msg.id, msg.text)}
                        className={`p-1 rounded-lg text-slate-400 hover:text-orange-500 transition-colors cursor-pointer ${
                          isSpeakingId === msg.id ? 'text-orange-500 animate-pulse' : ''
                        }`}
                        title="Speak Message (TTS)"
                      >
                        <span className="material-symbols-outlined text-base">
                          {isSpeakingId === msg.id ? 'volume_up' : 'volume_mute'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        title="Copy to Clipboard"
                      >
                        <span className="material-symbols-outlined text-base">
                          {copiedId === msg.id ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Inline Correction Bubbles (Rendered right beneath User Messages when mistakes are caught) */}
              {msg.corrections && msg.corrections.length > 0 && (
                <div className="flex justify-end pr-2">
                  <div className={`max-w-[85%] md:max-w-[75%] p-3.5 rounded-2xl border backdrop-blur-md space-y-2 shadow-md ${
                    isDarkMode
                      ? 'bg-[#1e1412]/90 border-rose-500/40 text-slate-200'
                      : 'bg-rose-50 border-rose-200 text-slate-900'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                        Inline Correction Bubble
                      </span>
                      <span className="bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Grammar & Politeness
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
                        <p className={`text-[11px] pl-5 border-l-2 border-orange-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          💡 {corr.explanation}
                        </p>

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleSaveCorrectionToReview(corr)}
                            disabled={savedCorrections[corr.id]}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                              savedCorrections[corr.id]
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                : 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500 hover:text-white'
                            }`}
                          >
                            <span className="material-symbols-outlined text-xs">
                              {savedCorrections[corr.id] ? 'check' : 'bookmark_add'}
                            </span>
                            <span>{savedCorrections[corr.id] ? 'Saved to Review' : 'Save to Flashcard Review'}</span>
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

      {/* Input Bar & Controls */}
      <footer className={`p-4 border-t shrink-0 shadow-lg ${
        isDarkMode ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-slate-200'
      }`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* STT Microphone Voice Button */}
          <button
            type="button"
            onClick={startVoiceInput}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 animate-pulse'
                : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-orange-500'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-orange-500'
            }`}
            title="Speak Message (Voice STT Input)"
          >
            <span className="material-symbols-outlined text-xl">{isListening ? 'mic' : 'mic_none'}</span>
            {isListening && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Text Input Box */}
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to speech...'
                : `Type in ${activeLangName} or English (${selectedScenario} roleplay)...`
            }
            className={`flex-1 px-4 py-3 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all ${
              isDarkMode
                ? 'bg-[#0b0f17] border-slate-800 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />

          {/* Submit / Stop Button */}
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStopStreaming}
              className="p-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors cursor-pointer"
              title="Stop Generating"
            >
              <span className="material-symbols-outlined text-xl">stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className={`p-3 rounded-xl font-bold text-white shadow-lg transition-all cursor-pointer ${
                !inputMsg.trim()
                  ? 'bg-slate-600 opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25 active:scale-95'
              }`}
              title="Send Message"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          )}
        </form>
      </footer>
    </div>
  );
};
