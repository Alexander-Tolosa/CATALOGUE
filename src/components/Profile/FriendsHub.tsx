import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  MessageSquare,
  Sparkles,
  Check,
  X,
  Send,
  Globe,
  Flame,
  GraduationCap,
  Clock,
  Circle,
  MoreVertical,
  UserCheck,
  Smile,
  BookOpen,
  Filter
} from 'lucide-react';
import { FriendUser, FriendRequest } from '../../types';
import { useFriendsStore } from '../../store/useFriendsStore';
import { useAppStore } from '../../store/useAppStore';

interface FriendsHubProps {
  initialTab?: 'my_friends' | 'add_friend' | 'requests';
  onClose?: () => void;
}

export const FriendsHub: React.FC<FriendsHubProps> = ({ initialTab = 'my_friends', onClose }) => {
  const { isDarkMode, profile } = useAppStore();
  const {
    friends,
    onlineCommunity,
    friendRequests,
    sentRequestUserIds,
    chatMessages,
    activeChatFriendId,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelSentRequest,
    setActiveChatFriendId,
    sendChatMessage,
    removeFriend
  } = useFriendsStore();

  const [activeTab, setActiveTab] = useState<'my_friends' | 'add_friend' | 'requests'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<'all' | 'ko' | 'ja' | 'en'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'classmates'>('all');
  const [chatInputText, setChatInputText] = useState('');

  // Active chat friend object
  const activeChatFriend = useMemo(() => {
    return friends.find((f) => f.id === activeChatFriendId) || null;
  }, [friends, activeChatFriendId]);

  const activeChatList = useMemo(() => {
    if (!activeChatFriendId) return [];
    return chatMessages[activeChatFriendId] || [];
  }, [chatMessages, activeChatFriendId]);

  // Filtered Friends
  const filteredFriends = useMemo(() => {
    return friends.filter((friend) => {
      const matchesSearch =
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (friend.statusMessage && friend.statusMessage.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLang = filterLanguage === 'all' || friend.targetLanguage === filterLanguage;
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'online' && (friend.status === 'online' || friend.status === 'in_lesson')) ||
        (filterStatus === 'classmates' && friend.department.includes('CLASE'));

      return matchesSearch && matchesLang && matchesStatus;
    });
  }, [friends, searchQuery, filterLanguage, filterStatus]);

  // Filtered Online Community
  const filteredCommunity = useMemo(() => {
    return onlineCommunity.filter((user) => {
      const isAlreadyFriend = friends.some((f) => f.id === user.id || f.name.toLowerCase() === user.name.toLowerCase());
      if (isAlreadyFriend) return false;

      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLang = filterLanguage === 'all' || user.targetLanguage === filterLanguage;
      return matchesSearch && matchesLang;
    });
  }, [onlineCommunity, friends, searchQuery, filterLanguage]);

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

  const getLanguagePill = (lang: string) => {
    switch (lang) {
      case 'ko':
        return <span className="bg-rose-500/15 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">🇰🇷 Korean</span>;
      case 'ja':
        return <span className="bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">🇯🇵 Japanese</span>;
      case 'en':
      default:
        return <span className="bg-sky-500/15 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">🇺🇸 English</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        isDarkMode ? 'bg-[#101625] border-[#1d273d] text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F06543]/20 text-[#F06543] text-[10px] font-black uppercase tracking-wider">
              Social Learning Hub
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <Circle size={8} className="fill-emerald-400 text-emerald-400 animate-pulse" />
              {friends.filter(f => f.isOnline).length} Friends Online Now
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-black flex items-center gap-2.5">
            <Users className="text-[#F06543]" size={28} /> Friends & Online Community
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Connect, study together, send friend requests to online learners, and chat in real-time to boost your study streaks!
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 shrink-0">
          <button
            onClick={() => setActiveTab('my_friends')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'my_friends'
                ? 'bg-[#F06543] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={15} />
            <span>My Friends ({friends.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add_friend')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'add_friend'
                ? 'bg-[#F06543] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus size={15} />
            <span>Meet & Add Friends</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`relative px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-[#F06543] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={15} />
            <span>Requests</span>
            {friendRequests.length > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                {friendRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        isDarkMode ? 'bg-[#101625] border-[#1d273d]' : 'bg-white border-slate-200'
      }`}>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'my_friends' ? 'Search friends by name or status...' : 'Search online learners or CLASE classmates...'}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium border transition-colors outline-none focus:ring-2 focus:ring-[#F06543]/40 ${
              isDarkMode ? 'bg-[#161f33] border-slate-700/60 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter size={12} /> Language:
            </span>
            {(['all', 'ko', 'ja', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setFilterLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  filterLanguage === lang
                    ? 'bg-[#F06543] text-white shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'all' ? 'All' : lang === 'ko' ? '🇰🇷 KO' : lang === 'ja' ? '🇯🇵 JA' : '🇺🇸 EN'}
              </button>
            ))}
          </div>

          {activeTab === 'my_friends' && (
            <div className="flex items-center gap-1 ml-2 border-l border-slate-700/50 pl-2">
              {(['all', 'online', 'classmates'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    filterStatus === st
                      ? 'bg-sky-500 text-white shadow-xs'
                      : isDarkMode
                      ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All Friends' : st === 'online' ? '🟢 Online' : '🎓 CLASE IT'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: MY FRIENDS */}
      {activeTab === 'my_friends' && (
        <div className="space-y-4">
          {filteredFriends.length === 0 ? (
            <div className={`p-10 rounded-3xl border text-center space-y-3 ${
              isDarkMode ? 'bg-[#101625] border-[#1d273d] text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}>
              <Users size={36} className="mx-auto text-slate-500" />
              <p className="font-bold text-sm">No friends match your search query.</p>
              <button
                onClick={() => { setSearchQuery(''); setFilterLanguage('all'); setFilterStatus('all'); }}
                className="text-xs text-[#F06543] font-bold hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFriends.map((friend) => (
                <motion.div
                  key={friend.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all hover:shadow-lg flex flex-col justify-between space-y-4 ${
                    isDarkMode ? 'bg-[#101625] border-[#1d273d] hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top: Avatar, Name, Status */}
                  <div className="flex items-start gap-3.5">
                    {/* Avatar with Status Indicator */}
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${friend.avatarColor || 'from-sky-400 to-indigo-600'} p-0.5 shadow-md flex items-center justify-center text-white font-black text-sm border-2 border-white/20`}>
                        {friend.avatarInitials || friend.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 ${
                          isDarkMode ? 'border-[#101625]' : 'border-white'
                        } ${
                          friend.status === 'online'
                            ? 'bg-emerald-500 ring-2 ring-emerald-500/30'
                            : friend.status === 'in_lesson'
                            ? 'bg-amber-400 ring-2 ring-amber-400/30'
                            : 'bg-slate-500'
                        }`}
                        title={friend.status === 'online' ? 'Online' : friend.status === 'in_lesson' ? 'In Lesson' : 'Offline'}
                      />
                    </div>

                    {/* Friend Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-sm text-slate-100 truncate hover:text-[#F06543] transition-colors">
                          {friend.name}
                        </h4>
                        {getLanguagePill(friend.targetLanguage)}
                      </div>

                      <p className="text-[11px] text-sky-400 font-semibold truncate mt-0.5">
                        {friend.program}
                      </p>

                      {friend.statusMessage && (
                        <p className="text-[11px] text-slate-300 dark:text-slate-300 font-medium italic mt-1 bg-slate-800/40 px-2 py-1 rounded-lg border border-slate-700/30 truncate">
                          "{friend.statusMessage}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle Stats: Level & Streaks */}
                  <div className="flex items-center justify-between text-xs py-2 border-t border-b border-slate-800/40">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-slate-400">Level <strong className="text-slate-200">{friend.level}</strong></span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Flame size={13} className="fill-amber-400" /> {friend.streakDays} Day Streak
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{friend.lastActive}</span>
                  </div>

                  {/* Bottom: Action Buttons (Chat & More) */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-1">
                      {friend.interests?.slice(0, 2).map((item, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400">
                          #{item}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveChatFriendId(friend.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#F06543] hover:bg-[#E05432] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <MessageSquare size={14} />
                      <span>Chat</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEET & ADD FRIENDS (ONLINE DISCOVERY) */}
      {activeTab === 'add_friend' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F06543]/20 flex items-center justify-center text-[#F06543]">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">Live Online Community Learners</h4>
                <p className="text-[11px] text-slate-400">
                  Connect with classmates from CLASE and global international language exchange students.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunity.map((user) => {
              const isSent = sentRequestUserIds.includes(user.id);
              return (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 shadow-sm ${
                    isDarkMode ? 'bg-[#101625] border-[#1d273d]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${user.avatarColor || 'from-sky-400 to-indigo-600'} p-0.5 shadow-md flex items-center justify-center text-white font-black text-sm border-2 border-white/20`}>
                        {user.avatarInitials || user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#101625] ring-2 ring-emerald-500/30" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-slate-100 truncate">
                          {user.name}
                        </h4>
                        {getLanguagePill(user.targetLanguage)}
                      </div>
                      <p className="text-[11px] text-sky-400 font-semibold truncate mt-0.5">
                        {user.department}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                        <Circle size={6} className="fill-emerald-400" /> Online now
                      </span>
                    </div>
                  </div>

                  {user.bio && (
                    <p className="text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/30 leading-relaxed">
                      {user.bio}
                    </p>
                  )}

                  {/* Mutual Friends & Streaks */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{user.mutualFriendsCount || 3} mutual friends</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Flame size={12} className="fill-amber-400" /> {user.streakDays}d Streak
                    </span>
                  </div>

                  {/* Add Friend Action Button */}
                  <div className="pt-2 border-t border-slate-800/40">
                    {isSent ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <Check size={15} /> Friend Request Sent
                        </span>
                        <button
                          onClick={() => cancelSentRequest(user.id)}
                          className="text-[11px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => sendFriendRequest(user)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#F06543] to-[#FF7849] hover:from-[#E05432] hover:to-[#F06543] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        <UserPlus size={15} />
                        <span>Add Friend / Connect</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FRIEND REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {friendRequests.length === 0 ? (
            <div className={`p-10 rounded-3xl border text-center space-y-3 ${
              isDarkMode ? 'bg-[#101625] border-[#1d273d] text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}>
              <UserCheck size={36} className="mx-auto text-emerald-400" />
              <p className="font-bold text-sm text-slate-200">You are all caught up!</p>
              <p className="text-xs text-slate-400">No pending incoming friend requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {friendRequests.map((req) => (
                <div
                  key={req.id}
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDarkMode ? 'bg-[#101625] border-[#1d273d]' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${req.fromUser.avatarColor || 'from-sky-400 to-indigo-600'} p-0.5 shadow-md flex items-center justify-center text-white font-black text-sm border-2 border-white/20 shrink-0`}>
                      {req.fromUser.avatarInitials || req.fromUser.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-100">{req.fromUser.name}</h4>
                        {getLanguagePill(req.fromUser.targetLanguage)}
                      </div>
                      <p className="text-[11px] text-sky-400 font-semibold">{req.fromUser.department}</p>
                      {req.message && (
                        <p className="text-xs text-slate-300 mt-1 bg-slate-800/40 p-2 rounded-lg border border-slate-700/30">
                          "{req.message}"
                        </p>
                      )}
                      <span className="text-[10px] text-slate-500 mt-1 block">Received {req.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => declineFriendRequest(req.id)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => acceptFriendRequest(req.id)}
                      className="px-5 py-2 rounded-xl bg-[#F06543] hover:bg-[#E05432] text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Check size={15} /> Accept Friend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DIRECT CHAT MODAL / MESSAGING DRAWER */}
      <AnimatePresence>
        {activeChatFriend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4">
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
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Icebreaker Prompts */}
              <div className="px-4 py-2 border-b border-slate-800/40 bg-slate-900/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-bold text-slate-400 shrink-0">Quick prompts:</span>
                <button
                  onClick={() => sendQuickPrompt('🇰🇷 Want to practice Korean vocabulary together?')}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-[#F06543]/20 hover:text-[#F06543] text-slate-300 text-[10px] font-bold shrink-0 transition-colors border border-slate-700/40"
                >
                  🇰🇷 Practice Korean
                </button>
                <button
                  onClick={() => sendQuickPrompt('📚 How is CSIT 223 going? Let us review together!')}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-[#F06543]/20 hover:text-[#F06543] text-slate-300 text-[10px] font-bold shrink-0 transition-colors border border-slate-700/40"
                >
                  📚 Review CSIT 223
                </button>
                <button
                  onClick={() => sendQuickPrompt('🔥 Keep up the daily study streak!')}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-[#F06543]/20 hover:text-[#F06543] text-slate-300 text-[10px] font-bold shrink-0 transition-colors border border-slate-700/40"
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
        )}
      </AnimatePresence>
    </div>
  );
};
