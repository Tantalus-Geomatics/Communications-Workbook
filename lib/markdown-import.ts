import {
  createDefaultDailyLog,
  createDefaultWeeklyCalibration,
  normalizeDailyLog,
  normalizeWeeklyCalibration,
  type DailyLogData,
  type DailyTierEntry,
  type WeeklyCalibrationData,
  type WeeklyTierEntry,
} from './workbook-types';

export type ImportedWorkbookResult =
  | { kind: 'daily'; data: DailyLogData }
  | { kind: 'weekly'; data: WeeklyCalibrationData };

export class MarkdownImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MarkdownImportError';
  }
}

function cleanFieldValue(raw: string, extraPlaceholders: string[] = []): string {
  const trimmed = raw.trim();
  if (
    trimmed === '' ||
    trimmed === '_Not entered_' ||
    trimmed === '*Not entered*' ||
    extraPlaceholders.includes(trimmed)
  ) {
    return '';
  }
  return trimmed;
}

function unescapeTableCell(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\\\|/g, '|')
    .trim();
}

function splitMarkdownTableRow(line: string): string[] {
  const trimmed = line.trim();
  const inner = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  const cells: string[] = [];
  let current = '';

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === '\\' && i + 1 < inner.length && inner[i + 1] === '|') {
      current += '\\|';
      i += 1;
      continue;
    }
    if (ch === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

export function parseDailyLogFromMarkdown(markdown: string): DailyLogData {
  const normalizedNewlines = markdown.replace(/\r\n/g, '\n');
  if (
    !/Daily Practice & Progressive Tier Log/i.test(normalizedNewlines) &&
    !/Daily Header & Bandwidth Check-In/i.test(normalizedNewlines)
  ) {
    throw new MarkdownImportError(
      'This file does not appear to be an exported Daily Practice Log.'
    );
  }

  const result = createDefaultDailyLog('');
  const lines = normalizedNewlines.split('\n');

  type ActiveField = {
    get: () => string;
    set: (val: string) => void;
    extraPlaceholders?: string[];
  };

  let currentTier: keyof DailyLogData['tiers'] | null = null;
  const activeFieldRef: { current: ActiveField | null } = { current: null };

  const commitActiveField = () => {
    const active = activeFieldRef.current;
    if (!active) return;
    const cleaned = cleanFieldValue(active.get(), active.extraPlaceholders);
    active.set(cleaned);
    activeFieldRef.current = null;
  };

  const setSimpleField = (
    setter: (val: string) => void,
    getter: () => string,
    initialValue: string,
    extraPlaceholders: string[] = []
  ) => {
    commitActiveField();
    setter(initialValue);
    activeFieldRef.current = {
      get: getter,
      set: setter,
      extraPlaceholders,
    };
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Title date fallback
    const titleMatch = trimmed.match(/^#\s+Daily Practice & Progressive Tier Log\s+[—-]\s+(.+)$/i);
    if (titleMatch) {
      const candidate = cleanFieldValue(titleMatch[1], ['YYYY-MM-DD']);
      if (candidate && !result.date) {
        result.date = candidate;
      }
      continue;
    }

    // Section headings reset active field and tier
    if (/^##\s+/.test(trimmed)) {
      commitActiveField();
      currentTier = null;
      continue;
    }

    if (/^###\s+Tier 1:/i.test(trimmed)) {
      commitActiveField();
      currentTier = 'tier1';
      continue;
    }
    if (/^###\s+Tier 2:/i.test(trimmed)) {
      commitActiveField();
      currentTier = 'tier2';
      continue;
    }
    if (/^###\s+Tier 3:/i.test(trimmed)) {
      commitActiveField();
      currentTier = 'tier3';
      continue;
    }
    if (/^###\s+Tier 4:/i.test(trimmed)) {
      commitActiveField();
      currentTier = 'tier4';
      continue;
    }

    // Daily Header & Bandwidth Check-In
    const dateMatch = line.match(/^\s*-\s+\*\*Date:\*\*\s*(.*)$/);
    if (dateMatch) {
      commitActiveField();
      result.date = cleanFieldValue(dateMatch[1], ['YYYY-MM-DD']);
      continue;
    }

    if (/^\s*-\s+\*\*(Sleep & Physical State|Workload Cap Today):\*\*\s*$/.test(line)) {
      commitActiveField();
      continue;
    }

    const hoursMatch = line.match(/^\s*-\s+\*\*Hours Slept:\*\*\s*(.*)$/);
    if (hoursMatch) {
      commitActiveField();
      result.hoursSlept = cleanFieldValue(hoursMatch[1]);
      continue;
    }

    const digestiveMatch = line.match(/^\s*-\s+\*\*Digestive Comfort:\*\*\s*(.*)$/);
    if (digestiveMatch) {
      setSimpleField(
        (v) => {
          result.digestiveComfort = v;
        },
        () => result.digestiveComfort,
        digestiveMatch[1]
      );
      continue;
    }

    const energyMatch = line.match(/^\s*-\s+\*\*Overall Energy \(1–10\):\*\*\s*(.*)$/);
    if (energyMatch) {
      commitActiveField();
      const rawEnergy = cleanFieldValue(energyMatch[1]);
      result.overallEnergy = rawEnergy.replace(/\s*\/\s*10$/, '').trim();
      continue;
    }

    const startTimeMatch = line.match(/^\s*-\s+\*\*Start Time:\*\*\s*(.*)$/);
    if (startTimeMatch) {
      commitActiveField();
      result.startTime = cleanFieldValue(startTimeMatch[1]);
      continue;
    }

    const lunchStartMatch = line.match(/^\s*-\s+\*\*Lunch Start Time:\*\*\s*(.*)$/);
    if (lunchStartMatch) {
      commitActiveField();
      result.lunchStartTime = cleanFieldValue(lunchStartMatch[1]);
      continue;
    }

    const lunchEndMatch = line.match(/^\s*-\s+\*\*Lunch End Time:\*\*\s*(.*)$/);
    if (lunchEndMatch) {
      commitActiveField();
      result.lunchEndTime = cleanFieldValue(lunchEndMatch[1]);
      continue;
    }

    const hardStopMatch = line.match(/^\s*-\s+\*\*Hard Stop Time:\*\*\s*(.*)$/);
    if (hardStopMatch) {
      commitActiveField();
      result.hardStopTime = cleanFieldValue(hardStopMatch[1]);
      continue;
    }

    const exerciseTimeMatch = line.match(/^\s*-\s+\*\*Exercise Time:\*\*\s*(.*)$/);
    if (exerciseTimeMatch) {
      commitActiveField();
      result.exerciseTime = cleanFieldValue(exerciseTimeMatch[1]);
      continue;
    }

    // Part A: Morning Micro-Routine Intentions & Boundaries
    const primarySkillMatch = line.match(
      /^\s*1\.\s+\*\*Primary Micro-Skill Focus Today:\*\*\s*(.*)$/
    );
    if (primarySkillMatch) {
      commitActiveField();
      result.primaryMicroSkillFocus = cleanFieldValue(primarySkillMatch[1]) as DailyLogData['primaryMicroSkillFocus'];
      continue;
    }

    const targetInteractionMatch = line.match(
      /^\s*2\.\s+\*\*Specific Target Interaction:\*\*\s*(.*)$/
    );
    if (targetInteractionMatch) {
      setSimpleField(
        (v) => {
          result.specificTargetInteraction = v;
        },
        () => result.specificTargetInteraction,
        targetInteractionMatch[1]
      );
      continue;
    }

    if (/^\s*3\.\s+\*\*Boundaries to Maintain Today:\*\*/.test(line)) {
      commitActiveField();
      continue;
    }

    const digitalBoundaryMatch = line.match(
      /^\s*-\s+\[([xX ])\]\s+\*\*Digital \/ Texting Boundary:\*\*/
    );
    if (digitalBoundaryMatch) {
      commitActiveField();
      result.boundaries.digitalTexting = digitalBoundaryMatch[1].toLowerCase() === 'x';
      continue;
    }

    const pacingBoundaryMatch = line.match(
      /^\s*-\s+\[([xX ])\]\s+\*\*Pacing \/ Bandwidth Boundary:\*\*/
    );
    if (pacingBoundaryMatch) {
      commitActiveField();
      result.boundaries.pacingBandwidth = pacingBoundaryMatch[1].toLowerCase() === 'x';
      continue;
    }

    const relationalBoundaryMatch = line.match(
      /^\s*-\s+\[([xX ])\]\s+\*\*Relational \/ Space Boundary:\*\*\s*(.*)$/
    );
    if (relationalBoundaryMatch) {
      result.boundaries.relationalSpaceChecked =
        relationalBoundaryMatch[1].toLowerCase() === 'x';
      setSimpleField(
        (v) => {
          result.boundaries.relationalSpaceNote = v;
        },
        () => result.boundaries.relationalSpaceNote,
        relationalBoundaryMatch[2]
      );
      continue;
    }

    // Part B: Tier fields
    if (currentTier) {
      const tierRef = result.tiers[currentTier];
      const oppMatch = line.match(
        /^\s*-\s+\*\*(?:Planned Opportunity \/ Exercise|Planned Opportunity|Planned or Unplanned Opportunity):\*\*\s*(.*)$/
      );
      if (oppMatch) {
        setSimpleField(
          (v) => {
            tierRef.plannedOpportunity = v;
          },
          () => tierRef.plannedOpportunity,
          oppMatch[1]
        );
        continue;
      }

      const tierSkillMatch = line.match(/^\s*-\s+\*\*Target Micro-Skill:\*\*\s*(.*)$/);
      if (tierSkillMatch) {
        commitActiveField();
        tierRef.targetMicroSkill = cleanFieldValue(
          tierSkillMatch[1]
        ) as DailyTierEntry['targetMicroSkill'];
        continue;
      }

      const outcomeMatch = line.match(/^\s*-\s+\*\*Desired Outcome \/ Goal:\*\*\s*(.*)$/);
      if (outcomeMatch) {
        setSimpleField(
          (v) => {
            tierRef.desiredOutcome = v;
          },
          () => tierRef.desiredOutcome,
          outcomeMatch[1]
        );
        continue;
      }

      const reflectionMatch = line.match(
        /^\s*-\s+\*\*Post-Interaction Reflection & Outcome Evaluation:\*\*\s*(.*)$/
      );
      if (reflectionMatch) {
        setSimpleField(
          (v) => {
            tierRef.postReflection = v;
          },
          () => tierRef.postReflection,
          reflectionMatch[1]
        );
        continue;
      }
    }

    // Part C: Evening Debrief
    const triggerMatch = line.match(/^\s*-\s+\*\*1\.\s+The Trigger[^*]*\*\*\s*(.*)$/);
    if (triggerMatch) {
      setSimpleField(
        (v) => {
          result.eveningDebrief.trigger = v;
        },
        () => result.eveningDebrief.trigger,
        triggerMatch[1]
      );
      continue;
    }

    const thoughtsMatch = line.match(/^\s*-\s+\*\*2\.\s+My Thoughts[^*]*\*\*\s*(.*)$/);
    if (thoughtsMatch) {
      setSimpleField(
        (v) => {
          result.eveningDebrief.thoughts = v;
        },
        () => result.eveningDebrief.thoughts,
        thoughtsMatch[1]
      );
      continue;
    }

    const emotionsMatch = line.match(/^\s*-\s+\*\*3\.\s+My Emotions[^*]*\*\*\s*(.*)$/);
    if (emotionsMatch) {
      setSimpleField(
        (v) => {
          result.eveningDebrief.emotions = v;
        },
        () => result.eveningDebrief.emotions,
        emotionsMatch[1]
      );
      continue;
    }

    const sensationsMatch = line.match(/^\s*-\s+\*\*4\.\s+Physical Sensations[^*]*\*\*\s*(.*)$/);
    if (sensationsMatch) {
      setSimpleField(
        (v) => {
          result.eveningDebrief.physicalSensations = v;
        },
        () => result.eveningDebrief.physicalSensations,
        sensationsMatch[1]
      );
      continue;
    }

    const behaviorMatch = line.match(
      /^\s*-\s+\*\*5\.\s+My Behavior & Constructive Alternative[^*]*\*\*\s*(.*)$/
    );
    if (behaviorMatch) {
      setSimpleField(
        (v) => {
          result.eveningDebrief.behaviorAndAlternative = v;
        },
        () => result.eveningDebrief.behaviorAndAlternative,
        behaviorMatch[1]
      );
      continue;
    }

    const quietWinMatch = line.match(/^\s*-\s+\*\*One Quiet Win From Today:\*\*\s*(.*)$/);
    if (quietWinMatch) {
      setSimpleField(
        (v) => {
          result.eveningDebrief.quietWin = v;
        },
        () => result.eveningDebrief.quietWin,
        quietWinMatch[1]
      );
      continue;
    }

    // Continuation line for multi-line textarea fields
    if (activeFieldRef.current) {
      const prev = activeFieldRef.current.get();
      activeFieldRef.current.set(prev ? `${prev}\n${line}` : line);
    }
  }

  commitActiveField();
  return normalizeDailyLog(result);
}

export function parseWeeklyCalibrationFromMarkdown(
  markdown: string
): WeeklyCalibrationData {
  const normalizedNewlines = markdown.replace(/\r\n/g, '\n');
  if (
    !/Weekly Practice & Calibration/i.test(normalizedNewlines) &&
    !/Weekly Trigger & Bandwidth Audit/i.test(normalizedNewlines)
  ) {
    throw new MarkdownImportError(
      'This file does not appear to be an exported Weekly Calibration log.'
    );
  }

  const result = createDefaultWeeklyCalibration('');
  const lines = normalizedNewlines.split('\n');

  type ActiveField = {
    get: () => string;
    set: (val: string) => void;
    extraPlaceholders?: string[];
  };

  const activeFieldRef: { current: ActiveField | null } = { current: null };

  const commitActiveField = () => {
    const active = activeFieldRef.current;
    if (!active) return;
    active.set(cleanFieldValue(active.get(), active.extraPlaceholders));
    activeFieldRef.current = null;
  };

  const setSimpleField = (
    setter: (val: string) => void,
    getter: () => string,
    initialValue: string,
    extraPlaceholders: string[] = []
  ) => {
    commitActiveField();
    setter(initialValue);
    activeFieldRef.current = {
      get: getter,
      set: setter,
      extraPlaceholders,
    };
  };

  for (const line of lines) {
    const trimmed = line.trim();

    const titleMatch = trimmed.match(
      /^#\s+Weekly Practice & Calibration\s+[—-]\s+Week Of\s+(.+)$/i
    );
    if (titleMatch) {
      const candidate = cleanFieldValue(titleMatch[1], ['YYYY-MM-DD']);
      if (candidate && !result.weekOf) {
        result.weekOf = candidate;
      }
      continue;
    }

    if (/^##\s+/.test(trimmed)) {
      commitActiveField();
      continue;
    }

    const weekOfMatch = line.match(/^\s*-\s+\*\*Week Of:\*\*\s*(.*)$/);
    if (weekOfMatch) {
      commitActiveField();
      result.weekOf = cleanFieldValue(weekOfMatch[1], ['YYYY-MM-DD']);
      continue;
    }

    const themeMatch = line.match(
      /^\s*-\s+\*\*Primary Weekly Micro-Skill Theme:\*\*\s*(.*)$/
    );
    if (themeMatch) {
      commitActiveField();
      result.primaryWeeklyTheme = cleanFieldValue(
        themeMatch[1]
      ) as WeeklyCalibrationData['primaryWeeklyTheme'];
      continue;
    }

    // Part A: Table rows
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      commitActiveField();
      const cells = splitMarkdownTableRow(trimmed);
      if (cells.length >= 4) {
        const tierCell = cells[0];
        let tierKey: keyof WeeklyCalibrationData['tiers'] | null = null;
        if (/Tier 1:\s*Solo/i.test(tierCell)) tierKey = 'tier1';
        else if (/Tier 2:\s*Low-Stakes/i.test(tierCell)) tierKey = 'tier2';
        else if (/Tier 3:\s*Trusted Circle/i.test(tierCell)) tierKey = 'tier3';
        else if (/Tier 4:\s*High-Stakes/i.test(tierCell)) tierKey = 'tier4';

        if (tierKey) {
          const entry: WeeklyTierEntry = result.tiers[tierKey];
          entry.plannedOpportunities = cleanFieldValue(unescapeTableCell(cells[1]));

          const skillGoalMatch = cells[2].match(
            /^\*\*Skill:\*\*\s*([\s\S]*?)<br\s*\/?>\*\*Goal:\*\*\s*([\s\S]*)$/i
          );
          if (skillGoalMatch) {
            entry.targetSkill = cleanFieldValue(
              unescapeTableCell(skillGoalMatch[1])
            ) as WeeklyTierEntry['targetSkill'];
            entry.desiredGoal = cleanFieldValue(unescapeTableCell(skillGoalMatch[2]));
          }

          const outcomeRefMatch = cells[3].match(
            /^\*\*Outcome Achieved\?\*\*\s*([\s\S]*?)<br\s*\/?>\*\*Reflection:\*\*\s*([\s\S]*)$/i
          );
          if (outcomeRefMatch) {
            entry.outcomeAchieved = cleanFieldValue(
              unescapeTableCell(outcomeRefMatch[1])
            ) as WeeklyTierEntry['outcomeAchieved'];
            entry.reflection = cleanFieldValue(unescapeTableCell(outcomeRefMatch[2]));
          }
        }
      }
      continue;
    }

    // Part B: Weekly Trigger & Bandwidth Audit
    const triggersMatch = line.match(/^\s*1\.\s+\*\*Recurring Triggers:\*\*\s*(.*)$/);
    if (triggersMatch) {
      setSimpleField(
        (v) => {
          result.audit.recurringTriggers = v;
        },
        () => result.audit.recurringTriggers,
        triggersMatch[1]
      );
      continue;
    }

    const somaticMatch = line.match(
      /^\s*2\.\s+\*\*Somatic & Bandwidth Correlation:\*\*\s*(.*)$/
    );
    if (somaticMatch) {
      setSimpleField(
        (v) => {
          result.audit.somaticBandwidthCorrelation = v;
        },
        () => result.audit.somaticBandwidthCorrelation,
        somaticMatch[1]
      );
      continue;
    }

    const unspokenMatch = line.match(
      /^\s*3\.\s+\*\*Unspoken Discomforts Check:\*\*\s*(.*)$/
    );
    if (unspokenMatch) {
      setSimpleField(
        (v) => {
          result.audit.unspokenDiscomforts = v;
        },
        () => result.audit.unspokenDiscomforts,
        unspokenMatch[1]
      );
      continue;
    }

    // Part C: Weekly Script "Redo"
    const contextMatch = line.match(/^\s*-\s+\*\*Context:\*\*\s*(.*)$/);
    if (contextMatch) {
      setSimpleField(
        (v) => {
          result.redo.context = v;
        },
        () => result.redo.context,
        contextMatch[1]
      );
      continue;
    }

    const actualMatch = line.match(/^\s*-\s+\*\*What I Actually Said or Did:\*\*\s*(.*)$/);
    if (actualMatch) {
      setSimpleField(
        (v) => {
          result.redo.actualResponse = v;
        },
        () => result.redo.actualResponse,
        actualMatch[1]
      );
      continue;
    }

    if (/^\s*-\s+\*\*Constructive "Redo" Script:\*\*/.test(line)) {
      commitActiveField();
      continue;
    }

    const obsMatch = line.match(/^\s*-\s+\*\*1\.\s+Observation\*\*[^:]*:\s*(.*)$/);
    if (obsMatch) {
      setSimpleField(
        (v) => {
          result.redo.observation = v;
        },
        () => result.redo.observation,
        obsMatch[1]
      );
      continue;
    }

    const feelMatch = line.match(/^\s*-\s+\*\*2\.\s+Feeling\*\*[^:]*:\s*(.*)$/);
    if (feelMatch) {
      setSimpleField(
        (v) => {
          result.redo.feeling = v;
        },
        () => result.redo.feeling,
        feelMatch[1]
      );
      continue;
    }

    const needMatch = line.match(/^\s*-\s+\*\*3\.\s+Need\*\*[^:]*:\s*(.*)$/);
    if (needMatch) {
      setSimpleField(
        (v) => {
          result.redo.need = v;
        },
        () => result.redo.need,
        needMatch[1]
      );
      continue;
    }

    const reqMatch = line.match(/^\s*-\s+\*\*4\.\s+Request\*\*[^:]*:\s*(.*)$/);
    if (reqMatch) {
      setSimpleField(
        (v) => {
          result.redo.request = v;
        },
        () => result.redo.request,
        reqMatch[1]
      );
      continue;
    }

    // Part D: Weekly Evaluation Without Shame
    if (/^\s*1\.\s+\*\*Three Moments of Steadiness:\*\*/.test(line)) {
      commitActiveField();
      continue;
    }

    const steadiness1Match = line.match(/^\s*-\s+1\.\s*(.*)$/);
    if (steadiness1Match) {
      setSimpleField(
        (v) => {
          result.evaluation.steadinessMoment1 = v;
        },
        () => result.evaluation.steadinessMoment1,
        steadiness1Match[1]
      );
      continue;
    }

    const steadiness2Match = line.match(/^\s*-\s+2\.\s*(.*)$/);
    if (steadiness2Match) {
      setSimpleField(
        (v) => {
          result.evaluation.steadinessMoment2 = v;
        },
        () => result.evaluation.steadinessMoment2,
        steadiness2Match[1]
      );
      continue;
    }

    const steadiness3Match = line.match(/^\s*-\s+3\.\s*(.*)$/);
    if (steadiness3Match) {
      setSimpleField(
        (v) => {
          result.evaluation.steadinessMoment3 = v;
        },
        () => result.evaluation.steadinessMoment3,
        steadiness3Match[1]
      );
      continue;
    }

    const adjustmentMatch = line.match(
      /^\s*2\.\s+\*\*One Concrete Adjustment for Next Week:\*\*\s*(.*)$/
    );
    if (adjustmentMatch) {
      setSimpleField(
        (v) => {
          result.evaluation.concreteAdjustment = v;
        },
        () => result.evaluation.concreteAdjustment,
        adjustmentMatch[1]
      );
      continue;
    }

    const selfEmpathyMatch = line.match(/^\s*3\.\s+\*\*Self-Empathy Statement:\*\*\s*(.*)$/);
    if (selfEmpathyMatch) {
      setSimpleField(
        (v) => {
          result.evaluation.selfEmpathyStatement = v;
        },
        () => result.evaluation.selfEmpathyStatement,
        selfEmpathyMatch[1]
      );
      continue;
    }

    // Continuation line for multi-line textarea fields
    if (activeFieldRef.current) {
      const prev = activeFieldRef.current.get();
      activeFieldRef.current.set(prev ? `${prev}\n${line}` : line);
    }
  }

  commitActiveField();
  return normalizeWeeklyCalibration(result);
}

export function parseWorkbookMarkdown(markdown: string): ImportedWorkbookResult {
  const normalized = markdown.replace(/\r\n/g, '\n');

  if (
    /Daily Practice & Progressive Tier Log/i.test(normalized) ||
    /Daily Header & Bandwidth Check-In/i.test(normalized)
  ) {
    return {
      kind: 'daily',
      data: parseDailyLogFromMarkdown(normalized),
    };
  }

  if (
    /Weekly Practice & Calibration/i.test(normalized) ||
    /Weekly Trigger & Bandwidth Audit/i.test(normalized)
  ) {
    return {
      kind: 'weekly',
      data: parseWeeklyCalibrationFromMarkdown(normalized),
    };
  }

  throw new MarkdownImportError(
    'Could not recognize this Markdown file. Please select a Daily Practice Log or Weekly Calibration .md file exported from this workbook.'
  );
}
