import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { AnswerList } from '../components/AnswerList/AnswerList';
import { ContentBox } from '../components/ContentBox/ContentBox';
import { CoolButton } from '../components/CoolButton/CoolButton';
import { FeedbackPanel } from '../components/FeedbackPanel/FeedbackPanel';
import { ProgressMeter } from '../components/ProgressMeter/ProgressMeter';
import { ScorePanel } from '../components/ScorePanel/ScorePanel';
import { SectionTitle } from '../components/typography/SectionTitle';

const meta = {
  title: 'Catalog/Quiz primitives',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The only components in the kit not extracted from the original site — it had no form controls, no progress indicator and no result display. These were added when the demo app proved the gap.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="retro-root" style={{ padding: 20 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  { id: 'a', children: 'Increase the pod CPU limit' },
  { id: 'b', children: 'Check whether the node pool has allocatable capacity' },
  { id: 'c', children: 'Restart the kubelet on each node' },
  { id: 'd', children: 'Recreate the Deployment' },
];

/** Try the arrow keys — the group is real radios, so navigation is free. */
export const Answering: Story = {
  render: function AnsweringStory() {
    const [value, setValue] = useState<string | null>(null);

    return (
      <ContentBox>
        <ProgressMeter value={3} max={12} label="Question 3 of 12" />
        <SectionTitle>
          Pods sit in Pending after a node-pool upgrade. What do you check first?
        </SectionTitle>
        <AnswerList
          legend="Pods sit in Pending after a node-pool upgrade. What do you check first?"
          hideLegend
          options={OPTIONS}
          value={value}
          onChange={setValue}
        />
        <div className="retro-center">
          <CoolButton disabled={!value}>SUBMIT ANSWER</CoolButton>
        </div>
      </ContentBox>
    );
  },
};

/** Graded state. Note the mark glyphs — colour is never the only signal. */
export const Graded: Story = {
  render: () => (
    <ContentBox>
      <ProgressMeter value={3} max={12} label="Question 3 of 12" />
      <SectionTitle>
        Pods sit in Pending after a node-pool upgrade. What do you check first?
      </SectionTitle>
      <AnswerList
        legend="Graded question"
        hideLegend
        disabled
        value="a"
        options={[
          { ...OPTIONS[0]!, state: 'incorrect' },
          { ...OPTIONS[1]!, state: 'revealed' },
          { ...OPTIONS[2]!, state: 'muted' },
          { ...OPTIONS[3]!, state: 'muted' },
        ]}
      />
      <FeedbackPanel
        correct={false}
        explanation="Pending almost always means the scheduler cannot place the pod. Check allocatable capacity, taints and node selectors before touching limits — raising a CPU limit makes placement harder, not easier."
        reference={{
          label: 'Kubernetes — Pod scheduling',
          url: 'https://kubernetes.io/docs/concepts/scheduling-eviction/',
        }}
      />
    </ContentBox>
  ),
};

export const CorrectAnswer: Story = {
  render: () => (
    <ContentBox>
      <AnswerList
        legend="Graded question"
        hideLegend
        disabled
        value="b"
        options={[
          { ...OPTIONS[0]!, state: 'muted' },
          { ...OPTIONS[1]!, state: 'correct' },
          { ...OPTIONS[2]!, state: 'muted' },
          { ...OPTIONS[3]!, state: 'muted' },
        ]}
      />
      <FeedbackPanel
        correct
        explanation="Right — start with why the scheduler cannot place the pod."
        reference={{
          label: 'Kubernetes — Pod scheduling',
          url: 'https://kubernetes.io/docs/concepts/scheduling-eviction/',
        }}
      />
    </ContentBox>
  ),
};

export const Progress: Story = {
  render: () => (
    <ContentBox>
      <ProgressMeter value={0} max={12} label="Not started" />
      <ProgressMeter value={5} max={12} label="Question 5 of 12" />
      <ProgressMeter value={12} max={12} label="Complete" />
    </ContentBox>
  ),
};

export const Results: Story = {
  render: () => (
    <ContentBox>
      <ScorePanel
        score={9}
        total={12}
        breakdown={[
          { label: 'AKS', correct: 3, total: 3 },
          { label: 'Kubernetes networking', correct: 2, total: 3 },
          { label: 'Identity & RBAC', correct: 2, total: 3 },
          { label: 'Observability', correct: 2, total: 3 },
        ]}
      />
    </ContentBox>
  ),
};

/** Every grade band, so the wording can be reviewed at a glance. */
export const GradeBands: Story = {
  render: () => (
    <>
      {[
        [12, 12],
        [9, 12],
        [7, 12],
        [4, 12],
        [1, 12],
      ].map(([score, total]) => (
        <ContentBox key={score}>
          <ScorePanel score={score!} total={total!} />
        </ContentBox>
      ))}
    </>
  ),
};
