import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface NarwhalFlybyHandle {
  /** Send one across immediately. */
  fly: () => void;
}

export interface NarwhalFlybyProps {
  /** Milliseconds between flybys. */
  interval?: number;
  /** Milliseconds before the first one. */
  firstDelay?: number;
  /** Milliseconds to cross the screen. */
  duration?: number;
  /** Show the caped rider. */
  rider?: boolean;
  /** Glyph in the rider's visor. */
  riderVisor?: ReactNode;
  /** What the rider is holding aloft. */
  riderArms?: ReactNode;
  enabled?: boolean;
}

const SPARKLES = [
  { top: -10, left: 20, delay: 0, glyph: '✨' },
  { top: 15, left: -10, delay: 0.3, glyph: '⭐' },
  { top: -20, left: 50, delay: 0.6, glyph: '💫' },
  { top: 30, left: 0, delay: 0.2, glyph: '✨' },
  { top: -5, left: 70, delay: 0.8, glyph: '🌟' },
];

/**
 * A narwhal that arcs across the screen on a timer, rainbow trailing behind.
 *
 * Built entirely from divs — horn, eye, mouth, three spots, belly, flipper and
 * a split tail — with an optional caped rider. The original exposed a global
 * `window.narwhalNow()` to trigger one manually; this takes a ref instead, so
 * nothing is bolted onto `window`.
 *
 * `forwardRef` rather than a plain `ref` prop, because the package supports
 * React 18 where the latter is not yet a thing.
 *
 * The `/*#__PURE__*\/` annotation matters: `forwardRef(...)` is a call
 * expression at module scope, which a bundler must assume could have side
 * effects. Without it this component is retained in every consumer bundle even
 * when nobody imports it — measurably so, which is how it was caught.
 */
export const NarwhalFlyby = /*#__PURE__*/ forwardRef<
  NarwhalFlybyHandle,
  NarwhalFlybyProps
>(
  function NarwhalFlyby(
    {
      interval = 180000,
      firstDelay = 10000,
      duration = 4000,
      rider = true,
      riderVisor = '◈',
      riderArms = '🤘',
      enabled = true,
    },
    ref,
  ) {
  const reducedMotion = useReducedMotion();
  const [flights, setFlights] = useState<number[]>([]);
  const nextId = useRef(0);

  const active = enabled && !reducedMotion;

  const fly = useCallback(() => {
    const id = nextId.current++;
    setFlights((current) => [...current, id]);
    setTimeout(() => {
      setFlights((current) => current.filter((flight) => flight !== id));
    }, duration + 500);
  }, [duration]);

  useImperativeHandle(ref, () => ({ fly }), [fly]);

  useEffect(() => {
    if (!active) {
      setFlights([]);
      return;
    }

    let repeat: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      fly();
      repeat = setInterval(fly, interval);
    }, firstDelay);

    return () => {
      clearTimeout(start);
      if (repeat) clearInterval(repeat);
    };
  }, [active, fly, interval, firstDelay]);

  if (!active || flights.length === 0) return null;

  return (
    <>
      {flights.map((id) => (
        <div key={id} className="retro-narwhal-scene" aria-hidden="true">
          <div
            className="retro-narwhal-group"
            style={
              { '--retro-narwhal-duration': `${duration}ms` } as CSSProperties
            }
          >
            <div className="retro-narwhal__splash">💦</div>

            {rider && (
              <div className="retro-narwhal__rider">
                <div className="retro-narwhal__rider-body">
                  <div className="retro-narwhal__rider-visor">{riderVisor}</div>
                  <div className="retro-narwhal__rider-cape" />
                </div>
                <div className="retro-narwhal__rider-arms">{riderArms}</div>
              </div>
            )}

            <div className="retro-narwhal__body">
              <div className="retro-narwhal__horn" />
              <div className="retro-narwhal__head">
                <div className="retro-narwhal__eye" />
                <div className="retro-narwhal__mouth" />
                <div className="retro-narwhal__spot retro-narwhal__spot--1" />
                <div className="retro-narwhal__spot retro-narwhal__spot--2" />
                <div className="retro-narwhal__spot retro-narwhal__spot--3" />
              </div>
              <div className="retro-narwhal__belly" />
              <div className="retro-narwhal__flipper" />
              <div className="retro-narwhal__tail">
                <div className="retro-narwhal__tail-fin retro-narwhal__tail-fin--top" />
                <div className="retro-narwhal__tail-fin retro-narwhal__tail-fin--bottom" />
              </div>
            </div>

            <div className="retro-narwhal__rainbow" />

            <div className="retro-narwhal__sparkles">
              {SPARKLES.map((sparkle, index) => (
                <span
                  key={index}
                  className="retro-narwhal__sparkle"
                  style={{
                    top: `${sparkle.top}px`,
                    left: `${sparkle.left}px`,
                    animationDelay: `${sparkle.delay}s`,
                  }}
                >
                  {sparkle.glyph}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
  },
);
