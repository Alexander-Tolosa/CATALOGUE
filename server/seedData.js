// Seed data for English (CEFR), Korean (TOPIK), and Japanese (JLPT)

const SEED_DATA = {
  languages: [
    { id: 'lang-en', name: 'English', code: 'en' },
    { id: 'lang-ko', name: 'Korean', code: 'ko' },
    { id: 'lang-ja', name: 'Japanese', code: 'ja' }
  ],
  levels: [
    // --- English (CEFR: A1, A2, B1, B2, C1, C2) ---
    {
      id: 'en-lvl-a1',
      languageId: 'lang-en',
      code: 'A1',
      name: 'A1 - Breakthrough / Beginner',
      order: 0,
      description: 'Basic everyday expressions, simple greetings, and fundamental personal introductions.',
      lessons: [
        {
          id: 'en-a1-les-1',
          title: 'Greetings & Personal Information',
          content: 'Learn essential greetings (Hello, Good morning), introducing yourself (My name is...), and simple questions (Where are you from?).',
          order: 1
        },
        {
          id: 'en-a1-les-2',
          title: 'Everyday Objects & Numbers 1-100',
          content: 'Identify common classroom and household objects, and master counting numbers from 1 to 100.',
          order: 2
        }
      ],
      quiz: {
        id: 'en-a1-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'en-a1-q1',
            prompt: 'Choose the correct greeting for 9:00 AM:',
            choices: ['Good evening', 'Good morning', 'Good night', 'Goodbye'],
            correctAnswer: 'Good morning'
          },
          {
            id: 'en-a1-q2',
            prompt: 'Complete the sentence: "My name ___ Alexander."',
            choices: ['am', 'is', 'are', 'be'],
            correctAnswer: 'is'
          },
          {
            id: 'en-a1-q3',
            prompt: 'What is the correct plural form of "book"?',
            choices: ['bookes', 'books', 'bookies', 'booken'],
            correctAnswer: 'books'
          }
        ]
      }
    },
    {
      id: 'en-lvl-a2',
      languageId: 'lang-en',
      code: 'A2',
      name: 'A2 - Waystage / Elementary',
      order: 1,
      description: 'Communicate in routine tasks requiring direct exchange of information on familiar topics.',
      lessons: [
        {
          id: 'en-a2-les-1',
          title: 'Daily Routines & Past Tense',
          content: 'Describe your day using regular and irregular past tense verbs (went, saw, ate).',
          order: 1
        },
        {
          id: 'en-a2-les-2',
          title: 'Shopping & Asking for Directions',
          content: 'Learn phrases for buying goods, inquiring about prices, and following city directions.',
          order: 2
        }
      ],
      quiz: {
        id: 'en-a2-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'en-a2-q1',
            prompt: 'Yesterday, she ___ to the supermarket.',
            choices: ['go', 'goes', 'went', 'going'],
            correctAnswer: 'went'
          },
          {
            id: 'en-a2-q2',
            prompt: 'How much ___ these apples cost?',
            choices: ['do', 'does', 'is', 'are'],
            correctAnswer: 'do'
          },
          {
            id: 'en-a2-q3',
            prompt: 'Turn ___ at the traffic light and walk straight.',
            choices: ['left', 'up', 'downwards', 'over'],
            correctAnswer: 'left'
          }
        ]
      }
    },
    {
      id: 'en-lvl-b1',
      languageId: 'lang-en',
      code: 'B1',
      name: 'B1 - Threshold / Intermediate',
      order: 2,
      description: 'Understand main points on work, school, and leisure. Produce simple connected text on topics.',
      lessons: [
        {
          id: 'en-b1-les-1',
          title: 'Expressing Opinions & Future Plans',
          content: 'Express personal viewpoints using "In my opinion" and formulate future plans with will vs going to.',
          order: 1
        },
        {
          id: 'en-b1-les-2',
          title: 'Travel & Describing Experiences',
          content: 'Discuss past travels, life events, and unexpected situations with modal verbs.',
          order: 2
        }
      ],
      quiz: {
        id: 'en-b1-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'en-b1-q1',
            prompt: 'If it rains tomorrow, we ___ cancel the trip.',
            choices: ['will', 'would', 'did', 'had'],
            correctAnswer: 'will'
          },
          {
            id: 'en-b1-q2',
            prompt: 'I have lived in this city ___ five years.',
            choices: ['since', 'for', 'during', 'while'],
            correctAnswer: 'for'
          },
          {
            id: 'en-b1-q3',
            prompt: 'Which connector indicates contrast?',
            choices: ['Furthermore', 'However', 'Consequently', 'Therefore'],
            correctAnswer: 'However'
          }
        ]
      }
    },
    {
      id: 'en-lvl-b2',
      languageId: 'lang-en',
      code: 'B2',
      name: 'B2 - Vantage / Upper Intermediate',
      order: 3,
      description: 'Interact with fluency and spontaneity with native speakers. Understand complex texts.',
      lessons: [
        {
          id: 'en-b2-les-1',
          title: 'Professional Correspondence & Idioms',
          content: 'Master formal email conventions, technical terminology, and contextual phrasal verbs.',
          order: 1
        },
        {
          id: 'en-b2-les-2',
          title: 'Abstract Discussion & Debate',
          content: 'Defend nuanced viewpoints and synthesize multiple sources of information.',
          order: 2
        }
      ],
      quiz: {
        id: 'en-b2-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'en-b2-q1',
            prompt: 'Hardly ___ when the conference commenced.',
            choices: ['had they arrived', 'they had arrived', 'did they arrive', 'have they arrived'],
            correctAnswer: 'had they arrived'
          },
          {
            id: 'en-b2-q2',
            prompt: 'The manager insisted that the report ___ submitted on Monday.',
            choices: ['is', 'be', 'was', 'being'],
            correctAnswer: 'be'
          },
          {
            id: 'en-b2-q3',
            prompt: '"To cut corners" idiomatically means:',
            choices: ['To do something poorly to save time/money', 'To build sharp turns', 'To drive dangerously', 'To be extra meticulous'],
            correctAnswer: 'To do something poorly to save time/money'
          }
        ]
      }
    },
    {
      id: 'en-lvl-c1',
      languageId: 'lang-en',
      code: 'C1',
      name: 'C1 - Effective Operational Proficiency / Advanced',
      order: 4,
      description: 'Express ideas fluently and spontaneously for academic, professional, and social purposes.',
      lessons: [
        {
          id: 'en-c1-les-1',
          title: 'Rhetorical Nuance & Stylistic Devices',
          content: 'Analyze implicit meaning, sarcasm, academic literature, and persuasive essays.',
          order: 1
        }
      ],
      quiz: {
        id: 'en-c1-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'en-c1-q1',
            prompt: 'Select the synonym for "ephemeral":',
            choices: ['Transient', 'Enduring', 'Stagnant', 'Ubiquitous'],
            correctAnswer: 'Transient'
          },
          {
            id: 'en-c1-q2',
            prompt: 'Which sentence demonstrates inversion for emphasis?',
            choices: ['Seldom have I witnessed such dedication.', 'I have seldom witnessed such dedication.', 'I witnessed dedication seldom.', 'Dedication was seldom witnessed.'],
            correctAnswer: 'Seldom have I witnessed such dedication.'
          },
          {
            id: 'en-c1-q3',
            prompt: 'What does "to mitigate an issue" mean?',
            choices: ['To make it less severe', 'To amplify it', 'To ignore it completely', 'To blame someone else'],
            correctAnswer: 'To make it less severe'
          }
        ]
      }
    },
    {
      id: 'en-lvl-c2',
      languageId: 'lang-en',
      code: 'C2',
      name: 'C2 - Mastery / Native-like Proficiency',
      order: 5,
      description: 'Effortlessly understand virtually everything heard or read. Summarize complex arguments coherently.',
      lessons: [
        {
          id: 'en-c2-les-1',
          title: 'Mastery of Global Discourse & Philosophical Synthesis',
          content: 'Critically analyze high-register legal, literary, and philosophical discourse with native precision.',
          order: 1
        }
      ],
      quiz: {
        id: 'en-c2-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'en-c2-q1',
            prompt: 'Identify the word closest in meaning to "perspicacious":',
            choices: ['Shrewd and insightful', 'Deceitful', 'Tenacious', 'Indifferent'],
            correctAnswer: 'Shrewd and insightful'
          },
          {
            id: 'en-c2-q2',
            prompt: 'Choose the grammatically immaculate high-register subjunctive phrasing:',
            choices: ['Were he to renege on the contract, litigation would ensue.', 'If he will renege on the contract, litigation ensues.', 'Had he renege on the contract, litigation ensued.', 'Should he reneged on the contract, litigation will ensue.'],
            correctAnswer: 'Were he to renege on the contract, litigation would ensue.'
          },
          {
            id: 'en-c2-q3',
            prompt: '"Antediluvian" primarily denotes:',
            choices: ['Extremely ancient or outdated', 'Violently turbulent', 'Highly prophetic', 'Geographically isolated'],
            correctAnswer: 'Extremely ancient or outdated'
          }
        ]
      }
    },

    // --- Korean (TOPIK I: 1, 2; TOPIK II: 3, 4, 5, 6) ---
    {
      id: 'ko-lvl-1',
      languageId: 'lang-ko',
      code: '1',
      name: 'TOPIK I — Level 1 (Novice)',
      order: 0,
      description: 'Hangul character mastery, basic greetings, self-introduction, and ordering simple items.',
      lessons: [
        {
          id: 'ko-1-les-1',
          title: 'Hangul Basics & Greetings',
          content: 'Master basic consonants (ㄱ, ㄴ, ㄷ), vowels (ㅏ, ㅓ, ㅗ), and standard greetings (안녕하세요, 감사합니다).',
          order: 1
        },
        {
          id: 'ko-1-les-2',
          title: 'Ordering Food & Numbers',
          content: 'Learn Sino-Korean and Native Korean numbers, and ordering with 주세요 (Ju-se-yo).',
          order: 2
        }
      ],
      quiz: {
        id: 'ko-1-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ko-1-q1',
            prompt: 'What does "감사합니다" mean?',
            choices: ['Thank you', 'Goodbye', 'Excuse me', 'Hello'],
            correctAnswer: 'Thank you'
          },
          {
            id: 'ko-1-q2',
            prompt: 'Which Hangul character makes the "M" consonant sound?',
            choices: ['ㅁ', 'ㅂ', 'ㅅ', 'ㅇ'],
            correctAnswer: 'ㅁ'
          },
          {
            id: 'ko-1-q3',
            prompt: 'How do you ask for water politely in a restaurant?',
            choices: ['물 주세요', '물 가요', '물 없어요', '물 먹어요'],
            correctAnswer: '물 주세요'
          }
        ]
      }
    },
    {
      id: 'ko-lvl-2',
      languageId: 'lang-ko',
      code: '2',
      name: 'TOPIK I — Level 2 (Elementary)',
      order: 1,
      description: 'Carrying out simple conversations in public facilities (banks, post offices) and discussing daily life.',
      lessons: [
        {
          id: 'ko-2-les-1',
          title: 'Daily Activities & Past Tense -았/었어요',
          content: 'Form past tense sentences using -았/었어요 and describe yesterday\'s activities.',
          order: 1
        }
      ],
      quiz: {
        id: 'ko-2-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ko-2-q1',
            prompt: 'What is the polite past tense of "먹다" (to eat)?',
            choices: ['먹었어요', '먹겠어요', '먹고있어요', '먹을거예요'],
            correctAnswer: '먹었어요'
          },
          {
            id: 'ko-2-q2',
            prompt: 'Complete: "도서관___ 책을 읽었습니다." (At the library)',
            choices: ['에서', '에게', '으로', '까지'],
            correctAnswer: '에서'
          },
          {
            id: 'ko-2-q3',
            prompt: 'What does the ending "-고 싶어요" express?',
            choices: ['Wanting/Desire', 'Ability/Can do', 'Prohibition', 'Past experience'],
            correctAnswer: 'Wanting/Desire'
          }
        ]
      }
    },
    {
      id: 'ko-lvl-3',
      languageId: 'lang-ko',
      code: '3',
      name: 'TOPIK II — Level 3 (Intermediate)',
      order: 2,
      description: 'Perform social activities, express opinions on general topics, and distinguish formal vs informal speech.',
      lessons: [
        {
          id: 'ko-3-les-1',
          title: 'Honorifics & Social Politeness (존댓말 & 높임말)',
          content: 'Master honorific particles and vocabulary: 께, 시, 진지, 댁, 드리다.',
          order: 1
        }
      ],
      quiz: {
        id: 'ko-3-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ko-3-q1',
            prompt: 'What is the honorific equivalent of "밥" (meal/rice)?',
            choices: ['진지', '말씀', '성함', '춘추'],
            correctAnswer: '진지'
          },
          {
            id: 'ko-3-q2',
            prompt: 'Select the honorific form of "주다" (to give):',
            choices: ['드리다', '계시다', '주무시다', '편찮으시다'],
            correctAnswer: '드리다'
          },
          {
            id: 'ko-3-q3',
            prompt: 'Which grammar form means "in order to"?',
            choices: ['-(으)려고', '-자마자', '-(으)ㄴ 적이 있다', '-는 편이다'],
            correctAnswer: '-(으)려고'
          }
        ]
      }
    },
    {
      id: 'ko-lvl-4',
      languageId: 'lang-ko',
      code: '4',
      name: 'TOPIK II — Level 4 (Upper Intermediate)',
      order: 3,
      description: 'Comprehend news, editorials, and cultural topics. Engage in workplace discussions.',
      lessons: [
        {
          id: 'ko-4-les-1',
          title: 'News Media & Professional Vocabulary',
          content: 'Understand Korean news headlines, economic terms, and social discourse.',
          order: 1
        }
      ],
      quiz: {
        id: 'ko-4-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ko-4-q1',
            prompt: 'Which expression expresses passive voice "it is said that / reportedly"?',
            choices: ['-다고 한다', '-기로 했다', '-ㄹ 지도 모른다', '-는 셈이다'],
            correctAnswer: '-다고 한다'
          },
          {
            id: 'ko-4-q2',
            prompt: 'What does "불가피하다" mean in news context?',
            choices: ['Inevitable', 'Beneficial', 'Temporary', 'Illegal'],
            correctAnswer: 'Inevitable'
          },
          {
            id: 'ko-4-q3',
            prompt: 'Choose the grammar expressing "no choice but to":',
            choices: ['-(으)ㄹ 수밖에 없다', '-(으)ㄹ 리가 없다', '-기 마련이다', '-는 법이다'],
            correctAnswer: '-(으)ㄹ 수밖에 없다'
          }
        ]
      }
    },
    {
      id: 'ko-lvl-5',
      languageId: 'lang-ko',
      code: '5',
      name: 'TOPIK II — Level 5 (Advanced)',
      order: 4,
      description: 'Professional research and business fluency in politics, economics, and abstract concepts.',
      lessons: [
        {
          id: 'ko-5-les-1',
          title: 'Socio-Political Analysis & Four-Character Idioms (사자성어)',
          content: 'Learn essential Hanja idioms: 일석이조, 고진감래, 동문서답 and formal debate.',
          order: 1
        }
      ],
      quiz: {
        id: 'ko-5-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ko-5-q1',
            prompt: 'Which four-character idiom (사자성어) means "Killing two birds with one stone"?',
            choices: ['일석이조 (一石二鳥)', '동고동락 (同苦同樂)', '새옹지마 (塞翁之馬)', '구사일생 (九死一生)'],
            correctAnswer: '일석이조 (一石二鳥)'
          },
          {
            id: 'ko-5-q2',
            prompt: 'What does the grammar "-아/어 마지않다" denote?',
            choices: ['Do not cease to / sincerely feel', 'Cannot possibly do', 'Hardly ever do', 'Pretend to do'],
            correctAnswer: '-아/어 마지않다'
          },
          {
            id: 'ko-5-q3',
            prompt: '"고진감래 (苦盡甘來)" reflects:',
            choices: ['Sweetness comes after bitterness / Hard work pays off', 'Danger follows wealth', 'Friendship above all', 'Time flies swiftly'],
            correctAnswer: 'Sweetness comes after bitterness / Hard work pays off'
          }
        ]
      }
    },
    {
      id: 'ko-lvl-6',
      languageId: 'lang-ko',
      code: '6',
      name: 'TOPIK II — Level 6 (Proficient / Mastery)',
      order: 5,
      description: 'Native-level fluency across specialized academic, legal, cultural, and philosophical domains.',
      lessons: [
        {
          id: 'ko-6-les-1',
          title: 'Advanced Stylistics & Literary Discourse',
          content: 'Produce nuanced critical treatises, examine legal documents, and synthesize classical texts.',
          order: 1
        }
      ],
      quiz: {
        id: 'ko-6-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ko-6-q1',
            prompt: 'Which literary connector denotes "moreover / on top of that" in official dissertations?',
            choices: ['차치하고서라도', '하물며', '거두절미하고', '금상첨화로'],
            correctAnswer: '하물며'
          },
          {
            id: 'ko-6-q2',
            prompt: 'What does "격세지감 (隔世之感)" express?',
            choices: ['Astonishment at how vastly the world has transformed over time', 'Unbearable sorrow', 'Joy of reunion', 'Fear of future tribulations'],
            correctAnswer: 'Astonishment at how vastly the world has transformed over time'
          },
          {
            id: 'ko-6-q3',
            prompt: 'Select the highest register expression for "to acknowledge / uphold":',
            choices: ['천명하다', '어물거리다', '치부하다', '간과하다'],
            correctAnswer: '천명하다'
          }
        ]
      }
    },

    // --- Japanese (JLPT: N5, N4, N3, N2, N1 - N5 easiest, N1 hardest) ---
    {
      id: 'ja-lvl-n5',
      languageId: 'lang-ja',
      code: 'N5',
      name: 'JLPT N5 — Basic Japanese',
      order: 0,
      description: 'Hiragana, Katakana, ~100 basic Kanji, essential greetings, and simple daily interactions.',
      lessons: [
        {
          id: 'ja-n5-les-1',
          title: 'Hiragana, Katakana & Polite Desu/Masu',
          content: 'Master phonetic kana tables, polite verb endings (〜ます, 〜ました), and particles (は, を, に).',
          order: 1
        },
        {
          id: 'ja-n5-les-2',
          title: 'Basic Kanji & Daily Expressions',
          content: 'Learn numbers, days of the week, and foundational kanji (日, 月, 火, 水, 木, 金, 土).',
          order: 2
        }
      ],
      quiz: {
        id: 'ja-n5-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ja-n5-q1',
            prompt: 'What does "ありがとう" mean?',
            choices: ['Thank you', 'Good morning', 'Excuse me', 'Goodbye'],
            correctAnswer: 'Thank you'
          },
          {
            id: 'ja-n5-q2',
            prompt: 'Which particle indicates the direct object of an action?',
            choices: ['を (o)', 'は (wa)', 'に (ni)', 'が (ga)'],
            correctAnswer: 'を (o)'
          },
          {
            id: 'ja-n5-q3',
            prompt: 'What is the reading of "水"?',
            choices: ['みず (mizu)', 'ひ (hi)', 'き (ki)', 'つち (tsuchi)'],
            correctAnswer: 'みず (mizu)'
          }
        ]
      }
    },
    {
      id: 'ja-lvl-n4',
      languageId: 'lang-ja',
      code: 'N4',
      name: 'JLPT N4 — Elementary Japanese',
      order: 1,
      description: 'Understand conversations encountered in everyday life spoken at a measured pace (~300 Kanji).',
      lessons: [
        {
          id: 'ja-n4-les-1',
          title: 'Te-Form & Ongoing Actions (〜ている)',
          content: 'Form the versatile te-form to request (〜てください) and express current states (〜ています).',
          order: 1
        }
      ],
      quiz: {
        id: 'ja-n4-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ja-n4-q1',
            prompt: 'What is the te-form of "食べる" (taberu)?',
            choices: ['食べて', '食べた', '食べない', '食べろ'],
            correctAnswer: '食べて'
          },
          {
            id: 'ja-n4-q2',
            prompt: 'Which phrase means "Please do not enter"?',
            choices: ['入らないでください', '入ってください', '入ることができます', '入らなければならない'],
            correctAnswer: '入らないでください'
          },
          {
            id: 'ja-n4-q3',
            prompt: 'What does "〜たことがある" express?',
            choices: ['Past experience ("have done")', 'Future plan', 'Obligation', 'Prohibition'],
            correctAnswer: 'Past experience ("have done")'
          }
        ]
      }
    },
    {
      id: 'ja-lvl-n3',
      languageId: 'lang-ja',
      code: 'N3',
      name: 'JLPT N3 — Intermediate Japanese',
      order: 2,
      description: 'Bridging everyday Japanese to higher registers. Grasp specific points in natural-speed dialogue (~650 Kanji).',
      lessons: [
        {
          id: 'ja-n3-les-1',
          title: 'Keigo (Honorifics & Humble Form) & Conditional Forms',
          content: 'Understand Sonkeigo (respectful) and Kenjougo (humble), plus 〜ば and 〜たら conditionals.',
          order: 1
        }
      ],
      quiz: {
        id: 'ja-n3-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ja-n3-q1',
            prompt: 'What is the respectful (Sonkeigo) form of "言う" (to say)?',
            choices: ['おっしゃる', '申す', '参る', 'いただく'],
            correctAnswer: 'おっしゃる'
          },
          {
            id: 'ja-n3-q2',
            prompt: 'Which humble (Kenjougo) verb corresponds to "行く" (to go)?',
            choices: ['参る (mairu)', 'いらっしゃる', 'おいでになる', '召し上がる'],
            correctAnswer: '参る (mairu)'
          },
          {
            id: 'ja-n3-q3',
            prompt: 'What nuance does "〜わけではない" carry?',
            choices: ['It does not necessarily mean that', 'It is absolutely forbidden', 'There is no doubt that', 'I decided to'],
            correctAnswer: 'It does not necessarily mean that'
          }
        ]
      }
    },
    {
      id: 'ja-lvl-n2',
      languageId: 'lang-ja',
      code: 'N2',
      name: 'JLPT N2 — Pre-Advanced Japanese',
      order: 3,
      description: 'Understand Japanese in a broad range of everyday and business situations (~1,000 Kanji).',
      lessons: [
        {
          id: 'ja-n2-les-1',
          title: 'Business Dialogue & Editorial Comprehension',
          content: 'Master formal connectors (〜にもかかわらず, 〜に基づき) and workplace email etiquette.',
          order: 1
        }
      ],
      quiz: {
        id: 'ja-n2-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ja-n2-q1',
            prompt: 'What does "〜にもかかわらず" mean?',
            choices: ['Despite / In spite of', 'Because of', 'In order to', 'According to'],
            correctAnswer: 'Despite / In spite of'
          },
          {
            id: 'ja-n2-q2',
            prompt: 'Which grammar form denotes "as soon as"?',
            choices: ['〜次第 (shidai)', '〜きり', '〜ばかり', '〜つつ'],
            correctAnswer: '〜次第 (shidai)'
          },
          {
            id: 'ja-n2-q3',
            prompt: 'Complete: "法律に___、公平に判断します。" (Based on the law)',
            choices: ['基づいて', '限って', '関わらず', '通して'],
            correctAnswer: '基づいて'
          }
        ]
      }
    },
    {
      id: 'ja-lvl-n1',
      languageId: 'lang-ja',
      code: 'N1',
      name: 'JLPT N1 — Advanced / Mastery',
      order: 4,
      description: 'Comprehend complex, abstract texts, editorials, and nuanced lectures with native eloquence (~2,000+ Kanji).',
      lessons: [
        {
          id: 'ja-n1-les-1',
          title: 'Advanced Classical Expressions & Nuanced Argumentation',
          content: 'Master rare grammatical structures (〜極まりない, 〜であれ, 〜を皮切りに) and complex discourse.',
          order: 1
        }
      ],
      quiz: {
        id: 'ja-n1-quiz',
        passThreshold: 0.8,
        questions: [
          {
            id: 'ja-n1-q1',
            prompt: 'What does "失礼極まりない" express?',
            choices: ['Extremely / utterly rude', 'Somewhat impolite', 'Surprisingly courteous', 'Pardon my intrusion'],
            correctAnswer: 'Extremely / utterly rude'
          },
          {
            id: 'ja-n1-q2',
            prompt: 'Which phrase means "Even if that were so"?',
            choices: ['そうであるにせよ', 'そうであれかし', 'そうであるゆえに', 'そうであるからこそ'],
            correctAnswer: 'そうであるにせよ'
          },
          {
            id: 'ja-n1-q3',
            prompt: 'Complete the high-register idiom: "危機を___乗り越える。" (Escape danger by a hair\'s breadth)',
            choices: ['一命を賭して', '間一髪で', '紆余曲折の末', '臨機応変に'],
            correctAnswer: '間一髪で'
          }
        ]
      }
    }
  ]
};

export { SEED_DATA };
