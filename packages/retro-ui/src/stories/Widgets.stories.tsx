import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { AdwarePopups } from '../components/AdwarePopups/AdwarePopups';
import { ContentBox } from '../components/ContentBox/ContentBox';
import { CoolButton } from '../components/CoolButton/CoolButton';
import { DarkModeToggle } from '../components/DarkModeToggle/DarkModeToggle';
import { FlyingSquirrel } from '../components/mascots/FlyingSquirrel';
import { MidiPlayer } from '../components/MidiPlayer/MidiPlayer';
import {
  NarwhalFlyby,
  type NarwhalFlybyHandle,
} from '../components/mascots/NarwhalFlyby';
import { SectionTitle } from '../components/typography/SectionTitle';
import { SparkleEmitter } from '../components/SparkleEmitter/SparkleEmitter';
import { StarfieldBackground } from '../components/StarfieldBackground/StarfieldBackground';
import { TextPanel } from '../components/typography/TextPanel';
import { UnicornCursor } from '../components/mascots/UnicornCursor';
import { Win95Button, Window95 } from '../components/Window95/Window95';

const meta = {
  title: 'Catalog/Widgets & Mascots',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="retro-root" style={{ padding: 20, minHeight: '90vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Windows 95 dialog chrome, shared by every widget in the kit. */
export const WindowsChrome: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', padding: 20 }}>
      <Window95 title="Untitled - Notepad" onClose={() => {}}>
        <p style={{ fontSize: 12 }}>Proudly hand-coded here.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <Win95Button>OK</Win95Button>
          <Win95Button>Cancel</Win95Button>
          <Win95Button tone="go">PLAY</Win95Button>
          <Win95Button tone="stop">MUTE</Win95Button>
          <Win95Button disabled>Disabled</Win95Button>
        </div>
      </Window95>
    </div>
  ),
};

/**
 * The 170 BPM happy-hardcore engine. Press PLAY — it is loud, relentless, and
 * exactly what the original sounded like.
 */
export const Music: Story = {
  render: () => (
    <ContentBox>
      <SectionTitle>🎵 CHIPTUNE ENGINE 🎵</SectionTitle>
      <TextPanel variant="intro">
        Kick, snare, hi-hats, detuned saw bass, five-oscillator supersaw lead
        and square stab chords — scheduled with lookahead so the loop never
        gaps. Playback is opt-in, unlike the original's autoplay.
      </TextPanel>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
        <MidiPlayer position="static" />
      </div>
    </ContentBox>
  ),
};

export const ThemeToggle: Story = {
  render: () => (
    <ContentBox>
      <SectionTitle>🌙 DARK MODE TOGGLE ☀️</SectionTitle>
      <TextPanel variant="intro">
        Flips one <code>data-retro-theme</code> attribute that the token layer
        reads — where the original injected fifty <code>!important</code>{' '}
        declarations at runtime.
      </TextPanel>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
        <DarkModeToggle position="static" />
      </div>
    </ContentBox>
  ),
};

/**
 * The popup engine, which shipped in the original repository as dead code —
 * fully written, never once referenced by a page. Ads are parody; each carries
 * its own punchline in the fine print.
 */
export const Adware: Story = {
  render: () => (
    <>
      <ContentBox>
        <SectionTitle>🚨 ADWARE 🚨</SectionTitle>
        <TextPanel variant="intro">
          First popup in two seconds, then every eight. Capped at three at once
          so the page stays escapable — press Escape, click the X, or click
          outside. The call to action spawns two more, because that is what it
          used to do.
        </TextPanel>
      </ContentBox>
      <AdwarePopups startDelay={2000} interval={8000} maxConcurrent={3} />
    </>
  ),
};

export const Sparkles: Story = {
  render: () => (
    <>
      <ContentBox>
        <SectionTitle>✨ SPARKLE EMITTER ✨</SectionTitle>
        <TextPanel variant="intro">
          One sparkle per second at a random point on screen.
        </TextPanel>
      </ContentBox>
      <SparkleEmitter interval={1000} initialBurst={8} />
    </>
  ),
};

export const Starfield: Story = {
  render: () => (
    <>
      <StarfieldBackground density={200} twinkle />
      <ContentBox>
        <SectionTitle>🌌 STARFIELD 🌌</SectionTitle>
        <TextPanel variant="intro">
          Two hundred deterministically-placed stars, twinkling. The original
          README promised an animated starfield and shipped a static tile with
          an empty <code>.stars</code> div — this is the animation it advertised.
        </TextPanel>
      </ContentBox>
    </>
  ),
};

/** Fourteen divs, no images. */
export const Squirrel: Story = {
  render: () => (
    <>
      <FlyingSquirrel duration={6} />
      <div style={{ paddingTop: 100 }}>
        <ContentBox>
          <SectionTitle>🐿️ FLYING SQUIRREL 🐿️</SectionTitle>
          <TextPanel variant="intro">
            Head, ears, eye, nose, torso, two gliding membranes, two paws, tail
            and a ground shadow — all CSS. Look up.
          </TextPanel>
        </ContentBox>
      </div>
    </>
  ),
};

/** Press the button rather than waiting three minutes. */
export const Narwhal: Story = {
  render: function NarwhalStory() {
    const narwhal = useRef<NarwhalFlybyHandle>(null);

    return (
      <>
        <NarwhalFlyby ref={narwhal} firstDelay={500} interval={12000} />
        <ContentBox>
          <SectionTitle>🐋 NARWHAL FLYBY 🐋</SectionTitle>
          <TextPanel variant="intro">
            A pure-CSS narwhal with a caped rider, arcing across the screen on a
            four-second bezier. The original hung a global{' '}
            <code>window.narwhalNow()</code> off the page to trigger one; this
            takes a ref.
          </TextPanel>
          <div style={{ textAlign: 'center' }}>
            <CoolButton onClick={() => narwhal.current?.fly()}>
              🐋 LAUNCH NARWHAL 🐋
            </CoolButton>
          </div>
        </ContentBox>
      </>
    );
  },
};

/** Move the pointer. */
export const Unicorn: Story = {
  render: () => (
    <>
      <UnicornCursor />
      <ContentBox>
        <SectionTitle>🦄 UNICORN CURSOR 🦄</SectionTitle>
        <TextPanel variant="intro">
          Eased follow with a twenty-dot rainbow trail. Positions are written
          straight to the DOM in a rAF loop — twenty-one React re-renders per
          frame would be 1,260 reconciliations a second for pure decoration.
        </TextPanel>
      </ContentBox>
    </>
  ),
};
