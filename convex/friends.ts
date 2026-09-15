import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all friends for a given user
export const getFriends = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("friends")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  }
});

// Send or respond to a friend connection
export const setFriendStatus = mutation({
  args: {
    userId: v.string(),
    friendUserId: v.string(),
    status: v.string() // 'pending' | 'accepted' | 'declined'
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("friends")
      .withIndex("by_userId_friend", (q) =>
        q.eq("userId", args.userId).eq("friendUserId", args.friendUserId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { status: args.status });
      return existing._id;
    }

    return await ctx.db.insert("friends", {
      userId: args.userId,
      friendUserId: args.friendUserId,
      status: args.status,
      createdAt: new Date().toISOString()
    });
  }
});

// Get direct messages between two users
export const getFriendMessages = query({
  args: {
    user1Id: v.string(),
    user2Id: v.string()
  },
  handler: async (ctx, args) => {
    const sent = await ctx.db
      .query("friendMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.user1Id).eq("receiverId", args.user2Id)
      )
      .collect();

    const received = await ctx.db
      .query("friendMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.user2Id).eq("receiverId", args.user1Id)
      )
      .collect();

    return [...sent, ...received].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
});

// Send a direct message
export const sendFriendMessage = mutation({
  args: {
    senderId: v.string(),
    receiverId: v.string(),
    text: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("friendMessages", {
      senderId: args.senderId,
      receiverId: args.receiverId,
      text: args.text,
      timestamp: new Date().toISOString()
    });
  }
});
