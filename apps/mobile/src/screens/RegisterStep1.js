// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// // Tes composants
// import Header from '../components/Header';
// import ProgressBar from '../components/ProgressBar';
// import GoMileInput from '../components/GoMileInput';
// import GoMileButton from '../components/GoMileButton';
// import SmartTouch from '../components/SmartTouch';
// import { COLORS, SIZES } from '../constants/theme';
// import { useRegistrationStore } from '../store/useRegistrationStore';

// export default function RegisterStep1({ navigation }) {
//   const { updateField, firstName, lastName, email, phone, birthDate, gender } = useRegistrationStore();
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   useEffect(() => {
//     const keyboardListener = Keyboard.addListener('keyboardDidShow', () => setShowDatePicker(false));
//     return () => keyboardListener.remove();
//   }, []);

//   const handleDateChange = (event, selectedDate) => {
//     if (Platform.OS === 'android') setShowDatePicker(false);
//     if (selectedDate) {
//       updateField('birthDate', selectedDate.toISOString().split('T')[0]);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setShowDatePicker(false); }}>
//       <View style={styles.container}>
//         <Header title="IDENTITÉ" />
//         <ProgressBar progress={25} />

//         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
//           <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
//             <Text style={styles.title}>Informations personnelles (1/4)</Text>

//             <GoMileInput label="Prénom" value={firstName} onChangeText={(v) => updateField('firstName', v)} placeholder="Jean" onFocus={() => setShowDatePicker(false)} />
//             <GoMileInput label="Nom" value={lastName} onChangeText={(v) => updateField('lastName', v)} placeholder="Dupont" onFocus={() => setShowDatePicker(false)} />

//             <Text style={styles.label}>Date de naissance</Text>
//             <TouchableOpacity style={styles.dateInput} onPress={() => { Keyboard.dismiss(); setShowDatePicker(!showDatePicker); }}>
//               <Text style={{ color: birthDate ? COLORS.secondary : COLORS.placeholder }}>{birthDate || "Sélectionner une date"}</Text>
//             </TouchableOpacity>

//             {showDatePicker && (
//               <DateTimePicker 
//                 value={birthDate ? new Date(birthDate) : new Date(2000, 0, 1)} 
//                 mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                 onValueChange={handleDateChange} 
//               />
//             )}

//             <Text style={styles.label}>Genre</Text>
//             <View style={styles.genderContainer}>
//               {['Homme', 'Femme', 'Autre'].map((item) => (
//                 <SmartTouch 
//                   key={item} 
//                   setShowDatePicker={setShowDatePicker}
//                   style={[styles.genderButton, gender === item && { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary }]}
//                   onPress={() => updateField('gender', item)}
//                 >
//                   <Text style={{ color: gender === item ? COLORS.white : COLORS.placeholder, fontWeight: '600' }}>{item}</Text>
//                 </SmartTouch>
//               ))}
//             </View>

//             <GoMileInput label="Email professionnel" value={email} onChangeText={(v) => updateField('email', v)} keyboardType="email-address" placeholder="nom@exemple.com" onFocus={() => setShowDatePicker(false)} />
//             <GoMileInput label="Numéro de téléphone" value={phone} onChangeText={(v) => updateField('phone', v)} keyboardType="phone-pad" placeholder="06 12 34 56 78" onFocus={() => setShowDatePicker(false)} />

//             <GoMileButton 
//               title="CONTINUER" 
//               type="secondary" 
//               onPress={() => navigation.navigate('RegisterStep2')} 
//               style={{ marginTop: 20 }}
//             />
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.background },
//   scrollContent: { padding: SIZES.padding, paddingBottom: 50 },
//   title: { fontSize: 20, fontWeight: '800', color: COLORS.secondary, marginBottom: 10 },
//   label: { color: COLORS.secondary, fontWeight: '600', marginBottom: 5, marginTop: 15 },
//   dateInput: { borderWidth: 1, borderColor: COLORS.border, padding: 15, borderRadius: 10, backgroundColor: COLORS.white },
//   genderContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
//   genderButton: { flex: 1, padding: 12, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, alignItems: 'center', marginHorizontal: 2, backgroundColor: COLORS.white },
// });

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Import de tes briques factorisées
import FormLayout from '../components/FormLayout';
import SectionTitle from '../components/SectionTitle';
import GoMileInput from '../components/GoMileInput';
import SmartTouch from '../components/SmartTouch';
import FormButtons from '../components/FormButtons'; // Le nouveau composant pour les boutons alignés

// Config et Store
import { COLORS } from '../constants/theme';
import { useRegistrationStore } from '../store/useRegistrationStore';

export default function RegisterStep1({ navigation }) {
  const { updateField, firstName, lastName, email, phone, birthDate, gender } = useRegistrationStore();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Gestion de la fermeture automatique
  useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardDidShow', () => setShowDatePicker(false));
    return () => keyboardListener.remove();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      updateField('birthDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  return (
    <FormLayout title="IDENTITÉ" progress={25}>
      <SectionTitle>Informations personnelles (1/4)</SectionTitle>

      {/* INPUTS FACTORISÉS */}
      <GoMileInput 
        label="Prénom" value={firstName} 
        onChangeText={(v) => updateField('firstName', v)} 
        placeholder="Jean" 
        onFocus={() => setShowDatePicker(false)} 
      />

      <GoMileInput 
        label="Nom" value={lastName} 
        onChangeText={(v) => updateField('lastName', v)} 
        placeholder="Dupont" 
        onFocus={() => setShowDatePicker(false)} 
      />

      {/* SÉLECTEUR DE DATE (Spécifique à cette page) */}
      <Text style={styles.label}>Date de naissance</Text>
      <TouchableOpacity 
        style={styles.dateInput} 
        onPress={() => { Keyboard.dismiss(); setShowDatePicker(!showDatePicker); }}
      >
        <Text style={{ color: birthDate ? COLORS.secondary : COLORS.placeholder }}>
          {birthDate || "Sélectionner une date"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker 
          value={birthDate ? new Date(birthDate) : new Date(2000, 0, 1)} 
          mode="date" 
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onValueChange={handleDateChange} 
        />
      )}

      {/* SÉLECTEUR DE GENRE */}
      <Text style={styles.label}>Genre</Text>
      <View style={styles.genderContainer}>
        {['Homme', 'Femme', 'Autre'].map((item) => (
          <SmartTouch 
            key={item} 
            setShowDatePicker={setShowDatePicker}
            style={[
              styles.genderButton, 
              gender === item && { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary }
            ]}
            onPress={() => updateField('gender', item)}
          >
            <Text style={{ color: gender === item ? COLORS.white : COLORS.placeholder, fontWeight: '600' }}>
              {item}
            </Text>
          </SmartTouch>
        ))}
      </View>

      <GoMileInput 
        label="Email professionnel" value={email} 
        onChangeText={(v) => updateField('email', v)} 
        keyboardType="email-address" 
        placeholder="nom@exemple.com" 
        onFocus={() => setShowDatePicker(false)} 
      />

      <GoMileInput 
        label="Numéro de téléphone" value={phone} 
        onChangeText={(v) => updateField('phone', v)} 
        keyboardType="phone-pad" 
        placeholder="06 12 34 56 78" 
        onFocus={() => setShowDatePicker(false)} 
      />

      {/* NOUVEAU COMPOSANT DE BOUTONS (RETOUR + CONTINUER) */}
      <FormButtons 
        onBack={() => navigation.goBack()} // <--- Déclenche l'animation de retour arrière
        onNext={() => navigation.navigate('RegisterStep2')} 
      />

              {/* <View style={styles.buttonRow}>
              <GoMileButton 
                title="RETOUR" type="secondary" outline style={{ flex: 1 }}
                onPress={() => navigation.goBack()} 
              />
              <GoMileButton 
                title="CONTINUER" type="secondary" style={{ flex: 2 }}
                onPress={() => navigation.navigate('RegisterStep2')}
                disabled={!transportType}
              />
            </View> */}
      
    </FormLayout>
  );
}

const styles = StyleSheet.create({
  label: { color: COLORS.secondary, fontWeight: '600', marginBottom: 5, marginTop: 15 },
  dateInput: { 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    padding: 15, 
    borderRadius: 10, 
    backgroundColor: COLORS.white 
  },
  genderContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  genderButton: { 
    flex: 1, 
    padding: 10, 
    marginBottom : 20,
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginHorizontal: 2, 
    backgroundColor: COLORS.white 
  },
});