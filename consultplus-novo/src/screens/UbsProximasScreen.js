import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";

export default function UbsProximasScreen({ navigation, route }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const ubsList = [
    {
      id: 1,
      nome: "UBS Genefredo Monteiro",
      endereco: "Rua General Carneiro, 211 - Centro",
      latitude: -23.5894,
      longitude: -48.0531,
    },
    {
      id: 2,
      nome: "UBS Dr. Cid de Melo Almada - Rio Branco",
      endereco: "Av. Waldomiro de Carvalho, 180 - Vila Rio Branco",
      latitude: -23.5985,
      longitude: -48.0488,
    },
    {
      id: 3,
      nome: "UBS Tsuyoshi Honma - Jardim Mesquita",
      endereco: "Rua Esaú Isaac, 350 - Jardim Mesquita",
      latitude: -23.5968,
      longitude: -48.0309,
    },
    {
      id: 4,
      nome: "UBS Joaquim Corrêa de Lara Filho - Nova Itapetininga",
      endereco: "Rua Heitor Calazans Moura, 281 - Nova Itapetininga",
      latitude: -23.5933,
      longitude: -48.0402,
    },
    {
      id: 5,
      nome: "UBS Wilson Antunes Brito - Belo Horizonte",
      endereco: "Rua Gov. Lucas Nogueira Garcês, 301 - Belo Horizonte",
      latitude: -23.6201,
      longitude: -48.0303,
    },
    {
      id: 6,
      nome: "USF Dr. Valdomiro de Oliveira - Chapadinha",
      endereco: "Rua Gumercindo Soares Hungria, s/n - Chapadinha",
      latitude: -23.6191,
      longitude: -48.0599,
    },
    {
      id: 7,
      nome: "USF Veranice Costa Tatino - Vila Santana",
      endereco: "Rua Urias de Campos, s/n - Vila Santana",
      latitude: -23.6042,
      longitude: -48.0445,
    },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão negada para acessar sua localização.");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const abrirRota = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <LinearGradient colors={["#F8FAFC", "#FFFFFF"]} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#0D47A1" />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* 🔵 Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.navigate("Home", { usuario: route.params?.usuario })
            }
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>UBS Próximas</Text>

          <View style={styles.headerIcon}>
            <MaterialIcons name="local-hospital" size={28} color="#BBDEFB" />
          </View>
        </View>

        {/* 🗺️ Mapa */}
        <View style={styles.mapContainer}>
          {location ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation
              showsMyLocationButton
              loadingEnabled
            >
              {ubsList.map((ubs) => (
                <Marker
                  key={ubs.id}
                  coordinate={{
                    latitude: ubs.latitude,
                    longitude: ubs.longitude,
                  }}
                  title={ubs.nome}
                  description={ubs.endereco}
                  pinColor="#1565C0"
                >
                  <Callout tooltip>
                    <View style={styles.calloutBox}>
                      <Text style={styles.calloutTitle}>{ubs.nome}</Text>
                      <Text style={styles.calloutAddress}>{ubs.endereco}</Text>

                      <TouchableOpacity
                        style={styles.routeButton}
                        onPress={() => abrirRota(ubs.latitude, ubs.longitude)}
                      >
                        <Ionicons name="navigate-circle" size={20} color="#fff" />
                        <Text style={styles.routeButtonText}>Rota</Text>
                      </TouchableOpacity>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          ) : (
            <View style={styles.loadingBox}>
              {errorMsg ? (
                <Text style={styles.loadingText}>{errorMsg}</Text>
              ) : (
                <>
                  <ActivityIndicator size="large" color="#1565C0" />
                  <Text style={styles.loadingText}>Obtendo sua localização...</Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* 🔹 Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Toque nos marcadores para mais detalhes 🏥
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#0D47A1",
    height: 90,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  backButton: {
    backgroundColor: "#1565C0",
    padding: 8,
    borderRadius: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  headerIcon: {
    backgroundColor: "#1565C0",
    padding: 6,
    borderRadius: 20,
  },
  mapContainer: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  map: {
    flex: 1,
  },
  calloutBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: 240,
    borderColor: "#1976D2",
    borderWidth: 1,
    elevation: 4,
  },
  calloutTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#0D47A1",
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 13,
    color: "#333",
    marginBottom: 8,
  },
  routeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1976D2",
    paddingVertical: 6,
    borderRadius: 6,
  },
  routeButtonText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 5,
    fontWeight: "600",
  },
  footer: {
    padding: 12,
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderTopWidth: 1,
    borderTopColor: "#BBDEFB",
  },
  footerText: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#333",
    fontSize: 15,
    marginTop: 10,
  },
});
