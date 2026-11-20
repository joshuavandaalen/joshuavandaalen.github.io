import type { ReactNode } from 'react';

/** Values handed to an ad body when it is rendered as a function. */
export interface RetroAdContext {
  /** Live ticking timer, present when `countdownSeconds` is set. */
  countdown: ReactNode;
}

export interface RetroAd {
  id: string;
  /** Any CSS background — the original used a gradient per ad. */
  background: string;
  title: ReactNode;
  /**
   * Ad copy. Pass a function to receive the live countdown node and place it
   * wherever the copy needs it.
   */
  body: ReactNode | ((context: RetroAdContext) => ReactNode);
  /** Button text. */
  cta: ReactNode;
  /** The disclaimer nobody read. */
  disclaimer: ReactNode;
  /** Starts a countdown timer, exposed to `body` as `context.countdown`. */
  countdownSeconds?: number;
}

/**
 * Ten period-accurate popup ads.
 *
 * These are parody. Every one carries a punchline in its own fine print, and
 * the whole set is an exhibit of what the pre-popup-blocker web felt like —
 * not a template for deceiving anyone. Supply your own `ads` to the component
 * if you want different copy.
 */
export const classicAds: RetroAd[] = [
  {
    id: 'prize',
    background: 'linear-gradient(135deg, #ff0000, #ff6600)',
    title: '🎉 CONGRATULATIONS!!! 🎉',
    body: (
      <>
        You are the 1,000,000th visitor to this website!!!
        <br />
        <br />
        Click HERE to claim your <b>FREE Sony PlayStation 2</b>!!!
      </>
    ),
    cta: '>>> CLAIM PRIZE NOW <<<',
    disclaimer:
      '* Limited time offer. Must be 18+. Offer valid in participating galaxies only.',
  },
  {
    id: 'turboclean',
    background: 'linear-gradient(135deg, #00cc00, #009900)',
    title: '⚠️ WARNING: YOUR PC IS SLOW!! ⚠️',
    body: (
      <>
        Our scan detected{' '}
        <b>
          <u>847 ERRORS</u>
        </b>{' '}
        on your computer!
        <br />
        <br />
        Download <i>TurboClean Pro 98</i> to FIX your PC and make it{' '}
        <b>500% FASTER!!!</b>
      </>
    ),
    cta: 'DOWNLOAD NOW - FREE!!!',
    disclaimer: 'TurboClean Pro is definitely not a virus. Trust us.',
  },
  {
    id: 'money',
    background: 'linear-gradient(135deg, #ff00ff, #6600cc)',
    title: '💰 MAKE MONEY FAST!!! 💰',
    body: (
      <>
        Local Melbourne mum earns <b>$47,000/week</b> from home using this ONE
        WEIRD TRICK!
        <br />
        <br />
        Banks HATE her!!!
      </>
    ),
    cta: 'LEARN THE SECRET >>>',
    disclaimer: 'Results not typical. Or possible. Or real.',
  },
  {
    id: 'singles',
    background: 'linear-gradient(135deg, #0066ff, #00ccff)',
    title: '🔥 HOT SINGLES IN YOUR AREA 🔥',
    body: (
      <>
        There are <b>47 HOT SINGLES</b> in the Melbourne CBD who want to talk
        about <b>Domain-Driven Design</b> with you RIGHT NOW!!!
      </>
    ),
    cta: 'CHAT NOW - FREE!!!',
    disclaimer:
      'By "hot singles" we mean software developers with strong opinions about bounded contexts.',
  },
  {
    id: 'ipod',
    background: 'linear-gradient(135deg, #ffcc00, #ff6600)',
    title: '🎵 FREE iPod Nano!!! 🎵',
    body: (
      <>
        Simply complete a <b>SHORT SURVEY</b> (only 97 questions!) and receive a{' '}
        <b>FREE iPod Nano</b> loaded with MIDI ringtones!!!
      </>
    ),
    cta: '>>> START SURVEY <<<',
    disclaimer: 'iPod may be a picture of an iPod. Survey has no end.',
  },
  {
    id: 'virus',
    background: 'linear-gradient(135deg, #cc0000, #880000)',
    title: '🚨 VIRUS ALERT!!! 🚨',
    body: ({ countdown }) => (
      <>
        <b style={{ fontSize: '18px' }}>Your computer has been infected!!!</b>
        <br />
        <br />
        We detected the <u>W32.RETRO.Worm</u> virus!
        <br />
        Your files will be DELETED in <b>{countdown}</b>!!!
      </>
    ),
    cta: 'REMOVE VIRUS NOW!!!',
    disclaimer: 'This is definitely a real warning and not an ad at all.',
    countdownSeconds: 47,
  },
  {
    id: 'cursors',
    background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
    title: '✨ FREE CURSOR PACK!!! ✨',
    body: (
      <>
        Download <b>500+ ANIMATED CURSORS</b> for your desktop!!!
        <br />
        <br />
        Includes: Rainbow trail, Dinosaur, Dancing Baby, and{' '}
        <i>Spinning Globe</i>!!!
      </>
    ),
    cta: 'DOWNLOAD CURSORS.EXE',
    disclaimer:
      'File size: 847MB. Includes 17 bonus toolbars for Internet Explorer.',
  },
  {
    id: 'holiday',
    background: 'linear-gradient(135deg, #00ff00, #00aa00)',
    title: '🏆 YOU HAVE WON!!! 🏆',
    body: (
      <>
        A <b>FREE TRIP TO GOLD COAST</b>!!!*
        <br />
        <br />
        All expenses paid! 5-star resort! Just enter your credit card for{' '}
        <i>"verification purposes"</i>!!!
      </>
    ),
    cta: '>>> CLAIM HOLIDAY <<<',
    disclaimer: '* Trip is to a carpark near the Gold Coast. "Free" means $9,999.',
  },
  {
    id: 'buddy',
    background: 'linear-gradient(135deg, #8800ff, #4400aa)',
    title: '🔮 FREE DESKTOP BUDDY!!! 🔮',
    body: (
      <>
        Meet your new <b>DESKTOP FRIEND</b>!!!
        <br />
        <br />
        Your buddy will help you browse the web, read emails, and{' '}
        <b>definitely not install spyware</b>!!!
      </>
    ),
    cta: 'INSTALL BUDDY.EXE',
    disclaimer: 'Buddy sees all. Buddy knows all. Buddy is forever.',
  },
  {
    id: 'nokia',
    background: 'linear-gradient(135deg, #ff4444, #cc0066)',
    title: '📱 FREE MOBILE PHONE!!! 📱',
    body: (
      <>
        Text <b>WIN</b> to 1-900-RETRO-UI and receive a{' '}
        <b>BRAND NEW INDESTRUCTIBLE PHONE</b> with <u>Snake II</u>{' '}
        pre-installed!!!
      </>
    ),
    cta: '>>> GET PHONE NOW <<<',
    disclaimer: 'Texts cost $45.00 each. You will be texted 900 times per day.',
  },
];
