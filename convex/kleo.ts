import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getKleoState = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("kleoState")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  }
});

export const updateKleoBond = mutation({
  args: {
    userId: v.string(),
    xpAmount: v.number(),
    mood: v.string()
  },
  handler: async (ctx, args) => {
    const kleo = await ctx.db
      .query("kleoState")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (kleo) {
      await ctx.db.patch(kleo._id, {
        bondXp: kleo.bondXp + args.xpAmount,
        mood: args.mood
      });
    }
  }
});
