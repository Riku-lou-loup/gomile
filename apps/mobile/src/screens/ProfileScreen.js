import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Share } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Tes composants factorisés
import FormLayout from '../components/FormLayout';
import SectionTitle from '../components/SectionTitle';
import GoMileButton from '../components/GoMileButton';
import MultiOptionGrid from '../components/MultiOptionGrid'; // Réutilisation pour le choix du véhicule

// Thème et constantes
import { COLORS, SIZES } from '../constants/theme';

const DEFAULT_AVATAR = require('../../assets/livreur.jpg');

export default function ProfileScreen({ navigation }) {
  // État pour le véhicule actif (Simule le changement pour l'API)
  const [activeVehicle, setActiveVehicle] = useState('velo');

  const vehicleOptions = [
    { label: 'Vélo', value: 'velo' },
    { label: 'moto', value: 'moto' },
    { label: 'Voiture', value: 'voiture' },
    { label: 'Utilitaire', value: 'utilitaire' },
  ];

  const handleInvite = async () => {
    try {
      await Share.share({
        title: 'Deviens livreur GoMile',
        message: `Rejoins-moi sur GoMile ! Utilise mon code "JEAN2026" pour un bonus. 🚀`,
      });
    } catch (error) {
      Alert.alert("Erreur", "Impossible de partager.");
    }
  };

  return (
    <FormLayout title="MON ESPACE">
      
      {/* --- CARTE D'IDENTITÉ & SCORING --- */}
      <View style={styles.idCard}>
        <View style={styles.cardTop}>
          <Image source={DEFAULT_AVATAR} style={styles.avatar} />
          <View style={styles.scoringContainer}>
            <View style={styles.scoreBadge}>
              <MaterialCommunityIcons name="star" size={14} color={COLORS.primary} />
              <Text style={styles.scoreText}>4.9</Text>
            </View>
            <Text style={styles.tripsText}>128 courses</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.nameText}>Jean Paul</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons 
                name={activeVehicle === 'velo' ? "bike" : activeVehicle === 'scooter' ? "moped" : "car"} 
                size={16} 
                color={COLORS.primary} 
            />
            <Text style={[styles.infoText, {color: COLORS.white}]}>
                En service : {vehicleOptions.find(v => v.value === activeVehicle).label}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.idText}>ID: GM-8829-2026</Text>
          <View style={styles.statusBadge}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>DISPONIBLE</Text>
          </View>
        </View>
      </View>

      {/* --- CHANGEMENT DE VÉHICULE (Action rapide) --- */}
      <SectionTitle style={{ marginTop: 25 }}>Véhicule pour cette session</SectionTitle>
      <MultiOptionGrid 
        options={vehicleOptions} 
        selectedValues={[activeVehicle]} 
        onToggle={(val) => setActiveVehicle(val[val.length - 1])} // Prend la dernière sélection
      />

      {/* --- SECTION PARRAINAGE --- */}
      <TouchableOpacity style={styles.inviteBox} onPress={handleInvite}>
        <MaterialCommunityIcons name="gift-outline" size={28} color={COLORS.primary} />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.inviteTitle}>Parrainez un ami</Text>
          <Text style={styles.inviteSub}>Gagnez 50€ par nouveau livreur actif</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.placeholder} />
      </TouchableOpacity>

      {/* --- MENU D'ACTIONS (Grille) --- */}
      <SectionTitle style={{ marginTop: 25 }}>Ma Logistique</SectionTitle>
      
      <View style={styles.menuGrid}>
        <MenuTile 
          icon="shopping-outline" 
          label="Boutique Équipement" 
          onPress={() => Alert.alert("Boutique", "Redirection vers le shop GoMile...")} 
        />
        <MenuTile 
          icon="cash-multiple" 
          label="Historique Gains" 
          onPress={() => navigation.navigate('Portefeuille')} 
        />
        <MenuTile 
          icon="file-certificate-outline" 
          label="Mes Documents" 
          onPress={() => {}} 
        />
        <MenuTile 
          icon="shield-lock-outline" 
          label="Sécurité" 
          onPress={() => {}} 
        />
      </View>

      {/* BOUTON DÉCONNEXION */}
      <GoMileButton 
        title="SE DÉCONNECTER" 
        outline
        style={styles.logoutBtn}
        onPress={() => navigation.replace('Login')}
      />
      
    </FormLayout>
  );
}

// Composant local pour les tuiles du menu
const MenuTile = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.iconCircle}>
        <MaterialCommunityIcons name={icon} size={24} color={COLORS.secondary} />
    </View>
    <Text style={styles.tileLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // Carte d'Identité améliorée
  idCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: COLORS.primary },
  
  scoringContainer: { alignItems: 'flex-end' },
  scoreBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  scoreText: { fontWeight: '800', marginLeft: 4, color: COLORS.secondary, fontSize: 14 },
  tripsText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 },

  cardBody: { marginTop: 15 },
  nameText: { color: COLORS.white, fontSize: 22, fontWeight: '900' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  infoText: { marginLeft: 8, fontSize: 14, fontWeight: '500' },

  cardFooter: { 
    marginTop: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.1)', 
    paddingTop: 15,
    alignItems: 'center'
  },
  idText: { color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginRight: 6 },
  statusText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },

  // Parrainage
  inviteBox: { 
    backgroundColor: COLORS.white, 
    marginTop: 20, 
    padding: 15, 
    borderRadius: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: COLORS.border
  },
  inviteTitle: { fontWeight: 'bold', color: COLORS.secondary, fontSize: 15 },
  inviteSub: { color: COLORS.placeholder, fontSize: 12 },

  // Grille
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
  tile: { 
    width: '48%', 
    backgroundColor: COLORS.white, 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 15, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  tileLabel: { textAlign: 'center', fontSize: 12, fontWeight: '700', color: COLORS.secondary },

  logoutBtn: { marginTop: 20, borderColor: '#FF5252' },
  versionText: { textAlign: 'center', color: COLORS.placeholder, fontSize: 10, marginTop: 15, marginBottom: 20 }
});