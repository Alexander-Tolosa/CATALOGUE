import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useKleoStore } from '../../store/useKleoStore';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import { isAllowedTopic, STANDARD_REFUSAL_RESPONSE } from '../../lib/kleoPrompt';
import {
  DocumentFile,
  DEFAULT_KNOWLEDGE_BASE,
  chunkText,
  retrieveContext,
  RAGRetrievalResult
} from '../../lib/ragEngine';

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
}

export const KleoChatRoomView: React.FC = () => {
  const { isDarkMode, profile, addXP } = useAppStore();
  const { mood, equippedCosmetics, react, addBondXp } = useKleoStore();

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // RAG Response Generation with Word-by-Word Streaming
  const handleSend = (textInput?: string) => {
    const text = textInput || inputMsg;
    if (!text.trim() || isStreaming) return;

    const userMsgObj: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsgObj]);
    if (!textInput) setInputMsg('');
    setIsStreaming(true);

    react('correct');

    // Perform RAG Vector / Keyword Search over active documents
    const ragResult: RAGRetrievalResult = retrieveContext(text, documents, 3);

    // Determine AI response text based on query & context
    let fullResponseText = '';
    const q = text.toLowerCase();

    if (!isAllowedTopic(text)) {
      fullResponseText = STANDARD_REFUSAL_RESPONSE;
      react('welcome');
    } else {
      addXP(10);
      addBondXp(15);
      react('celebrate');

      if (ragResult.snippets.length > 0) {
        // Cited RAG response
        fullResponseText = `Meow~ 🐾 Based on your active Knowledge Base files (${ragResult.citedSources.map(s => s.docName).join(', ')}):

${ragResult.snippets.map(s => `> "${s.text}"`).join('\n\n')}

### RAG Summary & Grammar Breakdown:
- **Core Concept**: The retrieved documents emphasize natural usage and structured markers in **${activeLangName}**.
- **Usage Tip**: Remember to practice these structures in your daily lessons!

Meow! Check the cited source badges below for exact page references! 🐾`;
      } else if (q.includes('formal') || q.includes('polite') || q.includes('honorific')) {
        fullResponseText = `Meow~ 🐾 Here is your complete guide to **Formal vs. Informal Speech** in Asian languages!

### 1. Korean (존댓말 - Jondaetmal vs 반말 - Banmal)
- **Friendly Polite (~요)**: Add **~요** to verb stems (e.g., 고마워요 *Gomawoyo* = Thank you).
- **Formal Speech (~입니다)**: Used in broadcasting/news/business (e.g., 감사합니다 *Gamsahamnida*).
- **Casual (반말)**: Used only with close peers or younger people (e.g., 고마워 *Gomawo*).

### 2. Japanese (丁寧語 - Teineigo vs タメ口 - Tameguchi)
- **Polite (です/ます)**: Use **です** (desu) for nouns/adjectives and **ます** (masu) for verbs.
- **Casual**: Drop desu/masu (e.g., ありがとう *Arigatou* vs ありがとう御座います *Arigatou gozaimasu*).

Meow~ 🐾 Always default to polite speech when talking to elders or strangers!`;
      } else if (q.includes('quiz') || q.includes('test')) {
        fullResponseText = `Meow~ 🐾 Time for a quick language challenge!

**Question**: Which phrase is the polite way to say *"Excuse me / Where is the bathroom?"* in Japanese?
- **A)** ラーメンを食べます (Ramen o tabemasu)
- **B)** お手洗いはどこですか？ (O-tearai wa doko desu ka?)
- **C)** 猫が好きです (Neko ga suki desu)

*Reply with your answer and I'll score it for you!* 🐾`;
      } else if (q.includes('particle') || q.includes('grammar')) {
        fullResponseText = `Meow~ 🐾 Essential Japanese & Korean Particles Breakdown:

### Japanese Core Particles:
- **は (wa)**: Topic marker (e.g. 私は学生です - *Watashi wa gakusei desu*).
- **を (o)**: Direct object marker (e.g. お茶を飲みます - *Ocha o nomimasu*).
- **に (ni)**: Direction / Time marker (e.g. 東京に行きます - *Tokyo ni ikimasu*).

### Korean Core Particles:
- **은/는 (eun/neun)**: Topic markers.
- **이/가 (i/ga)**: Subject markers.
- **을/를 (eul/reul)**: Object markers.

Meow! Master these markers to unlock natural sentence structures! 🐾`;
      } else {
        fullResponseText = `Meow~ 🐾 I'm Kleo, your expert RAG-enabled AI Language Coach for **${activeLangName}**!

- **Knowledge Retrieval**: Upload PDF, Markdown, or text files using the (+) button to ask questions about custom grammar notes.
- **Grammar & Sentence Analysis**: Ask me to break down verb conjugations or honorific endings.
- **Interactive Practice**: Ask for a quick quiz or conversational dialogue exercise.

How can I help you master ${activeLangName} today? 🐾`;
      }
    }

    // Stream word-by-word into chat
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
      }
    }, 40);
  };

  // Stop Generating
  const handleStopStreaming = () => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setIsStreaming(false);
  };

  // Regenerate Last Response
  const handleRegenerate = () => {
    if (isStreaming || messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    }
  };

  // Clear Chat History
  const handleClearHistory = () => {
    if (confirm('Clear entire Kleo chat history?')) {
      setMessages([]);
      localStorage.removeItem('catalouge_rag_chat_history');
    }
  };

  // File Upload Handler (PDF, TXT, DOCX, MD)
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

  // Delete Document from Knowledge Base
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
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);
    setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Copy to Clipboard
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
      alert('Voice recognition is not supported in this browser. Please use Google Chrome or Edge.');
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

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] max-h-screen overflow-hidden ${
      isDarkMode ? 'bg-[#0b0f17] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Header Bar */}
      <header className={`px-4 py-3 border-b flex items-center justify-between gap-4 shrink-0 shadow-xs backdrop-blur-md ${
        isDarkMode ? 'bg-[#111827]/90 border-[#1e293b]' : 'bg-white/90 border-slate-200'
      }`}>
        {/* Left Avatar & Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FF6B35]/5 border border-[#FF6B35]/40 flex items-center justify-center p-1 shadow-md">
            <KleoAvatar mood={mood} equippedCosmetics={equippedCosmetics} size={40} />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111827] shadow-xs" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-base md:text-lg tracking-tight text-white flex items-center gap-1.5">
                Kleo AI Chat Room <span className="text-sm">🐾</span>
              </h2>
              <span className="bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                RAG Vector Engine Active
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Context: {activeLangName} Foundations ({documents.length} Docs Loaded)
            </span>
          </div>
        </div>

        {/* Right Header Utilities & Knowledge Base Drawer Toggle */}
        <div className="flex items-center gap-2">
          {/* Knowledge Base Drawer Toggle Button */}
          <button
            onClick={() => setIsContextDrawerOpen(!isContextDrawerOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isContextDrawerOpen
                ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                : isDarkMode
                ? 'bg-[#1e293b] border-[#334155] text-slate-200 hover:border-[#FF6B35]'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-[#FF6B35]'
            }`}
          >
            <span className="material-symbols-outlined text-base">description</span>
            <span>Knowledge Base ({documents.length})</span>
          </button>

          {/* Clear History Button */}
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Clear Chat History"
            >
              <span className="material-symbols-outlined text-base">delete_sweep</span>
            </button>
          )}
        </div>
      </header>

      {/* Active Knowledge Base Drawer Panel */}
      <AnimatePresence>
        {isContextDrawerOpen && (
          <motion.aside
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`px-4 py-3 border-b text-xs overflow-hidden shrink-0 ${
              isDarkMode ? 'bg-[#131b2e] border-[#1e293b]' : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#FF6B35] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">folder_open</span>
                Active Knowledge Base Files (RAG Context Window)
              </span>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-vibrant-orange px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">upload_file</span>
                Upload Document
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                    isDarkMode ? 'bg-[#0b0f17] border-[#1e293b]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[#FF6B35] text-base shrink-0">
                      description
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-white truncate text-[11px]">{doc.name}</span>
                      <span className="text-[9px] text-slate-400">
                        {doc.chunks.length} Chunks • {(doc.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove from RAG index"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Canvas Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          /* Empty / Welcome State (Claude-like centered layout) */
          <div className="max-w-2xl mx-auto my-6 flex flex-col items-center text-center space-y-6 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative w-28 h-28 rounded-full border-4 border-[#FF6B35]/30 p-2 bg-[#161b2b] flex items-center justify-center shadow-2xl"
            >
              <KleoAvatar mood="happy" equippedCosmetics={equippedCosmetics} size={90} />
              <span className="absolute -bottom-2 bg-[#FF6B35] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase">
                RAG Engine 🐾
              </span>
            </motion.div>

            <div className="space-y-2">
              <h1 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
                Good day! How can Kleo assist your language learning today? 🐾
              </h1>
              <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                Your AI Siamese Cat Language Tutor for **{activeLangName}**, Japanese, and English. Ask questions or upload documents for custom RAG knowledge retrieval!
              </p>
            </div>

            {/* Quick Suggested Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2 text-left">
              <button
                onClick={() => handleSend('Explain Japanese particles & sentence structure')}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 ${
                  isDarkMode
                    ? 'bg-[#131b2e] border-[#1e293b] hover:border-[#FF6B35]/60 hover:bg-[#192238]'
                    : 'bg-white border-slate-200 hover:border-[#FF6B35]/60 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2 text-[#FF6B35] font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  <span>Explain Japanese Particles</span>
                </div>
                <p className="text-xs text-slate-400">
                  Break down は, を, に, and で with natural example sentences.
                </p>
              </button>

              <button
                onClick={() => handleSend('Practice Korean greetings & polite speech')}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 ${
                  isDarkMode
                    ? 'bg-[#131b2e] border-[#1e293b] hover:border-[#FF6B35]/60 hover:bg-[#192238]'
                    : 'bg-white border-slate-200 hover:border-[#FF6B35]/60 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2 text-[#FF6B35] font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">forum</span>
                  <span>Practice Korean Greetings</span>
                </div>
                <p className="text-xs text-slate-400">
                  Learn polite 존댓말 speech and daily expressions.
                </p>
              </button>

              <button
                onClick={() => handleSend('Give me a vocabulary quiz for active lesson')}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 ${
                  isDarkMode
                    ? 'bg-[#131b2e] border-[#1e293b] hover:border-[#FF6B35]/60 hover:bg-[#192238]'
                    : 'bg-white border-slate-200 hover:border-[#FF6B35]/60 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2 text-[#FF6B35] font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">quiz</span>
                  <span>Review Active Vocabulary</span>
                </div>
                <p className="text-xs text-slate-400">
                  Test your recall with interactive multiple-choice questions.
                </p>
              </button>

              <button
                onClick={() => handleSend('Explain formal vs informal honorifics')}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 ${
                  isDarkMode
                    ? 'bg-[#131b2e] border-[#1e293b] hover:border-[#FF6B35]/60 hover:bg-[#192238]'
                    : 'bg-white border-slate-200 hover:border-[#FF6B35]/60 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2 text-[#FF6B35] font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">school</span>
                  <span>Formal vs Informal Honorifics</span>
                </div>
                <p className="text-xs text-slate-400">
                  Understand social hierarchy and polite speech rules.
                </p>
              </button>
            </div>
          </div>
        ) : (
          /* Active Chat Stream View */
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {m.sender === 'ai' && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FF6B35]/5 border border-[#FF6B35]/40 flex items-center justify-center p-0.5 shrink-0 shadow-sm">
                      <KleoAvatar mood="happy" equippedCosmetics={equippedCosmetics} size={32} />
                    </div>
                  )}

                  <div className={`p-4 rounded-2xl space-y-3 text-xs md:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#ff7849] text-white font-medium rounded-tr-none shadow-lg'
                      : isDarkMode
                      ? 'bg-[#131b2e] border border-[#1e293b] text-slate-200 rounded-tl-none shadow-md'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}>
                    {/* Message Content */}
                    <div className="whitespace-pre-line leading-relaxed font-sans">{m.text}</div>

                    {/* Cited Source Badges (RAG Context) */}
                    {m.citedSources && m.citedSources.length > 0 && (
                      <div className="pt-2 border-t border-[#FF6B35]/20">
                        <button
                          onClick={() => setExpandedSources(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                          className="flex items-center gap-1.5 text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">bookmark</span>
                          <span>Referenced Context ({m.citedSources.length} Document Sources)</span>
                          <span className="material-symbols-outlined text-xs">
                            {expandedSources[m.id] ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>

                        <AnimatePresence>
                          {expandedSources[m.id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 space-y-1.5"
                            >
                              {m.citedSources.map((src, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded-xl bg-[#0b0f19]/80 border border-[#1e293b] text-[10px] text-slate-300 space-y-1"
                                >
                                  <div className="flex items-center justify-between font-bold text-[#FF6B35]">
                                    <span>📄 {src.docName}</span>
                                    <span>Page {src.pageNumber || 1}</span>
                                  </div>
                                  <p className="italic text-slate-400">"{src.previewText}"</p>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Message Actions Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] opacity-80">
                      <span>{m.timestamp}</span>

                      {m.sender === 'ai' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakText(m.id, m.text)}
                            className={`p-1 rounded-md transition-colors cursor-pointer ${
                              isSpeakingId === m.id
                                ? 'text-[#FF6B35] font-bold animate-pulse'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Read Aloud (TTS)"
                          >
                            <span className="material-symbols-outlined text-sm">
                              {isSpeakingId === m.id ? 'volume_up' : 'volume_mute'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleCopy(m.id, m.text)}
                            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                            title="Copy text"
                          >
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                            {copiedId === m.id && (
                              <span className="text-[9px] text-emerald-400 font-bold">Copied!</span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isStreaming && (
              <div className="flex items-center gap-3 text-slate-400 text-xs animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/40 flex items-center justify-center p-0.5">
                  <KleoAvatar mood="curious" equippedCosmetics={equippedCosmetics} size={28} />
                </div>
                <span>Kleo is streaming response with RAG context... 🐾</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Bottom Floating Input Bar & Utilities */}
      <footer className={`p-4 border-t shrink-0 ${
        isDarkMode ? 'bg-[#0b0f17] border-[#1e293b]' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Stop / Regenerate Utilities Bar */}
          <div className="flex items-center justify-center gap-3 text-xs font-bold">
            {isStreaming ? (
              <button
                onClick={handleStopStreaming}
                className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">stop_circle</span>
                <span>Stop Generating</span>
              </button>
            ) : messages.length > 0 ? (
              <button
                onClick={handleRegenerate}
                className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>Regenerate Response</span>
              </button>
            ) : null}
          </div>

          <div className={`p-2 rounded-2xl border flex items-center gap-2 shadow-2xl transition-all ${
            isDarkMode
              ? 'bg-[#131b2e] border-[#1e293b] focus-within:border-[#FF6B35] focus-within:shadow-[0_0_20px_rgba(255,107,53,0.25)]'
              : 'bg-white border-slate-200 focus-within:border-[#FF6B35]'
          }`}>
            {/* Attachment (+) File Upload Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-[#FF6B35] hover:bg-slate-800/40 transition-colors cursor-pointer shrink-0"
              title="Upload PDF, DOCX, or MD to Knowledge Base"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
            </button>

            {/* Model Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                  isDarkMode
                    ? 'bg-[#0b0f19] border-[#1e293b] text-slate-300 hover:border-[#FF6B35]'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-[#FF6B35]'
                }`}
              >
                <span className="material-symbols-outlined text-sm text-[#FF6B35]">psychology</span>
                <span>
                  {selectedModel === 'rag'
                    ? 'RAG Vector Engine'
                    : selectedModel === 'pro'
                    ? 'Kleo Tutor Pro'
                    : 'Kleo Fast'}
                </span>
                <span className="material-symbols-outlined text-xs">expand_more</span>
              </button>

              <AnimatePresence>
                {isModelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 4 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`absolute bottom-full left-0 mb-2 w-52 p-1.5 rounded-xl border shadow-2xl z-50 text-xs ${
                      isDarkMode ? 'bg-[#131b2e] border-[#1e293b] text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <button
                      onClick={() => { setSelectedModel('rag'); setIsModelDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg font-bold hover:bg-[#FF6B35]/15 hover:text-[#FF6B35] transition-colors flex items-center justify-between"
                    >
                      <span>RAG Vector Engine</span>
                      {selectedModel === 'rag' && <span className="material-symbols-outlined text-sm text-[#FF6B35]">check</span>}
                    </button>
                    <button
                      onClick={() => { setSelectedModel('pro'); setIsModelDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg font-bold hover:bg-[#FF6B35]/15 hover:text-[#FF6B35] transition-colors flex items-center justify-between"
                    >
                      <span>Kleo Tutor Pro</span>
                      {selectedModel === 'pro' && <span className="material-symbols-outlined text-sm text-[#FF6B35]">check</span>}
                    </button>
                    <button
                      onClick={() => { setSelectedModel('fast'); setIsModelDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg font-bold hover:bg-[#FF6B35]/15 hover:text-[#FF6B35] transition-colors flex items-center justify-between"
                    >
                      <span>Kleo Fast Engine</span>
                      {selectedModel === 'fast' && <span className="material-symbols-outlined text-sm text-[#FF6B35]">check</span>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Text Area */}
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask Kleo or search RAG context for ${activeLangName}...`}
              className={`flex-1 bg-transparent px-2 py-2 text-xs md:text-sm font-medium focus:outline-none ${
                isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
              }`}
            />

            {/* Microphone Button */}
            <button
              onClick={startVoiceInput}
              className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
              title="Voice Speech-to-Text Input"
            >
              <span className="material-symbols-outlined text-xl">mic</span>
            </button>

            {/* Orange Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!inputMsg.trim() || isStreaming}
              className="btn-vibrant-orange p-2.5 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Hidden File Input for Document Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.docx,.md"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Upload Document Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-5 ${
                isDarkMode ? 'bg-[#131b2e] border-[#1e293b] text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FF6B35] text-xl">
                    upload_file
                  </span>
                  <h3 className="font-display font-bold text-base">
                    Upload to Kleo Knowledge Base
                  </h3>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#FF6B35]/40 hover:border-[#FF6B35] p-8 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer space-y-3 bg-[#0b0f19]/60 hover:bg-[#0b0f19] transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/20 border border-[#FF6B35]/40 flex items-center justify-center text-[#FF6B35]">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Click to upload document</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports PDF, TXT, DOCX, and Markdown (.md) files
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
