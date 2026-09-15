import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Core user table
  users: defineTable({
    email: v.string(),
    name: v.string(),
    picture: v.optional(v.string()),
    googleSubId: v.optional(v.string()),
    createdAt: v.string()
  }).index("by_googleSubId", ["googleSubId"])
    .index("by_email", ["email"]),

  // Detailed personal profile for multi-tenant users
  profiles: defineTable({
    userId: v.string(),
    fullName: v.string(),
    username: v.optional(v.string()),
    statusMessage: v.optional(v.string()),
    pronouns: v.optional(v.string()),
    roleBadge: v.optional(v.string()),
    bio: v.optional(v.string()),
    studentId: v.optional(v.string()),
    department: v.optional(v.string()),
    program: v.optional(v.string()),
    yearLevel: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    address: v.optional(v.string()),
    emergencyContact: v.optional(v.string()), // JSON string { name, relationship, phone }
    connections: v.optional(v.string()),      // JSON string array of UserConnection
    avatarUrl: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    recentAvatars: v.optional(v.string())     // JSON string array of recent avatars
  }).index("by_userId", ["userId"]),

  // Language tracks for user
  userTracks: defineTable({
    userId: v.string(),
    language: v.string(), // 'ko' | 'ja' | 'en'
    currentUnit: v.number(),
    dailyGoal: v.number(),
    minutesCompletedToday: v.optional(v.number()),
    xp: v.optional(v.number()),
    level: v.optional(v.number())
  }).index("by_userId_language", ["userId", "language"])
    .index("by_userId", ["userId"]),

  // Interactive lessons metadata
  lessons: defineTable({
    language: v.string(),
    unit: v.number(),
    order: v.number(),
    type: v.string(),
    xpReward: v.number(),
    title: v.string(),
    description: v.string()
  }).index("by_language", ["language"]),

  // Proficiency roadmap & milestone progress
  userProgress: defineTable({
    userId: v.string(),
    languageCode: v.string(), // 'ko' | 'ja' | 'en'
    levelId: v.string(),      // e.g. 'ko-lvl-1', 'ja-lvl-2'
    status: v.string(),       // 'locked' | 'in_progress' | 'passed'
    bestScore: v.optional(v.number()),
    completedAt: v.optional(v.string())
  }).index("by_userId", ["userId"])
    .index("by_userId_language", ["userId", "languageCode"])
    .index("by_userId_level", ["userId", "levelId"]),

  // Verified proficiency certificates
  certificates: defineTable({
    userId: v.string(),
    userName: v.string(),
    languageName: v.string(),
    languageCode: v.string(),
    levelName: v.string(),
    levelCode: v.string(),
    certificateCode: v.string(), // e.g. 'CAT-KO-L1-8821'
    pdfUrl: v.string(),
    issuedAt: v.string()
  }).index("by_userId", ["userId"])
    .index("by_certificateCode", ["certificateCode"]),

  // Spaced Repetition (SM-2) flashcard items
  reviewItems: defineTable({
    userId: v.string(),
    term: v.string(),
    translation: v.string(),
    language: v.string(),
    phonetic: v.optional(v.string()),
    interval: v.number(),
    easeFactor: v.number(),
    nextReviewAt: v.string()
  }).index("by_userId", ["userId"]),

  // Activity streaks
  streaks: defineTable({
    userId: v.string(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActiveDate: v.string(),
    historyDates: v.optional(v.string()) // JSON array of YYYY-MM-DD
  }).index("by_userId", ["userId"]),

  // Kleo Siamese cat companion state
  kleoState: defineTable({
    userId: v.string(),
    bondXp: v.number(),
    mood: v.string(),
    equippedCosmetics: v.string(), // JSON string
    unlockedCosmetics: v.string()  // JSON string
  }).index("by_userId", ["userId"]),

  // AI chat tutor messages
  chatMessages: defineTable({
    userId: v.string(),
    role: v.string(), // 'user' | 'assistant'
    content: v.string(),
    createdAt: v.string()
  }).index("by_userId", ["userId"]),

  // Social / Friends
  friends: defineTable({
    userId: v.string(),
    friendUserId: v.string(),
    status: v.string(), // 'pending' | 'accepted' | 'declined'
    createdAt: v.string()
  }).index("by_userId", ["userId"])
    .index("by_userId_friend", ["userId", "friendUserId"]),

  // Direct encrypted friend messaging
  friendMessages: defineTable({
    senderId: v.string(),
    receiverId: v.string(),
    text: v.string(),
    timestamp: v.string()
  }).index("by_receiver", ["receiverId"])
    .index("by_conversation", ["senderId", "receiverId"])
});
