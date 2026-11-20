import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface ScoreCategory {
  label: string;
  correct: number;
  total: number;
}

export interface ScorePanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  score: number;
  total: number;
  /** Overrides the derived grade line. */
  grade?: ReactNode;
  /** Per-category tally. */
  breakdown?: ScoreCategory[];
  children?: ReactNode;
}

/** Period-appropriate grading, in the register of a 90s shareware quiz. */
function deriveGrade(ratio: number): string {
  if (ratio >= 0.9) return '🏆 ELITE — ship it';
  if (ratio >= 0.75) return '⭐ SOLID — interview ready';
  if (ratio >= 0.5) return '📼 GETTING THERE — review the misses';
  if (ratio >= 0.25) return '💾 NEEDS WORK — back to the docs';
  return '🚧 UNDER CONSTRUCTION';
}

/** Final score, grade, and a per-category breakdown. */
export function ScorePanel({
  score,
  total,
  grade,
  breakdown = [],
  className,
  children,
  ...rest
}: ScorePanelProps) {
  const safeTotal = total > 0 ? total : 1;
  const ratio = score / safeTotal;

  return (
    <div className={cx('retro-score', className)} {...rest}>
      <p className="retro-score__outof">You scored</p>
      <p className="retro-score__headline">
        {score}/{total}
      </p>
      <p className="retro-score__outof">{Math.round(ratio * 100)}%</p>

      <p className="retro-score__grade">{grade ?? deriveGrade(ratio)}</p>

      {breakdown.length > 0 && (
        <ul className="retro-score__breakdown">
          {breakdown.map((category) => {
            const categoryRatio =
              category.total > 0 ? category.correct / category.total : 0;
            return (
              <li key={category.label} className="retro-score__row">
                <span className="retro-score__category">{category.label}</span>
                <span className="retro-score__bar" aria-hidden="true">
                  <span
                    className="retro-score__bar-fill"
                    style={{ width: `${categoryRatio * 100}%` }}
                  />
                </span>
                <span className="retro-score__tally">
                  {category.correct}/{category.total}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {children}
    </div>
  );
}
