import React, { createContext, useState, useEffect, ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { AuthContextType, User } from "../types/authTypes"

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
)

interface Props {
  children: ReactNode
}

const USERS_KEY = "token"
const CURRENT_USER_KEY = "refreshToken"

export const AuthProvider: React.FC<Props> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    loadCurrentUser()
  }, [])

  const loadCurrentUser = async () => {
    const storedUser = await AsyncStorage.getItem("user")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }

  const login = async (response: User, token: string, refreshToken: string) => {
    const userData = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      gender: response.gender,
      image: response.image,
    }
    await AsyncStorage.setItem(USERS_KEY, token)
    await AsyncStorage.setItem(CURRENT_USER_KEY, refreshToken)
    await AsyncStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem(USERS_KEY)
    await AsyncStorage.removeItem(CURRENT_USER_KEY)
    await AsyncStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}