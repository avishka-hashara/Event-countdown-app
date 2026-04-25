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
import { saveEvent } from "../controllers/EventController";

export default function AddEventScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [dateString, setDateString] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { width } = useWindowDimensions();
  const isDesktop = width >= 980;

  const handleSave = async () => {
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
    if (isNaN(targetDate.getTime()) || targetDate <= new Date()) {
      setErrorMessage("The event date must be in the future.");
      return;
    }

    const newEvent = {
      title: title.trim(),
      targetDate: targetDate.toISOString(),
    };

    const isSaved = await saveEvent(newEvent);

    if (isSaved) {
      setTitle("");
      setDateString("");
      navigation.goBack();
    } else {
      setErrorMessage("Failed to save the event. Please try again.");
    }
  };

  const hasDatePreview = /^\d{4}-\d{2}-\d{2}$/.test(dateString.trim());

  const getDatePreview = () => {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return "Date preview will appear here.";
    }

    return parsedDate.toLocaleDateString(undefined, {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
            <Text style={styles.kicker}>CREATE EVENT</Text>
            <Text style={styles.heading}>New Countdown</Text>
            <Text style={styles.subheading}>
              Add a title and target date to start your live countdown
              dashboard.
            </Text>

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

            <BlurView intensity={20} tint="dark" style={styles.previewCard}>
              <Ionicons name="time-outline" size={16} color="#cae0ff" />
              <Text style={styles.previewText}>
                {hasDatePreview
                  ? getDatePreview()
                  : "Date preview will appear here."}
              </Text>
            </BlurView>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Event</Text>
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
    backgroundColor: "rgba(12, 27, 72, 0.42)",
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
    marginBottom: 8,
    fontFamily: Platform.OS === "web" ? "Georgia" : undefined,
  },
  subheading: {
    color: "#bfd2f8",
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 21,
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
  previewCard: {
    marginTop: 2,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(135, 166, 227, 0.38)",
    borderRadius: 14,
    backgroundColor: "rgba(68, 95, 159, 0.18)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    overflow: "hidden",
  },
  previewText: {
    color: "#d4e3ff",
    fontWeight: "600",
    fontSize: 14,
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
