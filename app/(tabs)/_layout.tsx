import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          height: Platform.OS === 'ios' ? 80 : 62,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 0,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#8a8a8a',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="planets"
        options={{
          title: 'Descrube mas!',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'planet' : 'planet-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="questions"
        options={{
          title: 'Minijuegos',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'help-circle' : 'help-circle-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}