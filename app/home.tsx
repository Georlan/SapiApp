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
          <View style={styles.statsRow}>
            <View style={styles.stat}><Text style={styles.statEmoji}>🔥</Text><Text style={styles.statText}>{streak}</Text></View>
            <View style={styles.stat}><Text style={styles.statEmoji}>⭐</Text><Text style={styles.statText}>{xp}</Text></View>
            <View style={styles.stat}><Text style={styles.statEmoji}>❤️</Text><Text style={styles.statText}>{hearts}</Text></View>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalCopy}>
              <Text style={styles.eyebrow}>META DE HOJE</Text>
              <Text style={styles.goalTitle}>{dailyXp >= dailyGoal ? 'Meta concluída. 🔥' : `${dailyXp} de ${dailyGoal} XP`}</Text>
              <Text style={styles.goalSubtitle}>{onboarding?.dailyMinutes ?? 10} min por dia · mantenha o ritmo</Text>
            </View>
            <View style={styles.goalTrack}><View style={[styles.goalFill, { width: `${goalProgress * 100}%` }]} /></View>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.eyebrow}>TRILHA 01</Text>
              <Text style={styles.sectionTitle}>Matemática essencial</Text>
            </View>
            <Text style={styles.unitCounter}>{completedLessonIds.length}/{lessons.length}</Text>
          </View>

          <View style={styles.path}>
            {lessons.map((lesson, index) => {
              const completed = completedLessonIds.includes(lesson.id);
              const unlocked = index === 0 || completedLessonIds.includes(lessons[index - 1].id);
              const alignRight = index % 2 === 1;

              return (
                <View key={lesson.id}>
                  {index > 0 ? <View style={styles.pathLine} /> : null}
                  <View style={[styles.nodeRow, alignRight && styles.nodeRowRight]}>
                    <Pressable
                      disabled={!unlocked}
                      onPress={() => router.push(`/lesson/${lesson.id}` as never)}
                      style={({ pressed }) => [
                        styles.node,
                        lesson.isCheckpoint && styles.checkpointNode,
                        completed && styles.nodeCompleted,
                        !unlocked && styles.nodeLocked,
                        pressed && unlocked && styles.pressed,
                      ]}
                    >
                      <Text style={styles.nodeEmoji}>{completed ? '✓' : unlocked ? lesson.emoji : '🔒'}</Text>
                    </Pressable>
                    <View style={[styles.nodeCopy, alignRight && styles.nodeCopyRight]}>
                      <Text style={[styles.nodeTitle, !unlocked && styles.mutedText]}>{lesson.title}</Text>
                      <Text style={styles.nodeSubtitle}>{completed ? 'Concluído' : unlocked ? lesson.subtitle : 'Complete a etapa anterior'}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.simuladoCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>MODO SIMULADO</Text>
              <Text style={styles.simuladoTitle}>Teste seu desempenho sem dicas.</Text>
              <Text style={styles.simuladoText}>Timer, revisão de respostas e análise por habilidade entram na próxima etapa do MVP.</Text>
            </View>
            <View style={styles.comingSoon}><Text style={styles.comingSoonText}>EM BREVE</Text></View>
          </View>
        </ScrollView>

        <View style={styles.navBar}>
          <View style={styles.navActive}><Text style={styles.navEmoji}>🧭</Text><Text style={styles.navActiveText}>Aprender</Text></View>
          <View style={styles.navItem}><Text style={styles.navEmoji}>🎯</Text><Text style={styles.navText}>Revisar</Text></View>
          <View style={styles.navItem}><Text style={styles.navEmoji}>📝</Text><Text style={styles.navText}>Simulado</Text></View>
          <View style={styles.navItem}><Text style={styles.navEmoji}>👤</Text><Text style={styles.navText}>Perfil</Text></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 36 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.pill, paddingVertical: 9, paddingHorizontal: 13 },
  statEmoji: { fontSize: 16 },
  statText: { color: colors.text, fontSize: 14, fontWeight: '900' },
  goalCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: 18 },
  goalCopy: { marginBottom: 15 },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1.25 },
  goalTitle: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 6 },
  goalSubtitle: { color: colors.muted, fontSize: 13, marginTop: 5 },
  goalTrack: { height: 11, backgroundColor: colors.surfaceRaised, borderRadius: radii.pill, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radii.pill },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 34, marginBottom: 22 },
  sectionTitle: { color: colors.text, fontSize: 25, fontWeight: '900', marginTop: 5 },
  unitCounter: { color: colors.muted, fontWeight: '800', paddingBottom: 3 },
  path: { paddingHorizontal: 14 },
  pathLine: { width: 4, height: 34, backgroundColor: colors.border, alignSelf: 'center', borderRadius: 4 },
  nodeRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  nodeRowRight: { flexDirection: 'row-reverse' },
  node: { width: 78, height: 78, borderRadius: 28, backgroundColor: colors.accent, borderBottomWidth: 7, borderBottomColor: colors.accentStrong, alignItems: 'center', justifyContent: 'center' },
  checkpointNode: { width: 88, height: 88, borderRadius: 30, backgroundColor: colors.yellow, borderBottomColor: '#C99C22' },
  nodeCompleted: { backgroundColor: colors.blue, borderBottomColor: '#357CC7' },
  nodeLocked: { backgroundColor: colors.surfaceRaised, borderBottomColor: colors.border },
  nodeEmoji: { fontSize: 30, fontWeight: '900', color: colors.black },
  nodeCopy: { flex: 1, minWidth: 0 },
  nodeCopyRight: { alignItems: 'flex-end' },
  nodeTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  nodeSubtitle: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 4, maxWidth: 220 },
  mutedText: { color: colors.muted },
  simuladoCard: { flexDirection: 'row', gap: 14, marginTop: 38, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: 18 },
  simuladoTitle: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: 7 },
  simuladoText: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 8 },
  comingSoon: { alignSelf: 'flex-start', backgroundColor: colors.surfaceRaised, borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 7 },
  comingSoonText: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  navBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 6 },
  navItem: { flex: 1, alignItems: 'center', gap: 4, opacity: 0.45 },
  navActive: { flex: 1, alignItems: 'center', gap: 4 },
  navEmoji: { fontSize: 19 },
  navText: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  navActiveText: { color: colors.accent, fontSize: 10, fontWeight: '900' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
});
