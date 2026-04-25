import { BlurView } from "expo-blur";
import {
    Alert,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { clearAllEvents } from "../controllers/EventController";

export default function SettingsScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 980;

  const handleClearData = () => {
    if (Platform.OS === "web") {
      if (
        window.confirm &&
        window.confirm(
          "Are you sure you want to delete all events? This cannot be undone.",
        )
      ) {
        executeClear();
      }
    } else {
      Alert.alert(
        "Clear All Data",
        "Are you sure you want to delete all events? This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete All",
            style: "destructive",
            onPress: () => executeClear(),
          },
        ],
      );
    }
  };

  const executeClear = async () => {
    const isCleared = await clearAllEvents();
    if (isCleared) {
      if (Platform.OS === "web") {
        if (window.alert) window.alert("All events have been cleared.");
      } else {
        Alert.alert("Success", "All events have been cleared.");
      }
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.glowBlob, styles.glowA]} />
      <View style={[styles.glowBlob, styles.glowB]} />

      <BlurView
        intensity={40}
        tint="dark"
        style={[styles.contentWrap, isDesktop && styles.contentWrapDesktop]}
      >
        <Text style={styles.kicker}>SETTINGS</Text>
        <Text style={styles.pageTitle}>Preferences</Text>

        <Text style={styles.header}>App Information</Text>

        <BlurView intensity={28} tint="dark" style={styles.infoCard}>
          <View style={styles.rowItem}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>Event Countdown</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.rowItemLast}>
            <Text style={styles.infoLabel}>Developed For</Text>
            <Text style={styles.infoValue}>ITE 3123 MAD</Text>
          </View>
        </BlurView>

        <Text style={styles.header}>Danger Zone</Text>

        <BlurView intensity={24} tint="dark" style={styles.dangerCard}>
          <Text style={styles.dangerText}>
            This action permanently removes all saved countdown events.
          </Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <Text style={styles.dangerButtonText}>Clear All Events</Text>
          </TouchableOpacity>
        </BlurView>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050f2f",
    padding: 16,
  },
  glowBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  glowA: {
    width: 280,
    height: 280,
    right: -80,
    top: -70,
    backgroundColor: "rgba(36, 161, 255, 0.30)",
  },
  glowB: {
    width: 260,
    height: 260,
    left: -100,
    bottom: -40,
    backgroundColor: "rgba(219, 64, 194, 0.24)",
  },
  contentWrap: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(105, 141, 215, 0.42)",
    borderRadius: 22,
    backgroundColor: "rgba(12, 27, 72, 0.44)",
    padding: 18,
    alignSelf: "center",
    marginTop: 8,
    overflow: "hidden",
  },
  contentWrapDesktop: {
    maxWidth: 980,
    padding: 26,
    marginTop: 20,
  },
  kicker: {
    color: "#47cdf4",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  pageTitle: {
    color: "#f4f8ff",
    fontSize: Platform.OS === "web" ? 40 : 32,
    fontWeight: "700",
    marginBottom: 12,
    fontFamily: Platform.OS === "web" ? "Georgia" : undefined,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#dbe8ff",
    marginBottom: 10,
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: "rgba(27, 45, 94, 0.36)",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(129, 162, 224, 0.45)",
    marginBottom: 8,
    overflow: "hidden",
  },
  rowItem: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(120, 150, 214, 0.35)",
    paddingBottom: 10,
    marginBottom: 10,
  },
  rowItemLast: {
    paddingBottom: 2,
  },
  infoLabel: {
    color: "#9fb8e9",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: "#edf4ff",
    fontWeight: "600",
  },
  dangerCard: {
    backgroundColor: "rgba(80, 20, 42, 0.24)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 111, 138, 0.45)",
    padding: 14,
    overflow: "hidden",
  },
  dangerText: {
    color: "#ffd2dc",
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  dangerButton: {
    backgroundColor: "rgba(255, 74, 99, 0.9)",
    minHeight: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
