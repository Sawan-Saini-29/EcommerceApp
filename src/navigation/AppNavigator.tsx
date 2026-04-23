import React, { useContext } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext"

import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/LoginScreen"
import HomeScreen from "../screens/HomeScreen"
import ProductsScreen from "../screens/ProductsScreen"
import CartScreen from "../screens/CartScreen"
import { ShoppingBagIcon, ListIcon, ShoppingCartIcon } from "phosphor-react-native"
import { TouchableOpacity } from "react-native"

export type RootStackParamList = {
  Splash: undefined
  Login: undefined
  Signup: undefined
  Home: undefined
  UserListScreen: undefined
  FileTree: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const { cart } = useContext(CartContext)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#666',

        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Products') {
            return (
              <ShoppingBagIcon
                size={size}
                color={color}
                weight={focused ? 'fill' : 'regular'}
              />
            );
          }

          if (route.name === 'Cart') {
            return (
              <ShoppingCartIcon
                size={size}
                color={color}
                weight={focused ? 'fill' : 'regular'}
              />
            );
          }
        },
      })}

    >
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarLabel: 'Products',
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount.toString() : undefined,
        }}
      />
    </Tab.Navigator>
  )
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A90E2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => console.log('Three dot clicked')}
            style={{ marginLeft: 15 }}
          >
            <ListIcon
              size={22}
              color="#fff"
              weight="bold"
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="Shop"
        component={TabNavigator}
        options={{
          title: 'E-commerce App',
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={HomeScreen}
        options={{
          title: 'User Profile',
        }}
      />
    </Drawer.Navigator>
  )
}

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
          <Stack.Screen name="Home" component={DrawerNavigator} />
        </>
      )}

    </Stack.Navigator>
  )
}

export default AppNavigator