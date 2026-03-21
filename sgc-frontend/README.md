# SGC Frontend

Proyecto frontend del **Sistema Web de Gestion de Condominios y Transparencia Financiera (SGC)**.

Este repositorio contiene **solo frontend**. El backend Django se trabajara en un proyecto/carpeta separada.

## Objetivo de la fase actual

- Migrar desde una `App` monolitica a una base escalable por capas.
- Implementar enrutamiento por features.
- Centralizar UI reutilizable y modelos base de dominio.

## Stack

- React 19
- Vite 8
- TailwindCSS 3
- React Router DOM 7
- ESLint 9

## Arquitectura frontend

```text
src/
  app/         # bootstrap y router
  pages/       # pantalla por ruta
  widgets/     # bloques compuestos de UI
  features/    # casos de uso
  entities/    # dominio y acceso a datos por entidad
  shared/      # UI kit, utilidades, config y cliente API
```

Reglas de dependencia:

- `shared` no depende de otras capas.
- `entities` depende de `shared`.
- `features` depende de `entities/shared`.
- `widgets` depende de `features/entities/shared`.
- `pages` compone widgets/features/entities.
- `app` orquesta rutas y providers.

## Rutas actuales

- `/resident/dashboard`
- `/resident/pagos`
- `/resident/perfil`
- `/` y rutas no reconocidas redirigen a `/resident/dashboard`.

## Aliases

Definidos en `vite.config.js` y `jsconfig.json`:

- `@app/*`
- `@pages/*`
- `@widgets/*`
- `@features/*`
- `@entities/*`
- `@shared/*`

## Ejecucion

```bash
npm install
npm run dev
```

## Validaciones

```bash
npm run lint
npm run build
```

## Cambios aplicados al original

- Se reemplazo `App` monolitica por router + paginas por feature.
- Se agrego `react-router-dom`.
- Se migro UI base a `shared/ui`.
- Se organizaron capas `app/pages/widgets/features/entities/shared`.
- Se agregaron modelos base y cliente API en `shared/api`.
- Se documentaron reglas de arquitectura y estado de la fase.
