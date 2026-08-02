import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Marquee } from './Marquee';
import { RetroProvider } from '../../providers/RetroProvider';

/** Makes `matchMedia` report a reduced-motion preference for one test. */
function preferReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('Marquee', () => {
  it('renders its content into the document', () => {
    preferReducedMotion(false);
    render(<Marquee>ALL YOUR BASE</Marquee>);
    expect(screen.getByText('ALL YOUR BASE')).toBeInTheDocument();
  });

  it('pauses on hover by default, satisfying WCAG 2.2.2', () => {
    preferReducedMotion(false);
    const { container } = render(<Marquee>scrolling</Marquee>);
    expect(container.firstChild).toHaveClass('retro-marquee--pause-on-hover');
  });

  it('can be paused programmatically', () => {
    preferReducedMotion(false);
    const { container } = render(<Marquee paused>scrolling</Marquee>);
    expect(container.firstChild).toHaveClass('retro-marquee--paused');
  });

  it('goes static — and stays readable — under reduced motion', () => {
    preferReducedMotion(true);
    const { container } = render(<Marquee>important information</Marquee>);

    expect(container.firstChild).toHaveClass('retro-marquee--static');
    expect(screen.getByText('important information')).toBeVisible();
  });

  it('honours forceMotion over the reduced-motion preference', () => {
    preferReducedMotion(true);
    const { container } = render(
      <RetroProvider forceMotion>
        <Marquee>chaos</Marquee>
      </RetroProvider>,
    );

    expect(container.querySelector('.retro-marquee')).not.toHaveClass(
      'retro-marquee--static',
    );
  });
});
