import React from "react"
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity
} from "react-native"

interface Props {
  visible: boolean
  message: string
  onClose: () => void
}

const ErrorModal: React.FC<Props> = ({
  visible,
  message,
  onClose
}) => {

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >

      <View style={styles.overlay}>

        <View style={styles.container}>

          <Text style={styles.title}>
            Error
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>
              OK
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </Modal>
  )
}

export default ErrorModal


const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },

  container: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    alignItems: "center"
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff4d4f",
    marginBottom: 10
  },

  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20
  },

  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }

})