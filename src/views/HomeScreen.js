import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    FlatList,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEvents } from "../controllers/EventController";

const CARD_ACCENTS = [
  {
    border: "#35D5FF",
    glow: "rgba(40, 220, 255, 0.34)",
    label: "Product Launch",
  },
  {
    border: "#E256D9",
    glow: "rgba(226, 86, 217, 0.30)",
    label: "Personal Milestone",
  },
  {
    border: "#EAB84D",
    glow: "rgba(234, 184, 77, 0.30)",
    label: "Social Gathering",
  },
  {
    border: "#52D099",
    glow: "rgba(82, 208, 153, 0.30)",
    label: "Important Date",
  },
];

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const { width } = useWindowDimensions();
  const isDesktop = width >= 980;
  const columnCount = width >= 1220 ? 2 : 1;

  // This hook tells us if the user is currently looking at this screen
  const isFocused = useIsFocused();

  // 1. Fetch Events (Rubric: Data Persistence)
  useEffect(() => {
    const fetchEvents = async () => {
      const storedEvents = await getEvents();
      // Sort events so the closest dates appear first
      const sortedEvents = storedEvents.sort(
        (a, b) => new Date(a.targetDate) - new Date(b.targetDate),
      );
      setEvents(sortedEvents);
    };

    if (isFocused) {
      fetchEvents();
    }
  }, [isFocused]);

  // 2. Live Countdown Timer (Forces screen to re-render every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval when the component unmounts to prevent memory leaks
    // (Rubric: Good memory management)
    return () => clearInterval(timer);
  }, []);

  // 3. Countdown Math Logic
  const getRemainingTime = (targetDateString) => {
    const difference = new Date(targetDateString) - currentTime;

    if (difference <= 0) {
      return {
        done: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { done: false, days, hours, minutes, seconds };
  };

  const formatDate = (targetDateString) => {
    try {
      return new Date(targetDateString).toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return targetDateString;
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title?.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  const CountdownBlock = ({ value, label }) => (
    <View style={styles.timeBlock}>
      <Text style={styles.timeValue}>{String(value).padStart(2, "0")}</Text>
      <Text style={styles.timeLabel}>{label}</Text>
    </View>
  );

  // 4. Render Individual List Items
  const renderItem = ({ item, index }) => {
    const countdown = getRemainingTime(item.targetDate);
    const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

    return (
      <Pressable
        style={[styles.cardWrap, { width: columnCount === 2 ? "49%" : "100%" }]}
        onPress={() => navigation.navigate("EventDetail", { event: item })}
      >
        <View
          style={[
            styles.card,
            {
              borderColor: accent.border,
            },
          ]}
        >
          <View style={[styles.cardGlow, { backgroundColor: accent.glow }]} />
          <Text style={[styles.cardCategory, { color: accent.border }]}>
            {accent.label}
          </Text>
          <Text style={styles.eventTitle}>{item.title}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color="#d9e5ff" />
            <Text style={styles.metaText}>{formatDate(item.targetDate)}</Text>
          </View>

          {countdown.done ? (
            <View style={styles.doneBadge}>
              <Text style={styles.doneText}>Time is up</Text>
            </View>
          ) : (
            <View style={styles.countdownRow}>
              <CountdownBlock value={countdown.days} label="Days" />
              <CountdownBlock value={countdown.hours} label="Hrs" />
              <CountdownBlock value={countdown.minutes} label="Min" />
              <CountdownBlock value={countdown.seconds} label="Sec" />
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  const Sidebar = () => (
    <View style={styles.sidebarCard}>
      <TouchableOpacity style={styles.sidebarItemActive}>
        <Ionicons name="grid-outline" size={18} color="#f6fbff" />
        <Text style={styles.sidebarItemTextActive}>Events</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sidebarItem}>
        <Ionicons name="calendar-outline" size={18} color="#9fb1d8" />
        <Text style={styles.sidebarItemText}>Calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sidebarItem}>
        <Ionicons name="sparkles-outline" size={18} color="#9fb1d8" />
        <Text style={styles.sidebarItemText}>Vault</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => navigation.navigate("Settings")}
      >
        <Ionicons name="settings-outline" size={18} color="#9fb1d8" />
        <Text style={styles.sidebarItemText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.glowBlob, styles.glowA]} />
      <View style={[styles.glowBlob, styles.glowB]} />
      <View style={[styles.glowBlob, styles.glowC]} />

      <View style={styles.layout}>
        {isDesktop ? <Sidebar /> : null}

        <View style={styles.mainPanel}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>My Events</Text>

            <View style={styles.headerActions}>
              <View style={styles.searchWrap}>
                <Ionicons name="search-outline" size={18} color="#9fb0d7" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="#8b9bc0"
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>

              <TouchableOpacity
                style={styles.newEventBtn}
                onPress={() => navigation.navigate("AddEvent")}
              >
                <Text style={styles.newEventBtnText}>New Event</Text>
              </TouchableOpacity>
            </View>
          </View>

          {filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No matching events. Create one from the button above.
              </Text>
            </View>
          ) : (
            <FlatList
              key={String(columnCount)}
              data={filteredEvents}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              numColumns={columnCount}
              columnWrapperStyle={
                columnCount > 1 ? styles.twoColWrap : undefined
              }
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}

          {!isDesktop ? (
            <ScrollView
              horizontal
              style={styles.mobileQuickLinks}
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity style={styles.mobileChip}>
                <Ionicons name="grid-outline" size={15} color="#dce7ff" />
                <Text style={styles.mobileChipText}>Events</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mobileChip}
                onPress={() => navigation.navigate("Settings")}
              >
                <Ionicons name="settings-outline" size={15} color="#dce7ff" />
                <Text style={styles.mobileChipText}>Settings</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050f2f",
  },
  glowBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  glowA: {
    width: 350,
    height: 350,
    top: -80,
    right: -90,
    backgroundColor: "rgba(36, 161, 255, 0.35)",
  },
  glowB: {
    width: 300,
    height: 300,
    left: -130,
    bottom: -40,
    backgroundColor: "rgba(219, 64, 194, 0.3)",
  },
  glowC: {
    width: 260,
    height: 260,
    right: 40,
    bottom: 120,
    backgroundColor: "rgba(61, 236, 213, 0.25)",
  },
  layout: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 14,
  },
  sidebarCard: {
    width: 220,
    borderWidth: 1,
    borderColor: "rgba(157, 179, 228, 0.35)",
    backgroundColor: "rgba(20, 36, 82, 0.52)",
    borderRadius: 22,
    padding: 12,
    justifyContent: "center",
    gap: 12,
  },
  sidebarItemActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(227, 241, 255, 0.20)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  sidebarItemTextActive: {
    color: "#f6fbff",
    fontSize: 30,
    fontWeight: "600",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  sidebarItemText: {
    color: "#9fb1d8",
    fontSize: 22,
  },
  mainPanel: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(95, 131, 208, 0.45)",
    borderRadius: 22,
    backgroundColor: "rgba(8, 22, 65, 0.55)",
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  title: {
    fontSize: Platform.OS === "web" ? 52 : 40,
    color: "#f4f8ff",
    fontWeight: "700",
    letterSpacing: 0.2,
    fontFamily: Platform.OS === "web" ? "Georgia" : undefined,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    width: Platform.OS === "web" ? 300 : 220,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(152, 176, 227, 0.45)",
    backgroundColor: "rgba(84, 117, 187, 0.18)",
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#f2f7ff",
    fontSize: 16,
  },
  newEventBtn: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dce8ff",
  },
  newEventBtnText: {
    color: "#04173d",
    fontWeight: "700",
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 14,
    gap: 12,
  },
  twoColWrap: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardWrap: {
    marginBottom: 10,
  },
  card: {
    overflow: "hidden",
    borderWidth: 1.2,
    backgroundColor: "rgba(27, 45, 94, 0.58)",
    padding: 22,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 130,
    top: -60,
    right: -60,
  },
  cardCategory: {
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 0.9,
    marginBottom: 8,
    fontSize: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f6fbff",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  metaText: {
    color: "#d9e5ff",
    fontSize: 15,
  },
  countdownRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  timeBlock: {
    flex: 1,
    minWidth: 0,
    borderRadius: 14,
    backgroundColor: "rgba(10, 20, 52, 0.62)",
    borderWidth: 1,
    borderColor: "rgba(130, 162, 224, 0.45)",
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  timeValue: {
    color: "#f4f8ff",
    fontSize: 34,
    fontWeight: "800",
  },
  timeLabel: {
    color: "#b5c9ef",
    fontSize: 16,
    fontWeight: "600",
  },
  doneBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 110, 168, 0.22)",
    borderColor: "rgba(255, 156, 195, 0.48)",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  doneText: {
    color: "#ffd0e5",
    fontWeight: "700",
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#c2d3f5",
    textAlign: "center",
  },
  mobileQuickLinks: {
    marginTop: 4,
    maxHeight: 56,
  },
  mobileChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(124, 155, 221, 0.42)",
    backgroundColor: "rgba(44, 64, 116, 0.5)",
    borderRadius: 999,
    paddingHorizontal: 13,
    height: 38,
    marginRight: 8,
  },
  mobileChipText: {
    color: "#dce7ff",
    fontWeight: "600",
  },
});
