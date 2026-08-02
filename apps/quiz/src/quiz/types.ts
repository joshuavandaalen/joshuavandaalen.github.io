export type Topic = 'azure' | 'kubernetes';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  topic: Topic;
  /** Sub-area, used for the per-category breakdown on the results screen. */
  category: string;
  difficulty: 'core' | 'advanced';
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  /** Why the right answer is right — and, where it matters, why the tempting one is wrong. */
  explanation: string;
  reference: { label: string; url: string };
}
