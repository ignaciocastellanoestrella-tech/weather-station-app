import AsyncStorage from '@react-native-async-storage/async-storage';

const STATIONS_KEY = '@weather_stations';
const ACTIVE_STATION_KEY = '@active_station';

// Estación por defecto
const DEFAULT_STATION = {
  id: 'ICABRA64',
  name: 'Estación Principal',
  apiKey: '7fd62c8289ea40bf962c8289ea90bf17',
  isDefault: true,
};

export const getStations = async () => {
  try {
    const stationsJson = await AsyncStorage.getItem(STATIONS_KEY);
    if (stationsJson) {
      return JSON.parse(stationsJson);
    }
    // Si no hay estaciones, crear la default
    await AsyncStorage.setItem(STATIONS_KEY, JSON.stringify([DEFAULT_STATION]));
    return [DEFAULT_STATION];
  } catch (error) {
    console.error('Error loading stations:', error);
    return [DEFAULT_STATION];
  }
};

export const getActiveStation = async () => {
  try {
    const activeId = await AsyncStorage.getItem(ACTIVE_STATION_KEY);
    const stations = await getStations();
    
    if (activeId) {
      const station = stations.find(s => s.id === activeId);
      if (station) return station;
    }
    
    // Si no hay activa, devolver la primera
    return stations[0] || DEFAULT_STATION;
  } catch (error) {
    console.error('Error getting active station:', error);
    return DEFAULT_STATION;
  }
};

export const setActiveStation = async (stationId) => {
  try {
    await AsyncStorage.setItem(ACTIVE_STATION_KEY, stationId);
  } catch (error) {
    console.error('Error setting active station:', error);
  }
};

export const addStation = async (station) => {
  try {
    const stations = await getStations();
    const newStation = {
      ...station,
      isDefault: false,
      addedAt: new Date().toISOString(),
    };
    stations.push(newStation);
    await AsyncStorage.setItem(STATIONS_KEY, JSON.stringify(stations));
    return true;
  } catch (error) {
    console.error('Error adding station:', error);
    return false;
  }
};

export const updateStation = async (stationId, updates) => {
  try {
    const stations = await getStations();
    const index = stations.findIndex(s => s.id === stationId);
    if (index !== -1) {
      stations[index] = { ...stations[index], ...updates };
      await AsyncStorage.setItem(STATIONS_KEY, JSON.stringify(stations));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating station:', error);
    return false;
  }
};

export const deleteStation = async (stationId) => {
  try {
    const stations = await getStations();
    const filtered = stations.filter(s => s.id !== stationId);
    
    if (filtered.length === 0) {
      // No permitir borrar todas las estaciones
      return false;
    }
    
    await AsyncStorage.setItem(STATIONS_KEY, JSON.stringify(filtered));
    
    // Si era la activa, cambiar a la primera disponible
    const activeStation = await getActiveStation();
    if (activeStation.id === stationId) {
      await setActiveStation(filtered[0].id);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting station:', error);
    return false;
  }
};
