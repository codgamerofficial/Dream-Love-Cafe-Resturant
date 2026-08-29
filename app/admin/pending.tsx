import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function PendingRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // No approval required - immediate dashboard access
    if (user) {
      router.replace('/admin');
    } else {
      router.replace('/admin/login');
    }
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" color={COLORS.brandTurquoise} />
    </View>
  );
}
