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
const CURRENT_USER_KEY = "token"

export const AuthProvider: React.FC<Props> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    loadCurrentUser()
  }, [])

  const loadCurrentUser = async () => {
    const storedUser = await AsyncStorage.getItem(CURRENT_USER_KEY)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }

  const login = async (email: string, password: string) => {

    const storedUsers = await AsyncStorage.getItem(USERS_KEY)

    if (!storedUsers) {
      throw new Error("No users registered")
    }

    const users: User[] = JSON.parse(storedUsers)

    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    )

    if (!existingUser) {
      throw new Error("Incorrect email or password")
    }

    setUser(existingUser)

    await AsyncStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(existingUser)
    )
  }

  const signup = async (name: string, email: string, password: string) => {

    const storedUsers = await AsyncStorage.getItem(USERS_KEY)

    let users: User[] = storedUsers ? JSON.parse(storedUsers) : []

    const emailExists = users.some((u) => u.email === email)

    if (emailExists) {
      throw new Error("User already exists with this email")
    }

    const newUser: User = { name, email, password }

    users.push(newUser)

    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    )

    await AsyncStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(newUser)
    )

    setUser(newUser)
  }

  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem(CURRENT_USER_KEY)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}