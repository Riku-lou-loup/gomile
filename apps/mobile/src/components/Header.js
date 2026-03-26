import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; // <--- ET ICI ENCORE
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

export default function Header({ title }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: COLORS.primary }]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { justifyContent: 'center', alignItems: 'center', paddingBottom: 15, elevation: 4 },
  title: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
});