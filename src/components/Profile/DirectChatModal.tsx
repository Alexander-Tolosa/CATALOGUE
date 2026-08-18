import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Circle } from 'lucide-react';
import { useFriendsStore } from '../../store/useFriendsStore';
import { useAppStore } from '../../store/useAppStore';

export const DirectChatModal: React.FC = () => {
  const { isDarkMode } = useAppStore();
  const {
    friends,
    onlineCommunity,
    chatMessages,
    activeChatFriendId,
    setActiveChatFriendId,
    sendChatMessage
  } = useFriendsStore();

  const [chatInputText, setChatInputText] = useState('');

  const activeChatFriend = useMemo(() => {
    if (!activeChatFriendId) return null;
    return (
      friends.find((f) => f.id === activeChatFriendId) ||
      onlineCommunity.find((u) => u.id === activeChatFriendId) ||
      null
    );
  }, [friends, onlineCommunity, activeChatFriendId]);

  const activeChatList = useMemo(() => {
    if (!activeChatFriendId) return [];
    return chatMessages[activeChatFriendId] || [];
  }, [chatMessages, activeChatFriendId]);

  if (!activeChatFriend) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatFriendId || !chatInputText.trim()) return;
    sendChatMessage(activeChatFriendId, chatInputText.trim());
    setChatInputText('');
  };

  const sendQuickPrompt = (prompt: string) => {
    if (!activeChatFriendId) return;
    sendChatMessage(activeChatFriendId, prompt);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 animate-fadeIn">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col h-[560px] ${
            isDarkMode ? 'bg-[#0f1422] border-[#222d46] text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-700/40 flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${activeChatFriend.avatarColor || 'from-sky-400 to-indigo-600'} flex items-center justify-center text-white font-black text-xs border border-white/20`}>
                  {activeChatFriend.avatarInitials || activeChatFriend.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0f1422]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                  {activeChatFriend.name}
                </h4>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Circle size={6} className="fill-emerald-400" /> Online • {activeChatFriend.program}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveChatFriendId(null)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Icebreaker Prompts */}
          <div className="px-4 py-2 border-b border-slate-800/40 bg-slate-900/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">Quick prompts:</span>
            <button
              onClick={() => sendQuickPrompt('🇰🇷 Want to practice Korean vocabulary together?')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-[#F06543]/20 hover:text-[#F06543] text-slate-300 text-[10px] font-bold shrink-0 transition-colors border border-slate-700/40 cursor-pointer"
            >
              🇰🇷 Practice Korean
            </button>
            <button
              onClick={() => sendQuickPrompt('📚 How is CSIT 223 going? Let us review together!')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-[#F06543]/20 hover:text-[#F06543] text-slate-300 text-[10px] font-bold shrink-0 transition-colors border border-slate-700/40 cursor-pointer"
            >
              📚 Review CSIT 223
            </button>
            <button
              onClick={() => sendQuickPrompt('🔥 Keep up the daily study streak!')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-[#F06543]/20 hover:text-[#F06543] text-slate-300 text-[10px] font-bold shrink-0 transition-colors border border-slate-700/40 cursor-pointer"
            >
              🔥 Streak Boost
            </button>
          </div>

          {/* Chat Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="text-center my-2">
              <span className="text-[10px] bg-slate-800/60 text-slate-400 px-3 py-1 rounded-full font-semibold">
                Direct Encrypted Study Connection
              </span>
            </div>

            {activeChatList.map((msg) => {
              const isMe = msg.senderId === 'current_user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      isMe
                        ? 'bg-[#F06543] text-white rounded-br-xs shadow-md'
                        : isDarkMode
                        ? 'bg-slate-800/90 text-slate-100 rounded-bl-xs border border-slate-700/40'
                        : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-700/40 bg-slate-900/40 flex items-center gap-2">
            <input
              type="text"
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              placeholder={`Message ${activeChatFriend.name}...`}
              className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs outline-none border transition-colors focus:ring-2 focus:ring-[#F06543]/40 ${
                isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
            <button
              type="submit"
              disabled={!chatInputText.trim()}
              className="w-10 h-10 rounded-xl bg-[#F06543] hover:bg-[#E05432] disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-md transition-all cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
