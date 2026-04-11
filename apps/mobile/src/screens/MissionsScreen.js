import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
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
  const [activeMission, setActiveMission] = useState(null); // Stocke la mission acceptée

  // Mock data : Missions non staffées (disponibles)
  const availableMissions = [
    { id: '1', type: 'Alimentaire', store: 'Monoprix - Paris 11', reward: '7.50', distance: '1.2 km' },
    { id: '2', type: 'Colis', store: 'Point Relais - Bastille', reward: '12.00', distance: '2.5 km' },
  ];

  // Mock data : Historique (faites par l'user)
  const historyMissions = [
    { id: '101', store: 'Franprix République', date: 'Hier', reward: '6.40' },
    { id: '102', store: 'Boulangerie Louise', date: '2 oct.', reward: '5.20' },
  ];

  const handleAcceptMission = (mission) => {
    setActiveMission(mission);
    // Ici tu lancerais normalement la navigation GPS
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
                onAccept={() => handleAcceptMission(item)} 
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

      {/* --- BOUTON FLOTTANT (FAB) --- */}
      {/* Il n'apparaît que si une mission est sélectionnée */}
      {activeMission && (
  <TouchableOpacity 
    style={styles.fabRound} 
    activeOpacity={0.8}
    onPress={() => alert(`Retour à la mission : ${activeMission.store}`)}
  >
    <MaterialCommunityIcons name="navigation" size={30} color={COLORS.white} />
    {/* Petit badge de notification pour signaler l'activité */}
    <View style={styles.notificationBadge} />
  </TouchableOpacity>
)}
    </View>
  );
}

// --- SOUS-COMPOSANTS ---

const MissionCard = ({ mission, onAccept }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.storeName}>{mission.store}</Text>
      <Text style={styles.price}>{mission.reward}€</Text>
    </View>
    <View style={styles.cardMeta}>
      <Text style={styles.metaText}>📍 {mission.distance}</Text>
      <Text style={styles.metaText}>📦 {mission.type}</Text>
    </View>
    <GoMileButton title="ACCEPTER" style={styles.acceptBtn} onPress={onAccept} />
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

  fabRound: {
    position: 'absolute',
    bottom: 30, // Distance du bas
    right: 20,  // Fixé à droite uniquement
    backgroundColor: COLORS.secondary,
    width: 65,  // Largeur égale à la hauteur pour le rond
    height: 65,
    borderRadius: 32.5, // Moitié de la largeur/hauteur
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,       // Ombre Android
    shadowColor: '#000', // Ombre iOS
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  notificationBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50', // Vert flash pour signaler la mission en cours
    borderWidth: 2,
    borderColor: COLORS.secondary,
  }
});