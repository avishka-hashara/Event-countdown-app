import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { clearAllEvents } from '../controllers/EventController';

export default function SettingsScreen({ navigation }) {

    const handleClearData = () => {
        // Platform-native confirmation dialog
        if (Platform.OS === 'web') {
            // Fallback for Web browser testing
            if (window.confirm && window.confirm("Are you sure you want to delete all events? This cannot be undone.")) {
                executeClear();
            }
        } else {
            // Native mobile alert
            Alert.alert(
                "Clear All Data",
                "Are you sure you want to delete all events? This cannot be undone.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete All",
                        style: "destructive",
                        onPress: () => executeClear()
                    }
                ]
            );
        }
    };

    const executeClear = async () => {
        const isCleared = await clearAllEvents();
        if (isCleared) {
            if (Platform.OS === 'web') {
                if (window.alert) window.alert("All events have been cleared.");
            } else {
                Alert.alert("Success", "All events have been cleared.");
            }
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>App Information</Text>

            <View style={styles.infoCard}>
                <Text style={styles.infoText}>App Name: Event Countdown</Text>
                <Text style={styles.infoText}>Version: 1.0.0</Text>
                <Text style={styles.infoText}>Developed for: ITE 3123 MAD</Text>
            </View>

            <Text style={styles.header}>Danger Zone</Text>

            <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
                <Text style={styles.dangerButtonText}>Clear All Events</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 20,
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    infoText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    dangerButton: {
        backgroundColor: '#FF3B30',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    dangerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});