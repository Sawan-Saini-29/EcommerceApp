import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { GlobleStyle } from "../components/GlobleStyle";
import { SafeAreaView } from "react-native-safe-area-context";


const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={GlobleStyle.circleTop} />
      <View style={GlobleStyle.circleBottom} />

      <View style={styles.content}>
        <Text style={styles.logo}>Auth App</Text>
        <Text style={styles.subtitle}>Secure Authentication</Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    alignItems: "center",
  },

  logo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 25,
  },
});