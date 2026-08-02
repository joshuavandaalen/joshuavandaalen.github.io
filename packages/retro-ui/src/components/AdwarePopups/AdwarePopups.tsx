import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { classicAds, type RetroAd } from '../../data/classicAds';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx } from '../../utils/cx';

export interface AdwarePopupsProps {
  /** Ads to cycle through. Defaults to the ten parody classics. */
  ads?: RetroAd[];
  /** Milliseconds between spawns. */
  interval?: number;
  /** Milliseconds before the first one appears. */
  startDelay?: number;
  /** Cap on simultaneous popups, so the page stays escapable. */
  maxConcurrent?: number;
  /** Play the square-wave "bloop" on open. */
  sound?: boolean;
  /** Clicking the call to action spawns two more, as adware did. */
  spawnOnCta?: boolean;
  /** Randomise order rather than cycling. */
  shuffle?: boolean;
  /** Master switch. */
  enabled?: boolean;
  /** Title text in the window chrome. */
  windowTitle?: ReactNode;
}

interface OpenAd {
  key: number;
  ad: RetroAd;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

/** A short descending square-wave blip — the sound of an unwanted window. */
function playBloop(): void {
  if (typeof window === 'undefined') return;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return;

  try {
    const context = new Ctor();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, context.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.2);
    // The original created a context per bloop and never closed one. Ten
    // popups later the browser refuses to make any more.
    osc.onended = () => void context.close();
  } catch {
    // No audio permission, no bloop. Not worth failing the render over.
  }
}

/** Live countdown for the fake virus alert. */
function Countdown({ from }: { from: number }) {
  const [seconds, setSeconds] = useState(from);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return <>{`${mm}:${ss}`}</>;
}

/** Resolves ad copy, handing a live countdown to bodies that ask for one. */
function renderBody(ad: RetroAd): ReactNode {
  if (typeof ad.body !== 'function') return ad.body;
  return ad.body({
    countdown: ad.countdownSeconds ? (
      <Countdown from={ad.countdownSeconds} />
    ) : null,
  });
}

/**
 * The popup ad engine.
 *
 * Faithfully annoying, with three concessions the original did not make: it is
 * capped so the page never becomes unescapable, it honours reduced-motion by
 * not running at all, and every popup is a real focus-trappable dialog you can
 * dismiss with Escape.
 *
 * Note this component existed in the original repository but was never wired
 * into either page — it shipped as dead code. This is its first outing.
 */
export function AdwarePopups({
  ads = classicAds,
  interval = 15000,
  startDelay = 15000,
  maxConcurrent = 3,
  sound = true,
  spawnOnCta = true,
  shuffle = false,
  enabled = true,
  windowTitle = 'Advertisement - Internet Explorer',
}: AdwarePopupsProps) {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState<OpenAd[]>([]);
  const nextIndex = useRef(0);
  const nextKey = useRef(0);

  const active = enabled && ads.length > 0 && !reducedMotion;

  const spawn = useCallback(() => {
    setOpen((current) => {
      if (current.length >= maxConcurrent) return current;

      const index = shuffle
        ? Math.floor(Math.random() * ads.length)
        : nextIndex.current % ads.length;
      nextIndex.current += 1;

      const ad = ads[index];
      if (!ad) return current;

      if (sound) playBloop();

      return [
        ...current,
        {
          key: nextKey.current++,
          ad,
          // Slight random rotation and offset gives the stacked-windows look.
          rotation: (Math.random() - 0.5) * 6,
          offsetX: (Math.random() - 0.5) * 60,
          offsetY: (Math.random() - 0.5) * 40,
        },
      ];
    });
  }, [ads, maxConcurrent, shuffle, sound]);

  useEffect(() => {
    if (!active) {
      setOpen([]);
      return;
    }

    let repeat: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      spawn();
      repeat = setInterval(spawn, interval);
    }, startDelay);

    return () => {
      clearTimeout(start);
      if (repeat) clearInterval(repeat);
    };
  }, [active, spawn, interval, startDelay]);

  const close = useCallback((key: number) => {
    setOpen((current) => current.filter((entry) => entry.key !== key));
  }, []);

  const onCta = useCallback(
    (key: number) => {
      close(key);
      if (!spawnOnCta) return;
      // Because that is precisely what closing an ad used to do.
      setTimeout(spawn, 200);
      setTimeout(spawn, 600);
    },
    [close, spawn, spawnOnCta],
  );

  // Escape closes the most recent popup.
  useEffect(() => {
    if (open.length === 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const last = open[open.length - 1];
      if (last) close(last.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const rendered = useMemo(
    () =>
      open.map((entry) => {
        const transform = `translate(calc(-50% + ${entry.offsetX}px), calc(-50% + ${entry.offsetY}px)) rotate(${entry.rotation}deg)`;

        return (
          <div
            key={entry.key}
            className="retro-adware-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget) close(entry.key);
            }}
          >
            <div
              className="retro-adware-modal"
              role="dialog"
              aria-modal="true"
              aria-label={
                typeof entry.ad.title === 'string'
                  ? entry.ad.title
                  : 'Advertisement'
              }
              style={
                { '--retro-modal-transform': transform } as CSSProperties
              }
            >
              <div className="retro-window__titlebar">
                <span className="retro-window__title">{windowTitle}</span>
                <span className="retro-window__controls">
                  <button
                    type="button"
                    className="retro-window__control"
                    aria-label="Minimize"
                  >
                    _
                  </button>
                  <button
                    type="button"
                    className="retro-window__control"
                    aria-label="Maximize"
                  >
                    □
                  </button>
                  <button
                    type="button"
                    className={cx(
                      'retro-window__control',
                      'retro-window__control--close',
                    )}
                    onClick={() => close(entry.key)}
                    aria-label="Close advertisement"
                    autoFocus
                  >
                    X
                  </button>
                </span>
              </div>

              <div
                className="retro-adware-modal__content"
                style={
                  { '--retro-ad-bg': entry.ad.background } as CSSProperties
                }
              >
                <div className="retro-adware-modal__title">
                  {entry.ad.title}
                </div>
                <div className="retro-adware-modal__body">
                  {renderBody(entry.ad)}
                </div>
                <button
                  type="button"
                  className="retro-adware-modal__cta"
                  onClick={() => onCta(entry.key)}
                >
                  {entry.ad.cta}
                </button>
                <div className="retro-adware-modal__small">
                  {entry.ad.disclaimer}
                </div>
              </div>
            </div>
          </div>
        );
      }),
    [open, close, onCta, windowTitle],
  );

  return <>{rendered}</>;
}
