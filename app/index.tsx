import { Redirect, router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSapi } from '../src/context/SapiContext';
import { colors, radii } from '../src/theme';

export default function WelcomeScreen() {
  const { hydrated, onboarded } = useSapi();

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (onboarded) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.brandArea}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <Text style={styles.brand}>Sapi</Text>
          <Text style={styles.tagline}>Aprender pode virar parte do seu dia.</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>APRENDA EM ETAPAS</Text>
          <Text style={styles.heroTitle}>Suba de nível até o ENEM.</Text>
          <Text style={styles.heroText}>
            Lições rápidas, aplicações reais e uma trilha que evolui junto com você.
          </Text>
          <View style={styles.pills}>
            <Text style={styles.pill}>⚡ sessões curtas</Text>
            <Text style={styles.pill}>🔥 sequência</Text>
            <Text style={styles.pill}>🏆 checkpoints</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/onboarding')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryButtonText}>Começar minha jornada</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 24, justifyContent: 'space-between' },
  brandArea: { alignItems: 'center', marginTop: 54 },
  logo: { width: 72, height: 72, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: colors.black, fontSize: 38, fontWeight: '900' },
  brand: { color: colors.text, fontSize: 38, fontWeight: '900', marginTop: 14, letterSpacing: -1 },
  tagline: { color: colors.muted, fontSize: 16, marginTop: 7, textAlign: 'center' },
  heroCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: 22 },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  heroTitle: { color: colors.text, fontSize: 29, fontWeight: '900', lineHeight: 34, marginTop: 10 },
  heroText: { color: colors.muted, fontSize: 16, lineHeight: 23, marginTop: 12 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  pill: { color: colors.text, backgroundColor: colors.surfaceRaised, borderRadius: radii.pill, paddingVertical: 8, paddingHorizontal: 11, fontSize: 12, fontWeight: '700' },
  primaryButton: { minHeight: 56, borderRadius: radii.md, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: colors.black, fontSize: 16, fontWeight: '900' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
});
