# Technical Design

## Initial Recommendation

Build the game as an HTML5 project using TypeScript, Phaser, and Vite.

## Why This Stack

- TypeScript helps catch mistakes before runtime.
- Phaser is a mature 2D HTML5 game framework.
- Vite gives fast local development and simple production builds.
- Vitest can test pure game rules.
- Playwright can smoke test the game in browser and mobile-sized viewports.
- Vercel can host web previews.
- Capacitor can be considered later for iOS and Android app packaging.

## Architecture Goals

- Keep core game rules separate from rendering.
- Make maps and units data-driven where practical.
- Keep early systems simple and testable.
- Prefer small modules with obvious responsibilities.

## Proposed Folder Shape

```text
src/
  game/
  rules/
  scenes/
  ui/
  data/
assets/
  sprites/
  audio/
  maps/
  ui/
tests/
  unit/
  e2e/
```

## Early Technical Questions

- Which grid type should the first prototype use?
- How much should Phaser know about the rule engine?
- What save format should be used for skirmish state?
- Should maps be edited by hand as JSON at first?
