import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const MAX_STAT = 255;

const statNames = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};

export default function StatBar({ name, value }) {
  // ancho proporcional al maximo (255)
  const percent = (value / MAX_STAT) * 100;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{statNames[name] || name}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: percent + '%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    width: 80,
    color: colors.text,
  },
  value: {
    width: 35,
    fontWeight: 'bold',
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  barFill: {
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
});