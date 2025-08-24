import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../services/api';

import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from '@expo-google-fonts/montserrat';

const { width } = Dimensions.get('window');

export default function AgendarConsultaScreen({ route, navigation }) {
  const { usuario } = route.params;
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');
  const [medicoSelecionado, setMedicoSelecionado] = useState('');
  const [data, setData] = useState(new Date());
  const [mostrarDataPicker, setMostrarDataPicker] = useState(false);
  const [mostrarHoraPicker, setMostrarHoraPicker] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const carregarEspecialidades = async () => {
      try {
        const espRes = await api.get('/especialidades');
        setEspecialidades(espRes.data);
      } catch (error) {
        console.error('Erro ao carregar especialidades:', error);
      }
    };
    carregarEspecialidades();
  }, []);

  useEffect(() => {
    const carregarMedicos = async () => {
      if (!especialidadeSelecionada) return;
      try {
        const medRes = await api.get(`/medicos/especialidade/${especialidadeSelecionada}`);
        setMedicos(medRes.data);
      } catch (error) {
        console.error('Erro ao carregar médicos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os médicos.');
      }
    };
    carregarMedicos();
  }, [especialidadeSelecionada]);

  const agendar = async () => {
    if (!especialidadeSelecionada || !medicoSelecionado) {
      Alert.alert('⚠️ Atenção', 'Selecione especialidade e médico');
      return;
    }

    try {
      await api.post('/consultas', {
        usuario_id: usuario.id,
        medico_id: medicoSelecionado,
        data_hora: data.toISOString(),
      });

      Alert.alert('✅ Sucesso', 'Consulta agendada com sucesso!');
      navigation.navigate('Home', { usuario });
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      Alert.alert('❌ Erro', 'Falha ao agendar consulta');
    }
  };

  const formatarData = (data) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const formatarHora = (data) => {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.bg, styles.loadingContainer]}>
        <Text style={[styles.loadingText, { fontFamily: 'Montserrat_400Regular' }]}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.bg}>
      <StatusBar backgroundColor="#0f2027" barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.title}>
            <Text style={{ color: '#2060ae' }}>Agendar</Text>{' '}
            <Text style={{ color: '#2680c2' }}>Consulta</Text>
          </Text>

          <Text style={styles.label}>Especialidade</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={especialidadeSelecionada}
              onValueChange={(itemValue) => setEspecialidadeSelecionada(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione..." value="" />
              {especialidades.map((esp) => (
                <Picker.Item key={esp.id} label={esp.nome} value={esp.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Médico</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={medicoSelecionado}
              onValueChange={(itemValue) => setMedicoSelecionado(itemValue)}
              enabled={medicos.length > 0}
              style={styles.picker}
            >
              <Picker.Item label="Selecione..." value="" />
              {medicos.map((med) => (
                <Picker.Item key={med.id} label={med.nome} value={med.id} />
              ))}
            </Picker>
          </View>

          {/* Data em destaque */}
          <TouchableOpacity onPress={() => setMostrarDataPicker(true)} style={styles.highlightCard}>
            <Text style={styles.highlightText}>Data</Text>
            <Text style={styles.highlightValue}>{formatarData(data)}</Text>
          </TouchableOpacity>

          {/* Hora em destaque */}
          <TouchableOpacity onPress={() => setMostrarHoraPicker(true)} style={styles.highlightCard}>
            <Text style={styles.highlightText}>Hora</Text>
            <Text style={styles.highlightValue}>{formatarHora(data)}</Text>
          </TouchableOpacity>

          {mostrarDataPicker && (
            <DateTimePicker
              value={data}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setMostrarDataPicker(false);
                if (selectedDate) {
                  const novaData = new Date(data);
                  novaData.setFullYear(selectedDate.getFullYear());
                  novaData.setMonth(selectedDate.getMonth());
                  novaData.setDate(selectedDate.getDate());
                  setData(novaData);
                }
              }}
            />
          )}

          {mostrarHoraPicker && (
            <DateTimePicker
              value={data}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedTime) => {
                setMostrarHoraPicker(false);
                if (selectedTime) {
                  const novaData = new Date(data);
                  novaData.setHours(selectedTime.getHours());
                  novaData.setMinutes(selectedTime.getMinutes());
                  setData(novaData);
                }
              }}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={agendar}>
            <Text style={styles.buttonText}>Confirmar Agendamento</Text>
          </TouchableOpacity>

          {/* Botão Voltar para Home */}
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.78}
            onPress={() => navigation.navigate('Home', { usuario })}
          >
            <Ionicons name="arrow-back" size={20} color="#2060ae" style={{ marginRight: 5 }} />
            <Text style={styles.backBtnText}>Voltar</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#0f2027",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#2060ae',
  },
  card: {
    width: width * 0.94,
    maxWidth: 410,
    backgroundColor: "#fff",
    borderRadius: 26,
    paddingVertical: 36,
    paddingHorizontal: 22,
    alignItems: 'stretch',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(90,200,255,0.10)",
    marginVertical: 36,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 18,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    color: "#2060ae",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 10,
    marginLeft: 4,
  },
  pickerContainer: {
    backgroundColor: "#e7f1fd",
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2060ae",
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  picker: {
    color: "#293857",
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
  },
  highlightCard: {
    backgroundColor: "#e7f1fd",
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#2060ae",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: "#2060ae",
    marginBottom: 4,
  },
  highlightValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: "#293857",
  },
  button: {
    backgroundColor: "#2060ae",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 18,
    alignItems: 'center',
    shadowColor: "#2060ae",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    color: "#fff",
    fontSize: 18,
    letterSpacing: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#e7f1fd",
    borderRadius: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 3,
  },
  backBtnText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: "#2060ae",
    fontSize: 16,
  },
});
