import { describe, expect, it } from 'vitest';

import { azureQuestions } from '../data/azure';
import { kubernetesQuestions } from '../data/kubernetes';
import {
  ALL_QUESTIONS,
  quizReducer,
  selectQuestions,
  shuffle,
  type QuizState,
} from './useQuiz';
import type { QuizQuestion } from './types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'azure',
    category: 'Networking',
    difficulty: 'core',
    prompt: 'First?',
    options: [
      { id: 'a', text: 'Right' },
      { id: 'b', text: 'Wrong' },
    ],
    correctOptionId: 'a',
    explanation: 'Because.',
    reference: { label: 'Docs', url: 'https://example.com' },
  },
  {
    id: 'q2',
    topic: 'kubernetes',
    category: 'Workloads',
    difficulty: 'core',
    prompt: 'Second?',
    options: [
      { id: 'a', text: 'Wrong' },
      { id: 'b', text: 'Right' },
    ],
    correctOptionId: 'b',
    explanation: 'Because.',
    reference: { label: 'Docs', url: 'https://example.com' },
  },
];

const started = (): QuizState =>
  quizReducer(
    { phase: 'start', questions: [], index: 0, selected: null, revealed: false, answers: [] },
    { type: 'start', questions: QUESTIONS },
  );

describe('quizReducer', () => {
  it('starts on the first question', () => {
    const state = started();
    expect(state.phase).toBe('question');
    expect(state.index).toBe(0);
    expect(state.answers).toHaveLength(0);
  });

  it('records a correct answer on submit', () => {
    let state = started();
    state = quizReducer(state, { type: 'select', optionId: 'a' });
    state = quizReducer(state, { type: 'submit' });

    expect(state.revealed).toBe(true);
    expect(state.answers).toEqual([
      { questionId: 'q1', chosenOptionId: 'a', correct: true },
    ]);
  });

  it('records a wrong answer without advancing', () => {
    let state = started();
    state = quizReducer(state, { type: 'select', optionId: 'b' });
    state = quizReducer(state, { type: 'submit' });

    expect(state.answers[0]?.correct).toBe(false);
    expect(state.index).toBe(0);
  });

  it('ignores submit when nothing is selected', () => {
    const state = quizReducer(started(), { type: 'submit' });
    expect(state.revealed).toBe(false);
    expect(state.answers).toHaveLength(0);
  });

  it('refuses to change the answer after grading', () => {
    let state = started();
    state = quizReducer(state, { type: 'select', optionId: 'b' });
    state = quizReducer(state, { type: 'submit' });
    state = quizReducer(state, { type: 'select', optionId: 'a' });

    // Otherwise a reader could see the verdict and quietly switch to the right
    // answer before it was tallied.
    expect(state.selected).toBe('b');
    expect(state.answers).toHaveLength(1);
  });

  it('does not double-count a repeated submit', () => {
    let state = started();
    state = quizReducer(state, { type: 'select', optionId: 'a' });
    state = quizReducer(state, { type: 'submit' });
    state = quizReducer(state, { type: 'submit' });

    expect(state.answers).toHaveLength(1);
  });

  it('will not advance before the answer is graded', () => {
    const state = quizReducer(started(), { type: 'next' });
    expect(state.index).toBe(0);
    expect(state.phase).toBe('question');
  });

  it('advances and clears the selection', () => {
    let state = started();
    state = quizReducer(state, { type: 'select', optionId: 'a' });
    state = quizReducer(state, { type: 'submit' });
    state = quizReducer(state, { type: 'next' });

    expect(state.index).toBe(1);
    expect(state.selected).toBeNull();
    expect(state.revealed).toBe(false);
  });

  it('finishes after the last question', () => {
    let state = started();
    for (const optionId of ['a', 'b']) {
      state = quizReducer(state, { type: 'select', optionId });
      state = quizReducer(state, { type: 'submit' });
      state = quizReducer(state, { type: 'next' });
    }

    expect(state.phase).toBe('result');
    expect(state.answers.filter((a) => a.correct)).toHaveLength(2);
  });

  it('resets on restart', () => {
    let state = started();
    state = quizReducer(state, { type: 'select', optionId: 'a' });
    state = quizReducer(state, { type: 'submit' });
    state = quizReducer(state, { type: 'restart' });

    expect(state.phase).toBe('start');
    expect(state.answers).toHaveLength(0);
  });
});

describe('selectQuestions', () => {
  it('filters by topic', () => {
    const azure = selectQuestions({ topic: 'azure', count: 50 });
    expect(azure.length).toBeGreaterThan(0);
    expect(azure.every((q) => q.topic === 'azure')).toBe(true);
  });

  it('mixes both topics when asked', () => {
    const both = selectQuestions({ topic: 'both', count: 50 });
    expect(both.some((q) => q.topic === 'azure')).toBe(true);
    expect(both.some((q) => q.topic === 'kubernetes')).toBe(true);
  });

  it('caps at the requested count', () => {
    expect(selectQuestions({ topic: 'both', count: 5 })).toHaveLength(5);
  });

  it('never returns an empty quiz', () => {
    expect(
      selectQuestions({ topic: 'both', count: 0 }).length,
    ).toBeGreaterThan(0);
  });

  it('is reproducible for a given seed', () => {
    const a = selectQuestions({ topic: 'both', count: 8, seed: 1997 });
    const b = selectQuestions({ topic: 'both', count: 8, seed: 1997 });
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
  });
});

describe('shuffle', () => {
  it('preserves every element', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, 42);
    expect(out).toHaveLength(5);
    expect([...out].sort()).toEqual(input);
  });

  it('does not mutate its input', () => {
    const input = [1, 2, 3];
    shuffle(input, 1);
    expect(input).toEqual([1, 2, 3]);
  });
});

describe('the question bank', () => {
  it('has unique ids', () => {
    const ids = ALL_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('names a correct option that actually exists in every question', () => {
    for (const q of ALL_QUESTIONS) {
      const ids = q.options.map((o) => o.id);
      expect(ids, `${q.id} has no option ${q.correctOptionId}`).toContain(
        q.correctOptionId,
      );
    }
  });

  it('gives every question distinct options', () => {
    for (const q of ALL_QUESTIONS) {
      const ids = q.options.map((o) => o.id);
      expect(new Set(ids).size, `${q.id} has duplicate option ids`).toBe(
        ids.length,
      );
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('explains and cites every answer', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.explanation.length, `${q.id} needs an explanation`).toBeGreaterThan(40);
      expect(q.reference.url, `${q.id} needs a reference`).toMatch(/^https:\/\//);
    }
  });

  it('covers both topics with a usable number of questions', () => {
    expect(azureQuestions.length).toBeGreaterThanOrEqual(15);
    expect(kubernetesQuestions.length).toBeGreaterThanOrEqual(15);
  });
});
