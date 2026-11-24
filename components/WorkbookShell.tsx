'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Menu, BookMarked } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import SidebarNav from './SidebarNav';
import ReferenceSheetView from './ReferenceSheetView';
import DailyPracticeForm from './DailyPracticeForm';
import WeeklyCalibrationForm from './WeeklyCalibrationForm';
import ContextualReferencePanel from './ContextualReferencePanel';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  createDefaultDailyLog,
  createDefaultWeeklyCalibration,
  getTodayIsoDate,
  getWeekStartIsoDate,
  normalizeDailyLog,
  normalizeWeeklyCalibration,
  type DailyLogData,
  type WeeklyCalibrationData,
  type WorkbookView,
} from '@/lib/workbook-types';
import {
  calculateDailyProgress,
  calculateWeeklyProgress,
} from '@/lib/markdown-export';
import {
  MarkdownImportError,
  parseWorkbookMarkdown,
} from '@/lib/markdown-import';

export interface ImportFeedback {
  type: 'success' | 'error';
  message: string;
}

const INITIAL_DAILY = createDefaultDailyLog('');
const INITIAL_WEEKLY = createDefaultWeeklyCalibration('');

export default function WorkbookShell() {
  const [activeView, setActiveView] = useLocalStorage<WorkbookView>(
    'cmw_active_view_v1',
    'reference'
  );
  const [rawDailyLog, setRawDailyLog, clearDailyLog, dailyHydrated] =
    useLocalStorage<DailyLogData>('cmw_daily_log_v1', INITIAL_DAILY);
  const [rawWeeklyLog, setRawWeeklyLog, clearWeeklyLog, weeklyHydrated] =
    useLocalStorage<WeeklyCalibrationData>(
      'cmw_weekly_calibration_v1',
      INITIAL_WEEKLY
    );

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopRefOpen, setDesktopRefOpen] = useState(true);
  const [mobileRefOpen, setMobileRefOpen] = useState(false);
  const [importFeedback, setImportFeedback] = useState<ImportFeedback | null>(null);

  const effectiveDailyLog = useMemo<DailyLogData>(() => {
    const normalized = normalizeDailyLog(rawDailyLog);
    if (!dailyHydrated || normalized.date) return normalized;
    return { ...normalized, date: getTodayIsoDate() };
  }, [dailyHydrated, rawDailyLog]);

  const effectiveWeeklyLog = useMemo<WeeklyCalibrationData>(() => {
    const normalized = normalizeWeeklyCalibration(rawWeeklyLog);
    if (!weeklyHydrated || normalized.weekOf) return normalized;
    return { ...normalized, weekOf: getWeekStartIsoDate() };
  }, [weeklyHydrated, rawWeeklyLog]);

  const handleDailyChange = useCallback(
    (updater: (prev: DailyLogData) => DailyLogData) => {
      setRawDailyLog((prev) => updater(normalizeDailyLog(prev)));
    },
    [setRawDailyLog]
  );

  const handleWeeklyChange = useCallback(
    (updater: (prev: WeeklyCalibrationData) => WeeklyCalibrationData) => {
      setRawWeeklyLog((prev) => updater(normalizeWeeklyCalibration(prev)));
    },
    [setRawWeeklyLog]
  );

  const handleClearDaily = () => {
    clearDailyLog();
    setRawDailyLog(createDefaultDailyLog(getTodayIsoDate()));
  };

  const handleClearWeekly = () => {
    clearWeeklyLog();
    setRawWeeklyLog(createDefaultWeeklyCalibration(getWeekStartIsoDate()));
  };

  const handleSelectView = (view: WorkbookView) => {
    setImportFeedback(null);
    setActiveView(view);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  const handleImportMarkdown = useCallback(
    (content: string, filename: string) => {
      try {
        const parsed = parseWorkbookMarkdown(content);
        if (parsed.kind === 'daily') {
          setRawDailyLog(parsed.data);
          setActiveView('daily');
          setImportFeedback({
            type: 'success',
            message: `Imported Daily Practice Log${parsed.data.date ? ` (${parsed.data.date})` : ''} from "${filename}".`,
          });
        } else {
          setRawWeeklyLog(parsed.data);
          setActiveView('weekly');
          setImportFeedback({
            type: 'success',
            message: `Imported Weekly Calibration${parsed.data.weekOf ? ` (Week of ${parsed.data.weekOf})` : ''} from "${filename}".`,
          });
        }
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }
      } catch (err) {
        setImportFeedback({
          type: 'error',
          message:
            err instanceof MarkdownImportError
              ? err.message
              : 'Unable to import this Markdown file. Please verify it was exported from this workbook.',
        });
      }
    },
    [setActiveView, setRawDailyLog, setRawWeeklyLog]
  );

  const dailyProgress = calculateDailyProgress(effectiveDailyLog);
  const weeklyProgress = calculateWeeklyProgress(effectiveWeeklyLog);

  const isFormView = activeView === 'daily' || activeView === 'weekly';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F1F5F9] text-[#0F172A]">
      {/* Primary Responsive Sidebar */}
      <SidebarNav
        activeView={activeView}
        onSelectView={handleSelectView}
        dailyProgress={dailyProgress}
        weeklyProgress={weeklyProgress}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Mobile Top Bar (< 1024px only) */}
      <header className="no-print lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-xs border-b border-[#CBD5E1] px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#1E293B] hover:bg-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5C59]"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold text-[#0F172A] truncate">
            Communication Mastery
          </span>
        </div>

        {isFormView && (
          <button
            type="button"
            onClick={() => setMobileRefOpen((prev) => !prev)}
            aria-label="Toggle quick reference guide"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1E293B] hover:bg-[#F1F5F9] whitespace-nowrap shrink-0"
          >
            <BookMarked className="h-3.5 w-3.5 text-[#1D5C59]" />
            <span>Quick Tips</span>
          </button>
        )}
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-6 sm:py-9 print:p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeView === 'reference' && (
              <ReferenceSheetView onNavigateView={handleSelectView} />
            )}

            {activeView === 'daily' && (
              <DailyPracticeForm
                data={effectiveDailyLog}
                onChange={handleDailyChange}
                onClear={handleClearDaily}
                isHydrated={dailyHydrated}
                desktopRefOpen={desktopRefOpen}
                mobileRefOpen={mobileRefOpen}
                onToggleDesktopRef={() => setDesktopRefOpen((prev) => !prev)}
                onToggleMobileRef={() => setMobileRefOpen((prev) => !prev)}
                onImportMarkdown={handleImportMarkdown}
                importFeedback={importFeedback}
                onDismissImportFeedback={() => setImportFeedback(null)}
              />
            )}

            {activeView === 'weekly' && (
              <WeeklyCalibrationForm
                data={effectiveWeeklyLog}
                onChange={handleWeeklyChange}
                onClear={handleClearWeekly}
                isHydrated={weeklyHydrated}
                desktopRefOpen={desktopRefOpen}
                mobileRefOpen={mobileRefOpen}
                onToggleDesktopRef={() => setDesktopRefOpen((prev) => !prev)}
                onToggleMobileRef={() => setMobileRefOpen((prev) => !prev)}
                onImportMarkdown={handleImportMarkdown}
                importFeedback={importFeedback}
                onDismissImportFeedback={() => setImportFeedback(null)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Secondary Contextual Quick-Reference Sidebar / Drawer */}
      {isFormView && (
        <ContextualReferencePanel
          desktopOpen={desktopRefOpen}
          mobileOpen={mobileRefOpen}
          onCloseDesktop={() => setDesktopRefOpen(false)}
          onCloseMobile={() => setMobileRefOpen(false)}
        />
      )}
    </div>
  );
}
