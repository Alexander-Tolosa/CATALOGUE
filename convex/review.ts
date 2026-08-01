import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getReviewItems = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviewItems")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  }
});

export const addReviewItem = mutation({
  args: {
    userId: v.string(),
    term: v.string(),
    translation: v.string(),
    language: v.string(),
    phonetic: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviewItems", {
      userId: args.userId,
      term: args.term,
      translation: args.translation,
      language: args.language,
      phonetic: args.phonetic,
      interval: 1,
      easeFactor: 2.5,
      nextReviewAt: new Date().toISOString().split("T")[0]
    });
  }
});

export const rateReviewItem = mutation({
  args: {
    itemId: v.id("reviewItems"),
    rating: v.string() // 'again' | 'hard' | 'good' | 'easy'
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) return;

    let newInterval = item.interval;
    if (args.rating === 'again') newInterval = 1;
    else if (args.rating === 'hard') newInterval = Math.max(1, Math.round(item.interval * 1.2));
    else if (args.rating === 'good') newInterval = Math.max(1, Math.round(item.interval * 2.0));
    else if (args.rating === 'easy') newInterval = Math.max(1, Math.round(item.interval * 2.5));

    await ctx.db.patch(args.itemId, { interval: newInterval });
  }
});
