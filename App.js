import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNavigation from "./navigation/StackNavigation";
import { useEffect, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import { AuthProvider } from "./context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const checkPermision = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === "granted") {
      const permission = await askPermision();
      return permission;
    }
    return true;
  };

  const askPermision = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    return permission.status === "granted";
  };

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      setCurrentLocation({ latitude: latitude, longitude: longitude });
      setLatlng({ latitude: latitude, longitude: longitude });
      // console.log("cordis",{ latitude: latitude, longitude: longitude })
    } catch (error) {}
  };

  //current location
  console.log("current location at", currentLocation);

  if (currentLocation) {
    const current = {
      description: "Current",
      geometry: {
        location: {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        },
      },
    };
  }
  useEffect(() => {
    checkPermision();
    getLocation();
    // console.log(latlng)
  }, []);
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
