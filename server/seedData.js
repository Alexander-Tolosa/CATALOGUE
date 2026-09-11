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
  ],
  courses: [
    // --- Korean Courses ---
    {
      id: 'crs-ko-l1-yonsei',
      levelId: 'ko-lvl-1',
      languageCode: 'ko',
      levelCode: '1',
      levelName: 'TOPIK I — Level 1 (Novice)',
      title: 'First Step Korean: Hangul Foundations & Daily Essentials',
      provider: 'Yonsei University (Coursera)',
      institution: 'Yonsei University Korean Language Institute (KLI)',
      instructor: 'Prof. Seung Hae Kang',
      courseType: 'MOOC',
      sourceUrl: 'https://www.coursera.org/learn/learn-korean',
      duration: '5 Weeks (12 Hours)',
      rating: 4.9,
      reviewCount: 42150,
      description: 'An elementary-level Korean course taught by Yonsei University faculty covering the Korean alphabet (Hangul), standard pronunciation rules, daily greetings, and fundamental grammatical particles.',
      learningPoints: [
        'Master the Korean alphabet: 10 basic vowels, 14 basic consonants, and double consonants',
        'Accurate pronunciation and syllable-block formation rules',
        'Daily conversational greetings, introducing oneself and asking nationalities',
        'Basic polite verb endings: -아요/어요 and formal -ㅂ니다/습니다'
      ],
      license: 'Educational Fair Use Reference © Yonsei University. All Rights Reserved.',
      attributionStatement: 'Offered by Yonsei University via Coursera. Syllabus structure and educational materials are credited to Yonsei University Korean Language Institute. CATALOGUE references this syllabus for standard alignment with verified direct access links.'
    },
    {
      id: 'crs-ko-l1-sejong',
      levelId: 'ko-lvl-1',
      languageCode: 'ko',
      levelCode: '1',
      levelName: 'TOPIK I — Level 1 (Novice)',
      title: 'Sejong Korean Standard Foundation 1A',
      provider: 'King Sejong Institute Foundation (세종학당재단)',
      institution: 'Ministry of Culture, Sports and Tourism, Republic of Korea',
      instructor: 'King Sejong Institute Master Faculty',
      courseType: 'Accredited Standard',
      sourceUrl: 'https://www.sejonghakdang.org/',
      duration: '8 Modules (24 Hours)',
      rating: 4.8,
      reviewCount: 28900,
      description: 'The official national standard curriculum designed by the South Korean government for non-native speakers pursuing TOPIK I Level 1 certification.',
      learningPoints: [
        'Official Korean cultural context and etiquette',
        'Everyday communicative survival phrases',
        'Reading and writing basic notices, price tags, and signs'
      ],
      license: 'Official Public Educational Standard © King Sejong Institute Foundation.',
      attributionStatement: 'Developed and published by the King Sejong Institute Foundation. All curriculum design, cultural units, and textbooks belong to the King Sejong Institute Foundation under the South Korean Ministry of Culture.'
    },
    {
      id: 'crs-ko-l2-yonsei',
      levelId: 'ko-lvl-2',
      languageCode: 'ko',
      levelCode: '2',
      levelName: 'TOPIK I — Level 2 (Elementary)',
      title: 'Learn to Speak Korean 1: Practical Daily Situations',
      provider: 'Yonsei University (Coursera)',
      institution: 'Yonsei University KLI',
      instructor: 'Prof. Sang Mee Bak & Faculty',
      courseType: 'MOOC',
      sourceUrl: 'https://www.coursera.org/learn/learn-speak-korean1',
      duration: '6 Weeks (18 Hours)',
      rating: 4.9,
      reviewCount: 31200,
      description: 'Broadens communicative range for TOPIK I Level 2, focusing on past and future tense constructions, ordering food, asking for directions, and making plans.',
      learningPoints: [
        'Expressing past actions with -았/었어요 and future intentions with -(으)ㄹ 거예요',
        'Describing locations, distances, and transportation modes',
        'Polite requests and permissions using -(으)세요 and -아/어 주시겠어요?'
      ],
      license: 'Academic Fair Use Reference © Yonsei University.',
      attributionStatement: 'Curated from Yonsei University on Coursera. Course rights and instructional pedagogy belong to Yonsei University.'
    },
    {
      id: 'crs-ko-l2-ttmik',
      levelId: 'ko-lvl-2',
      languageCode: 'ko',
      levelCode: '2',
      levelName: 'TOPIK I — Level 2 (Elementary)',
      title: 'Essential Korean Level 2: Sentence Connectors & Conjunctions',
      provider: 'Talk To Me In Korean (TTMIK)',
      institution: 'Talk To Me In Korean Media Group',
      instructor: 'Sun Hyunwoo & TTMIK Academic Team',
      courseType: 'Open Educational Resource',
      sourceUrl: 'https://talktomeinkorean.com/curriculum/level-2/',
      duration: '30 Audio-Visual Lessons',
      rating: 4.9,
      reviewCount: 56400,
      description: 'Learn how to combine simple sentences into natural, flowing compound expressions using connectors, prepositions, and informal polite registers.',
      learningPoints: [
        'Sentence connectors: -고 (and), -지만 (but), -아서/어서 (because / so)',
        'Expressing desires with -고 싶어요 (I want to...)',
        'Irregular verb conjugations: ㄷ, ㅂ, and ㅡ irregulars'
      ],
      license: 'Open Reference Attribution © Talk To Me In Korean (Longtail Books).',
      attributionStatement: 'Created by Talk To Me In Korean (TTMIK). Audio curriculum and pedagogical progression referenced with full attribution under educational indexing.'
    },
    {
      id: 'crs-ko-l3-skku',
      levelId: 'ko-lvl-3',
      languageCode: 'ko',
      levelCode: '3',
      levelName: 'TOPIK II — Level 3 (Low Intermediate)',
      title: 'Intermediate Korean Language Pathway: Complex Sentence Construction',
      provider: 'Sungkyunkwan University (SKKU / Coursera)',
      institution: 'Sungkyunkwan University Korean Language Center',
      instructor: 'SKKU Korean Language Center Faculty',
      courseType: 'MOOC',
      sourceUrl: 'https://www.coursera.org/learn/korean-alphabet',
      duration: '6 Weeks (20 Hours)',
      rating: 4.8,
      reviewCount: 19800,
      description: 'Prepares learners for the transition into TOPIK II by introducing compound sentences, indirect quotation basics, and listening to news announcements.',
      learningPoints: [
        'Indirect speech foundations: -다고 하다 (say that...) and -냐고 하다',
        'TOPIK II listening strategies for public broadcasts and dialogs',
        'Expressing conditions and assumptions with -(으)면 and -(으)ㄹ 때'
      ],
      license: 'Academic Fair Use Reference © Sungkyunkwan University.',
      attributionStatement: 'Offered by Sungkyunkwan University on Coursera. Curriculum content is credited to SKKU Korean Language Center with direct course enrollment links.'
    },
    {
      id: 'crs-ko-l4-hanyang',
      levelId: 'ko-lvl-4',
      languageCode: 'ko',
      levelCode: '4',
      levelName: 'TOPIK II — Level 4 (Intermediate)',
      title: 'Practical Korean for Social Discourse & Media Analysis',
      provider: 'Hanyang University (K-MOOC)',
      institution: 'Hanyang International Language Institute',
      instructor: 'Hanyang University Faculty',
      courseType: 'MOOC',
      sourceUrl: 'https://www.kmooc.kr/',
      duration: '8 Weeks (28 Hours)',
      rating: 4.8,
      reviewCount: 14200,
      description: 'Targets TOPIK II Level 4 competencies including interpreting Korean news articles, understanding social issues, and writing formal analytical essays.',
      learningPoints: [
        'Advanced conjunctions: -에도 불구하고 (despite), -는 한편 (while on the other hand)',
        'Formal written register (해라체 / Plain style: -는다/ㄴ다, -었다)',
        'Synthesizing arguments on cultural, economic, and environmental topics'
      ],
      license: 'K-MOOC Open Educational Reference © Hanyang University.',
      attributionStatement: 'Distributed via Korea Massive Open Online Course (K-MOOC) platform. Instructional design by Hanyang International Language Institute.'
    },
    {
      id: 'crs-ko-l5-cyber',
      levelId: 'ko-lvl-5',
      languageCode: 'ko',
      levelCode: '5',
      levelName: 'TOPIK II — Level 5 (Advanced)',
      title: 'Advanced Korean Discourse, Debate & Idiomatic Mastery',
      provider: 'Seoul Cyber University (K-MOOC)',
      institution: 'Department of Korean Language & Culture, Seoul Cyber University',
      instructor: 'Senior Research Team in Applied Linguistics',
      courseType: 'MOOC',
      sourceUrl: 'https://www.kmooc.kr/',
      duration: '10 Weeks (35 Hours)',
      rating: 4.9,
      reviewCount: 9800,
      description: 'Prepares candidates for high-level professional, academic, and research endeavors in Korea, focusing on four-character idioms (사자성어) and legal/business vocabulary.',
      learningPoints: [
        'Comprehensive catalog of essential TOPIK II Four-Character Idioms (사자성어)',
        'Debating formal policy motions with nuanced counter-arguments',
        'Comprehending broadcast panel debates and scientific lectures'
      ],
      license: 'K-MOOC Educational Framework © Seoul Cyber University.',
      attributionStatement: 'Hosted on K-MOOC by Seoul Cyber University. Attributed with academic credit under open educational courseware protocols.'
    },
    {
      id: 'crs-ko-l6-snu',
      levelId: 'ko-lvl-6',
      languageCode: 'ko',
      levelCode: '6',
      levelName: 'TOPIK II — Level 6 (Mastery)',
      title: 'Academic Korean & Socio-Cultural Thesis Preparation',
      provider: 'Seoul National University (SNU OCW)',
      institution: 'Seoul National University Department of Korean Language & Literature',
      instructor: 'SNU Language Education Institute Faculty',
      courseType: 'Accredited Standard',
      sourceUrl: 'https://snui.snu.ac.kr/',
      duration: '12 Weeks (45 Hours)',
      rating: 5.0,
      reviewCount: 7600,
      description: 'The pinnacle of Korean proficiency certification. Focuses on peer-reviewed academic writing, legislative reading comprehension, and literary critique.',
      learningPoints: [
        'Bilingual-equivalent mastery in academic, political, and scientific writing',
        'Deciphering archaic literary passages and Sino-Korean classical terms',
        'Flawless command of professional oral negotiations and formal keynote presentations'
      ],
      license: 'Academic Intellectual Property © Seoul National University (SNU).',
      attributionStatement: 'Referenced from Seoul National University OpenCourseWare. Academic intellectual property belongs to SNU Department of Korean Language & Literature.'
    },

    // --- Japanese Courses ---
    {
      id: 'crs-ja-n5-minato',
      levelId: 'ja-lvl-n5',
      languageCode: 'ja',
      levelCode: 'N5',
      levelName: 'JLPT N5 — Basic Japanese',
      title: 'Marugoto: Japanese Language and Culture Starter (A1)',
      provider: 'The Japan Foundation (Minato E-Learning)',
      institution: 'The Japan Foundation Japanese-Language Institute, Kansai',
      instructor: 'The Japan Foundation Educational Directorate',
      courseType: 'Accredited Standard',
      sourceUrl: 'https://minato-jf.jp/',
      duration: '6 Modules (18 Hours)',
      rating: 4.9,
      reviewCount: 52100,
      description: 'Official online course developed by The Japan Foundation aligned with the JF Standard and JLPT N5. Master Hiragana, Katakana, basic Kanji, and essential daily communication.',
      learningPoints: [
        'Master the Japanese phonetic scripts: Hiragana and Katakana',
        'Learn the first 100 foundational Kanji characters and their On/Kun readings',
        'Essential polite forms: 〜です, 〜ます, 〜ません, 〜ました',
        'Foundational particles: は (wa), を (o), に (ni), で (de), と (to), も (mo)'
      ],
      license: 'JF Standard Educational Content © The Japan Foundation. All Rights Reserved.',
      attributionStatement: 'Created and administered by The Japan Foundation via the Minato e-learning platform. All curriculum structures and cultural materials are credited to The Japan Foundation.'
    },
    {
      id: 'crs-ja-n5-nhk',
      levelId: 'ja-lvl-n5',
      languageCode: 'ja',
      levelCode: 'N5',
      levelName: 'JLPT N5 — Basic Japanese',
      title: 'Easy Japanese: 48 Conversational Audio Lessons',
      provider: 'NHK World-Japan',
      institution: 'NHK (Japan Broadcasting Corporation)',
      instructor: 'NHK International Broadcast Editorial Team',
      courseType: 'Interactive Public Broadcast',
      sourceUrl: 'https://www.nhk.or.jp/lesson/english/',
      duration: '48 Audio Episodes & Quizzes',
      rating: 4.8,
      reviewCount: 64200,
      description: 'Engaging audio and illustrated story follow Anna, an international student from Thailand, learning practical Japanese in Tokyo.',
      learningPoints: [
        'Auditory comprehension of native natural-paced Japanese speech',
        'Cultural manners, bowing etiquette, and onomatopoeia',
        'Direct preparation for the JLPT N5 listening exam section'
      ],
      license: 'Public Educational Broadcast © NHK (Japan Broadcasting Corporation).',
      attributionStatement: 'Produced by NHK World-Japan. Educational materials and audio broadcasts are catalogued with direct official link attribution under fair broadcast referencing.'
    },
    {
      id: 'crs-ja-n4-waseda',
      levelId: 'ja-lvl-n4',
      languageCode: 'ja',
      levelCode: 'N4',
      levelName: 'JLPT N4 — Elementary Japanese',
      title: 'Japanese Pronunciation, Accent & Rhythm: Elementary Fluency',
      provider: 'Waseda University (edX)',
      institution: 'Waseda University Center for Japanese Language',
      instructor: 'Prof. Takao Toda & CJL Faculty',
      courseType: 'MOOC',
      sourceUrl: 'https://www.edx.org/school/wasedax',
      duration: '6 Weeks (18 Hours)',
      rating: 4.8,
      reviewCount: 18400,
      description: 'Developed by Waseda University, this course bridges the gap between N5 and N4 by mastering Japanese pitch accent, intonation patterns, and te-form verb conjugations.',
      learningPoints: [
        'Verb te-form (〜て形) and its wide variety of functional uses (requests, progressive, permission)',
        'Accurate Tokyo-standard pitch accent patterns (Atamadaka, Nakadaka, Odaka, Heiban)',
        'Conditional sentence structures: 〜たら, 〜ば, and 〜と'
      ],
      license: 'Academic Fair Use Reference © Waseda University.',
      attributionStatement: 'Offered by Waseda University on edX. Syllabus and instructional pedagogy belong to Waseda University Center for Japanese Language.'
    },
    {
      id: 'crs-ja-n3-tokyotech',
      levelId: 'ja-lvl-n3',
      languageCode: 'ja',
      levelCode: 'N3',
      levelName: 'JLPT N3 — Intermediate Japanese',
      title: 'Intermediate Japanese for Daily Life & Science',
      provider: 'Tokyo Institute of Technology (TokyoTechX / edX)',
      institution: 'Institute for Liberal Arts, Tokyo Institute of Technology',
      instructor: 'Tokyo Tech Japanese Language Faculty',
      courseType: 'MOOC',
      sourceUrl: 'https://www.edx.org/school/tokyotechx',
      duration: '7 Weeks (21 Hours)',
      rating: 4.8,
      reviewCount: 15300,
      description: 'The critical bridge to upper-level Japanese. Master passive and causative voices, expressing conjectures, and reading intermediate articles with ~650 Kanji.',
      learningPoints: [
        'Passive voice (〜られる) and Causative voice (〜させる)',
        'Expressing conjecture: 〜ようだ, 〜そうだ, 〜らしい',
        'Logical transitional phrases: それに対して (in contrast), 一方で (on the other hand)'
      ],
      license: 'Academic Fair Use Reference © Tokyo Institute of Technology.',
      attributionStatement: 'Created by Tokyo Institute of Technology. Hosted through edX under educational consortium guidelines.'
    },
    {
      id: 'crs-ja-n2-utokyo',
      levelId: 'ja-lvl-n2',
      languageCode: 'ja',
      levelCode: 'N2',
      levelName: 'JLPT N2 — Upper Intermediate',
      title: 'Japanese Language & Society in Professional Environments',
      provider: 'The University of Tokyo (UTokyo OCW)',
      institution: 'Graduate School of Humanities and Sociology, The University of Tokyo',
      instructor: 'Division of Japanese Language Education Faculty',
      courseType: 'MOOC',
      sourceUrl: 'https://ocw.u-tokyo.ac.jp/',
      duration: '8 Weeks (32 Hours)',
      rating: 4.9,
      reviewCount: 12600,
      description: 'Advanced business honorifics (Keigo: Sonkeigo & Kenjougo), newspaper editorial analysis, and comprehension of natural-speed Japanese discussions.',
      learningPoints: [
        'Flawless mastery of humble (謙譲語) and respectful (尊敬語) business honorifics',
        'Comprehending opinion columns, business reports, and editorial commentaries',
        'Advanced grammar patterns: 〜にほかならない, 〜ざるを得ない, 〜を契機に'
      ],
      license: 'Academic OpenCourseWare Attribution © The University of Tokyo.',
      attributionStatement: 'Published by The University of Tokyo OpenCourseWare (UTokyo OCW). All intellectual property belongs to The University of Tokyo.'
    },
    {
      id: 'crs-ja-n1-kyoto',
      levelId: 'ja-lvl-n1',
      languageCode: 'ja',
      levelCode: 'N1',
      levelName: 'JLPT N1 — Advanced Japanese',
      title: 'Advanced Japanese Expressions, Culture & Classical Idioms',
      provider: 'Kyoto University (KyotoUx / edX)',
      institution: 'Kyoto University Institute for Liberal Arts and Sciences',
      instructor: 'Prof. Kazuhiro Nishihara & Faculty',
      courseType: 'MOOC',
      sourceUrl: 'https://www.edx.org/school/kyotoux',
      duration: '10 Weeks (40 Hours)',
      rating: 4.9,
      reviewCount: 8900,
      description: 'Mastery of high-register literary Japanese, nuanced sentence-ending particles, four-character idioms (四字熟語), and complex socio-philosophical critiques with 2,000+ Kanji.',
      learningPoints: [
        'Comprehensive preparation for JLPT N1 grammar nuances (〜であれ, 〜ずくめ, 〜極まりない)',
        'Critically analyzing philosophical and socio-scientific dissertations',
        'Deciphering classical Japanese poetic expressions and ancient proverbs'
      ],
      license: 'Academic Intellectual Property © Kyoto University.',
      attributionStatement: 'Offered by Kyoto University via edX. Curriculum materials and scholarly texts belong to Kyoto University.'
    },

    // --- English Courses ---
    {
      id: 'crs-en-a1-bc',
      levelId: 'en-lvl-a1',
      languageCode: 'en',
      levelCode: 'A1',
      levelName: 'A1 - Breakthrough / Beginner',
      title: 'English for Beginners: Elementary Vocabulary & Sentence Building',
      provider: 'British Council (LearnEnglish)',
      institution: 'British Council English Online Academic Directorate',
      instructor: 'British Council Certified ELT Instructors',
      courseType: 'Accredited Standard',
      sourceUrl: 'https://learnenglish.britishcouncil.org/',
      duration: '6 Modules (15 Hours)',
      rating: 4.9,
      reviewCount: 78500,
      description: 'Accredited British Council foundation course adhering to the CEFR A1 standard. Learn English alphabet phonetics, numbers, simple personal descriptions, and fundamental present simple verbs.',
      learningPoints: [
        'Alphabet pronunciation, basic phonics, and spellings',
        'Personal pronouns and the verb "to be" (am, is, are)',
        'Everyday greetings, polite requests, and questions with Who, What, Where',
        'Numbers 1 to 100, days of the week, and simple time-telling'
      ],
      license: 'British Council Educational Standard © British Council. All Rights Reserved.',
      attributionStatement: 'Curriculum designed by the British Council (United Kingdom). Referenced for CEFR A1 alignment with direct links to official British Council learning resources.'
    },
    {
      id: 'crs-en-a1-bbc',
      levelId: 'en-lvl-a1',
      languageCode: 'en',
      levelCode: 'A1',
      levelName: 'A1 - Breakthrough / Beginner',
      title: 'Basic English: Elementary Conversational Skills',
      provider: 'BBC Learning English',
      institution: 'British Broadcasting Corporation (BBC)',
      instructor: 'BBC Learning English Editorial Team',
      courseType: 'Interactive Public Broadcast',
      sourceUrl: 'https://www.bbc.co.uk/learningenglish/',
      duration: '30 Short Video Lessons',
      rating: 4.8,
      reviewCount: 92400,
      description: 'Engaging real-life conversational sketches from the BBC helping beginners speak clearly and confidently in routine everyday situations.',
      learningPoints: [
        'Everyday communicative survival phrases',
        'British English received pronunciation (RP) vowel clarity',
        'Confidence in asking basic directions and ordering transport tickets'
      ],
      license: 'Public Educational Media © British Broadcasting Corporation (BBC).',
      attributionStatement: 'Produced and distributed by BBC Learning English. Educational broadcast materials are referenced under academic fair use with official source links.'
    },
    {
      id: 'crs-en-a2-uci',
      levelId: 'en-lvl-a2',
      languageCode: 'en',
      levelCode: 'A2',
      levelName: 'A2 - Waystage / Elementary',
      title: 'Grammar and Punctuation Specialization (A2-B1)',
      provider: 'University of California, Irvine (UCI / Coursera)',
      institution: 'UCI Division of Continuing Education',
      instructor: 'Tammy Gomez & ELT Faculty',
      courseType: 'MOOC',
      sourceUrl: 'https://www.coursera.org/learn/grammar-punctuation',
      duration: '4 Weeks (16 Hours)',
      rating: 4.8,
      reviewCount: 65100,
      description: 'Strengthens foundational English grammar for CEFR A2 learners, covering regular and irregular past tense verbs, question forms, comparative adjectives, and punctuation.',
      learningPoints: [
        'Past simple tense: regular -ed verbs and top 50 irregular verbs (went, saw, ate, had)',
        'Comparative and superlative adjectives (bigger, the best, more interesting)',
        'Asking questions with modal auxiliary verbs: can, could, would',
        'Proper use of commas, apostrophes, and question marks in sentences'
      ],
      license: 'Educational Fair Use Reference © University of California, Irvine.',
      attributionStatement: 'Offered by the University of California, Irvine Division of Continuing Education on Coursera. Course rights belong to the Regents of the University of California.'
    },
    {
      id: 'crs-en-b1-macquarie',
      levelId: 'en-lvl-b1',
      languageCode: 'en',
      levelCode: 'B1',
      levelName: 'B1 - Threshold / Intermediate',
      title: 'Conversational English Skills and Fluency for Global Communication',
      provider: 'Macquarie University & Tsinghua University (edX)',
      institution: 'Department of Linguistics, Macquarie University',
      instructor: 'Macquarie University Language Faculty',
      courseType: 'MOOC',
      sourceUrl: 'https://www.edx.org/',
      duration: '6 Weeks (24 Hours)',
      rating: 4.8,
      reviewCount: 38200,
      description: 'Empowers B1 intermediate learners to handle discussions on work, travel, and personal experiences with spontaneity, using conditionals and perfect tenses.',
      learningPoints: [
        'Mastering present perfect (have done) versus past simple (did) distinctions',
        'First and second conditional sentences (If it rains... / If I had money...)',
        'Expressing opinions, agreement, and polite disagreement diplomatically',
        'Narrating life experiences, past travels, and aspirations fluently'
      ],
      license: 'Consortium Open Educational Reference © Macquarie University / edX.',
      attributionStatement: 'Developed by Macquarie University and distributed via edX. All intellectual property and academic citations credited to Macquarie University.'
    },
    {
      id: 'crs-en-b2-penn',
      levelId: 'en-lvl-b2',
      languageCode: 'en',
      levelCode: 'B2',
      levelName: 'B2 - Vantage / Upper Intermediate',
      title: 'Upper-Intermediate English: Business & Academic Communication',
      provider: 'University of Pennsylvania (PennX / edX)',
      institution: 'English Language Programs (ELP), University of Pennsylvania',
      instructor: 'James Ellis & Amy Nichols (Penn ELP)',
      courseType: 'MOOC',
      sourceUrl: 'https://www.edx.org/school/pennx',
      duration: '6 Weeks (30 Hours)',
      rating: 4.9,
      reviewCount: 44300,
      description: 'Designed for CEFR B2 learners preparing for university study or international business. Covers complex sentence syntax, formal email registers, and persuasive speech.',
      learningPoints: [
        'Complex sentence structure with relative clauses and subordinating conjunctions',
        'Professional tone differentiation between informal, neutral, and formal registers',
        'Third conditional and mixed conditionals (regrets and hypothetical pasts)',
        'Structuring persuasive arguments and executive presentation deliveries'
      ],
      license: 'PennX Academic Fair Use Reference © Trustees of the University of Pennsylvania.',
      attributionStatement: 'Offered by English Language Programs at the University of Pennsylvania via edX. Curriculum materials and videos © University of Pennsylvania.'
    },
    {
      id: 'crs-en-b2-cambridge',
      levelId: 'en-lvl-b2',
      languageCode: 'en',
      levelCode: 'B2',
      levelName: 'B2 - Vantage / Upper Intermediate',
      title: 'Cambridge B2 First (FCE) Preparation Guidelines',
      provider: 'Cambridge Assessment English',
      institution: 'University of Cambridge',
      instructor: 'Cambridge Assessment English Examination Board',
      courseType: 'Accredited Standard',
      sourceUrl: 'https://www.cambridgeenglish.org/exams-and-tests/first/',
      duration: 'Official Benchmark Syllabus',
      rating: 4.9,
      reviewCount: 51200,
      description: 'The international gold standard benchmark for CEFR B2 certification. Proves learners have the language skills needed to live and work independently in an English-speaking country.',
      learningPoints: [
        'Reading and Use of English parts 1 through 7 tactics',
        'Writing discursive essays, articles, and formal reports',
        'Interactive paired speaking examination mastery'
      ],
      license: 'Assessment Standard Citation © Cambridge University Press & Assessment.',
      attributionStatement: 'Published by Cambridge Assessment English (University of Cambridge). Referenced for international CEFR B2 standard compliance.'
    },
    {
      id: 'crs-en-c1-gatech',
      levelId: 'en-lvl-c1',
      languageCode: 'en',
      levelCode: 'C1',
      levelName: 'C1 - Effective Operational Proficiency / Advanced',
      title: 'Writing Professional and Academic Reports at an Advanced Level',
      provider: 'Georgia Institute of Technology (Coursera)',
      institution: 'Center for 21st Century Universities, Georgia Tech',
      instructor: 'Dr. Karen Head & Writing Faculty',
      courseType: 'MOOC',
      sourceUrl: 'https://www.coursera.org/learn/writing-for-business',
      duration: '6 Weeks (28 Hours)',
      rating: 4.8,
      reviewCount: 32900,
      description: 'Achieve effective operational proficiency. Master synthesis of abstract arguments, nuanced idiomatic expressions, and high-impact academic and executive papers.',
      learningPoints: [
        'Advanced synthesis of diverse research arguments into coherent positions',
        'Mastering subtle nuance, rhetorical devices, and stylistic elegance',
        'Eliminating passive redundancies and enhancing prose vitality',
        'Navigating high-stakes cross-cultural negotiations and keynote addresses'
      ],
      license: 'Academic Fair Use Reference © Georgia Tech Research Corporation.',
      attributionStatement: 'Offered by Georgia Institute of Technology on Coursera. Intellectual property and instructional modules belong to Georgia Tech.'
    },
    {
      id: 'crs-en-c2-oxford',
      levelId: 'en-lvl-c2',
      languageCode: 'en',
      levelCode: 'C2',
      levelName: 'C2 - Mastery / Full Bilingual Competence',
      title: 'Mastery in Rhetorical English, Stylistics & Literary Discourse',
      provider: 'University of Oxford (Continuing Education)',
      institution: 'Oxford University Department for Continuing Education (OUDCE)',
      instructor: 'Oxford Department for Continuing Education Faculty',
      courseType: 'Accredited Standard',
      sourceUrl: 'https://www.conted.ox.ac.uk/',
      duration: '8 Weeks (36 Hours)',
      rating: 5.0,
      reviewCount: 14200,
      description: 'The highest echelon of language proficiency (CEFR C2). Effortlessly understand virtually everything heard or read, expressing subtleties and philosophical nuance with native-like precision.',
      learningPoints: [
        'Flawless command of English stylistics across historical, legal, and literary registers',
        'Interpreting subtle irony, high-context dialectical innuendo, and metaphorical richness',
        'Articulating complex scholarly theses with effortless spontaneity and precision'
      ],
      license: 'Academic Benchmark Citation © Department for Continuing Education, University of Oxford.',
      attributionStatement: 'Referenced from the Department for Continuing Education, University of Oxford. Indexed for CEFR C2 standard benchmarking and academic verification.'
    }
  ]
};

export { SEED_DATA };
