import type { Meta, StoryObj } from '@storybook/react';

import { ContentBox } from '../components/ContentBox/ContentBox';
import { SectionTitle } from '../components/typography/SectionTitle';
import {
  ChangeoverRow,
  FullWidthEvent,
  ScheduleCell,
  ScheduleHeader,
  ScheduleRow,
  ScheduleTable,
  SessionCard,
  TimeCell,
} from '../components/Schedule/Schedule';

const TRACKS = [
  '🎪 MAIN HALL',
  '🏛️ SWANSTON ROOM',
  '🍽️ SUPPER ROOM',
  '🌊 YARRA ROOM',
  '🏙️ HODDLE ROOM',
];

const meta = {
  title: 'Catalog/Schedule',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The conference grid. A real `<table>` with `<th scope>` on both axes — the 90s used tables for layout, which was wrong, but tabular data is the one thing they were always right for.',
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

export const FullDay: Story = {
  render: () => (
    <ContentBox>
      <SectionTitle>🌟 CONFERENCE DAY SCHEDULE 🌟</SectionTitle>

      <ScheduleTable caption="Conference schedule — Saturday 21 February">
        <ScheduleHeader tracks={TRACKS} />
        <tbody>
          <ScheduleRow variant="special">
            <TimeCell time="08:00" />
            <FullWidthEvent title="☕ REGISTRATION ☕" colSpan={5} />
          </ScheduleRow>

          <ScheduleRow variant="special">
            <TimeCell time="08:45" />
            <FullWidthEvent
              title="🎤 WELCOME & HOUSEKEEPING 🎤"
              location="📍 Main Hall"
              colSpan={5}
            />
          </ScheduleRow>

          <ScheduleRow>
            <TimeCell time="09:00" duration="(45 min.)" />
            <ScheduleCell colSpan={5} fullWidth>
              <SessionCard
                variant="keynote"
                title="🎯 KEYNOTE: Emerging trends in robotics"
                speaker="A Keynote Speaker"
                location="📍 Main Hall"
                onSelect={() => {}}
              />
            </ScheduleCell>
          </ScheduleRow>

          <ScheduleRow variant="special">
            <TimeCell time="09:45" />
            <FullWidthEvent title="🍵 MORNING TEA 🍵" colSpan={5} />
          </ScheduleRow>

          <ScheduleRow>
            <TimeCell time="10:15" duration="(45 min.)" />
            <ScheduleCell track={1}>
              <SessionCard
                title="Are you overcomplicating software development?"
                speaker="Speaker One"
                onSelect={() => {}}
              />
            </ScheduleCell>
            <ScheduleCell track={2}>
              <SessionCard
                title="All your secrets are belong to us"
                speaker="Speaker Two"
                onSelect={() => {}}
              />
            </ScheduleCell>
            <ScheduleCell track={3}>
              <SessionCard
                title="Building modular components through atomic design"
                speaker="Speaker Three"
                onSelect={() => {}}
              />
            </ScheduleCell>
            <ScheduleCell track={4}>
              <SessionCard
                variant="lightning"
                title="⚡ Lightning: From Gitflow to Continuous Deployment"
                speaker="Speaker Four"
                onSelect={() => {}}
              />
            </ScheduleCell>
            <ScheduleCell track={5}>
              <SessionCard
                title="Beginner's Guide to Event Storming"
                speaker="Speaker Five"
                onSelect={() => {}}
              />
            </ScheduleCell>
          </ScheduleRow>

          <ChangeoverRow time="11:00" colSpan={5} />

          <ScheduleRow variant="party">
            <TimeCell time="17:00" />
            <FullWidthEvent
              title="🎉 AFTER PARTY 🎉"
              description="Drinks, snacks and strong opinions about bounded contexts."
              location="📍 Foyer"
              colSpan={5}
            />
          </ScheduleRow>
        </tbody>
      </ScheduleTable>
    </ContentBox>
  ),
};

/** All five room tints side by side. */
export const TrackTints: Story = {
  render: () => (
    <ContentBox>
      <ScheduleTable caption="Track colour coding" hideCaption>
        <ScheduleHeader tracks={TRACKS} />
        <tbody>
          <ScheduleRow>
            <TimeCell time="10:15" duration="(45 min.)" />
            {[1, 2, 3, 4, 5].map((track) => (
              <ScheduleCell key={track} track={track as 1 | 2 | 3 | 4 | 5}>
                <SessionCard title={`Track ${track}`} speaker="A speaker" />
              </ScheduleCell>
            ))}
          </ScheduleRow>
        </tbody>
      </ScheduleTable>
    </ContentBox>
  ),
};

/** Keynote, lightning and standard session cards. */
export const SessionVariants: Story = {
  render: () => (
    <ContentBox>
      <div style={{ display: 'grid', gap: 20, maxWidth: 400 }}>
        <SessionCard title="Standard session" speaker="A speaker" />
        <SessionCard
          variant="keynote"
          title="🎯 Keynote session"
          speaker="A keynote speaker"
          location="📍 Main Hall"
        />
        <SessionCard
          variant="lightning"
          title="⚡ Lightning talk"
          speaker="A brisk speaker"
        />
      </div>
    </ContentBox>
  ),
};
