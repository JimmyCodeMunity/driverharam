import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AboutScreen = ({navigation}) => {
  return (
    <View className="flex-1 bg-white">
      <View className="text-center items-center w-full justify-center">
        <Text className="text-slate-600 text-xl font-semibold">About Haramád</Text>
      </View>
    </View>
  )
}

export default AboutScreen

const styles = StyleSheet.create({})