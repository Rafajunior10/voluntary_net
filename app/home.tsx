import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Dialog from "../components/dialog/dialog";
import { useRouter } from "expo-router";
import { supabase } from "../app/lib/supabase";
import BottomNav from "../components/navBar/bottomNav";

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchText, setSearchText] = useState("");

  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("Usuário não está logado.");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("nome")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar o nome do usuário:", error);
    } else {
      setUserName(data.nome);
    }
  };

  const cardsData = [
    {
      id: 1,
      title: "Hemocentro Unicamp",
      description: "Doação de Sangue",
      address: "Rua das Doações, 123 - Campinas",
      schedule: "8:00 às 17:00",
    },
    {
      id: 2,
      title: "Cooperativa Vira Lata",
      description: "Coleta de lixo e reciclagem",
      address: "Av. Sustentável, 456 - Campinas",
      schedule: "8:00 às 17:00",
    },
    {
      id: 3,
      title: "Banco de alimentos",
      description: "Arrecadação de alimentos",
      address: "Rua da Solidariedade, 789 - Campinas",
      schedule: "8:00 às 17:00",
    },
    {
      id: 4,
      title: "Coração Selvagem",
      description: "Grupo de apoio a animais",
      address: "Av. dos Animais, 321 - Campinas",
      schedule: "8:00 às 17:00",
    },
  ];

  const filteredCards = cardsData.filter((card) =>
    card.title.toLowerCase().includes(searchText.toLowerCase()) ||
    card.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navTextBold}>Olá {userName || "Usuário"}!</Text>
        <TouchableOpacity
          onPress={async () => {
            await supabase.auth.signOut();
            router.replace("/");
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Pesquisar..."
          placeholderTextColor="#666"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredCards.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhum resultado encontrado.
          </Text>
        ) : (
          filteredCards
            .reduce<Array<typeof cardsData>>((
              rows: Array<typeof cardsData>,
              card,
              index
            ) => {
              if (index % 2 === 0) {
                rows.push(filteredCards.slice(index, index + 2));
              }
              return rows;
            }, [] as Array<typeof cardsData>)
            .map((row, rowIndex) => (
              <View style={styles.row} key={rowIndex}>
                {row.map((card) => (
                  <View style={[styles.card, styles.cardHalf]} key={card.id}>
                    <Text style={styles.cardHeader}>{card.title}</Text>
                    <Text style={styles.cardText}>{card.description}</Text>
                    <Text style={styles.cardSubText}>{card.schedule}</Text>
                    <TouchableOpacity
                      style={styles.cardButton}
                      onPress={() => {
                        setSelectedTitle(card.title);
                        setSelectedAddress(card.address);
                        setModalVisible(true);
                      }}
                    >
                      <Text style={styles.cardButtonText}>Saiba mais</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))
        )}
      </ScrollView>
      <BottomNav />

      <Dialog
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={selectedTitle}
        address={selectedAddress}
      />
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
    padding: 10,
    paddingHorizontal: 20,
  },

  navTextBold: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },

  searchIcon: {
    position: "absolute",
    left: 30,
    zIndex: 1,
  },

  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingLeft: 40,
    backgroundColor: "transparent",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  cardHalf: {
    width: "48%",
  },
  
  card: {
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  cardHeader: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
  },

  cardText: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "left",
  },

  cardSubText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: "left",
  },

  cardButton: {
    marginTop: 5,
    backgroundColor: "#eb4f4f",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  cardButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default HomeScreen;
