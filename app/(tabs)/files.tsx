import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, Text, View } from "react-native";

const Files = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.defaultText}>Files screen</Text>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    defaultText: {
      color: "black",
    },
  });

export default Files;
