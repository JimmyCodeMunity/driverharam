import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const SuccessScreen = ({ navigation, route }) => {
  const { name } = route.params;
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={require("../assets/check.png")}
        className="h-32 w-32 object-cover"
      />
      <Text>Account Created</Text>
      <Text>successfully!!</Text>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({});
