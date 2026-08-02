import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AnswerList } from './AnswerList/AnswerList';
import { FeedbackPanel } from './FeedbackPanel/FeedbackPanel';
import { ProgressMeter } from './ProgressMeter/ProgressMeter';
import { ScorePanel } from './ScorePanel/ScorePanel';
import { axe } from '../testing/axe';

const OPTIONS = [
  { id: 'a', children: 'Scale the node pool' },
  { id: 'b', children: 'Check pod resource requests' },
  { id: 'c', children: 'Restart the kubelet' },
];

describe('AnswerList', () => {
  it('is a real radiogroup with named radios', () => {
    render(<AnswerList legend="Pick one" options={OPTIONS} />);

    expect(screen.getByRole('group', { name: 'Pick one' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('selects on click and reports the choice', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <AnswerList legend="Pick one" options={OPTIONS} onChange={onChange} />,
    );

    await user.click(screen.getByRole('radio', { name: /Check pod resource/ }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('supports arrow-key navigation, which is why it uses native radios', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <AnswerList
        legend="Pick one"
        options={OPTIONS}
        value="a"
        onChange={onChange}
      />,
    );

    // Tab lands on the checked radio; arrows move within the group and select
    // as they go. None of this is implemented by the component — it comes from
    // the platform, which is the entire reason for using real inputs.
    await user.tab();
    expect(screen.getByRole('radio', { name: /Scale the node pool/ })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('locks the group once submitted', () => {
    render(<AnswerList legend="Pick one" options={OPTIONS} disabled />);
    screen.getAllByRole('radio').forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it('states the verdict in text, not only in colour', () => {
    render(
      <AnswerList
        legend="Pick one"
        disabled
        value="a"
        options={[
          { ...OPTIONS[0]!, state: 'incorrect' },
          { ...OPTIONS[1]!, state: 'revealed' },
          { ...OPTIONS[2]!, state: 'muted' },
        ]}
      />,
    );

    // A colour-blind or screen-reader user must still learn which was right.
    expect(
      screen.getByText('Incorrect. This is the answer you chose.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('This was the correct answer.'),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <AnswerList legend="Which command drains a node?" options={OPTIONS} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ProgressMeter', () => {
  it('exposes its position through ARIA', () => {
    render(<ProgressMeter value={3} max={12} label="Question 3 of 12" />);

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemax', '12');
  });

  it('clamps out-of-range values instead of overflowing the track', () => {
    render(<ProgressMeter value={99} max={10} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '10',
    );
  });

  it('survives a zero max rather than dividing by it', () => {
    render(<ProgressMeter value={0} max={0} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

describe('FeedbackPanel', () => {
  it('announces politely without stealing focus', () => {
    render(<FeedbackPanel correct explanation="Because of X." />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('CORRECT!')).toBeInTheDocument();
  });

  it('renders a reference link safely', () => {
    render(
      <FeedbackPanel
        correct={false}
        explanation="Not quite."
        reference={{ label: 'AKS docs', url: 'https://learn.microsoft.com/' }}
      />,
    );

    const link = screen.getByRole('link', { name: 'AKS docs' });
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <FeedbackPanel correct explanation="Because of X." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ScorePanel', () => {
  it('shows the score, percentage and per-category tally', () => {
    render(
      <ScorePanel
        score={7}
        total={10}
        breakdown={[
          { label: 'AKS', correct: 4, total: 5 },
          { label: 'Networking', correct: 3, total: 5 },
        ]}
      />,
    );

    expect(screen.getByText('7/10')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('AKS')).toBeInTheDocument();
    expect(screen.getByText('4/5')).toBeInTheDocument();
  });

  it('does not divide by zero on an empty quiz', () => {
    render(<ScorePanel score={0} total={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ScorePanel
        score={9}
        total={10}
        breakdown={[{ label: 'AKS', correct: 9, total: 10 }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
