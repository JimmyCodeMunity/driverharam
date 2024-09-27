import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const SettingScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
    await logout();
    navigation.replace("Login");
  };
  return (
    <View className="flex-1 justify-center items-center">
      <Text>SettingScreen</Text>
      <TouchableOpacity
        onPress={handleLogout}
        className="h-12 justify-center items-center w-60 rounded-md bg-red-500"
      >
        <Text className="text-white">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
