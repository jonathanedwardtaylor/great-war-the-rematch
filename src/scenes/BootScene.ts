import Phaser from "phaser";

type TileTone = {
  fill: number;
  line: number;
};

const TILE_TONES: TileTone[] = [
  { fill: 0x6f7854, line: 0x343a29 },
  { fill: 0x4e5b43, line: 0x2f3528 },
  { fill: 0x7d6f55, line: 0x3d3529 },
  { fill: 0x5d6650, line: 0x303629 }
];

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#20251d");

    this.add
      .text(480, 44, "Great War: The Rematch", {
        color: "#f4ead2",
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "34px"
      })
      .setOrigin(0.5);

    this.add
      .text(480, 82, "HTML5 tactics prototype", {
        color: "#bfc9a9",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px"
      })
      .setOrigin(0.5);

    this.drawBattlefield();
    this.drawPrototypeUnits();
    this.drawFooter();
  }

  private drawBattlefield() {
    const graphics = this.add.graphics();
    const originX = 480;
    const originY = 138;
    const tileWidth = 72;
    const tileHeight = 36;
    const rows = 6;
    const columns = 8;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = originX + (column - row) * (tileWidth / 2);
        const y = originY + (column + row) * (tileHeight / 2);
        const tone = TILE_TONES[(row + column) % TILE_TONES.length];

        graphics.fillStyle(tone.fill, 1);
        graphics.lineStyle(2, tone.line, 0.9);
        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.lineTo(x + tileWidth / 2, y + tileHeight / 2);
        graphics.lineTo(x, y + tileHeight);
        graphics.lineTo(x - tileWidth / 2, y + tileHeight / 2);
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();

        if ((row === 1 && column > 1 && column < 6) || (row === 4 && column > 0 && column < 5)) {
          this.drawTrench(graphics, x, y, tileWidth, tileHeight);
        }

        if ((row === 2 && column === 5) || (row === 3 && column === 2)) {
          this.drawCrater(graphics, x, y, tileHeight);
        }
      }
    }
  }

  private drawTrench(graphics: Phaser.GameObjects.Graphics, x: number, y: number, tileWidth: number, tileHeight: number) {
    graphics.lineStyle(5, 0x3a261c, 0.85);
    graphics.beginPath();
    graphics.moveTo(x - tileWidth * 0.24, y + tileHeight * 0.54);
    graphics.lineTo(x + tileWidth * 0.24, y + tileHeight * 0.54);
    graphics.strokePath();

    graphics.lineStyle(2, 0x8a7155, 0.8);
    graphics.beginPath();
    graphics.moveTo(x - tileWidth * 0.22, y + tileHeight * 0.44);
    graphics.lineTo(x + tileWidth * 0.22, y + tileHeight * 0.44);
    graphics.strokePath();
  }

  private drawCrater(graphics: Phaser.GameObjects.Graphics, x: number, y: number, tileHeight: number) {
    graphics.fillStyle(0x2a241d, 0.7);
    graphics.fillEllipse(x, y + tileHeight * 0.55, 28, 14);
    graphics.lineStyle(2, 0x89765a, 0.45);
    graphics.strokeEllipse(x, y + tileHeight * 0.55, 31, 16);
  }

  private drawPrototypeUnits() {
    this.drawUnit(335, 242, 0x5676a4, "INF");
    this.drawUnit(405, 276, 0x5676a4, "MG");
    this.drawUnit(620, 256, 0x9b5b4a, "INF");
    this.drawUnit(690, 294, 0x9b5b4a, "ART");
  }

  private drawUnit(x: number, y: number, fill: number, label: string) {
    const base = this.add.ellipse(x, y + 10, 44, 22, 0x141611, 0.45);
    base.setDepth(10);

    const body = this.add.circle(x, y, 18, fill, 1);
    body.setStrokeStyle(3, 0xf0e6c8, 0.9);
    body.setDepth(11);

    this.add
      .text(x, y, label, {
        color: "#f7eed4",
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        fontStyle: "bold"
      })
      .setOrigin(0.5)
      .setDepth(12);
  }

  private drawFooter() {
    this.add
      .text(480, 492, "First target: one small skirmish with move, attack, end turn, and victory.", {
        color: "#d4d8c4",
        fontFamily: "Arial, sans-serif",
        fontSize: "15px"
      })
      .setOrigin(0.5);
  }
}
