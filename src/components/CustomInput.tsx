import React, { useState } from "react"
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity
} from "react-native"
import { Eye, EyeSlash } from "phosphor-react-native"

interface Props extends TextInputProps {
  isPassword?: boolean
}

const CustomInput: React.FC<Props> = ({ isPassword, ...props }) => {

  const [secure, setSecure] = useState(true)

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        secureTextEntry={isPassword ? secure : false}
        {...props}
      />

      {isPassword && (
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setSecure(!secure)}
        >
          {secure ? (
            <EyeSlash size={22} color="#777" />
          ) : (
            <Eye size={22} color="#4A90E2" />
          )}
        </TouchableOpacity>
      )}

    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({

  container: {
    position: "relative",
    justifyContent: "center"
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    paddingRight: 40
  },

  icon: {
    position: "absolute",
    right: 12
  }

})