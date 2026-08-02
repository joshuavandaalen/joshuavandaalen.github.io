import { useCallback, useMemo, useReducer } from 'react';

import { azureQuestions } from '../data/azure';
import { kubernetesQuestions } from '../data/kubernetes';
import type { QuizQuestion, Topic } from './types';

export type TopicFilter = Topic | 'both';

export interface QuizAnswer {
  questionId: string;
  chosenOptionId: string;
  correct: boolean;
}

export type QuizPhase = 'start' | 'question' | 'result';

export interface QuizState {
  phase: QuizPhase;
  questions: QuizQuestion[];
  index: number;
  /** The option currently selected but not yet submitted. */
  selected: string | null;
  /** True once the current question has been graded. */
  revealed: boolean;
  answers: QuizAnswer[];
}

type QuizAction =
  | { type: 'start'; questions: QuizQuestion[] }
  | { type: 'select'; optionId: string }
  | { type: 'submit' }
  | { type: 'next' }
  | { type: 'restart' };

export const ALL_QUESTIONS: QuizQuestion[] = [
  ...azureQuestions,
  ...kubernetesQuestions,
];

const INITIAL: QuizState = {
  phase: 'start',
  questions: [],
  index: 0,
  selected: null,
  revealed: false,
  answers: [],
};

/**
 * Fisher–Yates, seeded so a run is reproducible when a seed is supplied.
 *
 * The end-to-end test pins the seed; without that the questions shuffle and
 * there is no stable "answer the second one correctly" to assert against.
 */
export function shuffle<T>(items: T[], seed?: number): T[] {
  const out = [...items];
  let random: () => number;

  if (seed === undefined) {
    random = Math.random;
  } else {
    let state = seed >>> 0;
    random = () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const a = out[i]!;
    const b = out[j]!;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

export function selectQuestions({
  topic,
  count,
  seed,
  pool = ALL_QUESTIONS,
}: {
  topic: TopicFilter;
  count: number;
  seed?: number;
  pool?: QuizQuestion[];
}): QuizQuestion[] {
  const filtered =
    topic === 'both' ? pool : pool.filter((q) => q.topic === topic);
  return shuffle(filtered, seed).slice(0, Math.max(1, count));
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'start':
      return {
        ...INITIAL,
        phase: 'question',
        questions: action.questions,
      };

    case 'select':
      // Selection is locked once the answer has been graded, so the record of
      // what the reader actually chose cannot be rewritten after the fact.
      if (state.revealed) return state;
      return { ...state, selected: action.optionId };

    case 'submit': {
      const question = state.questions[state.index];
      if (!question || state.selected === null || state.revealed) return state;

      return {
        ...state,
        revealed: true,
        answers: [
          ...state.answers,
          {
            questionId: question.id,
            chosenOptionId: state.selected,
            correct: state.selected === question.correctOptionId,
          },
        ],
      };
    }

    case 'next': {
      if (!state.revealed) return state;
      const nextIndex = state.index + 1;

      if (nextIndex >= state.questions.length) {
        return { ...state, phase: 'result' };
      }

      return {
        ...state,
        index: nextIndex,
        selected: null,
        revealed: false,
      };
    }

    case 'restart':
      return INITIAL;

    default:
      return state;
  }
}

export interface CategoryScore {
  label: string;
  correct: number;
  total: number;
}

export function useQuiz(pool: QuizQuestion[] = ALL_QUESTIONS) {
  const [state, dispatch] = useReducer(quizReducer, INITIAL);

  const start = useCallback(
    (topic: TopicFilter, count: number, seed?: number) => {
      dispatch({
        type: 'start',
        questions: selectQuestions({ topic, count, seed, pool }),
      });
    },
    [pool],
  );

  const select = useCallback(
    (optionId: string) => dispatch({ type: 'select', optionId }),
    [],
  );
  const submit = useCallback(() => dispatch({ type: 'submit' }), []);
  const next = useCallback(() => dispatch({ type: 'next' }), []);
  const restart = useCallback(() => dispatch({ type: 'restart' }), []);

  const question = state.questions[state.index] ?? null;
  const score = state.answers.filter((a) => a.correct).length;

  const breakdown = useMemo<CategoryScore[]>(() => {
    const byCategory = new Map<string, CategoryScore>();

    for (const answer of state.answers) {
      const q = state.questions.find((item) => item.id === answer.questionId);
      if (!q) continue;

      const entry = byCategory.get(q.category) ?? {
        label: q.category,
        correct: 0,
        total: 0,
      };
      entry.total += 1;
      if (answer.correct) entry.correct += 1;
      byCategory.set(q.category, entry);
    }

    return [...byCategory.values()].sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }, [state.answers, state.questions]);

  const missed = useMemo(
    () =>
      state.answers
        .filter((a) => !a.correct)
        .map((a) => state.questions.find((q) => q.id === a.questionId))
        .filter((q): q is QuizQuestion => Boolean(q)),
    [state.answers, state.questions],
  );

  return {
    ...state,
    question,
    score,
    breakdown,
    missed,
    start,
    select,
    submit,
    next,
    restart,
  };
}
