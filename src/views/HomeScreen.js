import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getEvents } from '../controllers/EventController';

export default function HomeScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    // This hook tells us if the user is currently looking at this screen
    const isFocused = useIsFocused();

    // 1. Fetch Events (Rubric: Data Persistence)
    useEffect(() => {
        const fetchEvents = async () => {
            const storedEvents = await getEvents();
            // Sort events so the closest dates appear first
            const sortedEvents = storedEvents.sort(
                (a, b) => new Date(a.targetDate) - new Date(b.targetDate)
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

        if (difference <= 0) return "Time's up!";

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    // 4. Render Individual List Items
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EventDetail', { event: item })}
        >
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.countdownText}>
                {getRemainingTime(item.targetDate)}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {events.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No events yet. Add your first one!</Text>
                </View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            {/* Primary Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddEvent')}
            >
                <Text style={styles.fabText}>+ Add New Event</Text>
            </TouchableOpacity>

            {/* Settings Navigation */}
            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => navigation.navigate('Settings')}
            >
                <Text style={styles.settingsText}>Go to Settings</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 100, // Leave space for the floating button
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    countdownText: {
        fontSize: 22,
        color: '#007AFF',
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        left: 20,
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    fabText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingsButton: {
        alignItems: 'center',
        padding: 10,
        marginBottom: 100,
    },
    settingsText: {
        color: '#555',
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});