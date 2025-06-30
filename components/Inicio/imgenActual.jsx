import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

export default function ImagenDelDia() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
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
  centered: {
    alignItems: 'center',
  },
  dia: {
    fontSize: 30,
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
});
