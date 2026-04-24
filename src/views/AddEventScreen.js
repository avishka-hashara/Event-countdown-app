import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { saveEvent } from '../controllers/EventController';

export default function AddEventScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [dateString, setDateString] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // New error state

    const handleSave = async () => {
        // Clear any previous errors before validating
        setErrorMessage('');

        // 1. Validate Title
        if (!title.trim()) {
            setErrorMessage('Please enter an event title.');
            return;
        }

        // 2. Validate Date Format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString.trim())) {
            setErrorMessage('Please enter a valid date (e.g., 2026-12-31).');
            return;
        }

        // 3. Validate Date is in the future
        const targetDate = new Date(dateString);
        if (isNaN(targetDate.getTime()) || targetDate <= new Date()) {
            setErrorMessage('The event date must be in the future.');
            return;
        }

        // Prepare event object
        const newEvent = {
            title: title.trim(),
            targetDate: targetDate.toISOString(),
        };

        // Save using the Controller
        const isSaved = await saveEvent(newEvent);

        if (isSaved) {
            // Clear form and navigate back on success
            setTitle('');
            setDateString('');
            // Standard web alert just for the success confirmation, 
            // but on mobile we just silently route back to home for a sleek transition
            navigation.goBack();
        } else {
            setErrorMessage('Failed to save the event. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Event Title</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g., Final Exams, Graduation"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Event Date (YYYY-MM-DD)</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g., 2026-12-31"
                value={dateString}
                onChangeText={setDateString}
                keyboardType="numbers-and-punctuation"
            />

            {/* Conditionally render the error message if it exists */}
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Event</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});