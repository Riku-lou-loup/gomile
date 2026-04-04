import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Switch, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps'; // Nécessite l'install de react-native-maps
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Tes composants
import Header from '../components/Header';
import { COLORS, SIZES } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [isOnline, setIsOnline] = useState(false);
  
  // Simulation de la position du livreur (Paris par exemple)
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  return (
    <View style={styles.container}>
      {/* Header avec bouton toggle intégré ou au-dessus */}
      <Header title="TABLEAU DE BORD" />

      {/* CARTE TEMPS RÉEL */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        customMapStyle={mapStyle} // Style épuré pour la lisibilité
      >
        {isOnline && (
          <Circle
            center={region}
            radius={1000}
            fillColor="rgba(255, 193, 7, 0.1)"
            strokeColor={COLORS.primary}
          />
        )}
      </MapView>

      {/* OVERLAY : STATUT DE CONNEXION */}
      <View style={styles.statusOverlay}>
        <View style={[styles.statusCard, isOnline ? styles.cardOnline : styles.cardOffline]}>
          <View>
            <Text style={styles.statusLabel}>Vous êtes {isOnline ? 'EN LIGNE' : 'HORS LIGNE'}</Text>
            <Text style={styles.statusSub}>
              {isOnline ? 'Prêt à recevoir des missions' : 'Passez en ligne pour livrer'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={COLORS.white}
          />
        </View>
      </View>

      {/* STATS RAPIDES (FLOTTANTES EN HAUT) */}
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>24.50 €</Text>
          <Text style={styles.statLabelMini}>Aujourd'hui</Text>
        </View>
        <View style={[styles.statItem, { borderLeftWidth: 1, borderColor: '#EEE' }]}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabelMini}>Courses</Text>
        </View>
      </View>

      {/* BOUTON RECENTRER (FAB ROND) */}
      <TouchableOpacity style={styles.recenterBtn} onPress={() => {}}>
        <MaterialCommunityIcons name="crosshairs-gps" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: width, height: height },
  
  // Overlay du statut (Bas de l'écran)
  statusOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  cardOnline: { borderTopWidth: 4, borderTopColor: '#4CAF50' },
  cardOffline: { borderTopWidth: 4, borderTopColor: COLORS.placeholder },
  
  statusLabel: { fontWeight: '900', fontSize: 16, color: COLORS.secondary },
  statusSub: { fontSize: 12, color: COLORS.placeholder, marginTop: 2 },

  // Stats rapides (Haut de l'écran sous le header)
  quickStats: {
    position: 'absolute',
    top: 110,
    left: 20,
    right: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontWeight: '900', color: COLORS.secondary, fontSize: 16 },
  statLabelMini: { fontSize: 10, color: COLORS.placeholder, textTransform: 'uppercase' },

  // Bouton recentrer
  recenterBtn: {
    position: 'absolute',
    bottom: 130,
    right: 20,
    backgroundColor: COLORS.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  }
});

// Style de carte simplifié (JSON standard Google Maps)
const mapStyle = [
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "simplified" }] }
];