import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store user identity from Google Identity Services OIDC token
export const storeUserFromGoogleToken = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    picture: v.string(),
    googleSubId: v.string()
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_googleSubId", (q) => q.eq("googleSubId", args.googleSubId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        picture: args.picture
      });
      return existing._id;
    }

    // Insert new user authenticated via Google OIDC
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      picture: args.picture,
      googleSubId: args.googleSubId,
      createdAt: new Date().toISOString()
    });

    // Initialize user track & streak in Convex
    await ctx.db.insert("userTracks", {
      userId: userId,
      language: "ko",
      currentUnit: 1,
      dailyGoal: 10
    });

    await ctx.db.insert("streaks", {
      userId: userId,
      currentStreak: 12,
      longestStreak: 12,
      lastActiveDate: new Date().toISOString().split("T")[0]
    });

    await ctx.db.insert("kleoState", {
      userId: userId,
      bondXp: 780,
      mood: "happy",
      equippedCosmetics: JSON.stringify({ hat: "chef_hat" }),
      unlockedCosmetics: JSON.stringify(["chef_hat", "cyber_glass", "red_scarf"])
    });

    return userId;
  }
});

export const getUserByGoogleSubId = query({
  args: { googleSubId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_googleSubId", (q) => q.eq("googleSubId", args.googleSubId))
      .first();
  }
});
