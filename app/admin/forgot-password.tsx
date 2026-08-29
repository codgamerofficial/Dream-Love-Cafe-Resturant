import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../../src/theme';

export default function ForgotPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Passwordless flow is active - redirect to Magic Link login
    router.replace('/admin/login');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" color={COLORS.brandTurquoise} />
    </View>
  );
}
