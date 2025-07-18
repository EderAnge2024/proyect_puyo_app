import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import SolarSystem from '@/components/simulacionRotacion/simuRotacion'

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
  // todos los estados que necesitamos para la app
  const [sideMenuVisible, setSideMenuVisible] = useState(false);  // Para mostrar/ocultar el menú lateral
  const [planetaSeleccionado, setPlanetaSeleccionado] = useState<Planeta | null>(null);  // Guarda el planeta que clickeamos
  const [objetoSeleccionado, setObjetoSeleccionado] = useState<ObjetoCeleste | null>(null);  // Guarda el objeto celeste seleccionado
  const [modalVisible, setModalVisible] = useState(false);  // Controla si se ve el modal de planetas
  const [objetoModalVisible, setObjetoModalVisible] = useState(false);  // Controla si se ve el modal de objetos celestes
  const [planetas, setPlanetas] = useState<Planeta[]>(planetasData);  // Lista de todos los planetas
  const [loading, setLoading] = useState(true);  // Para mostrar la pantalla de carga mientras buscamos datos
  const [objetoLoading, setObjetoLoading] = useState(false);  // Para mostrar carga mientras buscamos objetos celestes
  const [nasaImages, setNasaImages] = useState<{[key: string]: string[]}>({});  // Guarda las imágenes que traemos de la NASA
  const [objetosData, setObjetosData] = useState<ObjetoCeleste[]>([]);  // Lista de objetos celestes que encontramos
  const [tipoObjetoSeleccionado, setTipoObjetoSeleccionado] = useState<string | null>(null);  // Qué tipo de objeto estamos viendo
  const [mostrarSistemaRotacion, setMostrarSistemaRotacion] = useState(false);  // Para mostrar la simulación del sistema solar

  // Esta función se ejecuta cuando la app arranca y busca imágenes de la NASA para cada planeta
  useEffect(() => {
    const fetchNasaData = async () => {
      try {
        setLoading(true);
        // Tenemos los nombres en inglés porque la API de NASA no habla español
        const planetNames = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
        const planetNamesSpanish = ['Mercurio', 'Venus', 'Tierra', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno'];
        
        const imageResults: {[key: string]: string[]} = {};
        
        // Vamos planeta por planeta pidiendo sus fotos a la NASA
        for (let i = 0; i < planetNames.length; i++) {
          const planetName = planetNames[i];
          const planetNameSpanish = planetNamesSpanish[i];
          
          const response = await axios.get(
            `https://images-api.nasa.gov/search?q=${planetName}&media_type=image`
          );
          
          if (response.data && response.data.collection && response.data.collection.items) {
            // Nos quedamos solo con 5 imágenes por planeta (para no llenar la memoria del teléfono)
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
        
        // Guardamos todas las imágenes que encontramos
        setNasaImages(imageResults);
        
        // Actualizamos la info de cada planeta con sus nuevas fotos
        const updatedPlanetas = planetas.map(planeta => ({
          ...planeta,
          nasaImages: imageResults[planeta.nombre] || []
        }));
        
        setPlanetas(updatedPlanetas);
        setLoading(false);
      } catch (error) {
        console.error('Ups! Algo salió mal al buscar datos de la NASA:', error);
        setLoading(false);
      }
    };
    
    fetchNasaData();
  }, []);

  // Esta función se encarga de buscar info cuando seleccionamos algo del menú
  const fetchObjetosCelestes = async (tipo: string) => {
    setObjetoLoading(true);
    setTipoObjetoSeleccionado(tipo);
    setMostrarSistemaRotacion(false);
    
    // Si eligieron ver el Sistema Solar, mostramos nuestra simulación
    if (tipo === 'Sistema Solar') {
      setMostrarSistemaRotacion(true);
      setObjetoLoading(false);
      return;
    }
    
    try {
      let searchQuery = '';
      
      // Traducimos los nombres al inglés para la API
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
      
      // Le pedimos a la NASA que nos pase datos sobre el objeto que queremos ver
      const response = await axios.get(
        `https://images-api.nasa.gov/search?q=${searchQuery}&media_type=image`
      );
      
      if (response.data && response.data.collection && response.data.collection.items) {
        // Nos quedamos con los primeros 10 resultados
        const items = response.data.collection.items.slice(0, 10);
        const objetos: ObjetoCeleste[] = items.map((item: any, index: number) => {
          // Sacamos toda la info útil de cada objeto
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
      console.error(`Ups! No pudimos encontrar datos de ${tipo}:`, error);
    } finally {
      setObjetoLoading(false);
    }
  };

  // Estas son funciones simples que manejan la interfaz

  const toggleSideMenu = () => {
    setSideMenuVisible(!sideMenuVisible);  // Abre/cierra el menú lateral
  };

  const seleccionarPlaneta = (planeta: Planeta) => {
    setPlanetaSeleccionado(planeta);  // Guarda el planeta que tocamos
    setModalVisible(true);  // Muestra su información en un modal
  };

  const seleccionarObjeto = (objeto: ObjetoCeleste) => {
    setObjetoSeleccionado(objeto);  // Guarda el objeto celeste que tocamos
    setObjetoModalVisible(true);  // Muestra su información en un modal
    setSideMenuVisible(false);  // Cierra el menú lateral
  };

  const cerrarModal = () => {
    setModalVisible(false);  // Cierra el modal de planetas
  };

  const cerrarObjetoModal = () => {
    setObjetoModalVisible(false);  // Cierra el modal de objetos celestes
  };

  // Aquí definimos todas las opciones que aparecen en el menú lateral
  const opcionesCelestes: Opcion[] = [
    { id: 1, titulo: 'Sistema Solar', accion: () => { fetchObjetosCelestes('Sistema Solar'); setSideMenuVisible(false); } },
    { id: 2, titulo: 'Meteoritos', accion: () => { fetchObjetosCelestes('Meteoritos'); setSideMenuVisible(false); } },
    { id: 3, titulo: 'Estrellas', accion: () => { fetchObjetosCelestes('Estrellas'); setSideMenuVisible(false); } },
    { id: 4, titulo: 'Cometas', accion: () => { fetchObjetosCelestes('Cometas'); setSideMenuVisible(false); } },
    { id: 5, titulo: 'Satélites', accion: () => { fetchObjetosCelestes('Satélites'); setSideMenuVisible(false); } },
    { id: 6, titulo: 'Lunas', accion: () => { fetchObjetosCelestes('Lunas'); setSideMenuVisible(false); } },
  ];

  return (
    <ImageBackground
      source={require('../../assets/images/tierra-espcio.jpg')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {tipoObjetoSeleccionado && (
              <TouchableOpacity 
                onPress={() => setTipoObjetoSeleccionado(null)} 
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            <Text style={styles.titulo}>
              {tipoObjetoSeleccionado || 'Planetas del Sistema Solar'}
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={toggleSideMenu} style={styles.menuButton}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00f" />
            <Text style={styles.text}>Cargando datos de planetas desde la NASA...</Text>
          </View>
        ) : mostrarSistemaRotacion ? (
          <View style={styles.sistemaRotacion}>
            <SolarSystem />
          </View>
        ) : tipoObjetoSeleccionado ? (
          <>
            {objetoLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00f" />
                <Text style={styles.text}>Cargando datos de {tipoObjetoSeleccionado} desde la NASA...</Text>
              </View>
            ) : (
              <ScrollView style={styles.planetList} contentContainerStyle={styles.planetListContent}>
                {objetosData.map(objeto => (
                  <TouchableOpacity 
                    key={objeto.id} 
                    style={styles.planetaCard}
                    onPress={() => seleccionarObjeto(objeto)}
                  >
                    <View style={styles.planetaImageContainer}>
                      <Image 
                        source={{ uri: objeto.imagen }} 
                        style={styles.planetaImagen} 
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.planetaNombre}>{objeto.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </>
        ) : (
          <ScrollView style={styles.planetList} contentContainerStyle={styles.planetListContent}>
            {planetas.map(planeta => (
              <TouchableOpacity 
                key={planeta.id} 
                style={styles.planetaCard}
                onPress={() => seleccionarPlaneta(planeta)}
              >
                <View style={styles.planetaImageContainer}>
                  <Image 
                    source={{ uri: planeta.imagen }} 
                    style={styles.planetaImagen} 
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.planetaNombre}>{planeta.nombre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cerrarModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {planetaSeleccionado && (
                <ScrollView contentContainerStyle={styles.modalScroll}>
                  <Image 
                    source={{ uri: planetaSeleccionado.imagen }} 
                    style={styles.modalImagen} 
                  />
                  <Text style={styles.modalTitulo}>{planetaSeleccionado.nombre}</Text>
                  <Text style={styles.modalDescripcion}>{planetaSeleccionado.descripcion}</Text>
                  
                  <Text style={styles.modalSubtitulo}>Datos científicos:</Text>
                  <View style={styles.datosPlaneta}>
                    <Text style={styles.datoTexto}>• Diámetro: {planetasInfo[planetaSeleccionado.nombre as keyof typeof planetasInfo]?.diametro}</Text>
                    <Text style={styles.datoTexto}>• Distancia al Sol: {planetasInfo[planetaSeleccionado.nombre as keyof typeof planetasInfo]?.distanciaSol}</Text>
                    <Text style={styles.datoTexto}>• Período orbital: {planetasInfo[planetaSeleccionado.nombre as keyof typeof planetasInfo]?.periodoOrbital}</Text>
                    <Text style={styles.datoTexto}>• Temperatura media: {planetasInfo[planetaSeleccionado.nombre as keyof typeof planetasInfo]?.temperatura}</Text>
                    <Text style={styles.datoTexto}>• Número de lunas: {planetasInfo[planetaSeleccionado.nombre as keyof typeof planetasInfo]?.lunas}</Text>
                  </View>
                  
                  {nasaImages[planetaSeleccionado.nombre] && nasaImages[planetaSeleccionado.nombre].length > 0 && (
                    <>
                      <Text style={styles.modalSubtitulo}>Imágenes de la NASA:</Text>
                      <ScrollView horizontal={true} style={styles.nasaImagesContainer}>
                        {nasaImages[planetaSeleccionado.nombre].map((imageUrl, index) => (
                          <Image 
                            key={index}
                            source={{ uri: imageUrl }} 
                            style={styles.nasaImage} 
                          />
                        ))}
                      </ScrollView>
                    </>
                  )}
                </ScrollView>
              )}
              <TouchableOpacity
                style={styles.cerrarBoton}
                onPress={cerrarModal}
              >
                <Text style={styles.cerrarTexto}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={objetoModalVisible}
          onRequestClose={cerrarObjetoModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {objetoSeleccionado && (
                <ScrollView contentContainerStyle={styles.modalScroll}>
                  <Image 
                    source={{ uri: objetoSeleccionado.imagen }} 
                    style={styles.modalImagen} 
                  />
                  <Text style={styles.modalTitulo}>{objetoSeleccionado.nombre}</Text>
                  <Text style={styles.modalDescripcion}>{objetoSeleccionado.descripcion}</Text>
                  
                  {objetoSeleccionado.nasaInfo && (
                    <>
                      <Text style={styles.modalSubtitulo}>Datos de la NASA:</Text>
                      <View style={styles.datosPlaneta}>
                        {(() => {
                          try {
                            const info = JSON.parse(objetoSeleccionado.nasaInfo);
                            return (
                              <>
                                {info.date_created && (
                                  <Text style={styles.datoTexto}>• Fecha: {new Date(info.date_created).toLocaleDateString()}</Text>
                                )}
                                {info.center && (
                                  <Text style={styles.datoTexto}>• Centro NASA: {info.center}</Text>
                                )}
                                {info.keywords && info.keywords.length > 0 && (
                                  <Text style={styles.datoTexto}>• Palabras clave: {info.keywords.join(', ')}</Text>
                                )}
                                {info.location && (
                                  <Text style={styles.datoTexto}>• Ubicación: {info.location}</Text>
                                )}
                                {info.nasa_id && (
                                  <Text style={styles.datoTexto}>• ID NASA: {info.nasa_id}</Text>
                                )}
                              </>
                            );
                          } catch (e) {
                            return <Text style={styles.datoTexto}>No hay información adicional disponible</Text>;
                          }
                        })()}
                      </View>
                    </>
                  )}
                  
                  {objetoSeleccionado.nasaImages && objetoSeleccionado.nasaImages.length > 1 && (
                    <>
                      <Text style={styles.modalSubtitulo}>Imágenes adicionales:</Text>
                      <ScrollView horizontal={true} style={styles.nasaImagesContainer}>
                        {objetoSeleccionado.nasaImages.map((imageUrl, index) => (
                          <Image 
                            key={index}
                            source={{ uri: imageUrl }} 
                            style={styles.nasaImage} 
                          />
                        ))}
                      </ScrollView>
                    </>
                  )}
                </ScrollView>
              )}
              <TouchableOpacity
                style={styles.cerrarBoton}
                onPress={cerrarObjetoModal}
              >
                <Text style={styles.cerrarTexto}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      {sideMenuVisible && (
        <View style={styles.sideMenuDropdown}>
          <Text style={styles.sideMenuTitle}>Objetos Celestes</Text>
          {opcionesCelestes.map(opcion => (
            <TouchableOpacity 
              key={opcion.id} 
              style={styles.menuItem} 
              onPress={opcion.accion}
            >
              <Text style={styles.menuText}>{opcion.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
    top: 45,
    right: 10,
    backgroundColor: 'rgba(25, 25, 25, 0.9)',
    borderRadius: 8,
    padding: 5,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  sideMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  menuItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
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
  modalScroll: {
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
  }
});
