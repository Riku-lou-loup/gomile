import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { login } from '../../lib/auth-client';
import Header from '../components/Header';
import GoMileInput from '../components/GoMileInput';
import GoMileButton from '../components/GoMileButton';
import { COLORS } from '../constants/theme';
import ScreenWrapper from '../components/ScreenWrapper';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!identifier || !password) return Alert.alert("Erreur", "Remplissez tout.");
    setIsLoading(true);
    try {
      await login({ email: identifier, password: password });
      navigation.replace('MainApp');
    } catch (error) { Alert.alert("Erreur", error.message); }
    finally { setIsLoading(false); }
  };

  // return (
  //   <SafeAreaProvider style={{ flex: 1, backgroundColor: COLORS.background }}>
  //     <Header title="BIENVENUE" />
  //     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
  //       <View style={styles.card}>
  //         <GoMileInput label="Email ou Téléphone" value={identifier} onChangeText={setIdentifier} placeholder="votre@email.com" />
  //         <GoMileInput label="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
          
  //         <GoMileButton title="SE CONNECTER" type="secondary" onPress={handleLogin} loading={isLoading} />
          
  //         <View style={styles.divider} />
          
  //         <GoMileButton title="DEVENIR LIVREUR" type="primary" outline onPress={() => navigation.navigate('RegisterStep1')} />
  //       </View>
  //     </KeyboardAvoidingView>
  //   </SafeAreaProvider>
  // );
  return (
    // 2. On remplace SafeAreaProvider par notre ScreenWrapper
    <ScreenWrapper>
      {/* Le Header reste en haut */}
      <Header title="BIENVENUE" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.content}
      >
        <View style={styles.card}>
          <GoMileInput 
            label="Email ou Téléphone" 
            value={identifier} 
            onChangeText={setIdentifier} 
            placeholder="votre@email.com" 
          />
          <GoMileInput 
            label="Mot de passe" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            placeholder="••••••••" 
          />
          
          <GoMileButton 
            title="SE CONNECTER" 
            type="secondary" 
            onPress={handleLogin} 
            loading={isLoading} 
          />
          
          {/* Nouveau séparateur avec texte "OU" */}
          <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
          </View>
          
          <GoMileButton 
            title="DEVENIR LIVREUR" 
            type="primary" 
            outline 
            onPress={() => navigation.navigate('RegisterStep1')} 
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );

}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFF', padding: 25, borderRadius: 20, elevation: 5 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },
  dividerContainer: {flexDirection: 'row', alignItems: 'center', marginVertical: 20, },
  dividerLine: {flex: 1, height: 1,backgroundColor: COLORS.border,},
  dividerText: {paddingHorizontal: 10, color: COLORS.textLight || '#888', fontSize: 14, fontWeight: '600',},
});