import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PolicyScreen = ({navigation}) => {
  return (
    <View className="flex-1 justify-center items-center">
        <View className="w-full justify-center items-center">
            <Text className="text-center text-xl font-semibold text-xl">Privacy Policy</Text>
        </View>
      <ScrollView className=""></ScrollView>
    </View>
  )
}

export default PolicyScreen

const styles = StyleSheet.create({})