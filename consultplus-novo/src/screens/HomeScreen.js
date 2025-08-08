import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_400Regular,
  Montserrat_600SemiBold
} from '@expo-google-fonts/montserrat';

const { width } = Dimensions.get('window');

export default function HomeScreen({ route, navigation }) {
  const { usuario } = route.params || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true
    }).start();
  }, []);

  const sair = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    });
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderBox}>
        <Text style={{ fontFamily: 'Montserrat_400Regular', color: '#fff', fontSize: 18 }}>
          Carregando fontes...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      <StatusBar backgroundColor="#2060ae" barStyle="light-content" />
      <View style={styles.circleLeft} />
      <View style={styles.circleRight} />

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Bem-vindo(a)</Text>
        <Text style={styles.name}>
          {usuario?.nome?.trim() || 'Usuário'}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AgendarConsulta', { usuario })}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Agendar Consulta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HistoricoConsultas', { usuario })}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Histórico de Consultas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={sair}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#2060ae',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleLeft: {
    position: 'absolute',
    top: -64,
    left: -62,
    width: 170,
    height: 170,
    backgroundColor: '#67aaff',
    borderRadius: 85,
    opacity: 0.13
  },
  circleRight: {
    position: 'absolute',
    bottom: -48,
    right: -55,
    width: 128,
    height: 128,
    backgroundColor: '#41d6ff',
    borderRadius: 64,
    opacity: 0.12
  },
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2060ae'
  },
  card: {
    width: width * 0.91,
    maxWidth: 395,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 13,
    shadowColor: '#203065',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.14,
    shadowRadius: 15
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 23,
    color: '#2060ae',
    textAlign: 'center',
    marginBottom: 1,
    letterSpacing: 1.3
  },
  name: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 20,
    color: '#20324a',
    textAlign: 'center',
    marginBottom: 28
  },
  button: {
    backgroundColor: '#2b8ed6',
    borderRadius: 9,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 11,
    marginBottom: 3,
    shadowColor: '#41d6ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 7,
    elevation: 1
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#fff',
    fontSize: 17,
    letterSpacing: 1
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f3f2f7ff',
    marginTop: 16
  },
  logoutText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#d62b2bff',
    fontSize: 18,
    letterSpacing: 0.4
  }
});
