// consultplus-novo/src/screens/CadastroScreen.js
import { useFonts } from "@expo-google-fonts/montserrat";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputPadronizado from "../components/InputPadronizado";
import { Colors, Radius, Spacing, Typography } from "../design/theme";
import api from "../services/api";

const { width, height } = Dimensions.get("window");

export default function CadastroScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular: Typography.regular,
    Montserrat_600SemiBold: Typography.semiBold,
    Montserrat_700Bold: Typography.bold,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }).start();
  }, []);

  const cadastrar = async () => {
    if (!nome || !cpf || !senha || !telefone || !dataNascimento) {
      return alert("⚠️ Preencha todos os campos");
    }

    try {
      await api.post("/usuarios", {
        nome,
        cpf: cpf.replace(/\D/g, ""),
        senha,
        telefone: telefone.replace(/\D/g, ""),
        data_nascimento: dataNascimento.split("/").reverse().join("-"),
      });
      alert("✅ Usuário cadastrado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      alert("❌ Falha ao cadastrar usuário. Verifique os dados.");
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.bg, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontFamily: Typography.regular, color: Colors.primary, fontSize: 20 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll}
        enableOnAndroid
        enableAutomaticScroll
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          {/* Logo */}
          <View style={styles.logoBox}>
            <Image
              source={require("../../assets/images/login-illustration.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subtitle}>Preencha seus dados para criar a conta</Text>

          {/* Nome */}
          <View style={styles.inputBox}>
            <InputPadronizado
              value={nome}
              onChangeText={setNome}
              placeholder="Nome completo"
              autoCapitalize="words"
            />
          </View>

          {/* CPF */}
          <View style={styles.inputBox}>
            <InputPadronizado value={cpf} onChangeText={setCpf} placeholder="CPF" mask="cpf" />
          </View>

          {/* Celular */}
          <View style={styles.inputBox}>
            <InputPadronizado
              value={telefone}
              onChangeText={setTelefone}
              placeholder="Celular"
              mask="telefone"
              keyboardType="phone-pad"
            />
          </View>

          {/* Data de Nascimento */}
          <View style={styles.inputBox}>
            <InputPadronizado value={dataNascimento} onChangeText={setDataNascimento} placeholder="Data de Nascimento" mask="data" keyboardType="numeric" />
          </View>

          {/* Senha */}
          <View style={styles.inputBox}>
            <InputPadronizado value={senha} onChangeText={setSenha} placeholder="Senha" secureTextEntry />
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity style={styles.button} onPress={cadastrar} activeOpacity={0.9}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          {/* Voltar */}
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => navigation.navigate("Login")}>
            <Ionicons name="arrow-back" size={20} color={Colors.primary} style={{ marginRight: 5 }} />
            <Text style={styles.backBtnText}>Voltar ao Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.background, justifyContent: "center" },
  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", minHeight: height },
  card: {
    width: width * 0.92,
    maxWidth: 390,
    backgroundColor: Colors.cardBackground,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: "stretch",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginVertical: Spacing.lg,
  },
  logoBox: { alignItems: "center", justifyContent: "center", marginBottom: Spacing.sm },
  logoImage: { width: 110, height: 110, borderRadius: Radius.sm, backgroundColor: Colors.cardBackground },
  title: { fontFamily: Typography.bold, fontSize: 27, color: Colors.primary, textAlign: "center", marginBottom: 7, letterSpacing: 1.5 },
  subtitle: { fontFamily: Typography.regular, color: Colors.textPrimary, fontSize: 15, textAlign: "center", marginBottom: 20 },
  inputBox: { backgroundColor: Colors.cardBackground, borderRadius: Radius.sm, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 10 },
  button: { backgroundColor: Colors.primary, borderRadius: Radius.sm, paddingVertical: 15, marginTop: 10, marginBottom: 10, alignItems: "center", shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.13, shadowRadius: 7, elevation: 2 },
  buttonText: { fontFamily: Typography.semiBold, color: "#fff", fontSize: 17.5, letterSpacing: 1 },
  backBtn: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.cardBackground, borderRadius: Radius.sm, alignSelf: "center", paddingVertical: 10, paddingHorizontal: 18, marginTop: 4, marginBottom: 3, borderWidth: 1, borderColor: Colors.border },
  backBtnText: { fontFamily: Typography.semiBold, color: Colors.primary, fontSize: 16 },
});
