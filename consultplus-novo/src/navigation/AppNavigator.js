import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AgendarConsultaScreen from '../screens/AgendarConsultaScreen';
import CadastroScreen from '../screens/CadastroScreen';
import HistoricoConsultasScreen from '../screens/HistoricoConsultasScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import PerfilScreen from '../screens/PerfilScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AgendarConsulta" component={AgendarConsultaScreen} />
        <Stack.Screen name="HistoricoConsultas" component={HistoricoConsultasScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
