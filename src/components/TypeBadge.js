import { View, Text, StyleSheet } from 'react-native';
import { typeColors, typeNames } from '../theme/colors';

export default function TypeBadge({ type }) {
  return (
    <View style={[styles.badge, { backgroundColor: typeColors[type] || '#999' }]}>
      <Text style={styles.text}>{typeNames[type] || type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});