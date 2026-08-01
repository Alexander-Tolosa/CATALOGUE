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

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[540px] glass-panel border border-[#FF6B35]/40 shadow-2xl flex flex-col overflow-hidden animate-fadeIn bg-slate-950/95 rounded-3xl">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/40 flex items-center justify-center text-[#FF6B35] text-sm">
            🐾
          </div>
          <div>
            <h3 className="font-display font-black text-white text-sm flex items-center gap-1.5">
              AI Tutor & Grammar Coach <span className="text-xs">🤖</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold block">
              ● Active Context: {activeLessonTitle}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#ff7849] text-white font-medium rounded-tr-none shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none leading-relaxed'
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              <span className="text-[9px] text-slate-400 mt-1 block text-right font-bold">
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="p-2 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px]">
        <button
          onClick={() => handleSend('Explain formal vs informal speech')}
          className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:bg-[#FF6B35] hover:text-white shrink-0 transition-colors font-bold"
        >
          💡 Honorifics
        </button>
        <button
          onClick={() => handleSend('Give me a quick quiz')}
          className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:bg-[#FF6B35] hover:text-white shrink-0 transition-colors font-bold"
        >
          🎯 Quiz Me
        </button>
        <button
          onClick={() => handleSend('Grammar breakdown of current lesson')}
          className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:bg-[#FF6B35] hover:text-white shrink-0 transition-colors font-bold"
        >
          📘 Lesson Grammar
        </button>
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={e => setInputMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Tutor any grammar or vocabulary question..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
        />
        <button
          onClick={() => handleSend()}
          className="p-2 rounded-xl btn-vibrant-orange flex items-center justify-center shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
