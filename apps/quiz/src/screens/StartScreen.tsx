import { useState } from 'react';
import {
  AnswerList,
  Badge,
  BadgeRow,
  ContentBox,
  CoolButton,
  Highlight,
  Marquee,
  SectionTitle,
  TextPanel,
} from 'retro-ui-kit-PLACEHOLDER';

import { azureQuestions } from '../data/azure';
import { kubernetesQuestions } from '../data/kubernetes';
import type { TopicFilter } from '../quiz/useQuiz';

export interface StartScreenProps {
  onStart: (topic: TopicFilter, count: number) => void;
}

const LENGTHS = [5, 10, 20];

export function StartScreen({ onStart }: StartScreenProps) {
  const [topic, setTopic] = useState<TopicFilter>('both');
  const [count, setCount] = useState(10);

  const available =
    topic === 'azure'
      ? azureQuestions.length
      : topic === 'kubernetes'
        ? kubernetesQuestions.length
        : azureQuestions.length + kubernetesQuestions.length;

  return (
    <ContentBox>
      <Marquee behavior="alternate" scrollAmount={4}>
        <SectionTitle>☁️ SENIOR DEVOPS INTERVIEW PREP ☁️</SectionTitle>
      </Marquee>

      <TextPanel variant="intro">
        Practice questions for a <Highlight>Senior DevOps</Highlight> technical
        interview, covering <Highlight>Azure</Highlight> and{' '}
        <Highlight>Kubernetes</Highlight>. Every answer comes with an
        explanation and a link to the official documentation, so a wrong guess
        is worth as much as a right one.
      </TextPanel>

      <AnswerList
        legend="Choose your topic"
        value={topic}
        onChange={(id) => setTopic(id as TopicFilter)}
        options={[
          { id: 'both', children: '🌏 Both — Azure and Kubernetes' },
          { id: 'azure', children: '☁️ Azure only' },
          { id: 'kubernetes', children: '⎈ Kubernetes only' },
        ]}
      />

      <AnswerList
        legend="How many questions?"
        value={String(count)}
        onChange={(id) => setCount(Number(id))}
        options={LENGTHS.map((n) => ({
          id: String(n),
          children:
            n > available
              ? `${n} questions (only ${available} available)`
              : `${n} questions`,
        }))}
      />

      <BadgeRow>
        <Badge>{azureQuestions.length} Azure questions</Badge>
        <Badge variant="silver">
          {kubernetesQuestions.length} Kubernetes questions
        </Badge>
        <Badge>Answers cited to the docs</Badge>
      </BadgeRow>

      {/* Deliberately not `float`. A permanently-animating primary action is a
          moving target — harder to hit with a mouse, materially harder with a
          motor impairment, and Playwright refuses to click it at all. `float`
          is fine for decoration; it is the wrong choice for the main CTA. */}
      <div className="retro-center">
        <CoolButton size="lg" onClick={() => onStart(topic, count)}>
          ▶️ START THE QUIZ ▶️
        </CoolButton>
      </div>
    </ContentBox>
  );
}
