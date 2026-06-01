import { supabase } from "@/lib/supabase";
import EllipseBackgroundProvider from "@/providers/EllipseBackgroundProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const brain = require("../../assets/images/brain.png");
const micIcon = require("../../assets/images/micIcon.png");
const uploadIcon = require("../../assets/images/uploadIcon.png");

const handleUpload = async () => {
  try {
    // 1. Pick the PDF
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    // Generate a unique key for R2 early so we can use it in multiple steps
    const r2Key = `library/${Date.now()}-${file.name}`;

    console.log("Preparing upload for:", file.name);

    // 2. Get a Presigned URL
    const { data: signData, error: signError } =
      await supabase.functions.invoke("get-r2-url", {
        body: {
          fileName: r2Key,
          contentType: "application/pdf",
        },
      });

    if (signError) throw signError;

    // 3. Convert URI to Blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError("Network request failed"));
      xhr.responseType = "blob";
      xhr.open("GET", file.uri, true);
      xhr.send(null);
    });

    // 4. Upload directly to Cloudflare R2
    const response = await fetch(signData.uploadUrl, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": "application/pdf" },
    });

    if (!response.ok) throw new Error("R2 upload failed");

    // --- NEW STEP: Register the book in the database ---
    // We need the database ID to link the AI-generated chunks to this specific book
    const { data: docRecord, error: docError } = await supabase
      .from("documents")
      .insert({
        file_name: file.name,
        r2_path: r2Key,
        file_status: "processing",
      })
      .select()
      .single();

    if (docError) throw docError;

    // 5. Trigger the RAG Processor
    // We now pass the documentId we just created
    const { error: processError } = await supabase.functions.invoke(
      "process-pdf-rag",
      {
        body: {
          r2Key: r2Key,
          originalName: file.name,
          documentId: docRecord.id, // Successfully linked!
        },
      },
    );

    if (processError) throw processError;

    alert("¡Éxito! El libro se ha subido y Mentora lo está analizando.");
  } catch (error) {
    console.error("Upload process failed:", error);
    alert("Hubo un fallo en la subida. Revisa la consola para más detalles.");
  }
};

interface TransparentInputProps {
  styles: any;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

const TransparentInput = ({
  styles,
  isProcessing,
  setIsProcessing,
}: TransparentInputProps) => {
  if (!isProcessing) setIsProcessing(true);
  else {
    return (
      <View style={styles.transparentInputContainer}>
        <View style={styles.inputWrapper}>
          <Text style={{ color: "#666", fontSize: 16 }}>
            Procesando tu libro...
          </Text>
        </View>
      </View>
    );
  }

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // If the app is moving to the background or "inactive" (recents menu)
      if (nextAppState !== "active") {
        // Force the input to lose focus and hide keyboard
        inputRef.current?.blur();
        Keyboard.dismiss();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.transparentInputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Aprende algo nuevo"
          placeholderTextColor="#666" // Adjust for visibility on your background
          inlineImageLeft="search_icon" // Optional for Android
        />

        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.inputIcon} onPress={handleUpload}>
            <Image source={uploadIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputIcon}>
            <Image source={micIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Mentora = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [appStateKey, setAppStateKey] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // Force KeyboardAvoidingView to remeasure its layout
        setAppStateKey((prev) => prev + 1);
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <EllipseBackgroundProvider>
      <KeyboardAvoidingView
        // IMPORTANT: Android usually performs better with 'height' or no behavior at all
        key={appStateKey}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        // Negative offset counteracts Android's native keyboard adjustment
        // to prevent the input from staying raised after keyboard dismisses
        // Negative offset cancels KAV's double-compensation on Android,
        // since adjustResize in app.json already handles native resizing.
        keyboardVerticalOffset={-tabBarHeight}
      >
        <View
          style={[
            styles.mainContainer,
            {
              paddingTop: insets.top,
              paddingBottom: tabBarHeight,
            },
          ]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.subtitle}>¿Qué estudiamos hoy?</Text>
            <Text style={styles.title}>SEBASTIAN</Text>
          </View>

          <View style={styles.brainImageContainer}>
            <Image source={brain} style={styles.brainImage} />
          </View>

          <TransparentInput
            styles={styles}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </View>
      </KeyboardAvoidingView>
    </EllipseBackgroundProvider>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.l,
      //justifyContent: "center",
      //alignContent: "center",
    },
    textContainer: {
      flex: 2,
      //marginTop: theme.spacing.xl,
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing.m,
    },
    subtitle: {
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSize.medium,
    },
    title: {
      fontFamily: theme.fonts.extraBold,
      fontSize: theme.fontSize.title,
    },
    brainImageContainer: {
      //flex: 3,
      flex: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    brainImage: {
      width: theme.scale(200),
      height: theme.verticalScale(200),
    },
    transparentInputContainer: {
      //flex: 1,
      marginBottom: theme.spacing.m,
      //justifyContent: "center",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.3)", // The "Transparency" effect
      borderWidth: 1,
      borderColor: "rgba(200, 200, 200, 0.5)",
      borderRadius: theme.scale(25), // Rounded corners
      paddingHorizontal: theme.scale(20),
      width: "100%",
      height: theme.verticalScale(70),
    },
    input: {
      flex: 1,
      height: "100%",
      fontSize: 16,
      color: "#000",
    },
    iconsContainer: {
      flexDirection: "row",
      gap: theme.spacing.m,
    },
    inputIcon: {
      width: theme.verticalScale(25),
      height: theme.scale(25),
    },
  });

export default Mentora;
