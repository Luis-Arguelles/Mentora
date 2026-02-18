import React from "react";
import { DimensionValue, StyleSheet, View } from "react-native";

interface ProgressBarProps {
  progress: number;
  color: string;
  height?: number;
}

const ProgressBar = ({ progress, color, height = 15 }: ProgressBarProps) => {
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
    backgroundColor: "#D9D9D96B",
    borderRadius: 10,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 10,
  },
});

export default ProgressBar;
