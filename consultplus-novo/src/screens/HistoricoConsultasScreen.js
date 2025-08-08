import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import api from "../services/api"; // ajuste para seu arquivo de configuração axios/fetch
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

const { width, height } = Dimensions.get("window");

export default function HistoricoConsultas() {
  const navigation = useNavigation();
  const route = useRoute();

  const { usuario } = route.params || {};
  const usuarioId =
    usuario?.id || usuario?.userId || usuario?.usuario_id || undefined;

  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (!usuarioId) {
      Alert.alert("Erro", "ID do usuário não encontrado.");
      setLoading(false);
      return;
    }

    const carregarHistorico = async () => {
      try {
        const response = await api.get(`/consultas/usuario/${usuarioId}`);
        setConsultas(response.data);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
        Alert.alert(
          "Erro ao carregar histórico",
          err?.response?.data?.erro || err.message || "Erro desconhecido"
        );
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [usuarioId]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderBox}>
        <Text
          style={{ fontFamily: "Montserrat_400Regular", color: "#2060ae", fontSize: 18 }}
        >
          Carregando...
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemBox}>
      <Text style={styles.itemDataHora}>
        {new Date(item.data_hora).toLocaleString("pt-BR")}
      </Text>
      <Text style={styles.itemMedico}>Médico: {item.medico}</Text>
      <Text style={styles.itemEspecialidade}>Especialidade: {item.especialidade}</Text>
    </View>
  );

  const ListHeader = () => (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.title}>Histórico de Consultas</Text>
      {loading && <Text style={styles.loadingText}>Carregando histórico...</Text>}
      {!loading && consultas.length === 0 && (
        <Text style={styles.noDataText}>Nenhuma consulta encontrada.</Text>
      )}
    </View>
  );

  const ListFooter = () => (
    <TouchableOpacity
      style={styles.buttonBack}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonBackText}>Voltar</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.bg}>
      <StatusBar backgroundColor="#2060ae" barStyle="light-content" />
      <View style={styles.circleLeft} />
      <View style={styles.circleRight} />

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <KeyboardAwareFlatList
          data={consultas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!loading && consultas.length > 0}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#2060ae",
    justifyContent: "center",
    alignItems: "center",
  },
  circleLeft: {
    position: "absolute",
    top: -60,
    left: -60,
    width: 170,
    height: 170,
    backgroundColor: "#67aaff",
    borderRadius: 85,
    opacity: 0.15,
    zIndex: 0,
  },
  circleRight: {
    position: "absolute",
    bottom: -40,
    right: -55,
    width: 120,
    height: 120,
    backgroundColor: "#41d6ff",
    borderRadius: 60,
    opacity: 0.15,
    zIndex: 0,
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2060ae",
  },
  card: {
    width: width * 0.91,
    maxWidth: 390,
    maxHeight: height * 0.85,
    backgroundColor: "white",
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 25,
    elevation: 14,
    shadowColor: "#222b3a",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    zIndex: 1,
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 27,
    color: "#2060ae",
    textAlign: "center",
    letterSpacing: 1.7,
  },
  loadingText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#7ba8cc",
    marginTop: 10,
    textAlign: "center",
  },
  noDataText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#7ba8cc",
    marginVertical: 20,
    textAlign: "center",
  },
  itemBox: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5eefb",
    paddingVertical: 12,
  },
  itemDataHora: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: "#2060ae",
  },
  itemMedico: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 15,
    color: "#475a7f",
  },
  itemEspecialidade: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#a3b1c6",
  },
  buttonBack: {
    marginTop: 22,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  buttonBackText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: "#2060ae",
    textDecorationLine: "underline",
    letterSpacing: 0.3,
  },
});
