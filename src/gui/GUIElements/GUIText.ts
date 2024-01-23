import GuiElement from "./GuiElement";

export class GUIText implements GuiElement {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  position: { x: number; y: number } = { x: 0, y: 0 };
  get width(): number {
    return this.getTextWidth();
  }
  
  get height(): number {
   return this.getTextHeight();
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

  protected getTextWidth(): number {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx!.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;

    const metrics = ctx!.measureText(this.text);
    return Math.round(metrics.width);
  }

  protected getTextHeight(): number {
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

    return Math.round(actualHeight) || Math.round(approxHeight);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle = this.color;

    ctx.fillText(this.text, this.position.x, this.position.y + this.height);
  }
}
