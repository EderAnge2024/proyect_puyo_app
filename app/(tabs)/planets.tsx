import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

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
  const [menuVisible, setMenuVisible] = useState(false);
  const [planetaSeleccionado, setPlanetaSeleccionado] = useState<Planeta | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [planetas, setPlanetas] = useState<Planeta[]>(planetasData);
  const [loading, setLoading] = useState(true);
  const [nasaImages, setNasaImages] = useState<{[key: string]: string[]}>({});

  // Función para obtener imágenes de la NASA para cada planeta
  useEffect(() => {
    const fetchNasaData = async () => {
      try {
        setLoading(true);
        const planetNames = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
        const planetNamesSpanish = ['Mercurio', 'Venus', 'Tierra', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno'];
        
        const imageResults: {[key: string]: string[]} = {};
        
        // Hacer solicitudes a la API de NASA para cada planeta
        for (let i = 0; i < planetNames.length; i++) {
          const planetName = planetNames[i];
          const planetNameSpanish = planetNamesSpanish[i];
          
          const response = await axios.get(
            `https://images-api.nasa.gov/search?q=${planetName}&media_type=image`
          );
          
          if (response.data && response.data.collection && response.data.collection.items) {
            // Obtener las URLs de las imágenes
            const images = response.data.collection.items
              .slice(0, 5) // Limitar a 5 imágenes por planeta
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
        
        // Actualizar el estado con las imágenes obtenidas
        setNasaImages(imageResults);
        
        // Actualizar los datos de los planetas con las imágenes de la NASA
        const updatedPlanetas = planetas.map(planeta => {
          return {
            ...planeta,
            nasaImages: imageResults[planeta.nombre] || []
          };
        });
        
        setPlanetas(updatedPlanetas);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos de la NASA:', error);
        setLoading(false);
      }
    };
    
    fetchNasaData();
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const seleccionarPlaneta = (planeta: Planeta) => {
    setPlanetaSeleccionado(planeta);
    setModalVisible(true);
    setMenuVisible(false);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const ordenarPorTamaño = () => {
    const ordenados = [...planetas].sort((a, b) => {
      const tamañoA = planetasInfo[a.nombre as keyof typeof planetasInfo]?.diametro || '';
      const tamañoB = planetasInfo[b.nombre as keyof typeof planetasInfo]?.diametro || '';
      const numA = parseInt(tamañoA.replace(/[^\d]/g, ''));
      const numB = parseInt(tamañoB.replace(/[^\d]/g, ''));
      return numB - numA; // Orden descendente por tamaño
    });
    setPlanetas(ordenados);
    setMenuVisible(false);
  };

  const ordenarPorDistancia = () => {
    const ordenados = [...planetas].sort((a, b) => {
      const distanciaA = planetasInfo[a.nombre as keyof typeof planetasInfo]?.distanciaSol || '';
      const distanciaB = planetasInfo[b.nombre as keyof typeof planetasInfo]?.distanciaSol || '';
      const numA = parseInt(distanciaA.replace(/[^\d]/g, ''));
      const numB = parseInt(distanciaB.replace(/[^\d]/g, ''));
      return numA - numB; // Orden ascendente por distancia al sol
    });
    setPlanetas(ordenados);
    setMenuVisible(false);
  };

  const mostrarRocosos = () => {
    const rocosos = planetas.filter(planeta => 
      ['Mercurio', 'Venus', 'Tierra', 'Marte'].includes(planeta.nombre)
    );
    setPlanetas(rocosos);
    setMenuVisible(false);
  };

  const mostrarGaseosos = () => {
    const gaseosos = planetas.filter(planeta => 
      ['Júpiter', 'Saturno', 'Urano', 'Neptuno'].includes(planeta.nombre)
    );
    setPlanetas(gaseosos);
    setMenuVisible(false);
  };

  const mostrarTodos = () => {
    setPlanetas(planetasData);
    setMenuVisible(false);
  };

  const opciones: Opcion[] = [
    { id: 1, titulo: 'Ver todos los planetas', accion: mostrarTodos },
    { id: 2, titulo: 'Ordenar por tamaño', accion: ordenarPorTamaño },
    { id: 3, titulo: 'Ordenar por distancia al Sol', accion: ordenarPorDistancia },
    { id: 4, titulo: 'Mostrar solo planetas rocosos', accion: mostrarRocosos },
    { id: 5, titulo: 'Mostrar solo planetas gaseosos', accion: mostrarGaseosos },
  ];

  return (
    <ImageBackground
      source={require('../../assets/images/tierra-espcio.jpg')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Planetas del Sistema Solar</Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          
          {menuVisible && (
            <View style={styles.menuDropdown}>
              {opciones.map(opcion => (
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
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00f" />
            <Text style={styles.text}>Cargando datos de planetas desde la NASA...</Text>
          </View>
        ) : (
          <ScrollView style={styles.planetList}>
            {planetas.map(planeta => (
              <TouchableOpacity 
                key={planeta.id} 
                style={styles.planetaCard}
                onPress={() => seleccionarPlaneta(planeta)}
              >
                <Image 
                  source={{ uri: planeta.imagen }} 
                  style={styles.planetaImagen} 
                />
                <View style={styles.planetaInfo}>
                  <Text style={styles.planetaNombre}>{planeta.nombre}</Text>
                  <Text style={styles.planetaDescripcion}>{planeta.descripcion}</Text>
                </View>
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
      </SafeAreaView>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    height: 100,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuButton: {
    padding: 5,
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'rgba(42, 42, 64, 0.9)',
    borderRadius: 8,
    padding: 5,
    width: 220,
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
  menuItem: {
    padding: 12,
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
  planetaCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(42, 42, 64, 0.7)',
    borderRadius: 10,
    marginBottom: 15,
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
  planetaImagen: {
    width: 100,
    height: 100,
  },
  planetaInfo: {
    flex: 1,
    padding: 15,
  },
  planetaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
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
});