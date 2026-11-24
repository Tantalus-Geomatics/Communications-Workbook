import type { MicroSkillName } from './workbook-types';

export interface SkillExample {
  situation: string;
  reactiveLabel: string;
  reactiveText: string;
  constructiveLabel: string;
  constructiveText: string;
}

export interface PracticeTip {
  title: string;
  detail: string;
}

export interface CoreMicroSkill {
  id: string;
  number: string;
  name: MicroSkillName;
  subtitle: string;
  fullHeading: string;
  corePrinciple: string;
  comparisonHeading: string;
  examples: SkillExample[];
  howToApply: PracticeTip[];
  quickCue: string;
}

export interface PracticeTierInfo {
  id: 'tier1' | 'tier2' | 'tier3' | 'tier4';
  tierLabel: string;
  shortName: string;
  environment: string;
  description: string;
  dailyTitle: string;
  dailyOpportunityLabel: string;
  dailyOpportunityPlaceholder: string;
  dailyReflectionPlaceholder: string;
  weeklyExamplePlan: string;
}

export interface VocabularyGroup {
  category: string;
  words: string[];
}

export interface FauxFeelingRow {
  fauxFeeling: string;
  trueFeelings: string;
  unmetNeeds: string;
}

export const WORKBOOK_INTRO = {
  title: 'Communication Mastery & Deliberate Practice Workbook',
  lead: 'Lasting change in how we communicate comes from deliberate, low-stakes repetition rather than trying to force new habits in the middle of a high-stress moment. Just as you would prepare and run mock scenarios before an important field test, this workbook gives you a structured system to train your nervous system and communication habits every day.',
  sections: [
    {
      label: 'Section 1 — Reference Sheet',
      description:
        'Keep this handy to review the four core micro-skills, compare reactive vs. constructive phrasing, and check the expanded Feelings & Needs vocabulary in real time.',
    },
    {
      label: 'Section 2 — Daily Practice & Tier Log',
      description:
        'Use this template each day. Spend 2 minutes in the morning setting your intentions and boundaries, identify practice opportunities across the four tiers, and spend 8 minutes in the evening logging your post-interaction reflections and trigger debrief.',
    },
    {
      label: 'Section 3 — Weekly Calibration & Tier Log',
      description:
        'Use this template every Sunday. Spend 20 minutes mapping out your weekly tier opportunities, auditing physical and schedule triggers, scripting one conversation "redo," and evaluating your growth without shame.',
    },
  ],
};

export const CORE_MICRO_SKILLS: CoreMicroSkill[] = [
  {
    id: 'skill-1',
    number: '01',
    name: 'Somatic & Tone Catching',
    subtitle: 'The Circuit Breaker',
    fullHeading: 'Skill 1: Somatic & Tone Catching (The Circuit Breaker)',
    corePrinciple:
      'Reactivity begins in the body before it reaches your voice. Catching physical tension and noticing when a sharp, stern, or "disagreeable" tone starts to emerge allows you to pause and regulate your nervous system before words cause unintended harm.',
    comparisonHeading: 'Examples: Reactive vs. Constructive',
    quickCue: 'Notice jaw, chest, or stomach tension first. Count 5 full seconds before speaking or typing.',
    examples: [
      {
        situation: 'When receiving unexpected criticism',
        reactiveLabel: 'Reactive',
        reactiveText:
          'Speaking louder, faster, or with a clipped, defensive edge ("That\'s completely unreasonable").',
        constructiveLabel: 'Constructive',
        constructiveText:
          'Noticing jaw or stomach tightness, taking one slow breath, and lowering your vocal pace ("Let me take a breath for a second so I can really hear what you\'re saying").',
      },
      {
        situation: 'When feeling rushed or overbooked during work',
        reactiveLabel: 'Reactive',
        reactiveText:
          'Firing off a blunt, hurried text message while distracted ("I don\'t have time for this right now").',
        constructiveLabel: 'Constructive',
        constructiveText:
          'Recognizing physical rush/adrenaline and pausing ("I\'m in the middle of a site task and want to give this proper attention—can I call you at 5:30 PM?").',
      },
      {
        situation: 'When a conversation starts spiraling into a debate',
        reactiveLabel: 'Reactive',
        reactiveText: 'Pushing through while visibly agitated or issuing an ultimatum.',
        constructiveLabel: 'Constructive',
        constructiveText:
          'Calling a clean, non-punitive time-out ("I\'m feeling my chest tighten up and I don\'t want to speak out of frustration. Can we take 15 minutes to cool down and come back to this?").',
      },
    ],
    howToApply: [
      {
        title: 'Identify Your Early Warning Signs',
        detail:
          'Know your top three physical cues (e.g., jaw clenching, shallow breathing, stomach knots, heat in the face).',
      },
      {
        title: 'Use the 5-Second Rule',
        detail:
          'Whenever you feel a surge of defensiveness, count five full seconds before speaking or typing.',
      },
      {
        title: 'Protect Your Bandwidth',
        detail:
          'Check whether your tone is actually about the conversation—or about skipped meals, poor sleep, or an overpacked schedule.',
      },
    ],
  },
  {
    id: 'skill-2',
    number: '02',
    name: 'Observation Without Evaluation',
    subtitle: 'Separating Facts From Stories',
    fullHeading: 'Skill 2: Observation Without Evaluation',
    corePrinciple:
      'When we mix what we observe with our judgments, labels, or diagnoses, people hear criticism and put up their armor. Pure observation describes only what a video camera would record—specific words, actions, and timing—separating facts from the stories our minds create.',
    comparisonHeading: 'Examples: Evaluation vs. Observation',
    quickCue: 'Apply the "Video Camera" test: describe specific words and timing without "always," "never," or motive labels.',
    examples: [
      {
        situation: 'Addressing how someone spoke to you',
        reactiveLabel: 'Evaluation (Mixed)',
        reactiveText: '"You\'re being condescending and dismissing my research."',
        constructiveLabel: 'Observation (Pure)',
        constructiveText:
          '"When you said \'I can\'t make sense of that data\' before I finished sharing the metrics I read, I felt unheard."',
      },
      {
        situation: 'Responding to feedback about your own tone',
        reactiveLabel: 'Evaluation (Mixed)',
        reactiveText: '"You\'re gaslighting me and trying to control how I express myself."',
        constructiveLabel: 'Observation (Pure)',
        constructiveText:
          '"When you brought up my tone over text while I was working, I felt unsettled and defensive."',
      },
      {
        situation: 'Addressing a change in plans',
        reactiveLabel: 'Evaluation (Mixed)',
        reactiveText: '"You\'re being flaky and don\'t prioritize our time."',
        constructiveLabel: 'Observation (Pure)',
        constructiveText:
          '"When our 6:30 PM dinner plans shifted to 8:30 PM at the last minute, I felt disappointed because I had cleared my evening to spend time together."',
      },
      {
        situation: 'Discussing differing opinions in a group',
        reactiveLabel: 'Evaluation (Mixed)',
        reactiveText: '"People here are under-informed and over-opinionated."',
        constructiveLabel: 'Observation (Pure)',
        constructiveText:
          '"When I hear proposals that don\'t account for the budget figures from last week\'s council meeting, I feel concerned about how the project will be funded."',
      },
    ],
    howToApply: [
      {
        title: 'Use the "Video Camera" Test',
        detail:
          'Ask yourself: Could a camera record this exact statement without interpreting anyone\'s motives?',
      },
      {
        title: 'Eliminate "Always" and "Never"',
        detail: 'Replace global character claims with one specific, recent timestamped moment.',
      },
      {
        title: 'Separate Story From Fact',
        detail:
          'Notice when your mind jumps to mind-reading (e.g., "They think I\'m lying" or "They\'re holding out for someone better") and anchor back to what was actually said.',
      },
    ],
  },
  {
    id: 'skill-3',
    number: '03',
    name: 'Empathy Before Education',
    subtitle: 'Building Safety First',
    fullHeading: 'Skill 3: Empathy Before Education',
    corePrinciple:
      'Never offer facts, corrections, logic, or explanations of your intent until the other person feels heard in their feelings and needs. When someone is hurting or overwhelmed, "educating" them feels like invalidation; reflecting their experience first builds immediate safety.',
    comparisonHeading: 'Examples: Education vs. Empathy',
    quickCue: 'Use a Validation Bridge ("It sounds like you\'re feeling X because you need Y") and wait for the exhale before explaining.',
    examples: [
      {
        situation: 'When someone shares how your words landed on them',
        reactiveLabel: 'Education First',
        reactiveText:
          '"I didn\'t mean it that way—I was just clarifying the facts so they wouldn\'t be misinformed."',
        constructiveLabel: 'Empathy First',
        constructiveText:
          '"It sounds like the way I phrased that landed as dismissive, and you want conversations to feel like a mutual exchange. Help me understand what that felt like on your end."',
      },
      {
        situation: 'When a friend or partner is stressed about health or work',
        reactiveLabel: 'Education First',
        reactiveText:
          '"Have you tried calling the clinic? You should really look into that program I sent you."',
        constructiveLabel: 'Empathy First',
        constructiveText:
          '"That sounds exhausting to carry all at once. It makes complete sense that you\'re feeling drained and just need some ease right now."',
      },
      {
        situation: 'When someone disagrees with you on a topic you\'ve researched',
        reactiveLabel: 'Education First',
        reactiveText: '"Actually, if you look at the numbers, that policy doesn\'t work."',
        constructiveLabel: 'Empathy First',
        constructiveText:
          '"I can see how much you care about fairness and protecting people in our community. Tell me more about what draws you to that approach."',
      },
    ],
    howToApply: [
      {
        title: 'Use a Validation Bridge',
        detail:
          'Before sharing your perspective, complete the sentence: "It sounds like you\'re feeling [emotion] because you value/need [need]—am I getting that right?"',
      },
      {
        title: 'Ask One Curious Question',
        detail:
          'When you feel the urge to correct someone, replace your statement with a genuine question ("What matters most to you about this?").',
      },
      {
        title: 'Wait for the "Exhale"',
        detail:
          'Only share your own facts or viewpoint after the other person confirms they feel understood (often marked by a visible sigh or softening in their voice).',
      },
    ],
  },
  {
    id: 'skill-4',
    number: '04',
    name: 'Early Vulnerable Expression',
    subtitle: 'Requests Over Demands',
    fullHeading: 'Skill 4: Early, Vulnerable Expression (Requests Over Demands)',
    corePrinciple:
      'Unspoken discomforts don\'t disappear—they accumulate silently until they erupt all at once. Voicing small feelings within 24 hours using "I feel... because I need..." statements—paired with a genuine request where the other person is free to say "no"—prevents resentment and builds deep trust.',
    comparisonHeading: 'Examples: Silent Collection / Demand vs. Early Request',
    quickCue: 'Voice small stings within 24 hours: Observation + Feeling + Need + Request (safe to hear "no").',
    examples: [
      {
        situation: 'Needing solo downtime after a heavy workweek',
        reactiveLabel: 'Silent / Demand',
        reactiveText: 'Saying yes when depleted, becoming irritable, or snapping when plans change.',
        constructiveLabel: 'Early Request',
        constructiveText:
          '"I\'ve had a really full week in the field and my bandwidth is low. I need a quiet evening at home to recharge—would you be open to us getting together tomorrow instead?"',
      },
      {
        situation: 'Feeling insecure about a relationship topic or timeline',
        reactiveLabel: 'Silent / Demand',
        reactiveText:
          'Quietly storing up resentment for weeks and unloading multiple grievances during an argument.',
        constructiveLabel: 'Early Request',
        constructiveText:
          '"When we talked about our winter plans earlier, I felt a wave of insecurity because I really value building a steady future together. Could we spend 15 minutes this weekend sharing where our heads are at?"',
      },
      {
        situation: 'Setting a boundary around difficult text conversations',
        reactiveLabel: 'Silent / Demand',
        reactiveText: '"Call me right now or this discussion is over."',
        constructiveLabel: 'Early Request',
        constructiveText:
          '"I care about working through this well, and I notice I get unsettled trying to discuss sensitive topics over text. Would you be willing to pause this until we can talk in person at 6:00 PM?"',
      },
    ],
    howToApply: [
      {
        title: 'The 24-Hour Rule',
        detail:
          'Commit to voicing any small sting, worry, or boundary within 24 hours while you are still calm.',
      },
      {
        title: 'Use the 4-Part Formula',
        detail:
          'Observation (When X happened) + Feeling (I felt Y) + Need (because I need Z) + Request (Would you be willing to...?).',
      },
      {
        title: 'Check If It\'s a True Request',
        detail:
          'How will you respond if the other person says "no"? If you can accept their "no" with grace and explore another way to meet your need, it is a true request.',
      },
    ],
  },
];

export const PRACTICE_TIERS: PracticeTierInfo[] = [
  {
    id: 'tier1',
    tierLabel: 'Tier 1: Solo',
    shortName: 'Solo Rehearsal',
    environment: 'Written & Mental Rehearsal',
    description:
      'Rewriting past interactions, scripting difficult conversations, and practicing validation phrases out loud with zero social pressure.',
    dailyTitle: 'Tier 1: Solo Rehearsal (Written or Spoken Practice)',
    dailyOpportunityLabel: 'Planned Opportunity / Exercise',
    dailyOpportunityPlaceholder:
      'e.g., Rewrite one past tense moment in NVC format; rehearse a validation phrase out loud',
    dailyReflectionPlaceholder: 'Did I achieve my goal? How did the phrasing feel in my body?',
    weeklyExamplePlan: 'Complete 3 evening trigger logs; script 1 tough conversation.',
  },
  {
    id: 'tier2',
    tierLabel: 'Tier 2: Low-Stakes',
    shortName: 'Low-Stakes',
    environment: 'Everyday Interactions',
    description:
      'Practicing warm presence, unhurried pacing, and curious listening with baristas, cashiers, contractors, or acquaintances.',
    dailyTitle: 'Tier 2: Low-Stakes Interaction (Everyday Encounters)',
    dailyOpportunityLabel: 'Planned Opportunity',
    dailyOpportunityPlaceholder: 'e.g., Chatting with a barista, store clerk, contractor, or neighbor',
    dailyReflectionPlaceholder: 'Did I achieve my goal? What went well, and what would I adjust?',
    weeklyExamplePlan: 'Practice unhurried listening and 2 curious questions in 5 everyday encounters.',
  },
  {
    id: 'tier3',
    tierLabel: 'Tier 3: Trusted Circle',
    shortName: 'Trusted Circle',
    environment: 'Friends, Family & Peers',
    description:
      'Practicing Empathy Before Education and Early Vulnerable Expression with people you know and care about during normal conversations.',
    dailyTitle: 'Tier 3: Trusted Circle (Friends, Family, or Colleagues)',
    dailyOpportunityLabel: 'Planned Opportunity',
    dailyOpportunityPlaceholder: 'e.g., Coffee with a friend, call with family, check-in with a coworker',
    dailyReflectionPlaceholder: 'Did I achieve my goal? Did I offer empathy before education?',
    weeklyExamplePlan: 'Practice Empathy Before Education during 3 discussions with friends/family.',
  },
  {
    id: 'tier4',
    tierLabel: 'Tier 4: High-Stakes',
    shortName: 'High-Stakes',
    environment: 'Friction, Feedback & Conflict',
    description:
      'Applying all four skills under real emotional activation—pausing defensiveness, validating impact first, and maintaining boundaries calmly.',
    dailyTitle: 'Tier 4: High-Stakes / Friction (Feedback, Disagreement, or Emotional Activation)',
    dailyOpportunityLabel: 'Planned or Unplanned Opportunity',
    dailyOpportunityPlaceholder:
      'e.g., Navigating a tough client quote, receiving feedback, or holding a boundary',
    dailyReflectionPlaceholder:
      'Did I achieve my goal? How effectively did I catch my tone and somatic cues?',
    weeklyExamplePlan: 'Voice any small discomfort within 24 hours; enforce "no conflict over text."',
  },
];

export const FEELINGS_AND_NEEDS_ADDENDUM = {
  heading: 'Expanded Vocabulary: Feelings and Needs',
  sublabel: 'Addendum to Section 1 · Reference Sheet',
  introPrefix: 'Using a precise vocabulary allows you to pinpoint what is happening internally—',
  introFormula: '“I am feeling [Feeling] because I am needing [Need]”',
  introSuffix: '—before deciding on a clear, actionable request.',
  feelingsMet: [
    {
      category: 'Affectionate & Warm',
      words: [
        'Appreciative',
        'compassionate',
        'friendly',
        'grateful',
        'loving',
        'open-hearted',
        'sympathetic',
        'tender',
        'warm',
      ],
    },
    {
      category: 'Peaceful & Grounded',
      words: [
        'Calm',
        'centered',
        'comfortable',
        'content',
        'fulfilled',
        'mellow',
        'quiet',
        'relaxed',
        'relieved',
        'secure',
        'serene',
        'steady',
        'tranquil',
      ],
    },
    {
      category: 'Joyful & Energized',
      words: [
        'Amused',
        'delighted',
        'eager',
        'ecstatic',
        'elated',
        'enthusiastic',
        'excited',
        'happy',
        'hopeful',
        'invigorated',
        'joyful',
        'optimistic',
        'playful',
        'thrilled',
      ],
    },
    {
      category: 'Engaged & Curious',
      words: [
        'Absorbed',
        'alert',
        'curious',
        'engrossed',
        'fascinated',
        'inspired',
        'interested',
        'intrigued',
        'involved',
        'stimulated',
      ],
    },
    {
      category: 'Confident & Empowered',
      words: [
        'Assured',
        'capable',
        'clear-headed',
        'confident',
        'empowered',
        'proud',
        'resilient',
        'strong',
      ],
    },
  ] satisfies VocabularyGroup[],
  feelingsUnmet: [
    {
      category: 'Afraid & Anxious',
      words: [
        'Apprehensive',
        'cautious',
        'dread',
        'fearful',
        'guarded',
        'insecure',
        'jittery',
        'nervous',
        'overwhelmed',
        'panicked',
        'scared',
        'uneasy',
        'vulnerable',
        'worried',
      ],
    },
    {
      category: 'Angry & Frustrated',
      words: [
        'Aggravated',
        'annoyed',
        'bitter',
        'exasperated',
        'frustrated',
        'furious',
        'impatient',
        'irked',
        'irritated',
        'resentful',
      ],
    },
    {
      category: 'Sad & Heavy',
      words: [
        'Depressed',
        'despondent',
        'disappointed',
        'discouraged',
        'disheartened',
        'gloomy',
        'grief-stricken',
        'heavy-hearted',
        'helpless',
        'hopeless',
        'lonely',
        'melancholy',
        'sorrowful',
        'unhappy',
      ],
    },
    {
      category: 'Disconnected & Detached',
      words: [
        'Alienated',
        'aloof',
        'apathetic',
        'bored',
        'detached',
        'distant',
        'flat',
        'indifferent',
        'numb',
        'withdrawn',
      ],
    },
    {
      category: 'Confused & Unsettled',
      words: [
        'Ambivalent',
        'baffled',
        'bewildered',
        'conflicted',
        'disoriented',
        'doubtful',
        'hesitant',
        'lost',
        'perplexed',
        'skeptical',
        'torn',
        'unsettled',
      ],
    },
    {
      category: 'Vulnerable & Remorseful',
      words: [
        'Ashamed',
        'chagrined',
        'embarrassed',
        'flustered',
        'guilty',
        'mortified',
        'regretful',
        'remorseful',
        'self-conscious',
      ],
    },
    {
      category: 'Fatigued & Depleted',
      words: [
        'Burned out',
        'depleted',
        'drained',
        'exhausted',
        'lethargic',
        'listless',
        'sleepy',
        'tired',
        'weary',
      ],
    },
    {
      category: 'Tense & Agitated',
      words: [
        'Agitated',
        'cranky',
        'distressed',
        'edgy',
        'fidgety',
        'frazzled',
        'irritable',
        'restless',
        'stressed',
        'uptight',
      ],
    },
  ] satisfies VocabularyGroup[],
  fauxFeelingsIntro:
    'Words that describe what you think someone else is doing to you (such as "I feel ignored" or "I feel attacked") are evaluations disguised as feelings. Translating them into pure feelings and underlying needs keeps conversations open rather than triggering defensiveness.',
  fauxFeelingsTable: [
    {
      fauxFeeling: 'Abandoned / Rejected',
      trueFeelings: 'Hurt, scared, lonely, sad',
      unmetNeeds: 'Connection, reassurance, belonging, inclusion',
    },
    {
      fauxFeeling: 'Attacked / Criticized',
      trueFeelings: 'Scared, anxious, tense, hurt',
      unmetNeeds: 'Emotional safety, respect, understanding',
    },
    {
      fauxFeeling: 'Dismissed / Invalidated',
      trueFeelings: 'Frustrated, sad, discouraged',
      unmetNeeds: 'Empathy, mutuality, to be heard and seen',
    },
    {
      fauxFeeling: 'Ignored / Unimportant',
      trueFeelings: 'Lonely, sad, uneasy',
      unmetNeeds: 'Connection, consideration, mattering',
    },
    {
      fauxFeeling: 'Manipulated / Pressured',
      trueFeelings: 'Resentful, frustrated, uneasy, guarded',
      unmetNeeds: 'Autonomy, choice, freedom, trust',
    },
    {
      fauxFeeling: 'Misunderstood',
      trueFeelings: 'Frustrated, anxious, lonely',
      unmetNeeds: 'Clarity, understanding, empathy',
    },
    {
      fauxFeeling: 'Taken for Granted',
      trueFeelings: 'Disappointed, tired, resentful',
      unmetNeeds: 'Appreciation, reciprocity, mutual care',
    },
    {
      fauxFeeling: 'Unappreciated',
      trueFeelings: 'Sad, discouraged, heavy-hearted',
      unmetNeeds: 'Appreciation, acknowledgment, recognition',
    },
  ] satisfies FauxFeelingRow[],
  universalNeeds: [
    {
      category: 'Connection & Belonging',
      words: [
        'Acceptance',
        'affection',
        'appreciation',
        'belonging',
        'closeness',
        'communication',
        'community',
        'companionship',
        'compassion',
        'consideration',
        'consistency',
        'empathy',
        'inclusion',
        'intimacy',
        'love',
        'mutuality',
        'nurturing',
        'respect',
        'support',
        'trust',
        'understanding',
        'warmth',
      ],
    },
    {
      category: 'Autonomy & Agency',
      words: [
        'Choice',
        'freedom',
        'independence',
        'self-determination',
        'space',
        'spontaneity',
        'sovereignty',
      ],
    },
    {
      category: 'Safety & Stability',
      words: [
        'Continuity',
        'emotional safety',
        'predictability',
        'protection',
        'reassurance',
        'security',
        'stability',
        'steadiness',
      ],
    },
    {
      category: 'Honesty & Integrity',
      words: [
        'Authenticity',
        'candor',
        'clarity',
        'congruence',
        'honesty',
        'integrity',
        'self-responsibility',
        'transparency',
      ],
    },
    {
      category: 'Physical Well-Being',
      words: [
        'Air',
        'food',
        'hydration',
        'movement and exercise',
        'physical comfort',
        'rest and sleep',
        'shelter',
        'touch',
      ],
    },
    {
      category: 'Peace & Ease',
      words: [
        'Balance',
        'beauty',
        'calm',
        'ease',
        'harmony',
        'order',
        'peace',
        'quiet',
        'spaciousness',
      ],
    },
    {
      category: 'Meaning & Growth',
      words: [
        'Challenge',
        'competence',
        'contribution',
        'creativity',
        'discovery',
        'growth',
        'learning',
        'purpose',
        'self-expression',
      ],
    },
    {
      category: 'Play & Joy',
      words: [
        'Adventure',
        'celebration',
        'humor',
        'joy',
        'lightness',
        'play',
        'relaxation',
        'stimulation',
      ],
    },
  ] satisfies VocabularyGroup[],
};
