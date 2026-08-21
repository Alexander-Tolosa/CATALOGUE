import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, HelpCircle, BookOpen } from 'lucide-react';
import { checkAndCensorText, triggerEthicalWarning } from '../../lib/ethicalGuard';
import kleoChatbotLogo from '../../assets/kleo_chatbot_logo.png';

interface AIChatboxProps {
  currentLanguage: string;
}

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
};

export const AIChatbox: React.FC<AIChatboxProps> = ({ currentLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I'm your AI Language Coach & Kleo's Tutor Assistant! Ask me anything about ${
        currentLanguage === 'ko' ? 'Korean' : currentLanguage === 'ja' ? 'Japanese' : 'English'
      } grammar, cultural honorifics, or word usage!`,
      timestamp: 'Just now'
    }
  ]);

  const handleSend = (userQuery?: string) => {
    const rawText = userQuery || inputMsg;
    if (!rawText.trim()) return;

    const check = checkAndCensorText(rawText);
    if (check.hasInappropriate) {
      triggerEthicalWarning();
    }
    const textToSend = check.censoredText;

    const userMsgObj: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsgObj]);
    if (!userQuery) setInputMsg('');

    // Simulated LLM context-aware AI tutor response
    setTimeout(() => {
      let replyText = "That's a great question! In Korean/Japanese culture, politeness levels express respect toward the listener.";

      const queryLower = textToSend.toLowerCase();
      if (queryLower.includes('formal') || queryLower.includes('polite') || queryLower.includes('honorific')) {
        replyText = "**Formal Speech Tip**: In Korean, adding '~요' (~yo) to verb stems makes your speech politely casual (존댓말). For official settings or speaking to elders, use '~입니다' (~imnida). In Japanese, adding 'です' (desu) or 'ます' (masu) serves the exact same polite purpose!";
      } else if (queryLower.includes('cat') || queryLower.includes('kleo')) {
        replyText = "Cat in Korean is 고양이 (Goyangi, pronounced go-yang-ee). In Japanese, it is 猫 (Neko)! Kleo is a Siamese cat with bright blue sapphire eyes!";
      } else if (queryLower.includes('quiz') || queryLower.includes('test')) {
        replyText = "**Quick Quiz**: How do you say 'Thank you' politely in Korean?\nA) 감사해요 (Gamsahaeyo)\nB) 감사합니다 (Gamsahamnida)\nReply with your pick!";
      } else {
        replyText = `Regarding "${textToSend}": Remember to practice writing the script characters first in our Foundations module, then assemble basic syllable blocks! Feel free to ask more!`;
      }

      const aiMsgObj: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsgObj]);
    }, 800);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#FF6B35] to-[#f97316] shadow-2xl border-2 border-white/80 dark:border-slate-800 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          title="Open AI Language Tutor Chat"
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            <img src={kleoChatbotLogo} alt="Kleo AI Tutor" className="w-full h-full object-cover" />
          </div>
        </button>
      )}

      {/* Sliding Persistent Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[520px] glass-panel border border-sky-500/40 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-sky-500/50 shadow-md">
                <img src={kleoChatbotLogo} alt="Kleo AI" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-brand font-bold text-slate-100 text-sm flex items-center gap-1">
                  AI Language Coach
                </h3>
                <span className="text-xs text-emerald-400 font-medium">● Context-aware online</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
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
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-sky-700/80 mt-1 shadow-2xs">
                    <img src={kleoChatbotLogo} alt="Kleo" className="w-full h-full object-cover" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] text-xs md:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[10px] opacity-60 block text-right mt-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask grammar, culture, or vocabulary..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
