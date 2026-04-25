import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateEvent } from "../controllers/EventController";

export default function EditEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [title, setTitle] = useState(event?.title ?? "");
  const [dateString, setDateString] = useState(
    event?.targetDate
      ? new Date(event.targetDate).toISOString().slice(0, 10)
      : "",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { width } = useWindowDimensions();
  const isDesktop = width >= 980;

  const handleUpdate = async () => {
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Please enter an event title.");
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString.trim())) {
      setErrorMessage("Please enter a valid date (e.g., 2026-12-31).");
      return;
    }

    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) {
      setErrorMessage("Please enter a valid date.");
      return;
    }

    const isUpdated = await updateEvent({
      id: event.id,
      title: title.trim(),
      targetDate: targetDate.toISOString(),
    });

    if (isUpdated) {
      navigation.popToTop();
    } else {
      setErrorMessage("Failed to update the event. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.glowBlob, styles.glowA]} />
      <View style={[styles.glowBlob, styles.glowB]} />
      <View style={[styles.glowBlob, styles.glowC]} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { justifyContent: isDesktop ? "center" : "flex-start" },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <BlurView
            intensity={40}
            tint="dark"
            style={[styles.formCard, isDesktop && styles.formCardDesktop]}
          >
            <Text style={styles.kicker}>EDIT EVENT</Text>
            <Text style={styles.heading}>Update Countdown</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Title</Text>
              <BlurView intensity={24} tint="dark" style={styles.inputWrap}>
                <Ionicons name="sparkles-outline" size={18} color="#9bb5e8" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Final Exams, Graduation"
                  placeholderTextColor="#7e95c2"
                  value={title}
                  onChangeText={setTitle}
                />
              </BlurView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Date (YYYY-MM-DD)</Text>
              <BlurView intensity={24} tint="dark" style={styles.inputWrap}>
                <Ionicons name="calendar-outline" size={18} color="#9bb5e8" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 2026-12-31"
                  placeholderTextColor="#7e95c2"
                  value={dateString}
                  onChangeText={setDateString}
                  keyboardType="numbers-and-punctuation"
                />
              </BlurView>
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update Event</Text>
            </TouchableOpacity>
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050f2f",
  },
  keyboardContainer: {
    flex: 1,
  },
  glowBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  glowA: {
    width: 300,
    height: 300,
    top: -80,
    right: -70,
    backgroundColor: "rgba(36, 161, 255, 0.32)",
  },
  glowB: {
    width: 260,
    height: 260,
    left: -90,
    bottom: 30,
    backgroundColor: "rgba(219, 64, 194, 0.24)",
  },
  glowC: {
    width: 220,
    height: 220,
    right: 20,
    bottom: -40,
    backgroundColor: "rgba(61, 236, 213, 0.18)",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(110, 145, 214, 0.42)",
    borderRadius: 22,
    backgroundColor: "rgba(12, 27, 72, 0.48)",
    padding: 18,
    overflow: "hidden",
  },
  formCardDesktop: {
    maxWidth: 820,
    alignSelf: "center",
    padding: 28,
  },
  kicker: {
    color: "#47cdf4",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  heading: {
    color: "#f4f8ff",
    fontSize: Platform.OS === "web" ? 40 : 34,
    fontWeight: "700",
    marginBottom: 16,
    fontFamily: Platform.OS === "web" ? "Georgia" : undefined,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    color: "#e5efff",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(121, 154, 218, 0.52)",
    borderRadius: 14,
    backgroundColor: "rgba(18, 34, 80, 0.46)",
    paddingHorizontal: 12,
    minHeight: 52,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#f1f6ff",
    paddingVertical: 12,
  },
  button: {
    backgroundColor: "#dce8ff",
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#071a43",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: "#ffd1d1",
    fontSize: 14,
    marginBottom: 6,
    textAlign: "left",
    fontWeight: "600",
  },
});
