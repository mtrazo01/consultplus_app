import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from '@expo-google-fonts/montserrat';

const { width, height } = Dimensions.get("window");

export default function HistoricoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
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
    if (!usuarioId) return;

    const fetchConsultas = async () => {
      try {
        const response = await api.get(`/consultas/usuario/${usuarioId}`);
        setConsultas(response.data);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        Alert.alert("Erro", "Não foi possível carregar o histórico.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultas();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [usuarioId]);

  const renderItem = ({ item }) => (
    <Animated.View style={[styles.cardConsulta, { opacity: fadeAnim }]}>
      <Text style={styles.medico}>👨‍⚕️ {item.medico}</Text>
      <Text style={styles.especialidade}>💊 {item.especialidade}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.dateText}>
          📅 {new Date(item.data_hora).toLocaleDateString()}
        </Text>
        <Text style={styles.timeText}>
          ⏰{" "}
          {new Date(item.data_hora).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* Botão de excluir */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert(
            "Excluir Consulta",
            "Deseja realmente excluir esta consulta?",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                  try {
                    await api.delete(`/consultas/${item.id}`);
                    setConsultas((prev) =>
                      prev.filter((c) => c.id !== item.id)
                    );
                    Alert.alert("Sucesso", "Consulta excluída!");
                  } catch (err) {
                    Alert.alert(
                      "Erro",
                      "Não foi possível excluir a consulta."
                    );
                  }
                },
              },
            ]
          )
        }
      >
        <Text style={styles.deleteButtonText}>🗑️ Excluir</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.bg}>
        <Text style={{ fontFamily: 'Montserrat_400Regular', color: '#2060ae', fontSize: 18 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar backgroundColor="#0f2027" barStyle="light-content" />
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.title}>
          <Text style={{ color: "#2060ae" }}>Histórico</Text>{" "}
          <Text style={{ color: "#2680c2" }}>de Consultas</Text>
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2060ae" />
        ) : consultas.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma consulta encontrada.</Text>
        ) : (
          <FlatList
            data={consultas}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 8 }}
            style={styles.list}
          />
        )}

        {/* Botão Voltar */}
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home', { usuario })}
        >
          <Ionicons name="arrow-back" size={20} color="#2060ae" style={{ marginRight: 5 }} />
          <Text style={styles.backBtnText}>Voltar para Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f2027",
  },
  card: {
    width: width * 0.94,
    maxWidth: 410,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 19,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.17,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 8,
    alignItems: 'stretch',
    marginVertical: 30,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 26,
    textAlign: "center",
    marginBottom: 18,
  },
  list: {
    maxHeight: height * 0.5,
    marginBottom: 8,
  },
  cardConsulta: {
    backgroundColor: "#e7f1fd",
    borderRadius: 17,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#d9e3fa",
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 5,
    elevation: 2,
  },
  medico: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: "#2060ae",
    marginBottom: 2,
  },
  especialidade: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: "#2680c2",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 16,
    color: "#2060ae",
    fontFamily: 'Montserrat_600SemiBold',
  },
  timeText: {
    fontSize: 16,
    color: "#e67e22",
    fontFamily: 'Montserrat_700Bold',
  },
  emptyText: {
    textAlign: "center",
    color: "#2060ae",
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    marginTop: 18,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#e7f1fd",
    borderRadius: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 3,
  },
  backBtnText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: "#2060ae",
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
});
