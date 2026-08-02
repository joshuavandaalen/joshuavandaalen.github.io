import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { axe } from '../testing/axe';

import { Blink } from './typography/Blink';
import { DarkModeToggle } from './DarkModeToggle/DarkModeToggle';
import { RainbowText } from './typography/RainbowText';
import { ScheduleHeader, ScheduleRow, ScheduleTable, TimeCell, ScheduleCell } from './Schedule/Schedule';
import { VisitorCounter } from './VisitorCounter/VisitorCounter';
import { Legend, LegendItem } from './Legend/Legend';
import { Window95 } from './Window95/Window95';

describe('Blink', () => {
  it('rests visible, so stripping the animation leaves text readable', () => {
    render(<Blink>IMPORTANT</Blink>);
    // The original's keyframes ended at opacity 0; disabling the animation
    // there left the text permanently invisible.
    expect(screen.getByText('IMPORTANT')).toBeVisible();
  });
});

describe('RainbowText', () => {
  it('exposes the whole word, not one letter at a time', () => {
    render(<RainbowText>WELCOME</RainbowText>);
    // Per-character spans are hidden; a single readable copy remains.
    expect(screen.getByText('WELCOME')).toBeInTheDocument();
  });
});

describe('Schedule', () => {
  it('marks time cells as row headers so sessions announce their slot', () => {
    render(
      <ScheduleTable caption="Day one">
        <ScheduleHeader tracks={['Main Hall']} />
        <tbody>
          <ScheduleRow>
            <TimeCell time="10:15" duration="(45 min.)" />
            <ScheduleCell track={1}>A talk</ScheduleCell>
          </ScheduleRow>
        </tbody>
      </ScheduleTable>,
    );

    expect(screen.getByRole('rowheader', { name: /10:15/ })).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Main Hall' }),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ScheduleTable caption="Conference schedule">
        <ScheduleHeader tracks={['Main Hall', 'Swanston Room']} />
        <tbody>
          <ScheduleRow>
            <TimeCell time="09:00" />
            <ScheduleCell track={1}>Keynote</ScheduleCell>
            <ScheduleCell track={2}>Workshop</ScheduleCell>
          </ScheduleRow>
        </tbody>
      </ScheduleTable>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('DarkModeToggle', () => {
  it('labels the destination rather than the current state', async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle defaultTheme="dark" />);

    // The original read "☀️ LIGHT" while already dark, describing the current
    // theme in the label and the destination in the icon.
    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toHaveTextContent('LIGHT');

    await user.click(button);

    expect(
      screen.getByRole('button', { name: /switch to dark mode/i }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute(
      'data-retro-theme',
      'light',
    );
  });
});

describe('VisitorCounter', () => {
  it('announces politely instead of re-reading every digit', () => {
    render(<VisitorCounter count={42} />);
    const display = screen.getByText('000042');
    expect(display).toHaveAttribute('aria-live', 'polite');
  });
});

describe('Window95', () => {
  it('gives its controls real buttons with accessible names', async () => {
    const { container } = render(
      <Window95 title="Advertisement">content</Window95>,
    );

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Minimize' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Legend', () => {
  it('renders the key the original stylesheet defined but never used', async () => {
    const { container } = render(
      <Legend>
        <LegendItem swatch="#ff8a65" label="Keynote" />
        <LegendItem swatch="#fff59d" label="Lightning talk" />
      </Legend>,
    );

    expect(screen.getByText('Keynote')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
