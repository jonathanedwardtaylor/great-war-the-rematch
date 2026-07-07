export type TerrainType =
  | "open"
  | "road"
  | "mud"
  | "trench"
  | "crater"
  | "forest"
  | "wire"
  | "sandbags"
  | "objective"
  | "water"
  | "bridge";

export type UnitKind = "rifle" | "machineGun" | "grenadier" | "engineer" | "fieldGun" | "lightTank";

export type Team = "blue" | "red";

export type BoardOrientation = 0 | 1 | 2 | 3;

export type GridPosition = {
  row: number;
  column: number;
};

export type UnitState = {
  id: string;
  team: Team;
  kind: UnitKind;
  name: string;
  position: GridPosition;
  move: number;
  hasMoved: boolean;
};

export type ProjectedPosition = {
  x: number;
  y: number;
};

export const TILE_WIDTH = 72;
export const TILE_HEIGHT = 36;

export function positionKey(position: GridPosition) {
  return `${position.row}:${position.column}`;
}

export function isSamePosition(a: GridPosition, b: GridPosition) {
  return a.row === b.row && a.column === b.column;
}

export function rotatePosition(
  position: GridPosition,
  rows: number,
  columns: number,
  orientation: BoardOrientation
): GridPosition {
  switch (orientation) {
    case 0:
      return { row: position.row, column: position.column };
    case 1:
      return { row: position.column, column: rows - 1 - position.row };
    case 2:
      return { row: rows - 1 - position.row, column: columns - 1 - position.column };
    case 3:
      return { row: columns - 1 - position.column, column: position.row };
  }
}

export function projectIsometric(
  position: GridPosition,
  rows: number,
  columns: number,
  orientation: BoardOrientation,
  tileWidth = TILE_WIDTH,
  tileHeight = TILE_HEIGHT
): ProjectedPosition {
  const rotated = rotatePosition(position, rows, columns, orientation);

  return {
    x: (rotated.column - rotated.row) * (tileWidth / 2),
    y: (rotated.column + rotated.row) * (tileHeight / 2)
  };
}

export function terrainMovementCost(terrain: TerrainType, unit: UnitState): number | null {
  if (terrain === "water") {
    return null;
  }

  if (terrain === "wire") {
    return unit.kind === "engineer" || unit.kind === "lightTank" ? 1 : null;
  }

  if (unit.kind === "fieldGun") {
    if (terrain === "forest" || terrain === "crater" || terrain === "trench" || terrain === "mud") {
      return null;
    }

    return terrain === "road" || terrain === "bridge" ? 1 : 2;
  }

  if (unit.kind === "lightTank") {
    if (terrain === "forest" || terrain === "crater") {
      return null;
    }

    return terrain === "road" || terrain === "bridge" ? 1 : 2;
  }

  if (terrain === "mud" || terrain === "crater" || terrain === "forest") {
    return 2;
  }

  return 1;
}

export function getNeighbors(position: GridPosition, rows: number, columns: number): GridPosition[] {
  const candidates: GridPosition[] = [
    { row: position.row - 1, column: position.column },
    { row: position.row + 1, column: position.column },
    { row: position.row, column: position.column - 1 },
    { row: position.row, column: position.column + 1 }
  ];

  return candidates.filter(
    (candidate) =>
      candidate.row >= 0 &&
      candidate.row < rows &&
      candidate.column >= 0 &&
      candidate.column < columns
  );
}

export function getReachableTiles(map: TerrainType[][], units: UnitState[], unit: UnitState): GridPosition[] {
  const rows = map.length;
  const columns = map[0]?.length ?? 0;
  const occupied = new Set(
    units
      .filter((otherUnit) => otherUnit.id !== unit.id)
      .map((otherUnit) => positionKey(otherUnit.position))
  );
  const bestCosts = new Map<string, number>([[positionKey(unit.position), 0]]);
  const frontier: Array<{ position: GridPosition; cost: number }> = [{ position: unit.position, cost: 0 }];

  while (frontier.length > 0) {
    frontier.sort((a, b) => a.cost - b.cost);
    const current = frontier.shift();

    if (!current) {
      break;
    }

    for (const next of getNeighbors(current.position, rows, columns)) {
      const key = positionKey(next);

      if (occupied.has(key)) {
        continue;
      }

      const terrain = map[next.row]?.[next.column];

      if (!terrain) {
        continue;
      }

      const movementCost = terrainMovementCost(terrain, unit);

      if (movementCost === null) {
        continue;
      }

      const nextCost = current.cost + movementCost;
      const knownCost = bestCosts.get(key);

      if (nextCost <= unit.move && (knownCost === undefined || nextCost < knownCost)) {
        bestCosts.set(key, nextCost);
        frontier.push({ position: next, cost: nextCost });
      }
    }
  }

  return [...bestCosts.keys()]
    .filter((key) => key !== positionKey(unit.position))
    .map((key) => {
      const [row, column] = key.split(":").map(Number);

      return { row, column };
    });
}
