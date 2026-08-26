import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingData, useSapi } from '../src/context/SapiContext';
import { colors, radii } from '../src/theme';

type Answers = Partial<OnboardingData>;

type Option = {
  value: string | number;
  title: string;
  detail?: string;
};

type Step = {
  key: keyof OnboardingData;
  title: string;
  subtitle?: string;
  options: Option[];
};

const steps: Step[] = [
  {
    key: 'goal',
    title: 'O que você quer fazer?',
    options: [
      { value: 'passar', title: 'Passar no ENEM' },
      { value: 'aumentar-nota', title: 'Subir minha nota' },
      { value: 'nota-alta', title: 'Disputar notas altas' },
      { value: 'base', title: 'Reforçar minha base' },
    ],
  },
  {
    key: 'examYear',
    title: 'Quando você faz a prova?',
    options: [
      { value: '2026', title: '2026' },
      { value: '2027', title: '2027' },
      { value: '2028+', title: '2028 ou depois' },
      { value: 'nao-sei', title: 'Ainda não sei' },
    ],
  },
  {
    key: 'target',
    title: 'Qual nota você quer buscar?',
    subtitle: 'É só uma referência inicial. Você pode mudar depois.',
    options: [
      { value: '600+', title: '600+' },
      { value: '700+', title: '700+' },
      { value: '750+', title: '750+' },
      { value: '800+', title: '800+' },
    ],
  },
  {
    key: 'dailyMinutes',
    title: 'Quanto tempo por dia?',
    options: [
      { value: 5, title: '5 minutos', detail: '1 lição curta' },
      { value: 10, title: '10 minutos', detail: 'Bom para criar hábito' },
      { value: 20, title: '20 minutos', detail: 'Ritmo mais forte' },
      { value: 30, title: '30+ minutos', detail: 'Sessão completa' },
    ],
  },
  {
    key: 'selfLevel',
    title: 'Como está sua base hoje?',
    options: [
      { value: 'dificuldade', title: 'Tenho dificuldade' },
      { value: 'razoavel', title: 'Razoável' },
      { value: 'boa', title: 'Boa' },
      { value: 'avancado', title: 'Avançada' },
    ],
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useSapi();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const isSummary = stepIndex === steps.length;
  const step = steps[stepIndex];
  const selected = step ? answers[step.key] : undefined;
  const progress = isSummary ? 1 : (stepIndex + 1) / steps.length;

  const dailyGoalXp = useMemo(() => {
    const minutes = Number(answers.dailyMinutes ?? 10);
    return minutes <= 5 ? 50 : minutes <= 10 ? 100 : minutes <= 20 ? 180 : 250;
  }, [answers.dailyMinutes]);

  const choose = (value: string | number) => {
    if (!step) return;
    setAnswers((current) => ({ ...current, [step.key]: value }));
  };

  const next = () => {
    if (!step || selected === undefined) return;
    setStepIndex((current) => current + 1);
  };

  const finish = () => {
    const data: OnboardingData = {
      goal: String(answers.goal),
      examYear: String(answers.examYear),
      target: String(answers.target),
      dailyMinutes: Number(answers.dailyMinutes),
      selfLevel: String(answers.selfLevel),
    };
    completeOnboarding(data);
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => (stepIndex === 0 ? router.back() : setStepIndex((current) => current - 1))}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.stepCount}>{Math.min(stepIndex + 1, steps.length)}/{steps.length}</Text>
      </View>

      {isSummary ? (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryKicker}>PRONTO</Text>
          <Text style={styles.summaryTitle}>Começamos por Matemática.</Text>
          <Text style={styles.summaryText}>A primeira trilha já está liberada.</Text>

          <View style={styles.planCard}>
            <View style={styles.planRow}><Text style={styles.planLabel}>Meta</Text><Text style={styles.planValue}>{answers.target}</Text></View>
            <View style={styles.separator} />
            <View style={styles.planRow}><Text style={styles.planLabel}>Por dia</Text><Text style={styles.planValue}>{answers.dailyMinutes} min</Text></View>
            <View style={styles.separator} />
            <View style={styles.planRow}><Text style={styles.planLabel}>Meta diária</Text><Text style={styles.planValue}>{dailyGoalXp} XP</Text></View>
          </View>

          <Pressable onPress={finish} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Abrir trilha</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{step.title}</Text>
            {step.subtitle ? <Text style={styles.subtitle}>{step.subtitle}</Text> : null}

            <View style={styles.options}>
              {step.options.map((option) => {
                const active = selected === option.value;
                return (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => choose(option.value)}
                    style={({ pressed }) => [styles.option, active && styles.optionActive, pressed && styles.pressed]}
                  >
                    <View style={styles.optionCopy}>
                      <Text style={[styles.optionTitle, active && styles.optionTitleActive]}>{option.title}</Text>
                      {option.detail ? <Text style={styles.optionDetail}>{option.detail}</Text> : null}
                    </View>
                    <View style={[styles.radio, active && styles.radioActive]}>{active ? <View style={styles.radioDot} /> : null}</View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              disabled={selected === undefined}
              onPress={next}
              style={({ pressed }) => [styles.primaryButton, selected === undefined && styles.disabled, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 8 },
  backButton: { width: 36, height: 44, alignItems: 'center', justifyContent: 'center' },
  backText: { color: colors.brandDark, fontSize: 34, lineHeight: 36 },
  progressTrack: { flex: 1, height: 5, backgroundColor: colors.surfaceRaised, borderRadius: radii.pill, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radii.pill },
  stepCount: { width: 34, color: colors.muted, textAlign: 'right', fontSize: 12, fontWeight: '700' },
  content: { paddingHorizontal: 26, paddingTop: 54, paddingBottom: 24 },
  title: { color: colors.text, fontSize: 34, lineHeight: 39, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 10, maxWidth: 300 },
  options: { gap: 10, marginTop: 36 },
  option: { minHeight: 68, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: 18, paddingVertical: 14 },
  optionActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  optionCopy: { flex: 1, minWidth: 0 },
  optionTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  optionTitleActive: { color: colors.brandDark },
  optionDetail: { color: colors.muted, fontSize: 12, marginTop: 3 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginLeft: 14 },
  radioActive: { borderColor: colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 20 },
  primaryButton: { minHeight: 56, backgroundColor: colors.brandDark, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: colors.white, fontWeight: '900', fontSize: 16 },
  disabled: { opacity: 0.25 },
  pressed: { opacity: 0.84 },
  summaryContainer: { flex: 1, paddingHorizontal: 28, paddingBottom: 28, justifyContent: 'center' },
  summaryKicker: { color: colors.accentStrong, fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  summaryTitle: { color: colors.text, fontSize: 36, fontWeight: '900', lineHeight: 41, letterSpacing: -1.2, marginTop: 10 },
  summaryText: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 10 },
  planCard: { marginVertical: 30, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: 18 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  planLabel: { color: colors.muted, fontSize: 14 },
  planValue: { color: colors.brandDark, fontSize: 15, fontWeight: '900', textAlign: 'right' },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
});
