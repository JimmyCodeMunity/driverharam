import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("Jimmy Wafula");
  const [phone, setPhone] = useState("0112163919");
  const [email, setEmail] = useState("dev.jimin02@gmail.com");
  const [address, setAddress] = useState("Nairobi");
  const [carmodel, setCarmodel] = useState("Toyota Vitz");
  const [registration, setRegistration] = useState("KAB 234Y");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const createAccout = async () => {
    setLoading(true);
    try {
      const response = await axios.post("", {
        name,
        phone,
        email,
        address,
        carmodel,
        registration,
        password,
      });
      const userdata = response.data;

      if (userdata.status === "ok") {
        console.log(userdata);
        Alert.alert("Account successfull");
        AsyncStorage.setItem("token", "token");
        // navigation.goBack()
        
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error signing in");
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View className="absolute top-5 left-5">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-red-500 justify-center items-center h-12 w-12 rounded-full"
        >
          <Icon name="chevron-left" color="white" size={30} />
        </TouchableOpacity>
      </View>
      <View className="w-full px-4 space-y-4">
        <Text className="text-3xl font-semibold">Create Account</Text>

        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter fullname"
          placeholderTextColor="#868686"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter email"
          placeholderTextColor="#868686"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter phone"
          placeholderTextColor="#868686"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter phone"
          placeholderTextColor="#868686"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter phone"
          placeholderTextColor="#868686"
          value={carmodel}
          onChangeText={(text) => setCarmodel(text)}
        />
        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter phone"
          placeholderTextColor="#868686"
          value={registration}
          onChangeText={(text) => setRegistration(text)}
        />
        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter password"
          placeholderTextColor="#868686"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

       {
        !loading ? (
          <TouchableOpacity
          //  onPress={createAccout} 
           onPress={()=>navigation.navigate('Success',{name:name})} 
           className="bg-red-500 h-12 rounded-2xl justify-center items-center">
          <Text className="text-white text-xl font-semibold">Submit</Text>
        </TouchableOpacity>
        ):(
          <View className="w-full">
            <ActivityIndicator size="small" color="gray"/>
          </View>
        )
       }

        <View className="w-full">
          <Text className="text-slate-600">
            Already have an account?
            <Text className="text-red-400"> Create Account</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
