import { Platform } from 'react-native';

export const COLORS = {
  // Sophisticated Dark Hospitality Palette (70–80% Dark Neutrals)
  background: '#120F0E',          // Deep Espresso
  backgroundDeep: '#0D0B0A',      // Pure Night Espresso
  surface: '#1A1615',             // Warm Charcoal Surface
  surfaceElevated: '#241E1C',     // Elevated Dark Chocolate Surface
  surfaceHover: '#2E2725',        // Hover Surface
  surfaceMuted: '#161312',        // Muted Inset Surface
  glassBackground: 'rgba(22, 18, 17, 0.88)',
  
  // Accents & Authentic Logo Identity (5–10% Curated Accents)
  brandTurquoise: '#2DD4BF',       // Dream Love Teal Accent
  brandGreen: '#0D7C66',           // Deep Storefront Teal
  brandHeart: '#E11D48',           // Logo Heart Raspberry Pink-Red
  brandHeartLight: '#FB7185',      // Pulse Highlight
  copper: '#C87D53',              // Warm Copper Editorial Accent
  copperLight: '#E59C72',         // Light Amber / Copper
  copperDark: '#9E5B35',          // Deep Copper
  gold: '#D4AF37',                // Soft Golden Star / Award Highlight
  goldHover: '#F4C479',
  
  // Warm Neutral Text Hierarchy (10–15%)
  cream: '#FAF6F0',               // Warm Cream Primary Headline & Title
  creamMuted: '#D8D3C8',          // Soft Warm Cream Subtitle
  textMuted: '#A8A29E',           // Warm Gray Secondary & Body Copy
  textSubtle: '#78716C',          // Subtle Captions & Time
  
  // Dietary & Status Indicators
  vegGreen: '#2E7D32',
  nonVegRed: '#D32F2F',
  eggYellow: '#F59E0B',
  success: '#2E7D32',
  successLight: '#4CAF50',
  error: '#C62828',
  errorLight: '#EF5350',
  warning: '#F57C00',
  info: '#0288D1',

  // Borders & Dividers
  border: '#2A2220',
  borderLight: '#38302D',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderAccent: 'rgba(45, 212, 191, 0.25)',
  borderHeart: 'rgba(225, 29, 72, 0.25)',

  // Overlays
  overlay: 'rgba(18, 15, 14, 0.75)',
  overlayDeep: 'rgba(13, 11, 10, 0.88)',
  vignette: 'radial-gradient(ellipse at center, rgba(18, 15, 14, 0.4) 0%, rgba(18, 15, 14, 0.92) 100%)',
};

export const TYPOGRAPHY = {
  fontFamilySerif: Platform.OS === 'web' ? 'Georgia, "Playfair Display", "Times New Roman", serif' : 'Georgia',
  fontFamilySans: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  section: 88,
  sectionMobile: 56,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 6,
  md: 12,
  lg: 18,
  xl: 22,
  full: 9999,
};

export const SHADOWS = {
  card: Platform.select({
    web: {
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.35)',
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 4,
    },
  }) as any,
  cardHover: Platform.select({
    web: {
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.45)',
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 8,
    },
  }) as any,
  glowTurquoise: Platform.select({
    web: {
      boxShadow: '0 0 12px rgba(45, 212, 191, 0.2)',
    },
    default: {
      shadowColor: '#2DD4BF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
  }) as any,
  glowCopper: Platform.select({
    web: {
      boxShadow: '0 0 12px rgba(200, 125, 83, 0.2)',
    },
    default: {
      shadowColor: '#C87D53',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
  }) as any,
};
