import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const CustomButton: React.FC<Props> = ({
  title,
  onPress,
  loading,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4A90E2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  disabled: {
    backgroundColor: "#A0BFE8",
  },

  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});