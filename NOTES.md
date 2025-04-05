### ✅ Tu planteamiento es correcto

Si tu componente (`NowPlaying`) está pensado para ser parte de una **librería de componentes UI de cliente**, y este componente hace fetch o interacción dinámica (como mostrar el “currently playing” de Spotify), entonces es totalmente válido —y **recomendado**— que reciba funciones como `onError` o cualquier otra callback relevante por props.

Eso es parte del diseño **"component-driven"** en React:

> 🎯 **Los componentes deben ser lo más configurables posible desde fuera.**

---

### 🔧 El detalle de los Server Components es solo de Next.js

El error que viste no es por tu diseño de componente, sino por cómo **Next.js Server Components** funcionan. Y efectivamente, como tú mismo dijiste:

> la persona que instale mi librería lo tendrá que hacer desde un componente cliente sí o sí

⬆️ Esto es completamente cierto. Si alguien quiere usar tu componente de Spotify, tendrá que usarlo dentro de un componente marcado con `"use client"` si quiere pasarle callbacks o manejar eventos, lo cual es totalmente estándar.

---

### 📦 Buenas prácticas para una librería como la tuya

1. **Marca explícitamente tu componente como cliente**:

   ```tsx
   "use client";
   ```

2. **Expón props que acepten funciones para mayor control**:

   ```tsx
   type NowPlayingProps = {
   	accessToken: string;
   	onError?: (err: Error) => void;
   	onPlay?: () => void;
   	onPause?: () => void;
   };
   ```

3. **Documenta en tu README** que el componente debe usarse en un `"use client"` context.

4. **Opcional**: puedes exportar un wrapper como:

   ```tsx
   // NowPlayingClient.tsx
   "use client";
   import { NowPlaying } from "./NowPlaying";

   export default NowPlaying;
   ```

   Así alguien puede importar directamente el componente cliente sin pensar en eso.

---

### 🧠 Pro tip

Si vas a publicar esto como paquete, y quieres hacerlo más robusto:

- Usa JSDoc o TypeScript para documentar las props.
- Expón un ejemplo en el README con algo como:

```tsx
"use client";

import { NowPlaying } from "@tu-lib/spotify-now-playing";

export default function Demo() {
	return (
		<NowPlaying
			accessToken={process.env.NEXT_PUBLIC_SPOTIFY_TOKEN!}
			onError={(err) => {
				console.error("Spotify error:", err);
			}}
		/>
	);
}
```

---

Manejando errores con props inesperadas:

2. Documentación clara y ejemplos
   Tu README.md o los comentarios JSDoc deberían dejar súper claro:

Qué tipo espera cada prop.

Qué pasa si no se pasan correctamente.

Ejemplos de uso correcto.

Así ayudás a los usuarios de la librería y prevenís errores antes de que pasen.

---

## TYPES

¡Perfecto! Ese error te está dando una pista **clave**:

> `'@types/spotify-api/index.d.ts' is not a module`

Eso significa que el paquete `@types/spotify-api` no exporta tipos como un **módulo ES**, sino que simplemente **declara tipos globales** (como `SpotifyApi`) directamente en el ámbito global de TypeScript.

---

## ✅ ¿Qué significa eso para vos?

- No podés hacer:

  ```ts
  import type { ImageObject } from "spotify-api"; // ❌ esto no va a funcionar
  ```

- Porque `@types/spotify-api` no define `export`s como haría un módulo normal.

---

## 🧩 Entonces, ¿cómo lo usás bien?

### ✅ Opción correcta: usar `/// <reference types="spotify-api" />` al comienzo del archivo donde vas a usar esos tipos

```ts
/// <reference types="spotify-api" />

export type InactivePlayer = {
	isPlayerActive: false;
};

type ImageObject = SpotifyApi.ImageObject;

export type Track = {
	albumCover: ImageObject;
	isPlayerActive: true;
	isTrackPlaying: boolean;
	trackArtists: string;
	trackName: string;
	trackTimeLeft: number;
};

export type NowPlayingObject = Track | InactivePlayer;
```

---

## 💡 ¿Dónde poner esa línea `/// <reference types="spotify-api" />`?

- Al inicio de cualquier archivo `.ts` o `.d.ts` donde vayas a usar tipos de `SpotifyApi`.
- O mejor aún, en tu archivo de entrada de tipos (ej: `global.d.ts`, `types.d.ts`) si querés evitar repetirlo.

### Ejemplo en `src/ts/types.ts`:

```ts
/// <reference types="spotify-api" />

// Ya podés usar SpotifyApi.X sin errores

export type NowPlayingResponse =
	| SpotifyApi.CurrentlyPlayingResponse
	| Record<string, never>;
```

---

## 🧼 Pro tip: archivo `global.d.ts`

Si tenés muchos archivos con estos tipos y querés evitar repetir la referencia, creá un archivo:

### `src/ts/global.d.ts`

```ts
/// <reference types="spotify-api" />
```

Y asegurate de incluir ese archivo en tu `tsconfig.json`:

```json
{
	"compilerOptions": {
		"types": ["spotify-api"]
	},
	"include": ["src"]
}
```

De esa forma, **el tipo `SpotifyApi` estará disponible globalmente en todo tu proyecto** y no necesitarás volver a escribir `/// <reference types=...` en cada archivo.

---

¿Querés que te prepare una estructura con `global.d.ts` y reorganice tus tipos para que todo quede limpio y sin prefijos molestos?
