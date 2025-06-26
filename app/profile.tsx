import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../app/lib/supabase";
import { useRouter } from "expo-router";
import BottomNav from "../components/navBar/bottomNav";

type Confirmation = {
    id: string;
    title: string;
    address: string;
    schedule: string;
    users?: {
        nome: string;
        idade: number;
    };
};

const ProfileScreen = () => {
    const [userData, setUserData] = useState({ nome: "", email: "" });
    const [userId, setUserId] = useState<number | null>(null);
    const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userId !== null) {
            fetchConfirmations();
        }
    }, [userId]);

    const fetchUserData = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("users")
            .select("id, nome, email")
            .eq("user_id", user.id)
            .single();

        if (!error && data) {
            setUserData({ nome: data.nome, email: data.email });
            setUserId(data.id);
        }
    };

    const fetchConfirmations = async () => {
        if (!userId) return;

        const { data, error } = await supabase
            .from("volunteer_confirmations")
            .select(`
        id,
        title,
        address,
        schedule,
        users ( nome, idade )`)
            .eq("user_id", userId);
        if (!error && data) {
            setConfirmations(
                data.map((item: any) => ({
                    ...item,
                    users: Array.isArray(item.users) ? item.users[0] : item.users,
                }))
            );
        }
    };

    const handleRemove = (id: string) => {
        Alert.alert("Remover", "Deseja cancelar essa inscrição?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Confirmar", onPress: () => removeConfirmation(id) },
        ]);
    };

    const removeConfirmation = async (id: string) => {
        const { error } = await supabase
            .from("volunteer_confirmations")
            .delete()
            .eq("id", id);

        if (!error) {
            setConfirmations((prev) => prev.filter((item) => item.id !== id));
        } else {
            console.error("Erro ao remover confirmação:", error);
            Alert.alert("Erro", "Não foi possível cancelar a inscrição.");
        }
    };


    const signOut = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <Text style={styles.navTextBold}>
                    Olá {userData.nome || "Usuário"}!
                </Text>
                <TouchableOpacity onPress={signOut}>
                    <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Ionicons
                    name="person-circle-outline"
                    size={120}
                    color="#eb4f4f"
                    style={styles.profileIcon}
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Nome:</Text>
                    <Text style={styles.value}>{userData.nome}</Text>

                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{userData.email}</Text>
                </View>

                <Text style={styles.sectionTitle}>Voluntariado Confirmado:</Text>

                {confirmations.length === 0 ? (
                    <Text style={styles.noConfirmations}>
                        Nenhuma inscrição confirmada ainda.
                    </Text>
                ) : (
                    confirmations.map((item) => (
                        <View style={styles.card} key={item.id}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDetail}>Endereço: {item.address}</Text>
                            <Text style={styles.cardDetail}>Horário: {item.schedule}</Text>
                            <Text style={styles.cardDetail}>
                                Nome: {item.users?.nome || "—"}
                            </Text>
                            <Text style={styles.cardDetail}>
                                Idade: {item.users?.idade ?? "—"}
                            </Text>

                            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
                                <Text style={styles.removeText}>Cancelar inscrição</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            <BottomNav />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },

    navbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
        backgroundColor: "#eb4f4f",
        paddingHorizontal: 20,
    },

    navTextBold: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },

    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    profileIcon: {
        alignSelf: "center",
        marginTop: 30,
    },

    infoContainer: {
        marginTop: 20,
        marginBottom: 20,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },

    value: {
        fontSize: 16,
        color: "#666",
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#eb4f4f",
    },

    noConfirmations: {
        fontStyle: "italic",
        color: "#999",
    },

    card: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },

    cardDetail: {
        fontSize: 14,
        color: "#555",
        marginBottom: 3,
    },

    removeButton: {
        marginTop: 10,
        backgroundColor: "#eb4f4f",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },

    removeText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default ProfileScreen;
