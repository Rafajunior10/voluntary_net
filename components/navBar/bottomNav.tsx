import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BottomNav = () => {
  const router = useRouter();

  return (
    <View style={styles.snackbar}>
      <TouchableOpacity style={styles.snackItem} onPress={() => router.push("/home")}>
        <Ionicons name="home-outline" size={24} color="white" />
        <Text style={styles.snackText}>Home</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.snackItem} onPress={() => router.push("/profile")}>
        <Ionicons name="person-outline" size={24} color="white" />
        <Text style={styles.snackText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.snackItem} onPress={() => router.push("/home")}>
        <Ionicons name="settings-outline" size={24} color="white" />
        <Text style={styles.snackText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  snackbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
    backgroundColor: "#eb4f4f",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },

  snackItem: {
    alignItems: "center",
  },
  
  snackText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNav;
