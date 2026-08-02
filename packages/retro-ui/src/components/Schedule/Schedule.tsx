import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

import type { TrackNumber } from '../../types';
import { cx } from '../../utils/cx';

/* === TABLE =============================================================== */

export interface ScheduleTableProps extends HTMLAttributes<HTMLTableElement> {
  /**
   * Accessible table caption. Strongly recommended — a schedule with six
   * columns is unusable without one, and the original had none.
   */
  caption?: ReactNode;
  /** Hide the caption visually while leaving it for screen readers. */
  hideCaption?: boolean;
}

/**
 * The conference grid.
 *
 * A real `<table>`, unlike the era's habit of using tables for page layout.
 * Tabular data is the one thing a table was always right for.
 */
export function ScheduleTable({
  caption,
  hideCaption = false,
  className,
  children,
  ...rest
}: ScheduleTableProps) {
  return (
    <div className="retro-schedule-wrapper" tabIndex={0} role="region" aria-label={
      typeof caption === 'string' ? caption : 'Conference schedule'
    }>
      <table className={cx('retro-schedule', className)} {...rest}>
        {caption && (
          <caption
            className={cx(
              !hideCaption && 'retro-schedule__caption',
              hideCaption && 'retro-visually-hidden',
            )}
          >
            {caption}
          </caption>
        )}
        {children}
      </table>
    </div>
  );
}

/* === HEADER ============================================================== */

export interface ScheduleHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /** Label for the leading time column. */
  timeLabel?: ReactNode;
  /** Room/track names, one per column. */
  tracks: ReactNode[];
}

export function ScheduleHeader({
  timeLabel = '⏰ TIME',
  tracks,
  className,
  ...rest
}: ScheduleHeaderProps) {
  return (
    <thead className={cx('retro-schedule__head', className)} {...rest}>
      <tr>
        <th scope="col" className="retro-schedule__time-col">
          {timeLabel}
        </th>
        {tracks.map((track, index) => (
          <th key={index} scope="col" className="retro-schedule__track-col">
            {track}
          </th>
        ))}
      </tr>
    </thead>
  );
}

/* === ROWS ================================================================ */

export type ScheduleRowVariant =
  | 'session'
  | 'special'
  | 'changeover'
  | 'party';

export interface ScheduleRowProps
  extends HTMLAttributes<HTMLTableRowElement> {
  variant?: ScheduleRowVariant;
}

export function ScheduleRow({
  variant = 'session',
  className,
  children,
  ...rest
}: ScheduleRowProps) {
  return (
    <tr
      className={cx(
        'retro-schedule__row',
        variant !== 'session' && `retro-schedule__row--${variant}`,
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  );
}

/* === CELLS =============================================================== */

export interface TimeCellProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  time: ReactNode;
  /** Sub-label, e.g. "(45 min.)". */
  duration?: ReactNode;
}

/**
 * The leading time cell.
 *
 * Rendered as `<th scope="row">` rather than `<td>`: it labels its row, and
 * marking it up as a header is what lets a screen reader announce "10:15,
 * Swanston Room" when the user lands on a session.
 */
export function TimeCell({
  time,
  duration,
  className,
  ...rest
}: TimeCellProps) {
  return (
    <th
      scope="row"
      className={cx('retro-schedule__time', className)}
      {...rest}
    >
      {time}
      {duration && (
        <span className="retro-schedule__duration">{duration}</span>
      )}
    </th>
  );
}

export interface ScheduleCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Applies one of the five room tints. */
  track?: TrackNumber;
  /** Green full-width treatment for all-hands items. */
  fullWidth?: boolean;
}

export function ScheduleCell({
  track,
  fullWidth = false,
  className,
  children,
  ...rest
}: ScheduleCellProps) {
  return (
    <td
      className={cx(
        'retro-schedule__cell',
        track && `retro-schedule__cell--track-${track}`,
        fullWidth && 'retro-schedule__cell--full-width',
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

/* === EVENTS ============================================================== */

export interface FullWidthEventProps
  extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'title'> {
  title: ReactNode;
  location?: ReactNode;
  description?: ReactNode;
  /** Number of track columns to span. */
  colSpan: number;
}

/** Registration, keynote, lunch — anything that takes over the whole grid. */
export function FullWidthEvent({
  title,
  location,
  description,
  colSpan,
  className,
  children,
  ...rest
}: FullWidthEventProps) {
  return (
    <ScheduleCell
      fullWidth
      colSpan={colSpan}
      className={className}
      {...rest}
    >
      <div className="retro-schedule__event-title">{title}</div>
      {description && (
        <div className="retro-schedule__event-desc">{description}</div>
      )}
      {location && (
        <div className="retro-schedule__event-location">{location}</div>
      )}
      {children}
    </ScheduleCell>
  );
}

export interface ChangeoverRowProps {
  time: ReactNode;
  label?: ReactNode;
  colSpan: number;
}

/** The corridor shuffle between sessions. */
export function ChangeoverRow({
  time,
  label = '⏱️ CHANGEOVER',
  colSpan,
}: ChangeoverRowProps) {
  return (
    <ScheduleRow variant="changeover">
      <TimeCell time={time} />
      <ScheduleCell colSpan={colSpan}>
        <div className="retro-schedule__changeover-text">{label}</div>
      </ScheduleCell>
    </ScheduleRow>
  );
}

/* === SESSION CARD ======================================================== */

export type SessionVariant = 'default' | 'keynote' | 'lightning';

export interface SessionCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'> {
  title: ReactNode;
  speaker?: ReactNode;
  location?: ReactNode;
  variant?: SessionVariant;
  /** Makes the card activatable by mouse and keyboard alike. */
  onSelect?: () => void;
}

/**
 * A single talk.
 *
 * When `onSelect` is supplied the card becomes a real button — the original
 * put `cursor: pointer` on a plain `<div>`, which looks clickable to a mouse
 * user and is invisible to a keyboard.
 */
export function SessionCard({
  title,
  speaker,
  location,
  variant = 'default',
  onSelect,
  className,
  children,
  ...rest
}: SessionCardProps) {
  const interactive = Boolean(onSelect);

  const body = (
    <>
      <div className="retro-session-card__title">{title}</div>
      {speaker && (
        <div className="retro-session-card__speaker">{speaker}</div>
      )}
      {location && (
        <div className="retro-session-card__location">{location}</div>
      )}
      {children}
    </>
  );

  const classes = cx(
    'retro-session-card',
    variant !== 'default' && `retro-session-card--${variant}`,
    interactive && 'retro-session-card--interactive',
    className,
  );

  if (interactive) {
    // The shared prop type is div-shaped; the event handlers are structurally
    // identical apart from the element they carry, so this narrows rather than
    // widens what a caller can pass.
    const buttonProps = rest as HTMLAttributes<HTMLButtonElement>;
    return (
      <button
        type="button"
        className={classes}
        onClick={onSelect}
        {...buttonProps}
      >
        {body}
      </button>
    );
  }

  return (
    <div className={classes} {...rest}>
      {body}
    </div>
  );
}
