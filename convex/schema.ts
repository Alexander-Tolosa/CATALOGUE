import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    picture: v.string(),
    googleSubId: v.string(),
    createdAt: v.string()
  }).index("by_googleSubId", ["googleSubId"])
    .index("by_email", ["email"]),

  userTracks: defineTable({
    userId: v.string(),
    language: v.string(), // 'ko' | 'ja' | 'en'
    currentUnit: v.number(),
    dailyGoal: v.number()
  }).index("by_userId_language", ["userId", "language"]),

  lessons: defineTable({
    language: v.string(),
    unit: v.number(),
    order: v.number(),
    type: v.string(),
    xpReward: v.number(),
    title: v.string(),
    description: v.string()
  }).index("by_language", ["language"]),

  userProgress: defineTable({
    userId: v.string(),
    lessonId: v.string(),
    status: v.string(), // 'locked' | 'unlocked' | 'completed'
    completedAt: v.optional(v.string())
  }).index("by_userId", ["userId"]),

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

  streaks: defineTable({
    userId: v.string(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActiveDate: v.string()
  }).index("by_userId", ["userId"]),

  kleoState: defineTable({
    userId: v.string(),
    bondXp: v.number(),
    mood: v.string(),
    equippedCosmetics: v.string(), // JSON string
    unlockedCosmetics: v.string()  // JSON string
  }).index("by_userId", ["userId"]),

  chatMessages: defineTable({
    userId: v.string(),
    role: v.string(), // 'user' | 'assistant'
    content: v.string(),
    createdAt: v.string()
  }).index("by_userId", ["userId"])
});
