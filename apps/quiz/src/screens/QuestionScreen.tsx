import {
  AnswerList,
  Badge,
  ContentBox,
  CoolButton,
  FeedbackPanel,
  ProgressMeter,
  SectionTitle,
  type AnswerState,
} from 'retro-ui-kit-PLACEHOLDER';

import type { QuizQuestion } from '../quiz/types';

export interface QuestionScreenProps {
  question: QuizQuestion;
  index: number;
  total: number;
  selected: string | null;
  revealed: boolean;
  onSelect: (optionId: string) => void;
  onSubmit: () => void;
  onNext: () => void;
}

/** Works out how each option should look once the answer has been graded. */
function stateFor(
  optionId: string,
  question: QuizQuestion,
  selected: string | null,
  revealed: boolean,
): AnswerState {
  if (!revealed) return 'default';
  if (optionId === question.correctOptionId) {
    return optionId === selected ? 'correct' : 'revealed';
  }
  if (optionId === selected) return 'incorrect';
  return 'muted';
}

export function QuestionScreen({
  question,
  index,
  total,
  selected,
  revealed,
  onSelect,
  onSubmit,
  onNext,
}: QuestionScreenProps) {
  const isCorrect = selected === question.correctOptionId;
  const isLast = index + 1 >= total;

  return (
    <ContentBox>
      <ProgressMeter
        value={index + (revealed ? 1 : 0)}
        max={total}
        label={`Question ${index + 1} of ${total}`}
      />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0' }}>
        <Badge variant={question.topic === 'azure' ? 'gold' : 'silver'}>
          {question.topic === 'azure' ? '☁️ Azure' : '⎈ Kubernetes'}
        </Badge>
        <Badge variant="silver">{question.category}</Badge>
        {question.difficulty === 'advanced' && <Badge>⚡ Advanced</Badge>}
      </div>

      <SectionTitle as="h2">{question.prompt}</SectionTitle>

      <AnswerList
        // Remounts per question, so the radio group starts clean rather than
        // carrying the previous question's checked state.
        key={question.id}
        legend={question.prompt}
        hideLegend
        disabled={revealed}
        value={selected}
        onChange={onSelect}
        options={question.options.map((option) => ({
          id: option.id,
          children: option.text,
          state: stateFor(option.id, question, selected, revealed),
        }))}
      />

      {revealed && (
        <FeedbackPanel
          correct={isCorrect}
          explanation={question.explanation}
          reference={question.reference}
        />
      )}

      <div className="retro-center">
        {revealed ? (
          <CoolButton size="lg" onClick={onNext} variant="grass">
            {isLast ? '🏁 SEE MY SCORE 🏁' : 'NEXT QUESTION ⏭️'}
          </CoolButton>
        ) : (
          <CoolButton size="lg" onClick={onSubmit} disabled={selected === null}>
            ✅ SUBMIT ANSWER
          </CoolButton>
        )}
      </div>
    </ContentBox>
  );
}
