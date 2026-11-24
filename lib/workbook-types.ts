export type WorkbookView = 'reference' | 'daily' | 'weekly';

export type MicroSkillName =
  | 'Somatic & Tone Catching'
  | 'Observation Without Evaluation'
  | 'Empathy Before Education'
  | 'Early Vulnerable Expression';

export interface DailyTierEntry {
  plannedOpportunity: string;
  targetMicroSkill: MicroSkillName | '';
  desiredOutcome: string;
  postReflection: string;
}

export interface DailyLogData {
  date: string;
  hoursSlept: string;
  digestiveComfort: string;
  overallEnergy: string;
  startTime: string;
  lunchStartTime: string;
  lunchEndTime: string;
  hardStopTime: string;
  exerciseTime: string;
  primaryMicroSkillFocus: MicroSkillName | '';
  specificTargetInteraction: string;
  boundaries: {
    digitalTexting: boolean;
    pacingBandwidth: boolean;
    relationalSpaceChecked: boolean;
    relationalSpaceNote: string;
  };
  tiers: {
    tier1: DailyTierEntry;
    tier2: DailyTierEntry;
    tier3: DailyTierEntry;
    tier4: DailyTierEntry;
  };
  eveningDebrief: {
    trigger: string;
    thoughts: string;
    emotions: string;
    physicalSensations: string;
    behaviorAndAlternative: string;
    quietWin: string;
  };
}

export type OutcomeStatus = '' | 'Yes' | 'Partial' | 'No';

export interface WeeklyTierEntry {
  plannedOpportunities: string;
  targetSkill: MicroSkillName | '';
  desiredGoal: string;
  outcomeAchieved: OutcomeStatus;
  reflection: string;
}

export interface WeeklyCalibrationData {
  weekOf: string;
  primaryWeeklyTheme: MicroSkillName | '';
  tiers: {
    tier1: WeeklyTierEntry;
    tier2: WeeklyTierEntry;
    tier3: WeeklyTierEntry;
    tier4: WeeklyTierEntry;
  };
  audit: {
    recurringTriggers: string;
    somaticBandwidthCorrelation: string;
    unspokenDiscomforts: string;
  };
  redo: {
    context: string;
    actualResponse: string;
    observation: string;
    feeling: string;
    need: string;
    request: string;
  };
  evaluation: {
    steadinessMoment1: string;
    steadinessMoment2: string;
    steadinessMoment3: string;
    concreteAdjustment: string;
    selfEmpathyStatement: string;
  };
}

const VALID_SKILLS: ReadonlySet<string> = new Set([
  'Somatic & Tone Catching',
  'Observation Without Evaluation',
  'Empathy Before Education',
  'Early Vulnerable Expression',
]);

function coerceSkill(value: unknown): MicroSkillName | '' {
  return typeof value === 'string' && VALID_SKILLS.has(value)
    ? (value as MicroSkillName)
    : '';
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekStartIsoDate(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToSunday = now.getDate() - dayOfWeek;
  const sunday = new Date(now.getFullYear(), now.getMonth(), diffToSunday);
  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0');
  const day = String(sunday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createDefaultDailyLog(dateStr = ''): DailyLogData {
  return {
    date: dateStr,
    hoursSlept: '',
    digestiveComfort: '',
    overallEnergy: '',
    startTime: '',
    lunchStartTime: '',
    lunchEndTime: '',
    hardStopTime: '',
    exerciseTime: '',
    primaryMicroSkillFocus: '',
    specificTargetInteraction: '',
    boundaries: {
      digitalTexting: false,
      pacingBandwidth: false,
      relationalSpaceChecked: false,
      relationalSpaceNote: '',
    },
    tiers: {
      tier1: {
        plannedOpportunity: '',
        targetMicroSkill: '',
        desiredOutcome: '',
        postReflection: '',
      },
      tier2: {
        plannedOpportunity: '',
        targetMicroSkill: '',
        desiredOutcome: '',
        postReflection: '',
      },
      tier3: {
        plannedOpportunity: '',
        targetMicroSkill: '',
        desiredOutcome: '',
        postReflection: '',
      },
      tier4: {
        plannedOpportunity: '',
        targetMicroSkill: '',
        desiredOutcome: '',
        postReflection: '',
      },
    },
    eveningDebrief: {
      trigger: '',
      thoughts: '',
      emotions: '',
      physicalSensations: '',
      behaviorAndAlternative: '',
      quietWin: '',
    },
  };
}

export function normalizeDailyLog(raw: Partial<DailyLogData> | null | undefined): DailyLogData {
  const base = createDefaultDailyLog('');
  if (!raw || typeof raw !== 'object') return base;

  const normalizeTier = (t: Partial<DailyTierEntry> | undefined): DailyTierEntry => ({
    plannedOpportunity: typeof t?.plannedOpportunity === 'string' ? t.plannedOpportunity : '',
    targetMicroSkill: coerceSkill(t?.targetMicroSkill),
    desiredOutcome: typeof t?.desiredOutcome === 'string' ? t.desiredOutcome : '',
    postReflection: typeof t?.postReflection === 'string' ? t.postReflection : '',
  });

  return {
    date: typeof raw.date === 'string' ? raw.date : base.date,
    hoursSlept: typeof raw.hoursSlept === 'string' ? raw.hoursSlept : '',
    digestiveComfort: typeof raw.digestiveComfort === 'string' ? raw.digestiveComfort : '',
    overallEnergy: typeof raw.overallEnergy === 'string' ? raw.overallEnergy : '',
    startTime: typeof raw.startTime === 'string' ? raw.startTime : '',
    lunchStartTime: typeof raw.lunchStartTime === 'string' ? raw.lunchStartTime : '',
    lunchEndTime: typeof raw.lunchEndTime === 'string' ? raw.lunchEndTime : '',
    hardStopTime: typeof raw.hardStopTime === 'string' ? raw.hardStopTime : '',
    exerciseTime: typeof raw.exerciseTime === 'string' ? raw.exerciseTime : '',
    primaryMicroSkillFocus: coerceSkill(raw.primaryMicroSkillFocus),
    specificTargetInteraction:
      typeof raw.specificTargetInteraction === 'string' ? raw.specificTargetInteraction : '',
    boundaries: {
      digitalTexting: Boolean(raw.boundaries?.digitalTexting),
      pacingBandwidth: Boolean(raw.boundaries?.pacingBandwidth),
      relationalSpaceChecked: Boolean(raw.boundaries?.relationalSpaceChecked),
      relationalSpaceNote:
        typeof raw.boundaries?.relationalSpaceNote === 'string'
          ? raw.boundaries.relationalSpaceNote
          : '',
    },
    tiers: {
      tier1: normalizeTier(raw.tiers?.tier1),
      tier2: normalizeTier(raw.tiers?.tier2),
      tier3: normalizeTier(raw.tiers?.tier3),
      tier4: normalizeTier(raw.tiers?.tier4),
    },
    eveningDebrief: {
      trigger: typeof raw.eveningDebrief?.trigger === 'string' ? raw.eveningDebrief.trigger : '',
      thoughts: typeof raw.eveningDebrief?.thoughts === 'string' ? raw.eveningDebrief.thoughts : '',
      emotions: typeof raw.eveningDebrief?.emotions === 'string' ? raw.eveningDebrief.emotions : '',
      physicalSensations:
        typeof raw.eveningDebrief?.physicalSensations === 'string'
          ? raw.eveningDebrief.physicalSensations
          : '',
      behaviorAndAlternative:
        typeof raw.eveningDebrief?.behaviorAndAlternative === 'string'
          ? raw.eveningDebrief.behaviorAndAlternative
          : '',
      quietWin: typeof raw.eveningDebrief?.quietWin === 'string' ? raw.eveningDebrief.quietWin : '',
    },
  };
}

export function createDefaultWeeklyCalibration(weekOfStr = ''): WeeklyCalibrationData {
  return {
    weekOf: weekOfStr,
    primaryWeeklyTheme: '',
    tiers: {
      tier1: {
        plannedOpportunities: '',
        targetSkill: '',
        desiredGoal: '',
        outcomeAchieved: '',
        reflection: '',
      },
      tier2: {
        plannedOpportunities: '',
        targetSkill: '',
        desiredGoal: '',
        outcomeAchieved: '',
        reflection: '',
      },
      tier3: {
        plannedOpportunities: '',
        targetSkill: '',
        desiredGoal: '',
        outcomeAchieved: '',
        reflection: '',
      },
      tier4: {
        plannedOpportunities: '',
        targetSkill: '',
        desiredGoal: '',
        outcomeAchieved: '',
        reflection: '',
      },
    },
    audit: {
      recurringTriggers: '',
      somaticBandwidthCorrelation: '',
      unspokenDiscomforts: '',
    },
    redo: {
      context: '',
      actualResponse: '',
      observation: '',
      feeling: '',
      need: '',
      request: '',
    },
    evaluation: {
      steadinessMoment1: '',
      steadinessMoment2: '',
      steadinessMoment3: '',
      concreteAdjustment: '',
      selfEmpathyStatement: '',
    },
  };
}

export function normalizeWeeklyCalibration(
  raw: Partial<WeeklyCalibrationData> | null | undefined
): WeeklyCalibrationData {
  const base = createDefaultWeeklyCalibration('');
  if (!raw || typeof raw !== 'object') return base;

  const normalizeTier = (t: Partial<WeeklyTierEntry> | undefined): WeeklyTierEntry => ({
    plannedOpportunities:
      typeof t?.plannedOpportunities === 'string' ? t.plannedOpportunities : '',
    targetSkill: coerceSkill(t?.targetSkill),
    desiredGoal: typeof t?.desiredGoal === 'string' ? t.desiredGoal : '',
    outcomeAchieved:
      t?.outcomeAchieved === 'Yes' ||
      t?.outcomeAchieved === 'Partial' ||
      t?.outcomeAchieved === 'No'
        ? t.outcomeAchieved
        : '',
    reflection: typeof t?.reflection === 'string' ? t.reflection : '',
  });

  return {
    weekOf: typeof raw.weekOf === 'string' ? raw.weekOf : base.weekOf,
    primaryWeeklyTheme: coerceSkill(raw.primaryWeeklyTheme),
    tiers: {
      tier1: normalizeTier(raw.tiers?.tier1),
      tier2: normalizeTier(raw.tiers?.tier2),
      tier3: normalizeTier(raw.tiers?.tier3),
      tier4: normalizeTier(raw.tiers?.tier4),
    },
    audit: {
      recurringTriggers:
        typeof raw.audit?.recurringTriggers === 'string' ? raw.audit.recurringTriggers : '',
      somaticBandwidthCorrelation:
        typeof raw.audit?.somaticBandwidthCorrelation === 'string'
          ? raw.audit.somaticBandwidthCorrelation
          : '',
      unspokenDiscomforts:
        typeof raw.audit?.unspokenDiscomforts === 'string'
          ? raw.audit.unspokenDiscomforts
          : '',
    },
    redo: {
      context: typeof raw.redo?.context === 'string' ? raw.redo.context : '',
      actualResponse:
        typeof raw.redo?.actualResponse === 'string' ? raw.redo.actualResponse : '',
      observation: typeof raw.redo?.observation === 'string' ? raw.redo.observation : '',
      feeling: typeof raw.redo?.feeling === 'string' ? raw.redo.feeling : '',
      need: typeof raw.redo?.need === 'string' ? raw.redo.need : '',
      request: typeof raw.redo?.request === 'string' ? raw.redo.request : '',
    },
    evaluation: {
      steadinessMoment1:
        typeof raw.evaluation?.steadinessMoment1 === 'string'
          ? raw.evaluation.steadinessMoment1
          : '',
      steadinessMoment2:
        typeof raw.evaluation?.steadinessMoment2 === 'string'
          ? raw.evaluation.steadinessMoment2
          : '',
      steadinessMoment3:
        typeof raw.evaluation?.steadinessMoment3 === 'string'
          ? raw.evaluation.steadinessMoment3
          : '',
      concreteAdjustment:
        typeof raw.evaluation?.concreteAdjustment === 'string'
          ? raw.evaluation.concreteAdjustment
          : '',
      selfEmpathyStatement:
        typeof raw.evaluation?.selfEmpathyStatement === 'string'
          ? raw.evaluation.selfEmpathyStatement
          : '',
    },
  };
}
