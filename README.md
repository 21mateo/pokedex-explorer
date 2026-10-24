# PokéDex Explorer

Taller de consumo de API con React Native y Expo, usando la PokéAPI.

## Cómo ejecutar

```bash
npm install
npx expo start
```

## Estructura

```
src/
├── components/
│   ├── PokemonCard.js
│   ├── StatBar.js
│   └── TypeBadge.js
├── navigation/
│   └── AppNavigator.js
├── screens/
│   ├── HomeScreen.js
│   └── DetailScreen.js
├── services/
│   └── pokeAPI.js
└── theme/
    └── colors.js
```

- **components:** tarjeta de la lista, distintivo de tipo y barra de estadísticas. Solo reciben datos por props.
- **navigation:** las pantallas Home y Detail.
- **screens:** HomeScreen tiene la lista, la búsqueda y el scroll infinito. DetailScreen muestra la ficha.
- **services:** todas las peticiones a la PokéAPI. Así el fetch no queda mezclado con el JSX.
- **theme:** colores de la app y de cada tipo.