import type { Meta, StoryObj } from '@storybook/react';

import { Marquee } from './Marquee';

const meta = {
  title: 'Typography/Marquee',
  component: Marquee,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A replacement for the obsolete `<marquee>` element. Unlike the real thing it reflows on resize, can be paused, and stops entirely under `prefers-reduced-motion`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 600,
          maxWidth: '100%',
          border: '3px ridge #ffd700',
          padding: 12,
          background: '#000080',
          color: '#00ff00',
          fontFamily: "'Comic Sans MS', cursive",
          fontWeight: 'bold',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scroll: Story = {
  args: {
    behavior: 'scroll',
    direction: 'left',
    scrollAmount: 6,
    children: '🌟 The MOST AWESOME Tech Conference in the Universe! 🌟',
  },
};

export const ScrollRight: Story = {
  args: {
    behavior: 'scroll',
    direction: 'right',
    scrollAmount: 5,
    children: '⚡ Now travelling the other way ⚡',
  },
};

/** Bounces between the two edges instead of wrapping around. */
export const Alternate: Story = {
  args: {
    behavior: 'alternate',
    scrollAmount: 3,
    children: '⚡ BEST VIEWED IN NETSCAPE NAVIGATOR 4.0+ ⚡',
  },
};

/** Enters once and stops flush against the far edge. */
export const Slide: Story = {
  args: {
    behavior: 'slide',
    scrollAmount: 8,
    children: 'Arrives, then stays put.',
  },
};

export const Vertical: Story = {
  args: {
    behavior: 'scroll',
    direction: 'up',
    scrollAmount: 3,
    children: 'Going up',
    style: { height: 120 },
  },
};

/** Hover to freeze — the pause mechanism WCAG 2.2.2 requires. */
export const PausedOnHover: Story = {
  args: {
    pauseOnHover: true,
    children: 'Hover me and I will stop moving.',
  },
};
