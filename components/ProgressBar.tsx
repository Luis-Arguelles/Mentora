import React from "react";
import { DimensionValue, StyleSheet, View } from "react-native";

interface ProgressBarProps {
  progress: number; // Value between 0 and 1 (e.g., 0.5 for 50%)
  color: string; // The theme color to apply
  height?: number; // Optional custom height
}

const ProgressBar = ({ progress, color, height = 15 }: ProgressBarProps) => {
  // Convert 0.5 to '50%' for the width style
  const widthPercent: DimensionValue = `${Math.min(Math.max(progress, 0), 1) * 100}%`;

  return (
    <View style={[styles.track, { height }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: widthPercent,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: "60%",
    backgroundColor: "#D9D9D96B", // Your specific background color
    borderRadius: 10, // Rounded corners
    overflow: "hidden", // Ensures the fill stays inside the rounded corners
  },
  fill: {
    height: "100%",
    borderRadius: 10,
  },
});

export default ProgressBar;
