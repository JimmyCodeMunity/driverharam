import { StyleSheet, Text, View } from "react-native";
import React from "react";

const TripsScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white">
      <View className="w-full justify-center items-center">
        <Text className="text-slate-500 font-semibold">My Trips</Text>
      </View>
    </View>
  );
};

export default TripsScreen;

const styles = StyleSheet.create({});
