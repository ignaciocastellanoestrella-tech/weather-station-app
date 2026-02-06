import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function Charts({ historicalData, station }) {
  if (!historicalData || historicalData.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient colors={['#2c5282', '#4299e1']} style={styles.header}>
          <Ionicons name="analytics" size={48} color="white" />
          <Text style={styles.headerTitle}>Gráficas 📊</Text>
          <Text style={styles.headerSubtitle}>{station?.name || 'Estación'}</Text>
        </LinearGradient>
        <View style={styles.noDataContainer}>
          <Ionicons name="bar-chart-outline" size={64} color="#cbd5e0" />
          <Text style={styles.noData}>No hay datos históricos disponibles</Text>
          <Text style={styles.noDataHint}>Los datos se acumularán con el tiempo automáticamente</Text>
        </View>
      </ScrollView>
    );
  }

  const last24Hours = historicalData.slice(-24);
  const temps = last24Hours.map(d => d.data.metric?.temp || 0);
  const humidity = last24Hours.map(d => d.data.humidity || 0);
  const pressure = last24Hours.map(d => d.data.metric?.pressure || 0);
  const windSpeed = last24Hours.map(d => d.data.metric?.windSpeed || 0);
  const rain = last24Hours.map(d => d.data.metric?.precipTotal || 0);
  const labels = last24Hours.map((d, i) => i % 6 === 0 ? `${new Date(d.timestamp).getHours()}h` : '');

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#f7fafc',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(66, 153, 225, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '3', strokeWidth: '2', stroke: '#4299e1' },
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#2c5282', '#4299e1']} style={styles.header}>
        <Ionicons name="analytics" size={48} color="white" />
        <Text style={styles.headerTitle}>Gráficas Interactivas</Text>
        <Text style={styles.headerSubtitle}>Últimas 24 horas - {station?.name}</Text>
      </LinearGradient>

      <View style={styles.chartSection}>
        <ChartCard title="🌡️ Temperatura (°C)" color="#f56565">
          <LineChart
            data={{ labels, datasets: [{ data: temps.length > 0 ? temps : [0] }] }}
            width={screenWidth - 60}
            height={220}
            chartConfig={{...chartConfig, color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`}}
            bezier
            style={styles.chart}
          />
        </ChartCard>

        <ChartCard title="💧 Humedad (%)" color="#3b82f6">
          <LineChart
            data={{ labels, datasets: [{ data: humidity.length > 0 ? humidity : [0] }] }}
            width={screenWidth - 60}
            height={220}
            chartConfig={{...chartConfig, color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`}}
            bezier
            style={styles.chart}
          />
        </ChartCard>

        <ChartCard title="📊 Presión Atmosférica (mb)" color="#8b5cf6">
          <LineChart
            data={{ labels, datasets: [{ data: pressure.length > 0 ? pressure : [0] }] }}
            width={screenWidth - 60}
            height={220}
            chartConfig={{...chartConfig, color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`}}
            bezier
            style={styles.chart}
          />
        </ChartCard>

        <ChartCard title="💨 Velocidad del Viento (km/h)" color="#10b981">
          <LineChart
            data={{ labels, datasets: [{ data: windSpeed.length > 0 ? windSpeed : [0] }] }}
            width={screenWidth - 60}
            height={220}
            chartConfig={{...chartConfig, color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`}}
            bezier
            style={styles.chart}
          />
        </ChartCard>

        <ChartCard title="🌧️ Precipitación Acumulada (mm)" color="#0ea5e9">
          <BarChart
            data={{ labels, datasets: [{ data: rain.length > 0 ? rain : [0] }] }}
            width={screenWidth - 60}
            height={220}
            chartConfig={{...chartConfig, color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`}}
            style={styles.chart}
          />
        </ChartCard>
      </View>

      <View style={styles.info}>
        <Ionicons name="information-circle" size={20} color="#4299e1" />
        <Text style={styles.infoText}>Desliza para ver todas las gráficas</Text>
      </View>
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function ChartCard({ title, color, children }) {
  return (
    <View style={styles.chartCard}>
      <View style={[styles.chartHeader, { borderLeftColor: color }]}>
        <Text style={styles.chartTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { padding: 30, paddingTop: 60, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: 'white', marginTop: 10 },
  headerSubtitle: { fontSize:14, color: '#bee3f8', marginTop: 5 },
  noDataContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 60 },
  noData: { fontSize: 18, color: '#718096', textAlign: 'center', marginTop: 20, fontWeight: '600' },
  noDataHint: { fontSize: 14, color: '#a0aec0', textAlign: 'center', marginTop: 10 },
  chartSection: { padding: 20 },
  chartCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  chartHeader: { borderLeftWidth: 4, paddingLeft: 12, marginBottom: 15 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3748' },
  chart: { marginVertical: 8, borderRadius: 16 },
  info: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 8 },
  infoText: { fontSize: 14, color: '#4a5568', fontStyle: 'italic' },
  bottomPadding: { height: 20 },
});