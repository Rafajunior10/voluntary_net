import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    console.log("Login com:", email, password);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Erro ao logar:", error.message);
      Alert.alert("Erro ao logar", error.message);
    } else {
      console.log("Login bem-sucedido", data);
      router.push("/home");
    }
  };

  const handleNavigateToRegister = () => {
    router.push("/register");
  };

    const handleNavigateToRecoverPassword = () => {
    router.push("/recoverPassword");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNavigateToRegister}>
        <Text style={styles.registerText}>Cadastrar-se</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNavigateToRecoverPassword}>
        <Text style={styles.registerText}>Esqueceu a Senha?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    ...Platform.select({

      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },

      android: {
        elevation: 2,
      },

      default: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      },
    }),
  },

  button: {
    backgroundColor: "#eb4f4f",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  registerText: {
    marginTop: 5,
    fontSize: 12,
    color: "#eb4f4f",
  },
  
  form: {
    width: "100%",
  },
});

export default LoginScreen;
