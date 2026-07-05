# 0001: Initial Tech Stack

## Status

Proposed

## Decision

Use TypeScript, Phaser, and Vite for the initial HTML5 game prototype. Use Vitest for rule tests and Playwright for browser smoke tests. Use Vercel for web preview deployments. Consider Capacitor later for mobile app packaging.

## Context

The project is intended to start as an HTML5 game, with a possible later path to app store distribution. The first priority is a fast learning loop and a small playable tactics prototype.

## Consequences

- The game can run in a browser during early development.
- Codex can work effectively with text-based TypeScript and markdown files.
- Rule logic can be tested separately from Phaser rendering.
- Mobile app packaging is deferred until the game is worth packaging.
