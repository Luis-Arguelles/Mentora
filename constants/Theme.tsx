import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavProvider,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Platform, useColorScheme, useWindowDimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const GUIDELINE_BASE_WIDTH = 393;
const GUIDELINE_BASE_HEIGHT = 852;

export const ThemeContext = createContext<any>(null);

export const CustomThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { width, height } = useWindowDimensions();
  const colorScheme = useColorScheme();

  const theme = useMemo(() => {
    const scale = (size: number) => (width / GUIDELINE_BASE_WIDTH) * size;
    const verticalScale = (size: number) =>
      (height / GUIDELINE_BASE_HEIGHT) * size;
    const moderateScale = (size: number, factor = 0.5) =>
      size + (scale(size) - size) * factor;

    return {
      colors: {
        primary: "#6200ee",
        secondary: "#00A86B",
        accent: "#FF8C00",

        // Neutral Colors
        background: "#F8F9FA", // Very light gray (easy on the eyes for long reading)
        surface: "#FFFFFF", // White for cards and containers
        border: "#E9ECEF",

        // Text Colors
        textPrimary: "#1A1A1A", // Near black for high readability
        textSecondary: "#6C757D", // Muted gray for subtitles
        textTertiary: "#089FFF",
        textInverse: "#FFFFFF", // White text on dark backgrounds
      },
      spacing: {
        xs: scale(4),
        s: scale(8),
        m: scale(16),
        l: scale(24),
        xl: scale(32),
      },
      fontSize: {
        small: moderateScale(12),
        medium: moderateScale(20),
        large: moderateScale(32),
        title: moderateScale(48),
      },
      fonts: {
        regular: "Roboto-Regular",
        medium: "Roboto-Medium",
        bold: "Roboto-Bold",
        mono: "SpaceMono",
      },
      // Expose the raw functions if needed for custom values
      scale,
      verticalScale,
      ms: moderateScale,
      screenWidth: width,
      screenHeight: height,
    };
  }, [width, height]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync("dark");
    }
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={theme}>
        {/* Wrap the Navigation Provider inside your custom one here! */}
        <StatusBar style="dark" translucent={true} />
        <NavProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          {children}
        </NavProvider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
};

// 3. Create a custom hook for easy access
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
