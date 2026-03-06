import { useTheme } from "@/providers/ThemeProvider";
import { Pressable, StyleSheet, Text, View } from "react-native";
interface TransparentBoxProps {
  id?: string;
  width?: number;
  height?: number;
  title: string;
  content?: string;
  handleOnPress?: (id: string) => void;
}

const TransparentBox = ({
  id,
  width = 50,
  height = 40,
  title,
  content,
  handleOnPress,
}: TransparentBoxProps) => {
  const theme = useTheme();
  const styles = createStyles(theme, width, height);

  return (
    <Pressable onPress={() => handleOnPress!(id!)}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>{title}</Text>
        {content && <Text style={styles.content}>{content}</Text>}
      </View>
    </Pressable>
  );
};

const createStyles = (theme: any, width: number, height: number) =>
  StyleSheet.create({
    mainContainer: {
      width,
      height,
      backgroundColor: "rgba(240, 240, 240, 0.5)",
      borderColor: "#0000001C",
      borderWidth: 1,
      borderRadius: theme.scale(16),
      padding: theme.scale(5),
      justifyContent: "flex-start",
      alignItems: "center",
      gap: theme.spacing.s,
    },
    title: {
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSize.medium,
    },
    content: {
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSize.small,
    },
  });

export default TransparentBox;
