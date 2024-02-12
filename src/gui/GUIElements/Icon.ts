import GuiElement from "./GuiElement";
export class Icon implements GuiElement {
  path: string;
  protected _width: number;
  protected _height: number;
  position: { x: number; y: number } = { x: 0, y: 0 };
  fillColor?: string;
  strokeColor: string;
  constructor(
    svgPath: string,
    width: number,
    height: number,
    position: { x: number; y: number },
    strokeColor: string,
    fillColor?: string
  ) {
    this.path = svgPath;
    this._width = width;
    this._height = height;
    this.position = position;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }

  get width(): number {
    return this._width;
  }
  set width(value: number) {
    this._width = value;
  }
  get height(): number {
    return this._height;
  }
  set height(value: number) {
    this._height = value;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const path = new Path2D(this.path);
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    const scale = Math.min(this._width / ctx.canvas.width, this._height / ctx.canvas.height);
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
