import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Import Views
import AddEventScreen from "./src/views/AddEventScreen";
import EditEventScreen from "./src/views/EditEventScreen";
import EventDetailScreen from "./src/views/EventDetailScreen";
import HomeScreen from "./src/views/HomeScreen";
import SettingsScreen from "./src/views/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#061136",
            },
            headerTintColor: "#E7EEFF",
            headerTitleStyle: {
              fontWeight: "700",
            },
            contentStyle: {
              backgroundColor: "#03091f",
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddEvent"
            component={AddEventScreen}
            options={{ title: "New Event" }}
          />
          <Stack.Screen
            name="EventDetail"
            component={EventDetailScreen}
            options={{ title: "Countdown" }}
          />
          <Stack.Screen
            name="EditEvent"
            component={EditEventScreen}
            options={{ title: "Edit Event" }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Settings" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
