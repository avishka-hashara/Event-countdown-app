import { useEffect, useState } from 'react';
import {
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { deleteEvent } from '../controllers/EventController';

export default function EventDetailScreen({ route, navigation }) {
    const { event } = route.params;
    const [currentTime, setCurrentTime] = useState(new Date());
    const { width } = useWindowDimensions();
    const isDesktop = width >= 980;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getRemainingTime = () => {
        const difference = new Date(event.targetDate) - currentTime;

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

    const countdown = getRemainingTime();

    const formatDate = (targetDateString) => {
        try {
            return new Date(targetDateString).toLocaleString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
            });
        } catch {
            return targetDateString;
        }
    };

    const handleDelete = async () => {
        const isDeleted = await deleteEvent(event.id);
        if (isDeleted) {
            navigation.goBack();
        }
    };

    const TimeBlock = ({ value, label }) => (
        <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{String(value).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>{label}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.glowBlob, styles.glowA]} />
            <View style={[styles.glowBlob, styles.glowB]} />

            <View style={[styles.contentWrap, isDesktop && styles.contentWrapDesktop]}>
                <Text style={styles.kicker}>COUNTDOWN</Text>
                <Text style={styles.title}>{event.title}</Text>

                <View style={styles.metaCard}>
                    <Text style={styles.metaLabel}>Target Date</Text>
                    <Text style={styles.metaDate}>{formatDate(event.targetDate)}</Text>
                </View>

                <View style={styles.timerCard}>
                    {countdown.done ? (
                        <View style={styles.doneBadge}>
                            <Text style={styles.doneText}>Time is up</Text>
                        </View>
                    ) : (
                        <View style={styles.countdownRow}>
                            <TimeBlock value={countdown.days} label="Days" />
                            <TimeBlock value={countdown.hours} label="Hrs" />
                            <TimeBlock value={countdown.minutes} label="Min" />
                            <TimeBlock value={countdown.seconds} label="Sec" />
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditEvent', { event })}
                >
                    <Text style={styles.editButtonText}>Edit Event</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Delete Event</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050f2f',
        padding: 16,
    },
    glowBlob: {
        position: 'absolute',
        borderRadius: 999,
    },
    glowA: {
        width: 300,
        height: 300,
        right: -90,
        top: -80,
        backgroundColor: 'rgba(38, 164, 255, 0.30)',
    },
    glowB: {
        width: 240,
        height: 240,
        left: -70,
        bottom: -30,
        backgroundColor: 'rgba(219, 64, 194, 0.22)',
    },
    contentWrap: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(105, 141, 215, 0.42)',
        borderRadius: 22,
        backgroundColor: 'rgba(12, 27, 72, 0.62)',
        padding: 18,
        alignSelf: 'center',
        marginTop: 8,
    },
    contentWrapDesktop: {
        maxWidth: 980,
        padding: 26,
        marginTop: 20,
    },
    kicker: {
        color: '#47cdf4',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    title: {
        fontSize: Platform.OS === 'web' ? 42 : 34,
        fontWeight: '700',
        color: '#f4f8ff',
        marginBottom: 14,
        fontFamily: Platform.OS === 'web' ? 'Georgia' : undefined,
    },
    metaCard: {
        borderWidth: 1,
        borderColor: 'rgba(133, 165, 224, 0.38)',
        borderRadius: 14,
        backgroundColor: 'rgba(68, 95, 159, 0.24)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
    },
    metaLabel: {
        color: '#9fb8e9',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 4,
    },
    metaDate: {
        color: '#e0ebff',
        fontSize: 16,
        fontWeight: '600',
    },
    timerCard: {
        borderWidth: 1,
        borderColor: 'rgba(53, 213, 255, 0.62)',
        backgroundColor: 'rgba(27, 45, 94, 0.58)',
        padding: 16,
        borderRadius: 18,
        width: '100%',
        marginBottom: 22,
    },
    countdownRow: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
    },
    timeBlock: {
        flex: 1,
        minWidth: 0,
        borderRadius: 14,
        backgroundColor: 'rgba(10, 20, 52, 0.62)',
        borderWidth: 1,
        borderColor: 'rgba(130, 162, 224, 0.45)',
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    timeValue: {
        color: '#f4f8ff',
        fontSize: 30,
        fontWeight: '800',
    },
    timeLabel: {
        color: '#b5c9ef',
        fontSize: 15,
        fontWeight: '600',
    },
    doneBadge: {
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 110, 168, 0.22)',
        borderColor: 'rgba(255, 156, 195, 0.48)',
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 7,
    },
    doneText: {
        color: '#ffd0e5',
        fontWeight: '700',
        fontSize: 14,
    },
    editButton: {
        backgroundColor: '#dce8ff',
        minHeight: 50,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 74, 99, 0.9)',
        minHeight: 50,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButtonText: {
        color: '#071a43',
        fontSize: 16,
        fontWeight: '700',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});