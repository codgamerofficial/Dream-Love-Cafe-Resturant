import { Platform } from 'react-native';

export const COLORS = {
  // Authoritative Brand Colors
  nearBlack: '#0B0909',           // Near Black
  warmCharcoal: '#171312',        // Warm Charcoal
  darkSurface: '#211B19',         // Dark Surface
  dreamPink: '#FF2D5D',           // Dream Pink (Primary CTA/Action)
  loveRed: '#E91E45',             // Love Red
  dreamCyan: '#24D5C5',           // Dream Cyan (Nav, secondary actions, operational accents)
  warmGold: '#D9A441',            // Warm Gold (Premium/highlight info)
  cream: '#F4EEE7',               // Cream (Primary typography)
  mutedText: '#A9A19D',           // Muted Text

  // Semantic mappings
  background: '#0B0909',          // Deep Near Black
  backgroundDeep: '#0B0909',      // Pure Near Black
  backgroundElevated: '#171312',  // Warm Charcoal
  surface: '#211B19',             // Dark Surface
  surfaceElevated: '#28211E',     // Elevated Dark Surface
  surfaceHover: '#322A26',        // Hover Surface
  surfaceMuted: '#171312',        // Warm Charcoal Muted Inset
  surfaceSoft: '#1D1816',         // Soft Card Surface
  glassBackground: 'rgba(23, 19, 18, 0.92)',
  glassHeader: 'rgba(11, 9, 9, 0.94)',
  
  // Accents & Authentic Logo Identity
  brandTurquoise: '#24D5C5',       // Dream Cyan Accent
  brandGreen: '#0D7C66',           // Deep Storefront Teal
  brandGreenMuted: 'rgba(36, 213, 197, 0.18)',
  brandHeart: '#FF2D5D',           // Dream Pink Primary Action
  brandHeartLight: '#FF5C81',      // Pink Highlight
  brandHeartDark: '#E91E45',       // Love Red
  brandHeartMuted: 'rgba(255, 45, 93, 0.18)',
  copper: '#D9A441',              // Warm Gold
  copperLight: '#E8B95E',         // Light Warm Gold
  copperDark: '#B88228',          // Deep Gold
  copperMuted: 'rgba(217, 164, 65, 0.16)',
  gold: '#D9A441',                // Warm Gold
  goldHover: '#E8B95E',
  goldMuted: 'rgba(217, 164, 65, 0.15)',
  
  // Warm Neutral Text Hierarchy
  creamMuted: '#D8D1C9',          // Soft Warm Cream Subtitle
  textPrimary: '#F4EEE7',         // Primary Text Token (Cream)
  textSecondary: '#D8D1C9',       // Secondary Text Token
  textMuted: '#A9A19D',           // Muted Text
  textSubtle: '#7E7672',          // Subtle Captions & Time
  
  // Dietary & Status Indicators
  vegGreen: '#2E7D32',
  vegGreenBg: 'rgba(46, 125, 50, 0.18)',
  nonVegRed: '#E91E45',
  nonVegRedBg: 'rgba(233, 30, 69, 0.18)',
  eggYellow: '#D9A441',
  eggYellowBg: 'rgba(217, 164, 65, 0.18)',
  success: '#2E7D32',
  successLight: '#4CAF50',
  error: '#C62828',
  errorLight: '#EF5350',
  warning: '#F57C00',
  info: '#24D5C5',

  // Borders & Dividers
  border: '#2E2522',
  borderLight: '#3D322E',
  borderSubtle: 'rgba(244, 238, 231, 0.08)',
  borderStrong: 'rgba(244, 238, 231, 0.16)',
  borderAccent: 'rgba(36, 213, 197, 0.35)',
  borderHeart: 'rgba(255, 45, 93, 0.35)',
  borderCopper: 'rgba(217, 164, 65, 0.35)',

  // Overlays
  overlay: 'rgba(11, 9, 9, 0.78)',
  overlayDeep: 'rgba(11, 9, 9, 0.92)',
  dreamTeal: '#24D5C5',
  dreamCopper: '#D9A441',
  dreamEspresso: '#0B0909',
  dreamSurface: '#211B19',
  dreamCream: '#F4EEE7',
  overlayHero: 'rgba(11, 9, 9, 0.70)',
  vignette: 'radial-gradient(ellipse at center, rgba(11, 9, 9, 0.25) 0%, rgba(11, 9, 9, 0.90) 100%)',
};

export const TYPOGRAPHY = {
  fontFamilyDisplay: Platform.OS === 'web'
    ? '"Instrument Serif", Georgia, serif'
    : 'Georgia',
  fontFamilySerif: Platform.OS === 'web' 
    ? '"DM Serif Display", "Playfair Display", Georgia, "Times New Roman", serif' 
    : 'Georgia',
  fontFamilySans: Platform.OS === 'web' 
    ? '"Inter", "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    : 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 80,
  epic: 96,
  giant: 120,
  section: 88,
  sectionMobile: 52,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 22,
  hero: 24,
  pill: 9999,
  full: 9999,
};

export const LAYOUT = {
  maxContainerWidth: 1280,
  contentPaddingDesktop: 40,
  contentPaddingTablet: 28,
  contentPaddingMobile: 18,
};

export const SHADOWS = {
  card: Platform.select({
    web: {
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.40)',
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.40,
      shadowRadius: 10,
      elevation: 4,
    },
  }) as any,
  cardHover: Platform.select({
    web: {
      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.55)',
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.55,
      shadowRadius: 20,
      elevation: 8,
    },
  }) as any,
  glow: Platform.select({
    web: {
      boxShadow: '0 0 20px rgba(255, 45, 93, 0.45)',
    },
    default: {
      shadowColor: '#FF2D5D',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 6,
    },
  }) as any,
  glowTurquoise: Platform.select({
    web: {
      boxShadow: '0 0 16px rgba(45, 212, 191, 0.25)',
    },
    default: {
      shadowColor: '#2DD4BF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 14,
      elevation: 5,
    },
  }) as any,
  glowCopper: Platform.select({
    web: {
      boxShadow: '0 0 16px rgba(200, 125, 83, 0.25)',
    },
    default: {
      shadowColor: '#C87D53',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 14,
      elevation: 5,
    },
  }) as any,
  glowHeart: Platform.select({
    web: {
      boxShadow: '0 0 16px rgba(225, 29, 72, 0.30)',
    },
    default: {
      shadowColor: '#E11D48',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.30,
      shadowRadius: 14,
      elevation: 5,
    },
  }) as any,
};
