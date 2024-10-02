import { StyleSheet, Text, View,TextInput,Alert,TouchableOpacity,ActivityIndicator, SafeAreaView, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from '../config'
import { AuthContext } from '../context/AuthContext'

const LoginScreen = ({navigation}) => {
  const {login,loading} = useContext(AuthContext)
  const [email,setEmail] = useState("jimmy@gmail.com");
  const [password,setPassword] = useState("123456");
  const [dataload,setDataload] = useState(loading)

  // const handleLogin = async()=>{
  //   setLoading(true)
  //   try {
  //     if(!email||!password){
  //       setLoading(false)
  //       Alert.alert("All fields are required")
  //     }
  //     else{
  //       const response = await axios.post(`${BASE_URL}/driverlogin`,{email,password});
  //       const userdata = response.data;
        
  //       if(userdata.status === "ok"){
  //         console.log(userdata)
  //         Alert.alert("Login successfull")
  //         AsyncStorage.setItem('token',"token")
  //         AsyncStorage.setItem("isLoggedin",JSON.stringify(true))
  //         navigation.navigate("Home")
  //       }
  //       setLoading(false)
  //     }
      
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Error signing in")
  //     setLoading(false)
  //     // navigation.navigate("Home")
      
  //   }
  // }
  const handleLogin = async () => {
    setDataload(!loading);
    try {
      if (!email || !password) {
        Alert.alert("All fields are required");
        return;
      }
      await login(email, password);
      Alert.alert("Login successful");
      navigation.navigate('Home');
      setDataload(!loading);
    } catch (error) {
      Alert.alert("Login failed", error.message);
      setDataload(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      
      <View className="w-full px-4 space-y-4" keyboardShouldPersistTaps={true}>
        <Text className="text-3xl font-semibold">Sign In</Text>

        
        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter email"
          placeholderTextColor="#868686"
          value={email}
          onChangeText={(text)=>setEmail(text)}
        />
        
        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter password"
          placeholderTextColor="#868686"
          value={password}
          onChangeText={(text)=>setPassword(text)}
        />

        <TouchableOpacity
        // onPress={()=>navigation.navigate('Home')}
        onPress={handleLogin}
        className="bg-red-500 h-12 rounded-2xl justify-center items-center">
          {
            !dataload ? (
              <Text className="text-white text-xl font-semibold">Submit</Text>
            ):(
              <ActivityIndicator size="large" color="white"/>
            )
          }
        </TouchableOpacity>

        <Pressable onPress={()=>navigation.navigate("Register")} className="w-full">
          <Text className="text-slate-600">Already have an account?
            <Text className="text-red-400">{" "}Create Account</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})