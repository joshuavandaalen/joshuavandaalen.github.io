import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface DateListProps extends HTMLAttributes<HTMLUListElement> {}

/** Responsive grid of key-date cards. */
export function DateList({ className, children, ...rest }: DateListProps) {
  return (
    <ul className={cx('retro-date-list', className)} {...rest}>
      {children}
    </ul>
  );
}

// `title` is rich content here, not the HTML tooltip attribute.
export interface DateItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** Top line of the badge, e.g. "SAT". */
  day?: ReactNode;
  /** Bottom line of the badge, e.g. "FEB 21". */
  date: ReactNode;
  title: ReactNode;
  detail?: ReactNode;
  /**
   * Machine-readable date. Renders a `<time datetime>` so the badge is not
   * only decoration — the original's dates were plain text with a `<br>`.
   */
  dateTime?: string;
}

/** One date card: badge on the left, description on the right. */
export function DateItem({
  day,
  date,
  title,
  detail,
  dateTime,
  className,
  children,
  ...rest
}: DateItemProps) {
  const badge = (
    <>
      {day}
      {day && <br />}
      {date}
    </>
  );

  return (
    <li className={cx('retro-date-item', className)} {...rest}>
      <div className="retro-date-item__badge">
        {dateTime ? <time dateTime={dateTime}>{badge}</time> : badge}
      </div>
      <div className="retro-date-item__details">
        <h3 className="retro-date-item__title">{title}</h3>
        {detail && <p className="retro-date-item__detail">{detail}</p>}
        {children}
      </div>
    </li>
  );
}
