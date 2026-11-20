import { useMemo, type CSSProperties, type HTMLAttributes } from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx } from '../../utils/cx';

export interface StarfieldBackgroundProps
  extends HTMLAttributes<HTMLDivElement> {
  /** How many stars to scatter. */
  density?: number;
  /** Colours drawn from at random. */
  starColors?: string[];
  /**
   * Twinkle the stars. The original site advertised an animated starfield in
   * its README but shipped a static SVG tile and an empty `.stars` div — this
   * is the animation that was promised.
   */
  twinkle?: boolean;
  /** The 45° diagonal hatch behind the stars. */
  stripes?: boolean;
  /** Seed the layout so server and client renders agree. */
  seed?: number;
}

interface Star {
  top: number;
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

// Module scope so the default does not change identity between renders and
// force the star layout to be recomputed for nothing.
const DEFAULT_STAR_COLORS = ['#ffffff', '#ffff00', '#00ffff'];

/**
 * A deterministic PRNG so the same `seed` always produces the same sky.
 *
 * `Math.random` would place stars differently on the server and the client,
 * which React reports as a hydration mismatch.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function StarfieldBackground({
  density = 120,
  starColors = DEFAULT_STAR_COLORS,
  twinkle = true,
  stripes = true,
  seed = 1997,
  className,
  style,
  ...rest
}: StarfieldBackgroundProps) {
  const reducedMotion = useReducedMotion();

  const stars = useMemo<Star[]>(() => {
    const random = mulberry32(seed);
    return Array.from({ length: density }, () => ({
      top: random() * 100,
      left: random() * 100,
      size: random() * 2 + 1,
      color: starColors[Math.floor(random() * starColors.length)] ?? '#ffffff',
      delay: random() * 3,
      duration: 2 + random() * 3,
    }));
  }, [density, seed, starColors]);

  return (
    <div
      aria-hidden="true"
      className={cx(
        'retro-starfield',
        twinkle && !reducedMotion && 'retro-starfield--twinkle',
        className,
      )}
      style={
        {
          ...(stripes ? {} : { backgroundImage: 'none' }),
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {stars.map((star, index) => (
        <span
          key={index}
          className="retro-starfield__star"
          style={
            {
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: star.color,
              '--retro-star-delay': `${star.delay}s`,
              '--retro-star-duration': `${star.duration}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
