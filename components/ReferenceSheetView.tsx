'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Printer } from 'lucide-react';
import {
  WORKBOOK_INTRO,
  CORE_MICRO_SKILLS,
  PRACTICE_TIERS,
  FEELINGS_AND_NEEDS_ADDENDUM,
} from '@/lib/workbook-data';
import type { WorkbookView } from '@/lib/workbook-types';

interface ReferenceSheetViewProps {
  onNavigateView: (view: WorkbookView) => void;
}

export default function ReferenceSheetView({
  onNavigateView,
}: ReferenceSheetViewProps) {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="print-container max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header & Workbook Intro */}
      <header className="space-y-5 border-b border-[#CBD5E1] pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#475569]">
            <span className="text-[#1D5C59] font-semibold">Section 1</span>
            <span aria-hidden="true">·</span>
            <span>Core Reference Guide</span>
            <span aria-hidden="true">·</span>
            <span>Micro-Skills, Tiers &amp; Feelings/Needs Vocabulary</span>
          </div>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="no-print inline-flex items-center gap-1.5 rounded-lg bg-[#1D5C59] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#164745] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5C59]"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Download as PDF</span>
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] text-balance">
          {WORKBOOK_INTRO.title}
        </h2>

        <p className="text-[15px] leading-relaxed text-[#1E293B] max-w-3xl">
          Lasting change in how we communicate comes from{' '}
          <strong className="font-semibold text-[#0F172A]">
            deliberate, low-stakes repetition
          </strong>{' '}
          rather than trying to force new habits in the middle of a high-stress
          moment. <em>Just as you would prepare and run mock scenarios before an
          important field test</em>, this workbook gives you a structured system
          to train your nervous system and communication habits every day.
        </p>

        {/* Quick Section Anchor Bar */}
        <nav
          aria-label="Reference Sheet sections"
          className="no-print flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#334155]"
        >
          <span className="text-[#64748B]">Jump to:</span>
          <a
            href="#core-micro-skills"
            className="text-[#1D5C59] hover:underline underline-offset-4 whitespace-nowrap"
          >
            01. Four Core Micro-Skills
          </a>
          <a
            href="#progressive-tiers"
            className="text-[#1E3A5F] hover:underline underline-offset-4 whitespace-nowrap"
          >
            02. Progressive Practice Tiers
          </a>
          <a
            href="#feelings-and-needs"
            className="text-[#1D5C59] hover:underline underline-offset-4 whitespace-nowrap"
          >
            03. Feelings &amp; Needs Vocabulary
          </a>
        </nav>

        <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {WORKBOOK_INTRO.sections.map((sec, idx) => (
            <div
              key={sec.label}
              className="rounded-xl border border-[#CBD5E1] bg-white p-4 flex flex-col justify-between gap-3"
            >
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-[#0F172A]">
                  {sec.label}
                </h3>
                <p className="text-xs leading-relaxed text-[#475569]">
                  {sec.description}
                </p>
              </div>
              {idx === 1 && (
                <button
                  type="button"
                  onClick={() => onNavigateView('daily')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D5C59] hover:text-[#134E4A] transition-colors w-fit"
                >
                  <span>Open Daily Log</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
              {idx === 2 && (
                <button
                  type="button"
                  onClick={() => onNavigateView('weekly')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D5C59] hover:text-[#134E4A] transition-colors w-fit"
                >
                  <span>Open Weekly Calibration</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </header>

      {/* Skill Filter Controls & 4 Core Micro-Skills */}
      <section
        id="core-micro-skills"
        aria-label="Micro-skill navigation"
        className="space-y-6"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-[#0F172A]">
              The Four Core Micro-Skills
            </h3>
            <p className="text-sm text-[#475569] mt-0.5">
              Compare <strong className="font-semibold text-[#9A3412]">reactive habits</strong>{' '}
              with <strong className="font-semibold text-[#1D5C59]">constructive phrasing</strong>{' '}
              and real-time application steps.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter micro-skills"
            className="no-print inline-flex max-w-full overflow-x-auto items-center gap-1 p-1 rounded-lg bg-[#E2E8F0]"
          >
            <button
              type="button"
              onClick={() => setSelectedSkillFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedSkillFilter === 'all'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              All Skills
            </button>
            {CORE_MICRO_SKILLS.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => setSelectedSkillFilter(skill.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedSkillFilter === skill.id
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {skill.number}. {skill.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Content (all skills always print cleanly even if filtered on screen) */}
        <div className="space-y-8">
          {CORE_MICRO_SKILLS.map((skill) => {
            const isHiddenOnScreen =
              selectedSkillFilter !== 'all' && selectedSkillFilter !== skill.id;
            return (
              <article
                key={skill.id}
                id={skill.id}
                className={`print-section rounded-xl border border-[#CBD5E1] bg-white p-6 sm:p-8 space-y-6 ${
                  isHiddenOnScreen ? 'hidden print:block' : ''
                }`}
              >
                <div className="space-y-2.5 border-b border-[#E2E8F0] pb-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1D5C59]">
                    <span className="font-mono">Skill {skill.number}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#1E3A5F]">{skill.subtitle}</span>
                  </div>
                  <h4 className="text-xl font-bold text-[#0F172A]">
                    {skill.fullHeading}
                  </h4>
                  <p className="text-[15px] leading-relaxed text-[#1E293B] bg-[#F4F8F7] border border-[#D3E5E3] rounded-lg p-3.5">
                    <strong className="font-semibold text-[#134E4A]">
                      Core Principle:{' '}
                    </strong>
                    <em>{skill.corePrinciple}</em>
                  </p>
                </div>

                {/* Examples Grid */}
                <div className="space-y-4">
                  <h5 className="text-sm font-bold text-[#0F172A]">
                    {skill.comparisonHeading}
                  </h5>

                  <div className="space-y-3">
                    {skill.examples.map((example) => (
                      <div
                        key={example.situation}
                        className="rounded-lg border border-[#CBD5E1] overflow-hidden"
                      >
                        <div className="px-4 py-2.5 bg-[#EFF4FA] border-b border-[#CBD5E1]">
                          <p className="text-xs font-semibold text-[#1E3A5F]">
                            {example.situation}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#CBD5E1]">
                          <div className="p-4 bg-[#FEF6F4] space-y-1">
                            <span className="text-xs font-bold text-[#9A3412]">
                              {example.reactiveLabel}
                            </span>
                            <p className="text-sm leading-relaxed text-[#334155]">
                              {example.reactiveText}
                            </p>
                          </div>
                          <div className="p-4 bg-[#F1F8F7] space-y-1">
                            <span className="text-xs font-bold text-[#134E4A]">
                              {example.constructiveLabel}
                            </span>
                            <p className="text-sm leading-relaxed text-[#0F172A]">
                              {example.constructiveText}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to Apply */}
                <div className="pt-2 space-y-3">
                  <h5 className="text-sm font-bold text-[#0F172A]">
                    How to Apply in Practice
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {skill.howToApply.map((step) => (
                      <div
                        key={step.title}
                        className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-1.5"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#1D5C59] shrink-0 mt-0.5" />
                          <h6 className="text-xs font-bold text-[#0F172A] leading-snug">
                            {step.title}
                          </h6>
                        </div>
                        <p className="text-xs leading-relaxed text-[#334155] pl-6">
                          {step.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Four Progressive Practice Tiers */}
      <section
        id="progressive-tiers"
        aria-label="Four Progressive Practice Tiers"
        className="print-section space-y-4"
      >
        <div>
          <h3 className="text-xl font-bold text-[#0F172A]">
            Quick Reference: The Four Progressive Practice Tiers
          </h3>
          <p className="text-sm text-[#475569] mt-0.5">
            Build nervous system capacity gradually from{' '}
            <strong className="font-semibold text-[#1E3A5F]">solo rehearsal</strong>{' '}
            to <strong className="font-semibold text-[#1D5C59]">high-stakes friction</strong>.
          </p>
        </div>

        <div className="rounded-xl border border-[#CBD5E1] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EFF4FA] border-b border-[#CBD5E1]">
                  <th className="py-3.5 px-5 text-xs font-bold text-[#1E3A5F] whitespace-nowrap">
                    Tier
                  </th>
                  <th className="py-3.5 px-5 text-xs font-bold text-[#1E3A5F] whitespace-nowrap">
                    Environment
                  </th>
                  <th className="py-3.5 px-5 text-xs font-bold text-[#1E3A5F]">
                    Description &amp; Purpose
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {PRACTICE_TIERS.map((tier) => (
                  <tr key={tier.id} className="align-top">
                    <td className="py-4 px-5 text-sm font-bold text-[#0F172A] whitespace-nowrap">
                      {tier.tierLabel}
                    </td>
                    <td className="py-4 px-5 text-sm font-semibold text-[#1D5C59] whitespace-nowrap">
                      {tier.environment}
                    </td>
                    <td className="py-4 px-5 text-sm leading-relaxed text-[#334155]">
                      {tier.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Addendum: Expanded Vocabulary — Feelings & Needs */}
      <section
        id="feelings-and-needs"
        aria-labelledby="feelings-needs-heading"
        className="space-y-8 border-t border-[#CBD5E1] pt-8"
      >
        <header className="space-y-2.5">
          <p className="text-xs font-semibold text-[#1D5C59]">
            {FEELINGS_AND_NEEDS_ADDENDUM.sublabel}
          </p>
          <h3
            id="feelings-needs-heading"
            className="text-xl sm:text-2xl font-bold text-[#0F172A]"
          >
            {FEELINGS_AND_NEEDS_ADDENDUM.heading}
          </h3>
          <p className="text-[15px] leading-relaxed text-[#1E293B] bg-[#EFF4FA] border border-[#C7D7EA] rounded-lg p-4">
            {FEELINGS_AND_NEEDS_ADDENDUM.introPrefix}
            <strong className="font-semibold text-[#1E3A5F]">
              <em>{FEELINGS_AND_NEEDS_ADDENDUM.introFormula}</em>
            </strong>
            {FEELINGS_AND_NEEDS_ADDENDUM.introSuffix}
          </p>
        </header>

        {/* 1. Feelings When Needs Are Met */}
        <div className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h4 className="text-base font-bold text-[#134E4A]">
              1. Feelings When Needs Are Met
            </h4>
            <p className="text-xs text-[#475569] mt-0.5">
              <em>Signals of ease, resonance, and fulfilled needs.</em>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {FEELINGS_AND_NEEDS_ADDENDUM.feelingsMet.map((group) => (
              <div
                key={group.category}
                className="rounded-lg border border-[#D3E5E3] bg-[#F4F9F8] p-3.5 space-y-1"
              >
                <p className="text-xs font-bold text-[#134E4A]">
                  {group.category}
                </p>
                <p className="text-xs leading-relaxed text-[#1E293B]">
                  {group.words.join(', ')}.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Feelings When Needs Are Not Met */}
        <div className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h4 className="text-base font-bold text-[#9A3412]">
              2. Feelings When Needs Are Not Met
            </h4>
            <p className="text-xs text-[#475569] mt-0.5">
              <em>Signals pointing directly toward an unmet need requiring care or clarity.</em>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {FEELINGS_AND_NEEDS_ADDENDUM.feelingsUnmet.map((group) => (
              <div
                key={group.category}
                className="rounded-lg border border-[#EED5CE] bg-[#FEF7F5] p-3.5 space-y-1"
              >
                <p className="text-xs font-bold text-[#9A3412]">
                  {group.category}
                </p>
                <p className="text-xs leading-relaxed text-[#1E293B]">
                  {group.words.join(', ')}.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Distinguishing True Feelings From "Faux Feelings" */}
        <div className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-4">
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-[#0F172A]">
              3. Distinguishing True Feelings From &ldquo;Faux Feelings&rdquo;
            </h4>
            <p className="text-sm leading-relaxed text-[#334155]">
              Words that describe what you think someone else is doing{' '}
              <em>to</em> you (such as{' '}
              <strong className="font-semibold text-[#9A3412]">
                <em>&ldquo;I feel ignored&rdquo;</em>
              </strong>{' '}
              or{' '}
              <strong className="font-semibold text-[#9A3412]">
                <em>&ldquo;I feel attacked&rdquo;</em>
              </strong>
              ) are{' '}
              <strong className="font-semibold text-[#0F172A]">
                evaluations disguised as feelings
              </strong>
              . Translating them into pure feelings and underlying needs keeps
              conversations open rather than triggering defensiveness.
            </p>
          </div>

          <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#EFF4FA] border-b border-[#CBD5E1]">
                    <th className="py-3 px-4 text-xs font-bold text-[#9A3412] whitespace-nowrap">
                      &ldquo;Faux Feeling&rdquo; (Implied Judgment)
                    </th>
                    <th className="py-3 px-4 text-xs font-bold text-[#1E3A5F] whitespace-nowrap">
                      Underlying True Feelings
                    </th>
                    <th className="py-3 px-4 text-xs font-bold text-[#134E4A] whitespace-nowrap">
                      Underlying Unmet Needs
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {FEELINGS_AND_NEEDS_ADDENDUM.fauxFeelingsTable.map((row) => (
                    <tr key={row.fauxFeeling} className="align-top">
                      <td className="py-3 px-4 text-xs font-bold text-[#9A3412] bg-[#FEF9F8] whitespace-nowrap">
                        {row.fauxFeeling}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-[#1E293B]">
                        {row.trueFeelings}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-[#134E4A] bg-[#F7FBFA]">
                        {row.unmetNeeds}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Universal Human Needs */}
        <div className="print-section rounded-xl border border-[#CBD5E1] bg-white p-6 space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h4 className="text-base font-bold text-[#1E3A5F]">
              4. Universal Human Needs
            </h4>
            <p className="text-xs text-[#475569] mt-0.5">
              <em>Shared human values underneath every feeling and request.</em>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {FEELINGS_AND_NEEDS_ADDENDUM.universalNeeds.map((group) => (
              <div
                key={group.category}
                className="rounded-lg border border-[#C7D7EA] bg-[#F5F8FC] p-3.5 space-y-1"
              >
                <p className="text-xs font-bold text-[#1E3A5F]">
                  {group.category}
                </p>
                <p className="text-xs leading-relaxed text-[#1E293B]">
                  {group.words.join(', ')}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
