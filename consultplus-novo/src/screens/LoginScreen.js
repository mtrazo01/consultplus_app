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

const { width } = Dimensions.get('window');

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
      Alert.alert('Login realizado com sucesso!');
      navigation.navigate('Home', { usuario: usuarioLogado });
    } catch (error) {
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
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
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
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.title}>
            <Text style={{ color: '#fff' }}>Consult</Text>
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
              placeholderTextColor="#b0c4de"
            />
          </View>

          <View style={styles.inputBox}>
            <TextInput
              placeholder="Senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              style={styles.input}
              placeholderTextColor="#b0c4de"
            />
          </View>

          <TouchableOpacity style={styles.buttonWrapper} onPress={login} activeOpacity={0.9}>
            <LinearGradient
              colors={['#2b8ed6', '#2060ae']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </LinearGradient>
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
    backgroundColor: '#0f2027',
  },
  card: {
    width: width * 0.92,
    maxWidth: 390,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 26,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 34,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    color: '#c2d7f4',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  input: {
    fontFamily: 'Montserrat_400Regular',
    padding: 14,
    fontSize: 16,
    color: '#fff',
  },
  buttonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 18,
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#fff',
    fontSize: 18,
    letterSpacing: 1.2,
  },
  link: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#41d6ff',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 4,
  },
});
