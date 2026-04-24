import { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { deleteEvent } from '../controllers/EventController';

export default function EventDetailScreen({ route, navigation }) {
    // Extract the specific event passed from the Home Screen
    const { event } = route.params;
    const [currentTime, setCurrentTime] = useState(new Date());

    // Live Countdown Timer for the detail view
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getRemainingTime = () => {
        const difference = new Date(event.targetDate) - currentTime;

        if (difference <= 0) return "Time's up!";

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        // Formatting it with newlines for a larger, stacked display
        return `${days} Days\n${hours} Hours\n${minutes} Minutes\n${seconds} Seconds`;
    };

    const handleDelete = async () => {
        const isDeleted = await deleteEvent(event.id);
        if (isDeleted) {
            // If successfully deleted from local storage, return to Home Screen
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.timerCard}>
                <Text style={styles.timerText}>{getRemainingTime()}</Text>
            </View>

            {/* Route to Edit Screen, passing the current event data */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditEvent', { event })}
            >
                <Text style={styles.buttonText}>Edit Event</Text>
            </TouchableOpacity>

            {/* Delete Action */}
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete Event</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    timerCard: {
        backgroundColor: '#f0f8ff',
        padding: 40,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    timerText: {
        fontSize: 28,
        color: '#007AFF',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 40, // Adds space between the stacked time values
    },
    editButton: {
        backgroundColor: '#34C759', // A nice green for edit
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    deleteButton: {
        backgroundColor: '#FF3B30', // Red for delete
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});