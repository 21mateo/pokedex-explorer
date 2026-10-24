import { Pressable, Image, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/colors';

export default function PokemonCard({ pokemon, onPress }) {

  const number = '#' + String(pokemon.id).padStart(3, '0');
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <Pressable
      onPress={onPress}

      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Image remota: necesita width y height */}
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.name}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    margin: spacing.sm / 2,
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  image: {
    width: 100,
    height: 100,
  },
  number: {
    fontSize: 12,
    color: colors.textMuted,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
});