import React, { useContext } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { AuthContext } from "../context/AuthContext"

import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/LoginScreen"
import HomeScreen from "../screens/HomeScreen"

export type RootStackParamList = {
  Splash: undefined
  Login: undefined
  Signup: undefined
  Home: undefined
  UserListScreen: undefined
  FileTree: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator = () => {

  const { user } = useContext(AuthContext)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {!user ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />

        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
        </>
      )}

    </Stack.Navigator>
  )
}

export default AppNavigator