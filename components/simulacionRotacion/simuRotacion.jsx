import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Animated
} from 'react-native';
import Svg, {
  Circle,
  G,
  Text as SvgText,
  Defs,
  RadialGradient,
  Stop,
  Rect
} from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SolarSystem = () => {
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showNames, setShowNames] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [time, setTime] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const animationRef = useRef(null);
  const sidebarAnim = useRef(new Animated.Value(0)).current;

  // Tamaño reducido: 30% de la pantalla
  const canvasWidth = screenWidth * 0.2;
  const canvasHeight = screenHeight * 0.3;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Datos de los planetas con distancias ajustadas al tamaño reducido
  const planetsData = [
    {
      name: 'Sol',
      distance: 0,
      size: 8,
      color: '#FDB813',
      period: 0,
      angle: 0,
      info: 'Estrella central de nuestro sistema solar. Masa: 1.989 × 10³⁰ kg'
    },
    {
      name: 'Mercurio',
      distance: 25,
      size: 1.5,
      color: '#8C7853',
      period: 88,
      angle: 0,
      info: 'Planeta más cercano al Sol. Temperatura: -173°C a 427°C'
    },
    {
      name: 'Venus',
      distance: 35,
      size: 2,
      color: '#FFC649',
      period: 225,
      angle: 0,
      info: 'Planeta más caliente del sistema solar. Atmósfera densa de CO₂'
    },
    {
      name: 'Tierra',
      distance: 45,
      size: 2.5,
      color: '#6B93D6',
      period: 365,
      angle: 0,
      info: 'Nuestro hogar. Único planeta conocido con vida'
    },
    {
      name: 'Marte',
      distance: 55,
      size: 2,
      color: '#C1440E',
      period: 687,
      angle: 0,
      info: 'Planeta rojo. Tiene dos lunas: Fobos y Deimos'
    },
    {
      name: 'Júpiter',
      distance: 70,
      size: 5,
      color: '#D8CA9D',
      period: 4333,
      angle: 0,
      info: 'Gigante gaseoso. Más de 95 lunas conocidas'
    },
    {
      name: 'Saturno',
      distance: 85,
      size: 4.5,
      color: '#FAD5A5',
      period: 10759,
      angle: 0,
      info: 'Famoso por sus anillos. Densidad menor que el agua'
    },
    {
      name: 'Urano',
      distance: 100,
      size: 3,
      color: '#4FD0E4',
      period: 30687,
      angle: 0,
      info: 'Rota de lado. Atmósfera rica en metano'
    },
    {
      name: 'Neptuno',
      distance: 115,
      size: 3,
      color: '#4B70DD',
      period: 60190,
      angle: 0,
      info: 'Vientos más rápidos del sistema solar (2100 km/h)'
    }
  ];

  const [planets] = useState(planetsData);

  // Función para calcular posición orbital
  const calculatePosition = (planet, time) => {
    if (planet.distance === 0) return { x: centerX, y: centerY };
    
    const angle = (time * speed / planet.period) * 2 * Math.PI;
    const x = centerX + Math.cos(angle) * planet.distance;
    const y = centerY + Math.sin(angle) * planet.distance;
    
    return { x, y };
  };

  // Función de animación automática
  const animate = () => {
    setTime(prevTime => prevTime + 0.5);
    animationRef.current = requestAnimationFrame(animate);
  };

  // Efecto para la animación automática
  useEffect(() => {
    // Iniciar animación automática
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]); // Reiniciar cuando cambie la velocidad

  // Manejar toque en planeta
  const handlePlanetPress = (planet) => {
    setSelectedPlanet(planet);
    setShowSidebar(true);
    animateSidebar(true);
  };

  // Animación del sidebar
  const animateSidebar = (show) => {
    Animated.timing(sidebarAnim, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Resetear
  const reset = () => {
    setTime(0);
    setSelectedPlanet(null);
    setShowSidebar(false);
    animateSidebar(false);
  };

  // Cambiar velocidad
  const changeSpeed = () => {
    setSpeed(speed >= 8 ? 1 : speed * 2);
  };

  // Generar estrellas aleatorias
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push(
        <Circle
          key={i}
          cx={Math.random() * canvasWidth}
          cy={Math.random() * canvasHeight}
          r={Math.random() * 1 + 0.5}
          fill="white"
          opacity={Math.random() * 0.8 + 0.2}
        />
      );
    }
    return stars;
  };

  // Renderizar planetas
  const renderPlanets = () => {
    return planets.map((planet, index) => {
      const pos = calculatePosition(planet, time);
      
      return (
        <G key={planet.name}>
          {/* Órbita */}
          {showOrbits && planet.distance > 0 && (
            <Circle
              cx={centerX}
              cy={centerY}
              r={planet.distance}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
            />
          )}
          
          {/* Efecto de brillo para el sol */}
          {planet.name === 'Sol' && (
            <Circle
              cx={pos.x}
              cy={pos.y}
              r={planet.size * 2}
              fill="url(#sunGradient)"
            />
          )}
          
          {/* Planeta principal */}
          <Circle
            cx={pos.x}
            cy={pos.y}
            r={planet.size}
            fill={planet.color}
            onPress={() => handlePlanetPress(planet)}
          />
          
          {/* Anillos de Saturno */}
          {planet.name === 'Saturno' && (
            <G>
              <Circle
                cx={pos.x}
                cy={pos.y}
                r={planet.size + 2}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1}
              />
              <Circle
                cx={pos.x}
                cy={pos.y}
                r={planet.size + 3}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1}
              />
            </G>
          )}
          
          {/* Borde del planeta seleccionado */}
          {selectedPlanet?.name === planet.name && (
            <Circle
              cx={pos.x}
              cy={pos.y}
              r={planet.size + 2}
              fill="none"
              stroke="white"
              strokeWidth={2}
            />
          )}
          
          {/* Nombres */}
          {showNames && (
            <SvgText
              x={pos.x}
              y={pos.y + planet.size + 12}
              fontSize="8"
              fill="white"
              textAnchor="middle"
            >
              {planet.name}
            </SvgText>
          )}
        </G>
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Header compacto */}
      <View style={styles.header}>
        <Text style={styles.title}>🌌 Sistema Solar</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.controlsContainer}
        >
          <TouchableOpacity
            onPress={changeSpeed}
            style={[styles.button, styles.speedButton]}
          >
            <Text style={styles.buttonText}>⚡ {speed}x</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={reset}
            style={[styles.button, styles.resetButton]}
          >
            <Text style={styles.buttonText}>🔄</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setShowOrbits(!showOrbits)}
            style={[styles.button, showOrbits ? styles.activeButton : styles.inactiveButton]}
          >
            <Text style={styles.buttonText}>
              {showOrbits ? '👁️' : '🙈'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setShowNames(!showNames)}
            style={[styles.button, showNames ? styles.activeButton : styles.inactiveButton]}
          >
            <Text style={styles.buttonText}>🏷️</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Canvas reducido */}
      <View style={styles.canvasContainer}>
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            Días: {Math.floor(time * speed)}
          </Text>
          <Text style={styles.infoText}>
            Velocidad: {speed}x
          </Text>
        </View>
        
        <Svg
          width={canvasWidth}
          height={canvasHeight}
          style={styles.canvas}
        >
          <Defs>
            <RadialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FDB813" />
              <Stop offset="80%" stopColor="#FF8C00" />
              <Stop offset="100%" stopColor="#FF8C00" stopOpacity="0.3" />
            </RadialGradient>
          </Defs>
          
          {/* Fondo estrellado */}
          <Rect width="100%" height="100%" fill="#000011" />
          {generateStars()}
          
          {/* Planetas */}
          {renderPlanets()}
        </Svg>
      </View>

      {/* Sidebar compacto */}
      {showSidebar && (
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [
                {
                  translateX: sidebarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [250, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Info</Text>
            <TouchableOpacity
              onPress={() => {
                setShowSidebar(false);
                animateSidebar(false);
              }}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.sidebarContent}>
            {selectedPlanet && (
              <View style={styles.planetInfo}>
                <View style={styles.planetHeader}>
                  <View
                    style={[
                      styles.planetColor,
                      { backgroundColor: selectedPlanet.color }
                    ]}
                  />
                  <Text style={styles.planetName}>{selectedPlanet.name}</Text>
                </View>
                
                <View style={styles.planetDetails}>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Período:</Text> {selectedPlanet.period} días
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Distancia:</Text> {selectedPlanet.distance} UA
                  </Text>
                  <Text style={styles.infoDescription}>{selectedPlanet.info}</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1F2937',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'transparent',
    width: screenWidth * 0.2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  speedButton: {
    backgroundColor: '#7C3AED',
  },
  resetButton: {
    backgroundColor: '#DC2626',
  },
  activeButton: {
    backgroundColor: '#059669',
  },
  inactiveButton: {
    backgroundColor: '#4B5563',
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  canvasContainer: {
    backgroundColor: '#000011',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1F2937',
    paddingVertical: 6,
    width: screenWidth * 0.2,
  },
  infoText: {
    color: 'white',
    fontSize: 10,
  },
  canvas: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 150,
    height: '100%',
    backgroundColor: '#1F2937',
    zIndex: 1000,
    borderRadius: 8,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  sidebarTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
  },
  sidebarContent: {
    flex: 1,
    padding: 12,
  },
  planetInfo: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
  },
  planetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planetColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  planetName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  planetDetails: {
    gap: 6,
  },
  detailText: {
    color: 'white',
    fontSize: 12,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  infoDescription: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 6,
  },
});

export default SolarSystem;