import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { supabase } from "./lib/supabase";
import uuid from 'react-native-uuid';

const RecoverPasswordScreen = () => {
    const [email, setEmail] = useState("");

    const handleRecoverPassword = async () => {
        if (!email) {
            Alert.alert("Erro", "Digite um e-mail válido.");
            return;
        }

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (userError || !userData) {
            Alert.alert("Erro", "E-mail não encontrado.");
            return;
        }

        const token = uuid.v4();

        const { error: insertError } = await supabase
            .from('password_reset_tokens')
            .insert({
                user_id: userData.id,
                token,
            });

        if (insertError) {
            Alert.alert("Erro", "Erro ao salvar token.");
            return;
        }

        const resetLink = `https://recover-voluntary-net.vercel.app/resetPassword?token=${token}`;

        console.log("Link de redefinição:", resetLink);

        Alert.alert(
            "Sucesso",
            "Link de recuperação gerado. (Simulação de envio de e-mail)"
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Recuperar Senha</Text>
                <Text style={styles.headerSubtitle}>
                    Insira seu e-mail para redefinir a senha
                </Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.button} onPress={handleRecoverPassword}>
                <Text style={styles.buttonText}>Enviar link de recuperação</Text>
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

export default RecoverPasswordScreen;
