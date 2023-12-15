import GUI from "./Gui";

export default interface GuiElement {
  height: number;
  width: number;
  position: { x: number; y: number };

  render(ctx: CanvasRenderingContext2D): void;
}

export class GUIText implements GuiElement {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  position: { x: number; y: number } = { x: 0, y: 0 };
  protected _width: number | null = null;
  protected _height: number | null = null;
  get width(): number {
    if (this._width == null) return this.getTextWidth();
    return this._width;
  }

  set width(width: number) {
    this._width = width;
  }

  get height(): number {
    if (this._height == null) return this.getTextHeight();
    return this._height;
  }

  set height(height: number) {
    this._height = height;
  }

  constructor(
    text: string,
    fontSize: number,
    fontFamily: string,
    color: string,
    fontWeight: number
  ) {
    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
    this.color = color;
  }

  private getTextWidth(): number {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx!.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;

    const metrics = ctx!.measureText(this.text);
    return metrics.width;
  }

  private getTextHeight(): number {
    // Create a false canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx!.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;

    // Use the measureText method to get the text metrics
    const metrics = ctx!.measureText(this.text);
    // Calculate the actual height by considering the metrics
    const actualHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // In case actualHeight is not available, fallback to an approximation
    // This is a simplification and may not be accurate for all fonts
    const approxHeight = this.fontSize * 1.2; // 1.2 is a general factor that works for most fonts

    return actualHeight || approxHeight;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle = this.color;

    ctx.fillText(this.text, this.position.x, this.position.y + this.height);
  }
}

export interface Clickable {
  onClick(): void;
  onHover(): void;
  isCoordInElement(x: number, y: number): boolean;
  width: number;
  height: number;
}

export class Button extends GUIText implements GuiElement, Clickable {
  override position: { x: number; y: number } = { x: 0, y: 0 };

  border: {
    top: { color: string; width: number };
    bottom: { color: string; width: number };
    left: { color: string; width: number };
    right: { color: string; width: number };
  } = {
    top: { color: "#ff0000", width: 6 },
    bottom: { color: "#ff0000", width: 6 },
    left: { color: "#fff", width: 6 },
    right: { color: "#fff", width: 6 },
  };

  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } = {
    top: 20,
    bottom: 20,
    left: 40,
    right: 40,
  };

  constructor(
    text: string,
    fontSize: number,
    fontFamily: string,
    color: string,
    fontWeight: number = 400
  ) {
    super(text, fontSize, fontFamily, color, fontWeight);
  }

  override render(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle = this.color;

    ctx.fillText(
      this.text,
      this.position.x + this.padding.left,
      this.position.y + this.padding.top + this.height
    );

    // Drawing border
    // Lines such as "+ this.width / 2" force thing like "box-sizing"

    // Left
    this.drawLine(
      ctx,
      { x: this.position.x + this.border.left.width / 2, y: this.position.y },
      {
        x: this.position.x + this.border.left.width / 2,
        y:
          this.position.y +
          this.height +
          this.padding.top +
          this.padding.bottom,
      },
      this.border.left.color,
      this.border.left.width
    );

    // Right
    this.drawLine(
      ctx,
      {
        x:
          this.position.x +
          this.width -
          this.border.right.width / 2 +
          this.padding.left +
          this.padding.right,
        y: this.position.y,
      },
      {
        x:
          this.position.x +
          this.width -
          this.border.right.width / 2 +
          this.padding.left +
          this.padding.right,
        y:
          this.position.y +
          this.height +
          this.padding.top +
          this.padding.bottom,
      },
      this.border.right.color,
      this.border.right.width
    );

    // Top
    this.drawLine(
      ctx,
      { x: this.position.x, y: this.position.y + this.border.top.width / 2 },
      {
        x:
          this.position.x + this.width + this.padding.left + this.padding.right,
        y: this.position.y + this.border.top.width / 2,
      },
      this.border.top.color,
      this.border.top.width
    );

    // Bottom
    this.drawLine(
      ctx,
      {
        x: this.position.x,
        y:
          this.position.y +
          this.height -
          this.border.bottom.width / 2 +
          this.padding.top +
          this.padding.bottom,
      },
      {
        x:
          this.position.x + this.width + this.padding.left + this.padding.right,
        y:
          this.position.y +
          this.height -
          this.border.bottom.width / 2 +
          this.padding.top +
          this.padding.bottom,
      },
      this.border.bottom.color,
      this.border.bottom.width
    );
  }

  private drawLine(
    ctx: CanvasRenderingContext2D,
    start: { x: number; y: number },
    end: { x: number; y: number },
    color: string,
    width: number
  ) {
    if (width == 0) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);

    ctx.strokeStyle = color;

    ctx.lineWidth = width;

    ctx.stroke();
    ctx.restore();
  }

  isCoordInElement(x: number, y: number) {
    return (
      x >= this.position.x &&
      // prettier-ignore
      x <= this.position.x + this.width + this.padding.left + this.padding.right &&
      y >= this.position.y &&
      // prettier-ignore
      y <= this.position.y + this.height + this.padding.top + this.padding.bottom
    );
  }

  onClick(): void {}

  onHover(): void {}
}

export class Icon implements GuiElement {
  path: string;
  protected _width: number;
  protected _height: number;
  position: { x: number; y: number } = { x: 0, y: 0 };

  constructor(
    svgPath: string,
    width: number,
    height: number,
    position: { x: number; y: number }
  ) {
    this.path = svgPath;
    this._width = width;
    this._height = height;
    this.position = position;
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
    const scale = Math.min(
      this._width / ctx.canvas.width,
      this._height / ctx.canvas.height
    );
    ctx.scale(scale, scale);
    ctx.stroke(path);
    ctx.restore();
  }
}
