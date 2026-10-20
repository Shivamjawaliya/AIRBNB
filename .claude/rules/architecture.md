# Architecture Rules & Code Standards

## Layered Boundaries
1. **Routers (`src/app/`)**: Pure route shells, metadata export, dynamic parameter forwarding.
2. **Controllers (`src/features/*/`, `src/hooks/`)**: Interaction handling, state machines, animation hooks.
3. **Services (`src/data/`)**: Normalized data objects, repository functions, date and currency math.

## Code Quality Rules
- Always ask the developer before removing any file or code block.
- Verify production build with `npm run build` prior to push.
- Dual-tier image fallbacks required for all avatars and listing images.
