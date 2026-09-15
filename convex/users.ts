import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Store or sync user identity from Google Identity Services OIDC token
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

      // Ensure profile exists for existing user
      const existingProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", existing._id))
        .first();

      if (!existingProfile) {
        await ctx.db.insert("profiles", {
          userId: existing._id,
          fullName: args.name,
          email: args.email,
          avatarUrl: args.picture,
          statusMessage: "Learning on CATALOGUE!",
          bio: "Passionate language learner."
        });
      }

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

    // Initialize personal profile for the user
    await ctx.db.insert("profiles", {
      userId: userId,
      fullName: args.name,
      email: args.email,
      avatarUrl: args.picture,
      statusMessage: "Learning on CATALOGUE!",
      bio: "Language learner exploring the world through words."
    });

    // Initialize user track & streak in Convex with fresh baseline
    await ctx.db.insert("userTracks", {
      userId: userId,
      language: "ko",
      currentUnit: 1,
      dailyGoal: 10,
      minutesCompletedToday: 0,
      xp: 0,
      level: 1
    });

    await ctx.db.insert("streaks", {
      userId: userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      historyDates: JSON.stringify([new Date().toISOString().split("T")[0]])
    });

    await ctx.db.insert("kleoState", {
      userId: userId,
      bondXp: 0,
      mood: "happy",
      equippedCosmetics: JSON.stringify({ hat: "blue_beret" }),
      unlockedCosmetics: JSON.stringify(["blue_beret"])
    });

    return userId;
  }
});

// Retrieve user by Google sub ID
export const getUserByGoogleSubId = query({
  args: { googleSubId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_googleSubId", (q) => q.eq("googleSubId", args.googleSubId))
      .first();
  }
});

// Retrieve user by Convex internal ID
export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Attempt fetching directly if it is a valid Convex ID
    try {
      return await ctx.db.get(args.userId as any);
    } catch {
      return null;
    }
  }
});

// Retrieve profile for user
export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  }
});

// Update personal profile
export const updateUserProfile = mutation({
  args: {
    userId: v.string(),
    fullName: v.optional(v.string()),
    username: v.optional(v.string()),
    statusMessage: v.optional(v.string()),
    pronouns: v.optional(v.string()),
    roleBadge: v.optional(v.string()),
    bio: v.optional(v.string()),
    studentId: v.optional(v.string()),
    department: v.optional(v.string()),
    program: v.optional(v.string()),
    yearLevel: v.optional(v.string()),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    address: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    connections: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    recentAvatars: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const { userId, ...fieldsToUpdate } = args;

    if (profile) {
      await ctx.db.patch(profile._id, fieldsToUpdate);
      return profile._id;
    } else {
      return await ctx.db.insert("profiles", {
        userId,
        fullName: args.fullName || "Learner",
        ...fieldsToUpdate
      });
    }
  }
});

// Retrieve currently authenticated user and profile via Convex Auth session
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return {
      userId,
      user,
      profile
    };
  }
});
