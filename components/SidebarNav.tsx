'use client';

import React from 'react';
import { BookOpen, CalendarCheck2, Compass, X } from 'lucide-react';
import type { WorkbookView } from '@/lib/workbook-types';

interface SidebarNavProps {
  activeView: WorkbookView;
  onSelectView: (view: WorkbookView) => void;
  dailyProgress: { completedFields: number; totalFields: number };
  weeklyProgress: { completedFields: number; totalFields: number };
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: Array<{
  id: WorkbookView;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'reference',
    label: 'Reference Sheet',
    subtitle: '4 Micro-Skills & Tiers',
    icon: BookOpen,
  },
  {
    id: 'daily',
    label: 'Daily Practice Log',
    subtitle: 'Morning, Tiers & Debrief',
    icon: CalendarCheck2,
  },
  {
    id: 'weekly',
    label: 'Weekly Calibration',
    subtitle: 'Audit, Redo & Review',
    icon: Compass,
  },
];

export default function SidebarNav({
  activeView,
  onSelectView,
  dailyProgress,
  weeklyProgress,
  mobileOpen,
  onCloseMobile,
}: SidebarNavProps) {
  const handleNavClick = (view: WorkbookView) => {
    onSelectView(view);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-[#CBD5E1]">
      <div>
        <div className="flex items-start justify-between gap-3 px-6 pt-7 pb-6 border-b border-[#E2E8F0]">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.06em] text-[#1D5C59]">
              Deliberate Practice
            </p>
            <h1 className="mt-1 text-[17px] font-bold tracking-tight text-[#0F172A] leading-snug">
              Communication Mastery
            </h1>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="lg:hidden rounded-lg p-2 text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5C59]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Workbook sections" className="px-3 py-5 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const progressText =
              item.id === 'daily'
                ? `${dailyProgress.completedFields}/${dailyProgress.totalFields}`
                : item.id === 'weekly'
                  ? `${weeklyProgress.completedFields}/${weeklyProgress.totalFields}`
                  : null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-lg text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5C59] ${
                  isActive
                    ? 'bg-[#E8F3F2] text-[#134E4A]'
                    : 'text-[#1E293B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 ${
                      isActive ? 'text-[#1D5C59]' : 'text-[#475569]'
                    }`}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold whitespace-nowrap truncate">
                      {item.label}
                    </span>
                    <span
                      className={`block text-xs whitespace-nowrap truncate ${
                        isActive ? 'text-[#1D5C59]' : 'text-[#475569]'
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  </span>
                </span>
                {progressText !== null && (
                  <span
                    className={`font-mono text-xs tabular-nums shrink-0 ${
                      isActive ? 'text-[#134E4A] font-semibold' : 'text-[#475569]'
                    }`}
                  >
                    {progressText}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-6 py-5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <p className="text-xs font-semibold text-[#0F172A]">Local Auto-Save Active</p>
        <p className="mt-1 text-xs leading-relaxed text-[#475569]">
          Morning plans and evening reflections stay in your browser storage across reloads. Export to Markdown or PDF anytime.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="no-print hidden lg:block w-68 shrink-0 sticky top-0 h-screen">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden flex">
          <button
            type="button"
            aria-label="Dismiss navigation overlay"
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#0F172A]/35 backdrop-blur-[1px]"
          />
          <aside className="relative z-10 w-72 max-w-[85vw] h-full shadow-xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
