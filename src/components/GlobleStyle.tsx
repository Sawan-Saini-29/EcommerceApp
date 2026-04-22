import { Dimensions, StyleSheet } from "react-native";

export const { width } = Dimensions.get("window");

export const GlobleStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6FB"
    },
    circleTop: {
        position: "absolute",
        width: width * 1.1,
        height: width * 1.1,
        backgroundColor: "#6FB1FC",
        borderRadius: width,
        top: -width * 0.6,
        left: -width * 0.2,
    },
    circleBottom: {
        position: "absolute",
        width: width * 1.1,
        height: width * 1.1,
        backgroundColor: "#6FB1FC",
        borderRadius: width,
        bottom: -width * 0.6,
        right: -width * 0.2
    },
    backButton: {
        marginLeft: 20,
        marginTop: 10
    },

    backText: {
        fontSize: 58,
        fontWeight: "600",
        color: "white"
    },
});