import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'sapi-state-v1';

export type OnboardingData = {
  goal: string;
  examYear: string;
  target: string;
  dailyMinutes: number;
  selfLevel: string;
};

type SapiState = {
  onboarded: boolean;
  onboarding: OnboardingData | null;
  xp: number;
  dailyXp: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  lastStudyDate: string | null;
  completedLessonIds: string[];
};

type SapiContextValue = SapiState & {
  hydrated: boolean;
  completeOnboarding: (data: OnboardingData) => void;
  registerWrongAnswer: () => void;
  recoverHeart: () => void;
  completeLesson: (lessonId: string, xp: number) => void;
  resetProgress: () => void;
};

const defaultState: SapiState = {
  onboarded: false,
  onboarding: null,
  xp: 0,
  dailyXp: 0,
  hearts: 5,
  maxHearts: 5,
  streak: 0,
  lastStudyDate: null,
  completedLessonIds: [],
};

const SapiContext = createContext<SapiContextValue | null>(null);

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function yesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return localDateKey(date);
}

export function SapiProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SapiState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!mounted || !stored) return;
        const parsed = JSON.parse(stored) as Partial<SapiState>;
        setState((current) => ({ ...current, ...parsed }));
      })
      .catch(() => {
        // O MVP continua funcional mesmo se o armazenamento local falhar.
      })
      .finally(() => {
        if (mounted) setHydrated(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [hydrated, state]);

  const completeOnboarding = (data: OnboardingData) => {
    setState((current) => ({ ...current, onboarded: true, onboarding: data }));
  };

  const registerWrongAnswer = () => {
    setState((current) => ({ ...current, hearts: Math.max(0, current.hearts - 1) }));
  };

  const recoverHeart = () => {
    setState((current) => ({ ...current, hearts: Math.min(current.maxHearts, current.hearts + 1) }));
  };

  const completeLesson = (lessonId: string, xpAward: number) => {
    setState((current) => {
      if (current.completedLessonIds.includes(lessonId)) return current;

      const today = localDateKey();
      const nextStreak =
        current.lastStudyDate === today
          ? current.streak
          : current.lastStudyDate === yesterdayKey()
            ? current.streak + 1
            : 1;

      const nextDailyXp = current.lastStudyDate === today ? current.dailyXp + xpAward : xpAward;

      return {
        ...current,
        xp: current.xp + xpAward,
        dailyXp: nextDailyXp,
        streak: nextStreak,
        lastStudyDate: today,
        completedLessonIds: [...current.completedLessonIds, lessonId],
      };
    });
  };

  const resetProgress = () => {
    setState(defaultState);
  };

  const value = useMemo<SapiContextValue>(
    () => ({
      ...state,
      hydrated,
      completeOnboarding,
      registerWrongAnswer,
      recoverHeart,
      completeLesson,
      resetProgress,
    }),
    [state, hydrated],
  );

  return <SapiContext.Provider value={value}>{children}</SapiContext.Provider>;
}

export function useSapi() {
  const context = useContext(SapiContext);
  if (!context) throw new Error('useSapi must be used inside SapiProvider');
  return context;
}
