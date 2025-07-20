import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, ImageBackground, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

// Pool de 15 preguntas
const preguntasPool = [
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
  },
  {
    id: 6,
    pregunta: "¿Cuál es el planeta más lejano del Sol?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/280px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg",
    opciones: [
      { id: 'a', texto: 'Neptuno', correcta: true },
      { id: 'b', texto: 'Urano', correcta: false },
      { id: 'c', texto: 'Saturno', correcta: false }
    ]
  },
  {
    id: 7,
    pregunta: "¿Qué planeta es conocido por su color azul intenso?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/280px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg",
    opciones: [
      { id: 'a', texto: 'Neptuno', correcta: true },
      { id: 'b', texto: 'Urano', correcta: false },
      { id: 'c', texto: 'Tierra', correcta: false }
    ]
  },
  {
    id: 8,
    pregunta: "¿Cuál es el planeta más pequeño del sistema solar?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/280px-Mercury_in_color_-_Prockter07-edit1.jpg",
    opciones: [
      { id: 'a', texto: 'Marte', correcta: false },
      { id: 'b', texto: 'Mercurio', correcta: true },
      { id: 'c', texto: 'Venus', correcta: false }
    ]
  },
  {
    id: 9,
    pregunta: "¿Qué planeta tiene el día más largo?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/280px-Venus-real_color.jpg",
    opciones: [
      { id: 'a', texto: 'Venus', correcta: true },
      { id: 'b', texto: 'Tierra', correcta: false },
      { id: 'c', texto: 'Júpiter', correcta: false }
    ]
  },
  {
    id: 10,
    pregunta: "¿Cuál es el planeta con más lunas conocidas?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/280px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
    opciones: [
      { id: 'a', texto: 'Júpiter', correcta: true },
      { id: 'b', texto: 'Saturno', correcta: false },
      { id: 'c', texto: 'Urano', correcta: false }
    ]
  },
  {
    id: 11,
    pregunta: "¿Qué planeta tiene la atmósfera más densa?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/280px-Venus-real_color.jpg",
    opciones: [
      { id: 'a', texto: 'Venus', correcta: true },
      { id: 'b', texto: 'Tierra', correcta: false },
      { id: 'c', texto: 'Júpiter', correcta: false }
    ]
  },
  {
    id: 12,
    pregunta: "¿Qué planeta gira en sentido contrario al resto?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/280px-Venus-real_color.jpg",
    opciones: [
      { id: 'a', texto: 'Venus', correcta: true },
      { id: 'b', texto: 'Marte', correcta: false },
      { id: 'c', texto: 'Saturno', correcta: false }
    ]
  },
  {
    id: 13,
    pregunta: "¿Cuál es el planeta más brillante visto desde la Tierra?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/280px-Venus-real_color.jpg",
    opciones: [
      { id: 'a', texto: 'Venus', correcta: true },
      { id: 'b', texto: 'Júpiter', correcta: false },
      { id: 'c', texto: 'Mercurio', correcta: false }
    ]
  },
  {
    id: 14,
    pregunta: "¿Qué planeta tiene la mayor montaña del sistema solar?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/280px-OSIRIS_Mars_true_color.jpg",
    opciones: [
      { id: 'a', texto: 'Marte', correcta: true },
      { id: 'b', texto: 'Tierra', correcta: false },
      { id: 'c', texto: 'Venus', correcta: false }
    ]
  },
  {
    id: 15,
    pregunta: "¿Qué planeta tiene la mayor velocidad de vientos?",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/280px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg",
    opciones: [
      { id: 'a', texto: 'Neptuno', correcta: true },
      { id: 'b', texto: 'Júpiter', correcta: false },
      { id: 'c', texto: 'Saturno', correcta: false }
    ]
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Cuestionario() {
  const [preguntas, setPreguntas] = useState(() => {
    // Selecciona 5 preguntas aleatorias y baraja sus opciones
    const seleccionadas = shuffleArray(preguntasPool).slice(0, 5).map(p => ({
      ...p,
      opciones: shuffleArray(p.opciones)
    }));
    return seleccionadas;
  });
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [puntuacion, setPuntuacion] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correcto' | 'incorrecto' | null>(null);
  const animacionPregunta = useRef(new Animated.Value(0)).current;
  const animacionFeedback = useRef(new Animated.Value(0)).current;
  const [showConfetti, setShowConfetti] = useState(false);

  const preguntaActual = preguntas[indice];

  const seleccionarRespuesta = (opcionId: string) => {
    if (respuestas[preguntaActual.id]) return; // No permitir cambiar respuesta
    setRespuestas(prev => ({ ...prev, [preguntaActual.id]: opcionId }));
    const esCorrecta = preguntaActual.opciones.find(o => o.id === opcionId)?.correcta;
    setFeedback(esCorrecta ? 'correcto' : 'incorrecto');
    Animated.sequence([
      Animated.timing(animacionFeedback, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(animacionFeedback, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  };

  const siguientePregunta = () => {
    if (indice < preguntas.length - 1) {
      Animated.timing(animacionPregunta, {
        toValue: -width,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setIndice(i => i + 1);
        setFeedback(null);
        animacionPregunta.setValue(width);
        Animated.timing(animacionPregunta, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }).start();
      });
    } else {
      calcularPuntuacion();
    }
  };

  const calcularPuntuacion = () => {
    let correctas = 0;
    preguntas.forEach((pregunta) => {
      const respuestaSeleccionada = respuestas[pregunta.id];
      if (respuestaSeleccionada) {
        const opcionSeleccionada = pregunta.opciones.find(op => op.id === respuestaSeleccionada);
        if (opcionSeleccionada && opcionSeleccionada.correcta) {
          correctas++;
        }
      }
    });
    const puntos = Math.round((correctas / preguntas.length) * 100);
    setPuntuacion(puntos);
    setMostrarResultados(true);
    setTimeout(() => setShowConfetti(true), 400); // Lanza confeti después de mostrar resultados
  };

  const reiniciarQuiz = () => {
    const nuevas = shuffleArray(preguntasPool).slice(0, 5).map(p => ({
      ...p,
      opciones: shuffleArray(p.opciones)
    }));
    setPreguntas(nuevas);
    setIndice(0);
    setRespuestas({});
    setPuntuacion(null);
    setMostrarResultados(false);
    setFeedback(null);
    setShowConfetti(false);
    animacionPregunta.setValue(0);
  };

  const getOpcionColor = (opcionId: string) => {
    if (!respuestas[preguntaActual.id]) return 'rgba(74, 85, 104, 0.3)';
    const correcta = preguntaActual.opciones.find(o => o.id === opcionId)?.correcta;
    if (opcionId === respuestas[preguntaActual.id]) {
      return correcta ? '#48bb78' : '#f56565';
    }
    if (correcta) return '#48bb78';
    return 'rgba(74, 85, 104, 0.3)';
  };

  return (
    <ImageBackground
      source={require('../../assets/images/tierra-espcio.jpg')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="game-controller" size={28} color="#00d4ff" />
            <Text style={styles.titulo}>Minijuego: Quiz Espacial</Text>
          </View>
          <View style={styles.headerRight}>
            <Ionicons name="star" size={24} color="#ffd700" />
            {puntuacion !== null && (
              <View style={styles.puntuacionContainer}>
                <Text style={styles.puntuacionTexto}>Puntuación: {puntuacion}</Text>
              </View>
            )}
          </View>
        </View>

        {!mostrarResultados ? (
          <View style={styles.quizContainer}>
            <Text style={styles.progreso}>{indice + 1} / {preguntas.length}</Text>
            <View style={styles.quizCenterer}>
              <Animated.View style={{
                transform: [{ translateX: animacionPregunta }],
                width: '100%',
              }}>
                <BlurView intensity={25} tint="dark" style={styles.preguntaCard}>
                  <Text style={styles.preguntaTitulo}>Pregunta {indice + 1}</Text>
                  <View style={styles.preguntaContent}>
                    <Image 
                      source={{ uri: preguntaActual.imagen }} 
                      style={styles.preguntaImagen} 
                      resizeMode="cover"
                    />
                    <View style={styles.opcionesContainer}>
                      <Text style={styles.preguntaTexto}>{preguntaActual.pregunta}</Text>
                      {preguntaActual.opciones.map((opcion) => (
                        <TouchableOpacity
                          key={opcion.id}
                          style={[
                            styles.opcionButton,
                            { backgroundColor: getOpcionColor(opcion.id) }
                          ]}
                          onPress={() => seleccionarRespuesta(opcion.id)}
                          disabled={!!respuestas[preguntaActual.id]}
                        >
                          <View style={styles.opcionContent}>
                            <View style={[
                              styles.radioButton,
                              respuestas[preguntaActual.id] === opcion.id && styles.radioButtonSelected
                            ]} />
                            <Text style={styles.opcionTexto}>{opcion.texto}</Text>
                            {respuestas[preguntaActual.id] && opcion.correcta && (
                              <Ionicons name="checkmark-circle" size={20} color="#48bb78" />
                            )}
                            {respuestas[preguntaActual.id] === opcion.id && !opcion.correcta && (
                              <Ionicons name="close-circle" size={20} color="#f56565" />
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  {/* Feedback animado */}
                  {feedback && (
                    <Animated.View style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: animacionFeedback,
                    }}>
                      <View style={{
                        backgroundColor: feedback === 'correcto' ? 'rgba(72,187,120,0.85)' : 'rgba(245,101,101,0.85)',
                        borderRadius: 50,
                        padding: 18,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                      }}>
                        <Ionicons name={feedback === 'correcto' ? 'happy' : 'sad'} size={60} color="#fff" />
                      </View>
                    </Animated.View>
                  )}
                </BlurView>
              </Animated.View>
            </View>
            <View style={styles.accionesContainer}>
              {respuestas[preguntaActual.id] && (
                <TouchableOpacity
                  style={[styles.botonAccion, styles.botonHabilitado]}
                  onPress={siguientePregunta}
                >
                  <Text style={styles.botonTexto}>{indice === preguntas.length - 1 ? 'Ver resultados' : 'Siguiente'}</Text>
                  <Ionicons name={indice === preguntas.length - 1 ? 'trophy' : 'arrow-forward'} size={20} color="#00d4ff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.resultadosContainer}>
            <LinearGradient colors={['#00d4ff', '#151718']} style={styles.resultadosCard}>
              <Ionicons name={puntuacion && puntuacion >= 80 ? 'trophy' : 'star'} size={60} color="#ffd700" style={{ marginBottom: 10 }} />
              <Text style={styles.resultadosTitulo}>{puntuacion && puntuacion >= 80 ? '¡Excelente!' : puntuacion && puntuacion >= 50 ? '¡Bien hecho!' : '¡Sigue practicando!'}</Text>
              <Text style={styles.resultadosPuntos}>Puntuación: {puntuacion}/100</Text>
              <TouchableOpacity style={[styles.botonAccion, styles.botonReiniciar]} onPress={reiniciarQuiz}>
                <Text style={styles.botonTexto}>Jugar de nuevo</Text>
                <Ionicons name="refresh" size={20} color="#ffd700" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </LinearGradient>
            {showConfetti && (
              <ConfettiCannon
                count={120}
                origin={{ x: width / 2, y: height * 0.3 }}
                fadeOut
                fallSpeed={2500}
                explosionSpeed={500}
                autoStart
              />
            )}
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
    marginLeft: 10,
  },
  puntuacionContainer: {
    marginLeft: 10,
    backgroundColor: 'rgba(0,212,255,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  puntuacionTexto: {
    color: '#00d4ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quizContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizCenterer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  progreso: {
    color: '#00d4ff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'center',
  },
  preguntaCard: {
    marginBottom: 25,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 0,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: width - 40,
    alignSelf: 'center',
  },
  preguntaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d4ff',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  preguntaContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    gap: 10,
  },
  preguntaImagen: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,212,255,0.3)',
  },
  opcionesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  preguntaTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  opcionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,212,255,0.15)',
  },
  opcionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#00d4ff',
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  radioButtonSelected: {
    backgroundColor: '#00d4ff',
    borderColor: '#fff',
  },
  opcionTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  accionesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    paddingBottom: 80,
  },
  botonAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginHorizontal: 10,
    backgroundColor: 'rgba(0,212,255,0.15)',
    borderWidth: 2,
    borderColor: '#00d4ff',
    elevation: 4,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  botonHabilitado: {
    opacity: 1,
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  botonReiniciar: {
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderColor: '#ffd700',
  },
  resultadosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  resultadosCard: {
    width: width - 60,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  resultadosTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultadosPuntos: {
    fontSize: 18,
    color: '#00d4ff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});