# 0002: Board Geometry And Camera

## Status

Accepted

## Decision

Use an isometric square grid for the tactical board.

The rules engine should treat the board as a normal row-and-column square grid. The renderer should project that grid into an isometric view. This keeps movement, pathfinding, attack ranges, and map data simple while still giving the game the stylized tactical look we want.

The camera should support:

- Zoom in and out.
- Pan around the battlefield.
- Board rotation as a planned feature.

For the prototype, rotation should be designed as discrete board orientations, likely 90-degree turns, rather than free 3D camera rotation. This lets the player inspect the field from different angles while keeping 2D assets readable and avoiding early 3D complexity.

## Context

The game is inspired by mobile turn-based tactics games with charming isometric battlefields. The battlefield should feel like an interactive world rather than a flat board, but the first playable still needs to be practical to build and test.

The player should eventually be able to zoom for inspection and rotate the view to see behind terrain, units, and trenches. These camera needs affect how we structure rendering from the beginning.

## Consequences

- Game rules can use simple square-grid coordinates.
- The renderer must keep logical grid coordinates separate from screen coordinates.
- Camera zoom should be included early because it affects mobile usability.
- Rotation should be considered in the renderer architecture even if it is not implemented in the first tiny prototype.
- Art direction should avoid assets that only read from one exact angle.
- Free 3D camera rotation is deferred unless the project later moves to a 3D renderer.

## Prototype Guidance

The first playable should start with:

- A fixed isometric square grid.
- Camera zoom controls.
- Camera panning if the map is larger than the viewport.
- Code structured so board orientation can be added without rewriting unit movement or map rules.

Rotation can come after selection and movement are working.
