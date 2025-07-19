import { IconContainerStyles } from '@/constants/TabBarStyles';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          paddingBottom: 15,
          paddingTop: 8,
          paddingHorizontal: 10,
        },
        tabBarBackground: () => (
          <BlurView 
            intensity={30} 
            tint="dark" 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        ),
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
          letterSpacing: 0.5,
          textAlign: 'center',
        },
        tabBarIconStyle: {
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          paddingHorizontal: 8,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[
              IconContainerStyles.container,
              focused && IconContainerStyles.active
            ]}>
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={focused ? 26 : 24} 
                color={color} 
                style={IconContainerStyles.icon}
              />
              {focused && <View style={IconContainerStyles.indicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="planets"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[
              IconContainerStyles.container,
              focused && IconContainerStyles.active
            ]}>
              <Ionicons 
                name={focused ? 'planet' : 'planet-outline'} 
                size={focused ? 26 : 24} 
                color={color} 
                style={IconContainerStyles.icon}
              />
              {focused && <View style={IconContainerStyles.indicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="questions"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[
              IconContainerStyles.container,
              focused && IconContainerStyles.active
            ]}>
              <Ionicons 
                name={focused ? 'game-controller' : 'game-controller-outline'} 
                size={focused ? 26 : 24} 
                color={color} 
                style={IconContainerStyles.icon}
              />
              {focused && <View style={IconContainerStyles.indicator} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}