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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bg}
    >
      <StatusBar backgroundColor="#0f2027" barStyle="light-content" />

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Bem Vindo</Text>
        <Text style={styles.name}>
          {usuario?.nome?.trim() || 'Usuário'}
        </Text>

        {/* Botão Agendar Consulta */}
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate('AgendarConsulta', { usuario })}
          activeOpacity={0.9}
        >
          <LinearGradient colors={['#2b8ed6', '#2060ae']} style={styles.button}>
            <Ionicons name="calendar-outline" size={22} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Agendar Consulta</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Botão Histórico */}
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate('HistoricoConsultas', { usuario })}
          activeOpacity={0.9}
        >
          <LinearGradient colors={['#41d6ff', '#2b8ed6']} style={styles.button}>
            <Ionicons name="time-outline" size={22} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Histórico de Consultas</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Botão Sair */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={sair}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" style={styles.icon} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f2027',
  },
  card: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 26,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 1.6,
  },
  name: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 20,
    color: '#dce3f0',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonWrapper: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#fff',
    fontSize: 17,
    marginLeft: 8,
    letterSpacing: 0.8,
  },
  icon: {
    marginRight: 6,
  },
  logoutButton: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
  },
  logoutText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#fff',
    fontSize: 17,
    marginLeft: 8,
    letterSpacing: 0.6,
  },
});
