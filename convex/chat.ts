import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Retrieve chat message history for a user
export const getChatHistory = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  }
});

// Save a chat message (user or assistant)
export const saveChatMessage = mutation({
  args: {
    userId: v.string(),
    role: v.string(),
    content: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatMessages", {
      userId: args.userId,
      role: args.role,
      content: args.content,
      createdAt: new Date().toISOString()
    });
  }
});

// Clear chat history for a user
export const clearChatHistory = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  }
});
