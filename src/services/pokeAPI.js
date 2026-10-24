const BASE_URL = 'https://pokeapi.co/api/v2';
const IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

const getIdFromUrl = (url) => {
  const parts = url.split('/').filter((p) => p !== '');
  return Number(parts[parts.length - 1]);
};

export const getPokemonList = async (limit = 20, offset = 0, signal) => { 
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
    signal, 
  });

  if (!response.ok) {
    throw new Error('No se pudo cargar la lista de Pokémon');
  }

  const data = await response.json();

  return data.results.map((item) => {
    const id = getIdFromUrl(item.url);
    return {
      id: id,
      name: item.name,
      image: `${IMAGE_URL}/${id}.png`,
    };
  });
};

export const getPokemonDetail = async (nameOrId, signal) => { 
  const query = String(nameOrId).trim().toLowerCase();
  const response = await fetch(`${BASE_URL}/pokemon/${query}`, {
    signal, 
  });


  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Error al consultar el Pokémon');
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    height: data.height / 10, 
    weight: data.weight / 10,
    image: data.sprites.other['official-artwork'].front_default,
    types: data.types.map((t) => t.type.name),
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
  };
};