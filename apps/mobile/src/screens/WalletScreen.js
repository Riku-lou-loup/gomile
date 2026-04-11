import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Tes composants factorisés
import FormLayout from '../components/FormLayout';
import BalanceCard from '../components/BalanceCard';
import SectionTitle from '../components/SectionTitle';
import GoMileButton from '../components/GoMileButton';

// Thème et constantes
import { COLORS, SIZES } from '../constants/theme';

export default function WalletScreen({ navigation }) {
  
  // Simulation de données de transactions
  const transactions = [
    { id: '1', type: 'Course', date: 'Aujourd\'hui, 14:20', amount: '+8.50', status: 'En cours' },
    { id: '2', type: 'Course', date: 'Aujourd\'hui, 12:45', amount: '+12.00', status: 'En cours' },
    { id: '3', type: 'Course', date: 'Hier, 10:00', amount: '+156.00', status: 'Complété' },
    { id: '4', type: 'Course', date: 'Hier, 12:00', amount: '+169.00', status: 'Complété' },
    { id: '5', type: 'Course', date: 'Avant hier, 16:00', amount: '+10.00', status: 'Complété' },
    { id: '6', type: 'Course', date: 'Avant hier, 10:00', amount: '+1962.00', status: 'Annulé' },
  ];

  const handleCashOut = () => {
    // Action liée au bouton de virement du composant BalanceCard
    alert("Demande de virement envoyée vers votre compte bancaire.");
  };

  return (
    <FormLayout title="MON PORTEFEUILLE" showAvailabilityToggle>
      
      {/* --- CARTE DE SOLDE (Composant réutilisé) --- */}
      <BalanceCard 
        amount="245.50" 
        onAction={handleCashOut} 
      />


      {/* --- HISTORIQUE DES TRANSACTIONS --- */}
      <SectionTitle style={{ marginTop: 25 }}>Dernières activités</SectionTitle>
      
      <View style={styles.historyList}>
        {transactions.map((item) => (
          <TransactionItem key={item.id} item={item} />
        ))}
      </View>

      {/* --- BOUTON VOIR PLUS --- */}
      <GoMileButton 
        title="VOIR TOUT L'HISTORIQUE" 
        outline
        type="secondary"
        style={styles.fullHistoryBtn}
        onPress={() => {}} 
      />

    </FormLayout>
  );
}

// Composant local pour les lignes de transaction
const TransactionItem = ({ item }) => (
  <View style={styles.transactionRow}>
    <View style={styles.iconCircle}>
      <MaterialCommunityIcons 
        name={item.amount.startsWith('+') ? "arrow-bottom-left" : "bank-transfer-out"} 
        size={20} 
        color={item.amount.startsWith('+') ? "#4CAF50" : COLORS.secondary} 
      />
    </View>
    <View style={styles.transactionInfo}>
      <Text style={styles.transType}>{item.type}</Text>
      <Text style={styles.transDate}>{item.date}</Text>
    </View>
    <View style={styles.transactionAmount}>
      <Text style={[
        styles.amountText, 
        { color: item.amount.startsWith('+') ? "#4CAF50" : COLORS.secondary }
      ]}>
        {item.amount} €
      </Text>
      <Text style={styles.transStatus}>{item.status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  // Section Bonus
  bonusContainer: {
    backgroundColor: COLORS.white,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bonusHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  bonusTitle: { fontWeight: '800', color: COLORS.secondary },
  bonusValue: { color: COLORS.primary, fontWeight: 'bold' },
  
  progressBarBg: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary },
  bonusSub: { fontSize: 11, color: COLORS.placeholder, marginTop: 8, textAlign: 'center' },

  // Historique
  historyList: { backgroundColor: COLORS.white, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  transactionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5' 
  },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center' },
  transactionInfo: { flex: 1, marginLeft: 12 },
  transType: { fontWeight: '700', color: COLORS.secondary, fontSize: 14 },
  transDate: { color: COLORS.placeholder, fontSize: 12, marginTop: 2 },
  
  transactionAmount: { alignItems: 'flex-end' },
  amountText: { fontWeight: '900', fontSize: 15 },
  transStatus: { fontSize: 10, color: COLORS.placeholder, marginTop: 2 },

  fullHistoryBtn: { marginTop: 15, marginBottom: 30 }
});