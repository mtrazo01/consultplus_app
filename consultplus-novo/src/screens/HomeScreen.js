import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen({ route, navigation }) {
  const { usuario } = route.params || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderBox}>
        <Text style={{
          fontFamily: "Montserrat_400Regular",
          color: "#fff",
          fontSize: 18,
        }}>
          Carregando fontes...
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bg}
    >
      <StatusBar backgroundColor="#0f2027" barStyle="light-content" />
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        {/* Header (logo + botão logout) */}
        <View style={styles.headerArea}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../assets/images/login-illustration.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>ConsultPlus</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.reset({index: 0, routes: [{ name: "Login" }]})}>
            <MaterialIcons name="logout" size={30} color="#2060ae" />
          </TouchableOpacity>
        </View>

        {/* Boas vindas */}
        <Text style={styles.saudacao}>Bem-vindo,</Text>
        <Text style={styles.nome}>{usuario?.nome?.trim() || "Teste"}</Text>

        {/* Primeira linha: Agendar Consulta + Histórico */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={styles.cardBtn}
            activeOpacity={0.88}
            onPress={() => navigation.navigate("AgendarConsulta", { usuario })}
          >
            <Ionicons name="calendar-outline" size={38} color="#41d6ff" />
            <Text style={styles.cardBtnText}>Agende sua Consulta</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cardBtn}
            activeOpacity={0.88}
            onPress={() => navigation.navigate("HistoricoConsultas", { usuario })}
          >
            <Ionicons name="time-outline" size={38} color="#41d6ff" />
            <Text style={styles.cardBtnText}>Histórico de Consultas</Text>
          </TouchableOpacity>
        </View>
        {/* Segunda linha: Perfil + Notificações */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={styles.cardBtn}
            activeOpacity={0.88}
            onPress={() => navigation.navigate("Perfil", { usuario })}
          >
            <Ionicons name="person-circle-outline" size={38} color="#41d6ff" />
            <Text style={styles.cardBtnText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cardBtn}
            activeOpacity={0.88}
            onPress={() => navigation.navigate("Notificacoes", { usuario })}
          >
            <Ionicons name="notifications-outline" size={38} color="#41d6ff" />
            <Text style={styles.cardBtnText}>Notificações</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const CARD_SIZE = (width * 0.90 - 32) / 2;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f2027",
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f2027",
  },
  card: {
    width: width * 0.94,
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 26,
    paddingVertical: 32,
    paddingHorizontal: 18,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(90,200,255,0.10)",
  },
  headerArea: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  logoImage: {
    width: 46,
    height: 46,
    marginRight: 10,
  },
  logoText: {
    fontFamily: "Montserrat_700Bold",
    color: "#2060ae",
    fontSize: 22,
    letterSpacing: 0.8,
  },
  saudacao: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 18,
    color: "#2060ae",
    marginBottom: 2,
    marginLeft: 2,
  },
  nome: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 23,
    color: "#293857",
    marginBottom: 18,
    marginLeft: 2,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardBtn: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#e7f1fd",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    borderWidth: 1.2,
    borderColor: "rgba(90,180,255,0.13)",
    elevation: 2,
  },
  cardBtnText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#293857",
    fontSize: 16,
    marginTop: 14,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
