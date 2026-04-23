import React, { useContext, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CustomButton from "../components/CustomButton"
import LogoutModal from "../components/LogoutModal"
import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext"
import { GlobleStyle } from "../components/GlobleStyle"

const ProfileScreen = () => {
  const { logout, user } = useContext(AuthContext)
  const { clearCart } = useContext(CartContext)
  const [visible, setVisible] = useState(false)

  const confirmLogout = async () => {
    setVisible(false)
    clearCart()
    await logout()
  }

  return (
    <SafeAreaView style={GlobleStyle.container}>
      <View style={GlobleStyle.circleTop} />
      <View style={GlobleStyle.circleBottom} />

      <View style={styles.container}>
        <View style={styles.card}>
          <View style={[styles.avatar, user?.image ? {} : styles.avatarDefault]}>
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.avatarText}>
                {user?.firstName?.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <Text style={styles.title}>User Profile</Text>
          <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{user?.username ?? "-"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{user?.gender ?? "-"}</Text>
          </View>

          <CustomButton title="Logout" onPress={() => setVisible(true)} />
        </View>
      </View>

      <LogoutModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    alignItems: "center",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  avatarDefault: {
    backgroundColor: "#4A90E2",
  },
  avatarText: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A90E2",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#777",
    marginBottom: 16,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    color: "#555",
    fontWeight: "400",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 44,
  },
})
