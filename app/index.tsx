import { Redirect, router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSapi } from '../src/context/SapiContext';
import { colors, radii } from '../src/theme';

function SapiMark() {
  return (
    <View style={styles.mark}>
      <View style={styles.eyeRow}>
        <View style={styles.eye}><View style={styles.pupil} /></View>
        <View style={styles.eye}><View style={styles.pupil} /></View>
      </View>
      <View style={styles.smile} />
      <View style={styles.book}>
        <View style={[styles.page, styles.pageLeft]} />
        <View style={[styles.page, styles.pageRight]} />
      </View>
    </View>
  );
}

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
        <View>
          <View style={styles.brandRow}>
            <SapiMark />
            <Text style={styles.brand}>Sapi</Text>
          </View>

          <View style={styles.copy}>
            <Text style={styles.title}>Estude um pouco todos os dias.</Text>
            <Text style={styles.subtitle}>
              Lições curtas, progresso por etapas e simulados quando você estiver pronto.
            </Text>
          </View>

          <View style={styles.pathPreview}>
            <View style={[styles.previewNode, styles.previewNodeActive]}><Text style={styles.previewNumberActive}>1</Text></View>
            <View style={styles.previewLine} />
            <View style={styles.previewNode}><Text style={styles.previewNumber}>2</Text></View>
            <View style={styles.previewLine} />
            <View style={styles.previewNode}><Text style={styles.previewNumber}>3</Text></View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/onboarding')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryButtonText}>Começar</Text>
          </Pressable>
          <Text style={styles.footerNote}>Leva menos de 1 minuto para montar sua trilha.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 44, paddingBottom: 24, justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mark: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  eyeRow: { flexDirection: 'row', gap: 7, marginTop: 5 },
  eye: { width: 13, height: 13, borderRadius: 7, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  pupil: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.brandDark },
  smile: { width: 27, height: 11, borderBottomWidth: 3, borderBottomColor: colors.accent, borderRadius: 14, marginTop: 2 },
  book: { flexDirection: 'row', marginTop: 2 },
  page: { width: 14, height: 7, backgroundColor: colors.brandDark },
  pageLeft: { borderTopLeftRadius: 6, transform: [{ skewY: '12deg' }] },
  pageRight: { borderTopRightRadius: 6, transform: [{ skewY: '-12deg' }] },
  brand: { color: colors.brandDark, fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  copy: { marginTop: 74, maxWidth: 340 },
  title: { color: colors.text, fontSize: 42, lineHeight: 47, fontWeight: '900', letterSpacing: -1.5 },
  subtitle: { color: colors.muted, fontSize: 17, lineHeight: 25, marginTop: 18 },
  pathPreview: { flexDirection: 'row', alignItems: 'center', marginTop: 58 },
  previewNode: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  previewNodeActive: { borderColor: colors.accent, backgroundColor: colors.accent },
  previewNumber: { color: colors.muted, fontSize: 15, fontWeight: '800' },
  previewNumberActive: { color: colors.white, fontSize: 15, fontWeight: '900' },
  previewLine: { width: 48, height: 2, backgroundColor: colors.border },
  footer: { gap: 12 },
  primaryButton: { minHeight: 58, borderRadius: radii.md, backgroundColor: colors.brandDark, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: colors.white, fontSize: 17, fontWeight: '900' },
  footerNote: { color: colors.muted, fontSize: 12, textAlign: 'center' },
  pressed: { opacity: 0.84, transform: [{ scale: 0.99 }] },
});
