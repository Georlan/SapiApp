import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SapiProvider } from '../src/context/SapiContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SapiProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      />
    </SapiProvider>
  );
}
