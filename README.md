# ThreadHub — Frontend

Proyecto final — parte frontend.

- **Alumno:** Pablo Suárez
- **Stack:** Next.js 16, React 18, TypeScript, Tailwind CSS

## Enlaces de entrega

- **Repositorio:** https://github.com/BL3SS3D-19/threadhub-frontend
- **Web:** pendiente de despliegue (sustituir por la URL pública, p. ej. `https://threadhub-frontend.vercel.app`)

En local la app corre en [http://localhost:9002](http://localhost:9002) con el backend en `http://localhost:3000`.

## Requisitos

- Node.js 20+
- Un backend de ThreadHub en marcha (por defecto en `http://localhost:3000`)

## Arranque en local

```bash
pnpm install
pnpm dev
```

También vale `npm install` y `npm run dev`.

Copia `.env.example` a `.env.local` y ajusta la URL del backend si no usas el puerto 3000:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo (puerto 9002) |
| `pnpm build` | Build de producción |
| `pnpm start` | Sirve el build |

## Estructura

```
src/
  app/            # Rutas: inicio, auth, hilos
  components/     # UI, layout, hilos y respuestas
  context/        # Sesión de usuario
  hooks/          # Hooks de datos
  lib/            # Cliente HTTP y tipos
  services/       # Llamadas a la API (auth y threads)
```

## Autenticación

El frontend envía cookies `httpOnly` al backend (`credentials: include`). Hay tres modos en `/auth`:

- Login
- Registro
- Acceso como invitado (solo lectura)
