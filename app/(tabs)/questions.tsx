import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, ImageBackground, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Datos de las preguntas del cuestionario
const preguntasData = [
  {
    id: 1,
    pregunta: "¿Cuál es el planeta más cercano al Sol?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/280px-Mercury_in_color_-_Prockter07-edit1.jpg",
    opciones: [
      { id: 'a', texto: 'Venus', correcta: false },
      { id: 'b', texto: 'Mercurio', correcta: true },
      { id: 'c', texto: 'Marte', correcta: false }
    ]
  },
  {
    id: 2,
    pregunta: "¿Cuál es el planeta más grande del sistema solar?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/280px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
    opciones: [
      { id: 'a', texto: 'Saturno', correcta: false },
      { id: 'b', texto: 'Júpiter', correcta: true },
      { id: 'c', texto: 'Neptuno', correcta: false }
    ]
  },
  {
    id: 3,
    pregunta: "¿Qué planeta es conocido como 'El planeta rojo'?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/280px-OSIRIS_Mars_true_color.jpg",
    opciones: [
      { id: 'a', texto: 'Venus', correcta: false },
      { id: 'b', texto: 'Marte', correcta: true },
      { id: 'c', texto: 'Júpiter', correcta: false }
    ]
  },
  {
    id: 4,
    pregunta: "¿Cuál es el planeta más caliente del sistema solar?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/280px-Venus-real_color.jpg",
    opciones: [
      { id: 'a', texto: 'Mercurio', correcta: false },
      { id: 'b', texto: 'Venus', correcta: true },
      { id: 'c', texto: 'Marte', correcta: false }
    ]
  },
  {
    id: 5,
    pregunta: "¿Qué planeta tiene los anillos más visibles?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/300px-Saturn_during_Equinox.jpg",
    opciones: [
      { id: 'a', texto: 'Júpiter', correcta: false },
      { id: 'b', texto: 'Saturno', correcta: true },
      { id: 'c', texto: 'Urano', correcta: false }
    ]
  }
];

export default function Cuestionario({ navigation }) {
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState({});
  const [puntuacion, setPuntuacion] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const seleccionarRespuesta = (preguntaId, opcionId) => {
    setRespuestasSeleccionadas(prev => ({
      ...prev,
      [preguntaId]: opcionId
    }));
  };

  const calcularPuntuacion = () => {
    let correctas = 0;
    preguntasData.forEach(pregunta => {
      const respuestaSeleccionada = respuestasSeleccionadas[pregunta.id];
      if (respuestaSeleccionada) {
        const opcionSeleccionada = pregunta.opciones.find(op => op.id === respuestaSeleccionada);
        if (opcionSeleccionada && opcionSeleccionada.correcta) {
          correctas++;
        }
      }
    });
    
    const puntos = Math.round((correctas / preguntasData.length) * 100);
    setPuntuacion(puntos);
    setMostrarResultados(true);
    
    Alert.alert(
      'Quiz Completado',
      `Tu puntuación: ${puntos}/100\nRespuestas correctas: ${correctas}/${preguntasData.length}`,
      [{ text: 'Ver Resultados', onPress: () => {} }]
    );
  };

  const reiniciarQuiz = () => {
    setRespuestasSeleccionadas({});
    setPuntuacion(null);
    setMostrarResultados(false);
  };

  const navegarA = (pantalla) => {
    if (navigation) {
      navigation.navigate(pantalla);
    }
  };

  const getOpcionColor = (pregunta, opcion) => {
    if (!mostrarResultados) {
      return respuestasSeleccionadas[pregunta.id] === opcion.id 
        ? '#4a5568' 
        : 'rgba(74, 85, 104, 0.3)';
    }
    
    if (opcion.correcta) {
      return '#48bb78'; // Verde para correcta
    }
    
    if (respuestasSeleccionadas[pregunta.id] === opcion.id && !opcion.correcta) {
      return '#f56565'; // Rojo para incorrecta seleccionada
    }
    
    return 'rgba(74, 85, 104, 0.3)';
  };

  return (
    <ImageBackground
      source={require('../../assets/images/tierra-espcio.jpg')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="bulb" size={24} color="#ffd700" />
            <Text style={styles.titulo}>Preguntas</Text>
          </View>
          <View style={styles.headerRight}>
            <Ionicons name="list" size={24} color="#fff" />
            {puntuacion !== null && (
              <View style={styles.puntuacionContainer}>
                <Text style={styles.puntuacionTexto}>Puntuación: {puntuacion}</Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView style={styles.quizContainer}>
          {preguntasData.map((pregunta, index) => (
            <View key={pregunta.id} style={styles.preguntaCard}>
              <Text style={styles.preguntaTitulo}>Pregunta {index + 1}?</Text>
              
              <View style={styles.preguntaContent}>
                <Image 
                  source={{ uri: pregunta.imagen }} 
                  style={styles.preguntaImagen} 
                />
                <View style={styles.opcionesContainer}>
                  <Text style={styles.preguntaTexto}>{pregunta.pregunta}</Text>
                  {pregunta.opciones.map((opcion) => (
                    <TouchableOpacity
                      key={opcion.id}
                      style={[
                        styles.opcionButton,
                        { backgroundColor: getOpcionColor(pregunta, opcion) }
                      ]}
                      onPress={() => !mostrarResultados && seleccionarRespuesta(pregunta.id, opcion.id)}
                      disabled={mostrarResultados}
                    >
                      <View style={styles.opcionContent}>
                        <View style={[
                          styles.radioButton,
                          respuestasSeleccionadas[pregunta.id] === opcion.id && styles.radioButtonSelected
                        ]} />
                        <Text style={styles.opcionTexto}>{opcion.texto}</Text>
                        {mostrarResultados && opcion.correcta && (
                          <Ionicons name="checkmark-circle" size={20} color="#48bb78" />
                        )}
                        {mostrarResultados && respuestasSeleccionadas[pregunta.id] === opcion.id && !opcion.correcta && (
                          <Ionicons name="close-circle" size={20} color="#f56565" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Botones de acción */}
        <View style={styles.accionesContainer}>
          {!mostrarResultados ? (
            <TouchableOpacity
              style={[
                styles.botonAccion,
                Object.keys(respuestasSeleccionadas).length === preguntasData.length 
                  ? styles.botonHabilitado 
                  : styles.botonDeshabilitado
              ]}
              onPress={calcularPuntuacion}
              disabled={Object.keys(respuestasSeleccionadas).length !== preguntasData.length}
            >
              <Text style={styles.botonTexto}>Finalizar Quiz</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.botonAccion, styles.botonReiniciar]}
              onPress={reiniciarQuiz}
            >
              <Text style={styles.botonTexto}>Reiniciar Quiz</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(39, 39, 40, 0)',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  puntuacionContainer: {
    marginLeft: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  puntuacionTexto: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quizContainer: {
    flex: 1,
    padding: 15,
  },
  preguntaCard: {
    backgroundColor: 'rgba(42, 42, 64, 0.9)',
    borderRadius: 15,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  preguntaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  preguntaContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  preguntaImagen: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  opcionesContainer: {
    flex: 1,
  },
  preguntaTexto: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '500',
  },
  opcionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  opcionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  opcionTexto: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  accionesContainer: {
    padding: 15,
  },
  botonAccion: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  botonHabilitado: {
    backgroundColor: '#4a90e2',
  },
  botonDeshabilitado: {
    backgroundColor: 'rgba(74, 144, 226, 0.5)',
  },
  botonReiniciar: {
    backgroundColor: '#48bb78',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  navButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  navText: {
    color: '#ccc',
    fontSize: 16,
  },
  navTextActive: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
});