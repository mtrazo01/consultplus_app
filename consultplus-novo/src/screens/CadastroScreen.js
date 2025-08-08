import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert,
  Dimensions, StatusBar
} from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { useNavigation } from '@react-navigation/native';
import { useFonts,
  Montserrat_700Bold, Montserrat_400Regular, Montserrat_600SemiBold
} from '@expo-google-fonts/montserrat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
      <View style={styles.loaderBox}>
        <Text style={{ fontSize: 20, fontFamily: 'Montserrat_400Regular', color: '#2f507b' }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      <StatusBar barStyle="light-content" backgroundColor="#2060ae" />
      <View style={styles.circleLeft} />
      <View style={styles.circleRight} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll}
        enableOnAndroid
        enableAutomaticScroll
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subtitle}>Preencha seus dados para criar a conta</Text>

          <View style={styles.inputBox}>
            <TextInput
              placeholder="Nome completo"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
              placeholderTextColor="#a3b1c6"
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
              placeholderTextColor="#a3b1c6"
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              style={styles.input}
              placeholderTextColor="#a3b1c6"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={cadastrar} activeOpacity={0.9}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.link}>Voltar ao login</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#2060ae',
    justifyContent: 'center'
  },
  circleLeft: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 170,
    height: 170,
    backgroundColor: '#67aaff',
    borderRadius: 85,
    opacity: 0.15,
    zIndex: 0
  },
  circleRight: {
    position: 'absolute',
    bottom: -40,
    right: -55,
    width: 120,
    height: 120,
    backgroundColor: '#41d6ff',
    borderRadius: 60,
    opacity: 0.15,
    zIndex: 0
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height
  },
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2060ae'
  },
  card: {
    width: width * 0.91,
    maxWidth: 390,
    backgroundColor: 'white',
    borderRadius: 22,
    paddingVertical: 36,
    paddingHorizontal: 25,
    alignItems: 'stretch',
    elevation: 14,
    shadowColor: '#222b3a',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    zIndex: 1
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
    backgroundColor: '#f2f7fb',
    borderRadius: 11,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#e5eefb'
  },
  input: {
    fontFamily: 'Montserrat_400Regular',
    padding: 13,
    fontSize: 16,
    color: '#263f5e'
  },
  button: {
    backgroundColor: '#2b8ed6',
    borderRadius: 9,
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
  link: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#2060ae',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 3,
    textDecorationLine: 'underline',
    letterSpacing: 0.25
  }
});

export default CadastroScreen;
