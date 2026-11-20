import type { Meta, StoryObj } from '@storybook/react';

import { Badge, BadgeRow } from '../components/Badge/Badge';
import { Blink } from '../components/typography/Blink';
import { BrowserBanner } from '../components/BrowserBanner/BrowserBanner';
import { ConstructionBanner } from '../components/ConstructionBanner/ConstructionBanner';
import { ContentBox } from '../components/ContentBox/ContentBox';
import { CoolButton } from '../components/CoolButton/CoolButton';
import { DateItem, DateList } from '../components/DateList/DateList';
import { FlashBanner } from '../components/FlashBanner/FlashBanner';
import { FlyingSquirrel } from '../components/mascots/FlyingSquirrel';
import { FooterLinks } from '../components/FooterLinks/FooterLinks';
import { GlowingTitle } from '../components/typography/GlowingTitle';
import { Highlight } from '../components/typography/Highlight';
import { Marquee } from '../components/Marquee/Marquee';
import { MidiPlayer } from '../components/MidiPlayer/MidiPlayer';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { RetroLink } from '../components/typography/RetroLink';
import { RetroProvider } from '../providers/RetroProvider';
import { SectionTitle } from '../components/typography/SectionTitle';
import { SiteFooter } from '../components/SiteFooter/SiteFooter';
import { SiteHeader } from '../components/SiteHeader/SiteHeader';
import { SparkleEmitter } from '../components/SparkleEmitter/SparkleEmitter';
import { StarfieldBackground } from '../components/StarfieldBackground/StarfieldBackground';
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
  title: 'Catalog/Full Page',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The original homepage, rebuilt from kit components alone. This is the coverage proof: if a piece of the source site cannot be expressed here, the kit is missing something. Compare against `ddd-homepage.png` in the repository root.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const GOLD_SPONSORS = [
  'Widget Corp',
  'Sprocket Ltd',
  'Cog & Co',
  'Gizmo Group',
  'Doohickey Inc',
  'Thingamajig AG',
];

function Homepage() {
  return (
    <>
      <StarfieldBackground density={150} />
      <FlyingSquirrel />
      <SparkleEmitter />

      <PageContainer>
        <FlashBanner
          title="RETRO CONF 2026"
          subtitle="★ THE ULTIMATE DEVELOPER CONFERENCE ★"
        />

        <BrowserBanner preset="netscape" />

        <SiteHeader subtitle="🌟 The MOST AWESOME Tech Conference in the Universe! 🌟 Inclusive! Non-Profit! Community Driven! 🌟">
          <GlowingTitle>✨🎉 RETRO CONF 🎉✨</GlowingTitle>
        </SiteHeader>

        <div className="retro-center">
          <ConstructionBanner />
        </div>

        <main>
          <ContentBox>
            <Marquee behavior="alternate" scrollAmount={4}>
              <SectionTitle>✨ WELCOME TO RETRO CONF! ✨</SectionTitle>
            </Marquee>

            <TextPanel variant="intro">
              Retro Conf is an <Highlight>INCLUSIVE</Highlight> non-profit
              conference for the <Highlight>SOFTWARE COMMUNITY</Highlight>! Our
              goal is to create an approachable event that appeals to the{' '}
              <Blink>WHOLE COMMUNITY</Blink>, especially people who usually
              don't have the opportunity to attend, or speak at, conferences.
            </TextPanel>

            <div className="retro-center">
              <CoolButton href="#agenda" float>
                📅 CHECK OUT THE AGENDA! 📅
              </CoolButton>
            </div>
          </ContentBox>

          <ContentBox>
            <Marquee direction="right" scrollAmount={5}>
              <SectionTitle>🗓️ IMPORTANT DATES 🗓️</SectionTitle>
            </Marquee>

            <TextPanel variant="note">
              Note: All dates in Australia/Melbourne time.
            </TextPanel>

            <DateList>
              <DateItem
                day="SAT"
                date="FEB 21"
                title="🎊 Conference Day 🎊"
                detail="09:00 AM - The BIG day arrives!"
              />
              <DateItem
                day="TUE"
                date="JUL 15"
                title="🎟️ Ticket Sales Open"
                detail="11:00 AM - Get your tickets!"
              />
              <DateItem
                day="WED"
                date="JUL 30"
                title="📢 Call for Presentations Open"
                detail="12:00 PM - Share your knowledge!"
              />
              <DateItem
                day="MON"
                date="OCT 6"
                title="🗳️ Voting Open"
                detail="12:00 AM - Vote for talks!"
              />
              <DateItem
                day="WED"
                date="NOV 5"
                title="📋 Agenda Published"
                detail="12:00 PM - See what's happening!"
              />
            </DateList>

            <div className="retro-center" style={{ marginTop: 30 }}>
              <TextPanel variant="fun">
                <strong>Can't wait?</strong> Then join our regular{' '}
                <RetroLink href="https://example.com" external>
                  monthly meetup
                </RetroLink>{' '}
                to get the vibe!
              </TextPanel>
            </div>
          </ContentBox>

          <ContentBox variant="highlight" pulse>
            <SectionTitle>📧 JOIN OUR MAILING LIST! 📧</SectionTitle>
            <Marquee behavior="alternate" direction="right" scrollAmount={4}>
              <Blink>→ Stay updated with the LATEST news! ←</Blink>
            </Marquee>
            <p className="retro-center" style={{ marginTop: 20 }}>
              Stay updated with the latest news from Melbourne's{' '}
              <Highlight>LARGEST</Highlight> and{' '}
              <Highlight>MOST INCLUSIVE</Highlight> tech community conference!
            </p>
          </ContentBox>

          <ContentBox>
            <Marquee direction="left" scrollAmount={6}>
              <SectionTitle>💎 OUR AMAZING SPONSORS! 💎</SectionTitle>
            </Marquee>

            <div className="retro-center">
              <TitleSponsorTier>🏭⚙️ TITLE SPONSOR ⚙️🏭</TitleSponsorTier>
            </div>
            <TitleSponsorBanner
              logo="ACME"
              sublogo="WIDGETS INC"
              tagline="⚡ Industry-Leading Widget Solutions ⚡ Precision Engineering Since 1974 ⚡ Proudly Local ⚡"
              cta="★ CLICK HERE ★"
              details="to visit acme.example — Advanced Widgets, Software & Automation!"
              badges={[
                '🇦🇺 Made Locally',
                '🌏 Global Leader',
                '⚙️ Precision Built',
                '🏆 Tool of the Year',
              ]}
              accentBright="#ff3333"
              accentDark="#990000"
              href="https://example.com"
            />

            <SponsorTier tier="diamond" title="💎 DIAMOND SPONSOR 💎">
              <SponsorGrid single>
                <SponsorCard
                  name="Diamond Co"
                  tier="diamond"
                  hoverText="★ CLICK ME! ★"
                  href="https://example.com"
                />
              </SponsorGrid>
            </SponsorTier>

            <SponsorTier tier="platinum" title="🏆 PLATINUM SPONSORS 🏆">
              <SponsorGrid>
                <SponsorCard
                  name="Platinum One"
                  tier="platinum"
                  hoverText="★ CLICK ME! ★"
                />
                <SponsorCard
                  name="Platinum Two"
                  tier="platinum"
                  hoverText="★ CLICK ME! ★"
                />
              </SponsorGrid>
            </SponsorTier>

            <SponsorTier tier="gold" title="🥇 GOLD SPONSORS 🥇">
              <SponsorGrid>
                {GOLD_SPONSORS.map((name) => (
                  <SponsorCard key={name} name={name} tier="gold" />
                ))}
              </SponsorGrid>
            </SponsorTier>

            <SponsorTier tier="service" title="🎁 SERVICE SPONSORS 🎁">
              <ServiceSponsorSection category="📡 Wi-Fi by:">
                <SponsorGrid>
                  <SponsorCard name="Network Co" tier="silver" />
                </SponsorGrid>
              </ServiceSponsorSection>
              <ServiceSponsorSection category="🍳 Networking Breakfast by:">
                <SponsorGrid>
                  <SponsorCard name="Brunch Ltd" tier="silver" />
                </SponsorGrid>
              </ServiceSponsorSection>
              <ServiceSponsorSection category="☕ Coffee Cart by:">
                <SponsorGrid>
                  <SponsorCard name="Bean Co" tier="silver" />
                  <SponsorCard name="Roast Co" tier="silver" />
                </SponsorGrid>
              </ServiceSponsorSection>
            </SponsorTier>

            <SponsorTier tier="silver" title="🥈 SILVER SPONSORS 🥈">
              <SponsorGrid>
                <SponsorCard name="Silver One" tier="silver" />
                <SponsorCard name="Silver Two" tier="silver" />
                <SponsorCard name="Silver Three" tier="silver" />
              </SponsorGrid>
            </SponsorTier>
          </ContentBox>
        </main>

        <ContentBox variant="highlight">
          <Marquee direction="left" scrollAmount={7}>
            <SectionTitle>👨‍💻 WEBMASTER EXTRAORDINAIRE 👨‍💻</SectionTitle>
          </Marquee>
          <Webmaster
            name="PAT SMITH"
            titles="Keeper of the Sacred HTML • Master of the Marquee • Guardian of the GIFs"
            email="webmaster@example.com"
          />
        </ContentBox>

        <ContentBox variant="gold">
          <WebRing
            name="MELBOURNE TECH WEB RING"
            description={
              <>
                This site is part of the <Blink>ULTRA COOL</Blink> Melbourne
                Tech Conference Ring!
              </>
            }
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

        <SiteFooter>
          <VisitorCounter count={123456} />

          <FooterLinks
            links={[
              { label: '🏠 HOME', href: '#' },
              { label: '📅 AGENDA', href: '#agenda' },
              {
                label: '🌙 BY NIGHT',
                href: 'https://example.com',
                external: true,
              },
            ]}
          />

          <BadgeRow>
            <Badge>GeoCities Certified™</Badge>
            <Badge>HTML 4.0!</Badge>
            <Badge>Made with ❤️ in Melbourne</Badge>
            <Badge>Est. 1999*</Badge>
          </BadgeRow>

          <p className="retro-copyright">
            <Marquee behavior="alternate" scrollAmount={2}>
              <small>* Not actually est. 1999, but it FEELS like it! 😄</small>
            </Marquee>
          </p>
        </SiteFooter>
      </PageContainer>

      <MidiPlayer />
    </>
  );
}

/** The whole homepage, composed from the kit. */
export const Homepage90s: Story = {
  name: 'Homepage',
  render: () => <Homepage />,
};

/**
 * The same page with `forceMotion`, for anyone who wants the full 1997 assault
 * regardless of their OS motion setting.
 */
export const ForcedMotion: Story = {
  name: 'Homepage (forceMotion)',
  render: () => (
    <RetroProvider forceMotion>
      <Homepage />
    </RetroProvider>
  ),
};

/** Light theme — the Notepad look, driven purely by a token swap. */
export const LightTheme: Story = {
  name: 'Homepage (light theme)',
  parameters: { backgrounds: { default: 'notepad' } },
  render: () => (
    <RetroProvider theme="light">
      <Homepage />
    </RetroProvider>
  ),
};
