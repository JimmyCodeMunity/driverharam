import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Linking, // Import Linking API
} from "react-native";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { io } from "socket.io-client";
const socket = io.connect("http://192.168.1.18:8000");

const RideStartedScreen = ({ navigation, route }) => {
  const { trip } = route.params;
  const [driverdata, setDriverdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [driverphone, setDriverphone] = useState("");
  const [carmodel, setCarmodel] = useState("");
  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const drop = trip.to;
  const pickup = trip.from;

  const originloc = {
    latitude: trip.startLocation.coordinates[0],
    longitude: trip.startLocation.coordinates[1],
  };

  const destinationloc = {
    latitude: trip.destinationLocation.coordinates[0],
    longitude: trip.destinationLocation.coordinates[1],
  };

  console.log("start", originloc);
  console.log("end", destinationloc);

  const getDriverInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/userinfo/${trip.userId}`);
      const dataloaded = response.data;
      setDriverdata(dataloaded);
      setDriverphone(dataloaded.user.phone);
      setCarmodel(dataloaded.user.carmodel);
      setRegistration(dataloaded.user.registration);
      setName(dataloaded.user.name);
      setLoading(false);
    } catch (error) {
      console.log("error getting driver", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDriverInfo();
  }, [trip]);

  // Function to handle the call button press
  const makePhoneCall = (phoneNumber) => {
    let phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch((err) =>
      console.log("Error in making phone call:", err)
    );
  };

  const startTheTrip = (tripId) => {
    socket.emit("start-trip", {
      tripId
    });
    // navigation.navigate("StartTrip", {
    //   originloc: originloc,
    //   destinationloc: destinationloc,
    //   pickup: pickup,
    //   drop: drop,
    // })
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="justify-center items-center w-full">
        <Image className="h-32 w-32" source={require("../assets/logo.png")} />
      </View>
      <View className="w-full px-4">
        {loading ? (
          <View className="justify-center items-center w-full">
            <Text>Please wait while we get user info...</Text>
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : (
          <View className="text-center justify-center items-center">
            <View className="w-full px-5 bg-white rounded-md py-3 px-4">
              <View className="flex-row justify-between items-center border border-t-0 border-l-0 border-r-0 border-slate-400 py-3">
                <Text>Phone</Text>
                <Text>{driverphone}</Text>
              </View>
              <View className="flex-row justify-between items-center border border-t-0 border-l-0 border-r-0 border-slate-400 py-3">
                <Text>Name</Text>
                <Text>{name}</Text>
              </View>
              <View className="flex-row space-x-4 w-full justify-between items-center border border-t-0 border-l-0 border-r-0 border-slate-400 py-3">
                <View className="bg-black h-2 w-2 rounded-full"></View>
                <Text>{pickup}</Text>
              </View>
              <View className="flex-row justify-between items-center border border-t-0 border-l-0 border-r-0 border-slate-400 py-3">
                <View className="bg-black h-2 w-2"></View>
                <Text>{drop}</Text>
              </View>
            </View>

            <View className="flex-row w-full justify-center items-center py-6">
              {/* Call button */}
              <Pressable
                className="bg-black justify-center items-center w-20 h-20 rounded-full"
                onPress={() => makePhoneCall(driverphone)} // Call the function on press
              >
                <Icon name="phone" size={30} color="white" />
              </Pressable>
            </View>

            <View className="w-full justify-center items-center">
              <Pressable
                onPress={() =>
                  startTheTrip(trip._id)
                }
                className="h-12 w-80 rounded-md bg-red-500 justify-center items-center"
              >
                <Text className="text-white text-xl">Start Trip</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default RideStartedScreen;

const styles = StyleSheet.create({});
