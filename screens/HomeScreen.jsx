import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import Icon from "react-native-vector-icons/Entypo";
import * as Location from "expo-location"; // Import Location API from Expo
import axios from "axios"; // Import Axios for API requests
import { GGOGLE_MAPS_API_KEY } from "../constants";
import { io } from "socket.io-client";
import { PaperProvider, Modal, Portal, Button } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
// const socket = io.connect("https://sockettestserver.vercel.app/");
// const socket = io.connect("https://charmed-dog-marble.glitch.me/");
const socket = io.connect("http://192.168.1.130:8000");

const wh = Dimensions.get("window").height;

const HomeScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [onlinestatus, setOnlinestatus] = useState(false);
  const { userToken, isLoggedIn } = useContext(AuthContext);
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [driverdata,setDriverdata] = useState([])


  console.log("token",userToken)
  

  const getUserdata = async () => {
    try {
      if (userToken) {
        const response = await axios.post(`${BASE_URL}/getdriverdata`, {
          userToken,
        });
        const userData = response.data;
        console.log(userdata);
        setDriverdata(userData);
         // Save user data in state
        // await AsyncStorage.setItem('userdata', JSON.stringify(userData)); // Persist user data
        console.log('userdata from the API', userData);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };
  useEffect(()=>{
    getUserdata()

  },[])

  // console.log("data collected",userdata)
  // console.log("token",userToken)
  // console.log("logged state",isLoggedIn)

  // handle modal
  getOnlinestate = async()=>{
    try {
      
    } catch (error) {
      console.log("error checking state")
      
    }
  }

  // request
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  // const driverid = "66f3b3e39187c654c86af03d";
  const [driverid, setDriverid] = useState(null);
  const car = "Nissan Note KAB 234Y";
  const phone = "0112163919";
  const [userid, setUserid] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    if (socket) {
      console.log("Socket connected");
    } else {
      console.log("Socket failed to connect");
    }
  }, []);

  //join room
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", { room });
    }
  };
  const sendMessage = () => {
    socket.emit("send_message", { message });
    // socket.emit("send_message", { message, room });
  };

  socket.on("rideRequest", (data) => {
    // const { userId, startLocation, endLocation } = data;
    // Show ride request to driver
    console.log("New ride request:", data);
    Alert.alert("You have a new ride request");
  });

  const respondToRide = (data) => {
    Alert.alert("data");
    socket.emit("rideResponse", data);
    console.log("data", data);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setUserid(data.userid);
      setFrom(data.start);
      setTo(data.end);
      // console.warn(data.userid);
      // Alert.alert(data.userid);
      console.log("online state", isOnline);
      if (isOnline) {
        showModal();
      }
    });
    socket.on("driver-online", (driver) => {
      setIsOnline(true);
      console.warn("driverdata", driver);
    });
    socket.on("driver-offline", (driver) => {
      setIsOnline(false);
      console.warn("driverdata", driver);
    });
  }, [socket]);

  // Add your Google Maps API key here

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

  // Get location name using Google Maps Reverse Geocoding API
  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GGOGLE_MAPS_API_KEY}`
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
      setLoadingLocation(false); // Stop the loader
    }
  };

  useEffect(() => {
    checkPermission();
    getLocation();
  }, []);

  // Toggle online/offline
  const goOnline = async (mydriverid) => {
    // console.log("myid",mydriverid)
    // setIsOnline(!isOnline);
    // console.log(isOnline)
    socket.emit("driver-go-online", {
      // driverId: "66f3b3e39187c654c86af03d",
      driverId: mydriverid,
      location: currentLocation,
    });
  };
  const goOffline = async (mydriverid) => {
    // console.log("myid",mydriverid)
    // setIsOnline(!isOnline);
    // console.log(isOnline)
    socket.emit("driver-go-offline", {
      // driverId: "66f3b3e39187c654c86af03d",
      driverId: mydriverid,
      location: currentLocation,
    });
  };

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  };

  useEffect(() => {
    const loadUserdata = async () => {
      try {
        // Fetch userdata from AsyncStorage
        const storedUserdata = await AsyncStorage.getItem("userdata");
        console.log("stored", storedUserdata);
        if (storedUserdata) {
          setUserdata(JSON.parse(storedUserdata));
          // setDriverid(JSON.parse(storedUserdata.userdata._id));
          // console.log("driverid",storedUserdata.userdata._id)
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    loadUserdata();
  }, []);

  // console.log("storeduser", userdata);
  return (
    <PaperProvider>
      {/* modal */}
      <Portal className="bg-white">
        <Modal
          visible={visible}
          className="justify-center px-5"
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <View className="w-full space-y-3 justify-center items-center">
            <Image
              source={require("../assets/taxi.png")}
              className="h-32 w-32 object-cover"
            />
            <Text className="text-slate-500">
              You have a new ride request from {userid}
            </Text>

            <TouchableOpacity className="bg-black h-10 w-60 justify-center items-center rounded-xl">
              <Text className="text-white text-lg">Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => hideModal()}
              className="bg-red-500 h-10 w-60 justify-center items-center rounded-xl"
            >
              <Text className="text-white text-lg">Decline</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

      {/* modal end */}
      <View className="bg-white flex-1">
        <MapView
          mapType={Platform.OS == "android" ? "none" : "mutedStandard"}
          provider={
            Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          className="w-full"
          style={{ height: wh - 150 }}
          showsUserLocation={true}
          followsUserLocation={true}
          showsBuildings={true}
          initialRegion={{
            latitude: currentLocation?.latitude || 28.450627,
            longitude: currentLocation?.longitude || -16.263045,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zoomEnabled={true}
        />

        {/* Loader for fetching current location */}
        {loadingLocation && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Fetching current location...</Text>
          </View>
        )}

        {/* Location Name */}
        {/* {!loadingLocation && (
        <View className="absolute top-10 w-full justify-center items-center">
          <Text className="text-lg font-bold">
            {locationName || "Fetching location..."}
          </Text>
        </View>
      )} */}

        {/* <TouchableOpacity
        
        className="top-12 p-2 left-5 absolute rounded-full bg-white justify-center items-center h-12 w-12">
          <Icon name="menu" color="black" size={25} />
        </TouchableOpacity>
        <Pressable className="top-10 right-5 absolute rounded-full bg-white justify-center items-center h-12 w-12">
          <Icon name="share" color="black" size={25} />
        </Pressable> */}

        {/* Balance */}
        <View className="absolute justify-center items-center top-10 w-full">
          <Pressable className="rounded-full bg-black shadow shadow-xl justify-center items-center h-12 p-2">
            <Text className="text-white text-2xl font-bold">KES.0.0</Text>
          </Pressable>
        </View>

        {/* Go online/offline button */}

        <View className="absolute justify-center items-center bottom-40 w-full">
          {!isOnline ? (
            <Pressable
              onPress={() => goOffline(userdata.userdata._id)}
              className="rounded-full bg-red-400 shadow shadow-xl justify-center items-center h-28 w-28"
            >
              <View className="justify-center items-center">
                <Text className="text-white text-2xl">Go</Text>
                <Text className="text-white text-2xl">Offline</Text>
              </View>
            </Pressable>
          ) : (
            <Pressable
              // onPress={goOnline}
              onPress={() => goOnline(userdata.userdata._id)}
              className="rounded-full bg-green-400 shadow shadow-xl justify-center items-center h-28 w-28"
            >
              <View className="justify-center items-center">
                <Text className="text-white text-2xl">Go</Text>
                <Text className="text-white text-2xl">Online</Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* Online/Offline Status */}
        <View className="h-32 bottom-0 w-full px-5 bg-white flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Icon name="cog" color="black" size={25} />
          </TouchableOpacity>
          <View className="px-5">
            {userdata && (
              <Text className="text-center">Hi,{userdata.userdata.name}</Text>
            )}
            {isOnline ? (
              <View className="text-center justify-center items-center">
                {/* <Text className="text-sm">
                {!loadingLocation ? locationName : "fetching location..."}
              </Text> */}

                <Text className="text-xl">You are Online</Text>
              </View>
            ) : (
              <View className="text-center justify-center items-center">
                {/* <Text className="text-sm">
                {!loadingLocation ? locationName : "fetching location..."}
              </Text> */}
                {driverid && <Text>user:{driverid}</Text>}
                <Text className="text-xl">You are Offline</Text>
              </View>
            )}
          </View>
          <Pressable onPress={() => navigation.navigate("Chat")}>
            <Icon name="chat" color="black" size={25} />
          </Pressable>
        </View>
      </View>
    </PaperProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: "center",
    justifyContent: "center",
  },
});
