import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getYearlyStats } from '../services/StorageService';

export default function HistoricalData({ data, station }) {
  const [period, setPeriod] = useState('daily');
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearlyData, setYearlyData] = useState({});

  React.useEffect(() => {
    if (station) {
      loadYearlyData();
    }
  }, [station]);

  const loadYearlyData = async () => {
    if (!station) return;
    const stats = await getYearlyStats(station.id);
    setYearlyData(stats);
    if (!selectedYear && Object.keys(stats).length > 0) {
      setSelectedYear(Object.keys(stats).sort().reverse()[0]);
    }
  };

  if (!data) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient colors={['#2c5282', '#4299e1']} style={styles.header}>
          <Ionicons name="calendar" size={48} color="white" />
          <Text style={styles.headerTitle}>Datos Históricos</Text>
          <Text style={styles.headerSubtitle}>{station?.name || 'Estación'}</Text>
        </LinearGradient>
        <View style={styles.noDataContainer}>
          <Ionicons name="time-outline" size={64} color="#cbd5e0" />
          <Text style={styles.noData}>No hay datos históricos para este periodo</Text>
          <Text style={styles.noDataHint}>Los datos se irán acumulando automáticamente</Text>
        </View>
      </ScrollView>
    );
  }

  const periodData = data[period] || [];
  const stats = calculateStats(periodData);
  const years = Object.keys(yearlyData).sort().reverse();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#2c5282', '#4299e1']} style={styles.header}>
        <Ionicons name="calendar" size={48} color="white" />
        <Text style={styles.headerTitle}>Histórico y Estadísticas</Text>
        <Text style={styles.headerSubtitle}>{station?.name}</Text>
      </LinearGradient>

      <View style={styles.periodSelector}>
        <Text style={styles.selectorTitle}>Seleccionar Periodo:</Text>
        <View style={styles.buttonRow}>
          <PeriodButton label="Diario" period="daily" active={period} onPress={() => setPeriod('daily')} />
          <PeriodButton label="Semanal" period="weekly" active={period} onPress={() => setPeriod('weekly')} />
        </View>
        <View style={styles.buttonRow}>
          <PeriodButton label="Mensual" period="monthly" active={period} onPress={() => setPeriod('monthly')} />
          <PeriodButton label="Anual" period="yearly" active={period} onPress={() => setPeriod('yearly')} />
        </View>
      </View>

      {periodData.length > 0 ? (
        <>
          <View style={styles.statsGrid}>
            <StatCard
              icon="thermometer"
              title="Temperatura"
              max={`${stats.tempMax}°C`}
              min={`${stats.tempMin}°C`}
              avg={`${stats.tempAvg}°C`}
              color="#f56565"
            />
            <StatCard
              icon="water"
              title="Humedad"
              max={`${stats.humidityMax}%`}
              min={`${stats.humidityMin}%`}
              avg={`${stats.humidityAvg}%`}
              color="#3b82f6"
            />
            <StatCard
              icon="navigate"
              title="Viento"
              max={`${stats.windMax} km/h`}
              min="-"
              avg={`${stats.windAvg} km/h`}
              color="#10b981"
            />
            <StatCard
              icon="rainy"
              title="Precipitación"
              max={`${stats.rainTotal} mm`}
              min={`${stats.rainMax} mm/día`}
              avg="-"
              color="#0ea5e9"
            />
            <StatCard
              icon="speedometer-outline"
              title="Presión"
              max={`${stats.pressureMax} mb`}
              min={`${stats.pressureMin} mb`}
              avg={`${stats.pressureAvg} mb`}
              color="#8b5cf6"
            />
            <StatCard
              icon="bar-chart"
              title="Registros"
              max={`${periodData.length} muestras`}
              min={new Date(periodData[0].timestamp).toLocaleDateString('es-ES')}
              avg={new Date(periodData[periodData.length - 1].timestamp).toLocaleDateString('es-ES')}
              color="#6366f1"
            />
          </View>
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noData}>No hay datos para este periodo</Text>
        </View>
      )}

      {years.length > 0 && (
        <View style={styles.yearSection}>
          <Text style={styles.yearTitle}>📅 Estadísticas Anuales</Text>
          <View style={styles.yearSelector}>
            {years.map(year => (
              <TouchableOpacity
                key={year}
                style={[styles.yearButton, selectedYear === year && styles.yearButtonActive]}
                onPress={() => setSelectedYear(year)}
              >
                <Text style={[styles.yearButtonText, selectedYear === year && styles.yearButtonTextActive]}>
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedYear && yearlyData[selectedYear] && (
            <View style={styles.yearStats}>
              <Text style={styles.yearStatsTitle}>Año {selectedYear}</Text>
              <Text style={styles.yearStatsText}>
                Total de registros: {yearlyData[selectedYear].length}
              </Text>
              <Text style={styles.yearStatsText}>
                Desde: {new Date(yearlyData[selectedYear][0].timestamp).toLocaleDateString('es-ES')}
              </Text>
              <Text style={styles.yearStatsText}>
                Hasta: {new Date(yearlyData[selectedYear][yearlyData[selectedYear].length - 1].timestamp).toLocaleDateString('es-ES')}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function PeriodButton({ label, period, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.periodButton, active === period && styles.periodButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.periodButtonText, active === period && styles.periodButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function StatCard({ icon, title, max, min, avg, color }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statCardHeader, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
      <View style={styles.statCardBody}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Máximo:</Text>
          <Text style={styles.statValue}>{max}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Mínimo:</Text>
          <Text style={styles.statValue}>{min}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Promedio:</Text>
          <Text style={styles.statValue}>{avg}</Text>
        </View>
      </View>
    </View>
  );
}

function calculateStats(data) {
  if (!data || data.length === 0) {
    return { tempMax: 0, tempMin: 0, tempAvg: 0, humidityMax: 0, humidityMin: 0, humidityAvg: 0, windMax: 0, windAvg: 0, rainTotal: 0, rainMax: 0, pressureMax: 0, pressureMin: 0, pressureAvg: 0 };
  }

  const temps = data.map(d => d.data.metric?.temp || 0).filter(t => t !== 0);
  const humidity = data.map(d => d.data.humidity || 0).filter(h => h !== 0);
  const wind = data.map(d => d.data.metric?.windSpeed || 0).filter(w => w !== 0);
  const rain = data.map(d => d.data.metric?.precipTotal || 0);
  const pressure = data.map(d => d.data.metric?.pressure || 0).filter(p => p !== 0);

  return {
    tempMax: temps.length > 0 ? Math.max(...temps).toFixed(1) : 0,
    tempMin: temps.length > 0 ? Math.min(...temps).toFixed(1) : 0,
    tempAvg: temps.length > 0 ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : 0,
    humidityMax: humidity.length > 0 ? Math.max(...humidity).toFixed(0) : 0,
    humidityMin: humidity.length > 0 ? Math.min(...humidity).toFixed(0) : 0,
    humidityAvg: humidity.length > 0 ? (humidity.reduce((a, b) => a + b, 0) / humidity.length).toFixed(0) : 0,
    windMax: wind.length > 0 ? Math.max(...wind).toFixed(1) : 0,
    windAvg: wind.length > 0 ? (wind.reduce((a, b) => a + b, 0) / wind.length).toFixed(1) : 0,
    rainTotal: (rain.reduce((a, b) => a + b, 0)).toFixed(1),
    rainMax: rain.length > 0 ? Math.max(...rain).toFixed(1) : 0,
    pressureMax: pressure.length > 0 ? Math.max(...pressure).toFixed(1) : 0,
    pressureMin: pressure.length > 0 ? Math.min(...pressure).toFixed(1) : 0,
    pressureAvg: pressure.length > 0 ? (pressure.reduce((a, b) => a + b, 0) / pressure.length).toFixed(1) : 0,
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { padding: 30, paddingTop: 60, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: 'white', marginTop: 10 },
  headerSubtitle: { fontSize: 14, color: '#bee3f8', marginTop: 5 },
  noDataContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 60 },
  noData: { fontSize: 18, color: '#718096', textAlign: 'center', marginTop: 20, fontWeight: '600' },
  noDataHint: { fontSize: 14, color: '#a0aec0', textAlign: 'center', marginTop: 10 },
  periodSelector: { padding: 20 },
  selectorTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3748', marginBottom: 12 },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  periodButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, backgroundColor: 'white', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  periodButtonActive: { backgroundColor: '#4299e1' },
  periodButtonText: { fontSize: 14, fontWeight: '600', color: '#4a5568' },
  periodButtonTextActive: { color: 'white' },
  statsGrid: { padding: 20, gap: 16 },
  statCard: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  statCardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  statCardTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  statCardBody: { padding: 16 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { fontSize: 14, color: '#718096' },
  statValue: { fontSize: 14, fontWeight: '600', color: '#2d3748' },
  yearSection: { padding: 20, marginTop: 20 },
  yearTitle: { fontSize: 20, fontWeight: 'bold', color: '#2d3748', marginBottom: 15 },
  yearSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  yearButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  yearButtonActive: { backgroundColor: '#4299e1' },
  yearButtonText: { fontSize: 14, fontWeight: '600', color: '#4a5568' },
  yearButtonTextActive: { color: 'white' },
  yearStats: { backgroundColor: 'white', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  yearStatsTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3748', marginBottom: 12 },
  yearStatsText: { fontSize: 14, color: '#4a5568', marginBottom: 6 },
  bottomPadding: { height: 40 },
});