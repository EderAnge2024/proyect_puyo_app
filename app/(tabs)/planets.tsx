import SolarSystem from '@/components/simulacionRotacion/simuRotacion';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
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

interface Planeta {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  nasaInfo?: string;
  nasaImages?: string[];
}

interface Opcion {
  id: number;
  titulo: string;
  accion: () => void;
  icon: string;
  color: string;
}

interface ObjetoCeleste {
  id: number;
  tipo: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  nasaInfo?: string;
  nasaImages?: string[];
}

// Datos iniciales de los planetas
const planetasData: Planeta[] = [
  { id: 1, nombre: 'Mercurio', descripcion: 'El planeta más cercano al Sol', imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/280px-Mercury_in_color_-_Prockter07-edit1.jpg', nasaImages: [] },
  { id: 2, nombre: 'Venus', descripcion: 'El planeta más caliente del sistema solar', imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/280px-Venus-real_color.jpg', nasaImages: [] },
  { id: 3, nombre: 'Tierra', descripcion: 'Nuestro hogar', imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Blue_Marble_%28remastered%29.jpg/280px-The_Blue_Marble_%28remastered%29.jpg', nasaImages: [] },
  { id: 4, nombre: 'Marte', descripcion: 'El planeta rojo', imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/280px-OSIRIS_Mars_true_color.jpg', nasaImages: [] },
  { id: 5, nombre: 'Júpiter', descripcion: 'El planeta más grande del sistema solar', imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/280px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg', nasaImages: [] },
  { id: 6, nombre: 'Saturno', descripcion: 'Famoso por sus anillos', imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/300px-Saturn_during_Equinox.jpg', nasaImages: [] },
  { id: 7, nombre: 'Urano', descripcion: 'El planeta inclinado', imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/280px-Uranus2.jpg', nasaImages: [] },
  { id: 8, nombre: 'Neptuno', descripcion: 'El planeta más ventoso', imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/280px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg', nasaImages: [] },
];

// Datos científicos de cada planeta
const planetasInfo = {
  'Mercurio': { diametro: '4,879 km', distanciaSol: '57.9 millones km', periodoOrbital: '88 días', temperatura: '-173°C a 427°C', lunas: '0' },
  'Venus': { diametro: '12,104 km', distanciaSol: '108.2 millones km', periodoOrbital: '225 días', temperatura: '462°C', lunas: '0' },
  'Tierra': { diametro: '12,742 km', distanciaSol: '149.6 millones km', periodoOrbital: '365.25 días', temperatura: '-88°C a 58°C', lunas: '1' },
  'Marte': { diametro: '6,779 km', distanciaSol: '227.9 millones km', periodoOrbital: '687 días', temperatura: '-153°C a 20°C', lunas: '2' },
  'Júpiter': { diametro: '139,820 km', distanciaSol: '778.5 millones km', periodoOrbital: '11.86 años', temperatura: '-108°C', lunas: '79+' },
  'Saturno': { diametro: '116,460 km', distanciaSol: '1,434 millones km', periodoOrbital: '29.46 años', temperatura: '-138°C', lunas: '82+' },
  'Urano': { diametro: '50,724 km', distanciaSol: '2,871 millones km', periodoOrbital: '84.01 años', temperatura: '-195°C', lunas: '27' },
  'Neptuno': { diametro: '49,244 km', distanciaSol: '4,495 millones km', periodoOrbital: '164.8 años', temperatura: '-201°C', lunas: '14' },
};

export default function PlanetsScreen() {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [planetaSeleccionado, setPlanetaSeleccionado] = useState<Planeta | null>(null);
  const [objetoSeleccionado, setObjetoSeleccionado] = useState<ObjetoCeleste | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [objetoModalVisible, setObjetoModalVisible] = useState(false);
  const [planetas, setPlanetas] = useState<Planeta[]>(planetasData);
  const [loading, setLoading] = useState(true);
  const [objetoLoading, setObjetoLoading] = useState(false);
  const [nasaImages, setNasaImages] = useState<{[key: string]: string[]}>({});
  const [objetosData, setObjetosData] = useState<ObjetoCeleste[]>([]);
  const [tipoObjetoSeleccionado, setTipoObjetoSeleccionado] = useState<string | null>(null);
  const [mostrarSistemaRotacion, setMostrarSistemaRotacion] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    const fetchNasaData = async () => {
      try {
        setLoading(true);
        const planetNames = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
        const planetNamesSpanish = ['Mercurio', 'Venus', 'Tierra', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno'];
        
        const imageResults: {[key: string]: string[]} = {};
        
        for (let i = 0; i < planetNames.length; i++) {
          const planetName = planetNames[i];
          const planetNameSpanish = planetNamesSpanish[i];
          
          const response = await axios.get(
            `https://images-api.nasa.gov/search?q=${planetName}&media_type=image`
          );
          
          if (response.data && response.data.collection && response.data.collection.items) {
            const images = response.data.collection.items
              .slice(0, 5)
              .map((item: any) => {
                if (item.links && item.links.length > 0) {
                  return item.links[0].href;
                }
                return null;
              })
              .filter((url: string | null) => url !== null);
            
            imageResults[planetNameSpanish] = images;
          }
        }
        
        setNasaImages(imageResults);
        
        const updatedPlanetas = planetas.map(planeta => ({
          ...planeta,
          nasaImages: imageResults[planeta.nombre] || []
        }));
        
        setPlanetas(updatedPlanetas);
        setLoading(false);

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
      } catch (error) {
        console.error('Error al obtener los datos de la NASA:', error);
        setLoading(false);
      }
    };
    
    fetchNasaData();
  }, []);

  const fetchObjetosCelestes = async (tipo: string) => {
    setObjetoLoading(true);
    setTipoObjetoSeleccionado(tipo);
    setMostrarSistemaRotacion(false);
    
    if (tipo === 'Sistema Solar') {
      setMostrarSistemaRotacion(true);
      setObjetoLoading(false);
      return;
    }
    
    try {
      let searchQuery = '';
      
      switch(tipo) {
        case 'Meteoritos':
          searchQuery = 'meteorite';
          break;
        case 'Estrellas':
          searchQuery = 'star';
          break;
        case 'Cometas':
          searchQuery = 'comet';
          break;
        case 'Satélites':
          searchQuery = 'satellite';
          break;
        case 'Lunas':
          searchQuery = 'moon';
          break;
        default:
          searchQuery = 'space';
      }
      
      const response = await axios.get(
        `https://images-api.nasa.gov/search?q=${searchQuery}&media_type=image`
      );
      
      if (response.data && response.data.collection && response.data.collection.items) {
        const items = response.data.collection.items.slice(0, 10);
        const objetos: ObjetoCeleste[] = items.map((item: any, index: number) => {
          const title = item.data && item.data[0] && item.data[0].title ? item.data[0].title : `${tipo} ${index + 1}`;
          const description = item.data && item.data[0] && item.data[0].description ? item.data[0].description : 'Sin descripción disponible';
          const imageUrl = item.links && item.links[0] ? item.links[0].href : '';
          
          return {
            id: index + 1,
            tipo: tipo,
            nombre: title,
            descripcion: description,
            imagen: imageUrl,
            nasaInfo: item.data && item.data[0] ? JSON.stringify(item.data[0]) : '',
            nasaImages: [imageUrl]
          };
        });
        
        setObjetosData(objetos);
      }
    } catch (error) {
      console.error(`Error al obtener datos de ${tipo}:`, error);
    } finally {
      setObjetoLoading(false);
    }
  };

  const toggleSideMenu = () => {
    setSideMenuVisible(!sideMenuVisible);
  };

  const seleccionarPlaneta = (planeta: Planeta) => {
    setPlanetaSeleccionado(planeta);
    setModalVisible(true);
  };

  const seleccionarObjeto = (objeto: ObjetoCeleste) => {
    setObjetoSeleccionado(objeto);
    setObjetoModalVisible(true);
    setSideMenuVisible(false);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const cerrarObjetoModal = () => {
    setObjetoModalVisible(false);
  };

  const opcionesCelestes: Opcion[] = [
    { id: 1, titulo: 'Sistema Solar', accion: () => { fetchObjetosCelestes('Sistema Solar'); setSideMenuVisible(false); }, icon: 'planet', color: '#00d4ff' },
    { id: 2, titulo: 'Meteoritos', accion: () => { fetchObjetosCelestes('Meteoritos'); setSideMenuVisible(false); }, icon: 'flash', color: '#ffd700' },
    { id: 3, titulo: 'Estrellas', accion: () => { fetchObjetosCelestes('Estrellas'); setSideMenuVisible(false); }, icon: 'star', color: '#ff6b6b' },
    { id: 4, titulo: 'Cometas', accion: () => { fetchObjetosCelestes('Cometas'); setSideMenuVisible(false); }, icon: 'navigate', color: '#51cf66' },
    { id: 5, titulo: 'Satélites', accion: () => { fetchObjetosCelestes('Satélites'); setSideMenuVisible(false); }, icon: 'radio', color: '#ae8fff' },
    { id: 6, titulo: 'Lunas', accion: () => { fetchObjetosCelestes('Lunas'); setSideMenuVisible(false); }, icon: 'moon', color: '#ffa726' },
  ];

  const PlanetCard = ({ planeta }: { planeta: Planeta }) => (
    <Animated.View
      style={[
        styles.planetCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.planetCardTouchable}
        onPress={() => seleccionarPlaneta(planeta)}
      >
        <View style={styles.planetImageContainer}>
          <Image 
            source={{ uri: planeta.imagen }} 
            style={styles.planetImage} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.planetImageOverlay}
          />
        </View>
        <View style={styles.planetInfo}>
          <Text style={styles.planetName}>{planeta.nombre}</Text>
          <Text style={styles.planetDescription} numberOfLines={2}>
            {planeta.descripcion}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const ObjectCard = ({ objeto }: { objeto: ObjetoCeleste }) => (
    <Animated.View
      style={[
        styles.objectCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.objectCardTouchable}
        onPress={() => seleccionarObjeto(objeto)}
      >
        <View style={styles.objectImageContainer}>
          <Image 
            source={{ uri: objeto.imagen }} 
            style={styles.objectImage} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.objectImageOverlay}
          />
        </View>
        <View style={styles.objectInfo}>
          <Text style={styles.objectName}>{objeto.nombre}</Text>
          <Text style={styles.objectDescription} numberOfLines={2}>
            {objeto.descripcion}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/tierra-espcio.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerLeft}>
            {tipoObjetoSeleccionado && (
              <TouchableOpacity 
                onPress={() => setTipoObjetoSeleccionado(null)} 
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            <View style={styles.titleContainer}>
              <Ionicons name="planet" size={24} color="#00d4ff" />
              <Text style={styles.title}>
                {tipoObjetoSeleccionado || 'Exploración Espacial'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleSideMenu} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Contenido Principal */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Explorando el cosmos...</Text>
          </View>
        ) : mostrarSistemaRotacion ? (
          <View style={styles.solarSystemContainer}>
            <SolarSystem />
          </View>
        ) : tipoObjetoSeleccionado ? (
          <>
            {objetoLoading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingSpinner} />
                <Text style={styles.loadingText}>Descubriendo {tipoObjetoSeleccionado}...</Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <Text style={styles.sectionTitle}>{tipoObjetoSeleccionado}</Text>
                <View style={styles.objectsGrid}>
                  {objetosData.map(objeto => (
                    <ObjectCard key={objeto.id} objeto={objeto} />
                  ))}
                </View>
              </ScrollView>
            )}
          </>
        ) : (
          <ScrollView 
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionTitle}>Planetas del Sistema Solar</Text>
            <View style={styles.planetsGrid}>
              {planetas.map(planeta => (
                <PlanetCard key={planeta.id} planeta={planeta} />
              ))}
            </View>
          </ScrollView>
        )}

        {/* Menú Desplegable */}
        {sideMenuVisible && (
          <View style={styles.sideMenuDropdown}>
            <View style={styles.sideMenuHeader}>
              <Ionicons name="telescope" size={20} color="#00d4ff" />
              <Text style={styles.sideMenuTitle}>Explorar</Text>
            </View>
            {opcionesCelestes.map(opcion => (
              <TouchableOpacity 
                key={opcion.id} 
                style={styles.menuItem} 
                onPress={opcion.accion}
              >
                <View style={styles.menuItemContent}>
                  <Ionicons name={opcion.icon as any} size={18} color={opcion.color} />
                  <Text style={styles.menuText}>{opcion.titulo}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Modal de Planeta */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cerrarModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Información del Planeta</Text>
                <TouchableOpacity onPress={cerrarModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalContent}
                contentContainerStyle={styles.modalContentContainer}
                showsVerticalScrollIndicator={false}
              >
                {planetaSeleccionado && (
                  <>
                    <View style={styles.modalImageContainer}>
                      <Image 
                        source={{ uri: planetaSeleccionado.imagen }} 
                        style={styles.modalImage} 
                        resizeMode="cover"
                      />
                    </View>
                    
                    <View style={styles.modalInfoContainer}>
                      <Text style={styles.modalPlanetName}>{planetaSeleccionado.nombre}</Text>
                      <Text style={styles.modalDescription}>{planetaSeleccionado.descripcion}</Text>
                      
                      <View style={styles.scientificData}>
                        <Text style={styles.dataTitle}>Datos Científicos</Text>
                        <View style={styles.dataGrid}>
                          <View style={styles.dataItem}>
                            <Ionicons name="resize" size={16} color="#00d4ff" />
                            <Text style={styles.dataLabel}>Diámetro</Text>
                            <Text style={styles.dataValue}>
                              {planetasInfo[planetaSeleccionado.nombre as keyof typeof planetasInfo]?.diametro}
                            </Text>
                          </View>
                          <View style={styles.dataItem}>
                            <Ionicons name="sunny" size={16} color="#ffd700" />
                            <Text style={styles.dataLabel}>Distancia al Sol</Text>
                            <Text style={styles.dataValue}>
                              {planetasInfo[planetaSeleccionado.nombre as keyof typeof planetasInfo]?.distanciaSol}
                            </Text>
                          </View>
                          <View style={styles.dataItem}>
                            <Ionicons name="time" size={16} color="#51cf66" />
                            <Text style={styles.dataLabel}>Período Orbital</Text>
                            <Text style={styles.dataValue}>
                              {planetasInfo[planetaSeleccionado.nombre as keyof typeof planetasInfo]?.periodoOrbital}
                            </Text>
                          </View>
                          <View style={styles.dataItem}>
                            <Ionicons name="thermometer" size={16} color="#ff6b6b" />
                            <Text style={styles.dataLabel}>Temperatura</Text>
                            <Text style={styles.dataValue}>
                              {planetasInfo[planetaSeleccionado.nombre as keyof typeof planetasInfo]?.temperatura}
                            </Text>
                          </View>
                          <View style={styles.dataItem}>
                            <Ionicons name="moon" size={16} color="#ae8fff" />
                            <Text style={styles.dataLabel}>Lunas</Text>
                            <Text style={styles.dataValue}>
                              {planetasInfo[planetaSeleccionado.nombre as keyof typeof planetasInfo]?.lunas}
                            </Text>
                          </View>
                        </View>
                      </View>
                      
                      {nasaImages[planetaSeleccionado.nombre] && nasaImages[planetaSeleccionado.nombre].length > 0 && (
                        <View style={styles.nasaSection}>
                          <Text style={styles.nasaTitle}>Imágenes de la NASA</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {nasaImages[planetaSeleccionado.nombre].map((imageUrl, index) => (
                              <Image 
                                key={index}
                                source={{ uri: imageUrl }} 
                                style={styles.nasaImage} 
                                resizeMode="cover"
                              />
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal de Objeto Celeste */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={objetoModalVisible}
          onRequestClose={cerrarObjetoModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Información del Objeto</Text>
                <TouchableOpacity onPress={cerrarObjetoModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalContent}
                contentContainerStyle={styles.modalContentContainer}
                showsVerticalScrollIndicator={false}
              >
                {objetoSeleccionado && (
                  <>
                    <View style={styles.modalImageContainer}>
                      <Image 
                        source={{ uri: objetoSeleccionado.imagen }} 
                        style={styles.modalImage} 
                        resizeMode="cover"
                      />
                    </View>
                    
                    <View style={styles.modalInfoContainer}>
                      <Text style={styles.modalPlanetName}>{objetoSeleccionado.nombre}</Text>
                      <Text style={styles.modalDescription}>{objetoSeleccionado.descripcion}</Text>
                      
                      {objetoSeleccionado.nasaInfo && (
                        <View style={styles.nasaDataSection}>
                          <Text style={styles.dataTitle}>Datos de la NASA</Text>
                          <View style={styles.nasaDataContent}>
                            {(() => {
                              try {
                                const info = JSON.parse(objetoSeleccionado.nasaInfo);
                                return (
                                  <>
                                    {info.date_created && (
                                      <View style={styles.nasaDataItem}>
                                        <Ionicons name="calendar" size={16} color="#00d4ff" />
                                        <Text style={styles.nasaDataText}>
                                          Fecha: {new Date(info.date_created).toLocaleDateString()}
                                        </Text>
                                      </View>
                                    )}
                                    {info.center && (
                                      <View style={styles.nasaDataItem}>
                                        <Ionicons name="business" size={16} color="#ffd700" />
                                        <Text style={styles.nasaDataText}>
                                          Centro: {info.center}
                                        </Text>
                                      </View>
                                    )}
                                    {info.keywords && info.keywords.length > 0 && (
                                      <View style={styles.nasaDataItem}>
                                        <Ionicons name="pricetag" size={16} color="#51cf66" />
                                        <Text style={styles.nasaDataText}>
                                          Palabras clave: {info.keywords.join(', ')}
                                        </Text>
                                      </View>
                                    )}
                                  </>
                                );
                              } catch (e) {
                                return (
                                  <Text style={styles.nasaDataText}>
                                    No hay información adicional disponible
                                  </Text>
                                );
                              }
                            })()}
                          </View>
                        </View>
                      )}
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginTop: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
  menuButton: {
    padding: 5,
    marginLeft: 10,
    zIndex: 2000,
  },
  backButton: {
    padding: 7,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(42, 42, 64, 0.7)',
  },
  subTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sideMenuDropdown: {
    position: 'absolute',
    top: 80,
    right: 15,
    backgroundColor: 'rgba(25, 25, 25, 0.95)',
    borderRadius: 12,
    padding: 8,
    width: 220,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sideMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 5,
  },
  sideMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: '#00d4ff',
    borderTopColor: 'transparent',
    marginBottom: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  planetList: {
    flex: 1,
    padding: 10,
  },
  planetListContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  planetaCard: {
    width: 160,
    height: 200,
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(109, 105, 105, 0.3)',
    borderRadius: 30,
    padding: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  planetaImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 10,
  },
  planetaImagen: {
    width: '100%',
    height: '100%',
  },
  planetaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  planetaDescripcion: {
    fontSize: 14,
    color: '#ccc',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: 'rgba(42, 42, 64, 0.95)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    flex: 1,
    width: '100%',
  },
  modalContentContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalImagen: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalDescripcion: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  datosPlaneta: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    width: '100%',
  },
  datoTexto: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  nasaImagesContainer: {
    flexDirection: 'row',
    marginTop: 10,
    maxHeight: 120,
  },
  nasaImage: {
    width: 150,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  cerrarBoton: {
    backgroundColor: 'rgba(74, 74, 106, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  cerrarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  sistemaRotacion: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000011',
    width: '100%',
    height: '100%',
    paddingVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    paddingBottom: 20, // Espacio adicional en la parte inferior
  },
  scrollContent: {
    paddingBottom: 100, // Espacio para la barra de navegación
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  planetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  planetCard: {
    width: '48%', // Porcentaje en lugar de cálculo con width
    height: 200,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  planetCardTouchable: {
    flex: 1,
  },
  planetImageContainer: {
    width: '100%',
    height: '70%',
    position: 'relative',
  },
  planetImage: {
    width: '100%',
    height: '100%',
  },
  planetImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  planetInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  planetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  planetDescription: {
    fontSize: 11,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 14,
  },
  objectCard: {
    width: '48%', // Porcentaje en lugar de cálculo con width
    height: 200,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  objectCardTouchable: {
    flex: 1,
  },
  objectImageContainer: {
    width: '100%',
    height: '70%',
    position: 'relative',
  },
  objectImage: {
    width: '100%',
    height: '100%',
  },
  objectImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  objectInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  objectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  objectDescription: {
    fontSize: 11,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 14,
  },
  objectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  modalImageContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 15,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalInfoContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalPlanetName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  modalDescription: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 15,
    textAlign: 'center',
  },
  scientificData: {
    marginBottom: 15,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 10,
    textAlign: 'left',
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dataItem: {
    width: '45%', // 45% del ancho de la pantalla
    marginVertical: 5,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 5,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  nasaSection: {
    marginTop: 15,
    width: '100%',
  },
  nasaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 10,
    textAlign: 'left',
  },
  nasaImagesContainer: {
    flexDirection: 'row',
    maxHeight: 150,
  },
  nasaImage: {
    width: 120,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  nasaDataSection: {
    marginTop: 15,
    width: '100%',
  },
  nasaDataContent: {
    width: '100%',
  },
  nasaDataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nasaDataText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 10,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  solarSystemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000011',
    width: '100%',
    height: '100%',
    paddingVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});
