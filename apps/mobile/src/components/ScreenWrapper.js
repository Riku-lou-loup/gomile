import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

// Import de l'image de fond
import backgroundImage from '../../assets/background_login.png';

const ScreenWrapper = ({ children, style }) => {
  return (
    <View style={styles.container}>
      {/* On utilise l'image en fond absolu pour qu'elle couvre tout, 
         même derrière le header si besoin 
      */}
      <ImageBackground 
        source={backgroundImage} 
        style={styles.background} 
        resizeMode="cover"
      >
        {/* ICI : On retire SafeAreaView. 
           C'est ton composant Header qui gérera l'encoche.
        */}
        <View style={[styles.content, style]}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper;