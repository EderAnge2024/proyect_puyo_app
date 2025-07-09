import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ImagenDelDia() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const fecha = new Date();

  useEffect(() => {
    axios.get('https://api.nasa.gov/planetary/apod?api_key=WGOuz25ebcvjp6rSOVq7nNdluhLqPUNXdQz3rn9T')
      .then(response => {
        setApodData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los datos de la NASA:', error);
        setLoading(false);
      });
  }, []);

  // Efecto para actualizar la hora en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Limpiar el timer cuando el componente se desmonte
    return () => clearInterval(timer);
  }, []);

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  // Obtener el índice del día y su nombre
  const nombreDia = diasSemana[fecha.getDay()];

  return (
    <ImageBackground
      source={require('@/assets/images/tierra-espcio.jpg')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#00f" />
            <Text style={styles.text}>Cargando imagen del día...</Text>
          </View>
        ) : apodData && apodData.media_type === 'image' ? (
          <>
          <Image source={require('../Inicio/logo-codigos-del-cosmos.png')} style={styles.logo_codigos_del_cosmos} />
            <Text style={styles.texto_logo}>Codigos del Cosmos</Text>
            <Text style={styles.dia}>{nombreDia}</Text>
            <Text style={styles.explanation}>{apodData.date}</Text>
            <View style={styles.continer_nombreImage}>
              <View style={styles.container_image}>
                <Image source={{ uri: apodData.url }} style={styles.image} resizeMode="contain" />
              </View>
              <Text style={styles.title}>{apodData.title}</Text>
            </View>
            <Text style={styles.explanation}>{apodData.explanation}</Text>
          </>
        ) : (
          <View style={styles.centered}>
            <Text style={styles.text}>La APOD de hoy es un video:</Text>
            <Text style={styles.link}>{apodData?.url}</Text>
          </View>
        )}
        <View style={styles.hora}>
          <Text style={styles.hora_text}>
            {currentTime.toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    width:"100%",
    height:"100%"
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // oscurece un poco para mejor lectura
  },

  logo_codigos_del_cosmos:{
    justifyContent:"left",
    position:"absolute",
    zIndex:1000,
    top:0,
    left:0,
    marginTop:40,
    marginLeft:10,
    width:40,
    height:40

  },
  texto_logo:{
    color:"#fff",
    fontSize:20,
    fontWeight:"bold",
    justifyContent:"left",
    position:"absolute",
    zIndex:1000,
    top:0,
    left:0,
    marginTop:50,
    marginLeft:55
  },
  centered: {
    alignItems: 'center',
  },
  dia: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
  },
  continer_nombreImage:{
    width:350,
    height:350,
    justifyContent:"center",
    textAlign:"center",
    borderRadius:30,
    backgroundColor:"rgba(109, 105, 105, 0.3)",
    padding:20
  },
  title: {
    top:7,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  container_image:{
    borderRadius:30,
    width:"100%",
    height:250
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  explanation: {
    marginTop: 20,
    fontSize: 10,
    bottom:10,
    color: '#ccc',
    textAlign: 'justify',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    color: '#1E90FF',
    textAlign: 'center',
  },
  hora_text:{
    color: '#fff',
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  }
});
