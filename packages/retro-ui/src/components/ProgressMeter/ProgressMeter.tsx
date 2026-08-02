import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface ProgressMeterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number;
  max?: number;
  /** Text on the left of the bar. */
  label?: ReactNode;
  /** Text on the right. Defaults to a percentage. */
  hint?: ReactNode;
  /** Number of blocks in the track. */
  segments?: number;
}

/**
 * The segmented block bar from a Windows file-copy dialog.
 *
 * A real `role="progressbar"` with the ARIA value attributes, so the position
 * is available to assistive technology rather than being purely decorative
 * blocks.
 */
export function ProgressMeter({
  value,
  max = 100,
  label,
  hint,
  segments = 20,
  className,
  ...rest
}: ProgressMeterProps) {
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const ratio = clamped / safeMax;
  const filled = Math.round(ratio * segments);

  return (
    <div className={cx('retro-progress', className)} {...rest}>
      <div className="retro-progress__label">
        <span>{label}</span>
        <span>{hint ?? `${Math.round(ratio * 100)}%`}</span>
      </div>
      <div
        className="retro-progress__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuetext={
          typeof label === 'string' ? label : `${clamped} of ${safeMax}`
        }
      >
        {Array.from({ length: segments }, (_, index) => (
          <span
            key={index}
            className={cx(
              'retro-progress__block',
              index >= filled && 'retro-progress__block--empty',
            )}
          />
        ))}
      </div>
    </div>
  );
}
