import { LanguageTrack } from '../../types';

export interface Translations {
  common: {
    appName: string;
    loading: string;
    save: string;
    cancel: string;
    close: string;
    edit: string;
    delete: string;
    back: string;
    next: string;
    done: string;
    gotIt: string;
    confirm: string;
    search: string;
    searchPlaceholder: string;
    points: string;
    xp: string;
    level: string;
    streak: string;
    days: string;
    dayStreak: string;
    hearts: string;
    gems: string;
    rank: string;
    viewProfile: string;
    allCaughtUp: string;
    online: string;
    offline: string;
    inLesson: string;
  };
  header: {
    toggleDarkMode: string;
    english: string;
    korean: string;
    japanese: string;
    activeLanguage: string;
    help: string;
    printPage: string;
    dayStreakTitle: string;
    messagesTitle: string;
    unreadTutorMessages: string;
    notificationsTitle: string;
    unreadNotifications: string;
    kleoTipOfDay: string;
    kleoTipContent: string;
    reviewReminderTitle: string;
    reviewReminderContent: string;
    streakMaintainedTitle: string;
    streakMaintainedContent: string;
    milestoneReachedTitle: string;
    milestoneReachedContent: string;
    helpTitle: string;
    helpSubtitle: string;
    dailyStreaksTitle: string;
    dailyStreaksDesc: string;
    kleoCompanionTitle: string;
    kleoCompanionDesc: string;
    spacedRepetitionTitle: string;
    spacedRepetitionDesc: string;
  };
  sidebar: {
    overview: string;
    skillTree: string;
    writingLetters: string;
    wordMatch: string;
    translator: string;
    scanTranslate: string;
    leaderboardStats: string;
    reviewDeck: string;
    kleoTutor: string;
    settings: string;
    logout: string;
    refreshDashboard: string;
  };
  logoutModal: {
    title: string;
    description: string;
    stayLoggedIn: string;
    confirmLogout: string;
    streakSafe: string;
  };
  dashboard: {
    welcome: string;
    trackSubtitle: string;
    bondLevel: string;
    speechBubbleReady: string;
    aiTutorMascot: string;
    dailyGoal: string;
    goalCompletedToday: string;
    goalFinished: string;
    minRemaining: string;
    lettersUnitTitle: string;
    startLesson: string;
    continueLesson: string;
    wordMatchCardTitle: string;
    wordMatchCardDesc: string;
    reviewCardTitle: string;
    reviewCardDesc: string;
    scriptCardTitle: string;
    scriptCardDesc: string;
    chatWithKleoTitle: string;
    chatWithKleoDesc: string;
    syllableBuilderTitle: string;
    syllableBuilderDesc: string;
    consonant: string;
    vowel: string;
    kanjiHiraganaBuilderTitle: string;
    kanjiHiraganaBuilderDesc: string;
    alphabetPhonicsBuilderTitle: string;
    alphabetPhonicsBuilderDesc: string;
  };
  calendar: {
    title: string;
    streakDaysLabel: string;
    streakSubtext: string;
    viewFullCalendar: string;
    closeCalendar: string;
    monthNames: string[];
    daysShort: string[];
    onlineFriendsTitle: string;
    onlineCount: string;
    chat: string;
    viewAllFriends: string;
    noFriendsOnline: string;
  };
  learn: {
    unit1: string;
    foundationHangul: string;
    foundationNihongo: string;
    foundationEnglish: string;
    masterScriptsDesc: string;
    mastered100: string;
    inProgress: string;
    locked: string;
    startHere: string;
    companionActive: string;
    guidebook: string;
    section1Unit1: string;
    microLessonsDesc: string;
    unitStats: string;
    unlockPro: string;
  };
  lesson: {
    questionOf: string;
    translatePrompt: string;
    selectCorrect: string;
    checkAnswer: string;
    continue: string;
    skip: string;
    correctTitle: string;
    correctGreatJob: string;
    greatJob: string;
    incorrectTitle: string;
    correctAnswerWas: string;
    lessonComplete: string;
    xpEarned: string;
    accuracy: string;
    finishLesson: string;
    outOfHearts: string;
    outOfHeartsDesc: string;
    refillHearts: string;
    answerSubmitted: string;
    nextExercise: string;
    kleoBond: string;
    collectRewards: string;
  };
  script: {
    title: string;
    hangulTitle: string;
    japaneseTitle: string;
    englishTitle: string;
    vowels: string;
    consonants: string;
    compoundVowels: string;
    hiragana: string;
    katakana: string;
    kanji: string;
    alphabet: string;
    phonics: string;
    strokeOrder: string;
    interactiveTracing: string;
    clearCanvas: string;
    soundPronunciation: string;
    exampleWord: string;
    practiceMode: string;
    romanization: string;
    continueToSkillTree: string;
  };
  matching: {
    title: string;
    subtitle: string;
    roundSize: string;
    quick: string;
    standard: string;
    master: string;
    chooseCategory: string;
    foodDrink: string;
    dailyItems: string;
    commonVerbs: string;
    colorsNumbers: string;
    score: string;
    timeLeft: string;
    combo: string;
    pairsLeft: string;
    restart: string;
    pause: string;
    resume: string;
    fantastic: string;
    gameOver: string;
    timeBonus: string;
    playAgain: string;
    backToCategories: string;
  };
  translator: {
    title: string;
    subtitle: string;
    sourceLang: string;
    targetLang: string;
    inputPlaceholder: string;
    placeholder: string;
    translateBtn: string;
    translateButton: string;
    translating: string;
    voiceInput: string;
    swapLanguages: string;
    listening: string;
    speak: string;
    copy: string;
    copied: string;
    saveToReview: string;
    savedToReview: string;
    saveToDeck: string;
    savedToDeck: string;
    clear: string;
    recentTranslations: string;
    noRecent: string;
    voiceTranslatorTitle: string;
  };
  scanner: {
    title: string;
    subtitle: string;
    uploadImage: string;
    uploadPhoto: string;
    openCamera: string;
    liveCamera: string;
    scanFrom: string;
    translateTo: string;
    snapAndTranslate: string;
    extractedText: string;
    listen: string;
    scanning: string;
    detectedText: string;
    translationResult: string;
    saveVocabulary: string;
    dragDropText: string;
    samplePhotos: string;
    confidence: string;
  };
  kleoHub: {
    title: string;
    subtitle: string;
    petKleo: string;
    bondStatus: string;
    wardrobe: string;
    equipped: string;
    head: string;
    neck: string;
    eyes: string;
    chatTab: string;
    scenariosTab: string;
    scenarioCafe: string;
    scenarioCafeDesc: string;
    scenarioDirections: string;
    scenarioDirectionsDesc: string;
    scenarioInterview: string;
    scenarioInterviewDesc: string;
    scenarioDaily: string;
    scenarioDailyDesc: string;
    startRoleplay: string;
    inputPlaceholder: string;
    send: string;
    quickPrompts: string;
    clearChat: string;
    listening: string;
  };
  gamify: {
    title: string;
    subtitle: string;
    consecutiveStreak: string;
    levelMaster: string;
    refillHearts: string;
    dailyGoalTitle: string;
    casual: string;
    regular: string;
    intense: string;
    heatmapTitle: string;
    leagueRankings: string;
    milestonesBadges: string;
    dailyQuests: string;
    quest1Title: string;
    quest1Desc: string;
    quest2Title: string;
    quest2Desc: string;
    quest3Title: string;
    quest3Desc: string;
    claimReward: string;
    claimed: string;
    weeklyLeague: string;
    leagueBronze: string;
    leagueSilver: string;
    leagueGold: string;
    leagueDiamond: string;
    leaderboardRank: string;
    achievements: string;
    badgeStreak: string;
    badgeStreakDesc: string;
    badgeScholar: string;
    badgeScholarDesc: string;
    badgePolyglot: string;
    badgePolyglotDesc: string;
    heartsStore: string;
    refillNow: string;
  };
  review: {
    title: string;
    subtitle: string;
    flipCard: string;
    listen: string;
    ratePrompt: string;
    complete: string;
    completeMsg: string;
    reviewAgain: string;
    cardsDue: string;
    startSession: string;
    showAnswer: string;
    again: string;
    hard: string;
    good: string;
    easy: string;
    savedCount: string;
    spacedRepetitionInfo: string;
    emptyDeck: string;
    allReviewed: string;
  };
  profile: {
    title: string;
    streakDays: string;
    totalXp: string;
    lessonsCompleted: string;
    studentInfo: string;
    fullName: string;
    studentId: string;
    department: string;
    program: string;
    yearLevel: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    emergencyContact: string;
    joinedDate: string;
    learningStats: string;
    completedLessons: string;
    editProfile: string;
    editProfileTitle: string;
    saveProfile: string;
    bio: string;
    friends: string;
    addFriend: string;
    sendMessage: string;
    awardsTitle: string;
    securityTitle: string;
  };
  settings: {
    title: string;
    subtitle: string;
    appearance: string;
    appearanceDesc: string;
    lightMode: string;
    darkMode: string;
    languageTrack: string;
    languageTrackDesc: string;
    korean: string;
    japanese: string;
    english: string;
    audioSpeed: string;
    soundEffects: string;
    soundEffectsDesc: string;
    studyReminders: string;
    studyRemindersDesc: string;
    accountDanger: string;
    resetProgress: string;
    resetProgressDesc: string;
  };
  chatbox: {
    headerTitle: string;
    onlineStatus: string;
    greeting: string;
    thinking: string;
    send: string;
    savedToReview: string;
    saveToReview: string;
    listening: string;
    placeholder: string;
    suggestGrammar: string;
    suggestVocab: string;
    suggestRoleplay: string;
  };
}

export const TRANSLATIONS: Record<LanguageTrack, Translations> = {
  en: {
    common: {
      appName: 'CATALOGUE',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      gotIt: 'Got it!',
      confirm: 'Confirm',
      search: 'Search',
      searchPlaceholder: 'Search anything...',
      points: 'Points',
      xp: 'XP',
      level: 'Level',
      streak: 'Streak',
      days: 'days',
      dayStreak: 'Day Streak',
      hearts: 'Hearts',
      gems: 'Gems',
      rank: 'Rank',
      viewProfile: 'View Profile',
      allCaughtUp: 'All caught up!',
      online: 'Online',
      offline: 'Offline',
      inLesson: 'In Lesson'
    },
    header: {
      toggleDarkMode: 'Toggle dark mode',
      english: 'English',
      korean: 'Korean',
      japanese: 'Japanese',
      activeLanguage: 'Active Language',
      help: 'Help',
      printPage: 'Print this page',
      dayStreakTitle: 'Day Study Streak!',
      messagesTitle: 'Kleo AI Tutor Messages',
      unreadTutorMessages: '25 New',
      notificationsTitle: 'Notifications',
      unreadNotifications: '38 Unread',
      kleoTipOfDay: '🐾 Kleo Tip of the Day',
      kleoTipContent: '"Remember that polite endings soften your requests in cafes and restaurants!"',
      reviewReminderTitle: 'Flashcard Review Reminder',
      reviewReminderContent: 'You have review items scheduled for spaced repetition review today.',
      streakMaintainedTitle: '🔥 Streak Maintained',
      streakMaintainedContent: 'Keep studying today to increase your streak!',
      milestoneReachedTitle: '✨ XP Milestone Reached',
      milestoneReachedContent: 'New level milestones unlocked with your total XP.',
      helpTitle: 'CATALOGUE Help & Guide',
      helpSubtitle: 'Quick tips to maximize your daily language learning',
      dailyStreaksTitle: 'Daily Streaks',
      dailyStreaksDesc: 'Complete at least one lesson or review session daily to increase your streak and earn bonus bond XP.',
      kleoCompanionTitle: 'Kleo AI Companion',
      kleoCompanionDesc: 'Ask Kleo grammar questions anytime via the chat button or practice ordering in the Chatroom.',
      spacedRepetitionTitle: 'Spaced Repetition (SM-2)',
      spacedRepetitionDesc: 'Save translations directly into your Review Deck to reinforce vocabulary with proven memory intervals.'
    },
    sidebar: {
      overview: 'Overview',
      skillTree: 'Skill Tree',
      writingLetters: 'Writing & Letters',
      wordMatch: 'Word Match',
      translator: 'Translator',
      scanTranslate: 'Scan & Translate',
      leaderboardStats: 'Leaderboard & Stats',
      reviewDeck: 'Review Deck',
      kleoTutor: 'Kleo AI Tutor',
      settings: 'Settings',
      logout: 'Log Out',
      refreshDashboard: 'Refresh Dashboard'
    },
    logoutModal: {
      title: 'Taking a break?',
      description: "Kleo's saving your spot. Your streak and progress stay right where you left them.",
      stayLoggedIn: 'Keep studying',
      confirmLogout: 'Sign out',
      streakSafe: 'day streak safe'
    },
    dashboard: {
      welcome: 'Welcome',
      trackSubtitle: 'track',
      bondLevel: 'Bond Lv.',
      speechBubbleReady: 'Ready when you are. Shall we learn some',
      aiTutorMascot: 'AI Tutor Mascot',
      dailyGoal: 'Daily goal',
      goalCompletedToday: 'min completed today',
      goalFinished: '🎉 Daily goal completed!',
      minRemaining: 'min remaining',
      lettersUnitTitle: 'Letters unit',
      startLesson: 'Start your first lesson',
      continueLesson: 'Continue lesson',
      wordMatchCardTitle: 'Word Match',
      wordMatchCardDesc: 'Food, Things & Verbs',
      reviewCardTitle: 'Review',
      reviewCardDesc: 'item(s) due',
      scriptCardTitle: 'Script & letters',
      scriptCardDesc: 'Full writing reference',
      chatWithKleoTitle: 'Chat with Kleo',
      chatWithKleoDesc: 'AI Language Tutor',
      syllableBuilderTitle: 'Syllable block builder',
      syllableBuilderDesc: 'Pick a consonant and a vowel to build a real syllable block.',
      consonant: 'Consonant',
      vowel: 'Vowel',
      kanjiHiraganaBuilderTitle: 'Kana & Kanji Reference',
      kanjiHiraganaBuilderDesc: 'Explore Japanese phonetics and common kanji radicals.',
      alphabetPhonicsBuilderTitle: 'Phonics & Letter Builder',
      alphabetPhonicsBuilderDesc: 'Practice English alphabet blends and phonetic pronunciations.'
    },
    calendar: {
      title: 'Study Calendar',
      streakDaysLabel: 'Day Streak',
      streakSubtext: 'Consistent daily practice creates lasting memory retention.',
      viewFullCalendar: 'View Full Calendar',
      closeCalendar: 'Close Calendar',
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      onlineFriendsTitle: 'Online Learners',
      onlineCount: 'online',
      chat: 'Chat',
      viewAllFriends: 'View All Friends',
      noFriendsOnline: 'No friends currently online'
    },
    learn: {
      unit1: 'Unit 1',
      foundationHangul: 'Foundation of Hangul',
      foundationNihongo: 'Foundation of Japanese',
      foundationEnglish: 'Foundation of English Phonics',
      masterScriptsDesc: 'Master the scripts and basic interactions.',
      mastered100: 'Mastered 100%',
      inProgress: 'In Progress',
      locked: 'Locked',
      startHere: 'START HERE',
      companionActive: '🐾 Companion Active',
      guidebook: 'GUIDEBOOK',
      section1Unit1: 'SECTION 1, UNIT 1',
      microLessonsDesc: '3-minute micro-lessons • Adaptive AI repetition engine',
      unitStats: 'Unit Stats',
      unlockPro: 'Unlock Pro'
    },
    lesson: {
      questionOf: 'Question',
      translatePrompt: 'Translate this sentence / phrase',
      selectCorrect: 'Select the correct answer',
      checkAnswer: 'Check Answer',
      continue: 'Continue',
      skip: 'Skip',
      correctTitle: 'Correct!',
      correctGreatJob: 'Great job! Keep the momentum going.',
      greatJob: 'Great Job!',
      incorrectTitle: 'Not quite right',
      correctAnswerWas: 'Correct answer:',
      lessonComplete: 'Lesson Complete!',
      xpEarned: 'XP Earned',
      accuracy: 'Accuracy',
      finishLesson: 'Finish Lesson',
      outOfHearts: 'Out of Hearts!',
      outOfHeartsDesc: 'Practice in review deck or refill hearts in the gamify hub.',
      refillHearts: 'Refill Hearts',
      answerSubmitted: 'Answer Submitted',
      nextExercise: 'Next Exercise',
      kleoBond: 'Kleo Bond',
      collectRewards: 'Collect Rewards'
    },
    script: {
      title: 'Writing Systems & Phonics',
      hangulTitle: 'Hangul Characters (한글)',
      japaneseTitle: 'Japanese Writing (日本語)',
      englishTitle: 'English Alphabet & Phonics',
      vowels: 'Vowels',
      consonants: 'Consonants',
      compoundVowels: 'Compound Vowels',
      hiragana: 'Hiragana (ひらがな)',
      katakana: 'Katakana (カタカナ)',
      kanji: 'Kanji (漢字)',
      alphabet: 'Alphabet (A-Z)',
      phonics: 'Phonics Blends',
      strokeOrder: 'Stroke Order',
      interactiveTracing: 'Interactive Tracing Canvas',
      clearCanvas: 'Clear',
      soundPronunciation: 'Listen Sound',
      exampleWord: 'Example Word',
      practiceMode: 'Practice Mode',
      romanization: 'Show Romanization',
      continueToSkillTree: 'Continue to Skill Tree'
    },
    matching: {
      title: 'Word Match Challenge',
      subtitle: 'Pair the correct words before time runs out to earn maximum XP!',
      roundSize: 'Round Size',
      quick: 'Quick (6)',
      standard: 'Standard (8)',
      master: 'Master (10)',
      chooseCategory: 'Choose a Vocabulary Category',
      foodDrink: 'Food & Drink',
      dailyItems: 'Daily Items & Objects',
      commonVerbs: 'Common Verbs',
      colorsNumbers: 'Colors & Numbers',
      score: 'Score',
      timeLeft: 'Time Left',
      combo: 'Combo',
      pairsLeft: 'Pairs Left',
      restart: 'Restart',
      pause: 'Pause',
      resume: 'Resume',
      fantastic: 'Fantastic Work!',
      gameOver: 'Game Complete!',
      timeBonus: 'Time Bonus',
      playAgain: 'Play Again',
      backToCategories: 'Choose Another Category'
    },
    translator: {
      title: 'AI Smart Translator',
      subtitle: 'Translate naturally with context, Romanization, and audio pronunciations.',
      sourceLang: 'Source Language',
      targetLang: 'Target Language',
      inputPlaceholder: 'Enter text to translate...',
      placeholder: 'Type or paste text here (live auto-translate)...',
      translateBtn: 'Translate',
      translateButton: 'Translate',
      translating: 'Translating...',
      voiceInput: 'Voice Input',
      swapLanguages: 'Swap Languages',
      listening: 'Listening...',
      speak: 'Pronounce',
      copy: 'Copy',
      copied: 'Copied to clipboard!',
      saveToReview: 'Save to Review Deck',
      savedToReview: 'Saved to Flashcards!',
      saveToDeck: 'Save to Deck',
      savedToDeck: 'Saved to Deck',
      clear: 'Clear',
      recentTranslations: 'Recent Translations',
      noRecent: 'No recent translations yet.',
      voiceTranslatorTitle: 'Instant Voice & Speech Engine'
    },
    scanner: {
      title: 'Visual Scanner & OCR Lens',
      subtitle: 'Snap a photo or upload an image to extract text and translate vocabulary instantly.',
      uploadImage: 'Upload Photo / Image',
      uploadPhoto: 'Upload Photo',
      openCamera: 'Use Camera',
      liveCamera: 'Live Camera',
      scanFrom: 'Scan From',
      translateTo: 'Translate To',
      snapAndTranslate: 'Snap & Translate',
      extractedText: 'Extracted Text',
      listen: 'Listen',
      scanning: 'Scanning image with AI OCR...',
      detectedText: 'Detected Text',
      translationResult: 'Translated Result',
      saveVocabulary: 'Save Vocabulary to Deck',
      dragDropText: 'Drag & drop an image or click to browse files',
      samplePhotos: 'Try Sample Images',
      confidence: 'Detection Confidence'
    },
    kleoHub: {
      title: 'Kleo AI Language Hub',
      subtitle: 'Your personal 24/7 AI tutor for conversations, grammar explanations, and roleplays.',
      petKleo: 'Pet Kleo',
      bondStatus: 'BOND STATUS',
      wardrobe: "Kleo's Wardrobe",
      equipped: 'EQUIPPED',
      head: 'Head',
      neck: 'Neck',
      eyes: 'Eyes',
      chatTab: 'Freeform Tutor Chat',
      scenariosTab: 'Immersive Scenarios',
      scenarioCafe: 'Ordering at a Cafe',
      scenarioCafeDesc: 'Practice polite ordering, customizations, and payment phrases.',
      scenarioDirections: 'Asking for Directions',
      scenarioDirectionsDesc: 'Learn subway, street, and landmark navigation vocabulary.',
      scenarioInterview: 'Job & Academic Interview',
      scenarioInterviewDesc: 'Polite honorifics and self-introduction practice.',
      scenarioDaily: 'Daily Casual Chit-chat',
      scenarioDailyDesc: 'Talk about hobbies, weather, and daily routines.',
      startRoleplay: 'Start Roleplay',
      inputPlaceholder: 'Ask Kleo anything or reply in your target language...',
      send: 'Send',
      quickPrompts: 'Suggested Practice Prompts',
      clearChat: 'Clear History',
      listening: 'Listening to your voice...'
    },
    gamify: {
      title: 'Quests, Leagues & Badges',
      subtitle: 'Level up your language proficiency and climb the weekly league ranks.',
      consecutiveStreak: 'Consecutive Streak',
      levelMaster: 'Master',
      refillHearts: 'Practice to Refill Hearts ❤️',
      dailyGoalTitle: 'Adjustable Daily Goal Pace',
      casual: 'Casual',
      regular: 'Regular',
      intense: 'Intense',
      heatmapTitle: '35-Day Habit Streak Heatmap',
      leagueRankings: 'Weekly League Rankings',
      milestonesBadges: 'Milestones & Badges',
      dailyQuests: 'Daily Quests',
      quest1Title: 'Complete 2 Lessons',
      quest1Desc: 'Finish any 2 skill tree nodes today',
      quest2Title: 'Score 50+ XP in Word Match',
      quest2Desc: 'Play a rapid vocabulary match round',
      quest3Title: 'Review 5 Flashcards',
      quest3Desc: 'Reinforce memory with spaced repetition',
      claimReward: 'Claim Reward',
      claimed: 'Claimed',
      weeklyLeague: 'Weekly League',
      leagueBronze: 'Bronze League',
      leagueSilver: 'Silver League',
      leagueGold: 'Gold League',
      leagueDiamond: 'Diamond League',
      leaderboardRank: 'Your Global Rank',
      achievements: 'Achievements & Badges',
      badgeStreak: '5-Day Streak Master',
      badgeStreakDesc: 'Maintained 5 consecutive days of study',
      badgeScholar: 'Grammar Scholar',
      badgeScholarDesc: 'Completed all Unit 1 foundations',
      badgePolyglot: 'Multilingual Explorer',
      badgePolyglotDesc: 'Explored multiple language tracks',
      heartsStore: 'Hearts & Energy Store',
      refillNow: 'Refill Full Hearts (Free)'
    },
    review: {
      title: 'Spaced Repetition Review Deck',
      subtitle: 'Reinforce learned vocabulary at scientifically optimal intervals (SM-2 Algorithm).',
      flipCard: 'Tap Card to Flip 🔄',
      listen: 'Listen Pronunciation',
      ratePrompt: 'Rate Recall Difficulty to Reschedule',
      complete: 'Review Session Complete! 🎉',
      completeMsg: 'You reviewed all flashcards in your deck! Your Hearts have been fully refilled! ❤️',
      reviewAgain: 'Review Again',
      cardsDue: 'Cards Due for Review',
      startSession: 'Start Flashcard Review',
      showAnswer: 'Show Translation & Answer',
      again: 'Again (1 day)',
      hard: 'Hard (3 days)',
      good: 'Good (7 days)',
      easy: 'Easy (14 days)',
      savedCount: 'Saved Flashcards',
      spacedRepetitionInfo: 'Spaced repetition automatically schedules cards right before you are about to forget them.',
      emptyDeck: 'No cards currently due for review!',
      allReviewed: 'All caught up! Great job studying today.'
    },
    profile: {
      title: 'Student Academic Profile',
      streakDays: 'Streak Days',
      totalXp: 'Total XP',
      lessonsCompleted: 'Lessons Completed',
      studentInfo: 'Official Student Record',
      fullName: 'Full Name',
      studentId: 'Student ID',
      department: 'Department',
      program: 'Program',
      yearLevel: 'Year Level',
      email: 'Institutional Email',
      phone: 'Contact Number',
      dateOfBirth: 'Date of Birth',
      address: 'Address',
      emergencyContact: 'Emergency Contact',
      joinedDate: 'Joined Date',
      learningStats: 'Language Learning Statistics',
      completedLessons: 'Completed Lessons',
      editProfile: 'Edit Profile',
      editProfileTitle: 'Edit Personal & Academic Information',
      saveProfile: 'Save Changes',
      bio: 'Bio / Notes',
      friends: 'Friends & Language Partners',
      addFriend: 'Add Friend',
      sendMessage: 'Direct Message',
      awardsTitle: 'Awards & Honors',
      securityTitle: 'Security & Sign In'
    },
    settings: {
      title: 'Application Settings',
      subtitle: 'Customize your learning interface, sound preferences, and language tracks.',
      appearance: 'Theme & Appearance',
      appearanceDesc: 'Switch between light and dark mode display styles.',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      languageTrack: 'Active Learning Track',
      languageTrackDesc: 'Select the primary language track you are currently studying.',
      korean: 'Korean',
      japanese: 'Japanese',
      english: 'English',
      audioSpeed: 'Audio Playback Speed',
      soundEffects: 'Audio & Sound Effects',
      soundEffectsDesc: 'Enable native pronunciation audio and interactive chime effects.',
      studyReminders: 'Daily Notifications & Reminders',
      studyRemindersDesc: 'Receive gentle reminders to maintain your daily streak.',
      accountDanger: 'Account Management',
      resetProgress: 'Reset Learning Progress',
      resetProgressDesc: 'Reset completed nodes and streak data for this language track.'
    },
    chatbox: {
      headerTitle: 'Kleo AI Assistant',
      onlineStatus: 'Online • Ready to help',
      greeting: "I can tell you're ready to master a new language today! Would you like to practice Japanese, Korean, or English grammar with me? 🐾",
      thinking: 'Kleo is thinking...',
      send: 'Send',
      savedToReview: 'Saved to Review',
      saveToReview: 'Save to Review',
      listening: 'Listening to speech...',
      placeholder: 'Type your message...',
      suggestGrammar: 'Explain sentence structure',
      suggestVocab: 'Give me 5 useful phrases',
      suggestRoleplay: 'Practice a cafe dialogue'
    }
  },

  ko: {
    common: {
      appName: 'CATALOGUE',
      loading: '로딩 중...',
      save: '저장',
      cancel: '취소',
      close: '닫기',
      edit: '수정',
      delete: '삭제',
      back: '뒤로',
      next: '다음',
      done: '완료',
      gotIt: '확인',
      confirm: '확인',
      search: '검색',
      searchPlaceholder: '검색어를 입력하세요...',
      points: '포인트',
      xp: 'XP',
      level: '레벨',
      streak: '연속 학습',
      days: '일',
      dayStreak: '일 연속 학습',
      hearts: '하트',
      gems: '보석',
      rank: '순위',
      viewProfile: '프로필 보기',
      allCaughtUp: '모든 복습 완료!',
      online: '온라인',
      offline: '오프라인',
      inLesson: '학습 중'
    },
    header: {
      toggleDarkMode: '다크 모드 전환',
      english: '영어 (English)',
      korean: '한국어 (Korean)',
      japanese: '일본어 (Japanese)',
      activeLanguage: '선택된 언어',
      help: '도움말',
      printPage: '페이지 인쇄',
      dayStreakTitle: '일 연속 학습 달성 중!',
      messagesTitle: 'Kleo AI 튜터 메시지',
      unreadTutorMessages: '새 메시지 25개',
      notificationsTitle: '알림',
      unreadNotifications: '읽지 않은 알림 38개',
      kleoTipOfDay: '🐾 클레오의 오늘의 팁',
      kleoTipContent: '"카페나 식당에서 정중하게 요청할 때는 존댓말(~요)을 사용하는 것을 잊지 마세요!"',
      reviewReminderTitle: '단어 복습 알림',
      reviewReminderContent: '오늘 망각 곡선에 따라 복습해야 할 단어가 준비되어 있습니다.',
      streakMaintainedTitle: '🔥 연속 학습 유지',
      streakMaintainedContent: '오늘도 학습하여 연속 일수를 늘려보세요!',
      milestoneReachedTitle: '✨ XP 목표 달성',
      milestoneReachedContent: '누적 XP로 새로운 레벨을 잠금 해제했습니다.',
      helpTitle: 'CATALOGUE 도움말 & 안내',
      helpSubtitle: '일일 언어 학습 효과를 극대화하는 팁',
      dailyStreaksTitle: '일일 연속 학습',
      dailyStreaksDesc: '매일 최소 1개의 레슨이나 복습을 완료하여 연속 학습을 유지하고 보너스 경험치를 획득하세요.',
      kleoCompanionTitle: 'Kleo AI 튜터 동반자',
      kleoCompanionDesc: '채팅 버튼을 눌러 언제든지 문법을 질문하거나 채팅방에서 주문 연습을 진행해 보세요.',
      spacedRepetitionTitle: '간격 반복 복습 (SM-2)',
      spacedRepetitionDesc: '번역 결과를 복습 덱에 바로 저장하여 과학적인 간격으로 단어를 영구 기억하세요.'
    },
    sidebar: {
      overview: '대시보드',
      skillTree: '학습 트리',
      writingLetters: '문자 쓰기',
      wordMatch: '단어 매칭',
      translator: '번역기',
      scanTranslate: '스캔 & 번역',
      leaderboardStats: '리더보드',
      reviewDeck: '복습 덱',
      kleoTutor: 'Kleo AI 튜터',
      settings: '설정',
      logout: '로그아웃',
      refreshDashboard: '대시보드 새로고침'
    },
    logoutModal: {
      title: '잠시 쉬어가시나요?',
      description: 'Kleo가 학습 자리를 지켜둘게요. 연속 학습과 진행 상황은 안전하게 유지됩니다.',
      stayLoggedIn: '계속 학습하기',
      confirmLogout: '로그아웃',
      streakSafe: '일 연속 학습 안전 보관'
    },
    dashboard: {
      welcome: '환영합니다',
      trackSubtitle: '학습 트랙',
      bondLevel: '유대 Lv.',
      speechBubbleReady: '준비되셨나요? 오늘 함께 배울 내용은',
      aiTutorMascot: 'AI 튜터 마스코트',
      dailyGoal: '일일 목표',
      goalCompletedToday: '분 완료 / 목표',
      goalFinished: '🎉 오늘 일일 목표 달성 완료!',
      minRemaining: '분 남음',
      lettersUnitTitle: '문자 학습 유닛',
      startLesson: '첫 번째 레슨 시작하기',
      continueLesson: '학습 이어하기',
      wordMatchCardTitle: '단어 매칭',
      wordMatchCardDesc: '음식, 사물 및 동사 단어',
      reviewCardTitle: '복습하기',
      reviewCardDesc: '개 단어 복습 대기 중',
      scriptCardTitle: '문자 및 발음',
      scriptCardDesc: '전체 문자 및 필순 가이드',
      chatWithKleoTitle: '클레오와 대화',
      chatWithKleoDesc: 'AI 1:1 맞춤 언어 튜터',
      syllableBuilderTitle: '음절 블록 조합기',
      syllableBuilderDesc: '자음과 모음을 선택하여 완성된 한글 음절을 직접 조합해 보세요.',
      consonant: '자음',
      vowel: '모음',
      kanjiHiraganaBuilderTitle: '가나 및 한자 가이드',
      kanjiHiraganaBuilderDesc: '일본어 발음 체계와 기초 한자 부수를 탐색하세요.',
      alphabetPhonicsBuilderTitle: '파닉스 및 알파벳 조합',
      alphabetPhonicsBuilderDesc: '영어 26개 알파벳과 발음 기호를 연습하세요.'
    },
    calendar: {
      title: '학습 캘린더',
      streakDaysLabel: '일 연속 학습',
      streakSubtext: '매일 꾸준한 학습이 장기 기억 형성에 가장 효과적입니다.',
      viewFullCalendar: '전체 캘린더 보기',
      closeCalendar: '캘린더 닫기',
      monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      daysShort: ['월', '화', '수', '목', '금', '토', '일'],
      onlineFriendsTitle: '접속 중인 학습자',
      onlineCount: '명 온라인',
      chat: '대화하기',
      viewAllFriends: '전체 친구 보기',
      noFriendsOnline: '현재 온라인인 친구가 없습니다'
    },
    learn: {
      unit1: '유닛 1',
      foundationHangul: '한글의 기초와 발음',
      foundationNihongo: '일본어 기초 (히라가나/가타카나)',
      foundationEnglish: '영어 파닉스 및 알파벳 기초',
      masterScriptsDesc: '문자 체계와 기초 일상 표현을 완벽하게 익히세요.',
      mastered100: '100% 마스터 완료',
      inProgress: '학습 진행 중',
      locked: '잠김',
      startHere: '여기서 시작',
      companionActive: '🐾 튜터 활성화됨',
      guidebook: '가이드북',
      section1Unit1: '섹션 1, 유닛 1',
      microLessonsDesc: '3분 마이크로 레슨 • 적응형 AI 복습 엔진',
      unitStats: '유닛 통계',
      unlockPro: 'Pro 잠금 해제'
    },
    lesson: {
      questionOf: '문제',
      translatePrompt: '이 문장 / 단어를 번역하세요',
      selectCorrect: '알맞은 정답을 선택하세요',
      checkAnswer: '정답 확인',
      continue: '계속하기',
      skip: '건너뛰기',
      correctTitle: '정답입니다!',
      correctGreatJob: '훌륭합니다! 이 기세를 이어가세요.',
      greatJob: '잘하셨습니다!',
      incorrectTitle: '오답입니다',
      correctAnswerWas: '올바른 정답:',
      lessonComplete: '레슨 완료!',
      xpEarned: '획득한 경험치',
      accuracy: '정답률',
      finishLesson: '레슨 종료',
      outOfHearts: '하트가 모두 소진되었습니다!',
      outOfHeartsDesc: '복습 덱에서 연습하거나 상점에서 하트를 무료로 충전하세요.',
      refillHearts: '하트 충전하기',
      answerSubmitted: '정답 제출 완료',
      nextExercise: '다음 연습 문제',
      kleoBond: '클레오 유대감',
      collectRewards: '보상 받기'
    },
    script: {
      title: '문자 체계 및 발음 연습',
      hangulTitle: '한글 자모 (한글)',
      japaneseTitle: '일본어 문자 (日本語)',
      englishTitle: '영어 알파벳 및 파닉스',
      vowels: '모음',
      consonants: '자음',
      compoundVowels: '이중모음',
      hiragana: '히라가나 (ひらがな)',
      katakana: '가타카나 (カタカナ)',
      kanji: '기초 한자 (漢字)',
      alphabet: '알파벳 (A-Z)',
      phonics: '파닉스 발음 규칙',
      strokeOrder: '획순 가이드',
      interactiveTracing: '인터랙티브 따라쓰기 캔버스',
      clearCanvas: '지우기',
      soundPronunciation: '발음 듣기',
      exampleWord: '예시 단어',
      practiceMode: '연습 모드',
      romanization: '로마자 발음 표기',
      continueToSkillTree: '학습 트리로 이동'
    },
    matching: {
      title: '단어 매칭 챌린지',
      subtitle: '제한 시간 내에 올바른 단어 쌍을 맞추고 최대 XP를 획득하세요!',
      roundSize: '라운드 크기',
      quick: '빠른 게임 (6)',
      standard: '표준 (8)',
      master: '마스터 (10)',
      chooseCategory: '학습할 단어 카테고리 선택',
      foodDrink: '음식 및 음료',
      dailyItems: '일상 사물 및 도구',
      commonVerbs: '자주 쓰는 필수 동사',
      colorsNumbers: '색상 및 숫자',
      score: '점수',
      timeLeft: '남은 시간',
      combo: '콤보',
      pairsLeft: '남은 쌍',
      restart: '다시 시작',
      pause: '일시정지',
      resume: '계속하기',
      fantastic: '환상적입니다!',
      gameOver: '게임 완료!',
      timeBonus: '시간 보너스',
      playAgain: '다시 플레이',
      backToCategories: '다른 카테고리 선택'
    },
    translator: {
      title: 'AI 스마트 번역기',
      subtitle: '정확한 문맥, 로마자 표기, 원어민 음성 발음과 함께 자연스럽게 번역하세요.',
      sourceLang: '출발어',
      targetLang: '도착어',
      inputPlaceholder: '번역할 내용을 입력하세요...',
      placeholder: '텍스트를 입력하거나 붙여넣으세요 (실시간 자동 번역)...',
      translateBtn: '번역하기',
      translateButton: '번역하기',
      translating: '번역 중...',
      voiceInput: '음성 입력',
      swapLanguages: '언어 전환',
      listening: '음성 인식 중...',
      speak: '발음 듣기',
      copy: '복사',
      copied: '클립보드에 복사되었습니다!',
      saveToReview: '복습 덱에 저장',
      savedToReview: '단어장에 저장 완료!',
      saveToDeck: '복습 덱에 저장',
      savedToDeck: '복습 덱에 저장됨',
      clear: '지우기',
      recentTranslations: '최근 번역 기록',
      noRecent: '최근 번역 내역이 없습니다.',
      voiceTranslatorTitle: '실시간 음성 및 대화 번역 엔진'
    },
    scanner: {
      title: '비주얼 스캐너 & OCR 렌즈',
      subtitle: '사진을 찍거나 이미지를 업로드하여 텍스트를 추출하고 단어를 즉시 학습하세요.',
      uploadImage: '사진 / 이미지 업로드',
      uploadPhoto: '사진 업로드',
      openCamera: '카메라 촬영',
      liveCamera: '실시간 카메라',
      scanFrom: '추출 언어',
      translateTo: '번역 언어',
      snapAndTranslate: '촬영 및 번역',
      extractedText: '추출된 텍스트',
      listen: '듣기',
      scanning: 'AI OCR 텍스트 분석 중...',
      detectedText: '감지된 텍스트',
      translationResult: '번역 결과',
      saveVocabulary: '단어장에 저장하기',
      dragDropText: '이미지를 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요',
      samplePhotos: '샘플 이미지로 체험하기',
      confidence: '인식 신뢰도'
    },
    kleoHub: {
      title: 'Kleo AI 언어 튜터 허브',
      subtitle: '24시간 언제나 대화, 문법 질문, 실전 롤플레잉을 함께하는 AI 개인 교사입니다.',
      petKleo: '클레오 쓰다듬기',
      bondStatus: '유대 관계 상태',
      wardrobe: '클레오의 옷장',
      equipped: '장착 중',
      head: '모자',
      neck: '목도리',
      eyes: '안경',
      chatTab: '자유 튜터 대화',
      scenariosTab: '실전 상황극 롤플레잉',
      scenarioCafe: '카페에서 주문하기',
      scenarioCafeDesc: '정중한 주문, 메뉴 변경, 결제 표현을 연습하세요.',
      scenarioDirections: '길 묻기와 길 안내',
      scenarioDirectionsDesc: '지하철, 거리, 주요 건물 위치 묻기 표현을 배웁니다.',
      scenarioInterview: '입학 및 취업 인터뷰',
      scenarioInterviewDesc: '정중한 격식체 존댓말과 자기소개 표현을 훈련합니다.',
      scenarioDaily: '일상 캐주얼 프리토킹',
      scenarioDailyDesc: '취미, 날씨, 하루 일과에 대한 자연스러운 대화를 나눠보세요.',
      startRoleplay: '상황극 시작',
      inputPlaceholder: '클레오에게 궁금한 점을 묻거나 학습 언어로 답변하세요...',
      send: '전송',
      quickPrompts: '추천 연습 질문',
      clearChat: '대화 기록 삭제',
      listening: '목소리를 듣고 있습니다...'
    },
    gamify: {
      title: '퀘스트, 리그 및 뱃지',
      subtitle: '매일 실력을 쌓고 주간 리그 순위를 올려보세요.',
      consecutiveStreak: '연속 학습 달성',
      levelMaster: '마스터',
      refillHearts: '복습하고 하트 충전하기 ❤️',
      dailyGoalTitle: '조절 가능한 일일 학습 목표',
      casual: '가볍게',
      regular: '보통',
      intense: '열정적으로',
      heatmapTitle: '35일 연속 학습 히트맵',
      leagueRankings: '주간 리그 순위',
      milestonesBadges: '마일스톤 및 뱃지',
      dailyQuests: '일일 퀘스트',
      quest1Title: '레슨 2개 완료하기',
      quest1Desc: '오늘 학습 트리 노드 2개를 완수하세요',
      quest2Title: '단어 매칭에서 50+ XP 획득',
      quest2Desc: '빠른 단어 매칭 게임을 한 판 완료하세요',
      quest3Title: '단어 5개 복습하기',
      quest3Desc: '간격 반복으로 기억을 강화하세요',
      claimReward: '보상 받기',
      claimed: '수령 완료',
      weeklyLeague: '주간 리그',
      leagueBronze: '브론즈 리그',
      leagueSilver: '실버 리그',
      leagueGold: '골드 리그',
      leagueDiamond: '다이아몬드 리그',
      leaderboardRank: '나의 글로벌 순위',
      achievements: '업적 및 뱃지',
      badgeStreak: '5일 연속 학습 마스터',
      badgeStreakDesc: '5일 연속으로 매일 학습 완료',
      badgeScholar: '문법 탐구자',
      badgeScholarDesc: '유닛 1의 모든 기초 과정 완료',
      badgePolyglot: '다국어 모험가',
      badgePolyglotDesc: '여러 언어 트랙을 탐색하고 학습함',
      heartsStore: '하트 및 에너지 충전소',
      refillNow: '하트 무료 전액 충전'
    },
    review: {
      title: '망각 방지 간격 반복 복습 (SRS)',
      subtitle: '뇌 과학에 기반한 SM-2 알고리즘으로 최적의 타이밍에 단어를 복습하세요.',
      flipCard: '카드를 탭하여 뒤집기 🔄',
      listen: '발음 듣기',
      ratePrompt: '기억 난이도를 평가하여 복습 주기 예약',
      complete: '복습 세션 완료! 🎉',
      completeMsg: '덱에 있는 모든 단어를 복습했습니다! 하트가 완충되었습니다! ❤️',
      reviewAgain: '다시 복습하기',
      cardsDue: '오늘 복습할 단어 카드',
      startSession: '플래시카드 복습 시작',
      showAnswer: '정답 및 번역 보기',
      again: '다시 (1일 후)',
      hard: '어려움 (3일 후)',
      good: '적당함 (7일 후)',
      easy: '쉬움 (14일 후)',
      savedCount: '저장된 단어 수',
      spacedRepetitionInfo: '간격 반복 시스템은 단어를 잊어버리기 직전 최적의 타이밍에 자동으로 카드를 제시합니다.',
      emptyDeck: '현재 복습할 단어가 없습니다!',
      allReviewed: '오늘의 모든 복습을 완료했습니다! 대단해요.'
    },
    profile: {
      title: '학적부 및 학습자 프로필',
      streakDays: '연속 학습 일수',
      totalXp: '누적 경험치',
      lessonsCompleted: '완료한 레슨',
      studentInfo: '공식 학적 정보',
      fullName: '성명',
      studentId: '학번',
      department: '단과대학',
      program: '학과 / 전공',
      yearLevel: '학년',
      email: '학교 공식 이메일',
      phone: '연락처',
      dateOfBirth: '생년월일',
      address: '주소',
      emergencyContact: '비상 연락망',
      joinedDate: '가입일',
      learningStats: '언어 학습 통계',
      completedLessons: '완료한 레슨 수',
      editProfile: '프로필 수정',
      editProfileTitle: '개인 및 학적 정보 수정',
      saveProfile: '변경사항 저장',
      bio: '자기소개 / 상태 메시지',
      friends: '친구 및 학습 파트너',
      addFriend: '친구 추가',
      sendMessage: '다이렉트 메시지',
      awardsTitle: '수상 및 자격 내역',
      securityTitle: '보안 및 계정 관리'
    },
    settings: {
      title: '환경설정',
      subtitle: '학습 인터페이스, 소리 설정 및 학습 언어 트랙을 맞춤 구성하세요.',
      appearance: '화면 테마 및 외관',
      appearanceDesc: '라이트 모드와 야간 다크 모드를 전환합니다.',
      lightMode: '라이트 모드',
      darkMode: '다크 모드',
      languageTrack: '현재 학습 언어 트랙',
      languageTrackDesc: '집중적으로 학습할 주요 언어를 선택하세요.',
      korean: '한국어',
      japanese: '일본어',
      english: '영어',
      audioSpeed: '음성 재생 속도',
      soundEffects: '오디오 및 효과음',
      soundEffectsDesc: '원어민 발음 음성과 정답 효과음을 활성화합니다.',
      studyReminders: '학습 알림 및 연속 학습 지킴이',
      studyRemindersDesc: '매일 연속 학습을 유지할 수 있도록 알림을 받습니다.',
      accountDanger: '계정 관리',
      resetProgress: '학습 진도 초기화',
      resetProgressDesc: '현재 언어 트랙의 학습 완료 기록과 연속 데이터를 초기화합니다.'
    },
    chatbox: {
      headerTitle: 'Kleo AI 어시스턴트',
      onlineStatus: '온라인 • 언제든 질문하세요',
      greeting: '오늘도 새로운 언어를 배울 준비가 되셨군요! 저와 함께 한국어, 일본어, 영어 문법과 대화를 연습해 볼까요? 🐾',
      thinking: '클레오가 생각하는 중...',
      send: '전송',
      savedToReview: '복습에 저장됨',
      saveToReview: '복습에 저장',
      listening: '음성 인식 중...',
      placeholder: '메시지를 입력하세요...',
      suggestGrammar: '문장 구조 설명해 줘',
      suggestVocab: '유용한 일상 표현 5개 알려줘',
      suggestRoleplay: '카페 주문 대화 연습하자'
    }
  },

  ja: {
    common: {
      appName: 'CATALOGUE',
      loading: '読み込み中...',
      save: '保存',
      cancel: 'キャンセル',
      close: '閉じる',
      edit: '編集',
      delete: '削除',
      back: '戻る',
      next: '次へ',
      done: '完了',
      gotIt: '了解！',
      confirm: '確認',
      search: '検索',
      searchPlaceholder: '検索キーワードを入力...',
      points: 'ポイント',
      xp: 'XP',
      level: 'レベル',
      streak: 'ストリーク',
      days: '日',
      dayStreak: '日連続学習',
      hearts: 'ライフ',
      gems: 'ジェム',
      rank: '順位',
      viewProfile: 'プロフィールを見る',
      allCaughtUp: '復習完了！',
      online: 'オンライン',
      offline: 'オフライン',
      inLesson: 'レッスン中'
    },
    header: {
      toggleDarkMode: 'ダークモード切替',
      english: '英語 (English)',
      korean: '韓国語 (Korean)',
      japanese: '日本語 (Japanese)',
      activeLanguage: '選択中の言語',
      help: 'ヘルプ',
      printPage: 'このページを印刷',
      dayStreakTitle: '日連続学習ストリーク！',
      messagesTitle: 'Kleo AI チューターメッセージ',
      unreadTutorMessages: '新着 25件',
      notificationsTitle: '通知',
      unreadNotifications: '未読 38件',
      kleoTipOfDay: '🐾 Kleo 今日のワンポイント',
      kleoTipContent: '「カフェやお店では丁寧な表現（です・ます）を使うと自然で好印象です！」',
      reviewReminderTitle: '単語復習のリマインダー',
      reviewReminderContent: '今日復習すべきカードが準備されています。',
      streakMaintainedTitle: '🔥 連続学習を維持中',
      streakMaintainedContent: '今日も学習してストリークを伸ばしましょう！',
      milestoneReachedTitle: '✨ XP マイルストーン達成',
      milestoneReachedContent: '累計XPで新しいレベルに到達しました。',
      helpTitle: 'CATALOGUE ヘルプ＆ガイド',
      helpSubtitle: '毎日の語学学習効果を最大化するためのヒント',
      dailyStreaksTitle: 'デイリーストリーク',
      dailyStreaksDesc: '毎日最低1回のレッスンまたは復習を行い、ストリークを維持してボーナス経験値を獲得しましょう。',
      kleoCompanionTitle: 'Kleo AI チューター相棒',
      kleoCompanionDesc: 'チャットボタンからいつでも文法を質問したり、チャットルームで注文会話の練習ができます。',
      spacedRepetitionTitle: '間隔反復復習 (SM-2)',
      spacedRepetitionDesc: '翻訳結果を復習デッキに直接保存し、科学的な記憶間隔で単語を定着させましょう。'
    },
    sidebar: {
      overview: '概要',
      skillTree: 'スキルツリー',
      writingLetters: '文字・筆記',
      wordMatch: '単語マッチ',
      translator: '翻訳機',
      scanTranslate: 'スキャン・翻訳',
      leaderboardStats: 'リーダーボード',
      reviewDeck: '復習デッキ',
      kleoTutor: 'Kleo AI チューター',
      settings: '設定',
      logout: 'ログアウト',
      refreshDashboard: 'ダッシュボード更新'
    },
    logoutModal: {
      title: '休憩しますか？',
      description: 'Kleoが進捗をしっかりキープしています。連続記録と学習データはそのまま保存されます。',
      stayLoggedIn: '学習を続ける',
      confirmLogout: 'サインアウト',
      streakSafe: '日連続ストリーク保護中'
    },
    dashboard: {
      welcome: 'ようこそ',
      trackSubtitle: '学習トラック',
      bondLevel: '絆 Lv.',
      speechBubbleReady: '準備はいいですか？ 今日一緒に学ぶのは',
      aiTutorMascot: 'AI チューターマスコット',
      dailyGoal: 'デイリー目標',
      goalCompletedToday: '分完了 / 目標',
      goalFinished: '🎉 本日のデイリー目標達成！',
      minRemaining: '分残り',
      lettersUnitTitle: '文字ユニット',
      startLesson: '最初のレッスンを開始',
      continueLesson: 'レッスンを続ける',
      wordMatchCardTitle: '単語マッチ',
      wordMatchCardDesc: '食べ物・日常の物・動詞',
      reviewCardTitle: '復習',
      reviewCardDesc: '件の復習待ち',
      scriptCardTitle: '文字と発音',
      scriptCardDesc: '書き順と発音の完全ガイド',
      chatWithKleoTitle: 'Kleoとチャット',
      chatWithKleoDesc: 'AI 語学チューター',
      syllableBuilderTitle: '音節・文字ビルダー',
      syllableBuilderDesc: 'パーツを選んで本物の文字音節を組み立ててみましょう。',
      consonant: '子音',
      vowel: '母音',
      kanjiHiraganaBuilderTitle: 'ひらがな・カタカナ・漢字',
      kanjiHiraganaBuilderDesc: '五十音表と漢字の部首を学習します。',
      alphabetPhonicsBuilderTitle: 'フォニックス＆アルファベット',
      alphabetPhonicsBuilderDesc: '英語の26文字と発音記号を練習します。'
    },
    calendar: {
      title: '学習カレンダー',
      streakDaysLabel: '日連続学習',
      streakSubtext: '毎日の継続的な学習が長期記憶の定着に最も効果的です。',
      viewFullCalendar: '全カレンダーを表示',
      closeCalendar: 'カレンダーを閉じる',
      monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      daysShort: ['月', '火', '水', '木', '金', '土', '日'],
      onlineFriendsTitle: 'オンラインの学習者',
      onlineCount: '人オンライン',
      chat: 'チャット',
      viewAllFriends: 'すべての友達を見る',
      noFriendsOnline: '現在オンラインの友達はいません'
    },
    learn: {
      unit1: 'ユニット 1',
      foundationHangul: 'ハングルの基礎と発音',
      foundationNihongo: '日本語の基礎（ひらがな・カタカナ）',
      foundationEnglish: '英語フォニックスとアルファベット基礎',
      masterScriptsDesc: '文字体系と基本的な日常表現をマスターしましょう。',
      mastered100: '100% マスター完了',
      inProgress: '学習進行中',
      locked: 'ロック中',
      startHere: 'ここからスタート',
      companionActive: '🐾 相棒アクティブ',
      guidebook: 'ガイドブック',
      section1Unit1: 'セクション 1, ユニット 1',
      microLessonsDesc: '3分マイクロレッスン • AI適応型復習エンジン',
      unitStats: 'ユニット統計',
      unlockPro: 'Pro を解除'
    },
    lesson: {
      questionOf: '問題',
      translatePrompt: 'この文 / フレーズを翻訳してください',
      selectCorrect: '正しい選択肢を選んでください',
      checkAnswer: '回答を確認',
      continue: '続ける',
      skip: 'スキップ',
      correctTitle: '正解です！',
      correctGreatJob: '素晴らしい！ この調子で続けましょう。',
      greatJob: 'よくできました！',
      incorrectTitle: '不正解です',
      correctAnswerWas: '正しい正解:',
      lessonComplete: 'レッスン完了！',
      xpEarned: '獲得 XP',
      accuracy: '正解率',
      finishLesson: 'レッスンを終了',
      outOfHearts: 'ライフがなくなりました！',
      outOfHeartsDesc: '復習デッキで練習するか、ショップでライフを無料回復してください。',
      refillHearts: 'ライフを回復する',
      answerSubmitted: '回答送信済み',
      nextExercise: '次の問題へ',
      kleoBond: 'Kleoとの絆',
      collectRewards: '報酬を受け取る'
    },
    script: {
      title: '文字体系と発音練習',
      hangulTitle: 'ハングル文字 (한글)',
      japaneseTitle: '日本語の文字 (日本語)',
      englishTitle: '英語アルファベット＆フォニックス',
      vowels: '母音',
      consonants: '子音',
      compoundVowels: '二重母音',
      hiragana: 'ひらがな (平仮名)',
      katakana: 'カタカナ (片仮名)',
      kanji: '基礎漢字 (漢字)',
      alphabet: 'アルファベット (A-Z)',
      phonics: 'フォニックス規則',
      strokeOrder: '書き順ガイド',
      interactiveTracing: 'なぞり書きキャンバス',
      clearCanvas: '消去',
      soundPronunciation: '音声を聴く',
      exampleWord: '単語の例',
      practiceMode: '練習モード',
      romanization: 'ローマ字表記',
      continueToSkillTree: 'スキルツリーへ進む'
    },
    matching: {
      title: '単語マッチングチャレンジ',
      subtitle: '制限時間内に正しい単語ペアを揃えて、ハイスコアを目指しましょう！',
      roundSize: 'ラウンドサイズ',
      quick: 'クイック (6)',
      standard: '標準 (8)',
      master: 'マスター (10)',
      chooseCategory: 'カテゴリーを選択',
      foodDrink: '食べ物＆飲み物',
      dailyItems: '日常のアイテム',
      commonVerbs: 'よく使う動詞',
      colorsNumbers: '色と数字',
      score: 'スコア',
      timeLeft: '残り時間',
      combo: 'コンボ',
      pairsLeft: '残りペア',
      restart: 'リスタート',
      pause: '一時停止',
      resume: '再開',
      fantastic: '素晴らしい！',
      gameOver: 'ゲーム完了！',
      timeBonus: 'タイムボーナス',
      playAgain: 'もう一度プレイ',
      backToCategories: '別のカテゴリーを選ぶ'
    },
    translator: {
      title: 'AI スマート翻訳機',
      subtitle: '文脈に合った自然な翻訳、ローマ字発音表記、音声読み上げに対応。',
      sourceLang: '翻訳元言語',
      targetLang: '翻訳先言語',
      inputPlaceholder: '翻訳するテキストを入力...',
      placeholder: 'テキストを入力または貼り付け（リアルタイム自動翻訳）...',
      translateBtn: '翻訳する',
      translateButton: '翻訳する',
      translating: '翻訳中...',
      voiceInput: '音声入力',
      swapLanguages: '言語を入れ替え',
      listening: '音声認識中...',
      speak: '発音を聴く',
      copy: 'コピー',
      copied: 'クリップボードにコピーしました！',
      saveToReview: '復習デッキに保存',
      savedToReview: '単語帳に保存しました！',
      saveToDeck: 'デッキに保存',
      savedToDeck: 'デッキに保存済み',
      clear: 'クリア',
      recentTranslations: '最近の翻訳履歴',
      noRecent: '最近の翻訳履歴はありません。',
      voiceTranslatorTitle: 'リアルタイム音声・会話翻訳'
    },
    scanner: {
      title: 'ビジュアルスキャナー＆OCRレンズ',
      subtitle: '写真を撮影または画像をアップロードして文字を抽出し、瞬時に単語を学習。',
      uploadImage: '写真・画像をアップロード',
      uploadPhoto: '写真をアップロード',
      openCamera: 'カメラを起動',
      liveCamera: 'ライブカメラ',
      scanFrom: 'スキャン元言語',
      translateTo: '翻訳先言語',
      snapAndTranslate: '撮影して翻訳',
      extractedText: '抽出されたテキスト',
      listen: '聴く',
      scanning: 'AI OCR 画像スキャン中...',
      detectedText: '検出されたテキスト',
      translationResult: '翻訳結果',
      saveVocabulary: '単語帳に保存する',
      dragDropText: '画像をドラッグ＆ドロップまたはクリックして選択',
      samplePhotos: 'サンプル画像で試す',
      confidence: '認識の信頼度'
    },
    kleoHub: {
      title: 'Kleo AI 語学チューターハブ',
      subtitle: '24時間いつでも会話練習、文法解説、ロールプレイに対応するAI専属家庭教師。',
      petKleo: 'Kleoをなでる',
      bondStatus: '絆ステータス',
      wardrobe: 'Kleoのクローゼット',
      equipped: '装備中',
      head: '帽子',
      neck: 'マフラー',
      eyes: 'メガネ',
      chatTab: 'フリートーク',
      scenariosTab: '実践シチュエーション',
      scenarioCafe: 'カフェで注文する',
      scenarioCafeDesc: '丁寧な注文、カスタマイズ、会計のフレーズを練習します。',
      scenarioDirections: '道を尋ねる・案内する',
      scenarioDirectionsDesc: '地下鉄、通り、目的地への尋ね方を学びます。',
      scenarioInterview: '就職・面接のロールプレイ',
      scenarioInterviewDesc: '丁寧な敬語と自己紹介の練習を行います。',
      scenarioDaily: '日常の気軽な会話',
      scenarioDailyDesc: '趣味、天気、一日の過ごし方についてフリートーク。',
      startRoleplay: 'ロールプレイ開始',
      inputPlaceholder: 'Kleoに質問するか、学習言語で返答してください...',
      send: '送信',
      quickPrompts: 'おすすめの質問フレーズ',
      clearChat: '履歴をクリア',
      listening: '音声を認識しています...'
    },
    gamify: {
      title: 'クエスト・リーグ・バッジ',
      subtitle: '毎日の学習でスキルを磨き、週間リーグのランクを上げましょう。',
      consecutiveStreak: '連続学習ストリーク',
      levelMaster: 'マスター',
      refillHearts: '復習してライフを回復 ❤️',
      dailyGoalTitle: '調整可能なデイリー学習目標',
      casual: '気軽に',
      regular: '標準',
      intense: '熱心に',
      heatmapTitle: '35日連続学習ヒートマップ',
      leagueRankings: '週間リーグラング',
      milestonesBadges: '実績とバッジ',
      dailyQuests: 'デイリークエスト',
      quest1Title: 'レッスンを2つ完了',
      quest1Desc: '今日のスキルツリーノードを2つクリアする',
      quest2Title: '単語マッチで50+ XP獲得',
      quest2Desc: '単語マッチを1回プレイする',
      quest3Title: '単語を5枚復習',
      quest3Desc: '間隔反復で記憶を強化する',
      claimReward: '報酬を受け取る',
      claimed: '受取済',
      weeklyLeague: '週間リーグ',
      leagueBronze: 'ブロンズリーグ',
      leagueSilver: 'シルバーリーグ',
      leagueGold: 'ゴールドリーグ',
      leagueDiamond: 'ダイヤモンドリーグ',
      leaderboardRank: 'あなたの世界順位',
      achievements: '実績とバッジ',
      badgeStreak: '5日連続学習マスター',
      badgeStreakDesc: '5日間連続で毎日学習を達成',
      badgeScholar: '文法の探求者',
      badgeScholarDesc: 'ユニット1の全基礎コースを完了',
      badgePolyglot: 'マルチリンガル冒険者',
      badgePolyglotDesc: '複数の言語トラックを学習中',
      heartsStore: 'ライフ＆エネルギーストア',
      refillNow: 'ライフを無料全回復'
    },
    review: {
      title: '間隔反復復習デッキ (SRS)',
      subtitle: '脳科学に基づくSM-2アルゴリズムで、最適なタイミングで復習します。',
      flipCard: 'カードをタップしてめくる 🔄',
      listen: '発音を聴く',
      ratePrompt: '記憶の難易度を評価して次回をスケジュール',
      complete: '復習セッション完了！ 🎉',
      completeMsg: 'デッキの全カードを復習しました！ライフが全回復しました！ ❤️',
      reviewAgain: 'もう一度復習する',
      cardsDue: '本日復習する単語カード',
      startSession: 'フラッシュカード復習を開始',
      showAnswer: '答えと翻訳を表示',
      again: 'もう一度 (1日後)',
      hard: '難しい (3日後)',
      good: '普通 (7日後)',
      easy: '簡単 (14日後)',
      savedCount: '保存されたカード数',
      spacedRepetitionInfo: '間隔反復システムは、単語を忘れそうになる直前の最適なタイミングで自動出題します。',
      emptyDeck: '現在復習するカードはありません！',
      allReviewed: '本日の復習はすべて完了しました！お疲れ様でした。'
    },
    profile: {
      title: '学生アカデミックプロフィール',
      streakDays: '連続日数',
      totalXp: '累計XP',
      lessonsCompleted: '完了レッスン',
      studentInfo: '公式学生情報',
      fullName: '氏名',
      studentId: '学籍番号',
      department: '学部',
      program: '学科 / コース',
      yearLevel: '学年',
      email: '大学公式メール',
      phone: '電話番号',
      dateOfBirth: '生年月日',
      address: '住所',
      emergencyContact: '緊急連絡先',
      joinedDate: '登録日',
      learningStats: '言語学習ステータス',
      completedLessons: '完了したレッスン数',
      editProfile: 'プロフィール編集',
      editProfileTitle: '個人情報・学生情報の編集',
      saveProfile: '変更を保存',
      bio: '自己紹介 / メモ',
      friends: '友達＆学習パートナー',
      addFriend: '友達を追加',
      sendMessage: 'ダイレクトメッセージ',
      awardsTitle: '受賞歴＆資格',
      securityTitle: 'セキュリティとサインイン'
    },
    settings: {
      title: '設定',
      subtitle: '学習画面、音声設定、学習言語トラックをカスタマイズ。',
      appearance: '外観＆テーマ',
      appearanceDesc: 'ライトモードと夜間ダークモードを切り替えます。',
      lightMode: 'ライトモード',
      darkMode: 'ダークモード',
      languageTrack: '学習中の言語トラック',
      languageTrackDesc: '現在学習する主要言語トラックを選択します。',
      korean: '韓国語',
      japanese: '日本語',
      english: '英語',
      audioSpeed: '音声再生速度',
      soundEffects: '音声＆効果音',
      soundEffectsDesc: 'ネイティブ発音音声や正解効果音を有効にします。',
      studyReminders: '学習リマインダー通知',
      studyRemindersDesc: '毎日のストリークを維持するための通知を受け取ります。',
      accountDanger: 'アカウント管理',
      resetProgress: '学習進捗のリセット',
      resetProgressDesc: '選択中の言語トラックの完了記録とストリークデータをリセットします。'
    },
    chatbox: {
      headerTitle: 'Kleo AI アシスタント',
      onlineStatus: 'オンライン • いつでも質問どうぞ',
      greeting: '今日も新しい言語をマスターする準備ができていますね！日本語、韓国語、英語の文法や会話を一緒に練習しましょう🐾',
      thinking: 'Kleoが考え中...',
      send: '送信',
      savedToReview: '復習に保存済み',
      saveToReview: '復習に保存',
      listening: '音声認識中...',
      placeholder: 'メッセージを入力...',
      suggestGrammar: '文構造を説明して',
      suggestVocab: '便利な日常フレーズを5つ教えて',
      suggestRoleplay: 'カフェの注文会話を練習しよう'
    }
  }
};
