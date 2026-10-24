import { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { getPokemonDetail } from '../services/pokeAPI';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import { colors, spacing } from '../theme/colors';

export default function DetailScreen({ route, navigation }) {
  const { pokemonId } = route.params;

  const [pokemon, setPokemon] = useState(null); // datos de la API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPokemonDetail(pokemonId, controller.signal);
        setPokemon(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('No se pudo cargar la ficha. Revisa tu internet.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadPokemon();
    return () => controller.abort();
  }, [pokemonId, retry]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.message}>Cargando ficha...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.message, { color: colors.danger }]}>{error}</Text>
        <Pressable style={styles.button} onPress={() => setRetry(retry + 1)}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (!pokemon) {
    return <Text style={styles.message}>Pokémon no encontrado.</Text>;
  }

  const number = '#' + String(pokemon.id).padStart(3, '0');
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.title}>{name}</Text>

      <View style={styles.types}>
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.info}>Altura: {pokemon.height} m</Text>
        <Text style={styles.info}>Peso: {pokemon.weight} kg</Text>
      </View>

      <View style={styles.statsBox}>
        <Text style={styles.section}>Estadísticas base</Text>
        {pokemon.stats.map((stat) => (
          <StatBar key={stat.name} name={stat.name} value={stat.value} />
        ))}
      </View>

      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver a la lista</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    textAlign: 'center',
    marginVertical: spacing.md,
    color: colors.textMuted,
  },
  image: {
    width: 200,
    height: 200,
  },
  number: {
    fontSize: 16,
    color: colors.textMuted,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
  },
  types: {
    flexDirection: 'row',
    marginVertical: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: spacing.sm,
  },
  info: {
    fontSize: 16,
    color: colors.text,
  },
  statsBox: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});