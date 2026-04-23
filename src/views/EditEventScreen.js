import { StyleSheet, Text, View } from 'react-native';

export default function EditEventScreen() {
    return (
        <View style={styles.container}>
            <Text>Edit Event Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});