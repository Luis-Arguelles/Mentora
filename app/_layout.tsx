import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { CustomThemeProvider } from "@/providers/ThemeProvider";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_800ExtraBold,
} from "@expo-google-fonts/roboto";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

// Keep the splash screen visible
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Roboto-Regular": Roboto_400Regular,
    "Roboto-Bold": Roboto_700Bold,
    "Roboto-Medium": Roboto_500Medium,
    "Roboto-ExtraBold": Roboto_800ExtraBold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // If fonts fail or are still loading, we stay on the native Splash Screen
  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <CustomThemeProvider>
        <RootLayoutNav fontsLoaded={fontsLoaded} />
      </CustomThemeProvider>
    </AuthProvider>
  );
}

function RootLayoutNav({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

    if (session) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [session, authLoading, fontsLoaded]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
