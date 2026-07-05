# Test Plan

## Testing Strategy

Test game rules with unit tests and test the playable experience with browser smoke tests.

## Unit Test Targets

- Tile coordinates
- Movement range
- Terrain costs
- Valid attacks
- Damage calculation
- Turn order
- Win/loss conditions
- Save/load data

## Browser Smoke Test Targets

- Game loads without console errors.
- Main menu appears.
- Skirmish can start.
- Unit can be selected.
- Unit can move.
- Unit can attack.
- Turn can end.
- Mobile viewport remains usable.

## Manual Test Checklist

- Can a new player understand what is selectable?
- Does touch input feel comfortable?
- Are units readable at phone size?
- Does the first battle end clearly?
