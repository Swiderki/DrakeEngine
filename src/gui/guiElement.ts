/* WORK IN PROGRESS */

import GUI from "./Gui";

export default interface GuiElement {
  // It don't have to be getters and setters in the interface
  // Because you can implement them that way if you want
  // Example in Text class
  // You can translate "Interfase" as "Międzymordzie" btw
  height: number;
  width: number;
  position: { x: number; y: number };

  // Every element has its own rendering logic so it has to implement render function
  // But render function must get ctx value as a parameter to draw on
  render(ctx: CanvasRenderingContext2D): void;

  // Only buttons shoud have these methods
  // You don't want to click on text
  // You can make button look like a simple text but that will still be a button
  // onClick(): void;
  // onHover(): void;
}


// THIS SHIT DOESNT WORK HAHAHHAHAHAHAHA
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
    fontWeight: number,
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

    // Drawing text
    ctx.fillText(this.text, this.position.x, this.position.y);
  }
}

// extends GUI was there
// I don't get why if GUI is like container for GuiElements
export class Button extends GUIText implements GuiElement {
  override position: { x: number; y: number } = { x: 0, y: 0 };

  // There are some objects having top, bottom, left and right value
  // Maybe it is a good idea to implement a type for them.
  border: {
    top: { color: string; width: number };
    bottom: { color: string; width: number };
    left: { color: string; width: number };
    right: { color: string; width: number };
  } = {
    top: { color: "#fff", width: 1 },
    bottom: { color: "#fff", width: 1 },
    left: { color: "#fff", width: 1 },
    right: { color: "#fff", width: 1 },
  };

  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  override get width(): number {
    // If _width is null, we have to calculate it using super.width, padding etc
    if (this._width == null) return 0;
    return this._width;
  }

  override set width(value: number) {
    this._width = value;
  }

  override get height(): number {
    // If _height is null, we have to calculate it using super.height, padding etc
    if (this._height == null) return 0;
    return this._height;
  }

  override set height(value: number) {
    this._height = value;
  }

  constructor(
    text: string,
    fontSize: number,
    fontFamily: string,
    color: "#fff",
    fontWeight: number = 400
  ) {
    super(text, fontSize, fontFamily, color, fontWeight);
  }

  override render(ctx: CanvasRenderingContext2D) {}

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
