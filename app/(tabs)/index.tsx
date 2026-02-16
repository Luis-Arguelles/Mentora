import ProgressBar from "@/components/ProgressBar";
import EllipseBackgroundProvider from "@/providers/EllipseBackgroundProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, Text, View } from "react-native";

const Home = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <EllipseBackgroundProvider>
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.subtitleText}>¿Qué estudiamos hoy?</Text>
          <Text style={styles.titleText}>SEBASTIAN</Text>
        </View>
        <View style={styles.bestGradesContainer}>
          <Text style={styles.bestGradeTitleText}>
            Bloques con mejor promedio
          </Text>
          <View style={styles.bestGradeProgressBarContainer}>
            <ProgressBar progress={0.5} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary }}>Fisiología</Text>
          </View>
          <View style={styles.bestGradeProgressBarContainer}>
            <ProgressBar progress={0.2} color={theme.colors.secondary} />
            <Text style={{ color: theme.colors.secondary }}>Psiquiatría</Text>
          </View>
          <View style={styles.bestGradeProgressBarContainer}>
            <ProgressBar progress={0.7} color={theme.colors.tertiary} />
            <Text style={{ color: theme.colors.tertiary }}>Traumatología</Text>
          </View>
        </View>
      </View>
    </EllipseBackgroundProvider>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.l,
    },
    textContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.verticalScale(100),
    },
    subtitleText: {
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSize.medium,
      color: theme.colors.textPrimary,
    },
    titleText: {
      fontFamily: theme.fonts.bold,
      fontSize: theme.fontSize.title,
      color: theme.colors.textPrimary,
    },
    bestGradesContainer: {
      marginTop: theme.spacing.l,
      gap: theme.spacing.s,
    },
    bestGradeTitleText: {
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.regular,
      fontSize: theme.scale(15),
    },
    bestGradeProgressBarContainer: {
      flexDirection: "row",
      gap: theme.spacing.m,
    },
  });

export default Home;
