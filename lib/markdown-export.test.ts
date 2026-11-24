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
