import { mutation } from "./_generated/server";

export const seedInitialData = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Check if demo user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "demo@catalogue.edu"))
      .first();

    let userId = existingUser?._id;

    if (!existingUser) {
      // Create primary demo user
      userId = await ctx.db.insert("users", {
        email: "demo@catalogue.edu",
        name: "Alexander Tolosa",
        picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        googleSubId: "usr-demo-001",
        createdAt: new Date().toISOString()
      });

      // Create rich profile
      await ctx.db.insert("profiles", {
        userId: userId,
        fullName: "Alexander Tolosa",
        username: "alextolosa",
        statusMessage: "Mastering Korean & Japanese on CATALOGUE 🚀",
        pronouns: "he/him",
        roleBadge: "Senior Learner",
        bio: "Full-stack developer and language enthusiast exploring Korean grammar and Japanese kanji.",
        studentId: "2024-IT-0042",
        department: "College of Liberal Arts, Sciences and Education (CLASE)",
        program: "Information Technology",
        yearLevel: "3rd Year",
        email: "demo@catalogue.edu",
        phone: "+63 912 345 6789",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      });

      // Create language tracks (Korean, Japanese, English)
      await ctx.db.insert("userTracks", {
        userId: userId,
        language: "ko",
        currentUnit: 2,
        dailyGoal: 20,
        minutesCompletedToday: 15,
        xp: 420,
        level: 3
      });

      await ctx.db.insert("userTracks", {
        userId: userId,
        language: "ja",
        currentUnit: 1,
        dailyGoal: 15,
        minutesCompletedToday: 10,
        xp: 180,
        level: 2
      });

      // Create streaks
      await ctx.db.insert("streaks", {
        userId: userId,
        currentStreak: 5,
        longestStreak: 14,
        lastActiveDate: new Date().toISOString().split("T")[0]
      });

      // Create Kleo Siamese cat companion state
      await ctx.db.insert("kleoState", {
        userId: userId,
        bondXp: 350,
        mood: "happy",
        equippedCosmetics: JSON.stringify(["collar_blue", "glasses_vintage"]),
        unlockedCosmetics: JSON.stringify(["collar_blue", "glasses_vintage", "scarf_cozy"])
      });

      // Create sample certificate
      await ctx.db.insert("certificates", {
        userId: userId,
        userName: "Alexander Tolosa",
        languageName: "Korean",
        languageCode: "ko",
        levelName: "Foundations & Hangul Alphabet",
        levelCode: "A1",
        certificateCode: "CAT-KO-A1-8821",
        pdfUrl: "/api/certificates/CAT-KO-A1-8821.pdf",
        issuedAt: new Date().toISOString()
      });

      // Create SRS Spaced Repetition items
      await ctx.db.insert("reviewItems", {
        userId: userId,
        term: "안녕하세요",
        translation: "Hello / Formal greeting",
        language: "ko",
        phonetic: "an-nyeong-ha-se-yo",
        interval: 3,
        easeFactor: 2.5,
        nextReviewAt: new Date(Date.now() + 86400000).toISOString()
      });

      await ctx.db.insert("reviewItems", {
        userId: userId,
        term: "고양이",
        translation: "Cat",
        language: "ko",
        phonetic: "go-yang-i",
        interval: 5,
        easeFactor: 2.6,
        nextReviewAt: new Date(Date.now() + 172800000).toISOString()
      });
    }

    return {
      success: true,
      userId: userId,
      message: "Initial demo data seeded into Convex tables successfully!"
    };
  }
});
