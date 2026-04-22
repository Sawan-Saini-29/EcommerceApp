import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import apiService from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { validateEmail } from "../utils/validation";
import ErrorModal from "../components/ErrorModal";
import { GlobleStyle } from "../components/GlobleStyle";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

const LoginScreen = ({ navigation }: any) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);



  const handleLogin = async () => {

    if (!email || !password) {
      setErrorMessage("Please enter username and password")
      setErrorVisible(true)
      return;
    }

    if (!password) {
      setErrorMessage("Password Required")
      setErrorVisible(true)
    }

    try {
      const response = await apiService.post<LoginResponse, LoginRequest>("/auth/login", {
        username: email,
        password,
      });
      console.log("Login successful:", response.data);
    } catch (error: any) {
      setErrorMessage(error.message)
      setErrorVisible(true)
    }
  };

  return (
    <SafeAreaView style={GlobleStyle.container}>
      <View style={GlobleStyle.circleTop} />
      <View style={GlobleStyle.circleBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your account</Text>

          <CustomInput
            placeholder="Username"
            value={email}
            onChangeText={setEmail}
          />

          <CustomInput
            placeholder="Password"
            isPassword
            value={password}
            onChangeText={setPassword}
          />

          <CustomButton
            title="Login"
            onPress={handleLogin}
          />

        </View>
      </KeyboardAvoidingView>
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 25,
  },

  signupText: {
    textAlign: "center",
    marginTop: 18,
    color: "#555",
  },

  signupLink: {
    color: "#4A90E2",
    fontWeight: "600",
  },
});