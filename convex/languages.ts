import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Language & Level reference data lives client-side (static).
 * These queries handle the user-specific progress overlay
 * so the frontend can merge them together.
 *
 * We intentionally keep language/level/quiz definitions as static
 * client data (in src/data/) to avoid seeding Convex with large
 * reference datasets. Only user-generated records are persisted.
 */

// Retrieve all progress records for a user across all languages
export const getAllUserProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  }
});

// Retrieve user track (XP, level, daily goal) for a language
export const getUserTrack = query({
  args: {
    userId: v.string(),
    language: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userTracks")
      .withIndex("by_userId_language", (q) =>
        q.eq("userId", args.userId).eq("language", args.language)
      )
      .first();
  }
});

// Retrieve all tracks for a user (for dashboard overview)
export const getAllUserTracks = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userTracks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  }
});

// Retrieve user's streak data
export const getUserStreak = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("streaks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  }
});
