
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface APODData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export default function HomeScreen() {
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Cargar datos de la NASA
    axios.get('https://api.nasa.gov/planetary/apod?api_key=WGOuz25ebcvjp6rSOVq7nNdluhLqPUNXdQz3rn9T')
      .then(response => {
        setApodData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los datos de la NASA:', error);
        setLoading(false);
      });

    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Actualizar hora en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const nombreDia = diasSemana[currentTime.getDay()];

  const QuickStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Ionicons name="planet" size={24} color="#00d4ff" />
        <Text style={styles.statNumber}>8</Text>
        <Text style={styles.statLabel}>Planetas</Text>
      </View>
      <View style={styles.statCard}>
        <Ionicons name="star" size={24} color="#ffd700" />
        <Text style={styles.statNumber}>∞</Text>
        <Text style={styles.statLabel}>Estrellas</Text>
      </View>
      <View style={styles.statCard}>
        <Ionicons name="rocket" size={24} color="#ff6b6b" />
        <Text style={styles.statNumber}>24</Text>
        <Text style={styles.statLabel}>Misiones</Text>
      </View>
    </View>
  );

  const WeatherCard = () => (
    <BlurView intensity={20} tint="dark" style={styles.weatherCard}>
      <View style={styles.weatherHeader}>
        <Ionicons name="partly-sunny" size={24} color="#ffd700" />
        <Text style={styles.weatherTitle}>Condiciones Espaciales</Text>
      </View>
      <View style={styles.weatherInfo}>
        <Text style={styles.weatherText}>Actividad Solar: Baja</Text>
        <Text style={styles.weatherText}>Viento Solar: 400 km/s</Text>
        <Text style={styles.weatherText}>Índice Kp: 2</Text>
      </View>
    </BlurView>
  );

  const openModal = () => {
    console.log('Abriendo modal...');
    setModalVisible(true);
  };

  const closeModal = () => {
    console.log('Cerrando modal...');
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/tierra-espcio.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header con logo y tiempo */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../components/Inicio/logo-codigos-del-cosmos.png')} 
                style={styles.logo} 
              />
              <Text style={styles.logoText}>Códigos del Cosmos</Text>
            </View>
            
            <View style={styles.timeContainer}>
              <Text style={styles.dayText}>{nombreDia}</Text>
              <Text style={styles.timeText}>
                {currentTime.toLocaleTimeString()}
              </Text>
              <Text style={styles.dateText}>
                {currentTime.toLocaleDateString()}
              </Text>
            </View>
          </Animated.View>

          {/* Imagen del día de la NASA */}
          <Animated.View 
            style={[
              styles.apodContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingSpinner} />
                <Text style={styles.loadingText}>Explorando el cosmos...</Text>
              </View>
            ) : apodData && apodData.media_type === 'image' ? (
              <BlurView intensity={15} tint="dark" style={styles.apodCard}>
                <View style={styles.apodImageContainer}>
                  <Image 
                    source={{ uri: apodData.url }} 
                    style={styles.apodImage} 
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.imageOverlay}
                  />
                </View>
                <View style={styles.apodContent}>
                  <Text style={styles.apodDate}>{apodData.date}</Text>
                  <Text style={styles.apodTitle}>{apodData.title}</Text>
                  <Text style={styles.apodExplanation} numberOfLines={3}>
                    {apodData.explanation}
                  </Text>
                  <TouchableOpacity 
                    style={styles.readMoreButton}
                    onPress={openModal}
                  >
                    <Text style={styles.readMoreText}>Leer más</Text>
                    <Ionicons name="arrow-forward" size={16} color="#00d4ff" />
                  </TouchableOpacity>
                </View>
              </BlurView>
            ) : (
              <View style={styles.videoContainer}>
                <Ionicons name="play-circle" size={48} color="#00d4ff" />
                <Text style={styles.videoText}>Video del día disponible</Text>
              </View>
            )}
          </Animated.View>

          {/* Estadísticas rápidas */}
          <Animated.View 
            style={[
              styles.statsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Exploración Espacial</Text>
            <QuickStats />
          </Animated.View>

          {/* Tarjeta del clima espacial */}
          <Animated.View 
            style={[
              styles.weatherSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <WeatherCard />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de información completa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Imagen Astronómica del Día</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {apodData && (
                <>
                  <View style={styles.modalImageContainer}>
                    <Image 
                      source={{ uri: apodData.url }} 
                      style={styles.modalImage} 
                      contentFit="cover"
                    />
                  </View>
                  
                  <View style={styles.modalInfoContainer}>
                    <Text style={styles.modalDate}>{apodData.date}</Text>
                    <Text style={styles.modalImageTitle}>{apodData.title}</Text>
                    <Text style={styles.modalExplanation}>
                      {apodData.explanation}
                    </Text>
                    
                    {apodData.hdurl && (
                      <TouchableOpacity style={styles.hdButton}>
                        <Ionicons name="download" size={16} color="#00d4ff" />
                        <Text style={styles.hdButtonText}>Ver en alta resolución</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  dayText: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: '600',
  },
  timeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#ccc',
    fontSize: 12,
  },
  apodContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#00d4ff',
    borderTopColor: 'transparent',
    borderRadius: 20,
    marginBottom: 15,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  apodCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  apodImageContainer: {
    height: 250,
    position: 'relative',
  },
  apodImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  apodContent: {
    padding: 20,
  },
  apodDate: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  apodTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  apodExplanation: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  videoContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  videoText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    minWidth: 80,
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  weatherSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  weatherCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  weatherInfo: {
    gap: 8,
  },
  weatherText: {
    color: '#ccc',
    fontSize: 14,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.95,
    height: height * 0.85,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.95)',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalImageContainer: {
    height: 300,
    width: '100%',
    margin: 5,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalInfoContainer: {
    padding: 20,
  },
  modalDate: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalImageTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    lineHeight: 28,
  },
  modalExplanation: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  hdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  hdButtonText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
