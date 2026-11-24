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
  DailyLogData,
  DailyTierEntry,
  MicroSkillName,
} from '@/lib/workbook-types';
import { CORE_MICRO_SKILLS, PRACTICE_TIERS } from '@/lib/workbook-data';
import {
  calculateDailyProgress,
  downloadMarkdownFile,
  formatDailyLogToMarkdown,
} from '@/lib/markdown-export';

interface DailyPracticeFormProps {
  data: DailyLogData;
  onChange: (updater: (prev: DailyLogData) => DailyLogData) => void;
  onClear: () => void;
  isHydrated: boolean;
  desktopRefOpen: boolean;
  mobileRefOpen: boolean;
  onToggleDesktopRef: () => void;
  onToggleMobileRef: () => void;
}

const MICRO_SKILL_OPTIONS: MicroSkillName[] = CORE_MICRO_SKILLS.map((s) => s.name);

const ENERGY_OPTIONS = [
  { value: '1', label: '1 — Depleted' },
  { value: '2', label: '2 — Very Low' },
  { value: '3', label: '3 — Low' },
  { value: '4', label: '4 — Subdued' },
  { value: '5', label: '5 — Moderate' },
  { value: '6', label: '6 — Steady' },
  { value: '7', label: '7 — Good' },
  { value: '8', label: '8 — Strong' },
  { value: '9', label: '9 — Energized' },
  { value: '10', label: '10 — Restored' },
];

const inputBaseClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-[#64748B] transition-colors focus:border-[#1D5C59] focus:outline-none focus:ring-2 focus:ring-[#1D5C59]/20';

const resizableTextareaClass = `${inputBaseClass} print:hidden resize-y min-h-[44px] leading-relaxed`;

export default function DailyPracticeForm({
  data,
  onChange,
  onClear,
  isHydrated,
  desktopRefOpen,
  mobileRefOpen,
  onToggleDesktopRef,
  onToggleMobileRef,
}: DailyPracticeFormProps) {
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const progress = calculateDailyProgress(data);

  const updateTierField = (
    tierKey: keyof DailyLogData['tiers'],
    field: keyof DailyTierEntry,
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
    const markdown = formatDailyLogToMarkdown(data);
    const dateSlug = data.date.trim() || 'undated';
    downloadMarkdownFile(`daily-practice-log-${dateSlug}.md`, markdown);
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
            <span className="font-semibold text-[#1D5C59]">Section 2</span>
            <span aria-hidden="true">·</span>
            <span>Daily Practice &amp; Progressive Tier Log</span>
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
              Daily Practice &amp; Tier Log
            </h2>
            <p className="text-sm leading-relaxed text-[#334155] max-w-2xl">
              Spend <strong className="font-semibold text-[#0F172A]">2 minutes in the morning</strong>{' '}
              setting intentions and boundaries, plan{' '}
              <em>one opportunity per tier</em>, and return for{' '}
              <strong className="font-semibold text-[#0F172A]">8 minutes in the evening</strong>{' '}
              for your trigger debrief.
            </p>
          </div>

          {/* Action Toolbar */}
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
                aria-label="Confirm clearing daily form"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2C2BA] bg-[#FDF6F4] px-2.5 py-1.5"
              >
                <AlertCircle className="h-3.5 w-3.5 text-[#9A3412] shrink-0" />
                <span className="text-xs font-medium text-[#7C2D12] whitespace-nowrap">
                  Reset today?
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
        {/* Daily Header & Bandwidth Check-In */}
        <section
          aria-labelledby="daily-header-heading"
          className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-6"
        >
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 id="daily-header-heading" className="text-lg font-bold text-[#0F172A]">
              Daily Header &amp; Bandwidth Check-In
            </h3>
            <p className="text-xs text-[#475569] mt-0.5">
              <em>Tone reactivity often starts with skipped meals, low sleep, or over-booked time.</em>
            </p>
          </div>

          {/* Date + Sleep & Physical State Split */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#1E3A5F]">
              Date, Sleep &amp; Physical State
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="daily-date"
                  className="block text-xs font-semibold text-[#1E293B]"
                >
                  Date
                </label>
                <input
                  id="daily-date"
                  type="date"
                  value={data.date}
                  onChange={(e) =>
                    onChange((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className={`${inputBaseClass} font-mono tabular-nums`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="daily-hours-slept"
                  className="block text-xs font-semibold text-[#1E293B]"
                >
                  Hours Slept
                </label>
                <input
                  id="daily-hours-slept"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={data.hoursSlept}
                  onChange={(e) =>
                    onChange((prev) => ({ ...prev, hoursSlept: e.target.value }))
                  }
                  placeholder="e.g., 7.5"
                  className={`${inputBaseClass} font-mono tabular-nums`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="daily-overall-energy"
                  className="block text-xs font-semibold text-[#1E293B]"
                >
                  Overall Energy (1–10)
                </label>
                <select
                  id="daily-overall-energy"
                  value={data.overallEnergy}
                  onChange={(e) =>
                    onChange((prev) => ({ ...prev, overallEnergy: e.target.value }))
                  }
                  className={inputBaseClass}
                >
                  <option value="">Select 1–10...</option>
                  {ENERGY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
                <label
                  htmlFor="daily-digestive-comfort"
                  className="block text-xs font-semibold text-[#1E293B]"
                >
                  Digestive Comfort
                </label>
                <textarea
                  id="daily-digestive-comfort"
                  rows={2}
                  value={data.digestiveComfort}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      digestiveComfort: e.target.value,
                    }))
                  }
                  placeholder="Note stomach ease, tension, hydration, or meal timing..."
                  className={resizableTextareaClass}
                />
                <div className="hidden print:block print-field-value text-sm">
                  {data.digestiveComfort || ' '}
                </div>
              </div>
            </div>
          </div>

          {/* Workload Cap Split */}
          <div className="space-y-4 pt-3 border-t border-[#E2E8F0]">
            <div>
              <h4 className="text-xs font-bold text-[#1E3A5F]">
                Workload Cap &amp; Daily Schedule Anchors
              </h4>
              <p className="text-xs text-[#475569] mt-0.5">
                Protect meals, movement, and a clear end-of-day cutoff.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="daily-start-time"
                  className="block text-xs font-semibold text-[#1E293B]"
                >
                  Start Time
                </label>
                <input
                  id="daily-start-time"
                  type="time"
                  value={data.startTime}
                  onChange={(e) =>
                    onChange((prev) => ({ ...prev, startTime: e.target.value }))
                  }
                  className={`${inputBaseClass} font-mono tabular-nums`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="daily-lunch-start"
                  className="block text-xs font-semibold text-[#1E293B]"
                >
                  Lunch Start Time
                </label>
                <input
                  id="daily-lunch-start"
                  type="time"
                  value={data.lunchStartTime}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      lunchStartTime: e.target.value,
                    }))
                  }
                  className={`${inputBaseClass} font-mono tabular-nums`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="daily-lunch-end"
                  className="block text-xs font-semibold text-[#1E293B]"
                >
                  Lunch End Time
                </label>
                <input
                  id="daily-lunch-end"
                  type="time"
                  value={data.lunchEndTime}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      lunchEndTime: e.target.value,
                    }))
                  }
                  className={`${inputBaseClass} font-mono tabular-nums`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="daily-hard-stop"
                  className="block text-xs font-semibold text-[#1E293B]"
                >
                  Hard Stop Time
                </label>
                <input
                  id="daily-hard-stop"
                  type="time"
                  value={data.hardStopTime}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      hardStopTime: e.target.value,
                    }))
                  }
                  className={`${inputBaseClass} font-mono tabular-nums`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="daily-exercise-time"
                  className="block text-xs font-semibold text-[#1E293B]"
                >
                  Exercise Time
                </label>
                <input
                  id="daily-exercise-time"
                  type="time"
                  value={data.exerciseTime}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      exerciseTime: e.target.value,
                    }))
                  }
                  className={`${inputBaseClass} font-mono tabular-nums`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Part A: Morning Micro-Routine Intentions & Boundaries */}
        <section
          aria-labelledby="daily-part-a-heading"
          className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-6"
        >
          <div className="space-y-1 border-b border-[#E2E8F0] pb-4">
            <div className="text-xs font-bold text-[#1D5C59]">
              Part A · 2 Minutes Morning
            </div>
            <h3 id="daily-part-a-heading" className="text-lg font-bold text-[#0F172A]">
              Morning Micro-Routine Intentions &amp; Boundaries
            </h3>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="daily-primary-skill"
              className="block text-xs font-bold text-[#1E293B]"
            >
              1. Primary Micro-Skill Focus Today
            </label>
            <select
              id="daily-primary-skill"
              value={data.primaryMicroSkillFocus}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  primaryMicroSkillFocus: e.target.value as MicroSkillName | '',
                }))
              }
              className={inputBaseClass}
            >
              <option value="">Select a primary micro-skill focus...</option>
              {MICRO_SKILL_OPTIONS.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="daily-target-interaction"
              className="block text-xs font-bold text-[#1E293B]"
            >
              2. Specific Target Interaction
            </label>
            <textarea
              id="daily-target-interaction"
              rows={2}
              value={data.specificTargetInteraction}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  specificTargetInteraction: e.target.value,
                }))
              }
              placeholder="Which conversation or meeting today will I deliberately practice this skill in?"
              className={resizableTextareaClass}
            />
            <div className="hidden print:block print-field-value text-sm">
              {data.specificTargetInteraction || ' '}
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-xs font-bold text-[#1E293B]">
              3. Boundaries to Maintain Today
            </legend>

            <div className="space-y-3 pt-1">
              <label
                htmlFor="boundary-digital"
                className="flex items-start gap-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 cursor-pointer hover:border-[#94A3B8] transition-colors"
              >
                <input
                  id="boundary-digital"
                  type="checkbox"
                  checked={data.boundaries.digitalTexting}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      boundaries: {
                        ...prev.boundaries,
                        digitalTexting: e.target.checked,
                      },
                    }))
                  }
                  className="mt-0.5 h-4 w-4 rounded border-[#94A3B8] text-[#1D5C59] focus:ring-[#1D5C59]"
                />
                <span className="text-sm leading-relaxed text-[#1E293B]">
                  <strong className="font-semibold text-[#0F172A]">
                    Digital / Texting Boundary:{' '}
                  </strong>
                  Keep texts strictly logistical and warm;{' '}
                  <em>move any sensitive or nuanced topics to voice/in-person.</em>
                </span>
              </label>

              <label
                htmlFor="boundary-pacing"
                className="flex items-start gap-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 cursor-pointer hover:border-[#94A3B8] transition-colors"
              >
                <input
                  id="boundary-pacing"
                  type="checkbox"
                  checked={data.boundaries.pacingBandwidth}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      boundaries: {
                        ...prev.boundaries,
                        pacingBandwidth: e.target.checked,
                      },
                    }))
                  }
                  className="mt-0.5 h-4 w-4 rounded border-[#94A3B8] text-[#1D5C59] focus:ring-[#1D5C59]"
                />
                <span className="text-sm leading-relaxed text-[#1E293B]">
                  <strong className="font-semibold text-[#0F172A]">
                    Pacing / Bandwidth Boundary:{' '}
                  </strong>
                  Protect meal breaks, exercise, and solo wind-down time{' '}
                  <em>without overcommitting.</em>
                </span>
              </label>

              <div className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 space-y-2.5">
                <label
                  htmlFor="boundary-relational-check"
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <input
                    id="boundary-relational-check"
                    type="checkbox"
                    checked={data.boundaries.relationalSpaceChecked}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        boundaries: {
                          ...prev.boundaries,
                          relationalSpaceChecked: e.target.checked,
                        },
                      }))
                    }
                    className="mt-0.5 h-4 w-4 rounded border-[#94A3B8] text-[#1D5C59] focus:ring-[#1D5C59]"
                  />
                  <span className="text-sm font-semibold text-[#0F172A]">
                    Relational / Space Boundary
                  </span>
                </label>
                <div className="pl-7">
                  <label htmlFor="boundary-relational-note" className="sr-only">
                    Relational or space boundary detail
                  </label>
                  <textarea
                    id="boundary-relational-note"
                    rows={2}
                    value={data.boundaries.relationalSpaceNote}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        boundaries: {
                          ...prev.boundaries,
                          relationalSpaceNote: e.target.value,
                        },
                      }))
                    }
                    placeholder="Write any specific personal or relational boundary you are honoring today"
                    className={resizableTextareaClass}
                  />
                  <div className="hidden print:block print-field-value text-sm">
                    {data.boundaries.relationalSpaceNote || ' '}
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </section>

        {/* Part B: Daily Progressive Practice Across All Four Tiers */}
        <section aria-labelledby="daily-part-b-heading" className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#1E3A5F]">
              Part B · Morning Plan &amp; Post-Interaction Review
            </div>
            <h3 id="daily-part-b-heading" className="text-lg font-bold text-[#0F172A]">
              Daily Progressive Practice Across All Four Tiers
            </h3>
            <p className="text-sm text-[#334155]">
              Identify <strong className="font-semibold text-[#0F172A]">one opportunity in each tier</strong>{' '}
              in the morning, and return after the interaction to evaluate{' '}
              <em>whether you achieved your desired outcome.</em>
            </p>
          </div>

          <div className="space-y-5">
            {PRACTICE_TIERS.map((tier) => {
              const tierEntry = data.tiers[tier.id];
              return (
                <div
                  key={tier.id}
                  className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                    <h4 className="text-base font-bold text-[#0F172A]">
                      {tier.dailyTitle}
                    </h4>
                    <span className="text-xs font-semibold text-[#1E3A5F]">
                      {tier.environment}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label
                        htmlFor={`daily-${tier.id}-opportunity`}
                        className="block text-xs font-bold text-[#1E293B]"
                      >
                        {tier.dailyOpportunityLabel}
                      </label>
                      <textarea
                        id={`daily-${tier.id}-opportunity`}
                        rows={2}
                        value={tierEntry.plannedOpportunity}
                        onChange={(e) =>
                          updateTierField(tier.id, 'plannedOpportunity', e.target.value)
                        }
                        placeholder={tier.dailyOpportunityPlaceholder}
                        className={resizableTextareaClass}
                      />
                      <div className="hidden print:block print-field-value text-sm">
                        {tierEntry.plannedOpportunity || ' '}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor={`daily-${tier.id}-skill`}
                        className="block text-xs font-bold text-[#1E293B]"
                      >
                        Target Micro-Skill
                      </label>
                      <select
                        id={`daily-${tier.id}-skill`}
                        value={tierEntry.targetMicroSkill}
                        onChange={(e) =>
                          updateTierField(tier.id, 'targetMicroSkill', e.target.value)
                        }
                        className={inputBaseClass}
                      >
                        <option value="">Select a primary micro-skill focus...</option>
                        {MICRO_SKILL_OPTIONS.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor={`daily-${tier.id}-goal`}
                        className="block text-xs font-bold text-[#1E293B]"
                      >
                        Desired Outcome / Goal
                      </label>
                      <textarea
                        id={`daily-${tier.id}-goal`}
                        rows={2}
                        value={tierEntry.desiredOutcome}
                        onChange={(e) =>
                          updateTierField(tier.id, 'desiredOutcome', e.target.value)
                        }
                        placeholder="What does a grounded, constructive outcome look like?"
                        className={resizableTextareaClass}
                      />
                      <div className="hidden print:block print-field-value text-sm">
                        {tierEntry.desiredOutcome || ' '}
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label
                        htmlFor={`daily-${tier.id}-reflection`}
                        className="block text-xs font-bold text-[#1D5C59]"
                      >
                        Post-Interaction Reflection &amp; Outcome Evaluation
                      </label>
                      <textarea
                        id={`daily-${tier.id}-reflection`}
                        rows={2}
                        value={tierEntry.postReflection}
                        onChange={(e) =>
                          updateTierField(tier.id, 'postReflection', e.target.value)
                        }
                        placeholder={tier.dailyReflectionPlaceholder}
                        className={resizableTextareaClass}
                      />
                      <div className="hidden print:block print-field-value text-sm">
                        {tierEntry.postReflection || ' '}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Part C: Evening Debrief — 5 Areas of Unhelpful Thinking */}
        <section
          aria-labelledby="daily-part-c-heading"
          className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-5"
        >
          <div className="space-y-1 border-b border-[#E2E8F0] pb-4">
            <div className="text-xs font-bold text-[#9A3412]">
              Part C · 8 Minutes Evening
            </div>
            <h3 id="daily-part-c-heading" className="text-lg font-bold text-[#0F172A]">
              Evening Debrief — 5 Areas of Unhelpful Thinking
            </h3>
            <p className="text-sm text-[#334155]">
              Log one moment today where you felt{' '}
              <strong className="font-semibold text-[#9A3412]">
                annoyed, rushed, anxious, or defensive
              </strong>
              —or one moment where you{' '}
              <em>successfully caught a trigger early.</em>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="debrief-trigger"
                className="block text-xs font-bold text-[#1E293B]"
              >
                1. The Trigger (<em>Pure Observation — what happened?</em>)
              </label>
              <textarea
                id="debrief-trigger"
                rows={2}
                value={data.eveningDebrief.trigger}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    eveningDebrief: {
                      ...prev.eveningDebrief,
                      trigger: e.target.value,
                    },
                  }))
                }
                placeholder="Describe only what a video camera would record: specific words, actions, and timing."
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.eveningDebrief.trigger || ' '}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="debrief-thoughts"
                className="block text-xs font-bold text-[#1E293B]"
              >
                2. My Thoughts (<em>What story or evaluation did my mind create?</em>)
              </label>
              <textarea
                id="debrief-thoughts"
                rows={2}
                value={data.eveningDebrief.thoughts}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    eveningDebrief: {
                      ...prev.eveningDebrief,
                      thoughts: e.target.value,
                    },
                  }))
                }
                placeholder="Notice any mind-reading, labels, or 'always/never' stories."
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.eveningDebrief.thoughts || ' '}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="debrief-emotions"
                  className="block text-xs font-bold text-[#1E293B]"
                >
                  3. My Emotions (<em>What feelings came up underneath?</em>)
                </label>
                <textarea
                  id="debrief-emotions"
                  rows={2}
                  value={data.eveningDebrief.emotions}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      eveningDebrief: {
                        ...prev.eveningDebrief,
                        emotions: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g., hurt, fear, frustration, sadness, pressure"
                  className={resizableTextareaClass}
                />
                <div className="hidden print:block print-field-value text-sm">
                  {data.eveningDebrief.emotions || ' '}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="debrief-sensations"
                  className="block text-xs font-bold text-[#1E293B]"
                >
                  4. Physical Sensations (<em>Where did I feel it in my body?</em>)
                </label>
                <textarea
                  id="debrief-sensations"
                  rows={2}
                  value={data.eveningDebrief.physicalSensations}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      eveningDebrief: {
                        ...prev.eveningDebrief,
                        physicalSensations: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g., jaw tightness, shallow breath, stomach knot"
                  className={resizableTextareaClass}
                />
                <div className="hidden print:block print-field-value text-sm">
                  {data.eveningDebrief.physicalSensations || ' '}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="debrief-behavior"
                className="block text-xs font-bold text-[#1E293B]"
              >
                5. My Behavior &amp; Constructive Alternative (<em>How did I respond, and what unmet need was I trying to meet?</em>)
              </label>
              <textarea
                id="debrief-behavior"
                rows={3}
                value={data.eveningDebrief.behaviorAndAlternative}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    eveningDebrief: {
                      ...prev.eveningDebrief,
                      behaviorAndAlternative: e.target.value,
                    },
                  }))
                }
                placeholder="Identify the underlying need (e.g., respect, ease, clarity) and a constructive phrasing alternative."
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.eveningDebrief.behaviorAndAlternative || ' '}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] space-y-1.5 rounded-lg bg-[#F1F8F7] p-4 border border-[#D3E5E3]">
              <label
                htmlFor="debrief-quiet-win"
                className="block text-xs font-bold text-[#134E4A]"
              >
                One Quiet Win From Today
              </label>
              <textarea
                id="debrief-quiet-win"
                rows={2}
                value={data.eveningDebrief.quietWin}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    eveningDebrief: {
                      ...prev.eveningDebrief,
                      quietWin: e.target.value,
                    },
                  }))
                }
                placeholder="Acknowledge one moment you showed steadiness, restraint, or self-care"
                className={resizableTextareaClass}
              />
              <div className="hidden print:block print-field-value text-sm">
                {data.eveningDebrief.quietWin || ' '}
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
