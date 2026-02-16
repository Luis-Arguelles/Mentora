import EllipseBackgroundProvider from "@/providers/EllipseBackgroundProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, Text, View } from "react-native";

const Profile = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <EllipseBackgroundProvider>
      <View style={styles.mainContainer}>
        <Text style={styles.defaultText}>Profile screen</Text>
      </View>
    </EllipseBackgroundProvider>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    defaultText: {
      color: "black",
    },
  });

export default Profile;
