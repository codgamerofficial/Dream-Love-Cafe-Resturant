import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  useWindowDimensions 
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { AuthHeader } from './AuthHeader';

interface AuthPageShellProps {
  children: React.ReactNode;
}

export const AuthPageShell: React.FC<AuthPageShellProps> = ({ children }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isMobile = width < 480;

  return (
    <View style={styles.outerContainer}>
      {/* Dedicated Minimal Auth Header */}
      <AuthHeader />

      {/* Main Content Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            isMobile && styles.scrollContentMobile,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View 
            style={[
              styles.cardWrapper,
              isDesktop ? styles.cardWrapperDesktop : isMobile ? styles.cardWrapperMobile : styles.cardWrapperTablet,
            ]}
          >
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
    width: '100%',
  },
  keyboardAvoid: {
    flex: 1,
    width: '100%',
  },
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    minHeight: Platform.OS === 'web' ? ('calc(100vh - 56px)' as any) : undefined,
  },
  scrollContentMobile: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  cardWrapperDesktop: {
    maxWidth: 520,
    padding: SPACING.xxl,
  },
  cardWrapperTablet: {
    maxWidth: 480,
    padding: SPACING.xl,
  },
  cardWrapperMobile: {
    width: '100%',
    maxWidth: '100%',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
});
