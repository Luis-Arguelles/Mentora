import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface EllipseBackgroundProviderProps {
  children: React.ReactNode;
}

const EllipseBackgroundProvider = ({
  children,
}: EllipseBackgroundProviderProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Wrap the Image in a View to use pointerEvents */}
      <View style={styles.leftEllipseContainer} pointerEvents="none">
        <Image
          source={require("@/assets/images/ellipse-left.png")}
          style={styles.fullImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.rightEllipseContainer} pointerEvents="none">
        <Image
          source={require("@/assets/images/ellipse-right.png")}
          style={styles.fullImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    // Move the positioning logic to the View containers
    leftEllipseContainer: {
      position: "absolute",
      left: -theme.scale(70),
      top: "45%",
      marginTop: -theme.verticalScale(150),
      width: theme.scale(350),
      height: theme.verticalScale(350),
      opacity: 0.6,
    },
    rightEllipseContainer: {
      position: "absolute",
      right: -theme.scale(70),
      bottom: -theme.verticalScale(10),
      width: theme.scale(350),
      height: theme.verticalScale(350),
      opacity: 0.6,
    },
    // Let the image fill the container
    fullImage: {
      width: "100%",
      height: "100%",
    },
    content: {
      flex: 1,
      backgroundColor: "transparent",
    },
  });

export default EllipseBackgroundProvider;
