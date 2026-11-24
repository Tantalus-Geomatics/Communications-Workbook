import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDefaultDailyLog,
  createDefaultWeeklyCalibration,
  normalizeDailyLog,
  normalizeWeeklyCalibration,
} from './workbook-types';
import {
  formatDailyLogToMarkdown,
  formatWeeklyCalibrationToMarkdown,
  calculateDailyProgress,
  calculateWeeklyProgress,
} from './markdown-export';
import {
  MarkdownImportError,
  parseDailyLogFromMarkdown,
  parseWeeklyCalibrationFromMarkdown,
  parseWorkbookMarkdown,
} from './markdown-import';

test('formatDailyLogToMarkdown renders split physical/schedule fields and checkboxes cleanly', () => {
  const daily = createDefaultDailyLog('2026-11-22');
  daily.hoursSlept = '7.5';
  daily.digestiveComfort = 'Calm, settled after breakfast';
  daily.overallEnergy = '8';
  daily.startTime = '08:00';
  daily.lunchStartTime = '12:00';
  daily.lunchEndTime = '12:45';
  daily.hardStopTime = '17:30';
  daily.exerciseTime = '18:00';
  daily.primaryMicroSkillFocus = 'Somatic & Tone Catching';
  daily.specificTargetInteraction = 'Afternoon project alignment call';
  daily.boundaries.digitalTexting = true;
  daily.boundaries.relationalSpaceChecked = true;
  daily.boundaries.relationalSpaceNote = 'Pause 5 seconds before replying to urgent texts';
  daily.tiers.tier1.plannedOpportunity = 'Rehearse validation phrase aloud';
  daily.tiers.tier1.targetMicroSkill = 'Somatic & Tone Catching';
  daily.tiers.tier1.postReflection = 'Felt steadier in my shoulders';
  daily.eveningDebrief.quietWin = 'Paused before replying to a blunt email';

  const md = formatDailyLogToMarkdown(daily);

  assert.match(md, /# Daily Practice & Progressive Tier Log — 2026-11-22/);
  assert.match(md, /\*\*Hours Slept:\*\* 7\.5/);
  assert.match(md, /\*\*Digestive Comfort:\*\* Calm, settled after breakfast/);
  assert.match(md, /\*\*Overall Energy \(1–10\):\*\* 8 \/ 10/);
  assert.match(md, /\*\*Start Time:\*\* 08:00/);
  assert.match(md, /\*\*Lunch Start Time:\*\* 12:00/);
  assert.match(md, /\*\*Lunch End Time:\*\* 12:45/);
  assert.match(md, /\*\*Hard Stop Time:\*\* 17:30/);
  assert.match(md, /\*\*Exercise Time:\*\* 18:00/);
  assert.match(md, /\*\*Primary Micro-Skill Focus Today:\*\* Somatic & Tone Catching/);
  assert.match(md, /- \[x\] \*\*Digital \/ Texting Boundary:\*\*/);
  assert.match(md, /- \[ \] \*\*Pacing \/ Bandwidth Boundary:\*\*/);
  assert.match(md, /- \[x\] \*\*Relational \/ Space Boundary:\*\* Pause 5 seconds/);
  assert.match(md, /\*\*One Quiet Win From Today:\*\* Paused before replying/);
});

test('formatWeeklyCalibrationToMarkdown escapes pipes/newlines in table cells and formats NVC redo', () => {
  const weekly = createDefaultWeeklyCalibration('2026-11-22');
  weekly.primaryWeeklyTheme = 'Empathy Before Education';
  weekly.tiers.tier3.plannedOpportunities = 'Line 1\nLine 2 | pipe';
  weekly.tiers.tier3.targetSkill = 'Empathy Before Education';
  weekly.tiers.tier3.outcomeAchieved = 'Yes';
  weekly.tiers.tier3.reflection = 'Waited for the exhale before explaining.';
  weekly.redo.observation = 'When you interrupted mid-sentence';
  weekly.redo.feeling = 'I felt discouraged';
  weekly.redo.need = 'because I value mutual respect';
  weekly.redo.request = 'Would you be willing to let me finish my thought?';

  const md = formatWeeklyCalibrationToMarkdown(weekly);

  assert.match(md, /# Weekly Practice & Calibration — Week Of 2026-11-22/);
  assert.match(md, /Line 1<br \/>Line 2 \\\| pipe/);
  assert.match(md, /\*\*Skill:\*\* Empathy Before Education/);
  assert.match(md, /\*\*Outcome Achieved\?\*\* Yes/);
  assert.match(md, /\*\*1\. Observation\*\* \*\(When I saw\/heard\.\.\.\)\*: When you interrupted/);
  assert.match(md, /\*\*4\. Request\*\* \*\(Would you be willing to\.\.\.\?\)\*: Would you be willing/);
});

test('progress calculators count populated fields accurately without crashing on empty states', () => {
  const emptyDaily = createDefaultDailyLog('2026-11-22');
  assert.equal(calculateDailyProgress(emptyDaily).completedFields, 0);

  emptyDaily.hoursSlept = '8';
  emptyDaily.boundaries.digitalTexting = true;
  assert.equal(calculateDailyProgress(emptyDaily).completedFields, 2);

  const emptyWeekly = createDefaultWeeklyCalibration('2026-11-22');
  assert.equal(calculateWeeklyProgress(emptyWeekly).completedFields, 0);

  emptyWeekly.primaryWeeklyTheme = 'Somatic & Tone Catching';
  emptyWeekly.evaluation.selfEmpathyStatement = 'Honoring calm connection';
  assert.equal(calculateWeeklyProgress(emptyWeekly).completedFields, 2);
});

test('normalizers migrate legacy or partial objects safely without invalid skill strings', () => {
  const legacyDaily = normalizeDailyLog({
    date: '2026-11-20',
    tiers: {
      tier1: {
        plannedOpportunity: 'Legacy plan',
        targetMicroSkill: 'Not A Valid Skill' as unknown as '',
        desiredOutcome: '',
        postReflection: '',
      },
      tier2: { plannedOpportunity: '', targetMicroSkill: 'Empathy Before Education', desiredOutcome: '', postReflection: '' },
      tier3: { plannedOpportunity: '', targetMicroSkill: '', desiredOutcome: '', postReflection: '' },
      tier4: { plannedOpportunity: '', targetMicroSkill: '', desiredOutcome: '', postReflection: '' },
    },
  });

  assert.equal(legacyDaily.date, '2026-11-20');
  assert.equal(legacyDaily.hoursSlept, '');
  assert.equal(legacyDaily.tiers.tier1.targetMicroSkill, '');
  assert.equal(legacyDaily.tiers.tier2.targetMicroSkill, 'Empathy Before Education');

  const legacyWeekly = normalizeWeeklyCalibration({
    weekOf: '2026-11-16',
    primaryWeeklyTheme: 'Bad Theme' as unknown as '',
  });
  assert.equal(legacyWeekly.weekOf, '2026-11-16');
  assert.equal(legacyWeekly.primaryWeeklyTheme, '');
});

test('parseDailyLogFromMarkdown performs lossless round-trip including multiline text', () => {
  const original = createDefaultDailyLog('2026-11-24');
  original.hoursSlept = '7.5';
  original.digestiveComfort = 'Calm morning\nLight tension after lunch';
  original.overallEnergy = '7';
  original.startTime = '08:30';
  original.lunchStartTime = '12:15';
  original.lunchEndTime = '13:00';
  original.hardStopTime = '17:30';
  original.exerciseTime = '18:15';
  original.primaryMicroSkillFocus = 'Observation Without Evaluation';
  original.specificTargetInteraction = 'Weekly budget review\nWith project lead';
  original.boundaries.digitalTexting = true;
  original.boundaries.pacingBandwidth = true;
  original.boundaries.relationalSpaceChecked = false;
  original.boundaries.relationalSpaceNote = 'Pause before replying to Slack threads';
  original.tiers.tier1.plannedOpportunity = 'Script opening line\nRead aloud twice';
  original.tiers.tier1.targetMicroSkill = 'Somatic & Tone Catching';
  original.tiers.tier1.desiredOutcome = 'Steady vocal pace';
  original.tiers.tier1.postReflection = 'Breath felt grounded';
  original.tiers.tier4.plannedOpportunity = 'Client scope boundary';
  original.tiers.tier4.targetMicroSkill = 'Early Vulnerable Expression';
  original.tiers.tier4.desiredOutcome = 'Agree on Friday deadline';
  original.tiers.tier4.postReflection = 'Held boundary calmly';
  original.eveningDebrief.trigger = 'Client asked for same-day change';
  original.eveningDebrief.thoughts = 'They do not respect my schedule';
  original.eveningDebrief.emotions = 'Anxious, tense';
  original.eveningDebrief.physicalSensations = 'Tight jaw and shoulders';
  original.eveningDebrief.behaviorAndAlternative =
    'Paused 5 seconds.\nOffered tomorrow at 10 AM instead.';
  original.eveningDebrief.quietWin = 'Did not fire off a defensive reply';

  const md = formatDailyLogToMarkdown(original);
  const parsed = parseDailyLogFromMarkdown(md);

  assert.deepEqual(parsed, original);
});

test('parseWeeklyCalibrationFromMarkdown performs lossless round-trip including escaped pipes and multiline fields', () => {
  const original = createDefaultWeeklyCalibration('2026-11-22');
  original.primaryWeeklyTheme = 'Empathy Before Education';
  original.tiers.tier1.plannedOpportunities = 'Complete 3 trigger logs\nReview notes | Sunday';
  original.tiers.tier1.targetSkill = 'Somatic & Tone Catching';
  original.tiers.tier1.desiredGoal = 'Catch jaw tension\nBefore speaking';
  original.tiers.tier1.outcomeAchieved = 'Yes';
  original.tiers.tier1.reflection = 'Caught tension early | twice';
  original.tiers.tier3.plannedOpportunities = 'Listen first with partner';
  original.tiers.tier3.targetSkill = 'Empathy Before Education';
  original.tiers.tier3.desiredGoal = 'Wait for exhale';
  original.tiers.tier3.outcomeAchieved = 'Partial';
  original.tiers.tier3.reflection = 'Interrupted once, then paused';
  original.audit.recurringTriggers = 'Late afternoon fatigue\nLast-minute schedule shifts';
  original.audit.somaticBandwidthCorrelation = 'Lower patience when lunch was delayed';
  original.audit.unspokenDiscomforts = 'Need clearer handoff expectations';
  original.redo.context = 'Thursday afternoon status call';
  original.redo.actualResponse = 'Spoke quickly and defended the timeline';
  original.redo.observation = 'When you asked why the report was still pending';
  original.redo.feeling = 'I felt overwhelmed and tense';
  original.redo.need = 'because I need clarity and realistic pacing';
  original.redo.request = 'Would you be willing to review priorities together?';
  original.evaluation.steadinessMoment1 = 'Paused 5 seconds before replying to email';
  original.evaluation.steadinessMoment2 = 'Took full 45-minute lunch walk';
  original.evaluation.steadinessMoment3 = 'Validated teammate stress before problem-solving';
  original.evaluation.concreteAdjustment = 'Block 15-minute buffer before 4 PM calls';
  original.evaluation.selfEmpathyStatement = 'Honoring steadiness\nAnd sustainable care';

  const md = formatWeeklyCalibrationToMarkdown(original);
  const parsed = parseWeeklyCalibrationFromMarkdown(md);

  assert.deepEqual(parsed, original);
});

test('parseWorkbookMarkdown auto-detects daily vs weekly and throws MarkdownImportError on unrecognized files', () => {
  const dailyMd = formatDailyLogToMarkdown(createDefaultDailyLog('2026-11-24'));
  const weeklyMd = formatWeeklyCalibrationToMarkdown(createDefaultWeeklyCalibration('2026-11-22'));

  assert.equal(parseWorkbookMarkdown(dailyMd).kind, 'daily');
  assert.equal(parseWorkbookMarkdown(weeklyMd).kind, 'weekly');

  assert.throws(
    () => parseWorkbookMarkdown('# Random Notes\n\nJust some unrelated text.'),
    MarkdownImportError
  );
});
