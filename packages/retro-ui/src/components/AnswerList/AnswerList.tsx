import { useId, type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../../utils/cx';

/**
 * How an option should be presented once an answer has been graded.
 *
 * `revealed` is the right answer surfaced after the reader chose a different
 * one — visually distinct from `correct`, which means "you picked this and it
 * was right".
 */
export type AnswerState =
  | 'default'
  | 'correct'
  | 'incorrect'
  | 'revealed'
  | 'muted';

export interface AnswerOptionProps {
  /** Stable id, unique within the list. */
  id: string;
  /** The answer text. */
  children: ReactNode;
  /** Prefix key — A, B, C… Derived from position if omitted. */
  optionKey?: string;
  state?: AnswerState;
}

export interface AnswerListProps
  extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  /** Accessible name for the group — usually the question text. */
  legend: ReactNode;
  /** Visually hide the legend when the question is already a visible heading. */
  hideLegend?: boolean;
  options: AnswerOptionProps[];
  /** Currently selected option id. */
  value?: string | null;
  onChange?: (id: string) => void;
  /** Lock the group once the answer is submitted. */
  disabled?: boolean;
  /** Shared radio-group name. Generated if omitted. */
  name?: string;
}

const KEYS = 'ABCDEFGHIJ';

/** Screen-reader-only wording for a graded option. */
const STATE_LABEL: Partial<Record<AnswerState, string>> = {
  correct: 'Correct answer, and the one you chose.',
  incorrect: 'Incorrect. This is the answer you chose.',
  revealed: 'This was the correct answer.',
};

const STATE_MARK: Partial<Record<AnswerState, string>> = {
  correct: '✔',
  incorrect: '✘',
  revealed: '←',
};

/**
 * A single-choice answer group.
 *
 * Built on real `<input type="radio">` elements inside a `<fieldset>`. The
 * inputs are visually hidden but never removed from the accessibility tree, so
 * roving focus, arrow-key navigation and group semantics come from the platform
 * rather than being approximated with `div`s and key handlers.
 *
 * Grading is never communicated by colour alone: each graded option also gets a
 * mark glyph and a visually hidden sentence.
 */
export function AnswerList({
  legend,
  hideLegend = false,
  options,
  value = null,
  onChange,
  disabled = false,
  name,
  className,
  ...rest
}: AnswerListProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;

  return (
    <fieldset className={cx('retro-answers', className)} {...rest}>
      <legend
        className={cx(
          hideLegend ? 'retro-visually-hidden' : 'retro-answers__legend',
        )}
      >
        {legend}
      </legend>

      {options.map((option, index) => {
        const state = option.state ?? 'default';
        const inputId = `${groupName}-${option.id}`;
        const mark = STATE_MARK[state];
        const stateLabel = STATE_LABEL[state];

        return (
          <div
            key={option.id}
            className={cx(
              'retro-answer',
              state !== 'default' && `retro-answer--${state}`,
            )}
          >
            <input
              className="retro-answer__input"
              type="radio"
              id={inputId}
              name={groupName}
              value={option.id}
              checked={value === option.id}
              disabled={disabled}
              onChange={() => onChange?.(option.id)}
            />
            <label className="retro-answer__label" htmlFor={inputId}>
              <span className="retro-answer__key" aria-hidden="true">
                {option.optionKey ?? KEYS[index] ?? String(index + 1)}
              </span>
              <span className="retro-answer__text">{option.children}</span>
              {mark && (
                <span className="retro-answer__mark" aria-hidden="true">
                  {mark}
                </span>
              )}
              {stateLabel && (
                <span className="retro-visually-hidden">{stateLabel}</span>
              )}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
}
