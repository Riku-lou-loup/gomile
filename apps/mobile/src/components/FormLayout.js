// // import React from 'react';
// // import { 
// //   View, 
// //   ScrollView, 
// //   KeyboardAvoidingView, 
// //   Platform, 
// //   TouchableWithoutFeedback, 
// //   Keyboard, 
// //   StyleSheet 
// // } from 'react-native';
// // import Header from './Header';
// // import ProgressBar from './ProgressBar';
// // import { COLORS, SIZES } from '../constants/theme';

// // export default function FormLayout({ title, progress, children, footer }) {
// //   return (
// //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
// //       <View style={styles.container}>
// //         <Header title={title} />
// //         {progress !== undefined && <ProgressBar progress={progress} />}
        
// //         <KeyboardAvoidingView 
// //           behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
// //           style={{ flex: 1 }}
// //         >
// //           <ScrollView 
// //             contentContainerStyle={styles.scrollContent}
// //             keyboardShouldPersistTaps="handled"
// //           >
// //             {children}
// //             {footer && <View style={styles.footer}>{footer}</View>}
// //           </ScrollView>
// //         </KeyboardAvoidingView>
// //       </View>
// //     </TouchableWithoutFeedback>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: COLORS.background },
// //   scrollContent: { padding: SIZES.padding, paddingBottom: 40 },
// //   footer: { marginTop: 30 }
// // });


// import React from 'react';
// import { 
//   View, 
//   ScrollView, 
//   KeyboardAvoidingView, 
//   Platform, 
//   StyleSheet 
// } from 'react-native';
// import Header from './Header';
// import ProgressBar from './ProgressBar';
// import { COLORS, SIZES } from '../constants/theme';

// export default function FormLayout({ title, progress, children }) {
//   return (
//     <View style={styles.container}>
//       <Header title={title} />
//       {progress !== undefined && <ProgressBar progress={progress} />}
      
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
//         style={{ flex: 1 }}
//       >
//         {/* La ScrollView permet de faire défiler tout le contenu, boutons inclus */}
//         <ScrollView 
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent} // Important pour le padding interne
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {children}
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: COLORS.background 
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: { 
//     padding: SIZES.padding,
//     paddingBottom: 60, // On ajoute de l'espace en bas pour ne pas coller au bord
//   },
// });


import React from 'react';
import { 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet 
} from 'react-native';
import Header from './Header';
import { COLORS, SIZES } from '../constants/theme';

export default function FormLayout({ title, children, variant = 'form' }) {
  const isLogin = variant === 'login';

  return (
    <View style={styles.container}>
      <Header title={title} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            isLogin && styles.loginCenter // Applique le centrage spécifique
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
          {/* Le spacer factorisé : il remonte la carte de 10% sur le login */}
          {isLogin && <View style={{ height: 80 }} />} 
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { 
    padding: SIZES.padding,
    flexGrow: 1, // Permet d'utiliser le centrage vertical
  },
  loginCenter: {
    justifyContent: 'center', // Centre la carte
  }
});