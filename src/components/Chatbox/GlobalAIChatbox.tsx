import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, HelpCircle, BookOpen } from 'lucide-react';
import { isAllowedTopic, STANDARD_REFUSAL_RESPONSE } from '../../lib/kleoPrompt';
import { useAppStore } from '../../store/useAppStore';

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
  const { isChatbotOpen, setIsChatbotOpen } = useAppStore();
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Meow~ I'm Kleo, your Siamese cat AI Language Tutor for CATalouge! I'm here to help you learn Japanese, Korean, and English. Ask me any grammar, vocabulary, or translation questions!`,
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

    // Process query with strict Kleo guardrails and persona
    setTimeout(() => {
      let replyText = '';

      if (!isAllowedTopic(textToSend)) {
        replyText = STANDARD_REFUSAL_RESPONSE;
      } else {
        const q = textToSend.toLowerCase();
        if (q.includes('formal') || q.includes('polite') || q.includes('honorific')) {
          replyText = `Meow~ Here is a breakdown of polite speech in Asian languages:

### 1. Korean (존댓말 - Jondaetmal)
- **Informal/Friendly**: Add **~요** (~yo) to the verb stem (e.g., 고마워요 - Gomawoyo).
- **Formal**: Use **~입니다** (~imnida) / **~습니까** (~seumnika) in official settings.

### 2. Japanese (丁寧語 - Teineigo)
- **Polite**: End sentences with **です** (desu) for nouns/adjectives or **ます** (masu) for verbs.

Meow~ Practice using polite endings when speaking to teachers or elders!`;
        } else if (q.includes('quiz') || q.includes('test')) {
          replyText = `Meow~ Time for a quick language quiz!

**Question**: What is the Korean word for "Cat" (Kleo's family)?
- A) 강아지 (Gangaji)
- B) 고양이 (Goyangi)
- C) 새 (Sae)

*Reply with your answer!*`;
        } else if (q.includes('translate') || q.includes('how do i say')) {
          replyText = `Meow~ In ${currentLanguage === 'ko' ? 'Korean' : currentLanguage === 'ja' ? 'Japanese' : 'English'}, here is how you express "${textToSend}":

- **Japanese**: 抹茶ラテをお願いします (Matcha rate o onegaishimasu)
- **Korean**: 말차 라떼 한 잔 주세요 (Malcha latte han jan juseyo)

Meow! Try saving this phrase to your Review Deck!`;
        } else {
          replyText = `Meow~ I'd love to help you master ${currentLanguage === 'ko' ? 'Korean' : currentLanguage === 'ja' ? 'Japanese' : 'English'}!

- **Vocabulary**: Practice your daily words in the **Skill Tree** module.
- **Writing**: Trace character strokes in the **Writing & Letters** module.
- **Review**: Keep your streak strong by reviewing saved cards in your **Review Deck**!

Ask me any specific grammar, pronunciation, or translation question!`;
        }
      }

      const aiMsgObj: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsgObj]);
    }, 600);
  };

  if (!isChatbotOpen) return null;

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
              Kleo AI Language Tutor <span className="text-xs">🐾</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold block">
              ● Active Context: {activeLessonTitle}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsChatbotOpen(false)}
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
          placeholder="Ask Kleo any Japanese, Korean, or English question..."
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
