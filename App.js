import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CurrentWeather from './components/CurrentWeather';
import Charts from './components/Charts';
import HistoricalData from './components/HistoricalData';
import Settings from './components/Settings';
import { getCurrentWeather } from './services/WundergroundAPI';
import { getActiveStation } from './services/StationManager';
import { 
  saveCurrentWeather, 
  getCurrentWeatherFromStorage, 
  saveHistoricalData, 
  getHistoricalData 
} from './services/StorageService';

const Tab = createBottomTabNavigator();

export default function App() {
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [activeStation, setActiveStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (activeStation) {
      loadData();
      // Actualizar cada 1 minuto
      const interval = setInterval(loadData, 1 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [activeStation]);

  const initializeApp = async () => {
    const station = await getActiveStation();
    setActiveStation(station);
    setLoading(false);
  };

  const loadData = async () => {
    if (!activeStation) return;
    
    try {
      // Cargar datos actuales de la API
      const current = await getCurrentWeather(activeStation.id, activeStation.apiKey);
      setCurrentData(current);
      setLastUpdate(new Date());
      
      // Guardar en almacenamiento local
      await saveCurrentWeather(current, activeStation.id);
      await saveHistoricalData(current, activeStation.id);
      
      // Cargar histórico
      const history = await getHistoricalData(activeStation.id);
      setHistoricalData(history);
    } catch (error) {
      console.error('Error cargando datos:', error);
      // Si falla, intentar cargar desde almacenamiento local
      const stored = await getCurrentWeatherFromStorage(activeStation.id);
      if (stored) {
        setCurrentData(stored);
      }
      const history = await getHistoricalData(activeStation.id);
      setHistoricalData(history);
    }
  };

  const handleStationChange = async (station) => {
    setLoading(true);
    setActiveStation(station);
    setCurrentData(null);
    setHistoricalData(null);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299e1" />
        <Text style={styles.loadingText}>Cargando estación...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Actual') {
              iconName = focused ? 'thermometer' : 'thermometer-outline';
            } else if (route.name === 'Gráficas') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            } else if (route.name === 'Histórico') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Ajustes') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4299e1',
          tabBarInactiveTintColor: '#a0aec0',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Actual">
          {() => (
            <CurrentWeather 
              data={currentData} 
              station={activeStation}
              lastUpdate={lastUpdate}
              onRefresh={loadData}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Gráficas">
          {() => (
            <Charts 
              historicalData={historicalData?.daily || []} 
              station={activeStation}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Histórico">
          {() => (
            <HistoricalData 
              data={historicalData} 
              station={activeStation}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Ajustes">
          {() => <Settings onStationChange={handleStationChange} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4a5568',
  },
});
