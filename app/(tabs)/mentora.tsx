import EllipseBackgroundProvider from "@/providers/EllipseBackgroundProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const brain = require("../../assets/images/brain.png");
const micIcon = require("../../assets/images/micIcon.png");
const uploadIcon = require("../../assets/images/uploadIcon.png");

const TransparentInput = ({ styles }: { styles: any }) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // If the app is moving to the background or "inactive" (recents menu)
      if (nextAppState !== "active") {
        // Force the input to lose focus and hide keyboard
        inputRef.current?.blur();
        Keyboard.dismiss();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.transparentInputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Aprende algo nuevo"
          placeholderTextColor="#666" // Adjust for visibility on your background
          inlineImageLeft="search_icon" // Optional for Android
        />

        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.inputIcon}>
            <Image source={uploadIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputIcon}>
            <Image source={micIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Mentora = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [appStateKey, setAppStateKey] = useState(0);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // Force KeyboardAvoidingView to remeasure its layout
        setAppStateKey((prev) => prev + 1);
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <EllipseBackgroundProvider>
      <KeyboardAvoidingView
        // IMPORTANT: Android usually performs better with 'height' or no behavior at all
        key={appStateKey}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        // Negative offset counteracts Android's native keyboard adjustment
        // to prevent the input from staying raised after keyboard dismisses
        // Negative offset cancels KAV's double-compensation on Android,
        // since adjustResize in app.json already handles native resizing.
        keyboardVerticalOffset={-tabBarHeight}
      >
        <View
          style={[
            styles.mainContainer,
            {
              paddingTop: insets.top,
              paddingBottom: tabBarHeight,
            },
          ]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.subtitle}>¿Qué estudiamos hoy?</Text>
            <Text style={styles.title}>SEBASTIAN</Text>
          </View>

          <View style={styles.brainImageContainer}>
            <Image source={brain} style={styles.brainImage} />
          </View>

          <TransparentInput styles={styles} />
        </View>
      </KeyboardAvoidingView>
    </EllipseBackgroundProvider>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.l,
      //justifyContent: "center",
      //alignContent: "center",
    },
    textContainer: {
      flex: 2,
      //marginTop: theme.spacing.xl,
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing.m,
    },
    subtitle: {
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSize.medium,
    },
    title: {
      fontFamily: theme.fonts.extraBold,
      fontSize: theme.fontSize.title,
    },
    brainImageContainer: {
      //flex: 3,
      flex: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    brainImage: {
      width: theme.scale(200),
      height: theme.verticalScale(200),
    },
    transparentInputContainer: {
      //flex: 1,
      marginBottom: theme.spacing.m,
      //justifyContent: "center",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.3)", // The "Transparency" effect
      borderWidth: 1,
      borderColor: "rgba(200, 200, 200, 0.5)",
      borderRadius: theme.scale(25), // Rounded corners
      paddingHorizontal: theme.scale(20),
      width: "100%",
      height: theme.verticalScale(70),
    },
    input: {
      flex: 1,
      height: "100%",
      fontSize: 16,
      color: "#000",
    },
    iconsContainer: {
      flexDirection: "row",
      gap: theme.spacing.m,
    },
    inputIcon: {
      width: theme.verticalScale(25),
      height: theme.scale(25),
    },
  });

export default Mentora;
