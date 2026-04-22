import React from "react"
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity
} from "react-native"

interface Props {
    visible: boolean
    onCancel: () => void
    onConfirm: () => void
}

const LogoutModal: React.FC<Props> = ({
    visible,
    onCancel,
    onConfirm
}) => {

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >

            <View style={styles.overlay}>

                <View style={styles.container}>

                    <Text style={styles.title}>
                        Logout
                    </Text>

                    <Text style={styles.message}>
                        Are you sure you want to logout?
                    </Text>

                    <View style={styles.buttons}>

                        <TouchableOpacity
                            onPress={onCancel}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            style={styles.logoutButton}
                        >
                            <Text style={styles.logoutText}>
                                Logout
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>

        </Modal>
    )
}

export default LogoutModal


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
        borderRadius: 12,
        padding: 25
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },

    message: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20
    },

    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },

    cancelButton: {
        marginRight: 15
    },

    cancelText: {
        fontSize: 16,
        color: "#777"
    },

    logoutButton: {
        backgroundColor: "#4A90E2",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6
    },

    logoutText: {
        color: "#fff",
        fontWeight: "600"
    }

})