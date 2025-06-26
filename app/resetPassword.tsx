import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const ResetPasswordScreen = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState("");
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        if (params.token) {
            setToken(params.token.toString());
        }
    }, [params]);

    const handlePasswordReset = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        try {
            const response = await fetch("https://SEU-PROJETO.vercel.app/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password: newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Erro", data.error || "Erro ao redefinir senha.");
                return;
            }

            Alert.alert("Sucesso", "Senha redefinida com sucesso.");
            router.push("/");
            
        } catch (error) {
            const err = error as Error;
            console.error("Erro:", err.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Redefinir Senha</Text>
                <Text style={styles.headerSubtitle}>
                    Insira sua nova senha abaixo
                </Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Nova senha"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmar nova senha"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Redefinir senha</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    header: {
        width: "100%",
        marginBottom: 20,
        alignItems: "flex-start",
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },

    headerSubtitle: {
        fontSize: 14,
        color: "#666",
    },

    container: {
        padding: 20,
        backgroundColor: "#f5f5f5",
        flexGrow: 1,
        justifyContent: "center",
    },

    input: {
        height: 50,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    button: {
        backgroundColor: "#eb4f4f",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ResetPasswordScreen;
