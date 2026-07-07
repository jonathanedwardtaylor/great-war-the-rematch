import { describe, expect, it } from "vitest";
import {
  getReachableTiles,
  projectIsometric,
  rotatePosition,
  type TerrainType,
  type UnitState
} from "../../src/game/board";

const makeUnit = (overrides: Partial<UnitState> = {}): UnitState => ({
  id: "unit-1",
  team: "blue",
  kind: "rifle",
  name: "Rifle Infantry",
  position: { row: 1, column: 1 },
  move: 3,
  hasMoved: false,
  ...overrides
});

describe("board geometry", () => {
  it("projects square grid positions into isometric screen positions", () => {
    expect(projectIsometric({ row: 0, column: 0 }, 3, 4, 0)).toEqual({ x: 0, y: 0 });
    expect(projectIsometric({ row: 0, column: 1 }, 3, 4, 0)).toEqual({ x: 36, y: 18 });
    expect(projectIsometric({ row: 1, column: 0 }, 3, 4, 0)).toEqual({ x: -36, y: 18 });
  });

  it("rotates logical positions into discrete board orientations", () => {
    expect(rotatePosition({ row: 0, column: 0 }, 3, 4, 1)).toEqual({ row: 0, column: 2 });
    expect(rotatePosition({ row: 0, column: 0 }, 3, 4, 2)).toEqual({ row: 2, column: 3 });
    expect(rotatePosition({ row: 0, column: 0 }, 3, 4, 3)).toEqual({ row: 3, column: 0 });
  });
});

describe("movement", () => {
  const map: TerrainType[][] = [
    ["open", "open", "water"],
    ["open", "open", "wire"],
    ["open", "mud", "open"]
  ];

  it("blocks rifle movement through water and wire", () => {
    const unit = makeUnit();
    const reachable = getReachableTiles(map, [unit], unit);

    expect(reachable).toContainEqual({ row: 0, column: 1 });
    expect(reachable).toContainEqual({ row: 2, column: 1 });
    expect(reachable).not.toContainEqual({ row: 0, column: 2 });
    expect(reachable).not.toContainEqual({ row: 1, column: 2 });
  });

  it("lets engineers enter wire", () => {
    const unit = makeUnit({ kind: "engineer", name: "Engineer" });
    const reachable = getReachableTiles(map, [unit], unit);

    expect(reachable).toContainEqual({ row: 1, column: 2 });
  });
});
