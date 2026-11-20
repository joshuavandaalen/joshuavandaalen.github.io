import type { HTMLAttributes, ReactNode } from 'react';

import { useChiptune } from '../../hooks/useChiptune';
import { Win95Button } from '../Window95/Window95';
import type { ChiptunePattern } from '../../audio/patterns';
import { cx } from '../../utils/cx';

export interface MidiPlayerProps extends HTMLAttributes<HTMLDivElement> {
  /** Filename shown in the panel. */
  trackName?: ReactNode;
  label?: ReactNode;
  /** Pattern to play. Defaults to the 170 BPM happy-hardcore loop. */
  pattern?: ChiptunePattern;
  /** Master volume, 0–1. */
  volume?: number;
  /** Fixed bottom-right (default) or inline. */
  position?: 'fixed' | 'static';
}

/**
 * The floating "Now Playing" panel.
 *
 * Playback is explicitly opt-in. The original auto-played on load, which every
 * modern browser blocks anyway — and which, when it did work, was the single
 * most hated behaviour of the era.
 */
export function MidiPlayer({
  trackName = 'ddd-theme.mid',
  label = 'Now Playing:',
  pattern,
  volume = 0.45,
  position = 'fixed',
  className,
  ...rest
}: MidiPlayerProps) {
  const { playing, toggle, supported } = useChiptune({ pattern, volume });

  return (
    <div
      className={cx(
        'retro-midi-player',
        position === 'static' && 'retro-midi-player--static',
        className,
      )}
      {...rest}
    >
      <div className="retro-midi-player__inner">
        <span className="retro-midi-player__note" aria-hidden="true">
          🎵
        </span>
        <div className="retro-midi-player__meta">
          <div className="retro-midi-player__label">{label}</div>
          <div>{trackName}</div>
        </div>
        <Win95Button
          tone={playing ? 'stop' : 'go'}
          onClick={() => void toggle()}
          disabled={!supported}
          aria-pressed={playing}
        >
          {playing ? 'MUTE' : 'PLAY'}
        </Win95Button>
      </div>
    </div>
  );
}
