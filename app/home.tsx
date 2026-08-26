import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSapi } from '../src/context/SapiContext';
import { lessons } from '../src/data/course';
import { colors, radii } from '../src/theme';

function goalXp(minutes = 10) {
  if (minutes <= 5) return 50;
  if (minutes <= 10) return 100;
  if (minutes <= 20) return 180;
  return 250;
}

export default function HomeScreen() {
  const { xp, dailyXp, hearts, streak, onboarding, completedLessonIds } = useSapi();
  const dailyGoal = goalXp(onboarding?.dailyMinutes);
  const goalProgress = Math.min(1, dailyXp / dailyGoal);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topRow}>
            <Text style={styles.brand}>Sapi</Text>
            <View style={styles.statsInline}>
              <Text style={styles.statText}>{streak} dias</Text>
              <View style={styles.dot} />
              <Text style={styles.statText}>{hearts} vidas</Text>
              <View style={styles.dot} />
              <Text style={styles.statText}>{xp} XP</Text>
            </View>
          </View>

          <View style={styles.todayBlock}>
            <View style={styles.todayHeader}>
              <Text style={styles.todayLabel}>Hoje</Text>
              <Text style={styles.todayValue}>{dailyXp}/{dailyGoal} XP</Text>
            </View>
            <View style={styles.goalTrack}>
              <View style={[styles.goalFill, { width: `${goalProgress * 100}%` }]} />
            </View>
            <Text style={styles.todayHint}>
              {dailyXp >= dailyGoal ? 'Meta concluída.' : `${onboarding?.dailyMinutes ?? 10} min planejados`}
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionKicker}>MATEMÁTICA</Text>
              <Text style={styles.sectionTitle}>Fundamentos</Text>
            </View>
            <Text style={styles.unitCounter}>{completedLessonIds.length} de {lessons.length}</Text>
          </View>

          <View style={styles.path}>
            {lessons.map((lesson, index) => {
              const completed = completedLessonIds.includes(lesson.id);
              const unlocked = index === 0 || completedLessonIds.includes(lessons[index - 1].id);
              const active = unlocked && !completed;

              return (
                <View key={lesson.id} style={styles.stepWrap}>
                  {index > 0 ? <View style={[styles.connector, completedLessonIds.includes(lessons[index - 1].id) && styles.connectorActive]} /> : null}

                  <Pressable
                    disabled={!unlocked}
                    onPress={() => router.push(`/lesson/${lesson.id}` as never)}
                    style={({ pressed }) => [
                      styles.lessonRow,
                      active && styles.lessonRowActive,
                      !unlocked && styles.lessonRowLocked,
                      pressed && unlocked && styles.pressed,
                    ]}
                  >
                    <View style={[
                      styles.node,
                      completed && styles.nodeCompleted,
                      active && styles.nodeActive,
                      !unlocked && styles.nodeLocked,
                      lesson.isCheckpoint && styles.nodeCheckpoint,
                    ]}>
                      <Text style={[
                        styles.nodeText,
                        (active || completed || lesson.isCheckpoint) && styles.nodeTextActive,
                        !unlocked && styles.nodeTextLocked,
                      ]}>
                        {completed ? '✓' : lesson.isCheckpoint ? 'C' : String(index + 1)}
                      </Text>
                    </View>

                    <View style={styles.lessonCopy}>
                      <Text style={[styles.lessonTitle, !unlocked && styles.lockedText]}>{lesson.title}</Text>
                      <Text style={styles.lessonSubtitle}>
                        {completed ? 'Concluído' : unlocked ? lesson.subtitle : 'Bloqueado'}
                      </Text>
                    </View>

                    {active ? <Text style={styles.continueText}>Abrir</Text> : null}
                  </Pressable>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.navBar}>
          <View style={styles.navActive}><Text style={styles.navActiveText}>Aprender</Text><View style={styles.activeLine} /></View>
          <View style={styles.navItem}><Text style={styles.navText}>Revisar</Text></View>
          <View style={styles.navItem}><Text style={styles.navText}>Simulado</Text></View>
          <View style={styles.navItem}><Text style={styles.navText}>Perfil</Text></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 42 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  brand: { color: colors.brandDark, fontSize: 28, fontWeight: '900', letterSpacing: -0.8 },
  statsInline: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  statText: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.border, marginHorizontal: 7 },
  todayBlock: { marginTop: 30 },
  todayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  todayLabel: { color: colors.text, fontSize: 18, fontWeight: '900' },
  todayValue: { color: colors.brandDark, fontSize: 13, fontWeight: '900' },
  goalTrack: { height: 8, marginTop: 12, backgroundColor: colors.surfaceRaised, borderRadius: radii.pill, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radii.pill },
  todayHint: { color: colors.muted, fontSize: 12, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 48, marginBottom: 22 },
  sectionKicker: { color: colors.accentStrong, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  sectionTitle: { color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: -0.8, marginTop: 4 },
  unitCounter: { color: colors.muted, fontSize: 12, fontWeight: '800', paddingBottom: 4 },
  path: { paddingLeft: 8 },
  stepWrap: { position: 'relative' },
  connector: { width: 2, height: 22, backgroundColor: colors.border, marginLeft: 26 },
  connectorActive: { backgroundColor: colors.accentSoft },
  lessonRow: { minHeight: 82, flexDirection: 'row', alignItems: 'center', borderRadius: radii.md, paddingHorizontal: 8, paddingVertical: 12 },
  lessonRowActive: { backgroundColor: colors.surface },
  lessonRowLocked: { opacity: 0.48 },
  node: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  nodeActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  nodeCompleted: { backgroundColor: colors.brandDark, borderColor: colors.brandDark },
  nodeLocked: { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
  nodeCheckpoint: { backgroundColor: colors.yellow, borderColor: colors.yellow },
  nodeText: { color: colors.muted, fontSize: 16, fontWeight: '900' },
  nodeTextActive: { color: colors.white },
  nodeTextLocked: { color: colors.muted },
  lessonCopy: { flex: 1, minWidth: 0, marginLeft: 16 },
  lessonTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  lessonSubtitle: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  lockedText: { color: colors.muted },
  continueText: { color: colors.accentStrong, fontSize: 12, fontWeight: '900', marginLeft: 10, marginRight: 4 },
  navBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 8 },
  navItem: { flex: 1, alignItems: 'center', minHeight: 34, justifyContent: 'center' },
  navActive: { flex: 1, alignItems: 'center', minHeight: 34, justifyContent: 'center' },
  navText: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  navActiveText: { color: colors.brandDark, fontSize: 11, fontWeight: '900' },
  activeLine: { width: 24, height: 3, backgroundColor: colors.accent, borderRadius: 2, marginTop: 6 },
  pressed: { opacity: 0.78 },
});
