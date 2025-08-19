import { AppRegistry } from 'react-native';
import App from './App'; // Ajuste o caminho caso o App.js esteja em outra pasta
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
