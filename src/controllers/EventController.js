import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@events_data';

// Fetch all saved events
export const getEvents = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error("Failed to fetch events:", e);
        return [];
    }
};

// Save a new event
export const saveEvent = async (newEvent) => {
    try {
        const existingEvents = await getEvents();

        // Assign a unique ID using the current timestamp
        const eventWithId = { ...newEvent, id: Date.now().toString() };
        const updatedEvents = [...existingEvents, eventWithId];

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
        return true;
    } catch (e) {
        console.error("Failed to save event:", e);
        return false;
    }
};

// Delete an event (Useful for maintaining data)
export const deleteEvent = async (eventId) => {
    try {
        const existingEvents = await getEvents();
        const updatedEvents = existingEvents.filter(event => event.id !== eventId);

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
        return true;
    } catch (e) {
        console.error("Failed to delete event:", e);
        return false;
    }
};