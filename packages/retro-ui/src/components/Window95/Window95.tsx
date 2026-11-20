import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../utils/cx';

// `title` is the titlebar's rich content, not the HTML tooltip attribute.
export interface Window95Props
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  /** Show the `_ □ X` cluster. */
  controls?: boolean;
}

/**
 * A Windows 95/98 dialog frame.
 *
 * The original built this twice — once in the popup engine, once inline on the
 * music player — with slightly different greys each time. One implementation,
 * with real `<button>`s for the window controls rather than `<span>`s carrying
 * click handlers.
 */
export function Window95({
  title,
  onClose,
  onMinimize,
  onMaximize,
  controls = true,
  className,
  children,
  ...rest
}: Window95Props) {
  return (
    <div className={cx('retro-window', className)} {...rest}>
      <div className="retro-window__titlebar">
        <span className="retro-window__title">{title}</span>
        {controls && (
          <span className="retro-window__controls">
            <button
              type="button"
              className="retro-window__control"
              onClick={onMinimize}
              aria-label="Minimize"
            >
              _
            </button>
            <button
              type="button"
              className="retro-window__control"
              onClick={onMaximize}
              aria-label="Maximize"
            >
              □
            </button>
            <button
              type="button"
              className="retro-window__control retro-window__control--close"
              onClick={onClose}
              aria-label="Close"
            >
              X
            </button>
          </span>
        )}
      </div>
      <div className="retro-window__body">{children}</div>
    </div>
  );
}

export interface Win95ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `go` is green, `stop` is red — the play/mute pair. */
  tone?: 'default' | 'go' | 'stop';
}

/** A raised grey system button. */
export function Win95Button({
  tone = 'default',
  className,
  type = 'button',
  children,
  ...rest
}: Win95ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'retro-win95-button',
        tone !== 'default' && `retro-win95-button--${tone}`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
