import Phaser from "phaser";
import {
  getReachableTiles,
  isSamePosition,
  positionKey,
  projectIsometric,
  TILE_HEIGHT,
  TILE_WIDTH,
  type BoardOrientation,
  type GridPosition,
  type Team,
  type TerrainType,
  type UnitKind,
  type UnitState
} from "../game/board";

type TerrainStyle = {
  fill: number;
  line: number;
};

type TileCenter = GridPosition & {
  x: number;
  y: number;
};

type UiButton = {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  action: () => void;
};

const MAP: TerrainType[][] = [
  ["forest", "open", "open", "road", "open", "open", "forest", "open", "open"],
  ["open", "trench", "trench", "road", "open", "crater", "open", "wire", "open"],
  ["open", "open", "mud", "road", "sandbags", "open", "open", "wire", "objective"],
  ["open", "crater", "mud", "road", "open", "trench", "trench", "open", "open"],
  ["forest", "open", "open", "bridge", "water", "water", "open", "open", "forest"],
  ["open", "wire", "open", "road", "mud", "open", "sandbags", "open", "open"],
  ["objective", "open", "open", "road", "open", "open", "open", "trench", "trench"]
];

const TERRAIN_STYLES: Record<TerrainType, TerrainStyle> = {
  open: { fill: 0x6f7854, line: 0x283022 },
  road: { fill: 0x8a7654, line: 0x493c2b },
  mud: { fill: 0x5b4937, line: 0x30261e },
  trench: { fill: 0x655542, line: 0x2f251c },
  crater: { fill: 0x6b604d, line: 0x352c23 },
  forest: { fill: 0x52683f, line: 0x26331f },
  wire: { fill: 0x6f7352, line: 0x303326 },
  sandbags: { fill: 0x75694f, line: 0x3c3427 },
  objective: { fill: 0x747a55, line: 0x3b3f2c },
  water: { fill: 0x425f66, line: 0x20363d },
  bridge: { fill: 0x7b6143, line: 0x3b2b1d }
};

const TEAM_COLORS: Record<Team, number> = {
  blue: 0x5477a5,
  red: 0x9b5b4a
};

const TEAM_NAMES: Record<Team, string> = {
  blue: "Blue",
  red: "Red"
};

const UNIT_ACCENTS: Record<UnitKind, number> = {
  rifle: 0x26311f,
  machineGun: 0x222522,
  grenadier: 0x3b3528,
  engineer: 0x6f5f3f,
  fieldGun: 0x2f3434,
  lightTank: 0x364437
};

export class BootScene extends Phaser.Scene {
  private readonly map = MAP;
  private readonly rows = MAP.length;
  private readonly columns = MAP[0].length;
  private readonly tileCenters = new Map<string, TileCenter>();
  private readonly uiObjects: Phaser.GameObjects.GameObject[] = [];
  private readonly buttons: UiButton[] = [];
  private boardLayer!: Phaser.GameObjects.Container;
  private orientation: BoardOrientation = 0;
  private boardZoom = 1;
  private activeTeam: Team = "blue";
  private selectedUnitId: string | null = null;
  private reachableTiles: GridPosition[] = [];
  private units: UnitState[] = [
    {
      id: "blue-rifle",
      team: "blue",
      kind: "rifle",
      name: "Rifle Infantry",
      position: { row: 5, column: 1 },
      move: 3,
      hasMoved: false
    },
    {
      id: "blue-engineer",
      team: "blue",
      kind: "engineer",
      name: "Engineer",
      position: { row: 6, column: 2 },
      move: 3,
      hasMoved: false
    },
    {
      id: "blue-tank",
      team: "blue",
      kind: "lightTank",
      name: "Light Tank",
      position: { row: 5, column: 4 },
      move: 3,
      hasMoved: false
    },
    {
      id: "red-rifle",
      team: "red",
      kind: "rifle",
      name: "Rifle Infantry",
      position: { row: 1, column: 7 },
      move: 3,
      hasMoved: false
    },
    {
      id: "red-mg",
      team: "red",
      kind: "machineGun",
      name: "Machine Gun Team",
      position: { row: 1, column: 5 },
      move: 2,
      hasMoved: false
    },
    {
      id: "red-gun",
      team: "red",
      kind: "fieldGun",
      name: "Field Gun",
      position: { row: 2, column: 6 },
      move: 1,
      hasMoved: false
    }
  ];

  constructor() {
    super("BootScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#1d2118");
    this.boardLayer = this.add.container(480, 106);
    this.boardLayer.setScale(this.boardZoom);

    this.input.on("pointerdown", this.handlePointerDown, this);
    this.render();
  }

  private render() {
    this.renderBoard();
    this.renderUi();
  }

  private renderBoard() {
    this.boardLayer.removeAll(true);
    this.tileCenters.clear();

    const projected = this.collectProjectedTiles();
    const bounds = this.getProjectedBounds(projected);
    const offsetX = -((bounds.minX + bounds.maxX) / 2);
    const offsetY = 18;
    const graphics = this.add.graphics();

    this.boardLayer.add(graphics);

    for (const tile of projected) {
      const x = tile.x + offsetX;
      const y = tile.y + offsetY;
      const terrain = this.map[tile.row][tile.column];
      const selected = this.getSelectedUnit()?.position;
      const isSelectedTile = selected ? isSamePosition(selected, tile) : false;
      const isReachable = this.reachableTiles.some((position) => isSamePosition(position, tile));

      this.tileCenters.set(positionKey(tile), { row: tile.row, column: tile.column, x, y });
      this.drawTile(graphics, x, y, terrain, isReachable, isSelectedTile);
    }

    this.renderUnits();
  }

  private collectProjectedTiles() {
    const tiles: TileCenter[] = [];

    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        const projected = projectIsometric({ row, column }, this.rows, this.columns, this.orientation);

        tiles.push({ row, column, x: projected.x, y: projected.y });
      }
    }

    return tiles.sort((a, b) => a.y - b.y);
  }

  private getProjectedBounds(tiles: TileCenter[]) {
    return tiles.reduce(
      (bounds, tile) => ({
        minX: Math.min(bounds.minX, tile.x),
        maxX: Math.max(bounds.maxX, tile.x),
        minY: Math.min(bounds.minY, tile.y),
        maxY: Math.max(bounds.maxY, tile.y)
      }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );
  }

  private drawTile(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    terrain: TerrainType,
    reachable: boolean,
    selected: boolean
  ) {
    const style = TERRAIN_STYLES[terrain];

    graphics.fillStyle(style.fill, 1);
    graphics.lineStyle(1, style.line, 0.42);
    this.drawDiamond(graphics, x, y);
    graphics.fillPath();
    graphics.strokePath();

    if (reachable) {
      graphics.fillStyle(0xcadf8f, 0.28);
      this.drawDiamond(graphics, x, y);
      graphics.fillPath();
    }

    if (selected) {
      graphics.lineStyle(3, 0xf4e2a1, 0.92);
      this.drawDiamond(graphics, x, y);
      graphics.strokePath();
    }

    this.drawTerrainDetail(graphics, x, y, terrain);
  }

  private drawDiamond(graphics: Phaser.GameObjects.Graphics, x: number, y: number) {
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x + TILE_WIDTH / 2, y + TILE_HEIGHT / 2);
    graphics.lineTo(x, y + TILE_HEIGHT);
    graphics.lineTo(x - TILE_WIDTH / 2, y + TILE_HEIGHT / 2);
    graphics.closePath();
  }

  private drawTerrainDetail(graphics: Phaser.GameObjects.Graphics, x: number, y: number, terrain: TerrainType) {
    switch (terrain) {
      case "road":
        graphics.lineStyle(8, 0x9b835f, 0.72);
        graphics.lineBetween(x - 18, y + 27, x + 18, y + 9);
        graphics.lineStyle(2, 0xbca477, 0.65);
        graphics.lineBetween(x - 16, y + 27, x + 18, y + 10);
        break;
      case "mud":
        graphics.fillStyle(0x32271e, 0.35);
        graphics.fillEllipse(x - 8, y + 20, 18, 7);
        graphics.fillEllipse(x + 9, y + 25, 14, 6);
        break;
      case "trench":
        graphics.lineStyle(6, 0x352317, 0.86);
        graphics.lineBetween(x - 18, y + 20, x + 18, y + 20);
        graphics.lineStyle(2, 0x9b8260, 0.7);
        graphics.lineBetween(x - 17, y + 14, x + 17, y + 14);
        break;
      case "crater":
        graphics.fillStyle(0x262016, 0.58);
        graphics.fillEllipse(x, y + 20, 24, 11);
        graphics.lineStyle(2, 0xa38d67, 0.35);
        graphics.strokeEllipse(x, y + 20, 27, 13);
        break;
      case "forest":
        graphics.fillStyle(0x314823, 0.88);
        graphics.fillTriangle(x - 17, y + 22, x - 7, y + 6, x + 2, y + 22);
        graphics.fillTriangle(x + 4, y + 25, x + 14, y + 7, x + 24, y + 25);
        graphics.fillStyle(0x4a2e1d, 0.9);
        graphics.fillRect(x - 9, y + 20, 4, 6);
        graphics.fillRect(x + 12, y + 23, 4, 6);
        break;
      case "wire":
        graphics.lineStyle(2, 0xb6b3a1, 0.8);
        graphics.beginPath();
        graphics.moveTo(x - 24, y + 19);
        graphics.lineTo(x - 12, y + 13);
        graphics.lineTo(x, y + 21);
        graphics.lineTo(x + 12, y + 13);
        graphics.lineTo(x + 24, y + 19);
        graphics.strokePath();
        break;
      case "sandbags":
        graphics.fillStyle(0xb49b72, 0.9);
        for (let index = -2; index <= 2; index += 1) {
          graphics.fillEllipse(x + index * 9, y + 20, 11, 6);
        }
        break;
      case "objective":
        graphics.lineStyle(3, 0x3b2f24, 0.9);
        graphics.lineBetween(x - 4, y + 28, x - 4, y + 8);
        graphics.fillStyle(0xb8c46b, 0.88);
        graphics.fillTriangle(x - 3, y + 9, x + 16, y + 14, x - 3, y + 19);
        break;
      case "water":
        graphics.lineStyle(2, 0x8fb4b4, 0.55);
        graphics.lineBetween(x - 20, y + 17, x + 3, y + 12);
        graphics.lineBetween(x - 5, y + 26, x + 20, y + 21);
        break;
      case "bridge":
        graphics.fillStyle(0x4f3622, 0.8);
        graphics.fillRect(x - 22, y + 15, 44, 10);
        graphics.lineStyle(1, 0xb18b61, 0.8);
        graphics.lineBetween(x - 16, y + 14, x - 16, y + 26);
        graphics.lineBetween(x, y + 13, x, y + 27);
        graphics.lineBetween(x + 16, y + 14, x + 16, y + 26);
        break;
      case "open":
        break;
    }
  }

  private renderUnits() {
    const sortedUnits = [...this.units].sort((a, b) => {
      const aCenter = this.tileCenters.get(positionKey(a.position));
      const bCenter = this.tileCenters.get(positionKey(b.position));

      return (aCenter?.y ?? 0) - (bCenter?.y ?? 0);
    });

    for (const unit of sortedUnits) {
      const center = this.tileCenters.get(positionKey(unit.position));

      if (!center) {
        continue;
      }

      const container = this.add.container(center.x, center.y + 8);
      container.setDepth(center.y + 100);
      this.boardLayer.add(container);
      this.drawUnit(container, unit);
    }
  }

  private drawUnit(container: Phaser.GameObjects.Container, unit: UnitState) {
    const graphics = this.add.graphics();
    const teamColor = TEAM_COLORS[unit.team];
    const accent = UNIT_ACCENTS[unit.kind];
    const isSelected = unit.id === this.selectedUnitId;

    if (unit.hasMoved) {
      graphics.setAlpha(0.58);
    }

    graphics.fillStyle(0x0c0f0b, 0.35);
    graphics.fillEllipse(0, 20, unit.kind === "fieldGun" ? 48 : 34, 12);

    if (isSelected) {
      graphics.lineStyle(3, 0xf4e2a1, 0.95);
      graphics.strokeEllipse(0, 20, unit.kind === "fieldGun" ? 52 : 38, 16);
    }

    switch (unit.kind) {
      case "lightTank":
        this.drawTankUnit(graphics, teamColor, accent);
        break;
      case "fieldGun":
        this.drawFieldGunUnit(graphics, teamColor, accent);
        break;
      case "machineGun":
        this.drawCrewUnit(graphics, teamColor, accent);
        break;
      case "engineer":
        this.drawSoldierUnit(graphics, teamColor, accent, "tool");
        break;
      case "grenadier":
        this.drawSoldierUnit(graphics, teamColor, accent, "grenade");
        break;
      case "rifle":
        this.drawSoldierUnit(graphics, teamColor, accent, "rifle");
        break;
    }

    container.add(graphics);
  }

  private drawSoldierUnit(
    graphics: Phaser.GameObjects.Graphics,
    teamColor: number,
    accent: number,
    equipment: "rifle" | "grenade" | "tool",
    offsetX = 0,
    offsetY = 0
  ) {
    graphics.fillStyle(teamColor, 1);
    graphics.fillRoundedRect(offsetX - 8, offsetY + 1, 16, 20, 4);
    graphics.fillStyle(0xd2b98c, 1);
    graphics.fillCircle(offsetX, offsetY - 6, 7);
    graphics.fillStyle(accent, 1);
    graphics.fillEllipse(offsetX, offsetY - 10, 18, 8);
    graphics.lineStyle(3, 0x211b15, 0.9);
    graphics.lineBetween(offsetX - 5, offsetY + 20, offsetX - 9, offsetY + 28);
    graphics.lineBetween(offsetX + 5, offsetY + 20, offsetX + 9, offsetY + 28);

    if (equipment === "rifle") {
      graphics.lineStyle(3, 0x2f251a, 0.95);
      graphics.lineBetween(offsetX + 8, offsetY + 4, offsetX + 20, offsetY + 16);
    }

    if (equipment === "grenade") {
      graphics.fillStyle(0x2f3a22, 1);
      graphics.fillCircle(offsetX + 13, offsetY + 8, 4);
    }

    if (equipment === "tool") {
      graphics.lineStyle(3, 0x5a402a, 0.95);
      graphics.lineBetween(offsetX + 10, offsetY, offsetX + 19, offsetY + 16);
      graphics.lineStyle(2, 0xc9b074, 0.95);
      graphics.lineBetween(offsetX + 15, offsetY + 12, offsetX + 22, offsetY + 10);
    }
  }

  private drawCrewUnit(graphics: Phaser.GameObjects.Graphics, teamColor: number, accent: number) {
    this.drawSoldierUnit(graphics, teamColor, accent, "rifle", 8, 0);
    this.drawSoldierUnit(graphics, teamColor, accent, "tool", -14, 4);
    graphics.fillStyle(0x1d211f, 1);
    graphics.fillRect(3, 10, 26, 5);
    graphics.lineStyle(2, 0x1d211f, 1);
    graphics.lineBetween(12, 15, 4, 27);
    graphics.lineBetween(20, 15, 29, 27);
  }

  private drawFieldGunUnit(graphics: Phaser.GameObjects.Graphics, teamColor: number, accent: number) {
    graphics.fillStyle(teamColor, 1);
    graphics.fillCircle(-18, 5, 7);
    graphics.fillStyle(accent, 1);
    graphics.fillEllipse(-18, 1, 15, 7);
    graphics.fillStyle(0x30322c, 1);
    graphics.fillRect(-3, 10, 30, 7);
    graphics.fillRect(14, 5, 26, 5);
    graphics.fillCircle(-2, 18, 7);
    graphics.fillCircle(24, 18, 7);
    graphics.lineStyle(2, 0x1d211a, 0.9);
    graphics.lineBetween(5, 18, -16, 30);
    graphics.lineBetween(18, 18, 36, 30);
  }

  private drawTankUnit(graphics: Phaser.GameObjects.Graphics, teamColor: number, accent: number) {
    graphics.fillStyle(accent, 1);
    graphics.fillRoundedRect(-22, 5, 44, 18, 6);
    graphics.fillStyle(teamColor, 1);
    graphics.fillRoundedRect(-11, -3, 22, 16, 5);
    graphics.fillStyle(0x20251d, 0.85);
    graphics.fillCircle(-13, 23, 4);
    graphics.fillCircle(0, 23, 4);
    graphics.fillCircle(13, 23, 4);
    graphics.lineStyle(4, 0x2b2f2a, 1);
    graphics.lineBetween(6, 4, 27, 0);
  }

  private renderUi() {
    this.uiObjects.forEach((object) => object.destroy());
    this.uiObjects.length = 0;
    this.buttons.length = 0;

    this.addUiText(26, 18, "Great War: The Rematch", 24, "#f4ead2", 0, "Georgia, 'Times New Roman', serif");
    this.addUiText(28, 52, `${TEAM_NAMES[this.activeTeam]} Turn`, 16, this.activeTeam === "blue" ? "#b7d2ff" : "#e7b5a7");

    const selectedUnit = this.getSelectedUnit();
    const unitText = selectedUnit
      ? `${selectedUnit.name}  Move ${selectedUnit.hasMoved ? "spent" : selectedUnit.move}`
      : "Select a unit";

    this.addUiText(28, 476, unitText, 16, "#f4ead2");
    this.addUiText(28, 500, `Zoom ${Math.round(this.boardZoom * 100)}%  View ${this.orientation + 1}/4`, 13, "#cfd6bf");

    this.addButton("+", 720, 20, 38, 34, () => this.setZoom(this.boardZoom + 0.1));
    this.addButton("-", 764, 20, 38, 34, () => this.setZoom(this.boardZoom - 0.1));
    this.addButton("<", 814, 20, 38, 34, () => this.rotateBoard(-1));
    this.addButton(">", 858, 20, 38, 34, () => this.rotateBoard(1));
    this.addButton("End", 810, 476, 92, 36, () => this.endTurn());
  }

  private addUiText(
    x: number,
    y: number,
    text: string,
    fontSize: number,
    color: string,
    originX = 0,
    fontFamily = "Arial, sans-serif"
  ) {
    const gameObject = this.add
      .text(x, y, text, {
        color,
        fontFamily,
        fontSize: `${fontSize}px`
      })
      .setOrigin(originX, 0);

    this.uiObjects.push(gameObject);
  }

  private addButton(label: string, x: number, y: number, width: number, height: number, action: () => void) {
    const graphics = this.add.graphics();

    graphics.fillStyle(0x2b3125, 0.96);
    graphics.fillRoundedRect(x, y, width, height, 6);
    graphics.lineStyle(1, 0xaeb98b, 0.7);
    graphics.strokeRoundedRect(x, y, width, height, 6);

    const text = this.add
      .text(x + width / 2, y + height / 2, label, {
        color: "#f4ead2",
        fontFamily: "Arial, sans-serif",
        fontSize: label === "End" ? "14px" : "20px",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    this.uiObjects.push(graphics, text);
    this.buttons.push({ label, x, y, width, height, action });
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    const button = this.buttons.find(
      (candidate) =>
        pointer.x >= candidate.x &&
        pointer.x <= candidate.x + candidate.width &&
        pointer.y >= candidate.y &&
        pointer.y <= candidate.y + candidate.height
    );

    if (button) {
      button.action();
      return;
    }

    const tile = this.findTileAtPointer(pointer.x, pointer.y);

    if (tile) {
      this.handleTileClick(tile);
    }
  }

  private findTileAtPointer(pointerX: number, pointerY: number): GridPosition | null {
    const localX = (pointerX - this.boardLayer.x) / this.boardZoom;
    const localY = (pointerY - this.boardLayer.y) / this.boardZoom;

    for (const tile of this.tileCenters.values()) {
      const dx = Math.abs(localX - tile.x) / (TILE_WIDTH / 2);
      const dy = Math.abs(localY - (tile.y + TILE_HEIGHT / 2)) / (TILE_HEIGHT / 2);

      if (dx + dy <= 1) {
        return { row: tile.row, column: tile.column };
      }
    }

    return null;
  }

  private handleTileClick(tile: GridPosition) {
    const unit = this.units.find((candidate) => isSamePosition(candidate.position, tile));
    const selectedUnit = this.getSelectedUnit();

    if (unit) {
      this.selectUnit(unit);
      return;
    }

    if (selectedUnit && this.reachableTiles.some((position) => isSamePosition(position, tile))) {
      selectedUnit.position = tile;
      selectedUnit.hasMoved = true;
      this.selectedUnitId = null;
      this.reachableTiles = [];
      this.render();
    }
  }

  private selectUnit(unit: UnitState) {
    if (unit.team !== this.activeTeam || unit.hasMoved) {
      this.selectedUnitId = unit.id;
      this.reachableTiles = [];
      this.render();
      return;
    }

    this.selectedUnitId = unit.id;
    this.reachableTiles = getReachableTiles(this.map, this.units, unit);
    this.render();
  }

  private getSelectedUnit() {
    return this.units.find((unit) => unit.id === this.selectedUnitId) ?? null;
  }

  private setZoom(nextZoom: number) {
    this.boardZoom = Phaser.Math.Clamp(Number(nextZoom.toFixed(2)), 0.75, 1.35);
    this.boardLayer.setScale(this.boardZoom);
    this.renderUi();
  }

  private rotateBoard(direction: -1 | 1) {
    const next = (this.orientation + direction + 4) % 4;
    this.orientation = next as BoardOrientation;
    this.render();
  }

  private endTurn() {
    this.activeTeam = this.activeTeam === "blue" ? "red" : "blue";
    this.selectedUnitId = null;
    this.reachableTiles = [];

    for (const unit of this.units) {
      if (unit.team === this.activeTeam) {
        unit.hasMoved = false;
      }
    }

    this.render();
  }
}