import type { GameConfig } from '../types/game'

export const gameConfig: GameConfig = {
  title: '恋爱物语',
  initialResources: 100,
  maxActionsPerDay: 3,
  daysPerWeek: 7,
  maxAffinity: 100,
  minAffinity: -50,
  maxMood: 100,
  minMood: 0,
  moodDecayPerDay: 5,
  affinityDecayPerDay: 1,
  timeSlots: ['morning', 'afternoon', 'evening', 'night'],

  characters: [
    {
      id: 'linxiaoyu',
      name: '林小雨',
      avatar: '🌸',
      description: '温柔善良的图书馆管理员，喜欢读书和花草',
      personality: '温柔内向，有些害羞，但对喜欢的事物非常热情',
      favoriteGifts: ['flower', 'book', 'tea'],
      dislikedGifts: ['alcohol', 'game_console'],
      chatTopics: [
        { topic: '文学', affinity: 3 },
        { topic: '花草', affinity: 3 },
        { topic: '天气', affinity: 1 },
        { topic: '游戏', affinity: -1 },
        { topic: '运动', affinity: 0 }
      ],
      baseAffinity: 10,
      baseMood: 60,
      unlocked: true
    },
    {
      id: 'sufei',
      name: '苏菲',
      avatar: '🔥',
      description: '活泼开朗的咖啡馆女老板，热爱烘焙',
      personality: '热情外向，有点毒舌但内心温柔',
      favoriteGifts: ['coffee', 'dessert', 'game_console'],
      dislikedGifts: ['flower', 'book'],
      chatTopics: [
        { topic: '美食', affinity: 3 },
        { topic: '游戏', affinity: 3 },
        { topic: '天气', affinity: 1 },
        { topic: '文学', affinity: -1 },
        { topic: '运动', affinity: 2 }
      ],
      baseAffinity: 5,
      baseMood: 70,
      unlocked: true
    },
    {
      id: 'yeqing',
      name: '叶青',
      avatar: '🌙',
      description: '神秘的转学生，总是独来独往',
      personality: '冷静寡言，似乎藏着很多秘密',
      favoriteGifts: ['book', 'tea', 'music_box'],
      dislikedGifts: ['dessert', 'alcohol'],
      chatTopics: [
        { topic: '文学', affinity: 2 },
        { topic: '音乐', affinity: 3 },
        { topic: '天气', affinity: 0 },
        { topic: '游戏', affinity: 1 },
        { topic: '运动', affinity: -1 }
      ],
      baseAffinity: 0,
      baseMood: 50,
      unlocked: false,
      hidden: true,
      unlockCondition: 'unlock_yeqing'
    }
  ],

  gifts: [
    { id: 'flower', name: '鲜花', price: 30, icon: '🌹', description: '一束美丽的鲜花' },
    { id: 'book', name: '小说', price: 25, icon: '📚', description: '一本畅销小说' },
    { id: 'tea', name: '茶叶', price: 40, icon: '🍵', description: '上等的茶叶礼盒' },
    { id: 'coffee', name: '咖啡豆', price: 35, icon: '☕', description: '精品咖啡豆' },
    { id: 'dessert', name: '甜点', price: 20, icon: '🍰', description: '精致的手工甜点' },
    { id: 'game_console', name: '游戏机', price: 80, icon: '🎮', description: '最新款掌上游戏机' },
    { id: 'alcohol', name: '红酒', price: 60, icon: '🍷', description: '一瓶高档红酒' },
    { id: 'music_box', name: '音乐盒', price: 50, icon: '🎵', description: '精致的八音盒' }
  ],

  cards: [
    { id: 'linxiaoyu_common_1', name: '图书馆的邂逅', characterId: 'linxiaoyu', rarity: 'common', image: '📖', description: '第一次在图书馆见到小雨的场景', unlockCondition: 'meet_linxiaoyu' },
    { id: 'linxiaoyu_rare_1', name: '花田中', characterId: 'linxiaoyu', rarity: 'rare', image: '🌻', description: '小雨在花田中微笑的样子', unlockCondition: 'linxiaoyu_affinity_40' },
    { id: 'linxiaoyu_epic_1', name: '雨中伞', characterId: 'linxiaoyu', rarity: 'epic', image: '☂️', description: '一起在雨中撑伞回家', unlockCondition: 'linxiaoyu_affinity_70' },
    { id: 'linxiaoyu_legendary_1', name: '告白', characterId: 'linxiaoyu', rarity: 'legendary', image: '💝', description: '樱花树下的告白', unlockCondition: 'linxiaoyu_affinity_100' },
    { id: 'sufei_common_1', name: '咖啡馆的相遇', characterId: 'sufei', rarity: 'common', image: '☕', description: '第一次走进苏菲的咖啡馆', unlockCondition: 'meet_sufei' },
    { id: 'sufei_rare_1', name: '烘焙时光', characterId: 'sufei', rarity: 'rare', image: '🧁', description: '苏菲教你做蛋糕', unlockCondition: 'sufei_affinity_40' },
    { id: 'sufei_epic_1', name: '深夜游戏', characterId: 'sufei', rarity: 'epic', image: '🎮', description: '一起打游戏到深夜', unlockCondition: 'sufei_affinity_70' },
    { id: 'sufei_legendary_1', name: '夕阳下的吻', characterId: 'sufei', rarity: 'legendary', image: '🌅', description: '咖啡馆关门前的浪漫时刻', unlockCondition: 'sufei_affinity_100' },
    { id: 'yeqing_common_1', name: '月下身影', characterId: 'yeqing', rarity: 'common', image: '🌙', description: '月光下独自散步的叶青', unlockCondition: 'meet_yeqing' },
    { id: 'yeqing_rare_1', name: '琴音缭绕', characterId: 'yeqing', rarity: 'rare', image: '🎹', description: '叶青弹奏钢琴的样子', unlockCondition: 'yeqing_affinity_40' }
  ],

  events: [
    {
      id: 'intro_linxiaoyu',
      title: '图书馆的邂逅',
      description: '你在图书馆寻找一本书时，一位温柔的女生帮你找到了它。她叫林小雨，是这里的管理员。',
      characterId: 'linxiaoyu',
      triggerCondition: { minDay: 1, maxDay: 1, timeOfDay: 'morning' },
      choices: [
        {
          id: 'thankful',
          text: '道谢并和她聊聊天',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 5, moodChange: 10 }],
          addCardId: 'linxiaoyu_common_1'
        },
        {
          id: 'hurry',
          text: '道谢后匆匆离开',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 2 }]
        }
      ],
      once: true,
      priority: 100
    },
    {
      id: 'intro_sufei',
      title: '咖啡馆的偶遇',
      description: '你走进一家新开的咖啡馆，热情的女老板苏菲立刻迎了上来。"欢迎光临！今天想来点什么？"',
      characterId: 'sufei',
      triggerCondition: { minDay: 1, maxDay: 2, timeOfDay: 'afternoon' },
      choices: [
        {
          id: 'coffee',
          text: '点一杯招牌咖啡',
          effects: [{ characterId: 'sufei', affinityChange: 5, moodChange: 10 }],
          resourceChange: -10,
          addCardId: 'sufei_common_1'
        },
        {
          id: 'dessert',
          text: '点一份甜点尝尝',
          effects: [{ characterId: 'sufei', affinityChange: 7, moodChange: 15 }],
          resourceChange: -20
        }
      ],
      once: true,
      priority: 99
    },
    {
      id: 'rainy_day_1',
      title: '突如其来的暴雨',
      description: '天空突然下起了大雨，你看到林小雨站在屋檐下，似乎没带伞。',
      characterId: 'linxiaoyu',
      triggerCondition: { minDay: 3, timeOfDay: 'evening', minAffinity: 20, characterId: 'linxiaoyu' },
      choices: [
        {
          id: 'share_umbrella',
          text: '把伞借给她',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 15, moodChange: 20 }]
        },
        {
          id: 'wait_together',
          text: '陪她等雨停',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 10, moodChange: 10 }]
        },
        {
          id: 'leave',
          text: '假装没看到走开',
          effects: [{ characterId: 'linxiaoyu', affinityChange: -5, moodChange: -10 }]
        }
      ],
      once: true,
      priority: 90
    },
    {
      id: 'cafe_late_night',
      title: '深夜咖啡馆',
      description: '你路过咖啡馆，发现灯还亮着。苏菲一个人在店里，看起来有些疲惫。',
      characterId: 'sufei',
      triggerCondition: { minDay: 5, timeOfDay: 'night', minAffinity: 30, characterId: 'sufei' },
      choices: [
        {
          id: 'help',
          text: '进去帮帮忙',
          effects: [{ characterId: 'sufei', affinityChange: 12, moodChange: 15 }],
          resourceChange: -5
        },
        {
          id: 'company',
          text: '点杯咖啡陪陪她',
          effects: [{ characterId: 'sufei', affinityChange: 8, moodChange: 10 }],
          resourceChange: -15
        },
        {
          id: 'ignore',
          text: '不打扰她了',
          effects: [{ characterId: 'sufei', affinityChange: -3 }]
        }
      ],
      once: true,
      priority: 85
    },
    {
      id: 'mysterious_girl',
      title: '神秘的转学生',
      description: '在公园的角落里，你看到一个安静的女生独自坐在长椅上。她似乎注意到了你，微微点了点头。',
      characterId: 'yeqing',
      triggerCondition: { minDay: 7, minAffinity: 40 },
      choices: [
        {
          id: 'approach',
          text: '上前打招呼',
          effects: [
            { characterId: 'yeqing', affinityChange: 5 },
            { characterId: 'linxiaoyu', affinityChange: -3 },
            { characterId: 'sufei', affinityChange: -3 }
          ],
          unlockCharacterId: 'yeqing',
          addCardId: 'yeqing_common_1'
        },
        {
          id: 'leave_quietly',
          text: '悄悄离开',
          effects: []
        }
      ],
      once: true,
      priority: 80
    },
    {
      id: 'birthday_surprise_1',
      title: '小雨的生日',
      description: '你想起今天是林小雨的生日，要准备什么惊喜吗？',
      characterId: 'linxiaoyu',
      triggerCondition: { minDay: 14, minAffinity: 50, characterId: 'linxiaoyu' },
      choices: [
        {
          id: 'big_surprise',
          text: '准备一个大惊喜',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 25, moodChange: 30 }],
          resourceChange: -50
        },
        {
          id: 'small_gift',
          text: '送一个小礼物',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 10, moodChange: 15 }],
          resourceChange: -20
        },
        {
          id: 'forget',
          text: '算了，假装不知道',
          effects: [{ characterId: 'linxiaoyu', affinityChange: -10, moodChange: -20 }]
        }
      ],
      once: true,
      priority: 95
    },
    {
      id: 'conflict_1',
      title: '两人的邀约',
      description: '林小雨和苏菲同时邀请你周末出去，你该怎么办？',
      triggerCondition: { minDay: 10, minAffinity: 35 },
      choices: [
        {
          id: 'choose_xiaoyu',
          text: '答应小雨',
          effects: [
            { characterId: 'linxiaoyu', affinityChange: 10, moodChange: 15 },
            { characterId: 'sufei', affinityChange: -8, moodChange: -10 }
          ]
        },
        {
          id: 'choose_sufei',
          text: '答应苏菲',
          effects: [
            { characterId: 'sufei', affinityChange: 10, moodChange: 15 },
            { characterId: 'linxiaoyu', affinityChange: -8, moodChange: -10 }
          ]
        },
        {
          id: 'reject_both',
          text: '都拒绝，说有事',
          effects: [
            { characterId: 'linxiaoyu', affinityChange: -3 },
            { characterId: 'sufei', affinityChange: -3 }
          ]
        },
        {
          id: 'suggest_together',
          text: '建议三个人一起',
          effects: [
            { characterId: 'linxiaoyu', affinityChange: -2 },
            { characterId: 'sufei', affinityChange: -2 }
          ]
        }
      ],
      once: true,
      priority: 88
    }
  ],

  actions: [
    { type: 'chat', name: '聊天', icon: '💬', description: '和角色聊聊天，增进感情', energyCost: 1 },
    { type: 'gift', name: '送礼', icon: '🎁', description: '送礼物给角色，效果因人而异', energyCost: 1 },
    { type: 'work', name: '打工', icon: '💼', description: '辛苦工作赚取代币', energyCost: 2 },
    { type: 'sms', name: '短信', icon: '📱', description: '发短信邀约角色，等待回复', energyCost: 1 }
  ],

  smsOptions: [
    {
      id: 'sms_linxiaoyu_library',
      text: '周末一起去图书馆看书吧？',
      characterId: 'linxiaoyu',
      description: '邀约小雨一起去图书馆度过安静的下午',
      minAffinity: 10,
      timeCost: 1,
      replyPositive: '好呀！我正好想看那本新到的诗集，周六见~',
      replyNegative: '嗯...这周末我可能有事，下次吧。',
      positiveEffects: { affinityChange: 8, moodChange: 12, flagSet: 'date_linxiaoyu_library' },
      negativeEffects: { affinityChange: -2, moodChange: -3 },
      baseAcceptChance: 0.6
    },
    {
      id: 'sms_linxiaoyu_flower',
      text: '听说城郊的花田开了，要一起去看看吗？',
      characterId: 'linxiaoyu',
      description: '邀约小雨去花田赏花',
      minAffinity: 25,
      timeCost: 2,
      replyPositive: '真的吗？我最喜欢花了！一定会去的！🌸',
      replyNegative: '花田...听起来不错，但我最近花粉过敏...',
      positiveEffects: { affinityChange: 12, moodChange: 18, flagSet: 'date_linxiaoyu_flower' },
      negativeEffects: { affinityChange: -1, moodChange: -2 },
      baseAcceptChance: 0.55
    },
    {
      id: 'sms_linxiaoyu_rain',
      text: '下雨了，要不要一起在屋檐下躲雨？',
      characterId: 'linxiaoyu',
      description: '下雨时邀约小雨共撑一把伞',
      minAffinity: 40,
      timeCost: 1,
      replyPositive: '你也在附近吗？我正好没带伞...等你来哦~',
      replyNegative: '谢谢...但我已经在室内了。',
      positiveEffects: { affinityChange: 15, moodChange: 20, flagSet: 'date_linxiaoyu_rain' },
      negativeEffects: { affinityChange: -2, moodChange: -5 },
      baseAcceptChance: 0.65
    },
    {
      id: 'sms_sufei_cafe',
      text: '想去你店里喝杯咖啡，有空吗？',
      characterId: 'sufei',
      description: '去苏菲的咖啡馆坐坐',
      minAffinity: 5,
      timeCost: 1,
      replyPositive: '当然有空！来吧，今天给你做新品试喝！☕',
      replyNegative: '今天店里有活动，可能比较忙，改天吧~',
      positiveEffects: { affinityChange: 6, moodChange: 10, flagSet: 'date_sufei_cafe' },
      negativeEffects: { affinityChange: -1, moodChange: -2 },
      baseAcceptChance: 0.7
    },
    {
      id: 'sms_sufei_bake',
      text: '能教我做蛋糕吗？想学烘焙！',
      characterId: 'sufei',
      description: '和苏菲一起学做甜点',
      minAffinity: 25,
      timeCost: 2,
      replyPositive: '哈哈想学烘焙？来吧！我教你做招牌蛋糕！🧁',
      replyNegative: '最近新食谱还没研究完，等我准备好了再教你吧~',
      positiveEffects: { affinityChange: 14, moodChange: 16, flagSet: 'date_sufei_bake' },
      negativeEffects: { affinityChange: -1, moodChange: -3 },
      baseAcceptChance: 0.6
    },
    {
      id: 'sms_sufei_game',
      text: '今晚要不要一起打游戏？',
      characterId: 'sufei',
      description: '邀约苏菲一起打游戏到深夜',
      minAffinity: 40,
      timeCost: 2,
      replyPositive: '来啊！我刚买了新游戏，正缺人陪我玩呢！🎮',
      replyNegative: '今晚不行...明天还要早起开店。',
      positiveEffects: { affinityChange: 12, moodChange: 15, flagSet: 'date_sufei_game' },
      negativeEffects: { affinityChange: -3, moodChange: -4 },
      baseAcceptChance: 0.5
    },
    {
      id: 'sms_yeqing_music',
      text: '听说你会弹钢琴，能弹给我听吗？',
      characterId: 'yeqing',
      description: '请叶青为你演奏一曲',
      minAffinity: 15,
      timeCost: 1,
      replyPositive: '...你想听的话，我可以弹一首。',
      replyNegative: '......我弹得不好。',
      positiveEffects: { affinityChange: 10, moodChange: 12, flagSet: 'date_yeqing_music' },
      negativeEffects: { affinityChange: -3, moodChange: -5 },
      baseAcceptChance: 0.45
    },
    {
      id: 'sms_yeqing_stargazing',
      text: '今晚星星很美，要不要一起去天台看星星？',
      characterId: 'yeqing',
      description: '和叶青一起在夜晚观星',
      minAffinity: 35,
      timeCost: 2,
      replyPositive: '......好。我在天台等你。',
      replyNegative: '......今晚不想出门。',
      positiveEffects: { affinityChange: 16, moodChange: 20, flagSet: 'date_yeqing_stargazing' },
      negativeEffects: { affinityChange: -2, moodChange: -4 },
      baseAcceptChance: 0.4
    }
  ],

  workRewards: { min: 15, max: 35 }
}

export default gameConfig
