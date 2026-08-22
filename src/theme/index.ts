export const COLORS = {
  // Midnight Café Theme Palette
  background: '#120F0E',       // Deep Espresso
  surface: '#1A1615',          // Charcoal Surface
  surfaceElevated: '#241E1C',  // Elevated Card Surface
  surfaceHover: '#2E2725',     // Card Hover State
  
  // Accents & Brand Colors
  copper: '#C87D53',           // Muted Copper Primary
  copperLight: '#E59C72',      // Light Copper Accent
  copperDark: '#9E5B35',       // Dark Copper
  
  gold: '#E2B062',             // Soft Golden Highlights
  goldHover: '#F4C479',
  
  burgundy: '#4A1E24',         // Subtle Burgundy
  burgundyLight: '#63262E',
  
  // Text Colors
  cream: '#F9F6EE',            // Warm Cream Primary Text
  creamMuted: '#D8D3C8',       // Muted Text
  textMuted: '#A8A29E',        // Warm Gray Secondary Text
  textSubtle: '#78716C',       // Subtle Text
  
  // Status Colors
  success: '#2E7D32',
  successLight: '#4CAF50',
  error: '#C62828',
  errorLight: '#EF5350',
  warning: '#F57C00',
  info: '#0288D1',

  // Veg / Non-Veg Indicator Colors
  vegGreen: '#388E3C',
  nonVegRed: '#D32F2F',

  // Borders & Dividers
  border: '#2A2220',
  borderLight: '#3D3330',
  borderAccent: '#C87D5340',

  // Overlay
  overlay: 'rgba(18, 15, 14, 0.85)',
  glassBackground: 'rgba(26, 22, 21, 0.92)',
};

export const TYPOGRAPHY = {
  fontFamilySerif: 'Georgia, serif',
  fontFamilySans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  glowCopper: {
    shadowColor: '#C87D53',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  glowGold: {
    shadowColor: '#E2B062',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
};
