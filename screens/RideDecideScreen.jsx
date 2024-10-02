import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import { io } from "socket.io-client";
const socket = io.connect("http://192.168.1.18:8000");

const RideDecideScreen = ({ navigation, route }) => {
  const { trip } = route.params;
  const acceptTrip = (tripId) => {
    console.log("Trip accepted:", tripId);

    // Emit an event to notify the server that the trip has been accepted
    socket.emit("accept-trip", { tripId });
    navigation.navigate("Started", { trip: trip });
  };
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="w-full justify-center items-center">
        <Image source={require("../assets/wait.png")} className="h-60 w-60" />
      </View>
      <View className="flex-col justify-center items-center text-center space-y-5 px-4 items-center w-full">
        <Text className="text-2xl text-center font-semibold text-slate-500">
          You have a new trip Request
        </Text>
        <TouchableOpacity
          onPress={() => acceptTrip(trip._id)}
          className="w-80 bg-green-500 rounded-xl h-14 justify-center items-center"
        >
          <Text className="text-white font-semibold text-lg">Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Started")}
          className="w-80 rounded-xl bg-red-500 h-14 justify-center items-center"
        >
          <Text className="text-white font-semibold text-lg">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RideDecideScreen;

const styles = StyleSheet.create({});
