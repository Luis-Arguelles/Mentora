import { useTheme } from "@/constants/Theme";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
const loginBrain = require("@/assets/images/loginBrain.png");

const Login = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.mainTextsContainer}>
        <Text style={styles.welcomeText}>Bienvenido a:</Text>
        <Text style={styles.titleText}>MENTORA</Text>
      </View>
      <View style={styles.inputBoxContainer}>
        <TextInput style={styles.textInput} placeholder="Correo electrónico" />
        <TextInput style={styles.textInput} placeholder="Contraseña" />
        <Text style={styles.passwordAndAccountTexts}>
          ¿Olvidasate la contraseña?
        </Text>
        <Text style={styles.passwordAndAccountTexts}>
          ¿Aún no tienes cuenta?
          <Text style={{ color: theme.colors.textTertiary }}> ¡Crea una!</Text>
        </Text>
      </View>
      <View style={styles.brainImageContainer}>
        <Image source={loginBrain} style={styles.brainImage} />
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
      flex: 1,
      marginTop: theme.verticalScale(100),
      gap: theme.spacing.m,
    },
    welcomeText: {
      fontSize: theme.fontSize.medium,
      fontFamily: theme.fonts.regular,
      textAlign: "center",
    },
    titleText: {
      fontSize: theme.fontSize.title,
      fontWeight: theme.fonts.bold,
    },
    inputBoxContainer: {
      flex: 1,
      width: "80%",
      gap: theme.spacing.m,
    },
    textInput: {
      fontSize: theme.fontSize.small,
      fontFamily: theme.fonts.regular,
      textAlignVertical: "bottom",
      color: theme.colors.textPrimary,
      borderBottomColor: theme.colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    passwordAndAccountTexts: {
      fontSize: theme.fontSize.small,
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    brainImageContainer: {
      flex: 2,
    },
    brainImage: {
      width: theme.screenWidth,
      height: "100%",
    },
  });

export default Login;
