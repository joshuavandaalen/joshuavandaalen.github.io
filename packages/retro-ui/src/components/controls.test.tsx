import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CoolButton } from './CoolButton/CoolButton';
import { NavButton } from './NavBar/NavBar';
import { RetroLink } from './typography/RetroLink';
import { SessionCard } from './Schedule/Schedule';

describe('CoolButton', () => {
  it('is a button by default, so keyboards can reach it', () => {
    render(<CoolButton>CLICK ME</CoolButton>);
    expect(screen.getByRole('button', { name: 'CLICK ME' })).toBeInTheDocument();
  });

  it('becomes a link when given an href', () => {
    render(<CoolButton href="/agenda">AGENDA</CoolButton>);
    const link = screen.getByRole('link', { name: 'AGENDA' });
    expect(link).toHaveAttribute('href', '/agenda');
  });

  it('marks a disabled link with aria-disabled, since links cannot be disabled', () => {
    render(
      <CoolButton href="/soon" disabled>
        2026 AGENDA
      </CoolButton>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('NavButton', () => {
  it('reports the current page to assistive technology', () => {
    render(
      <NavButton href="/agenda" active>
        AGENDA
      </NavButton>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });
});

describe('RetroLink', () => {
  it('adds noopener when it opens a new tab', () => {
    render(
      <RetroLink href="https://example.com" external>
        offsite
      </RetroLink>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('leaves same-tab links alone', () => {
    render(<RetroLink href="/local">local</RetroLink>);
    expect(screen.getByRole('link')).not.toHaveAttribute('target');
  });
});

describe('SessionCard', () => {
  it('stays a plain div when it does nothing', () => {
    render(<SessionCard title="A talk" speaker="A speaker" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('A talk')).toBeInTheDocument();
  });

  it('becomes a real button when selectable, and responds to the keyboard', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(<SessionCard title="A talk" onSelect={onSelect} />);

    const card = screen.getByRole('button', { name: /A talk/ });
    await user.tab();
    expect(card).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
