import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
} from '@expo-google-fonts/montserrat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  let [fontsLoaded] = useFonts({
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

  const login = async () => {
    if (!cpf || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha CPF e Senha.');
      return;
    }

    try {
      const response = await api.post('/usuarios/login', {
        cpf: cpf.replace(/\D/g, ''),
        senha,
      });

      const usuarioLogado = response.data.usuario;
      console.log('Usuário logado:', usuarioLogado);

      Alert.alert('Login realizado com sucesso!');
      navigation.navigate('Home', { usuario: usuarioLogado });
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro no login', 'CPF ou senha incorretos.');
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
    <LinearGradient colors={['#0e1d34', '#132e4f']} style={styles.bg}>
      <StatusBar barStyle="light-content" backgroundColor="#0e1d34" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={30}
      >
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.title}>
            <Text style={{ color: '#ffffff' }}>Consult</Text>
            <Text style={{ color: '#41d6ff' }}>Plus</Text>
          </Text>
          <Text style={styles.subtitle}>Saúde na Palma da Mão</Text>

          <View style={styles.inputBox}>
            <MaskInput
              value={cpf}
              onChangeText={setCpf}
              mask={Masks.BRL_CPF}
              placeholder="CPF"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#a3b1c6"
            />
          </View>

          <View style={styles.inputBox}>
            <TextInput
              placeholder="Senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              style={styles.input}
              placeholderTextColor="#a3b1c6"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={login} activeOpacity={0.9}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

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
    justifyContent: 'center',
    backgroundColor: '#0e1d34',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0e1d34',
  },
  card: {
    width: width * 0.92,
    maxWidth: 390,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    color: '#c2d7f4',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  input: {
    fontFamily: 'Montserrat_400Regular',
    padding: 14,
    fontSize: 16,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#2b8ed6',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#41d6ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#ffffff',
    fontSize: 18,
    letterSpacing: 1.2,
  },
  link: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 15,
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});
