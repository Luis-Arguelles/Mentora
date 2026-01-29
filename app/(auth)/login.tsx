import { useTheme } from "@/constants/Theme";
import { StyleSheet, Text, TextInput, View } from "react-native";

const Login = () => {
  const theme = useTheme(); // 1. Get the theme
  const styles = createStyles(theme);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.mainTextsContainer}>
        <Text style={styles.welcomeText}>Bienvenido a:</Text>
        <Text style={styles.titleText}>MENTORA</Text>
      </View>
      <View style={styles.inputBoxContainer}>
        <TextInput style={styles.textInput} placeholder="Correo electrónico" />
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    mainTextsContainer: {
      marginTop: theme.verticalScale(100),
      gap: theme.spacing.m,
    },
    welcomeText: {
      fontSize: theme.fontSize.medium,
      textAlign: "center",
    },
    titleText: {
      fontSize: theme.fontSize.title,
      fontWeight: "bold",
    },
    inputBoxContainer: {
      flex: 2,
      backgroundColor: theme.colors.primary,
      width: theme.scale(100),
    },
    textInput: {
      fontSize: theme.fontSize.small,
      color: theme.colors.textSecondary,
      borderBottomColor: theme.colors.textPrimary,
      borderBottomWidth: theme.scale(1),
    },
  });

export default Login;
