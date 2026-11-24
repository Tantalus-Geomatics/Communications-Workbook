'use client';

import React, { useState } from 'react';
import {
  FileDown,
  Printer,
  RotateCcw,
  BookMarked,
  Check,
  AlertCircle,
} from 'lucide-react';
import type {
  MicroSkillName,
  OutcomeStatus,
  WeeklyCalibrationData,
  WeeklyTierEntry,
} from '@/lib/workbook-types';
import { CORE_MICRO_SKILLS, PRACTICE_TIERS } from '@/lib/workbook-data';
import {
  calculateWeeklyProgress,
  downloadMarkdownFile,
  formatWeeklyCalibrationToMarkdown,
} from '@/lib/markdown-export';

interface WeeklyCalibrationFormProps {
  data: WeeklyCalibrationData;
  onChange: (
    updater: (prev: WeeklyCalibrationData) => WeeklyCalibrationData
  ) => void;
  onClear: () => void;
  isHydrated: boolean;
  desktopRefOpen: boolean;
  mobileRefOpen: boolean;
  onToggleDesktopRef: () => void;
  onToggleMobileRef: () => void;
}

const MICRO_SKILL_OPTIONS: MicroSkillName[] = CORE_MICRO_SKILLS.map((s) => s.name);

const inputBaseClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-[#64748B] transition-colors focus:border-[#1D5C59] focus:outline-none focus:ring-2 focus:ring-[#1D5C59]/20';

const resizableTextareaClass = `${inputBaseClass} print:hidden resize-y min-h-[44px] leading-relaxed`;

export default function WeeklyCalibrationForm({
  data,
  onChange,
  onClear,
  isHydrated,
  desktopRefOpen,
  mobileRefOpen,
  onToggleDesktopRef,
  onToggleMobileRef,
}: WeeklyCalibrationFormProps) {
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const progress = calculateWeeklyProgress(data);

  const updateTier = (
    tierKey: keyof WeeklyCalibrationData['tiers'],
    field: keyof WeeklyTierEntry,
    value: string
  ) => {
    onChange((prev) => ({
      ...prev,
      tiers: {
        ...prev.tiers,
        [tierKey]: {
          ...prev.tiers[tierKey],
          [field]: value,
        },
      },
    }));
  };

  const handleDownloadMarkdown = () => {
    const markdown = formatWeeklyCalibrationToMarkdown(data);
    const weekSlug = data.weekOf.trim() || 'undated';
    downloadMarkdownFile(`weekly-calibration-${weekSlug}.md`, markdown);
    setExportNotice('Markdown exported');
    window.setTimeout(() => setExportNotice(null), 2500);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleConfirmClear = () => {
    onClear();
    setConfirmingClear(false);
  };

  return (
    <div className="print-container max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Page Header & Action Bar */}
      <header className="space-y-4 border-b border-[#CBD5E1] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569]">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-semibold text-[#1D5C59]">Section 3</span>
            <span aria-hidden="true">·</span>
            <span>Weekly Practice &amp; Calibration</span>
          </div>
          <div className="no-print flex items-center gap-3 font-mono tabular-nums">
            <span className="font-medium text-[#334155]">
              {progress.completedFields}/{progress.totalFields} fields logged
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#1D5C59]">
              {isHydrated ? 'Auto-saved locally' : 'Loading saved log'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              Weekly Calibration &amp; Tier Map
            </h2>
            <p className="text-sm leading-relaxed text-[#334155] max-w-2xl">
              Spend <strong className="font-semibold text-[#0F172A]">20 minutes every Sunday</strong>{' '}
              mapping weekly tier opportunities, auditing physical and schedule triggers,
              scripting one conversation redo, and reviewing growth{' '}
              <em>without shame.</em>
            </p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleDesktopRef}
              aria-expanded={desktopRefOpen}
              className={`hidden xl:inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5C59] ${
                desktopRefOpen
                  ? 'border-[#1D5C59] bg-[#E8F3F2] text-[#134E4A]'
                  : 'border-[#CBD5E1] bg-white text-[#1E293B] hover:bg-[#F1F5F9]'
              }`}
            >
              <BookMarked className="h-3.5 w-3.5" />
              <span>{desktopRefOpen ? 'Hide Quick Reference' : 'Quick Reference'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleMobileRef}
              aria-expanded={mobileRefOpen}
              className={`xl:hidden inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5C59] ${
                mobileRefOpen
                  ? 'border-[#1D5C59] bg-[#E8F3F2] text-[#134E4A]'
                  : 'border-[#CBD5E1] bg-white text-[#1E293B] hover:bg-[#F1F5F9]'
              }`}
            >
              <BookMarked className="h-3.5 w-3.5" />
              <span>{mobileRefOpen ? 'Hide Quick Reference' : 'Quick Reference'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5C59]"
            >
              {exportNotice ? (
                <Check className="h-3.5 w-3.5 text-[#1D5C59]" />
              ) : (
                <FileDown className="h-3.5 w-3.5 text-[#334155]" />
              )}
              <span>{exportNotice ?? 'Download as Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D5C59] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#164745] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5C59]"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Download as PDF</span>
            </button>

            {!confirmingClear ? (
              <button
                type="button"
                onClick={() => setConfirmingClear(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs font-semibold text-[#475569] hover:border-[#C9A39A] hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5C59]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Clear Form</span>
              </button>
            ) : (
              <div
                role="group"
                aria-label="Confirm clearing weekly form"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2C2BA] bg-[#FDF6F4] px-2.5 py-1.5"
              >
                <AlertCircle className="h-3.5 w-3.5 text-[#9A3412] shrink-0" />
                <span className="text-xs font-medium text-[#7C2D12] whitespace-nowrap">
                  Reset week?
                </span>
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="rounded px-2 py-0.5 text-xs font-semibold bg-[#9A3412] text-white hover:bg-[#7C2D12] whitespace-nowrap"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingClear(false)}
                  className="rounded px-2 py-0.5 text-xs font-medium text-[#334155] hover:bg-white whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Weekly Header */}
        <section
          aria-labelledby="weekly-header-heading"
          className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-4"
        >
          <h3 id="weekly-header-heading" className="text-lg font-bold text-[#0F172A]">
            Weekly Header
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                htmlFor="weekly-week-of"
                className="block text-xs font-bold text-[#1E293B]"
              >
                Week Of
              </label>
              <input
                id="weekly-week-of"
                type="date"
                value={data.weekOf}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, weekOf: e.target.value }))
                }
                className={`${inputBaseClass} font-mono tabular-nums`}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="weekly-primary-theme"
                className="block text-xs font-bold text-[#1E293B]"
              >
                Primary Weekly Micro-Skill Theme
              </label>
              <select
                id="weekly-primary-theme"
                value={data.primaryWeeklyTheme}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    primaryWeeklyTheme: e.target.value as MicroSkillName | '',
                  }))
                }
                className={inputBaseClass}
              >
                <option value="">Select primary weekly theme...</option>
                {MICRO_SKILL_OPTIONS.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Part A: Weekly Progressive Practice Opportunity Map & Completion Log */}
        <section aria-labelledby="weekly-part-a-heading" className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#1E3A5F]">
              Part A · Progressive Tier Planning
            </div>
            <h3 id="weekly-part-a-heading" className="text-lg font-bold text-[#0F172A]">
              Weekly Progressive Practice Opportunity Map &amp; Completion Log
            </h3>
            <p className="text-sm text-[#334155]">
              Map out <strong className="font-semibold text-[#0F172A]">1–3 specific practice goals</strong>{' '}
              across each tier for the upcoming week, then fill in the{' '}
              <em>post-interaction evaluation at the end of the week.</em>
            </p>
          </div>

          <div className="space-y-5">
            {PRACTICE_TIERS.map((tier) => {
              const entry = data.tiers[tier.id];
              return (
                <div
                  key={tier.id}
                  className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                    <div>
                      <h4 className="text-base font-bold text-[#0F172A]">
                        {tier.tierLabel}
                      </h4>
                      <p className="text-xs text-[#475569] mt-0.5">
                        <em>Example: {tier.weeklyExamplePlan}</em>
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#1E3A5F]">
                      {tier.environment}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label
                        htmlFor={`weekly-${tier.id}-plan`}
                        className="block text-xs font-bold text-[#1E293B]"
                      >
                        Planned Weekly Opportunities (Target 1–3)
                      </label>
                      <textarea
                        id={`weekly-${tier.id}-plan`}
                        rows={2}
                        value={entry.plannedOpportunities}
                        onChange={(e) =>
                          updateTier(tier.id, 'plannedOpportunities', e.target.value)
                        }
                        placeholder={`My plan for ${tier.shortName.toLowerCase()} practice this week...`}
                        className={resizableTextareaClass}
                      />
                      <div className="hidden print:block print-field-value text-sm">
                        {entry.plannedOpportunities || ' '}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor={`weekly-${tier.id}-skill`}
                        className="block text-xs font-bold text-[#1E293B]"
                      >
                        Target Micro-Skill
                      </label>
                      <select
                        id={`weekly-${tier.id}-skill`}
                        value={entry.targetSkill}
                        onChange={(e) =>
                          updateTier(tier.id, 'targetSkill', e.target.value)
                        }
                        className={inputBaseClass}
                      >
                        <option value="">Select primary weekly theme...</option>
                        {MICRO_SKILL_OPTIONS.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor={`weekly-${tier.id}-goal`}
                        className="block text-xs font-bold text-[#1E293B]"
                      >
                        Desired Goal
                      </label>
                      <textarea
                        id={`weekly-${tier.id}-goal`}
                        rows={2}
                        value={entry.desiredGoal}
                        onChange={(e) =>
                          updateTier(tier.id, 'desiredGoal', e.target.value)
                        }
                        placeholder="Specific measurable practice goal"
                        className={resizableTextareaClass}
                      />
                      <div className="hidden print:block print-field-value text-sm">
                        {entry.desiredGoal || ' '}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor={`weekly-${tier.id}-outcome`}
                        className="block text-xs font-bold text-[#1E293B]"
                      >
                        Outcome Achieved?
                      </label>
                      <select
                        id={`weekly-${tier.id}-outcome`}
                        value={entry.outcomeAchieved}
                        onChange={(e) =>
                          updateTier(
                            tier.id,
                            'outcomeAchieved',
                            e.target.value as OutcomeStatus
                          )
                        }
                        className={inputBaseClass}
                      >
                        <option value="">Not yet evaluated</option>
                        <option value="Yes">Yes</option>
                        <option value="Partial">Partial</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor={`weekly-${tier.id}-reflection`}
                        className="block text-xs font-bold text-[#1D5C59]"
                      >
                        Post-Interaction Reflection &amp; Why
                      </label>
                      <textarea
                        id={`weekly-${tier.id}-reflection`}
                        rows={2}
                        value={entry.reflection}
                        onChange={(e) =>
                          updateTier(tier.id, 'reflection', e.target.value)
                        }
                        placeholder="What helped or got in the way?"
                        className={resizableTextareaClass}
                      />
                      <div className="hidden print:block print-field-value text-sm">
                        {entry.reflection || ' '}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Part B: Weekly Trigger & Bandwidth Audit */}
        <section
          aria-labelledby="weekly-part-b-heading"
          className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-5"
        >
          <div className="space-y-1 border-b border-[#E2E8F0] pb-4">
            <div className="text-xs font-bold text-[#9A3412]">
              Part B · Pattern Recognition
            </div>
            <h3 id="weekly-part-b-heading" className="text-lg font-bold text-[#0F172A]">
              Weekly Trigger &amp; Bandwidth Audit
            </h3>
            <p className="text-sm text-[#334155]">
              Review your daily logs from this week to spot patterns between your{' '}
              <strong className="font-semibold text-[#0F172A]">
                physical state, schedule, and emotional reactivity
              </strong>
              .
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="audit-recurring-triggers"
                className="block text-xs font-bold text-[#1E293B]"
              >
                1. Recurring Triggers
              </label>
              <textarea
                id="audit-recurring-triggers"
                rows={2}
                value={data.audit.recurringTriggers}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    audit: { ...prev.audit, recurringTriggers: e.target.value },
                  }))
                }
                placeholder="What situations, topics, or times of day triggered defensiveness, frustration, or sadness this week?"
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.audit.recurringTriggers || ' '}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="audit-somatic-correlation"
                className="block text-xs font-bold text-[#1E293B]"
              >
                2. Somatic &amp; Bandwidth Correlation
              </label>
              <textarea
                id="audit-somatic-correlation"
                rows={2}
                value={data.audit.somaticBandwidthCorrelation}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    audit: {
                      ...prev.audit,
                      somaticBandwidthCorrelation: e.target.value,
                    },
                  }))
                }
                placeholder="How did sleep, meals, digestive comfort, or work over-commitment affect my patience and tone this week?"
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.audit.somaticBandwidthCorrelation || ' '}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="audit-unspoken-discomforts"
                className="block text-xs font-bold text-[#1E293B]"
              >
                3. Unspoken Discomforts Check
              </label>
              <textarea
                id="audit-unspoken-discomforts"
                rows={2}
                value={data.audit.unspokenDiscomforts}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    audit: { ...prev.audit, unspokenDiscomforts: e.target.value },
                  }))
                }
                placeholder="Did I swallow any small annoyance or insecurity this week that I need to voice calmly next week?"
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.audit.unspokenDiscomforts || ' '}
              </div>
            </div>
          </div>
        </section>

        {/* Part C: The Weekly Script "Redo" */}
        <section
          aria-labelledby="weekly-part-c-heading"
          className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-5"
        >
          <div className="space-y-1 border-b border-[#E2E8F0] pb-4">
            <div className="text-xs font-bold text-[#1E3A5F]">
              Part C · NVC Rehearsal
            </div>
            <h3 id="weekly-part-c-heading" className="text-lg font-bold text-[#0F172A]">
              The Weekly Script &ldquo;Redo&rdquo;
            </h3>
            <p className="text-sm text-[#334155]">
              Choose the single most challenging or unsatisfying interaction from
              your week and rewrite how you would approach it using{' '}
              <strong className="font-semibold text-[#1E3A5F]">
                Nonviolent Communication
              </strong>
              .
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="redo-context"
                className="block text-xs font-bold text-[#1E293B]"
              >
                Context (<em>Briefly describe the situation</em>)
              </label>
              <textarea
                id="redo-context"
                rows={2}
                value={data.redo.context}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    redo: { ...prev.redo, context: e.target.value },
                  }))
                }
                placeholder="Who was involved, when did it happen, and what was the setting?"
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.redo.context || ' '}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="redo-actual"
                className="block text-xs font-bold text-[#9A3412]"
              >
                What I Actually Said or Did
              </label>
              <textarea
                id="redo-actual"
                rows={2}
                value={data.redo.actualResponse}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    redo: { ...prev.redo, actualResponse: e.target.value },
                  }))
                }
                placeholder="Write down your reactive words, tone, or withdrawal honestly without judgment."
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.redo.actualResponse || ' '}
              </div>
            </div>

            <div className="rounded-lg bg-[#EFF4FA] border border-[#C7D7EA] p-5 space-y-4">
              <p className="text-xs font-bold text-[#1E3A5F]">
                Constructive &ldquo;Redo&rdquo; Script (<em>4-Part NVC Formula</em>)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="redo-observation"
                    className="block text-xs font-bold text-[#1E293B]"
                  >
                    1. Observation (<em>When I saw/heard...</em>)
                  </label>
                  <textarea
                    id="redo-observation"
                    rows={2}
                    value={data.redo.observation}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        redo: { ...prev.redo, observation: e.target.value },
                      }))
                    }
                    placeholder="Pure video-camera facts without labels"
                    className={resizableTextareaClass}
                  />
                  <div className="hidden print:block print-field-value text-sm">
                    {data.redo.observation || ' '}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="redo-feeling"
                    className="block text-xs font-bold text-[#1E293B]"
                  >
                    2. Feeling (<em>I felt...</em>)
                  </label>
                  <textarea
                    id="redo-feeling"
                    rows={2}
                    value={data.redo.feeling}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        redo: { ...prev.redo, feeling: e.target.value },
                      }))
                    }
                    placeholder="Specific emotion (e.g., anxious, unheard, unsettled)"
                    className={resizableTextareaClass}
                  />
                  <div className="hidden print:block print-field-value text-sm">
                    {data.redo.feeling || ' '}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="redo-need"
                    className="block text-xs font-bold text-[#1E293B]"
                  >
                    3. Need (<em>because I value/need...</em>)
                  </label>
                  <textarea
                    id="redo-need"
                    rows={2}
                    value={data.redo.need}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        redo: { ...prev.redo, need: e.target.value },
                      }))
                    }
                    placeholder="Core human value or need (e.g., clarity, ease, mutual respect)"
                    className={resizableTextareaClass}
                  />
                  <div className="hidden print:block print-field-value text-sm">
                    {data.redo.need || ' '}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="redo-request"
                    className="block text-xs font-bold text-[#1E293B]"
                  >
                    4. Request (<em>Would you be willing to...?</em>)
                  </label>
                  <textarea
                    id="redo-request"
                    rows={2}
                    value={data.redo.request}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        redo: { ...prev.redo, request: e.target.value },
                      }))
                    }
                    placeholder="Concrete, doable request where 'no' is safe"
                    className={resizableTextareaClass}
                  />
                  <div className="hidden print:block print-field-value text-sm">
                    {data.redo.request || ' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Part D: Weekly Evaluation Without Shame */}
        <section
          aria-labelledby="weekly-part-d-heading"
          className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-5"
        >
          <div className="space-y-1 border-b border-[#E2E8F0] pb-4">
            <div className="text-xs font-bold text-[#1D5C59]">
              Part D · Compassionate Calibration
            </div>
            <h3 id="weekly-part-d-heading" className="text-lg font-bold text-[#0F172A]">
              Weekly Evaluation Without Shame
            </h3>
            <p className="text-sm text-[#334155]">
              Review your week with the same{' '}
              <strong className="font-semibold text-[#134E4A]">
                warmth, patience, and objectivity
              </strong>{' '}
              you would offer a close friend.{' '}
              <em>Actively catch any slide into harsh self-criticism.</em>
            </p>
          </div>

          <div className="space-y-4">
            <fieldset className="space-y-3">
              <legend className="text-xs font-bold text-[#1E293B]">
                1. Three Moments of Steadiness (<em>Where did I honor a boundary, pause before reacting, or show genuine empathy this week?</em>)
              </legend>

              <div className="grid grid-cols-1 gap-3 pt-1">
                <div className="flex items-start gap-3">
                  <label
                    htmlFor="steadiness-1"
                    className="font-mono text-xs font-bold text-[#1D5C59] w-5 shrink-0 pt-2.5"
                  >
                    1.
                  </label>
                  <div className="flex-1 min-w-0">
                    <textarea
                      id="steadiness-1"
                      rows={2}
                      value={data.evaluation.steadinessMoment1}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          evaluation: {
                            ...prev.evaluation,
                            steadinessMoment1: e.target.value,
                          },
                        }))
                      }
                      placeholder="First moment of steadiness or self-awareness"
                      className={resizableTextareaClass}
                    />
                    <div className="hidden print:block print-field-value text-sm">
                      {data.evaluation.steadinessMoment1 || ' '}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <label
                    htmlFor="steadiness-2"
                    className="font-mono text-xs font-bold text-[#1D5C59] w-5 shrink-0 pt-2.5"
                  >
                    2.
                  </label>
                  <div className="flex-1 min-w-0">
                    <textarea
                      id="steadiness-2"
                      rows={2}
                      value={data.evaluation.steadinessMoment2}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          evaluation: {
                            ...prev.evaluation,
                            steadinessMoment2: e.target.value,
                          },
                        }))
                      }
                      placeholder="Second moment of steadiness or boundary care"
                      className={resizableTextareaClass}
                    />
                    <div className="hidden print:block print-field-value text-sm">
                      {data.evaluation.steadinessMoment2 || ' '}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <label
                    htmlFor="steadiness-3"
                    className="font-mono text-xs font-bold text-[#1D5C59] w-5 shrink-0 pt-2.5"
                  >
                    3.
                  </label>
                  <div className="flex-1 min-w-0">
                    <textarea
                      id="steadiness-3"
                      rows={2}
                      value={data.evaluation.steadinessMoment3}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          evaluation: {
                            ...prev.evaluation,
                            steadinessMoment3: e.target.value,
                          },
                        }))
                      }
                      placeholder="Third moment of steadiness or empathy"
                      className={resizableTextareaClass}
                    />
                    <div className="hidden print:block print-field-value text-sm">
                      {data.evaluation.steadinessMoment3 || ' '}
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            <div className="space-y-1.5">
              <label
                htmlFor="evaluation-adjustment"
                className="block text-xs font-bold text-[#1E293B]"
              >
                2. One Concrete Adjustment for Next Week
              </label>
              <textarea
                id="evaluation-adjustment"
                rows={2}
                value={data.evaluation.concreteAdjustment}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    evaluation: {
                      ...prev.evaluation,
                      concreteAdjustment: e.target.value,
                    },
                  }))
                }
                placeholder="Pick one small, realistic tweak to your schedule, boundaries, or practice routine"
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.evaluation.concreteAdjustment || ' '}
              </div>
            </div>

            <div className="space-y-1.5 rounded-lg bg-[#F1F8F7] border border-[#D3E5E3] p-4">
              <label
                htmlFor="evaluation-self-empathy"
                className="block text-xs font-bold text-[#134E4A]"
              >
                3. Self-Empathy Statement
              </label>
              <textarea
                id="evaluation-self-empathy"
                rows={2}
                value={data.evaluation.selfEmpathyStatement}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    evaluation: {
                      ...prev.evaluation,
                      selfEmpathyStatement: e.target.value,
                    },
                  }))
                }
                placeholder="Remind yourself of the core needs you are honoring through this practice"
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.evaluation.selfEmpathyStatement || ' '}
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
