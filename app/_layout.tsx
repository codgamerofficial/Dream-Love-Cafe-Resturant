import React from 'react';
import { View, StyleSheet, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from '../src/context/CartContext';
import { AuthProvider } from '../src/context/AuthContext';
import { SettingsProvider } from '../src/context/SettingsContext';
import { Header } from '../src/components/navigation/Header';
import { Footer } from '../src/components/navigation/Footer';
import { MobileBottomNav } from '../src/components/navigation/MobileBottomNav';
import { CartDrawer } from '../src/components/cart/CartDrawer';
import { SEOHead } from '../src/components/seo/SEOHead';
import { COLORS } from '../src/theme';

export default function RootLayout() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isAdminOrAuthRoute = pathname.startsWith('/admin') || pathname.startsWith('/auth');

  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <View style={styles.rootContainer}>
            <StatusBar style="light" />
            <SEOHead />

            {/* Public Header - Only rendered on public website pages */}
            {!isAdminOrAuthRoute && <Header />}

            {/* Main Page Slot & Footer */}
            {isAdminOrAuthRoute ? (
              <View style={styles.adminSlotWrapper}>
                <Slot />
              </View>
            ) : (
              <ScrollView
                style={styles.mainScroll}
                contentContainerStyle={[
                  styles.mainScrollContent,
                  isMobile && styles.mainScrollContentMobile,
                ]}
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.slotWrapper}>
                  <Slot />
                </View>

                {/* Footer at end of public page content */}
                <Footer />
              </ScrollView>
            )}

            {/* Mobile Bottom Navigation & Floating CTAs - Only on public pages */}
            {!isAdminOrAuthRoute && <MobileBottomNav />}

            {/* Cart Slide-Over Drawer */}
            <CartDrawer />
          </View>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    minHeight: Platform.OS === 'web' ? ('100vh' as any) : '100%',
    width: '100%',
  },
  adminSlotWrapper: {
    flex: 1,
  },
  mainScroll: {
    flex: 1,
    width: '100%',
  },
  mainScrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  mainScrollContentMobile: {
    paddingBottom: 68,
  },
  slotWrapper: {
    flex: 1,
    width: '100%',
  },
});
