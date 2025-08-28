import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts
} from '@expo-google-fonts/montserrat';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import api from '../services/api';

const { width } = Dimensions.get('window');

export default function PerfilScreen({ route }) {
  const navigation = useNavigation();
  const { usuario } = route.params || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [nome, setNome] = useState(usuario?.nome || '');
  const [cpf, setCpf] = useState(usuario?.cpf || '');
  const [senha, setSenha] = useState(usuario?.senha || '');

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true
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

  const atualizarConta = async () => {
    try {
      const response = await api.put(`/usuarios/${usuario.id}`, {
        nome,
        cpf,
        senha
      });
      Alert.alert('✅ Sucesso', 'Dados atualizados com sucesso!');
    } catch (err) {
      Alert.alert('❌ Erro', 'Não foi possível atualizar os dados.');
      console.log(err);
    }
  };

  const excluirConta = async () => {
    Alert.alert(
      'Atenção',
      'Deseja realmente excluir sua conta? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await api.delete(`/usuarios/${usuario.id}`);
              Alert.alert('✅ Conta excluída', 'Sua conta foi removida com sucesso.');
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (err) {
              Alert.alert('❌ Erro', 'Não foi possível excluir a conta.');
              console.log(err);
            }
          } 
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={styles.bg}
    >
      <StatusBar backgroundColor="#0f2027" barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            {/* Logo */}
            <View style={styles.logoBox}>
              <Image
                source={require("../../assets/images/login-illustration.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Meu Perfil</Text>

            {/* Campos editáveis */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Nome:</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite seu nome"
                placeholderTextColor="#9bbff7"
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.label}>CPF:</Text>
              <TextInput
                style={styles.input}
                value={cpf}
                onChangeText={setCpf}
                placeholder="Digite seu CPF"
                placeholderTextColor="#9bbff7"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.label}>Senha:</Text>
              <TextInput
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                placeholder="Digite sua senha"
                placeholderTextColor="#9bbff7"
                secureTextEntry
              />
            </View>

            {/* Botões */}
            <TouchableOpacity style={styles.updateButton} onPress={atualizarConta}>
              <LinearGradient colors={['#41d6ff', '#2060ae']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Atualizar Conta</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={excluirConta}>
              <LinearGradient colors={['#ff4444', '#aa0000']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Excluir Conta</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('Home', { usuario })}
            >
              <Ionicons name="arrow-back" size={20} color="#2060ae" style={{ marginRight: 6 }} />
              <Text style={styles.backBtnText}>Voltar</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scroll: {
    padding: 20,
    paddingBottom: 40,
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
  inputBox: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: "#2060ae",
    marginBottom: 6,
  },
  input: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#293857",
    borderWidth: 1,
    borderColor: "#d9e3fa",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#e7f1fd",
  },
  updateButton: {
    marginTop: 20,
    borderRadius: 14,
    overflow: "hidden",
  },
  deleteButton: {
    marginTop: 12,
    borderRadius: 14,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 14,
  },
  buttonText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    fontSize: 18,
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
