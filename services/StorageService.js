import * as FileSystem from 'expo-file-system';

const DATA_DIR = `${FileSystem.documentDirectory}weather_data/`;

const getStationDir = (stationId) => `${DATA_DIR}${stationId}/`;
const getCurrentFile = (stationId) => `${getStationDir(stationId)}current.json`;
const getHistoryFile = (stationId) => `${getStationDir(stationId)}history.json`;

export const initStorage = async (stationId) => {
  const dirInfo = await FileSystem.getInfoAsync(DATA_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DATA_DIR, { intermediates: true });
  }
  
  const stationDir = getStationDir(stationId);
  const stationDirInfo = await FileSystem.getInfoAsync(stationDir);
  if (!stationDirInfo.exists) {
    await FileSystem.makeDirectoryAsync(stationDir, { intermediates: true });
  }
};

export const saveCurrentWeather = async (data, stationId) => {
  try {
    await initStorage(stationId);
    await FileSystem.writeAsStringAsync(getCurrentFile(stationId), JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando datos actuales:', error);
  }
};

export const getCurrentWeatherFromStorage = async (stationId) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(getCurrentFile(stationId));
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(getCurrentFile(stationId));
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error('Error leyendo datos actuales:', error);
    return null;
  }
};

export const saveHistoricalData = async (data, stationId) => {
  try {
    await initStorage(stationId);
    let history = await getHistoricalData(stationId);
    
    if (!history) {
      history = { 
        daily: [], 
        weekly: [], 
        monthly: [], 
        yearly: [],
        allYears: [] // Nuevo: todos los años
      };
    }

    const now = new Date();
    const year = now.getFullYear();
    const entry = {
      timestamp: now.toISOString(),
      year: year,
      month: now.getMonth() + 1,
      day: now.getDate(),
      data: data,
    };

    // Agregar a cada periodo
    history.daily.push(entry);
    history.weekly.push(entry);
    history.monthly.push(entry);
    history.yearly.push(entry);
    history.allYears.push(entry);

    // Limpiar datos antiguos pero mantener registros por año
    const oneDayAgo = now.getTime() - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = now.getTime() - (30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = now.getTime() - (365 * 24 * 60 * 60 * 1000);
    
    history.daily = history.daily.filter(e => new Date(e.timestamp).getTime() > oneDayAgo);
    history.weekly = history.weekly.filter(e => new Date(e.timestamp).getTime() > oneWeekAgo);
    history.monthly = history.monthly.filter(e => new Date(e.timestamp).getTime() > oneMonthAgo);
    history.yearly = history.yearly.filter(e => new Date(e.timestamp).getTime() > oneYearAgo);
    // allYears se mantiene indefinidamente (o hasta un límite muy alto)
    // Mantener últimos 5 años completos
    const fiveYearsAgo = now.getTime() - (5 * 365 * 24 * 60 * 60 * 1000);
    history.allYears = history.allYears.filter(e => new Date(e.timestamp).getTime() > fiveYearsAgo);

    await FileSystem.writeAsStringAsync(getHistoryFile(stationId), JSON.stringify(history));
  } catch (error) {
    console.error('Error guardando histórico:', error);
  }
};

export const getHistoricalData = async (stationId) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(getHistoryFile(stationId));
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(getHistoryFile(stationId));
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error('Error leyendo histórico:', error);
    return null;
  }
};

// Obtener estadísticas por año
export const getYearlyStats = async (stationId) => {
  try {
    const history = await getHistoricalData(stationId);
    if (!history || !history.allYears) return {};
    
    const statsByYear = {};
    history.allYears.forEach(entry => {
      const year = entry.year;
      if (!statsByYear[year]) {
        statsByYear[year] = [];
      }
      statsByYear[year].push(entry);
    });
    
    return statsByYear;
  } catch (error) {
    console.error('Error obteniendo estadísticas anuales:', error);
    return {};
  }
};
