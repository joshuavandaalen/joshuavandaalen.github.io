/**
 * Single source of truth for the naming shown across the site.
 *
 * The package is deliberately unpublished and carries a placeholder name until
 * a real one is chosen — so the docs say so plainly rather than printing an
 * install command that cannot work.
 */
export const PACKAGE_NAME = 'retro-ui-kit-PLACEHOLDER';

export const PRODUCT_NAME = 'Retro UI';

export const TAGLINE =
  'A component library for the early internet.';

export const DESCRIPTION =
  'Marquees, bevels, rainbow gradients and Windows 95 dialogs — extracted from a real GeoCities-era site, rebuilt as typed React components with a design-token layer that works without React.';

export const IS_PUBLISHED = false;

export const LINKS = {
  github: 'https://github.com/joshuavandaalen/joshuavandaalen.github.io',
  storybook: '/storybook/',
  quiz: '/quiz/',
  retro: '/retro/',
};

/** Headline numbers, kept honest against the generated API where possible. */
export const STATS = [
  { value: '58', label: 'components & hooks' },
  { value: '0', label: 'runtime dependencies' },
  { value: '42', label: 'keyframe animations' },
  { value: '11 kB', label: 'gzipped CSS' },
];
