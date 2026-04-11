import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Tes composants factorisés
import FormLayout from '../components/FormLayout';
import SectionTitle from '../components/SectionTitle';
import GoMileButton from '../components/GoMileButton';

// Thème et constantes
import { COLORS, SIZES } from '../constants/theme';

export default function MissionsScreen({ navigation }) {
  
  // --- ÉTATS DE TEST ---
  const isAccountValidated = true; 

  // Mock data : Missions non staffées (disponibles)
  const availableMissions = [
    {
      id: '1',
      type: 'Alimentaire',
      store: 'Monoprix - Grenoble Centre',
      storeAddress: '25 Grand Place, 38100 Grenoble',
      customerArea: '17 Rue de Strasbourg, 38000 Grenoble',
      customerName: 'Luc Martin',
      reward: '7.50',
      distance: '1.2 km',
      eta: '18 min',
      notes: 'Commande fragile, eviter les secousses.',
      mapRegion: {
        latitude: 45.1842,
        longitude: 5.7227,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      currentPosition: { latitude: 45.1881, longitude: 5.7245 },
      pickup: { latitude: 45.1709, longitude: 5.7317 },
      dropoff: { latitude: 45.1912, longitude: 5.7263 },
      merchantAuthCode: '4831',
      clientValidationCode: '9021',
    },
    {
      id: '2',
      type: 'Colis',
      store: 'Point Relais - Caserne de Bonne',
      storeAddress: '48 Bd Gambetta, 38000 Grenoble',
      customerArea: '6 Rue Saint-Jacques, 38000 Grenoble',
      customerName: 'Sara Diallo',
      reward: '12.00',
      distance: '2.5 km',
      eta: '24 min',
      notes: 'Remise en main propre uniquement.',
      mapRegion: {
        latitude: 45.1848,
        longitude: 5.7301,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      currentPosition: { latitude: 45.1887, longitude: 5.7208 },
      pickup: { latitude: 45.1829, longitude: 5.7282 },
      dropoff: { latitude: 45.1904, longitude: 5.7369 },
      merchantAuthCode: '7294',
      clientValidationCode: '4407',
    },
  ];

  // Mock data : Historique (faites par l'user)
  const historyMissions = [
    { id: '101', store: 'Franprix République', date: 'Hier', reward: '6.40' },
    { id: '102', store: 'Boulangerie Louise', date: '2 oct.', reward: '5.20' },
  ];

  const handleOpenMissionDetails = (mission) => {
    navigation.navigate('MissionDetails', { mission });
  };

  return (
    <View style={{ flex: 1 }}>
      <FormLayout title="MISSIONS" showAvailabilityToggle>
        
        {/* 1. ÉTAT : COMPTE NON VALIDÉ */}
        {!isAccountValidated && (
          <View style={styles.statusBox}>
            <MaterialCommunityIcons name="clock-check" size={24} color={COLORS.secondary} />
            <Text style={styles.statusTitle}>Validation en cours</Text>
            <Text style={styles.statusText}>Reviens ici dès que ton profil sera validé.</Text>
          </View>
        )}

        {/* 2. MISSIONS DISPONIBLES (NON STAFFÉES) */}
        {isAccountValidated && (
          <View>
            <SectionTitle>Missions à proximité</SectionTitle>
            {availableMissions.map((item) => (
              <MissionCard 
                key={item.id} 
                mission={item} 
                onOpenDetails={() => handleOpenMissionDetails(item)} 
              />
            ))}

            {/* SÉPARATEUR & HISTORIQUE */}
            <View style={styles.historyDivider}>
              <View style={styles.line} />
              <Text style={styles.historyTitle}>HISTORIQUE DES MISSIONS</Text>
              <View style={styles.line} />
            </View>

            {historyMissions.map((item) => (
              <HistoryRow key={item.id} item={item} />
            ))}
          </View>
        )}
      </FormLayout>
    </View>
  );
}

// --- SOUS-COMPOSANTS ---

const MissionCard = ({ mission, onOpenDetails }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.storeName}>{mission.store}</Text>
      <Text style={styles.price}>{mission.reward}€</Text>
    </View>
    <View style={styles.cardMeta}>
      <Text style={styles.metaText}>📍 {mission.distance}</Text>
      <Text style={styles.metaText}>📦 {mission.type}</Text>
    </View>
    <GoMileButton title="VOIR LES DETAILS" style={styles.acceptBtn} onPress={onOpenDetails} />
  </View>
);

const HistoryRow = ({ item }) => (
  <View style={styles.historyRow}>
    <View>
      <Text style={styles.historyStore}>{item.store}</Text>
      <Text style={styles.historyDate}>{item.date}</Text>
    </View>
    <Text style={styles.historyPrice}>+{item.reward}€</Text>
  </View>
);

const styles = StyleSheet.create({
  // Status Box (Non validé)
  statusBox: { padding: 20, backgroundColor: '#E3F2FD', borderRadius: 15, alignItems: 'center' },
  statusTitle: { fontWeight: 'bold', color: COLORS.secondary, marginTop: 10 },
  statusText: { textAlign: 'center', color: COLORS.secondary, fontSize: 12 },

  // Cartes Missions
  card: { 
    backgroundColor: COLORS.white, 
    borderRadius: 15, 
    padding: 15, 
    marginTop: 15, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    elevation: 3
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  storeName: { fontWeight: 'bold', fontSize: 16, color: COLORS.secondary },
  price: { fontWeight: '900', color: COLORS.primary, fontSize: 18 },
  cardMeta: { flexDirection: 'row', gap: 15, marginVertical: 10 },
  metaText: { fontSize: 12, color: COLORS.placeholder },
  acceptBtn: { paddingVertical: 10 },

  // Historique
  historyDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 30, opacity: 0.5 },
  line: { flex: 1, height: 1, backgroundColor: COLORS.placeholder },
  historyTitle: { marginHorizontal: 10, fontSize: 10, fontWeight: 'bold', color: COLORS.placeholder },
  historyRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5' 
  },
  historyStore: { fontWeight: '600', color: COLORS.secondary },
  historyDate: { fontSize: 12, color: COLORS.placeholder },
  historyPrice: { fontWeight: 'bold', color: COLORS.secondary },
});