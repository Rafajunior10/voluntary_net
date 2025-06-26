import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../../app/lib/supabase";

const Dialog = ({ visible, onClose, title, address }) => {
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");

    useEffect(() => {
        if (visible) {
            loadUserData();
        }
    }, [visible]);

    const loadUserData = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("users")
            .select("id, nome, idade")
            .eq("user_id", user.id)
            .single();

        if (!error && data) {
            setUserId(data.id);
            setName(data.nome || "");
            setAge(data.idade?.toString() || "");
        }
    };

    const handleConfirm = async () => {
        if (!userId) return;

        if (!selectedSchedule) {
            alert("Por favor, selecione um horário.");
            return;
        }

        const { error } = await supabase.from("volunteer_confirmations").insert([
            {
                user_id: userId,
                title,
                address,
                schedule: selectedSchedule,
            },
        ]);

        if (!error) onClose();
        else console.error("Erro ao salvar confirmação:", error);
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Text style={styles.dialogTitle}>{title}</Text>
                    <Text style={styles.dialogAddress}>{address}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome do voluntário"
                        value={name}
                        editable={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Idade"
                        value={age}
                        editable={false}
                        keyboardType="numeric"
                    />

                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedSchedule}
                            onValueChange={setSelectedSchedule}
                            style={styles.picker}
                        >
                            <Picker.Item label="Selecione um horário" value="" />
                            <Picker.Item label="08:00 - 10:00" value="08:00 - 10:00" />
                            <Picker.Item label="10:00 - 12:00" value="10:00 - 12:00" />
                            <Picker.Item label="14:00 - 16:00" value="14:00 - 16:00" />
                        </Picker>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                            <Text style={styles.confirmText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    dialog: {
        backgroundColor: "white",
        width: "85%",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },

    dialogTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },

    dialogAddress: {
        fontSize: 14,
        color: "#666",
        marginBottom: 15,
        textAlign: "center",
    },

    input: {
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        color: "#333",
    },

    pickerWrapper: {
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#fff",
    },

    picker: {
        width: "100%",
        height: 50,
        color: "#000",
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },

    cancelBtn: {
        backgroundColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
    },

    confirmBtn: {
        backgroundColor: "#eb4f4f",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginLeft: 5,
    },

    cancelText: {
        color: "#333",
        textAlign: "center",
        fontWeight: "bold",
    },

    confirmText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default Dialog;
