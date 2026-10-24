import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getPokemonList, getPokemonDetail } from '../services/pokeAPI';
import PokemonCard from '../components/PokemonCard';
import { colors, spacing } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState(''); 
  const [pokemons, setPokemons] = useState([]); 
  const [results, setResults] = useState([]); 
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (query !== '') return; 

    const controller = new AbortController();

    const loadPokemons = async () => {
      if (offset === 0) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        const data = await getPokemonList(20, offset, controller.signal);
        setPokemons((prev) => (offset === 0 ? data : [...prev, ...data]));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('No se pudo cargar la lista. Revisa tu internet.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    loadPokemons();
    return () => controller.abort();
  }, [offset, retry]);

  useEffect(() => {
    if (query === '') return;

    const controller = new AbortController();

    const searchPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const pokemon = await getPokemonDetail(query, controller.signal);
        setResults(pokemon ? [pokemon] : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('No se pudo realizar la búsqueda. Revisa tu internet.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    searchPokemon();
    return () => controller.abort();
  }, [query, retry]);

  const handleSearch = () => {
    const text = searchText.trim().toLowerCase();
    setQuery(text); // cambiar query dispara el useEffect
  };

  const showAll = () => {
    setSearchText('');
    setQuery('');
  };

  const loadMore = () => {
    if (query !== '' || loading || loadingMore) return;
    setOffset(offset + 20);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Busca por nombre o número..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch} 
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </Pressable>
      </View>

      {query !== '' && (
        <Pressable onPress={showAll}>
          <Text style={styles.showAll}>← Ver todos</Text>
        </Pressable>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.message}>Cargando Pokémon...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.message, { color: colors.danger }]}>{error}</Text>
          <Pressable style={styles.button} onPress={() => setRetry(retry + 1)}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={query !== '' ? results : pokemons}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={() => navigation.navigate('Detail', { pokemonId: item.id })}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <Text style={styles.message}>No se encontró ningún Pokémon con "{query}"</Text>
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.primary} style={{ margin: spacing.md }} /> : null
          }
          contentContainerStyle={{ paddingHorizontal: spacing.sm, paddingBottom: spacing.lg }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  showAll: {
    color: colors.primary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    fontWeight: 'bold',
  },
  center: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    marginVertical: spacing.md,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
  },
});