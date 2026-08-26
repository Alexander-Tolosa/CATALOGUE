import { MatchingCategoryId, MatchingCategoryMeta, MatchingPair, LanguageTrack } from '../types';

export const MATCHING_CATEGORIES: Record<LanguageTrack, MatchingCategoryMeta[]> = {
  ko: [
    {
      id: 'food',
      title: 'Food & Drinks',
      nativeTitle: '음식과 음료',
      description: 'Master everyday meals, snacks, fruits, and refreshing drinks',
      icon: 'restaurant',
      badgeColor: 'from-amber-500 to-orange-500',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      totalWords: 16,
      tags: ['Daily Life', 'Essential', 'Taste']
    },
    {
      id: 'things',
      title: 'Things & Objects',
      nativeTitle: '사물과 일상용품',
      description: 'Recognize everyday items, nature, surroundings, and essentials',
      icon: 'category',
      badgeColor: 'from-blue-500 to-cyan-500',
      glowColor: 'rgba(59, 130, 246, 0.35)',
      totalWords: 16,
      tags: ['Objects', 'Everyday', 'Surroundings']
    },
    {
      id: 'verbs',
      title: 'Action Verbs',
      nativeTitle: '동사와 행동',
      description: 'Core dynamic verbs for actions, movements, routines, and expressions',
      icon: 'directions_run',
      badgeColor: 'from-emerald-500 to-teal-500',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      totalWords: 16,
      tags: ['Actions', 'Grammar', 'Dynamic']
    },
    {
      id: 'basics',
      title: 'Basics & Expressions',
      nativeTitle: '기초와 인사',
      description: 'Fundamental greetings, feelings, and high-frequency expressions',
      icon: 'waving_hand',
      badgeColor: 'from-purple-500 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.35)',
      totalWords: 10,
      tags: ['Greetings', 'Feelings', 'Foundations']
    }
  ],
  ja: [
    {
      id: 'food',
      title: 'Food & Drinks',
      nativeTitle: '食べ物と飲み物',
      description: 'Learn Japanese food vocabulary from ramen to sushi and tea',
      icon: 'restaurant',
      badgeColor: 'from-amber-500 to-orange-500',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      totalWords: 16,
      tags: ['Daily Life', 'Essential', 'Taste']
    },
    {
      id: 'things',
      title: 'Things & Objects',
      nativeTitle: '物と日常品',
      description: 'Common everyday items, books, weather, and surroundings',
      icon: 'category',
      badgeColor: 'from-blue-500 to-cyan-500',
      glowColor: 'rgba(59, 130, 246, 0.35)',
      totalWords: 16,
      tags: ['Objects', 'Everyday', 'Surroundings']
    },
    {
      id: 'verbs',
      title: 'Action Verbs',
      nativeTitle: '動詞と行動',
      description: 'Essential Japanese verbs for daily communication and actions',
      icon: 'directions_run',
      badgeColor: 'from-emerald-500 to-teal-500',
      glowColor: 'rgba(168, 85, 247, 0.35)',
      totalWords: 16,
      tags: ['Actions', 'Grammar', 'Dynamic']
    },
    {
      id: 'basics',
      title: 'Basics & Expressions',
      nativeTitle: '挨拶と基本',
      description: 'Daily greetings, thanks, farewells, and core phrases',
      icon: 'waving_hand',
      badgeColor: 'from-purple-500 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.35)',
      totalWords: 10,
      tags: ['Greetings', 'Feelings', 'Foundations']
    }
  ],
  en: [
    {
      id: 'food',
      title: 'Food & Cuisine',
      nativeTitle: 'Culinary Words',
      description: 'Expand your culinary and dining English vocabulary',
      icon: 'restaurant',
      badgeColor: 'from-amber-500 to-orange-500',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      totalWords: 16,
      tags: ['Daily Life', 'Essential', 'Taste']
    },
    {
      id: 'things',
      title: 'Things & Objects',
      nativeTitle: 'Material World',
      description: 'Everyday physical items, nature, tools, and gadgets',
      icon: 'category',
      badgeColor: 'from-blue-500 to-cyan-500',
      glowColor: 'rgba(59, 130, 246, 0.35)',
      totalWords: 16,
      tags: ['Objects', 'Everyday', 'Surroundings']
    },
    {
      id: 'verbs',
      title: 'Action Verbs',
      nativeTitle: 'Dynamic Actions',
      description: 'Powerful verbs and actions to boost verbal proficiency',
      icon: 'directions_run',
      badgeColor: 'from-emerald-500 to-teal-500',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      totalWords: 16,
      tags: ['Actions', 'Grammar', 'Dynamic']
    },
    {
      id: 'basics',
      title: 'Basics & Expressions',
      nativeTitle: 'Essential Phrases',
      description: 'Core expressions, pleasantries, and everyday terms',
      icon: 'waving_hand',
      badgeColor: 'from-purple-500 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.35)',
      totalWords: 10,
      tags: ['Greetings', 'Feelings', 'Foundations']
    }
  ]
};

export const MATCHING_PAIRS: Record<LanguageTrack, Record<MatchingCategoryId, MatchingPair[]>> = {
  ko: {
    // 1. Food (음식)
    food: [
      { id: 'ko-food-1', sourceText: '물', sourcePronunciation: 'mul', targetText: 'Water', targetSubText: 'water', category: 'food' },
      { id: 'ko-food-2', sourceText: '밥', sourcePronunciation: 'bap', targetText: 'Rice', targetSubText: 'meal / rice', category: 'food' },
      { id: 'ko-food-3', sourceText: '사과', sourcePronunciation: 'sagwa', targetText: 'Apple', targetSubText: 'apple', category: 'food' },
      { id: 'ko-food-4', sourceText: '빵', sourcePronunciation: 'ppang', targetText: 'Bread', targetSubText: 'bread', category: 'food' },
      { id: 'ko-food-5', sourceText: '우유', sourcePronunciation: 'uyu', targetText: 'Milk', targetSubText: 'milk', category: 'food' },
      { id: 'ko-food-6', sourceText: '고기', sourcePronunciation: 'gogi', targetText: 'Meat', targetSubText: 'meat', category: 'food' },
      { id: 'ko-food-7', sourceText: '차', sourcePronunciation: 'cha', targetText: 'Tea', targetSubText: 'tea', category: 'food' },
      { id: 'ko-food-8', sourceText: '김치', sourcePronunciation: 'kimchi', targetText: 'Kimchi', targetSubText: 'kimchi', category: 'food' },
      { id: 'ko-food-9', sourceText: '라면', sourcePronunciation: 'ramyeon', targetText: 'Ramen', targetSubText: 'instant noodles', category: 'food' },
      { id: 'ko-food-10', sourceText: '딸기', sourcePronunciation: 'ttalgi', targetText: 'Strawberry', targetSubText: 'strawberry', category: 'food' },
      { id: 'ko-food-11', sourceText: '치킨', sourcePronunciation: 'chikin', targetText: 'Chicken', targetSubText: 'fried chicken', category: 'food' },
      { id: 'ko-food-12', sourceText: '피자', sourcePronunciation: 'pija', targetText: 'Pizza', targetSubText: 'pizza', category: 'food' },
      { id: 'ko-food-13', sourceText: '달걀', sourcePronunciation: 'dalgyal', targetText: 'Egg', targetSubText: 'egg', category: 'food' },
      { id: 'ko-food-14', sourceText: '바나나', sourcePronunciation: 'banana', targetText: 'Banana', targetSubText: 'banana', category: 'food' },
      { id: 'ko-food-15', sourceText: '치즈', sourcePronunciation: 'chijeu', targetText: 'Cheese', targetSubText: 'cheese', category: 'food' },
      { id: 'ko-food-16', sourceText: '국', sourcePronunciation: 'guk', targetText: 'Soup', targetSubText: 'soup / broth', category: 'food' }
    ],
    // 2. Things (사물)
    things: [
      { id: 'ko-thing-1', sourceText: '책', sourcePronunciation: 'chaek', targetText: 'Book', targetSubText: 'book', category: 'things' },
      { id: 'ko-thing-2', sourceText: '고양이', sourcePronunciation: 'goyangi', targetText: 'Cat', targetSubText: 'cat', category: 'things' },
      { id: 'ko-thing-3', sourceText: '해', sourcePronunciation: 'hae', targetText: 'Sun', targetSubText: 'sun', category: 'things' },
      { id: 'ko-thing-4', sourceText: '달', sourcePronunciation: 'dal', targetText: 'Moon', targetSubText: 'moon', category: 'things' },
      { id: 'ko-thing-5', sourceText: '친구', sourcePronunciation: 'chingu', targetText: 'Friend', targetSubText: 'friend', category: 'things' },
      { id: 'ko-thing-6', sourceText: '사랑', sourcePronunciation: 'sarang', targetText: 'Love', targetSubText: 'love', category: 'things' },
      { id: 'ko-thing-7', sourceText: '집', sourcePronunciation: 'jip', targetText: 'House', targetSubText: 'house / home', category: 'things' },
      { id: 'ko-thing-8', sourceText: '자동차', sourcePronunciation: 'jadongcha', targetText: 'Car', targetSubText: 'car / automobile', category: 'things' },
      { id: 'ko-thing-9', sourceText: '문', sourcePronunciation: 'mun', targetText: 'Door', targetSubText: 'door', category: 'things' },
      { id: 'ko-thing-10', sourceText: '옷', sourcePronunciation: 'ot', targetText: 'Clothes', targetSubText: 'clothing', category: 'things' },
      { id: 'ko-thing-11', sourceText: '가방', sourcePronunciation: 'gabang', targetText: 'Bag', targetSubText: 'bag / backpack', category: 'things' },
      { id: 'ko-thing-12', sourceText: '전화', sourcePronunciation: 'jeonhwa', targetText: 'Phone', targetSubText: 'telephone', category: 'things' },
      { id: 'ko-thing-13', sourceText: '안경', sourcePronunciation: 'angyeong', targetText: 'Glasses', targetSubText: 'eyeglasses', category: 'things' },
      { id: 'ko-thing-14', sourceText: '나무', sourcePronunciation: 'namu', targetText: 'Tree', targetSubText: 'tree / wood', category: 'things' },
      { id: 'ko-thing-15', sourceText: '꽃', sourcePronunciation: 'kkot', targetText: 'Flower', targetSubText: 'flower', category: 'things' },
      { id: 'ko-thing-16', sourceText: '시계', sourcePronunciation: 'sigye', targetText: 'Clock', targetSubText: 'clock / watch', category: 'things' }
    ],
    // 3. Action Verbs (동사)
    verbs: [
      { id: 'ko-verb-1', sourceText: '가다', sourcePronunciation: 'gada', targetText: 'To Go', targetSubText: 'go', category: 'verbs' },
      { id: 'ko-verb-2', sourceText: '오다', sourcePronunciation: 'oda', targetText: 'To Come', targetSubText: 'come', category: 'verbs' },
      { id: 'ko-verb-3', sourceText: '먹다', sourcePronunciation: 'meokda', targetText: 'To Eat', targetSubText: 'eat', category: 'verbs' },
      { id: 'ko-verb-4', sourceText: '마시다', sourcePronunciation: 'masida', targetText: 'To Drink', targetSubText: 'drink', category: 'verbs' },
      { id: 'ko-verb-5', sourceText: '보다', sourcePronunciation: 'boda', targetText: 'To See', targetSubText: 'see / watch', category: 'verbs' },
      { id: 'ko-verb-6', sourceText: '읽다', sourcePronunciation: 'ikda', targetText: 'To Read', targetSubText: 'read', category: 'verbs' },
      { id: 'ko-verb-7', sourceText: '쓰다', sourcePronunciation: 'sseuda', targetText: 'To Write', targetSubText: 'write', category: 'verbs' },
      { id: 'ko-verb-8', sourceText: '자다', sourcePronunciation: 'jada', targetText: 'To Sleep', targetSubText: 'sleep', category: 'verbs' },
      { id: 'ko-verb-9', sourceText: '말하다', sourcePronunciation: 'malhada', targetText: 'To Speak', targetSubText: 'speak / talk', category: 'verbs' },
      { id: 'ko-verb-10', sourceText: '배우다', sourcePronunciation: 'baeuda', targetText: 'To Learn', targetSubText: 'learn', category: 'verbs' },
      { id: 'ko-verb-11', sourceText: '달리다', sourcePronunciation: 'dallida', targetText: 'To Run', targetSubText: 'run', category: 'verbs' },
      { id: 'ko-verb-12', sourceText: '걷다', sourcePronunciation: 'geotda', targetText: 'To Walk', targetSubText: 'walk', category: 'verbs' },
      { id: 'ko-verb-13', sourceText: '웃다', sourcePronunciation: 'utda', targetText: 'To Smile', targetSubText: 'laugh / smile', category: 'verbs' },
      { id: 'ko-verb-14', sourceText: '듣다', sourcePronunciation: 'deutda', targetText: 'To Listen', targetSubText: 'listen / hear', category: 'verbs' },
      { id: 'ko-verb-15', sourceText: '사다', sourcePronunciation: 'sada', targetText: 'To Buy', targetSubText: 'buy / purchase', category: 'verbs' },
      { id: 'ko-verb-16', sourceText: '만나다', sourcePronunciation: 'mannada', targetText: 'To Meet', targetSubText: 'meet / encounter', category: 'verbs' }
    ],
    // 4. Basics (기초 - Exact screenshot set included!)
    basics: [
      { id: 'ko-basic-1', sourceText: '안녕', sourcePronunciation: 'annyeong', targetText: 'Hello', targetSubText: 'hello', category: 'basics' },
      { id: 'ko-basic-2', sourceText: '고마워', sourcePronunciation: 'gomawo', targetText: 'Thank you', targetSubText: 'thank you', category: 'basics' },
      { id: 'ko-basic-3', sourceText: '해', sourcePronunciation: 'hae', targetText: 'Sun', targetSubText: 'sun', category: 'basics' },
      { id: 'ko-basic-4', sourceText: '친구', sourcePronunciation: 'chingu', targetText: 'Friend', targetSubText: 'friend', category: 'basics' },
      { id: 'ko-basic-5', sourceText: '책', sourcePronunciation: 'chaek', targetText: 'Book', targetSubText: 'book', category: 'basics' },
      { id: 'ko-basic-6', sourceText: '물', sourcePronunciation: 'mul', targetText: 'Water', targetSubText: 'water', category: 'basics' },
      { id: 'ko-basic-7', sourceText: '사랑', sourcePronunciation: 'sarang', targetText: 'Love', targetSubText: 'love', category: 'basics' },
      { id: 'ko-basic-8', sourceText: '고양이', sourcePronunciation: 'goyangi', targetText: 'Cat', targetSubText: 'cat', category: 'basics' },
      { id: 'ko-basic-9', sourceText: '미안해', sourcePronunciation: 'mianhae', targetText: 'Sorry', targetSubText: 'sorry', category: 'basics' },
      { id: 'ko-basic-10', sourceText: '잘가', sourcePronunciation: 'jalga', targetText: 'Goodbye', targetSubText: 'goodbye', category: 'basics' }
    ]
  },
  ja: {
    food: [
      { id: 'ja-food-1', sourceText: '水', sourcePronunciation: 'mizu', targetText: 'Water', targetSubText: 'water', category: 'food' },
      { id: 'ja-food-2', sourceText: 'ご飯', sourcePronunciation: 'gohan', targetText: 'Rice', targetSubText: 'meal / rice', category: 'food' },
      { id: 'ja-food-3', sourceText: 'りんご', sourcePronunciation: 'ringo', targetText: 'Apple', targetSubText: 'apple', category: 'food' },
      { id: 'ja-food-4', sourceText: 'パン', sourcePronunciation: 'pan', targetText: 'Bread', targetSubText: 'bread', category: 'food' },
      { id: 'ja-food-5', sourceText: '牛乳', sourcePronunciation: 'gyuunyuu', targetText: 'Milk', targetSubText: 'milk', category: 'food' },
      { id: 'ja-food-6', sourceText: '肉', sourcePronunciation: 'niku', targetText: 'Meat', targetSubText: 'meat', category: 'food' },
      { id: 'ja-food-7', sourceText: 'お茶', sourcePronunciation: 'ocha', targetText: 'Tea', targetSubText: 'green tea', category: 'food' },
      { id: 'ja-food-8', sourceText: 'ラーメン', sourcePronunciation: 'raamen', targetText: 'Ramen', targetSubText: 'ramen noodles', category: 'food' },
      { id: 'ja-food-9', sourceText: '魚', sourcePronunciation: 'sakana', targetText: 'Fish', targetSubText: 'fish', category: 'food' },
      { id: 'ja-food-10', sourceText: 'いちご', sourcePronunciation: 'ichigo', targetText: 'Strawberry', targetSubText: 'strawberry', category: 'food' },
      { id: 'ja-food-11', sourceText: '卵', sourcePronunciation: 'tamago', targetText: 'Egg', targetSubText: 'egg', category: 'food' },
      { id: 'ja-food-12', sourceText: '寿司', sourcePronunciation: 'sushi', targetText: 'Sushi', targetSubText: 'sushi', category: 'food' },
      { id: 'ja-food-13', sourceText: '味噌汁', sourcePronunciation: 'misoshiru', targetText: 'Miso Soup', targetSubText: 'miso soup', category: 'food' },
      { id: 'ja-food-14', sourceText: 'バナナ', sourcePronunciation: 'banana', targetText: 'Banana', targetSubText: 'banana', category: 'food' },
      { id: 'ja-food-15', sourceText: 'チーズ', sourcePronunciation: 'chiizu', targetText: 'Cheese', targetSubText: 'cheese', category: 'food' },
      { id: 'ja-food-16', sourceText: '酒', sourcePronunciation: 'sake', targetText: 'Sake', targetSubText: 'rice wine', category: 'food' }
    ],
    things: [
      { id: 'ja-thing-1', sourceText: '本', sourcePronunciation: 'hon', targetText: 'Book', targetSubText: 'book', category: 'things' },
      { id: 'ja-thing-2', sourceText: '猫', sourcePronunciation: 'neko', targetText: 'Cat', targetSubText: 'cat', category: 'things' },
      { id: 'ja-thing-3', sourceText: '太陽', sourcePronunciation: 'taiyou', targetText: 'Sun', targetSubText: 'sun', category: 'things' },
      { id: 'ja-thing-4', sourceText: '月', sourcePronunciation: 'tsuki', targetText: 'Moon', targetSubText: 'moon', category: 'things' },
      { id: 'ja-thing-5', sourceText: '友達', sourcePronunciation: 'tomodachi', targetText: 'Friend', targetSubText: 'friend', category: 'things' },
      { id: 'ja-thing-6', sourceText: '愛', sourcePronunciation: 'ai', targetText: 'Love', targetSubText: 'love', category: 'things' },
      { id: 'ja-thing-7', sourceText: '家', sourcePronunciation: 'ie', targetText: 'House', targetSubText: 'home / house', category: 'things' },
      { id: 'ja-thing-8', sourceText: '車', sourcePronunciation: 'kuruma', targetText: 'Car', targetSubText: 'car', category: 'things' },
      { id: 'ja-thing-9', sourceText: 'ドア', sourcePronunciation: 'doa', targetText: 'Door', targetSubText: 'door', category: 'things' },
      { id: 'ja-thing-10', sourceText: '服', sourcePronunciation: 'fuku', targetText: 'Clothes', targetSubText: 'clothing', category: 'things' },
      { id: 'ja-thing-11', sourceText: '鞄', sourcePronunciation: 'kaban', targetText: 'Bag', targetSubText: 'bag', category: 'things' },
      { id: 'ja-thing-12', sourceText: '電話', sourcePronunciation: 'denwa', targetText: 'Phone', targetSubText: 'telephone', category: 'things' },
      { id: 'ja-thing-13', sourceText: '眼鏡', sourcePronunciation: 'megane', targetText: 'Glasses', targetSubText: 'glasses', category: 'things' },
      { id: 'ja-thing-14', sourceText: '木', sourcePronunciation: 'ki', targetText: 'Tree', targetSubText: 'tree', category: 'things' },
      { id: 'ja-thing-15', sourceText: '花', sourcePronunciation: 'hana', targetText: 'Flower', targetSubText: 'flower', category: 'things' },
      { id: 'ja-thing-16', sourceText: '時計', sourcePronunciation: 'tokei', targetText: 'Clock', targetSubText: 'clock / watch', category: 'things' }
    ],
    verbs: [
      { id: 'ja-verb-1', sourceText: '行く', sourcePronunciation: 'iku', targetText: 'To Go', targetSubText: 'go', category: 'verbs' },
      { id: 'ja-verb-2', sourceText: '来る', sourcePronunciation: 'kuru', targetText: 'To Come', targetSubText: 'come', category: 'verbs' },
      { id: 'ja-verb-3', sourceText: '食べる', sourcePronunciation: 'taberu', targetText: 'To Eat', targetSubText: 'eat', category: 'verbs' },
      { id: 'ja-verb-4', sourceText: '飲む', sourcePronunciation: 'nomu', targetText: 'To Drink', targetSubText: 'drink', category: 'verbs' },
      { id: 'ja-verb-5', sourceText: '見る', sourcePronunciation: 'miru', targetText: 'To See', targetSubText: 'see / look', category: 'verbs' },
      { id: 'ja-verb-6', sourceText: '読む', sourcePronunciation: 'yomu', targetText: 'To Read', targetSubText: 'read', category: 'verbs' },
      { id: 'ja-verb-7', sourceText: '書く', sourcePronunciation: 'kaku', targetText: 'To Write', targetSubText: 'write', category: 'verbs' },
      { id: 'ja-verb-8', sourceText: '寝る', sourcePronunciation: 'neru', targetText: 'To Sleep', targetSubText: 'sleep', category: 'verbs' },
      { id: 'ja-verb-9', sourceText: '話す', sourcePronunciation: 'hanasu', targetText: 'To Speak', targetSubText: 'speak / talk', category: 'verbs' },
      { id: 'ja-verb-10', sourceText: '学ぶ', sourcePronunciation: 'manabu', targetText: 'To Learn', targetSubText: 'learn / study', category: 'verbs' },
      { id: 'ja-verb-11', sourceText: '走る', sourcePronunciation: 'hashiru', targetText: 'To Run', targetSubText: 'run', category: 'verbs' },
      { id: 'ja-verb-12', sourceText: '歩く', sourcePronunciation: 'aruku', targetText: 'To Walk', targetSubText: 'walk', category: 'verbs' },
      { id: 'ja-verb-13', sourceText: '笑う', sourcePronunciation: 'warau', targetText: 'To Smile', targetSubText: 'laugh / smile', category: 'verbs' },
      { id: 'ja-verb-14', sourceText: '聞く', sourcePronunciation: 'kiku', targetText: 'To Listen', targetSubText: 'listen / ask', category: 'verbs' },
      { id: 'ja-verb-15', sourceText: '買う', sourcePronunciation: 'kau', targetText: 'To Buy', targetSubText: 'buy', category: 'verbs' },
      { id: 'ja-verb-16', sourceText: '会う', sourcePronunciation: 'au', targetText: 'To Meet', targetSubText: 'meet', category: 'verbs' }
    ],
    basics: [
      { id: 'ja-basic-1', sourceText: 'こんにちは', sourcePronunciation: 'konnichiwa', targetText: 'Hello', targetSubText: 'hello', category: 'basics' },
      { id: 'ja-basic-2', sourceText: 'ありがとう', sourcePronunciation: 'arigatou', targetText: 'Thank you', targetSubText: 'thank you', category: 'basics' },
      { id: 'ja-basic-3', sourceText: '太陽', sourcePronunciation: 'taiyou', targetText: 'Sun', targetSubText: 'sun', category: 'basics' },
      { id: 'ja-basic-4', sourceText: '友達', sourcePronunciation: 'tomodachi', targetText: 'Friend', targetSubText: 'friend', category: 'basics' },
      { id: 'ja-basic-5', sourceText: '本', sourcePronunciation: 'hon', targetText: 'Book', targetSubText: 'book', category: 'basics' },
      { id: 'ja-basic-6', sourceText: '水', sourcePronunciation: 'mizu', targetText: 'Water', targetSubText: 'water', category: 'basics' },
      { id: 'ja-basic-7', sourceText: '愛', sourcePronunciation: 'ai', targetText: 'Love', targetSubText: 'love', category: 'basics' },
      { id: 'ja-basic-8', sourceText: '猫', sourcePronunciation: 'neko', targetText: 'Cat', targetSubText: 'cat', category: 'basics' },
      { id: 'ja-basic-9', sourceText: 'ごめんなさい', sourcePronunciation: 'gomennasai', targetText: 'Sorry', targetSubText: 'sorry', category: 'basics' },
      { id: 'ja-basic-10', sourceText: 'さようなら', sourcePronunciation: 'sayounara', targetText: 'Goodbye', targetSubText: 'goodbye', category: 'basics' }
    ]
  },
  en: {
    food: [
      { id: 'en-food-1', sourceText: 'Water', sourcePronunciation: 'wah-ter', targetText: 'Water', targetSubText: 'H2O / liquid', category: 'food' },
      { id: 'en-food-2', sourceText: 'Apple', sourcePronunciation: 'ap-uhl', targetText: 'Apple', targetSubText: 'crisp round fruit', category: 'food' },
      { id: 'en-food-3', sourceText: 'Bread', sourcePronunciation: 'bred', targetText: 'Bread', targetSubText: 'baked dough loaf', category: 'food' },
      { id: 'en-food-4', sourceText: 'Cheese', sourcePronunciation: 'cheez', targetText: 'Cheese', targetSubText: 'dairy product', category: 'food' },
      { id: 'en-food-5', sourceText: 'Coffee', sourcePronunciation: 'kof-ee', targetText: 'Coffee', targetSubText: 'brewed bean drink', category: 'food' },
      { id: 'en-food-6', sourceText: 'Rice', sourcePronunciation: 'rahys', targetText: 'Rice', targetSubText: 'cereal grain food', category: 'food' },
      { id: 'en-food-7', sourceText: 'Tea', sourcePronunciation: 'tee', targetText: 'Tea', targetSubText: 'infused leaf beverage', category: 'food' },
      { id: 'en-food-8', sourceText: 'Soup', sourcePronunciation: 'soop', targetText: 'Soup', targetSubText: 'hot liquid broth', category: 'food' }
    ],
    things: [
      { id: 'en-thing-1', sourceText: 'Book', sourcePronunciation: 'book', targetText: 'Book', targetSubText: 'bound pages to read', category: 'things' },
      { id: 'en-thing-2', sourceText: 'Cat', sourcePronunciation: 'kat', targetText: 'Cat', targetSubText: 'feline furry pet', category: 'things' },
      { id: 'en-thing-3', sourceText: 'Sun', sourcePronunciation: 'suhn', targetText: 'Sun', targetSubText: 'daytime star', category: 'things' },
      { id: 'en-thing-4', sourceText: 'Moon', sourcePronunciation: 'moon', targetText: 'Moon', targetSubText: 'night celestial body', category: 'things' },
      { id: 'en-thing-5', sourceText: 'Friend', sourcePronunciation: 'frend', targetText: 'Friend', targetSubText: 'close companion', category: 'things' },
      { id: 'en-thing-6', sourceText: 'House', sourcePronunciation: 'hows', targetText: 'House', targetSubText: 'living home building', category: 'things' },
      { id: 'en-thing-7', sourceText: 'Car', sourcePronunciation: 'kahr', targetText: 'Car', targetSubText: 'motor vehicle', category: 'things' },
      { id: 'en-thing-8', sourceText: 'Phone', sourcePronunciation: 'fohn', targetText: 'Phone', targetSubText: 'communication device', category: 'things' }
    ],
    verbs: [
      { id: 'en-verb-1', sourceText: 'To Walk', sourcePronunciation: 'wawk', targetText: 'Walk', targetSubText: 'step on foot', category: 'verbs' },
      { id: 'en-verb-2', sourceText: 'To Run', sourcePronunciation: 'ruhn', targetText: 'Run', targetSubText: 'move swiftly on foot', category: 'verbs' },
      { id: 'en-verb-3', sourceText: 'To Eat', sourcePronunciation: 'eet', targetText: 'Eat', targetSubText: 'consume food', category: 'verbs' },
      { id: 'en-verb-4', sourceText: 'To Sleep', sourcePronunciation: 'sleep', targetText: 'Sleep', targetSubText: 'rest unconscious', category: 'verbs' },
      { id: 'en-verb-5', sourceText: 'To Read', sourcePronunciation: 'reed', targetText: 'Read', targetSubText: 'comprehend text', category: 'verbs' },
      { id: 'en-verb-6', sourceText: 'To Write', sourcePronunciation: 'rahyt', targetText: 'Write', targetSubText: 'inscribe characters', category: 'verbs' },
      { id: 'en-verb-7', sourceText: 'To Speak', sourcePronunciation: 'speek', targetText: 'Speak', targetSubText: 'utter vocal words', category: 'verbs' },
      { id: 'en-verb-8', sourceText: 'To Listen', sourcePronunciation: 'lis-uhn', targetText: 'Listen', targetSubText: 'hear with attention', category: 'verbs' }
    ],
    basics: [
      { id: 'en-basic-1', sourceText: 'Hello', sourcePronunciation: 'heh-loh', targetText: 'Hello', targetSubText: 'friendly greeting', category: 'basics' },
      { id: 'en-basic-2', sourceText: 'Thank you', sourcePronunciation: 'thangk yoo', targetText: 'Thank you', targetSubText: 'expressing gratitude', category: 'basics' },
      { id: 'en-basic-3', sourceText: 'Sun', sourcePronunciation: 'suhn', targetText: 'Sun', targetSubText: 'sun', category: 'basics' },
      { id: 'en-basic-4', sourceText: 'Friend', sourcePronunciation: 'frend', targetText: 'Friend', targetSubText: 'friend', category: 'basics' },
      { id: 'en-basic-5', sourceText: 'Book', sourcePronunciation: 'book', targetText: 'Book', targetSubText: 'book', category: 'basics' },
      { id: 'en-basic-6', sourceText: 'Water', sourcePronunciation: 'wah-ter', targetText: 'Water', targetSubText: 'water', category: 'basics' },
      { id: 'en-basic-7', sourceText: 'Love', sourcePronunciation: 'luhv', targetText: 'Love', targetSubText: 'deep affection', category: 'basics' },
      { id: 'en-basic-8', sourceText: 'Cat', sourcePronunciation: 'kat', targetText: 'Cat', targetSubText: 'cat', category: 'basics' }
    ]
  }
};
