import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavProvider,
} from "@react-navigation/native";
import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme, useWindowDimensions } from "react-native";

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
        medium: moderateScale(16),
        large: moderateScale(20),
        title: moderateScale(32),
      },
      // Expose the raw functions if needed for custom values
      scale,
      verticalScale,
      ms: moderateScale,
    };
  }, [width, height]);

  return (
    <ThemeContext.Provider value={theme}>
      {/* Wrap the Navigation Provider inside your custom one here! */}
      <NavProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {children}
      </NavProvider>
    </ThemeContext.Provider>
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

/* export const Colors = {
  // Medical Palette
  primary: "#2A52BE", // Trustworthy clinical blue
  secondary: "#00A86B", // Calm medical green (useful for "Correct" answers)
  accent: "#FF8C00", // Soft orange for alerts or "Pending" items

  // Neutral Colors
  background: "#F8F9FA", // Very light gray (easy on the eyes for long reading)
  surface: "#FFFFFF", // White for cards and containers
  border: "#E9ECEF",

  // Text Colors
  textPrimary: "#1A1A1A", // Near black for high readability
  textSecondary: "#6C757D", // Muted gray for subtitles
  textInverse: "#FFFFFF", // White text on dark backgrounds
};

export const Typography = {
  title: {
    fontFamily: "Roboto-Bold",
    fontSize: 48,
    color: Colors.textPrimary,
  },
  subTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24, // Crucial for reading long medical texts
  },
  caption: {
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
}; */
