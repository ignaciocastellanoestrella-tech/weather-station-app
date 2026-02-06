import axios from 'axios';

const BASE_URL = 'https://api.weather.com/v2/pws/observations';

export const getCurrentWeather = async (stationId, apiKey) => {
  try {
    const response = await axios.get(`${BASE_URL}/current`, {
      params: {
        stationId: stationId,
        format: 'json',
        units: 'm',
        apiKey: apiKey,
      },
    });
    return response.data.observations[0];
  } catch (error) {
    console.error('Error obteniendo datos actuales:', error);
    throw error;
  }
};

export const getHistoricalWeather = async (stationId, apiKey, days = 7) => {
  try {
    const response = await axios.get(`${BASE_URL}/hourly/7day`, {
      params: {
        stationId: stationId,
        format: 'json',
        units: 'm',
        apiKey: apiKey,
      },
    });
    return response.data.observations;
  } catch (error) {
    console.error('Error obteniendo histórico:', error);
    throw error;
  }
};

// Validar credenciales
export const validateStation = async (stationId, apiKey) => {
  try {
    await getCurrentWeather(stationId, apiKey);
    return { valid: true, error: null };
  } catch (error) {
    return { 
      valid: false, 
      error: error.response?.status === 401 ? 'API Key inválida' : 'Estación no encontrada' 
    };
  }
};
