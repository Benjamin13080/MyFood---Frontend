import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import user from "./reducers/user";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import Restriction from "./screens/Restriction";
import Regime from "./screens/Regime";
import Search from "./screens/Search";
import Recipe from "./screens/Recipe";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const reducers = combineReducers({ user });
const persistConfig = { key: "MyFood", storage };
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

const TabNavigator = () => {

  const user = useSelector((state) => state.user.value);
  const isUserLoggedIn = user.token ? <Tab.Screen name="Profile" component={Profile} /> : null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Regime") {
            iconName = "heart";
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Profile") {
            iconName = "user";
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6DCD7D",
        tabBarInactiveTintColor: "grey",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Regime" component={Regime} />
      <Tab.Screen name="Search" component={Search} />
      {isUserLoggedIn}
    </Tab.Navigator>
  );
};

export default function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: true }}>
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Restriction" component={Restriction} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="Recipe" component={Recipe} />
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
