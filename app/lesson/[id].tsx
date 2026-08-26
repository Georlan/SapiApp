import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSapi } from '../../src/context/SapiContext';
import { lessons } from '../../src/data/course';
import { colors, radii } from '../../src/theme';

export default function LessonScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const lesson = lessons.find((item) => item.id === params.id);
  const { hearts, registerWrongAnswer, recoverHeart, completeLesson, completedLessonIds } = useSapi();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = lesson?.questions[questionIndex];
  const progress = lesson ? (questionIndex + (checked ? 1 : 0)) / lesson.questions.length : 0;
  const selectedIsCorrect = selectedId === question?.answerId;
  const accuracy = lesson ? correctCount / lesson.questions.length : 0;
  const passed = !lesson?.isCheckpoint || accuracy >= 0.7;
  const wasCompleted = lesson ? completedLessonIds.includes(lesson.id) : false;

  const answerLabel = useMemo(() => question?.options.find((option) => option.id === question.answerId)?.label, [question]);

  if (!lesson || !question) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.title}>Lição não encontrada.</Text>
          <Pressable onPress={() => router.replace('/home')} style={styles.primaryButton}><Text style={styles.primaryText}>Voltar</Text></Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const checkAnswer = () => {
    if (!selectedId || checked) return;
    setChecked(true);
    if (selectedId === question.answerId) {
      setCorrectCount((current) => current + 1);
    } else {
      registerWrongAnswer();
    }
  };

  const next = () => {
    if (!checked) return;
    if (questionIndex === lesson.questions.length - 1) {
      const finalAccuracy = correctCount / lesson.questions.length;
      const finalPassed = !lesson.isCheckpoint || finalAccuracy >= 0.7;
      if (finalPassed) completeLesson(lesson.id, lesson.xp);
      setFinished(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedId(null);
    setChecked(false);
  };

  const retry = () => {
    setQuestionIndex(0);
    setSelectedId(null);
    setChecked(false);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    const finalAccuracy = Math.round((correctCount / lesson.questions.length) * 100);
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.resultScreen}>
          <View style={[styles.resultBadge, !passed && styles.resultBadgeFail]}>
            <Text style={styles.resultBadgeText}>{passed ? '🏆' : '↻'}</Text>
          </View>
          <Text style={styles.resultEyebrow}>{lesson.isCheckpoint ? 'CHECKPOINT' : 'LIÇÃO CONCLUÍDA'}</Text>
          <Text style={styles.resultTitle}>{passed ? 'Boa. Próxima etapa liberada.' : 'Ainda não. Vamos reforçar.'}</Text>
          <Text style={styles.resultSubtitle}>
            {lesson.isCheckpoint && !passed ? 'Você precisa de pelo menos 70% para avançar.' : wasCompleted ? 'Você revisou uma etapa já concluída.' : `Você ganhou ${lesson.xp} XP.`}
          </Text>

          <View style={styles.resultStats}>
            <View style={styles.resultStat}><Text style={styles.resultValue}>{correctCount}/{lesson.questions.length}</Text><Text style={styles.resultLabel}>acertos</Text></View>
            <View style={styles.resultDivider} />
            <View style={styles.resultStat}><Text style={styles.resultValue}>{finalAccuracy}%</Text><Text style={styles.resultLabel}>precisão</Text></View>
          </View>

          {passed ? (
            <Pressable onPress={() => router.replace('/home')} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>Continuar na trilha</Text>
            </Pressable>
          ) : (
            <Pressable onPress={retry} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>Tentar novamente</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}><Text style={styles.closeText}>×</Text></Pressable>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(5, progress * 100)}%` }]} /></View>
        <View style={styles.hearts}><Text style={styles.heartEmoji}>❤️</Text><Text style={styles.heartText}>{hearts}</Text></View>
      </View>

      {hearts === 0 ? (
        <View style={styles.noHearts}>
          <Text style={styles.noHeartsEmoji}>💔</Text>
          <Text style={styles.noHeartsTitle}>Seus corações acabaram.</Text>
          <Text style={styles.noHeartsText}>No MVP, uma revisão rápida recupera um coração para você continuar.</Text>
          <Pressable onPress={recoverHeart} style={styles.primaryButton}><Text style={styles.primaryText}>Revisar e recuperar 1 ❤️</Text></Pressable>
          <Pressable onPress={() => router.replace('/home')} style={styles.secondaryButton}><Text style={styles.secondaryText}>Voltar à trilha</Text></Pressable>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.lessonLabel}>{lesson.emoji} {lesson.title.toUpperCase()}</Text>
            <Text style={styles.questionCount}>Questão {questionIndex + 1} de {lesson.questions.length}</Text>
            <Text style={styles.question}>{question.prompt}</Text>

            <View style={styles.options}>
              {question.options.map((option, index) => {
                const selected = selectedId === option.id;
                const correct = checked && option.id === question.answerId;
                const wrong = checked && selected && option.id !== question.answerId;
                return (
                  <Pressable
                    key={option.id}
                    disabled={checked}
                    onPress={() => setSelectedId(option.id)}
                    style={({ pressed }) => [styles.option, selected && styles.optionSelected, correct && styles.optionCorrect, wrong && styles.optionWrong, pressed && !checked && styles.pressed]}
                  >
                    <View style={styles.optionLetter}><Text style={styles.optionLetterText}>{String.fromCharCode(65 + index)}</Text></View>
                    <Text style={styles.optionText}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {checked ? (
              <View style={[styles.feedback, selectedIsCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
                <Text style={styles.feedbackTitle}>{selectedIsCorrect ? '✓ Mandou bem.' : `✕ A resposta é ${answerLabel}.`}</Text>
                <Text style={styles.feedbackText}>{question.explanation}</Text>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              disabled={!selectedId}
              onPress={checked ? next : checkAnswer}
              style={({ pressed }) => [styles.primaryButton, !selectedId && styles.disabled, pressed && styles.pressed]}
            >
              <Text style={styles.primaryText}>{checked ? (questionIndex === lesson.questions.length - 1 ? 'Ver resultado' : 'Continuar') : 'Confirmar'}</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 12 },
  closeButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.muted, fontSize: 30, fontWeight: '400' },
  progressTrack: { flex: 1, height: 11, backgroundColor: colors.surfaceRaised, borderRadius: radii.pill, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radii.pill },
  hearts: { minWidth: 48, flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'flex-end' },
  heartEmoji: { fontSize: 15 },
  heartText: { color: colors.red, fontWeight: '900' },
  content: { paddingHorizontal: 22, paddingTop: 26, paddingBottom: 28 },
  lessonLabel: { color: colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  questionCount: { color: colors.muted, fontSize: 13, fontWeight: '700', marginTop: 9 },
  question: { color: colors.text, fontSize: 25, lineHeight: 34, fontWeight: '900', marginTop: 19 },
  options: { gap: 11, marginTop: 30 },
  option: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.md, padding: 13 },
  optionSelected: { borderColor: colors.blue, backgroundColor: '#122B45' },
  optionCorrect: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  optionWrong: { borderColor: colors.red, backgroundColor: '#401C29' },
  optionLetter: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  optionLetterText: { color: colors.muted, fontSize: 13, fontWeight: '900' },
  optionText: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700', lineHeight: 20 },
  feedback: { marginTop: 18, borderRadius: radii.md, borderWidth: 1, padding: 16 },
  feedbackCorrect: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  feedbackWrong: { backgroundColor: '#401C29', borderColor: colors.red },
  feedbackTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  feedbackText: { color: colors.text, opacity: 0.84, fontSize: 14, lineHeight: 20, marginTop: 7 },
  footer: { padding: 18, borderTopWidth: 1, borderTopColor: colors.border },
  primaryButton: { minHeight: 56, backgroundColor: colors.accent, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  primaryText: { color: colors.black, fontSize: 16, fontWeight: '900', textAlign: 'center' },
  secondaryButton: { minHeight: 52, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  secondaryText: { color: colors.text, fontSize: 15, fontWeight: '800' },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.82 },
  noHearts: { flex: 1, paddingHorizontal: 26, justifyContent: 'center' },
  noHeartsEmoji: { fontSize: 58, marginBottom: 18 },
  noHeartsTitle: { color: colors.text, fontSize: 29, fontWeight: '900' },
  noHeartsText: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: 28 },
  center: { flex: 1, justifyContent: 'center', padding: 24, gap: 20 },
  title: { color: colors.text, fontSize: 26, fontWeight: '900' },
  resultScreen: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  resultBadge: { width: 76, height: 76, borderRadius: 26, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  resultBadgeFail: { backgroundColor: colors.surfaceRaised },
  resultBadgeText: { fontSize: 38 },
  resultEyebrow: { color: colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  resultTitle: { color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: '900', marginTop: 8 },
  resultSubtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 10 },
  resultStats: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, marginVertical: 28, paddingVertical: 18 },
  resultStat: { flex: 1, alignItems: 'center' },
  resultValue: { color: colors.text, fontSize: 24, fontWeight: '900' },
  resultLabel: { color: colors.muted, fontSize: 12, marginTop: 4 },
  resultDivider: { width: 1, height: 42, backgroundColor: colors.border },
});
