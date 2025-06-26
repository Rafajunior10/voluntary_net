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
import { useRouter } from "expo-router";
import { supabase } from "./lib/supabase";
import { TextInputMask } from "react-native-masked-text";

const RegisterScreen = () => {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [idade, setIdade] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [aceitouTermos, setAceitouTermos] = useState(false);

    const handleRegister = async () => {
        if (!aceitouTermos) {
            Alert.alert("Atenção", "Você precisa aceitar os termos de uso!");
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert("Atenção", "As senhas não coincidem!");
            return;
        }

        if (!nome || !cpf || !email || !idade || !senha) {
            Alert.alert("Erro", "Preencha todos os campos!");
            return;
        }

        const idadeNum = Number(idade);
        if (isNaN(idadeNum) || idadeNum <= 0) {
            Alert.alert("Erro", "Idade inválida.");
            return;
        }

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password: senha,
            });

            if (authError) {
                throw authError;
            }

            const user = authData.user;

            const { error: insertError } = await supabase
                .from("users")
                .insert([
                    {
                        nome,
                        cpf,
                        email,
                        idade: idadeNum,
                        user_id: user?.id,
                    },
                ])
                .single();

            if (insertError) {
                throw insertError;
            }

            Alert.alert("Sucesso", "Seu cadastro foi realizado com sucesso!");
            router.push("/home");
        } catch (error: any) {
            Alert.alert("Erro", error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Complete seu cadastro</Text>
                <Text style={styles.headerSubtitle}>Insira suas informações pessoais</Text>
            </View>

            <View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.inputHalf]}
                        placeholder="Nome"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInputMask
                        type={'cpf'}
                        style={[styles.input, styles.inputHalf]}
                        placeholder="CPF"
                        keyboardType="numeric"
                        value={cpf}
                        onChangeText={setCpf}
                    />
                </View>

                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.inputHalf]}
                        placeholder="E-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={[styles.input, styles.inputHalf]}
                        placeholder="Idade"
                        keyboardType="numeric"
                        value={idade}
                        onChangeText={setIdade}
                    />
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar senha"
                    secureTextEntry
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                />
            </View>

            <View style={styles.termsContainer}>
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setAceitouTermos(!aceitouTermos)}
                >
                    {aceitouTermos && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
                <Text style={styles.termsText}>Aceitar termos de uso...</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Cadastrar</Text>
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

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 15,
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

    inputHalf: {
        width: "48%",
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

    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "#999",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },

    check: {
        color: "#eb4f4f",
        fontSize: 14,
        fontWeight: "bold",
    },

    termsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 15,
    },

    termsText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#333",
    },
});

export default RegisterScreen;
