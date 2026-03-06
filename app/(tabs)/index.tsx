import ProgressBar from "@/components/ProgressBar";
import TransparentBox from "@/components/transparentBox";
import EllipseBackgroundProvider from "@/providers/EllipseBackgroundProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

const Home = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  const homeFeatures = [
    {
      id: "1",
      title: "Recomendación",
      content: "Revisa tus estadisticas y retroalimentaciones.",
    },
    {
      id: "2",
      title: "Quizz diario",
      content:
        "Haz un test de 10 preguntas, con limite de tiempo, con tema selecto o mixto.",
    },
    {
      id: "3",
      title: "Notas",
      content:
        "Crea notas y resumenes de los temas de tu interes. Podrás pedir a Mentora que cree quiz de ello.",
    },
    {
      id: "4",
      title: "Simulador",
      content:
        "Temas selectos o mixtos. Al finalizar se te proporcionara un feedback de las áreas a reforzar.",
    },
    {
      id: "5",
      title: "Mentora",
      content:
        "Escribe y edita aqui las notas que consideres.¡Puedes escribir, guardar audios, fotos y mucho más!",
    },
    {
      id: "6",
      title: "Biblioteca",
      content:
        "Reviza y organiza tus fechas importantes, asimismo, contarás con un cronometraje para estas.",
    },
  ];

  const handleOnPress = (id: string) => {
    switch (id) {
      case "5":
        router.push("./mentora");
    }
  };

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
        <FlatList
          data={homeFeatures}
          numColumns={2}
          renderItem={(homeFeature) => (
            <TransparentBox
              title={homeFeature.item.title}
              content={homeFeature.item.content}
              width={theme.scale(160)}
              height={theme.verticalScale(140)}
              handleOnPress={(e) => handleOnPress(homeFeature.item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContentContainerStyle}
          columnWrapperStyle={{ gap: theme.spacing.m }}
        />
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
      marginTop: theme.verticalScale(80),
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
      marginTop: theme.spacing.m,
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
    flatListContentContainerStyle: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: theme.spacing.l,
      paddingHorizontal: theme.spacing.s,
      gap: theme.spacing.m,
    },
  });

export default Home;
