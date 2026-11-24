'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, X, Layers, Sparkles } from 'lucide-react';
import { CORE_MICRO_SKILLS, PRACTICE_TIERS } from '@/lib/workbook-data';

interface ContextualReferencePanelProps {
  desktopOpen: boolean;
  mobileOpen: boolean;
  onCloseDesktop: () => void;
  onCloseMobile: () => void;
}

export default function ContextualReferencePanel({
  desktopOpen,
  mobileOpen,
  onCloseDesktop,
  onCloseMobile,
}: ContextualReferencePanelProps) {
  const [activeTab, setActiveTab] = useState<'skills' | 'tiers'>('skills');
  const [expandedSkillId, setExpandedSkillId] = useState<string>('skill-1');

  if (!desktopOpen && !mobileOpen) return null;

  const renderPanelContent = (onClose: () => void, closeLabel: string) => (
    <div className="flex h-full flex-col bg-white border-l border-[#E2E6EC]">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#EEF1F5]">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[#17202A] whitespace-nowrap truncate">
            Quick Reference Guide
          </h2>
          <p className="text-xs text-[#64748B] whitespace-nowrap truncate">
            Micro-skills & practice tiers
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F1F4F7] hover:text-[#17202A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F6D]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 pt-3 pb-2 border-b border-[#EEF1F5]">
        <div
          role="tablist"
          aria-label="Quick reference categories"
          className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#F1F4F7]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'skills'}
            onClick={() => setActiveTab('skills')}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'skills'
                ? 'bg-white text-[#17202A] shadow-xs'
                : 'text-[#5B6B7C] hover:text-[#17202A]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>4 Micro-Skills</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tiers'}
            onClick={() => setActiveTab('tiers')}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'tiers'
                ? 'bg-white text-[#17202A] shadow-xs'
                : 'text-[#5B6B7C] hover:text-[#17202A]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>4 Practice Tiers</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {activeTab === 'skills' ? (
          CORE_MICRO_SKILLS.map((skill) => {
            const isExpanded = expandedSkillId === skill.id;
            return (
              <div
                key={skill.id}
                className="rounded-lg border border-[#E2E6EC] bg-[#FAFBFD]"
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setExpandedSkillId((prev) => (prev === skill.id ? '' : skill.id))
                  }
                  className="w-full flex items-start justify-between gap-2 px-3.5 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F6D] rounded-lg"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] font-medium text-[#2E6F6D]">
                      Skill {skill.number}
                    </span>
                    <p className="text-[13px] font-semibold text-[#17202A] leading-snug mt-0.5">
                      {skill.name}
                    </p>
                    <p className="text-xs text-[#64748B] mt-0.5">{skill.subtitle}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-[#64748B] shrink-0 mt-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-[#64748B] shrink-0 mt-1" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-[#EAECEF] space-y-3 bg-white rounded-b-lg">
                    <p className="text-xs leading-relaxed text-[#334155]">
                      <strong className="font-semibold text-[#17202A]">Cue: </strong>
                      {skill.quickCue}
                    </p>

                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-[#475569]">
                        How to Apply
                      </p>
                      <ul className="space-y-2">
                        {skill.howToApply.map((tip) => (
                          <li key={tip.title} className="text-xs leading-relaxed text-[#475569]">
                            <span className="font-medium text-[#17202A]">{tip.title}: </span>
                            {tip.detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {skill.examples[0] && (
                      <div className="pt-2 border-t border-[#EEF1F5] space-y-1.5">
                        <p className="text-[11px] font-semibold text-[#475569]">
                          Sample Phrasing ({skill.examples[0].situation})
                        </p>
                        <p className="text-xs leading-relaxed text-[#2E6F6D] bg-[#F2F7F6] rounded-md p-2.5">
                          {skill.examples[0].constructiveText}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="space-y-3">
            {PRACTICE_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="rounded-lg border border-[#E2E6EC] bg-white p-3.5 space-y-1.5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-semibold text-[#17202A]">
                    {tier.tierLabel}
                  </h3>
                  <span className="text-[11px] font-medium text-[#3B5B78]">
                    {tier.environment}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#475569]">
                  {tier.description}
                </p>
                <p className="pt-1 text-[11px] leading-relaxed text-[#64748B] border-t border-[#F1F4F7]">
                  <span className="font-medium text-[#334155]">Weekly example: </span>
                  {tier.weeklyExamplePlan}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {desktopOpen && (
        <aside
          aria-label="Contextual quick reference"
          className="no-print hidden xl:block w-84 shrink-0 sticky top-0 h-screen"
        >
          {renderPanelContent(onCloseDesktop, 'Collapse quick reference sidebar')}
        </aside>
      )}

      {mobileOpen && (
        <div className="no-print fixed inset-0 z-50 xl:hidden flex justify-end">
          <button
            type="button"
            aria-label="Dismiss quick reference overlay"
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#0F172A]/35 backdrop-blur-[1px]"
          />
          <aside
            aria-label="Contextual quick reference drawer"
            className="relative z-10 w-88 max-w-[90vw] h-full shadow-xl"
          >
            {renderPanelContent(onCloseMobile, 'Close quick reference drawer')}
          </aside>
        </div>
      )}
    </>
  );
}
