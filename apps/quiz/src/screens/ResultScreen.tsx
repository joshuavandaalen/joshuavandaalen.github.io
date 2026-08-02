import {
  Blink,
  ContentBox,
  CoolButton,
  Marquee,
  RetroLink,
  ScorePanel,
  SectionTitle,
  TextPanel,
  type ScoreCategory,
} from 'retro-ui-kit-PLACEHOLDER';

import type { QuizQuestion } from '../quiz/types';

export interface ResultScreenProps {
  score: number;
  total: number;
  breakdown: ScoreCategory[];
  missed: QuizQuestion[];
  onRestart: () => void;
}

export function ResultScreen({
  score,
  total,
  breakdown,
  missed,
  onRestart,
}: ResultScreenProps) {
  const perfect = score === total && total > 0;

  return (
    <>
      <ContentBox variant="highlight" pulse={perfect}>
        <Marquee behavior="alternate" scrollAmount={4}>
          <SectionTitle>🏁 RESULTS 🏁</SectionTitle>
        </Marquee>

        <ScorePanel score={score} total={total} breakdown={breakdown} />

        {perfect && (
          <p className="retro-center">
            <Blink>★ FLAWLESS VICTORY — GO GET THE JOB ★</Blink>
          </p>
        )}

        <div className="retro-center">
          <CoolButton size="lg" onClick={onRestart}>
            🔁 TRY ANOTHER ROUND
          </CoolButton>
        </div>
      </ContentBox>

      {missed.length > 0 && (
        <ContentBox>
          <SectionTitle>📚 WORTH REVIEWING</SectionTitle>
          <TextPanel variant="note">
            The {missed.length} question{missed.length === 1 ? '' : 's'} you
            missed, with the reasoning and a link to the source.
          </TextPanel>

          {missed.map((question) => (
            <TextPanel key={question.id} variant="fun">
              <strong>{question.prompt}</strong>
              <br />
              <br />
              <em>
                Correct answer:{' '}
                {
                  question.options.find(
                    (o) => o.id === question.correctOptionId,
                  )?.text
                }
              </em>
              <br />
              <br />
              {question.explanation}
              <br />
              <br />
              📖{' '}
              <RetroLink href={question.reference.url} external>
                {question.reference.label}
              </RetroLink>
            </TextPanel>
          ))}
        </ContentBox>
      )}
    </>
  );
}
