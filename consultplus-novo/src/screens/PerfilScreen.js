import { Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

export default function PerfilScreen({ route }) {
  const navigation = useNavigation();
  const { usuario } = route.params || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 900, useNativeDriver: true
    }).start();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderBox}>
        <Text style={{ fontFamily: 'Montserrat_400Regular', color: '#2060ae', fontSize: 18 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={styles.bg}
    >
      <StatusBar backgroundColor="#0f2027" barStyle="light-content" />
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        {/* Logo */}
        <View style={styles.logoBox}>
          <Image
            source={require("../../assets/images/login-illustration.png")} // ou a logo que você preferir
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Meu Perfil</Text>

        <View style={styles.infoBox}>
          <Ionicons name="person" size={24} color="#2060ae" style={styles.icon} />
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{usuario?.nome || "Nome não informado"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="card-outline" size={22} color="#2060ae" style={styles.icon} />
          <Text style={styles.label}>CPF:</Text>
          <Text style={styles.value}>
            {usuario?.cpf ? usuario.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4') : "CPF não informado"}
          </Text>
        </View>

        {/* Você pode adicionar mais infos aqui */}

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })}
        >
          <Ionicons name="log-out-outline" size={26} color="#ff4444" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Home', { usuario })}
        >
          <Ionicons name="arrow-back" size={20} color="#2060ae" style={{ marginRight: 6 }} />
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#0f2027",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f2027",
  },
  card: {
    width: width * 0.92,
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 26,
    paddingVertical: 38,
    paddingHorizontal: 28,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 14,
  },
  logoBox: {
    alignItems: "center",
    marginBottom: 18,
  },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 28,
    color: "#2060ae",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 0.8,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "#e7f1fd",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d9e3fa",
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: "#2060ae",
    marginRight: 8,
  },
  value: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#293857",
    flexShrink: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,68,68,0.12)",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 30,
  },
  logoutText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#ff4444",
    fontSize: 18,
    marginLeft: 10,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#e7f1fd",
  },
  backBtnText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#2060ae",
    fontSize: 16,
  },
});
