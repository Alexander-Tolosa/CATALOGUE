import { create } from 'zustand';
import { FriendUser, FriendRequest, FriendChatMessage } from '../types';

export const INITIAL_FRIENDS: FriendUser[] = [
  {
    id: 'friend-1',
    name: 'Paulo Miguel Tolosa',
    avatarColor: 'from-amber-400 to-orange-500',
    avatarInitials: 'PT',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'online',
    statusMessage: 'Reviewing daily Korean flashcards 🇰🇷',
    targetLanguage: 'ko',
    level: 4,
    streakDays: 8,
    isOnline: true,
    lastActive: 'Just now',
    bio: 'BSIT 2C | Web dev and Korean language learner.',
    interests: ['HCI Design', 'Korean', 'Web Development']
  },
  {
    id: 'friend-2',
    name: 'ASHJAN QUIMPO',
    avatarColor: 'from-sky-400 to-blue-600',
    avatarInitials: 'AQ',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'in_lesson',
    statusMessage: 'In Lesson: Japanese Foundations Unit 2 🇯🇵',
    targetLanguage: 'ja',
    level: 3,
    streakDays: 12,
    isOnline: true,
    lastActive: '5 mins ago',
    bio: 'CLASE IT | Learning Japanese for anime and tech.',
    interests: ['Japanese', 'Cybersecurity', 'Gaming']
  },
  {
    id: 'friend-3',
    name: 'ADRIAN JUSTIN SALINAS',
    avatarColor: 'from-emerald-400 to-teal-600',
    avatarInitials: 'AS',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'offline',
    statusMessage: 'Away - Working on HCI prototype',
    targetLanguage: 'en',
    level: 5,
    streakDays: 15,
    isOnline: false,
    lastActive: '2 hours ago',
    bio: 'CSIT 223 classmate. UI/UX fanatic.',
    interests: ['Figma', 'English', 'Algorithms']
  },
  {
    id: 'friend-4',
    name: 'MATTHEW TABAT',
    avatarColor: 'from-purple-400 to-indigo-600',
    avatarInitials: 'MT',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'online',
    statusMessage: 'Practicing pronunciation in Kleo Chatroom 🐾',
    targetLanguage: 'ko',
    level: 5,
    streakDays: 6,
    isOnline: true,
    lastActive: 'Just now',
    bio: 'CLASE BSIT 2C. Aiming for Top 1 on the weekly leaderboard!',
    interests: ['Korean', 'Mobile Apps', 'AI Tutors']
  },
  {
    id: 'friend-5',
    name: 'DEGHNE GABRIEL AGANA',
    avatarColor: 'from-rose-400 to-pink-600',
    avatarInitials: 'DA',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'online',
    statusMessage: 'Translating Korean drama phrases 🎬',
    targetLanguage: 'ko',
    level: 3,
    streakDays: 4,
    isOnline: true,
    lastActive: '12 mins ago',
    bio: 'BSIT sophomore. Coffee & language lover.',
    interests: ['Hangul', 'Database Systems', 'Travel']
  },
  {
    id: 'friend-6',
    name: 'Maria Elena Santos',
    avatarColor: 'from-yellow-400 to-amber-600',
    avatarInitials: 'MS',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Foreign Languages & Linguistics',
    status: 'online',
    statusMessage: 'Studying Japanese N5 Kanji',
    targetLanguage: 'ja',
    level: 7,
    streakDays: 24,
    isOnline: true,
    lastActive: 'Just now',
    bio: 'Linguistics major | Let us practice conversational Japanese!',
    interests: ['Japanese Kanji', 'Language Exchange', 'Reading']
  },
  {
    id: 'friend-7',
    name: 'Kenji Sato',
    avatarColor: 'from-cyan-400 to-blue-500',
    avatarInitials: 'KS',
    department: 'International Exchange Program',
    program: 'Computer Science & Software Eng',
    status: 'online',
    statusMessage: 'Learning Tagalog and English! 🇵🇭',
    targetLanguage: 'en',
    level: 8,
    streakDays: 30,
    isOnline: true,
    lastActive: '1 min ago',
    bio: 'Exchange student from Osaka. Happy to help with Japanese!',
    interests: ['Japanese', 'English', 'Game Dev']
  },
  {
    id: 'friend-8',
    name: 'Min-ji Park',
    avatarColor: 'from-fuchsia-400 to-purple-600',
    avatarInitials: 'MP',
    department: 'International Exchange Program',
    program: 'Information Systems',
    status: 'online',
    statusMessage: 'Native Korean | Let us study together! ✨',
    targetLanguage: 'en',
    level: 9,
    streakDays: 42,
    isOnline: true,
    lastActive: 'Just now',
    bio: 'Seoul University exchange student. Studying in CLASE this term.',
    interests: ['Korean Banmal/Jondaetmal', 'HCI', 'Music']
  },
  {
    id: 'friend-9',
    name: 'Joshua David Reyes',
    avatarColor: 'from-teal-400 to-emerald-600',
    avatarInitials: 'JR',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'offline',
    statusMessage: 'Studying for midterm exams',
    targetLanguage: 'ko',
    level: 2,
    streakDays: 3,
    isOnline: false,
    lastActive: 'Yesterday',
    bio: 'BSIT 2C student.',
    interests: ['Networking', 'Korean Basics']
  },
  {
    id: 'friend-10',
    name: 'Samantha Nicole Cruz',
    avatarColor: 'from-red-400 to-rose-600',
    avatarInitials: 'SC',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Secondary Education',
    status: 'online',
    statusMessage: 'Reviewing Araling Panlipunan notes',
    targetLanguage: 'en',
    level: 4,
    streakDays: 9,
    isOnline: true,
    lastActive: '10 mins ago',
    bio: 'Future educator & language enthusiast.',
    interests: ['Pedagogy', 'English Grammar', 'History']
  },
  {
    id: 'friend-11',
    name: 'Christian Dave Tan',
    avatarColor: 'from-lime-400 to-green-600',
    avatarInitials: 'CT',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'offline',
    statusMessage: 'Offline',
    targetLanguage: 'ja',
    level: 2,
    streakDays: 1,
    isOnline: false,
    lastActive: '3 hours ago',
    bio: 'BSIT student.',
    interests: ['Databases', 'Japanese Hiragana']
  },
  {
    id: 'friend-12',
    name: 'Bea Alonzo Rivera',
    avatarColor: 'from-sky-400 to-indigo-500',
    avatarInitials: 'BR',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Communication Arts',
    status: 'online',
    statusMessage: 'Practicing speech dialogue in CATALOGUE 🎙️',
    targetLanguage: 'ko',
    level: 5,
    streakDays: 11,
    isOnline: true,
    lastActive: '4 mins ago',
    bio: 'Comm Arts major | Media & foreign broadcasting.',
    interests: ['Public Speaking', 'Korean', 'Broadcasting']
  },
  {
    id: 'friend-13',
    name: 'Rafael Luis Mendoza',
    avatarColor: 'from-orange-400 to-amber-600',
    avatarInitials: 'RM',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'offline',
    statusMessage: 'Coding web systems',
    targetLanguage: 'ko',
    level: 3,
    streakDays: 5,
    isOnline: false,
    lastActive: '4 hours ago',
    bio: 'BSIT 2C. Frontend engineering.',
    interests: ['React', 'Korean', 'Tailwind']
  },
  {
    id: 'friend-14',
    name: 'Sophia Angela Lim',
    avatarColor: 'from-violet-400 to-purple-600',
    avatarInitials: 'SL',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'online',
    statusMessage: 'Active - Completed 3 lessons today! 🎉',
    targetLanguage: 'ja',
    level: 6,
    streakDays: 18,
    isOnline: true,
    lastActive: 'Just now',
    bio: 'CLASE BSIT. Passionate about learning Japanese Kanji.',
    interests: ['Japanese', 'HCI', 'Cloud Computing']
  }
];

export const INITIAL_ONLINE_COMMUNITY: FriendUser[] = [
  {
    id: 'comm-1',
    name: 'Yuto Takahashi',
    avatarColor: 'from-blue-500 to-cyan-400',
    avatarInitials: 'YT',
    department: 'Waseda University Exchange',
    program: 'Global Information Studies',
    status: 'online',
    statusMessage: 'Online 🟢 | Looking for English & Tagalog study buddies!',
    targetLanguage: 'en',
    level: 7,
    streakDays: 21,
    mutualFriendsCount: 3,
    isOnline: true,
    lastActive: 'Online now',
    bio: 'Exchange student from Tokyo. Let us do language exchange!',
    interests: ['Japanese', 'English', 'Photography', 'Travel']
  },
  {
    id: 'comm-2',
    name: 'Chae-won Lee',
    avatarColor: 'from-rose-500 to-pink-400',
    avatarInitials: 'CL',
    department: 'Yonsei University Exchange',
    program: 'Computer Science',
    status: 'online',
    statusMessage: 'Online 🟢 | Practicing English for tech presentations',
    targetLanguage: 'en',
    level: 8,
    streakDays: 35,
    mutualFriendsCount: 4,
    isOnline: true,
    lastActive: 'Online now',
    bio: 'Seoul native studying IT in the Philippines. I can help with Korean grammar!',
    interests: ['Korean', 'AI', 'UI/UX Design', 'K-Pop']
  },
  {
    id: 'comm-3',
    name: 'Carlos Miguel Garcia',
    avatarColor: 'from-amber-500 to-orange-400',
    avatarInitials: 'CG',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'online',
    statusMessage: 'Online 🟢 | Studying for CSIT 223 Exam & Korean 101',
    targetLanguage: 'ko',
    level: 3,
    streakDays: 7,
    mutualFriendsCount: 6,
    isOnline: true,
    lastActive: 'Online now',
    bio: 'CLASE BSIT 2C classmate. Let us conquer the skill tree together!',
    interests: ['CSIT 223', 'Korean', 'Full Stack', 'Gaming']
  },
  {
    id: 'comm-4',
    name: 'Hannah Grace Villar',
    avatarColor: 'from-emerald-500 to-teal-400',
    avatarInitials: 'HV',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Foreign Languages & Linguistics',
    status: 'online',
    statusMessage: 'Online 🟢 | Daily streak challenge 14 days!',
    targetLanguage: 'ja',
    level: 5,
    streakDays: 14,
    mutualFriendsCount: 2,
    isOnline: true,
    lastActive: 'Online now',
    bio: 'Studying Japanese Hiragana & Katakana foundations in CATALOGUE.',
    interests: ['Japanese', 'Linguistics', 'Anime', 'Manga']
  },
  {
    id: 'comm-5',
    name: 'Liam Oliver Vance',
    avatarColor: 'from-indigo-500 to-purple-400',
    avatarInitials: 'LV',
    department: 'Global Polyglot Network',
    program: 'International Relations',
    status: 'online',
    statusMessage: 'Online 🟢 | Trilingual learner (EN, KO, JA)',
    targetLanguage: 'ko',
    level: 12,
    streakDays: 80,
    mutualFriendsCount: 5,
    isOnline: true,
    lastActive: 'Online now',
    bio: 'Learning Korean and Japanese concurrently. Spaced repetition enthusiast.',
    interests: ['Spaced Repetition', 'Korean', 'Japanese', 'History']
  },
  {
    id: 'comm-6',
    name: 'Aira Mae Del Rosario',
    avatarColor: 'from-violet-500 to-fuchsia-400',
    avatarInitials: 'AD',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    status: 'online',
    statusMessage: 'Online 🟢 | Reviewing flashcards on spaced repetition deck',
    targetLanguage: 'ko',
    level: 4,
    streakDays: 9,
    mutualFriendsCount: 8,
    isOnline: true,
    lastActive: 'Online now',
    bio: 'BSIT 2B student. Language learning makes coding more fun!',
    interests: ['Web Apps', 'Korean', 'Design Systems']
  }
];

export const INITIAL_REQUESTS: FriendRequest[] = [
  {
    id: 'req-1',
    fromUser: {
      id: 'req-user-1',
      name: 'Lucas Chen',
      avatarColor: 'from-sky-500 to-indigo-600',
      avatarInitials: 'LC',
      department: 'National Taiwan University Exchange',
      program: 'Information Management',
      status: 'online',
      targetLanguage: 'ko',
      level: 4,
      streakDays: 10,
      isOnline: true,
      bio: 'Hi Alexander! I noticed you are also studying CSIT and Korean. Let us connect!'
    },
    timestamp: '15 mins ago',
    message: 'Hey Alexander! Saw your profile in CLASE IT & Korean study circle. Would love to study together!',
    status: 'pending'
  },
  {
    id: 'req-2',
    fromUser: {
      id: 'req-user-2',
      name: 'Patricia Gomez',
      avatarColor: 'from-pink-500 to-rose-600',
      avatarInitials: 'PG',
      department: 'College of Liberal Arts, Sciences and Education (CLASE)',
      program: 'Information Technology (CLASE)',
      status: 'online',
      targetLanguage: 'ja',
      level: 3,
      streakDays: 5,
      isOnline: true,
      bio: 'CLASE BSIT 2A. Practicing Japanese writing foundations.'
    },
    timestamp: '2 hours ago',
    message: 'Hello classmate! Let us be friends on CATALOGUE to share study streaks!',
    status: 'pending'
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, FriendChatMessage[]> = {
  'friend-1': [
    {
      id: 'msg-1',
      senderId: 'friend-1',
      text: 'Hey Alexander! How are your CSIT 223 HCI wireframes coming along?',
      timestamp: '10:30 AM'
    },
    {
      id: 'msg-2',
      senderId: 'current_user',
      text: 'Going great! Working on the user profile and dark mode design right now.',
      timestamp: '10:32 AM'
    },
    {
      id: 'msg-3',
      senderId: 'friend-1',
      text: 'Awesome! Did you review your Korean phrases with Kleo today too?',
      timestamp: '10:35 AM'
    }
  ],
  'friend-2': [
    {
      id: 'msg-4',
      senderId: 'friend-2',
      text: 'Konnichiwa Alexander! Let us practice Hiragana stroke orders later! 🇯🇵',
      timestamp: 'Yesterday'
    },
    {
      id: 'msg-5',
      senderId: 'current_user',
      text: 'Sounds great Ashjan, I just finished the stroke tracing module!',
      timestamp: 'Yesterday'
    }
  ],
  'friend-4': [
    {
      id: 'msg-6',
      senderId: 'friend-4',
      text: 'Hey man! I saw you earned the Exam BADGE for CSIT 223, congrats! 🏆',
      timestamp: '2 hours ago'
    }
  ]
};

interface FriendsStoreState {
  friends: FriendUser[];
  onlineCommunity: FriendUser[];
  friendRequests: FriendRequest[];
  sentRequestUserIds: string[];
  chatMessages: Record<string, FriendChatMessage[]>;
  activeChatFriendId: string | null;
  
  // Actions
  sendFriendRequest: (user: FriendUser) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  cancelSentRequest: (userId: string) => void;
  removeFriend: (friendId: string) => void;
  setActiveChatFriendId: (friendId: string | null) => void;
  sendChatMessage: (friendId: string, text: string) => void;
}

export const useFriendsStore = create<FriendsStoreState>((set, get) => ({
  friends: (() => {
    const saved = localStorage.getItem('catalogue_friends_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_FRIENDS;
  })(),

  onlineCommunity: INITIAL_ONLINE_COMMUNITY,

  friendRequests: (() => {
    const saved = localStorage.getItem('catalogue_friend_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REQUESTS;
  })(),

  sentRequestUserIds: (() => {
    const saved = localStorage.getItem('catalogue_sent_friend_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  })(),

  chatMessages: (() => {
    const saved = localStorage.getItem('catalogue_friend_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CHAT_MESSAGES;
  })(),

  activeChatFriendId: null,

  sendFriendRequest: (user: FriendUser) => {
    const currentSent = get().sentRequestUserIds;
    if (currentSent.includes(user.id)) return;

    const updatedSent = [...currentSent, user.id];
    localStorage.setItem('catalogue_sent_friend_requests', JSON.stringify(updatedSent));
    set({ sentRequestUserIds: updatedSent });
  },

  acceptFriendRequest: (requestId: string) => {
    const { friendRequests, friends, chatMessages } = get();
    const req = friendRequests.find((r) => r.id === requestId);
    if (!req) return;

    const newFriend: FriendUser = {
      ...req.fromUser,
      id: req.fromUser.id,
      status: 'online',
      isOnline: true,
      lastActive: 'Just now'
    };

    const updatedFriends = [newFriend, ...friends];
    const updatedRequests = friendRequests.filter((r) => r.id !== requestId);

    // Initial greeting message in chat
    const updatedChats = {
      ...chatMessages,
      [newFriend.id]: [
        {
          id: `msg-${Date.now()}`,
          senderId: newFriend.id,
          text: `Hi Alexander! Thanks for accepting my friend request. Happy to connect and study together! 🎉`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    localStorage.setItem('catalogue_friends_list', JSON.stringify(updatedFriends));
    localStorage.setItem('catalogue_friend_requests', JSON.stringify(updatedRequests));
    localStorage.setItem('catalogue_friend_chats', JSON.stringify(updatedChats));

    set({
      friends: updatedFriends,
      friendRequests: updatedRequests,
      chatMessages: updatedChats
    });
  },

  declineFriendRequest: (requestId: string) => {
    const updatedRequests = get().friendRequests.filter((r) => r.id !== requestId);
    localStorage.setItem('catalogue_friend_requests', JSON.stringify(updatedRequests));
    set({ friendRequests: updatedRequests });
  },

  cancelSentRequest: (userId: string) => {
    const updatedSent = get().sentRequestUserIds.filter((id) => id !== userId);
    localStorage.setItem('catalogue_sent_friend_requests', JSON.stringify(updatedSent));
    set({ sentRequestUserIds: updatedSent });
  },

  removeFriend: (friendId: string) => {
    const updatedFriends = get().friends.filter((f) => f.id !== friendId);
    localStorage.setItem('catalogue_friends_list', JSON.stringify(updatedFriends));
    set({ friends: updatedFriends });
  },

  setActiveChatFriendId: (friendId: string | null) => {
    set({ activeChatFriendId: friendId });
  },

  sendChatMessage: (friendId: string, text: string) => {
    if (!text.trim()) return;

    const currentChat = get().chatMessages[friendId] || [];
    const newMsg: FriendChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current_user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = {
      ...get().chatMessages,
      [friendId]: [...currentChat, newMsg]
    };

    localStorage.setItem('catalogue_friend_chats', JSON.stringify(updatedChats));
    set({ chatMessages: updatedChats });

    // Intelligent automated friend reply simulation after 1.5s
    const targetFriend = get().friends.find((f) => f.id === friendId);
    if (targetFriend) {
      setTimeout(() => {
        const smartReplies = [
          `That's great! Let's keep our study streak going today! 🔥`,
          `안녕하세요! I was just practicing in the CATALOGUE review deck.`,
          `Agreed! Let's review the CSIT 223 notes together before class.`,
          `Awesome job on your language progress! 🐾`,
          `Sounds like a plan! Let me know when you want to practice speaking.`
        ];
        const randomReply = smartReplies[Math.floor(Math.random() * smartReplies.length)];

        const replyMsg: FriendChatMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: friendId,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const repliesUpdated = {
          ...get().chatMessages,
          [friendId]: [...(get().chatMessages[friendId] || []), replyMsg]
        };

        localStorage.setItem('catalogue_friend_chats', JSON.stringify(repliesUpdated));
        set({ chatMessages: repliesUpdated });
      }, 1400);
    }
  }
}));
