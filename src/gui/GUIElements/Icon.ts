export default class Icon implements GUIElement {
  path: string;
  width: number;
  height: number;
  position: Vec2D = { x: 0, y: 0 };
  strokeColor: string;
  fillColor?: string;

  constructor(
    svgPath: string,
    width: number,
    height: number,
    position: Vec2D,
    strokeColor: string,
    fillColor?: string
  ) {
    this.path = svgPath;
    this.width = width;
    this.height = height;
    this.position = position;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const path = new Path2D(this.path);
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    const scale = Math.min(this.width / ctx.canvas.width, this.height / ctx.canvas.height);
    ctx.scale(scale, scale);
    ctx.strokeStyle = this.strokeColor;
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
      ctx.fill(path);
    }

    ctx.stroke(path);
    ctx.restore();
  }
}
