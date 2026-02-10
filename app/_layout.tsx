import { useColorScheme } from "@/components/useColorScheme";
import { useAuth } from "@/providers/AuthProvider";
import { CustomThemeProvider } from "@/providers/ThemeProvider";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

// export const unstable_settings = {
//   initialRouteName: "(tabs)",
// };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Roboto-Regular": Roboto_400Regular,
    "Roboto-Bold": Roboto_700Bold,
    "Roboto-Medium": Roboto_500Medium,
    ...FontAwesome.font,
  });

  const { session, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (loading) return;

  //   if (session) {
  //     router.replace("/(tabs)"); // User is logged in
  //   } else {
  //     router.replace("/(auth)/login"); // User is logged out
  //   }
  // }, [session, loading]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <CustomThemeProvider>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </CustomThemeProvider>
  );
}
