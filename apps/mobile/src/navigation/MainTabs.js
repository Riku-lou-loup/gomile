import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

// Import de tes constantes de thème
import { COLORS } from '../constants/theme';

import MissionsScreen from '../screens/MissionsScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TableauDeBord from '../screens/TableauDeBord';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.secondary, // Utilisation du Bleu GoMile
        tabBarInactiveTintColor: COLORS.placeholder, // Utilisation du Gris factorisé
        tabBarStyle: {
          height: 85,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopWidth: 0,
          backgroundColor: COLORS.white, // Blanc du thème
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          // Mapping des icônes
          if (route.name === 'TableauDeBord') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Missions') {
            iconName = focused ? 'package-variant' : 'package-variant-closed';
          } else if (route.name === 'Portefeuille') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="TableauDeBord" 
        component={TableauDeBord} 
        options={{ tabBarLabel: 'Dashboard' }} 
      />
      <Tab.Screen 
        name="Missions" 
        component={MissionsScreen} 
        options={{ tabBarLabel: 'Missions' }}
      />
      <Tab.Screen 
        name="Portefeuille" 
        component={WalletScreen} 
        options={{ tabBarLabel: 'Gains' }}
      />
      {/* Route utilisée pour la navigation depuis MissionsScreen */}
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}