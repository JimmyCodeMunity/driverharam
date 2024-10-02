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
import RideDecideScreen from "../screens/RideDecideScreen";
import RideStartedScreen from "../screens/RideStartedScreen";
import StartTrip from "../screens/StartTrip";
import PolicyScreen from "../screens/PolicyScreen";
import ConditionsScreen from "../screens/ConditionsScreen";

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
            options={{ headerShown:false, presentation: "fullscreenmodal" }}
          />
          <Stack.Screen
            name="Decision"
            component={RideDecideScreen}
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="Started"
            component={RideStartedScreen}
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="StartTrip"
            component={StartTrip}
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="Policy"
            component={PolicyScreen}
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="Conditions"
            component={ConditionsScreen}
            options={{ headerShown: false, presentation: "modal" }}
          />
          {/* <Stack.Screen
            name="Decision"
            component={RideDetail}
            options={{ headerShown: false, presentation: "modal" }}
          /> */}
        </>
      )}

      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
    </Stack.Navigator>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
