import { Platform } from 'react-native';

export const COLORS = {
  // Sophisticated Dark Hospitality Palette (75% Dark Neutrals)
  background: '#120F0E',          // Deep Espresso
  backgroundDeep: '#0D0B0A',      // Pure Night Espresso
  backgroundElevated: '#1A1615',  // Elevated Background Layer
  surface: '#1A1615',             // Warm Charcoal Surface
  surfaceElevated: '#241E1C',     // Elevated Dark Chocolate Surface
  surfaceHover: '#2E2725',        // Hover Surface
  surfaceMuted: '#161312',        // Muted Inset Surface
  surfaceSoft: '#201A18',         // Soft Surface for Cards
  glassBackground: 'rgba(22, 18, 17, 0.90)',
  glassHeader: 'rgba(18, 15, 14, 0.94)',
  
  // Accents & Authentic Logo Identity (10% Curated Accents)
  brandTurquoise: '#2DD4BF',       // Dream Love Teal Accent
  brandGreen: '#0D7C66',           // Deep Storefront Teal
  brandGreenMuted: 'rgba(13, 124, 102, 0.18)',
  brandHeart: '#E11D48',           // Logo Heart Raspberry Pink-Red
  brandHeartLight: '#FB7185',      // Pulse Highlight
  brandHeartMuted: 'rgba(225, 29, 72, 0.18)',
  copper: '#C87D53',              // Warm Copper Editorial Accent
  copperLight: '#E59C72',         // Light Amber / Copper
  copperDark: '#9E5B35',          // Deep Copper
  copperMuted: 'rgba(200, 125, 83, 0.16)',
  gold: '#E5B842',                // Soft Golden Star / Award Highlight
  goldHover: '#F4C479',
  goldMuted: 'rgba(229, 184, 66, 0.15)',
  
  // Warm Neutral Text Hierarchy (15% Warm Neutrals)
  cream: '#FAF6F0',               // Warm Cream Primary Headline & Title
  creamMuted: '#D8D3C8',          // Soft Warm Cream Subtitle
  textPrimary: '#FAF6F0',         // Primary Text Token
  textSecondary: '#D8D3C8',       // Secondary Text Token
  textMuted: '#A8A29E',           // Warm Gray Secondary & Body Copy
  textSubtle: '#78716C',          // Subtle Captions & Time
  
  // Dietary & Status Indicators
  vegGreen: '#2E7D32',
  vegGreenBg: 'rgba(46, 125, 50, 0.18)',
  nonVegRed: '#D32F2F',
  nonVegRedBg: 'rgba(211, 47, 47, 0.18)',
  eggYellow: '#F59E0B',
  eggYellowBg: 'rgba(245, 158, 11, 0.18)',
  success: '#2E7D32',
  successLight: '#4CAF50',
  error: '#C62828',
  errorLight: '#EF5350',
  warning: '#F57C00',
  info: '#0288D1',

  // Borders & Dividers
  border: '#2A2220',
  borderLight: '#38302D',
  borderSubtle: 'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',
  borderAccent: 'rgba(45, 212, 191, 0.30)',
  borderHeart: 'rgba(225, 29, 72, 0.30)',
  borderCopper: 'rgba(200, 125, 83, 0.30)',

  // Overlays
  overlay: 'rgba(18, 15, 14, 0.75)',
  overlayDeep: 'rgba(13, 11, 10, 0.88)',
  overlayHero: 'rgba(13, 11, 10, 0.82)',
  vignette: 'radial-gradient(ellipse at center, rgba(18, 15, 14, 0.35) 0%, rgba(13, 11, 10, 0.94) 100%)',
};

export const TYPOGRAPHY = {
  fontFamilySerif: Platform.OS === 'web' 
    ? '"DM Serif Display", "Playfair Display", Georgia, "Times New Roman", serif' 
    : 'Georgia',
  fontFamilySans: Platform.OS === 'web' 
    ? '"Plus Jakarta Sans", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
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
