import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity
} from "react-native";

import { User } from "../models/User";
import { GlobleStyle, width } from "../components/GlobleStyle";
import { SafeAreaView } from "react-native-safe-area-context";

const UserListScreen = ({ navigation }: any) => {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {

    };

    const renderUser = ({ item }: { item: User }) => {

        const firstLetter = item.name?.charAt(0).toUpperCase();

        return (
            <View style={styles.card}>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{firstLetter}</Text>
                </View>

                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>

            </View>
        );
    };

    return (
        <SafeAreaView style={GlobleStyle.container}>

            {/* Background circles */}
            <View style={GlobleStyle.circleTop} />
            <View style={GlobleStyle.circleBottom} />

            {/* Back button */}
            <TouchableOpacity
                style={GlobleStyle.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={GlobleStyle.backText}>←</Text>
            </TouchableOpacity>

            <View style={styles.container}>

                <Text style={styles.title}>
                    Registered Users ({users.length})
                </Text>

                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id?.toString() ?? ""}
                    renderItem={renderUser}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 40
                    }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: "center", marginTop: 50 }}>
                            No Users Found
                        </Text>
                    }
                />
            </View>

        </SafeAreaView>
    );
};

export default UserListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },

    card: {
        width: width * 0.9,
        padding: 25,
        borderRadius: 18,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 6,
        alignItems: "center"
    },

    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#4A90E2",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12
    },

    avatarText: {
        fontSize: 28,
        color: "#fff",
        fontWeight: "bold"
    },

    name: {
        fontSize: 20,
        fontWeight: "600",
        color: "#4A90E2",
        marginBottom: 4
    },

    email: {
        fontSize: 16,
        color: "#777"
    },
});