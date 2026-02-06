import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CurrentWeather({ data, station, lastUpdate, onRefresh }) {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) await onRefresh();
    setRefreshing(false);
  };

  if (!data || !data.metric) {
    return (
      <ScrollView 
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <LinearGradient colors={['#2c5282', '#4299e1']} style={styles.header}>
          <Text style={styles.loading}>Cargando datos meteorológicos...</Text>
          <Text style={styles.stationName}>{station?.name || 'Estación'}</Text>
        </LinearGradient>
      </ScrollView>
    );
  }

  const { metric, ...obs } = data;

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
      <LinearGradient colors={['#2c5282', '#4299e1']} style={styles.header}>
        <Ionicons name="cloud" size={48} color="white" style={styles.headerIcon} />
        <Text style={styles.stationName}>{station?.name || 'Estación Meteorológica'}</Text>
        <Text style={styles.stationId}>ID: {station?.id}</Text>
        <Text style={styles.updateTime}>{lastUpdate ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')}` : 'Cargando...'}</Text>
      </LinearGradient>

      <View style={styles.mainTempCard}>
        <LinearGradient colors={['#f56565', '#ed8936']} style={styles.mainTempGradient}>
          <Text style={styles.mainTemp}>{metric.temp}°</Text>
          <Text style={styles.tempLabel}>Temperatura Actual</Text>
          <View style={styles.feelsLike}>
            <Text style={styles.feelsLikeText}>Sensación: {metric.heatIndex}°C</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌡️ Temperatura y Humedad</Text>
        <View style={styles.gridContainer}>
          <DataCard icon="thermometer" label="Temperatura" value={`${metric.temp}°C`} color="#f56565" />
          <DataCard icon="water" label="Humedad" value={`${obs.humidity}%`} color="#4299e1" />
          <DataCard icon="snow" label="Punto de Rocío" value={`${metric.dewpt}°C`} color="#48bb78" />
          <DataCard icon="flame" label="Sensación Térmica" value={`${metric.heatIndex}°C`} color="#ed8936" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💨 Viento</Text>
        <View style={styles.gridContainer}>
          <DataCard icon="navigate" label="Velocidad" value={`${metric.windSpeed} km/h`} color="#10b981" />
          <DataCard icon="compass" label="Dirección" value={`${obs.winddir}° ${getWindDirection(obs.winddir)}`} color="#6366f1" />
          <DataCard icon="pulse" label="Ráfagas" value={`${metric.windGust} km/h`} color="#ef4444" />
          <DataCard icon="speedometer" label="Velocidad Promedio" value={`${(parseFloat(metric.windSpeed) * 0.9).toFixed(1)} km/h`} color="#14b8a6" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌧️ Precipitación</Text>
        <View style={styles.gridContainer}>
          <DataCard icon="rainy" label="Acumulada Hoy" value={`${metric.precipTotal} mm`} color="#3b82f6" />
          <DataCard icon="water-outline" label="Tasa Actual" value={`${metric.precipRate} mm/h`} color="#0ea5e9" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Presión y Radiación</Text>
        <View style={styles.gridContainer}>
          <DataCard icon="speedometer-outline" label="Presión" value={`${metric.pressure} mb`} color="#8b5cf6" />
          <DataCard icon="sunny" label="Radiación Solar" value={`${obs.solarRadiation} W/m²`} color="#f59e0b" />
          <DataCard icon="shield-checkmark" label="Índice UV" value={obs.uv} color="#ec4899" />
        </View>
      </View>

      <View style={styles.footer}>
        <Ionicons name="time" size={16} color="#a0aec0" />
        <Text style={styles.timestamp}>Última observación: {new Date(obs.obsTimeLocal).toLocaleString('es-ES')}</Text>
      </View>
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function DataCard({ icon, label, value, color }) {
  return (
    <View style={styles.dataCard}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={styles.dataValue}>{value}</Text>
      <Text style={styles.dataLabel}>{label}</Text>
    </View>
  );
}

function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  return directions[Math.round(degrees / 22.5) % 16];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { padding: 30, paddingTop: 60, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerIcon: { marginBottom: 10 },
  stationName: { fontSize: 24, fontWeight: 'bold', color: 'white', marginTop: 5 },
  stationId: { fontSize: 14, color: '#bee3f8', marginTop: 5 },
  updateTime: { fontSize: 12, color: '#bee3f8', marginTop: 8, fontStyle: 'italic' },
  loading: { fontSize: 18, color: 'white', textAlign: 'center' },
  mainTempCard: { margin: 20, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  mainTempGradient: { padding: 40, alignItems: 'center' },
  mainTemp: { fontSize: 80, fontWeight: 'bold', color: 'white' },
  tempLabel: { fontSize: 18, color: 'white', marginTop: 10, opacity: 0.9 },
  feelsLike: { marginTop: 15, backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  feelsLikeText: { color: 'white', fontSize: 14, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2d3748', marginBottom: 15 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dataCard: { width: '48%', backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  dataValue: { fontSize: 20, fontWeight: 'bold', color: '#2d3748', marginTop: 8 },
  dataLabel: { fontSize: 12, color: '#718096', marginTop: 4, textAlign: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 8 },
  timestamp: { fontSize: 12, color: '#a0aec0', fontStyle: 'italic' },
  bottomPadding: { height: 20 },
});