import type { HTMLAttributes, ReactNode } from 'react';

import { RetroLink } from '../typography/RetroLink';
import { cx } from '../../utils/cx';

export interface FeedbackPanelProps extends HTMLAttributes<HTMLDivElement> {
  correct: boolean;
  /** Overrides the default verdict wording. */
  verdict?: ReactNode;
  /** Why the answer is what it is. */
  explanation?: ReactNode;
  /** Link out to the authoritative documentation. */
  reference?: { label: string; url: string };
}

/**
 * The right/wrong verdict with its explanation.
 *
 * `role="status"` announces the result to assistive technology without moving
 * focus — the reader is told the outcome but keeps their place, rather than
 * being yanked out of the answer list.
 */
export function FeedbackPanel({
  correct,
  verdict,
  explanation,
  reference,
  className,
  children,
  ...rest
}: FeedbackPanelProps) {
  return (
    <div
      role="status"
      className={cx(
        'retro-feedback',
        correct ? 'retro-feedback--correct' : 'retro-feedback--incorrect',
        className,
      )}
      {...rest}
    >
      <p className="retro-feedback__verdict">
        <span aria-hidden="true">{correct ? '✔' : '✘'}</span>
        <span>{verdict ?? (correct ? 'CORRECT!' : 'NOT QUITE')}</span>
      </p>

      {explanation && (
        <div className="retro-feedback__explanation">{explanation}</div>
      )}

      {reference && (
        <p className="retro-feedback__reference">
          📖{' '}
          <RetroLink href={reference.url} external>
            {reference.label}
          </RetroLink>
        </p>
      )}

      {children}
    </div>
  );
}
