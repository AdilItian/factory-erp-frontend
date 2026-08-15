import {
  Architects_Daughter,
  DM_Sans,
  Fira_Code,
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Inter,
  JetBrains_Mono,
  Merriweather,
  Mulish,
  Playfair_Display,
  Noto_Sans_Mono,
  Outfit,
  Space_Mono
} from 'next/font/google';

import { cn } from '@/lib/utils';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

const fontInstrument = Instrument_Sans({
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-instrument'
});

const fontNotoMono = Noto_Sans_Mono({
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-noto-mono'
});

const fontMullish = Mulish({
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-mullish'
});

const fontInter = Inter({
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-inter'
});

const fontArchitectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  weight: '400',
  preload: false,
  display: 'swap',
  variable: '--font-architects-daughter'
});

const fontDMSans = DM_Sans({
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-dm-sans'
});

const fontFiraCode = Fira_Code({
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-fira-code'
});

const fontOutfit = Outfit({
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-outfit'
});

const fontSpaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: false,
  display: 'swap',
  variable: '--font-space-mono'
});

const fontJetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-jetbrains-mono'
});

const fontMerriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  preload: false,
  display: 'swap',
  variable: '--font-merriweather'
});

const fontPlayfairDisplay = Playfair_Display({
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-playfair-display'
});

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInstrument.variable,
  fontNotoMono.variable,
  fontMullish.variable,
  fontInter.variable,
  fontArchitectsDaughter.variable,
  fontDMSans.variable,
  fontFiraCode.variable,
  fontOutfit.variable,
  fontSpaceMono.variable,
  fontJetBrainsMono.variable,
  fontMerriweather.variable,
  fontPlayfairDisplay.variable
);
