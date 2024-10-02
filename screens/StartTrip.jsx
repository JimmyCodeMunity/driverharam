import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useEffect, useState, useContext } from "react";

import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
const wh = Dimensions.get("window").height;
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const GOOGLE_MAPS_API_KEY = "AIzaSyDdUQ1EIQJB46n2RSusQro1qP3Pd4mGZcA";
import { io } from "socket.io-client";
import { BASE_URL } from "../config";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "react-native";

// const socket = io.connect("http://192.168.0.100:8000");
const socket = io.connect("http://192.168.1.18:8000");

const StartTrip = ({ navigation, route }) => {
  const { originloc, destinationloc,pickup,drop } = route.params;
  const [drivers, setDrivers] = useState([]);
  const [finding, setFinding] = useState(true);
  const { userdata } = useContext(AuthContext);
  const [paymethod, setPaymethod] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([originloc, destinationloc], {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    }
  }, [originloc, destinationloc]);

  const [driverLocation, setDriverLocation] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [found, setFound] = useState([]);
  const [looking, setLooking] = useState(false);

  const findDriver = async () => {
    setLooking(true);
    socket.emit("find-driver", {
      userId: userdata?.userdata?._id,
      startLocation: originloc,
      destinationLocation: destinationloc,
    });

    socket.on("trip-accepted", (trip) => {
      console.log("trip created", trip);
      setFound([trip]);
      setFinding(false);
      setTripDetails(trip);
      socket.on("driver-location-changed", (location) => {
        setDriverLocation(location);
      });
    });

    socket.on("trip-acceptedbydriver", (trip) => {
      console.log(trip);
      navigation.navigate("ridedecision", { trip: trip });
    });

    return () => {
      socket.off("trip-accepted");
      socket.off("driver-location-changed");
    };
  };

  const findDrivers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getonlinedrivers`);
      setDrivers(response.data);
    } catch (error) {
      console.log("error getting driver", error);
    }
  };

  useEffect(() => {
    getDrivers();
  }, []);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);

  const checkPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === "granted") {
      return true;
    }
    return false;
  };

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      setCurrentLocation({ latitude, longitude });
      getLocationName(latitude, longitude);
    } catch (error) {
      console.error(error);
    }
  };

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        setLocationName(address);
      } else {
        setLocationName("Unknown Location");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Error fetching location");
    } finally {
      setLoadingLocation(false);
    }
  };

  const getDrivers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getonlinedrivers`);
      setDrivers(response.data);
    } catch (error) {
      console.log("Error getting drivers", error);
    }
  };

  useEffect(() => {
    checkPermission();
    getLocation();
    getDrivers();
  }, []);

  useEffect(() => {
    const initializeSocket = () => {
      socket.on("driver-location-changed", (driver) => {
        const { _id, location } = driver;
        if (location && location.coordinates) {
          setDrivers((prevDrivers) => {
            const existingDriverIndex = prevDrivers.findIndex(
              (d) => d.id === _id
            );
            if (existingDriverIndex !== -1) {
              const updatedDrivers = [...prevDrivers];
              updatedDrivers[existingDriverIndex].location.coordinates =
                location.coordinates;
              return updatedDrivers;
            } else {
              return [...prevDrivers, { id: _id, location }];
            }
          });
        }
      });
    };

    const initialize = async () => {
      const permissionGranted = await checkPermission();
      if (permissionGranted) {
        await getLocation();
        await getDrivers();
        initializeSocket();
      }
    };

    initialize();

    return () => {
      socket.off("driver-location-changed");
    };
  }, []);

  // Log origin and destination coordinates to confirm
  console.log("Start coords:", originloc);
  console.log("End coords:", destinationloc);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="absolute z-[20] mt-12 w-full px-8 top-10 justify-center items-center">
        <View className="bg-white px-4 flex-row items-center justify-between rounded-3xl w-full h-12">
          <View>
            <Icon name="chevron-left" color="black" size={30} />
          </View>
          <View>
            <Pressable
              onPress={() => navigation.goBack()}
              className="bg-slate-300 h-8 rounded-xl w-60 justify-center items-center"
            />
          </View>
          <View></View>
        </View>
      </View>

      <View
        className="w-full relative"
        style={{ height: looking ? wh - 300 : wh - 300 }}
      >
        <MapView
          ref={mapRef}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          className="h-full w-full"
          showsUserLocation={true}
          mapType="mutedStandard"
          fitToCoordinates
          // initialRegion={{
          //   latitude: 36.8162551,
          //   longitude: -1.283381,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // }}
          
        >
          {drivers.map((driver) => {
            return (
              <Marker
                key={driver._id}
                coordinate={{
                  latitude: driver.location.coordinates[1],
                  longitude: driver.location.coordinates[0],
                }}
                title={driver.name}
                description={`Driver ID: ${driver._id}`}
              >
                <Image
                  source={require("../assets/car.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Marker>
            );
          })}

          {/* Draw the path between origin and destination */}
          <MapViewDirections
            origin={originloc}
            destination={destinationloc}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor="black"
            onReady={(result) => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min`);
            }}
          />

          {/* Marker for the origin location */}
          {originloc?.latitude != null && (
            <Marker coordinate={originloc} anchor={{ x: 0.5, y: 0.5 }}>
              <Image
                source={require("../assets/loc1.png")}
                className="object-contain h-12 w-12"
                style={styles.markerDestination}
                resizeMode="cover"
              />
            </Marker>
          )}

          {/* Marker for the destination location */}
          {destinationloc?.latitude != null && (
            <Marker coordinate={destinationloc} anchor={{ x: 0.5, y: 0.5 }}>
              <Image
                source={require("../assets/loc2.png")}
                className="object-contain h-12 w-12"
                style={styles.markerOrigin2}
                resizeMode="cover"
              />
            </Marker>
          )}
        </MapView>
      </View>

      {/* click to confirm ride request */}
      <View className="w-full py-5 justify-center items-center">
        <View className="flex-row items-center justify-between">
          <View className="h-4 w-4 rounded-full">
            <Text>{pickup}</Text>
          </View>
          <View className="h-4 w-4 rounded-full">
            <Text>{drop}</Text>
          </View>
          
        </View>

        <TouchableOpacity
          className="bg-red-400 h-12 w-80 rounded-xl justify-center items-center"
        >
          <Text className="text-white text-xl font-semibold">End Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StartTrip;

const styles = StyleSheet.create({
  markerOrigin2: {
    width: 40,
    height: 40,
  },
  markerDestination: {
    width: 40,
    height: 40,
  },
});
