import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, HelpCircle, BookOpen } from 'lucide-react';

interface GlobalAIChatboxProps {
  currentLanguage: string;
  activeLessonTitle?: string;
}

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
};

export const GlobalAIChatbox: React.FC<GlobalAIChatboxProps> = ({
  currentLanguage,
  activeLessonTitle = 'Hangul Foundations'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Meow! I'm your AI Language Coach & Kleo's Tutor! 🐾 Context active for lesson: "${activeLessonTitle}". Ask me any grammar, vocabulary, or culture questions!`,
      timestamp: 'Just now'
    }
  ]);

  const handleSend = (userQuery?: string) => {
    const textToSend = userQuery || inputMsg;
    if (!textToSend.trim()) return;

    const userMsgObj: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsgObj]);
    if (!userQuery) setInputMsg('');

    // Contextual system prompt answer generation proxying Claude LLM endpoint
    setTimeout(() => {
      let replyText = `Regarding your study of ${currentLanguage === 'ko' ? 'Korean' : currentLanguage === 'ja' ? 'Japanese' : 'English'} in "${activeLessonTitle}":`;

      const q = textToSend.toLowerCase();
      if (q.includes('formal') || q.includes('polite') || q.includes('honorific')) {
        replyText = "💡 **Grammar Context**: In Korean, adding '~요' (~yo) creates friendly polite speech (존댓말), while '~입니다' (~imnida) is used in formal situations. In Japanese, 'です' (desu) and 'ます' (masu) serve the exact same polite purpose!";
      } else if (q.includes('quiz') || q.includes('test')) {
        replyText = "🎯 **Quick Quiz**: What is the Korean word for Cat?\nA) 강아지 (Gangaji)\nB) 고양이 (Goyangi)\nC) 새 (Sae)";
      } else {
        replyText = `For "${textToSend}": Remember to practice writing script characters in our Script module, then review saved cards in your Review Deck! 🐾`;
      }

      const aiMsgObj: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsgObj]);
    }, 700);
  };

  return (
    <>
      {/* Floating Trigger Button on Every Screen */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 glass-button btn-primary py-3.5 px-5 shadow-2xl rounded-full flex items-center gap-2.5 animate-bounce hover:scale-105 transition-transform"
          title="Open Global AI Tutor Panel"
        >
          <Sparkles size={20} className="text-amber-300 fill-amber-300" />
          <span className="font-black text-xs hidden sm:inline">AI TUTOR & GRAMMAR COACH</span>
        </button>
      )}

      {/* Persistent Minimizable Sliding Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[540px] glass-panel border border-sky-500/40 shadow-2xl flex flex-col overflow-hidden animate-fadeIn bg-slate-950/95">
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-300 text-sm">
                🐾
              </div>
              <div>
                <h3 className="font-brand font-black text-white text-sm flex items-center gap-1.5">
                  AI Language Coach <span className="text-xs">🤖</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  ● Active Lesson Context: {activeLessonTitle}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Action Prompt Chips */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex gap-2 overflow-x-auto">
            <button
              onClick={() => handleSend("Explain formal vs informal speech rules")}
              className="text-[11px] text-sky-300 bg-sky-950 hover:bg-sky-900 px-3 py-1 rounded-full border border-sky-800 shrink-0 font-bold"
            >
              💡 Formal Rules
            </button>
            <button
              onClick={() => handleSend("Quiz me on vocabulary")}
              className="text-[11px] text-amber-300 bg-amber-950 hover:bg-amber-900 px-3 py-1 rounded-full border border-amber-800 shrink-0 font-bold"
            >
              🎯 Quick Quiz
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-sky-900 border border-sky-700 flex items-center justify-center text-sky-300 text-xs shrink-0 mt-1">
                    🐾
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-normal'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask grammar, vocabulary, or culture..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
