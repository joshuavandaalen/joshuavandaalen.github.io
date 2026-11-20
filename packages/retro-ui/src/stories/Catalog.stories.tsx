import type { Meta, StoryObj } from '@storybook/react';

import { Badge, BadgeRow } from '../components/Badge/Badge';
import { BrowserBanner } from '../components/BrowserBanner/BrowserBanner';
import { ConstructionBanner } from '../components/ConstructionBanner/ConstructionBanner';
import { ContentBox } from '../components/ContentBox/ContentBox';
import { CoolButton } from '../components/CoolButton/CoolButton';
import { DateItem, DateList } from '../components/DateList/DateList';
import { FlashBanner } from '../components/FlashBanner/FlashBanner';
import { GlowingTitle } from '../components/typography/GlowingTitle';
import { Highlight } from '../components/typography/Highlight';
import { Legend, LegendItem } from '../components/Legend/Legend';
import { NavBar, NavButton } from '../components/NavBar/NavBar';
import { RainbowBar } from '../components/RainbowBar/RainbowBar';
import { RainbowText } from '../components/typography/RainbowText';
import { RetroLink } from '../components/typography/RetroLink';
import { SectionTitle } from '../components/typography/SectionTitle';
import { Blink } from '../components/typography/Blink';
import { TextPanel } from '../components/typography/TextPanel';
import { VisitorCounter } from '../components/VisitorCounter/VisitorCounter';
import { WebRing } from '../components/WebRing/WebRing';
import { Webmaster } from '../components/Webmaster/Webmaster';
import {
  ServiceSponsorSection,
  SponsorCard,
  SponsorGrid,
  SponsorTier,
} from '../components/Sponsors/Sponsors';
import {
  TitleSponsorBanner,
  TitleSponsorTier,
} from '../components/TitleSponsorBanner/TitleSponsorBanner';

const meta = {
  title: 'Catalog/Everything',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every component in the kit, grouped by concern. Each one is extracted from the original DDD Melbourne 90s site.',
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

export const Typography: Story = {
  render: () => (
    <ContentBox>
      <GlowingTitle>✨🎉 GLOWING TITLE 🎉✨</GlowingTitle>
      <SectionTitle>SECTION TITLE</SectionTitle>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <RainbowText>RAINBOW TEXT</RainbowText>
      </div>
      <TextPanel variant="intro">
        An <Highlight>INCLUSIVE</Highlight> non-profit conference for the{' '}
        <Highlight>SOFTWARE COMMUNITY</Highlight>. Some of this text{' '}
        <Blink>BLINKS</Blink>, and here is a{' '}
        <RetroLink href="https://example.com" external>
          link that opens elsewhere
        </RetroLink>
        .
      </TextPanel>
      <TextPanel variant="fun">The dashed-border aside variant.</TextPanel>
      <TextPanel variant="note">
        Note: all dates in Australia/Melbourne time.
      </TextPanel>
      <RainbowBar />
    </ContentBox>
  ),
};

export const Banners: Story = {
  render: () => (
    <>
      <FlashBanner
        title="RETRO UI KIT"
        subtitle="★ THE ULTIMATE COMPONENT LIBRARY ★"
      />
      <BrowserBanner preset="netscape" />
      <BrowserBanner preset="resolution" icon="🖥️" />
      <ConstructionBanner />
    </>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <>
      <ContentBox>
        <SectionTitle>Default</SectionTitle>
        <TextPanel variant="intro">Cyan gradient with a rainbow halo.</TextPanel>
      </ContentBox>
      <ContentBox variant="highlight" pulse>
        <SectionTitle>Highlight</SectionTitle>
        <TextPanel variant="intro">Pink gradient, and it breathes.</TextPanel>
      </ContentBox>
      <ContentBox variant="gold">
        <SectionTitle>Gold</SectionTitle>
        <TextPanel variant="intro">For web rings and awards.</TextPanel>
      </ContentBox>
    </>
  ),
};

export const Controls: Story = {
  render: () => (
    <ContentBox>
      <NavBar label="Example">
        <NavButton href="#">🏠 HOME</NavButton>
        <NavButton href="#" active>
          📅 AGENDA
        </NavButton>
        <NavButton href="#" disabled>
          ⏭️ 2026
        </NavButton>
      </NavBar>

      <div
        style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: 30,
        }}
      >
        <CoolButton float>📅 FIRE (FLOATING)</CoolButton>
        <CoolButton variant="gold">🥇 GOLD</CoolButton>
        <CoolButton variant="diamond">💎 DIAMOND</CoolButton>
        <CoolButton variant="grass" size="sm">
          SMALL
        </CoolButton>
        <CoolButton disabled>DISABLED</CoolButton>
      </div>
    </ContentBox>
  ),
};

export const DataDisplay: Story = {
  render: () => (
    <ContentBox>
      <SectionTitle>🗓️ IMPORTANT DATES 🗓️</SectionTitle>
      <DateList>
        <DateItem
          day="SAT"
          date="FEB 21"
          title="🎊 Conference Day 🎊"
          detail="09:00 AM - The BIG day arrives!"
          dateTime="2026-02-21T09:00"
        />
        <DateItem
          day="TUE"
          date="JUL 15"
          title="🎟️ Ticket Sales Open"
          detail="11:00 AM - Get your tickets!"
          dateTime="2026-07-15T11:00"
        />
      </DateList>

      <BadgeRow>
        <Badge>GeoCities Certified™</Badge>
        <Badge>HTML 4.0!</Badge>
        <Badge variant="silver">Made with ❤️</Badge>
        <Badge variant="dark">Est. 1999*</Badge>
      </BadgeRow>

      <VisitorCounter count={123456} />

      <Legend>
        <LegendItem
          swatch="linear-gradient(135deg, #ffccbc, #ff8a65)"
          label="Keynote"
        />
        <LegendItem
          swatch="linear-gradient(135deg, #fff9c4, #fff59d)"
          label="Lightning talk"
        />
        <LegendItem
          swatch="linear-gradient(135deg, #81c784, #66bb6a)"
          label="All-hands event"
        />
        <LegendItem
          swatch="linear-gradient(135deg, #ffebee, #ffcdd2)"
          label="Track session"
        />
      </Legend>
    </ContentBox>
  ),
};

export const Sponsors: Story = {
  render: () => (
    <ContentBox>
      <SectionTitle>💎 SPONSORS 💎</SectionTitle>

      <div style={{ textAlign: 'center' }}>
        <TitleSponsorTier accentColor="#cc0000">
          🏭⚙️ TITLE SPONSOR ⚙️🏭
        </TitleSponsorTier>
      </div>
      <TitleSponsorBanner
        logo="ACME"
        sublogo="WIDGETS INC"
        tagline="⚡ Industry-Leading Widgets ⚡ Precision Engineering ⚡"
        cta="★ CLICK HERE ★"
        details="to visit acme.example — Advanced Widget Technology!"
        badges={['🇦🇺 Made Locally', '🌏 Global Leader', '🏆 Award Winning']}
        accentColor="#cc0000"
        accentBright="#ff3333"
        accentDark="#990000"
        href="https://example.com"
      />

      <SponsorTier tier="diamond" title="💎 DIAMOND SPONSOR 💎">
        <SponsorGrid single>
          <SponsorCard
            name="Diamond Co"
            tier="diamond"
            href="https://example.com"
            hoverText="★ CLICK ME! ★"
          />
        </SponsorGrid>
      </SponsorTier>

      <SponsorTier tier="platinum" title="🏆 PLATINUM SPONSORS 🏆">
        <SponsorGrid>
          <SponsorCard name="Platinum One" tier="platinum" hoverText="★ CLICK ME! ★" />
          <SponsorCard name="Platinum Two" tier="platinum" hoverText="★ CLICK ME! ★" />
        </SponsorGrid>
      </SponsorTier>

      <SponsorTier tier="gold" title="🥇 GOLD SPONSORS 🥇">
        <SponsorGrid>
          <SponsorCard name="Gold One" tier="gold" />
          <SponsorCard name="Gold Two" tier="gold" />
          <SponsorCard name="Gold Three" tier="gold" />
        </SponsorGrid>
      </SponsorTier>

      <SponsorTier tier="service" title="🎁 SERVICE SPONSORS 🎁">
        <ServiceSponsorSection category="📡 Wi-Fi by:">
          <SponsorGrid>
            <SponsorCard name="Network Co" tier="silver" />
          </SponsorGrid>
        </ServiceSponsorSection>
        <ServiceSponsorSection category="☕ Coffee Cart by:">
          <SponsorGrid>
            <SponsorCard name="Bean Co" tier="silver" />
            <SponsorCard name="Roast Co" tier="silver" />
          </SponsorGrid>
        </ServiceSponsorSection>
      </SponsorTier>
    </ContentBox>
  ),
};

export const CommunityFurniture: Story = {
  name: 'Web ring & webmaster',
  render: () => (
    <>
      <ContentBox variant="gold">
        <WebRing
          name="MELBOURNE TECH WEB RING"
          description="This site is part of the ULTRA COOL Melbourne Tech Conference Ring!"
          members={[
            'NDC Melbourne',
            'YOW! Conference',
            'Compose Conference',
            'DDD Perth',
            'DDD Brisbane',
            'Container Camp',
          ]}
          onPrevious={() => {}}
          onRandom={() => {}}
          onNext={() => {}}
        />
      </ContentBox>

      <ContentBox variant="highlight">
        <SectionTitle>👨‍💻 WEBMASTER EXTRAORDINAIRE 👨‍💻</SectionTitle>
        <Webmaster
          name="PAT SMITH"
          titles="Keeper of the Sacred HTML • Master of the Marquee • Guardian of the GIFs"
          email="webmaster@example.com"
        />
      </ContentBox>
    </>
  ),
};
