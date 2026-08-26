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
  subtitle?: string;
  emoji: string;
};

type Step = {
  key: keyof OnboardingData;
  title: string;
  subtitle: string;
  options: Option[];
};

const steps: Step[] = [
  {
    key: 'goal',
    title: 'Qual é o seu objetivo?',
    subtitle: 'Vamos usar isso para definir o ritmo da sua trilha.',
    options: [
      { value: 'passar', title: 'Passar no ENEM', subtitle: 'Quero construir uma preparação consistente', emoji: '🎓' },
      { value: 'aumentar-nota', title: 'Aumentar minha nota', subtitle: 'Já estudo e quero evoluir mais rápido', emoji: '🚀' },
      { value: 'nota-alta', title: 'Buscar uma nota muito alta', subtitle: 'Quero uma preparação exigente', emoji: '🏅' },
      { value: 'base', title: 'Fortalecer minha base', subtitle: 'Quero entender de verdade os fundamentos', emoji: '🧠' },
    ],
  },
  {
    key: 'examYear',
    title: 'Quando você pretende fazer o ENEM?',
    subtitle: 'O tempo disponível muda a intensidade da jornada.',
    options: [
      { value: '2026', title: 'ENEM 2026', emoji: '⚡' },
      { value: '2027', title: 'ENEM 2027', emoji: '🎯' },
      { value: '2028+', title: '2028 ou depois', emoji: '🌱' },
      { value: 'nao-sei', title: 'Ainda não sei', emoji: '🧭' },
    ],
  },
  {
    key: 'target',
    title: 'Qual meta parece certa para você?',
    subtitle: 'Não é uma promessa de nota; é uma referência para o seu plano.',
    options: [
      { value: '600+', title: '600+', subtitle: 'Consolidar os fundamentos', emoji: '🌿' },
      { value: '700+', title: '700+', subtitle: 'Boa competitividade', emoji: '⚡' },
      { value: '750+', title: '750+', subtitle: 'Meta desafiadora', emoji: '🔥' },
      { value: '800+', title: '800+', subtitle: 'Alta performance', emoji: '🏆' },
    ],
  },
  {
    key: 'dailyMinutes',
    title: 'Quanto tempo por dia?',
    subtitle: 'Comece com algo que você realmente consegue manter.',
    options: [
      { value: 5, title: '5 minutos', subtitle: 'Leve', emoji: '🌱' },
      { value: 10, title: '10 minutos', subtitle: 'Recomendado', emoji: '⚡' },
      { value: 20, title: '20 minutos', subtitle: 'Focado', emoji: '🔥' },
      { value: 30, title: '30+ minutos', subtitle: 'Intenso', emoji: '🚀' },
    ],
  },
  {
    key: 'selfLevel',
    title: 'Como você se sente hoje?',
    subtitle: 'Depois o Sapi vai ajustar isso com base no seu desempenho real.',
    options: [
      { value: 'dificuldade', title: 'Tenho bastante dificuldade', emoji: '🧩' },
      { value: 'razoavel', title: 'Tenho uma base razoável', emoji: '🙂' },
      { value: 'boa', title: 'Tenho uma boa base', emoji: '😎' },
      { value: 'avancado', title: 'Já estou avançado', emoji: '🔥' },
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
  const progress = isSummary ? 1 : (stepIndex + 1) / (steps.length + 1);

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
      </View>

      {isSummary ? (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBadge}><Text style={styles.summaryBadgeText}>✓</Text></View>
          <Text style={styles.summaryTitle}>Sua jornada está pronta.</Text>
          <Text style={styles.summaryText}>Começaremos com Matemática e vamos medir sua evolução a cada etapa.</Text>

          <View style={styles.planCard}>
            <View style={styles.planRow}><Text style={styles.planLabel}>Meta</Text><Text style={styles.planValue}>{answers.target}</Text></View>
            <View style={styles.separator} />
            <View style={styles.planRow}><Text style={styles.planLabel}>Ritmo diário</Text><Text style={styles.planValue}>{answers.dailyMinutes} min</Text></View>
            <View style={styles.separator} />
            <View style={styles.planRow}><Text style={styles.planLabel}>Meta diária inicial</Text><Text style={styles.planValue}>{dailyGoalXp} XP</Text></View>
            <View style={styles.separator} />
            <View style={styles.planRow}><Text style={styles.planLabel}>Primeira trilha</Text><Text style={styles.planValue}>Matemática</Text></View>
          </View>

          <Pressable onPress={finish} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Entrar na minha trilha</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.stepLabel}>PASSO {stepIndex + 1} DE {steps.length}</Text>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.subtitle}>{step.subtitle}</Text>

            <View style={styles.options}>
              {step.options.map((option) => {
                const active = selected === option.value;
                return (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => choose(option.value)}
                    style={({ pressed }) => [styles.option, active && styles.optionActive, pressed && styles.pressed]}
                  >
                    <Text style={styles.optionEmoji}>{option.emoji}</Text>
                    <View style={styles.optionCopy}>
                      <Text style={[styles.optionTitle, active && styles.optionTitleActive]}>{option.title}</Text>
                      {option.subtitle ? <Text style={styles.optionSubtitle}>{option.subtitle}</Text> : null}
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
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingTop: 6, paddingBottom: 8 },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backText: { color: colors.muted, fontSize: 36, lineHeight: 38 },
  progressTrack: { flex: 1, height: 10, backgroundColor: colors.surfaceRaised, borderRadius: radii.pill, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radii.pill },
  content: { paddingHorizontal: 22, paddingTop: 26, paddingBottom: 24 },
  stepLabel: { color: colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 1.3 },
  title: { color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 10 },
  options: { gap: 12, marginTop: 28 },
  option: { minHeight: 78, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.md, padding: 15 },
  optionActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  optionEmoji: { fontSize: 25, marginRight: 13 },
  optionCopy: { flex: 1, minWidth: 0 },
  optionTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  optionTitleActive: { color: colors.accent },
  optionSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 4 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  radioActive: { borderColor: colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
  primaryButton: { minHeight: 56, backgroundColor: colors.accent, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: colors.black, fontWeight: '900', fontSize: 16 },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.82 },
  summaryContainer: { flex: 1, paddingHorizontal: 24, paddingBottom: 24, justifyContent: 'center' },
  summaryBadge: { width: 68, height: 68, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  summaryBadgeText: { color: colors.black, fontSize: 34, fontWeight: '900' },
  summaryTitle: { color: colors.text, fontSize: 31, fontWeight: '900', lineHeight: 36 },
  summaryText: { color: colors.muted, fontSize: 16, lineHeight: 23, marginTop: 10 },
  planCard: { marginVertical: 28, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: 18 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  planLabel: { color: colors.muted, fontSize: 14 },
  planValue: { color: colors.text, fontSize: 15, fontWeight: '900', textAlign: 'right' },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
});
