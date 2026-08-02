import { useEffect, useState } from 'react';

import { useRetroContext } from '../providers/RetroProvider';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * True when the visitor has asked for reduced motion *and* the app has not
 * opted back in via `<RetroProvider forceMotion>`.
 *
 * CSS handles most of the policy on its own. This hook exists for the cases
 * CSS cannot express: components whose entire purpose is movement — mascots,
 * sparkle emitters, the marquee — need to change what they *render*, not just
 * stop animating.
 */
export function useReducedMotion(): boolean {
  const { forceMotion } = useRetroContext();
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const media = window.matchMedia(QUERY);
    setPrefersReduced(media.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    // Safari below 14 only has the deprecated listener API.
    if (media.addEventListener) {
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  return prefersReduced && !forceMotion;
}
