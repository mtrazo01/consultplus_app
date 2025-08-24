import {
  Montserrat_400Regular, Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts
} from '@expo-google-fonts/montserrat';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaskInput, { Masks } from 'react-native-mask-input';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

const CadastroScreen = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold, Montserrat_400Regular, Montserrat_600SemiBold
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 900, useNativeDriver: true
    }).start();
  }, []);

  const cadastrar = async () => {
    if (!nome || !cpf || !senha) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    try {
      await api.post('/usuarios', { nome, cpf: cpf.replace(/\D/g, ''), senha });
      Alert.alert('Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao cadastrar usuário');
      console.error(error);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.bg}>
        <Text style={{ fontSize: 20, fontFamily: 'Montserrat_400Regular', color: '#2060ae' }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      <StatusBar barStyle="light-content" backgroundColor="#0f2027" />
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
              source={require('../../assets/images/login-illustration.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subtitle}>Preencha seus dados para criar a conta</Text>

          <View style={styles.inputBox}>
            <TextInput
              placeholder="Nome completo"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
              placeholderTextColor="#7ba8cc"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.inputBox}>
            <MaskInput
              value={cpf}
              onChangeText={setCpf}
              mask={Masks.BRL_CPF}
              placeholder="CPF"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#7ba8cc"
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              style={styles.input}
              placeholderTextColor="#7ba8cc"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={cadastrar} activeOpacity={0.9}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="arrow-back" size={20} color="#2060ae" style={{ marginRight: 5 }} />
            <Text style={styles.backBtnText}>Voltar ao Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#0f2027",
    justifyContent: 'center'
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height,
  },
  card: {
    width: width * 0.92,
    maxWidth: 390,
    backgroundColor: "#fff",
    borderRadius: 26,
    paddingVertical: 36,
    paddingHorizontal: 25,
    alignItems: 'stretch',
    elevation: 14,
    shadowColor: '#222b3a',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    zIndex: 2,
    marginVertical: 36,
  },
  logoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: 22,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 27,
    color: '#2060ae',
    textAlign: 'center',
    marginBottom: 7,
    letterSpacing: 1.7
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    color: '#7ba8cc',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20
  },
  inputBox: {
    backgroundColor: "#e7f1fd",
    borderRadius: 13,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#e5eefb"
  },
  input: {
    fontFamily: 'Montserrat_400Regular',
    padding: 13,
    fontSize: 16,
    color: '#293857'
  },
  button: {
    backgroundColor: '#2060ae',
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#41d6ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 7,
    elevation: 2
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#fff',
    fontSize: 17.5,
    letterSpacing: 1
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#e7f1fd",
    borderRadius: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 4,
    marginBottom: 3,
  },
  backBtnText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: "#2060ae",
    fontSize: 16,
  },
});

export default CadastroScreen;
