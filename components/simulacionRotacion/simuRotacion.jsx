import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const SolarSystem = () => {
  const [time, setTime] = useState(0);
  const animationRef = useRef(null);
  const lastFrameTime = useRef(Date.now());

  // Tamaños optimizados para móvil pero más grandes
  const size = Math.min(screenWidth * 0.95, 400);
  const center = size / 2;
  
  // Planetas simplificados con nombres
  const planets = [
    { r: 15, orbit: 0, color: '#FDB813', period: 1, name: 'Sol' },
    { r: 4, orbit: 40, color: '#8C7853', period: 0.24, name: 'Mercurio' },
    { r: 5, orbit: 60, color: '#FFC649', period: 0.62, name: 'Venus' },
    { r: 6, orbit: 85, color: '#6B93D6', period: 1, name: 'Tierra' },
    { r: 5, orbit: 110, color: '#C1440E', period: 1.88, name: 'Marte' },
    { r: 10, orbit: 145, color: '#D8CA9D', period: 11.86, name: 'Júpiter' },
    { r: 9, orbit: 175, color: '#FAD5A5', period: 29.46, name: 'Saturno' }
  ];

  // Función de animación optimizada
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastFrameTime.current) / 1000;
      lastFrameTime.current = now;
      
      setTime(t => (t + delta / 10) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.canvas}>
        {/* Órbitas */}
        {planets.map((planet, i) => (
          planet.orbit > 0 && (
            <Circle
              key={`orbit-${i}`}
              cx={center}
              cy={center}
              r={planet.orbit}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              fill="none"
            />
          )
        ))}

        {/* Planetas y nombres */}
        {planets.map((planet, i) => {
          if (planet.orbit === 0) {
            return (
              <React.Fragment key={`planet-${i}`}>
                <Circle
                  cx={center}
                  cy={center}
                  r={planet.r}
                  fill={planet.color}
                />
                <Text
                  x={center}
                  y={center + planet.r + 15}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {planet.name}
                </Text>
              </React.Fragment>
            );
          }

          const angle = (time / planet.period) * Math.PI * 2;
          const x = center + Math.cos(angle) * planet.orbit;
          const y = center + Math.sin(angle) * planet.orbit;

          return (
            <React.Fragment key={`planet-${i}`}>
              <Circle
                cx={x}
                cy={y}
                r={planet.r}
                fill={planet.color}
              />
              <Text
                x={x}
                y={y + planet.r + 10}
                fill="white"
                fontSize="10"
                textAnchor="middle"
              >
                {planet.name}
              </Text>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000011',
    padding: 10,
    width: '100%',
  },
  canvas: {
    backgroundColor: '#000011',
    borderRadius: 20,
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

export default SolarSystem;