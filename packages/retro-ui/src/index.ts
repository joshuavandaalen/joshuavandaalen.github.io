import './styles/index.css';

// --- Foundation ------------------------------------------------------------
export { RetroProvider, useRetroContext } from './providers/RetroProvider';
export type {
  RetroProviderProps,
  RetroContextValue,
} from './providers/RetroProvider';

export { useReducedMotion } from './hooks/useReducedMotion';
export { useKonamiCode, KONAMI_SEQUENCE } from './hooks/useKonamiCode';
export type { UseKonamiCodeOptions } from './hooks/useKonamiCode';
export { useVisitorCounter, formatCount } from './hooks/useVisitorCounter';
export type {
  UseVisitorCounterOptions,
  VisitorCounterState,
} from './hooks/useVisitorCounter';
export { useChiptune } from './hooks/useChiptune';
export type { UseChiptuneResult } from './hooks/useChiptune';

export type {
  PolymorphicProps,
  RetroTheme,
  SponsorTierName,
  TrackNumber,
} from './types';

// --- Audio -----------------------------------------------------------------
export { ChiptuneEngine } from './audio/ChiptuneEngine';
export type { ChiptuneEngineOptions } from './audio/ChiptuneEngine';
export { HAPPY_HARDCORE, midiToFrequency } from './audio/patterns';
export type {
  ChiptunePattern,
  NoteEvent,
  BassEvent,
  ChordEvent,
} from './audio/patterns';

// --- Layout ----------------------------------------------------------------
export { StarfieldBackground } from './components/StarfieldBackground/StarfieldBackground';
export type { StarfieldBackgroundProps } from './components/StarfieldBackground/StarfieldBackground';
export { PageContainer } from './components/PageContainer/PageContainer';
export type { PageContainerProps } from './components/PageContainer/PageContainer';
export { SiteHeader } from './components/SiteHeader/SiteHeader';
export type { SiteHeaderProps } from './components/SiteHeader/SiteHeader';
export { SiteFooter } from './components/SiteFooter/SiteFooter';
export type { SiteFooterProps } from './components/SiteFooter/SiteFooter';
export { RainbowBar } from './components/RainbowBar/RainbowBar';
export type { RainbowBarProps } from './components/RainbowBar/RainbowBar';
export { ContentBox } from './components/ContentBox/ContentBox';
export type {
  ContentBoxOwnProps,
  ContentBoxVariant,
} from './components/ContentBox/ContentBox';

// --- Typography ------------------------------------------------------------
export { GlowingTitle } from './components/typography/GlowingTitle';
export type { GlowingTitleOwnProps } from './components/typography/GlowingTitle';
export { SectionTitle } from './components/typography/SectionTitle';
export { Blink } from './components/typography/Blink';
export type { BlinkOwnProps } from './components/typography/Blink';
export { RainbowText } from './components/typography/RainbowText';
export type { RainbowTextProps } from './components/typography/RainbowText';
export { Highlight } from './components/typography/Highlight';
export { RetroLink } from './components/typography/RetroLink';
export type { RetroLinkProps } from './components/typography/RetroLink';
export { TextPanel } from './components/typography/TextPanel';
export type {
  TextPanelOwnProps,
  TextPanelVariant,
} from './components/typography/TextPanel';

export { Marquee } from './components/Marquee/Marquee';
export type {
  MarqueeProps,
  MarqueeBehavior,
  MarqueeDirection,
} from './components/Marquee/Marquee';

// --- Banners ---------------------------------------------------------------
export { BrowserBanner, BROWSER_PRESETS } from './components/BrowserBanner/BrowserBanner';
export type {
  BrowserBannerProps,
  BrowserPreset,
} from './components/BrowserBanner/BrowserBanner';
export { FlashBanner } from './components/FlashBanner/FlashBanner';
export type { FlashBannerProps } from './components/FlashBanner/FlashBanner';
export { ConstructionBanner } from './components/ConstructionBanner/ConstructionBanner';
export type { ConstructionBannerProps } from './components/ConstructionBanner/ConstructionBanner';
export { WebRing } from './components/WebRing/WebRing';
export type { WebRingProps } from './components/WebRing/WebRing';

// --- Controls --------------------------------------------------------------
export { CoolButton } from './components/CoolButton/CoolButton';
export type {
  CoolButtonOwnProps,
  CoolButtonVariant,
  CoolButtonSize,
} from './components/CoolButton/CoolButton';
export { NavBar, NavButton } from './components/NavBar/NavBar';
export type { NavBarProps, NavButtonOwnProps } from './components/NavBar/NavBar';
export { FooterLinks } from './components/FooterLinks/FooterLinks';
export type {
  FooterLinksProps,
  FooterLinkItem,
} from './components/FooterLinks/FooterLinks';

// --- Data display ----------------------------------------------------------
export { DateList, DateItem } from './components/DateList/DateList';
export type { DateListProps, DateItemProps } from './components/DateList/DateList';
export { Badge, BadgeRow } from './components/Badge/Badge';
export type { BadgeProps, BadgeVariant, BadgeRowProps } from './components/Badge/Badge';
export { VisitorCounter } from './components/VisitorCounter/VisitorCounter';
export type { VisitorCounterProps } from './components/VisitorCounter/VisitorCounter';
export { Legend, LegendItem } from './components/Legend/Legend';
export type { LegendProps, LegendItemProps } from './components/Legend/Legend';

// --- Sponsors --------------------------------------------------------------
export {
  SponsorTier,
  SponsorGrid,
  SponsorCard,
  ServiceSponsorSection,
} from './components/Sponsors/Sponsors';
export type {
  SponsorTierProps,
  SponsorGridProps,
  SponsorCardProps,
  ServiceSponsorSectionProps,
} from './components/Sponsors/Sponsors';
export {
  TitleSponsorBanner,
  TitleSponsorTier,
} from './components/TitleSponsorBanner/TitleSponsorBanner';
export type {
  TitleSponsorBannerProps,
  TitleSponsorTierProps,
} from './components/TitleSponsorBanner/TitleSponsorBanner';

// --- Schedule --------------------------------------------------------------
export {
  ScheduleTable,
  ScheduleHeader,
  ScheduleRow,
  ScheduleCell,
  TimeCell,
  FullWidthEvent,
  ChangeoverRow,
  SessionCard,
} from './components/Schedule/Schedule';
export type {
  ScheduleTableProps,
  ScheduleHeaderProps,
  ScheduleRowProps,
  ScheduleRowVariant,
  ScheduleCellProps,
  TimeCellProps,
  FullWidthEventProps,
  ChangeoverRowProps,
  SessionCardProps,
  SessionVariant,
} from './components/Schedule/Schedule';

// --- Quiz primitives -------------------------------------------------------
// Not extracted from the original site — it had no form controls at all. These
// were added when the demo app proved the gap.
export { AnswerList } from './components/AnswerList/AnswerList';
export type {
  AnswerListProps,
  AnswerOptionProps,
  AnswerState,
} from './components/AnswerList/AnswerList';
export { ProgressMeter } from './components/ProgressMeter/ProgressMeter';
export type { ProgressMeterProps } from './components/ProgressMeter/ProgressMeter';
export { FeedbackPanel } from './components/FeedbackPanel/FeedbackPanel';
export type { FeedbackPanelProps } from './components/FeedbackPanel/FeedbackPanel';
export { ScorePanel } from './components/ScorePanel/ScorePanel';
export type {
  ScorePanelProps,
  ScoreCategory,
} from './components/ScorePanel/ScorePanel';

// --- Windows chrome --------------------------------------------------------
export { Window95, Win95Button } from './components/Window95/Window95';
export type { Window95Props, Win95ButtonProps } from './components/Window95/Window95';

// --- Widgets ---------------------------------------------------------------
export { MidiPlayer } from './components/MidiPlayer/MidiPlayer';
export type { MidiPlayerProps } from './components/MidiPlayer/MidiPlayer';
export { DarkModeToggle } from './components/DarkModeToggle/DarkModeToggle';
export type { DarkModeToggleProps } from './components/DarkModeToggle/DarkModeToggle';
export { AdwarePopups } from './components/AdwarePopups/AdwarePopups';
export type { AdwarePopupsProps } from './components/AdwarePopups/AdwarePopups';
export { classicAds } from './data/classicAds';
export type { RetroAd, RetroAdContext } from './data/classicAds';
export { SparkleEmitter } from './components/SparkleEmitter/SparkleEmitter';
export type { SparkleEmitterProps } from './components/SparkleEmitter/SparkleEmitter';
export { KonamiCode, Maximum90sMode } from './components/KonamiCode/KonamiCode';
export type {
  KonamiCodeProps,
  Maximum90sModeProps,
} from './components/KonamiCode/KonamiCode';
export { Webmaster } from './components/Webmaster/Webmaster';
export type { WebmasterProps } from './components/Webmaster/Webmaster';

// --- Mascots ---------------------------------------------------------------
export { FlyingSquirrel } from './components/mascots/FlyingSquirrel';
export type { FlyingSquirrelProps } from './components/mascots/FlyingSquirrel';
export { NarwhalFlyby } from './components/mascots/NarwhalFlyby';
export type {
  NarwhalFlybyProps,
  NarwhalFlybyHandle,
} from './components/mascots/NarwhalFlyby';
export { UnicornCursor } from './components/mascots/UnicornCursor';
export type { UnicornCursorProps } from './components/mascots/UnicornCursor';
