import { axe as runAxe } from 'vitest-axe';

/**
 * axe with the rules jsdom cannot honestly evaluate turned off.
 *
 * `color-contrast` needs real layout and a canvas to sample rendered pixels;
 * jsdom has neither, so the rule both floods stderr with
 * `HTMLCanvasElement.prototype.getContext is not implemented` and returns a
 * result that means nothing. Contrast on this kit is a design question best
 * checked in Storybook's a11y panel, against an actual rendering engine.
 */
export const axe: typeof runAxe = (html, options) =>
  runAxe(html, {
    ...options,
    rules: {
      'color-contrast': { enabled: false },
      ...options?.rules,
    },
  });
