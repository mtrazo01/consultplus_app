import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
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
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaskInput, { Masks } from 'react-native-mask-input';
import api from '../services/api';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const login = async () => {
    if (!cpf || !senha) {
      Alert.alert('⚠️ Campos obrigatórios', 'Preencha CPF e Senha.');
      return;
    }

    try {
      const response = await api.post('/usuarios/login', {
        cpf: cpf.replace(/\D/g, ''),
        senha,
      });

      const usuarioLogado = response.data.usuario;
      Alert.alert('✅ Login realizado com sucesso!');
      navigation.navigate('Home', { usuario: usuarioLogado });
    } catch (error) {
      Alert.alert('❌ Erro no login', 'CPF ou senha incorretos.');
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderBox}>
        <Text style={{ fontSize: 20, fontFamily: 'Montserrat_400Regular', color: '#fff' }}>
          Carregando...
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
      <StatusBar barStyle="light-content" backgroundColor="#0f2027" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={30}
      >
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* LOGO – fundo branco destacando a imagem */}
          <View style={styles.logoBox}>
            <Image
              source={require('../../assets/images/login-illustration.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Nome do app */}
          <Text style={styles.title}>
            <Text style={{ color: '#2680c2' }}>Consult</Text>
            <Text style={{ color: '#2060ae' }}>Plus</Text>
          </Text>
          <Text style={styles.subtitle}>Sua saúde na palma da mão</Text>

          {/* CPF */}
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={22} color="#41d6ff" style={styles.icon} />
            <MaskInput
              value={cpf}
              onChangeText={setCpf}
              mask={Masks.BRL_CPF}
              placeholder="Digite seu CPF"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#7baedd"
            />
          </View>

          {/* Senha */}
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={22} color="#41d6ff" style={styles.icon} />
            <TextInput
              placeholder="Digite sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              style={styles.input}
              placeholderTextColor="#7baedd"
            />
          </View>

          {/* Botão */}
          <TouchableOpacity style={styles.buttonWrapper} onPress={login} activeOpacity={0.9}>
            <LinearGradient colors={['#41d6ff', '#2060ae']} style={styles.button}>
              <Text style={styles.buttonText}>Entrar</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Link cadastro */}
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} activeOpacity={0.7}>
            <Text style={styles.link}>Criar conta</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#0f2027",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f2027',
  },
  card: {
    width: width * 0.92,
    maxWidth: 390,
    backgroundColor: '#fff', // branco puro, destaque para logo e inputs
    borderRadius: 26,
    paddingVertical: 38,
    paddingHorizontal: 24,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(90,200,255,0.13)',
  },
  logoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  image: {
    width: 92,
    height: 92,
    borderRadius: 18,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    color: '#2060ae',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230,241,255,0.85)', 
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(65,214,255,0.23)',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    padding: 13,
    fontSize: 16,
    color: '#293857',
  },
  buttonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 13,
    marginTop: 8,
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: "transparent",
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#fff',
    fontSize: 18,
    letterSpacing: 1,
  },
  link: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#2060ae',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 4,
  },
});

