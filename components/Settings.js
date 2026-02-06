import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  getStations, 
  getActiveStation, 
  setActiveStation, 
  addStation, 
  updateStation, 
  deleteStation 
} from '../services/StationManager';
import { validateStation } from '../services/WundergroundAPI';

export default function Settings({ onStationChange }) {
  const [stations, setStations] = useState([]);
  const [activeStationId, setActiveStationId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStation, setNewStation] = useState({ id: '', name: '', apiKey: '' });
  const [validating, setValidating] = useState(false);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stationsList = await getStations();
    const active = await getActiveStation();
    setStations(stationsList);
    setActiveStationId(active.id);
  };

  const handleSelectStation = async (stationId) => {
    await setActiveStation(stationId);
    setActiveStationId(stationId);
    if (onStationChange) {
      const stations = await getStations();
      const station = stations.find(s => s.id === stationId);
      onStationChange(station);
    }
    Alert.alert('¡Listo!', 'Estación activada correctamente');
  };

  const handleAddStation = async () => {
    if (!newStation.id || !newStation.name || !newStation.apiKey) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setValidating(true);
    const validation = await validateStation(newStation.id, newStation.apiKey);
    setValidating(false);

    if (!validation.valid) {
      Alert.alert('Error', validation.error || 'No se pudo validar la estación');
      return;
    }

    const success = await addStation(newStation);
    if (success) {
      Alert.alert('¡Éxito!', 'Estación añadida correctamente');
      setShowAddModal(false);
      setNewStation({ id: '', name: '', apiKey: '' });
      loadData();
    } else {
      Alert.alert('Error', 'No se pudo añadir la estación');
    }
  };

  const handleDeleteStation = (stationId) => {
    Alert.alert(
      'Confirmar',
      '¿Eliminar esta estación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteStation(stationId);
            if (success) {
              loadData();
              Alert.alert('Eliminada', 'La estación ha sido eliminada');
            } else {
              Alert.alert('Error', 'No se puede eliminar la última estación');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2c5282', '#4299e1']}
        style={styles.header}
      >
        <Ionicons name="settings" size={48} color="white" />
        <Text style={styles.headerTitle}>Configuración</Text>
        <Text style={styles.headerSubtitle}>Gestiona tus estaciones meteorológicas</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📡 Estaciones Configuradas</Text>
        
        {stations.map((station) => (
          <TouchableOpacity
            key={station.id}
            style={[
              styles.stationCard,
              activeStationId === station.id && styles.activeStationCard
            ]}
            onPress={() => handleSelectStation(station.id)}
          >
            <View style={styles.stationInfo}>
              <View style={styles.stationHeader}>
                <Ionicons 
                  name={activeStationId === station.id ? "radio-button-on" : "radio-button-off"} 
                  size={24} 
                  color={activeStationId === station.id ? "#4299e1" : "#a0aec0"} 
                />
                <View style={styles.stationTextContainer}>
                  <Text style={styles.stationName}>{station.name}</Text>
                  <Text style={styles.stationId}>ID: {station.id}</Text>
                </View>
              </View>
              {activeStationId === station.id && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVA</Text>
                </View>
              )}
            </View>
            
            {!station.isDefault && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteStation(station.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Añadir Nueva Estación</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Información</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            • Puedes tener múltiples estaciones configuradas{'\n'}
            • La estación activa se muestra en todas las pantallas{'\n'}
            • Los datos históricos se guardan por estación{'\n'}
            • Obtén tu API Key en: weather.com/pws{'\n'}
            • El ID de estación es único para cada dispositivo
          </Text>
        </View>
      </View>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Estación</Text>
            
            <Text style={styles.inputLabel}>Nombre de la estación</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Mi Casa, Jardín, etc."
              value={newStation.name}
              onChangeText={(text) => setNewStation({ ...newStation, name: text })}
            />

            <Text style={styles.inputLabel}>ID de Estación (Wunderground)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: ICABRA64"
              value={newStation.id}
              onChangeText={(text) => setNewStation({ ...newStation, id: text.toUpperCase() })}
              autoCapitalize="characters"
            />

            <Text style={styles.inputLabel}>API Key</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 7fd62c8289ea40bf962c8289..."
              value={newStation.apiKey}
              onChangeText={(text) => setNewStation({ ...newStation, apiKey: text })}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewStation({ id: '', name: '', apiKey: '' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddStation}
                disabled={validating}
              >
                <Text style={styles.saveButtonText}>
                  {validating ? 'Validando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#bee3f8',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
  },
  stationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activeStationCard: {
    borderWidth: 2,
    borderColor: '#4299e1',
  },
  stationInfo: {
    flex: 1,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
  },
  stationId: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: '#4299e1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
    marginLeft: 36,
  },
  activeBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: '#48bb78',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#fff5e6',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  infoText: {
    fontSize: 14,
    color: '#744210',
    lineHeight: 22,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#4a5568',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4299e1',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
