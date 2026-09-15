import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Retrieve user's completed/unlocked levels for a language track
export const getUserProgress = query({
  args: {
    userId: v.string(),
    languageCode: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProgress")
      .withIndex("by_userId_language", (q) =>
        q.eq("userId", args.userId).eq("languageCode", args.languageCode)
      )
      .collect();
  }
});

// Submit quiz result and update progress
export const submitQuizResult = mutation({
  args: {
    userId: v.string(),
    languageCode: v.string(),
    levelId: v.string(),
    score: v.number(),
    passed: v.boolean()
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_userId_level", (q) =>
        q.eq("userId", args.userId).eq("levelId", args.levelId)
      )
      .first();

    const completedAt = args.passed ? new Date().toISOString() : undefined;

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.passed ? "passed" : existing.status,
        bestScore: Math.max(existing.bestScore ?? 0, args.score),
        completedAt: args.passed ? (existing.completedAt ?? completedAt) : existing.completedAt
      });
      return existing._id;
    }

    return await ctx.db.insert("userProgress", {
      userId: args.userId,
      languageCode: args.languageCode,
      levelId: args.levelId,
      status: args.passed ? "passed" : "in_progress",
      bestScore: args.score,
      completedAt
    });
  }
});

// Update user track activity and daily goal
export const updateUserTrack = mutation({
  args: {
    userId: v.string(),
    language: v.string(),
    dailyGoal: v.optional(v.number()),
    minutesCompletedToday: v.optional(v.number()),
    xpToAdd: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const track = await ctx.db
      .query("userTracks")
      .withIndex("by_userId_language", (q) =>
        q.eq("userId", args.userId).eq("language", args.language)
      )
      .first();

    if (track) {
      const currentXp = track.xp ?? 0;
      const newXp = currentXp + (args.xpToAdd ?? 0);
      const newLevel = Math.floor(newXp / 100) + 1;

      await ctx.db.patch(track._id, {
        dailyGoal: args.dailyGoal ?? track.dailyGoal,
        minutesCompletedToday: (track.minutesCompletedToday ?? 0) + (args.minutesCompletedToday ?? 0),
        xp: newXp,
        level: newLevel
      });
      return track._id;
    } else {
      return await ctx.db.insert("userTracks", {
        userId: args.userId,
        language: args.language,
        currentUnit: 1,
        dailyGoal: args.dailyGoal ?? 10,
        minutesCompletedToday: args.minutesCompletedToday ?? 0,
        xp: args.xpToAdd ?? 0,
        level: 1
      });
    }
  }
});
