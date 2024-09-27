import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import BottomNavigation from "./BottomNavigation";
import { ChatScreen } from "../screens/ChatScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SuccessScreen from "../screens/SuccessScreen";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import SettingScreen from "../screens/SettingScreen";

const Stack = createStackNavigator();

const StackNavigation = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown:false}} /> */}
      {!isLoggedIn ? (
        <>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false, presentation: "modal" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ headerShown: true, presentation: "modal" }}
          />
          <Stack.Screen
            name="Success"
            component={SuccessScreen}
            options={{ headerShown: true, presentation: "modal" }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingScreen}
            options={{ headerShown: true, presentation: "fullScreenModal" }}
          />
        </>
      )}

      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
    </Stack.Navigator>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
