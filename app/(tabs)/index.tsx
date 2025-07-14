
import { Image } from 'expo-image';
import { View, Button,Text, StyleSheet, SafeAreaView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ImagenDelDia from '@/components/Inicio/imgenActual';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.contenedor}>
        <View style={styles.cuerpo}>
          <ImagenDelDia></ImagenDelDia>
        </View>
         
        {/* <View style={styles.footer}>
          <Text style={styles.text}>Inicio</Text>
          <Text style={styles.text}>Planetas</Text>
          <Text style={styles.text}>Preguntas</Text>
        </View> */}
      </View>
    </SafeAreaView>
    
  )
}

const styles=StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  contenedor:{
    flex:1,
  },
  cuerpo:{
    flex: 1,
    flexDirection:"column",
  },
  // footer:{
  //   flexDirection:"row",
  //   alignItems: 'center',
  //   justifyContent: 'space-around',
  //   position:"absolute",
  //   bottom:0,
  //   left:0,
  //   right:0,
  //   padding: 20,
  //   backgroundColor:'rgba(255, 255, 255, 0.33)',
  // },
  text:{
    fontSize:26,
    fontWeight:"bold",
    color:"white"
  }
})
