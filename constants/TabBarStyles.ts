import { Platform, StyleSheet } from 'react-native';

export const TabBarStyles = {
  container: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
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
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    paddingTop: 8,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    marginTop: 2,
    letterSpacing: 0.5,
    textAlign: 'center' as const,
  },
  icon: {
    marginTop: 2,
    marginBottom: 0,
  },
  item: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  colors: {
    active: '#00d4ff',
    inactive: 'rgba(255, 255, 255, 0.6)',
  },
};

export const IconContainerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    position: 'relative',
    minHeight: 40,
    minWidth: 40,
  },
  active: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    transform: [{ scale: 1.1 }],
  },
  icon: {
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
}); 