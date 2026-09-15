import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Retrieve all certificates earned by a user
export const getUserCertificates = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("certificates")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  }
});

// Public verification query: Lookup certificate by unique code
export const getCertificateByCode = query({
  args: { certificateCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("certificates")
      .withIndex("by_certificateCode", (q) => q.eq("certificateCode", args.certificateCode))
      .first();
  }
});

// Issue and record a new certificate upon passing a final proficiency evaluation
export const issueCertificate = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    languageName: v.string(),
    languageCode: v.string(),
    levelName: v.string(),
    levelCode: v.string(),
    certificateCode: v.string(),
    pdfUrl: v.string()
  },
  handler: async (ctx, args) => {
    // Check if certificate with this code already exists
    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_certificateCode", (q) => q.eq("certificateCode", args.certificateCode))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("certificates", {
      userId: args.userId,
      userName: args.userName,
      languageName: args.languageName,
      languageCode: args.languageCode,
      levelName: args.levelName,
      levelCode: args.levelCode,
      certificateCode: args.certificateCode,
      pdfUrl: args.pdfUrl,
      issuedAt: new Date().toISOString()
    });
  }
});
