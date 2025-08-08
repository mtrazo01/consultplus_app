import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

export default function AgendarConsultaScreen({ route, navigation }) {
  const { usuario } = route.params;
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');
  const [medicoSelecionado, setMedicoSelecionado] = useState('');
  const [data, setData] = useState(new Date());
  const [mostrarDataPicker, setMostrarDataPicker] = useState(false);
  const [mostrarHoraPicker, setMostrarHoraPicker] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

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
      Alert.alert('Erro', 'Selecione especialidade e médico');
      return;
    }

    try {
      await api.post('/consultas', {
        usuario_id: usuario.id,
        medico_id: medicoSelecionado,
        data_hora: data.toISOString(),
      });

      Alert.alert('Consulta agendada com sucesso!');
      navigation.navigate('Home', { usuario });
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      Alert.alert('Erro', 'Falha ao agendar consulta');
    }
  };

  const formatarData = (data) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
  };

  const formatarHora = (data) => {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={[styles.loadingText, { fontFamily: 'Montserrat_400Regular' }]}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2060ae" barStyle="light-content" />

      <Text style={[styles.title, { fontFamily: 'Montserrat_700Bold' }]}>Agendar Consulta</Text>

      <Text style={[styles.label, { fontFamily: 'Montserrat_600SemiBold' }]}>Especialidade</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={especialidadeSelecionada}
          onValueChange={(itemValue) => setEspecialidadeSelecionada(itemValue)}
          style={{ fontFamily: 'Montserrat_400Regular', color: '#234266' }}
        >
          <Picker.Item label="Selecione..." value="" />
          {especialidades.map((esp) => (
            <Picker.Item key={esp.id} label={esp.nome} value={esp.id} />
          ))}
        </Picker>
      </View>

      <Text style={[styles.label, { fontFamily: 'Montserrat_600SemiBold' }]}>Médico</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={medicoSelecionado}
          onValueChange={(itemValue) => setMedicoSelecionado(itemValue)}
          enabled={medicos.length > 0}
          style={{ fontFamily: 'Montserrat_400Regular', color: '#234266' }}
        >
          <Picker.Item label="Selecione..." value="" />
          {medicos.map((med) => (
            <Picker.Item key={med.id} label={med.nome} value={med.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity onPress={() => setMostrarDataPicker(true)} style={styles.selectButton}>
        <Text style={[styles.selectText, { fontFamily: 'Montserrat_600SemiBold' }]}>
          Selecionar Data: {formatarData(data)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMostrarHoraPicker(true)} style={styles.selectButton}>
        <Text style={[styles.selectText, { fontFamily: 'Montserrat_600SemiBold' }]}>
          Selecionar Hora: {formatarHora(data)}
        </Text>
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
        <Text style={[styles.buttonText, { fontFamily: 'Montserrat_700Bold' }]}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2060ae',
    padding: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#a3b1c6',
  },
  title: {
    fontSize: 26,
    color: '#f2f7fb',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    color: '#f2f7fb',
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: '#f1f6f3ff',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2b8ed6',
  },
  selectButton: {
    backgroundColor: '#2b8ed6',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  selectText: {
    color: '#f2f7fb',
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#f7f4f4ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#cd1616ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#da2626ff',
    fontSize: 18
  }
});
