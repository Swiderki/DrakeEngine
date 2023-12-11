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

export class Text implements GuiElement {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  position: { x: number; y: number } = { x: 0, y: 0 };
  protected _width: number | undefined;
  protected _height: number | undefined;
  constructor(text: string, fontSize: number, fontFamily: string, fontWeight: number = 400) {
    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
  }

  // You implement height width and position as getters and setters
  // A programmer can decide how they wants it
  // In text, we have to return this._width or calculate this value if this._width is unset
  // Or maybe its better to calculate this ones, in constructor?
  // Idk
  get width(): number {
    throw new Error("Method not implemented.");
  }
  set width(value: number) {
    throw new Error("Method not implemented.");
  }
  get height(): number {
    throw new Error("Method not implemented.");
  }
  set height(value: number) {
    throw new Error("Method not implemented.");
  }

  render(ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }
}

// extends GUI was there
// I don't get why if GUI is like container for GuiElements
export class Button extends Text implements GuiElement {
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
    // If _width is undefined, we have to calculate it using super.width, padding etc
    if (this._width == undefined) return 0;
    return this._width;
  }

  override set width(value: number) {
    this._width = value;
  }

  override get height(): number {
    // If _height is undefined, we have to calculate it using super.height, padding etc
    if (this._height == undefined) return 0;
    return this._height;
  }

  override set height(value: number) {
    this._height = value;
  }

  constructor(text: string, fontSize: number, fontFamily: string, fontWeight: number = 400) {
    super(text, fontSize, fontFamily, fontWeight);
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
  
    constructor(svgPath: string, width: number, height: number, position: {x: number, y: number}) {
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
        const scale = Math.min(this._width / ctx.canvas.width, this._height / ctx.canvas.height);
        ctx.scale(scale, scale);
        ctx.stroke(path); 
        ctx.restore(); 
    }
  
  }
  