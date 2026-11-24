import type { DailyLogData, WeeklyCalibrationData } from './workbook-types';

function fieldOrBlank(value: string, placeholder = '_Not entered_'): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : placeholder;
}

function escapeTableCell(value: string): string {
  return value.trim().replace(/\|/g, '\\|').replace(/\r?\n/g, '<br />');
}

export function formatDailyLogToMarkdown(data: DailyLogData): string {
  const dateLabel = data.date.trim() || 'YYYY-MM-DD';
  const energyText = data.overallEnergy.trim() ? `${data.overallEnergy.trim()} / 10` : '_Not entered_';
  const lines: string[] = [
    `# Daily Practice & Progressive Tier Log — ${dateLabel}`,
    '',
    '## Daily Header & Bandwidth Check-In',
    '',
    `- **Date:** ${fieldOrBlank(data.date, 'YYYY-MM-DD')}`,
    '- **Sleep & Physical State:**',
    `  - **Hours Slept:** ${fieldOrBlank(data.hoursSlept)}`,
    `  - **Digestive Comfort:** ${fieldOrBlank(data.digestiveComfort)}`,
    `  - **Overall Energy (1–10):** ${energyText}`,
    '- **Workload Cap Today:**',
    `  - **Start Time:** ${fieldOrBlank(data.startTime)}`,
    `  - **Lunch Start Time:** ${fieldOrBlank(data.lunchStartTime)}`,
    `  - **Lunch End Time:** ${fieldOrBlank(data.lunchEndTime)}`,
    `  - **Hard Stop Time:** ${fieldOrBlank(data.hardStopTime)}`,
    `  - **Exercise Time:** ${fieldOrBlank(data.exerciseTime)}`,
    '',
    '## Part A: Morning Micro-Routine Intentions & Boundaries',
    '',
    `1. **Primary Micro-Skill Focus Today:** ${fieldOrBlank(data.primaryMicroSkillFocus)}`,
    `2. **Specific Target Interaction:** ${fieldOrBlank(data.specificTargetInteraction)}`,
    '3. **Boundaries to Maintain Today:**',
    `   - [${data.boundaries.digitalTexting ? 'x' : ' '}] **Digital / Texting Boundary:** Keep texts strictly logistical and warm; move any sensitive or nuanced topics to voice/in-person.`,
    `   - [${data.boundaries.pacingBandwidth ? 'x' : ' '}] **Pacing / Bandwidth Boundary:** Protect meal breaks, exercise, and solo wind-down time without overcommitting.`,
    `   - [${data.boundaries.relationalSpaceChecked ? 'x' : ' '}] **Relational / Space Boundary:** ${fieldOrBlank(data.boundaries.relationalSpaceNote)}`,
    '',
    '## Part B: Daily Progressive Practice Across All Four Tiers',
    '',
  ];

  const tierConfigs: Array<{
    heading: string;
    opportunityLabel: string;
    entry: DailyLogData['tiers']['tier1'];
  }> = [
    {
      heading: '### Tier 1: Solo Rehearsal (Written or Spoken Practice)',
      opportunityLabel: 'Planned Opportunity / Exercise',
      entry: data.tiers.tier1,
    },
    {
      heading: '### Tier 2: Low-Stakes Interaction (Everyday Encounters)',
      opportunityLabel: 'Planned Opportunity',
      entry: data.tiers.tier2,
    },
    {
      heading: '### Tier 3: Trusted Circle (Friends, Family, or Colleagues)',
      opportunityLabel: 'Planned Opportunity',
      entry: data.tiers.tier3,
    },
    {
      heading: '### Tier 4: High-Stakes / Friction (Feedback, Disagreement, or Emotional Activation)',
      opportunityLabel: 'Planned or Unplanned Opportunity',
      entry: data.tiers.tier4,
    },
  ];

  for (const tier of tierConfigs) {
    lines.push(
      tier.heading,
      '',
      `- **${tier.opportunityLabel}:** ${fieldOrBlank(tier.entry.plannedOpportunity)}`,
      `- **Target Micro-Skill:** ${fieldOrBlank(tier.entry.targetMicroSkill)}`,
      `- **Desired Outcome / Goal:** ${fieldOrBlank(tier.entry.desiredOutcome)}`,
      `- **Post-Interaction Reflection & Outcome Evaluation:** ${fieldOrBlank(tier.entry.postReflection)}`,
      ''
    );
  }

  lines.push(
    '## Part C: Evening Debrief — 5 Areas of Unhelpful Thinking',
    '',
    `- **1. The Trigger (Pure Observation — what happened?):** ${fieldOrBlank(data.eveningDebrief.trigger)}`,
    `- **2. My Thoughts (What story or evaluation did my mind create?):** ${fieldOrBlank(data.eveningDebrief.thoughts)}`,
    `- **3. My Emotions (What feelings came up underneath?):** ${fieldOrBlank(data.eveningDebrief.emotions)}`,
    `- **4. Physical Sensations (Where did I feel it in my body?):** ${fieldOrBlank(data.eveningDebrief.physicalSensations)}`,
    `- **5. My Behavior & Constructive Alternative (How did I respond, and what unmet need was I trying to meet?):** ${fieldOrBlank(data.eveningDebrief.behaviorAndAlternative)}`,
    `- **One Quiet Win From Today:** ${fieldOrBlank(data.eveningDebrief.quietWin)}`,
    ''
  );

  return lines.join('\n');
}

export function formatWeeklyCalibrationToMarkdown(data: WeeklyCalibrationData): string {
  const weekLabel = data.weekOf.trim() || 'YYYY-MM-DD';
  const tierRows = [
    { label: '**Tier 1: Solo**', entry: data.tiers.tier1 },
    { label: '**Tier 2: Low-Stakes**', entry: data.tiers.tier2 },
    { label: '**Tier 3: Trusted Circle**', entry: data.tiers.tier3 },
    { label: '**Tier 4: High-Stakes**', entry: data.tiers.tier4 },
  ].map(({ label, entry }) => {
    const plan = escapeTableCell(fieldOrBlank(entry.plannedOpportunities));
    const skillGoal = `**Skill:** ${escapeTableCell(fieldOrBlank(entry.targetSkill))}<br />**Goal:** ${escapeTableCell(fieldOrBlank(entry.desiredGoal))}`;
    const outcome = escapeTableCell(fieldOrBlank(entry.outcomeAchieved));
    const reflection = escapeTableCell(fieldOrBlank(entry.reflection));
    return `| ${label} | ${plan} | ${skillGoal} | **Outcome Achieved?** ${outcome}<br />**Reflection:** ${reflection} |`;
  });

  const lines: string[] = [
    `# Weekly Practice & Calibration — Week Of ${weekLabel}`,
    '',
    '## Weekly Header',
    '',
    `- **Week Of:** ${fieldOrBlank(data.weekOf, 'YYYY-MM-DD')}`,
    `- **Primary Weekly Micro-Skill Theme:** ${fieldOrBlank(data.primaryWeeklyTheme)}`,
    '',
    '## Part A: Weekly Progressive Practice Opportunity Map & Completion Log',
    '',
    '| Tier | Planned Weekly Opportunities | Target Micro-Skill & Desired Goal | Post-Interaction Reflection & Goal Achievement Evaluation |',
    '| --- | --- | --- | --- |',
    ...tierRows,
    '',
    '## Part B: Weekly Trigger & Bandwidth Audit',
    '',
    `1. **Recurring Triggers:** ${fieldOrBlank(data.audit.recurringTriggers)}`,
    `2. **Somatic & Bandwidth Correlation:** ${fieldOrBlank(data.audit.somaticBandwidthCorrelation)}`,
    `3. **Unspoken Discomforts Check:** ${fieldOrBlank(data.audit.unspokenDiscomforts)}`,
    '',
    '## Part C: The Weekly Script "Redo"',
    '',
    `- **Context:** ${fieldOrBlank(data.redo.context)}`,
    `- **What I Actually Said or Did:** ${fieldOrBlank(data.redo.actualResponse)}`,
    '- **Constructive "Redo" Script:**',
    `  - **1. Observation** *(When I saw/heard...)*: ${fieldOrBlank(data.redo.observation)}`,
    `  - **2. Feeling** *(I felt...)*: ${fieldOrBlank(data.redo.feeling)}`,
    `  - **3. Need** *(because I value/need...)*: ${fieldOrBlank(data.redo.need)}`,
    `  - **4. Request** *(Would you be willing to...?)*: ${fieldOrBlank(data.redo.request)}`,
    '',
    '## Part D: Weekly Evaluation Without Shame',
    '',
    '1. **Three Moments of Steadiness:**',
    `   - 1. ${fieldOrBlank(data.evaluation.steadinessMoment1)}`,
    `   - 2. ${fieldOrBlank(data.evaluation.steadinessMoment2)}`,
    `   - 3. ${fieldOrBlank(data.evaluation.steadinessMoment3)}`,
    `2. **One Concrete Adjustment for Next Week:** ${fieldOrBlank(data.evaluation.concreteAdjustment)}`,
    `3. **Self-Empathy Statement:** ${fieldOrBlank(data.evaluation.selfEmpathyStatement)}`,
    '',
  ];

  return lines.join('\n');
}

export function calculateDailyProgress(data: DailyLogData): {
  completedFields: number;
  totalFields: number;
} {
  const stringFields = [
    data.hoursSlept,
    data.digestiveComfort,
    data.overallEnergy,
    data.startTime,
    data.lunchStartTime,
    data.lunchEndTime,
    data.hardStopTime,
    data.exerciseTime,
    data.primaryMicroSkillFocus,
    data.specificTargetInteraction,
    data.tiers.tier1.plannedOpportunity,
    data.tiers.tier1.postReflection,
    data.tiers.tier2.plannedOpportunity,
    data.tiers.tier2.postReflection,
    data.tiers.tier3.plannedOpportunity,
    data.tiers.tier3.postReflection,
    data.tiers.tier4.plannedOpportunity,
    data.tiers.tier4.postReflection,
    data.eveningDebrief.trigger,
    data.eveningDebrief.thoughts,
    data.eveningDebrief.emotions,
    data.eveningDebrief.physicalSensations,
    data.eveningDebrief.behaviorAndAlternative,
    data.eveningDebrief.quietWin,
  ];
  const completedStrings = stringFields.filter((v) => v.trim().length > 0).length;
  const anyBoundary =
    data.boundaries.digitalTexting ||
    data.boundaries.pacingBandwidth ||
    data.boundaries.relationalSpaceChecked ||
    data.boundaries.relationalSpaceNote.trim().length > 0;

  return {
    completedFields: completedStrings + (anyBoundary ? 1 : 0),
    totalFields: stringFields.length + 1,
  };
}

export function calculateWeeklyProgress(data: WeeklyCalibrationData): {
  completedFields: number;
  totalFields: number;
} {
  const stringFields = [
    data.primaryWeeklyTheme,
    data.tiers.tier1.plannedOpportunities,
    data.tiers.tier1.reflection,
    data.tiers.tier2.plannedOpportunities,
    data.tiers.tier2.reflection,
    data.tiers.tier3.plannedOpportunities,
    data.tiers.tier3.reflection,
    data.tiers.tier4.plannedOpportunities,
    data.tiers.tier4.reflection,
    data.audit.recurringTriggers,
    data.audit.somaticBandwidthCorrelation,
    data.audit.unspokenDiscomforts,
    data.redo.context,
    data.redo.actualResponse,
    data.redo.observation,
    data.redo.feeling,
    data.redo.need,
    data.redo.request,
    data.evaluation.steadinessMoment1,
    data.evaluation.steadinessMoment2,
    data.evaluation.steadinessMoment3,
    data.evaluation.concreteAdjustment,
    data.evaluation.selfEmpathyStatement,
  ];
  return {
    completedFields: stringFields.filter((v) => v.trim().length > 0).length,
    totalFields: stringFields.length,
  };
}

export function downloadMarkdownFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
