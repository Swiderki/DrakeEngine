import { Clickable, GUIDirectionalProperty, GUIElement, HoverLeaveCallback } from "@/types/gui";
import GUIText from "./GUIText";

export default class Button extends GUIText implements GUIElement, Clickable {
  _isHoverActive: boolean = false;
  _hoverLeaveCallback?: HoverLeaveCallback;

  border: GUIDirectionalProperty<{ color: string; width: number }> = {
    top: { color: "#ffffff", width: 1 },
    bottom: { color: "#ffffff", width: 1 },
    left: { color: "#ffffff", width: 1 },
    right: { color: "#ffffff", width: 1 },
  };

  padding: GUIDirectionalProperty<number> = {
    top: 20,
    bottom: 20,
    left: 40,
    right: 40,
  };

  constructor(text: string, fontSize: number, fontFamily: string, color: string, fontWeight: number = 400) {
    super(text, fontSize, fontFamily, color, fontWeight);
  }

  override render(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle = this.color;

    ctx.fillText(
      this.text,
      this.position.x + this.padding.left,
      this.position.y + this.padding.top + this.getTextHeight()
    );

    // Drawing border
    // Lines such as "+ this.width / 2" force thing like "box-sizing"

    // Left
    this.drawLine(
      ctx,
      { x: this.position.x + this.border.left.width / 2, y: this.position.y },
      {
        x: this.position.x + this.border.left.width / 2,
        y: this.position.y + this.getTextHeight() + this.padding.top + this.padding.bottom,
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
          this.getTextWidth() -
          this.border.right.width / 2 +
          this.padding.left +
          this.padding.right,
        y: this.position.y,
      },
      {
        x:
          this.position.x +
          this.getTextWidth() -
          this.border.right.width / 2 +
          this.padding.left +
          this.padding.right,
        y: this.position.y + this.getTextHeight() + this.padding.top + this.padding.bottom,
      },
      this.border.right.color,
      this.border.right.width
    );

    // Top
    this.drawLine(
      ctx,
      { x: this.position.x, y: this.position.y + this.border.top.width / 2 },
      {
        x: this.position.x + this.getTextWidth() + this.padding.left + this.padding.right,
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
          this.getTextHeight() -
          this.border.bottom.width / 2 +
          this.padding.top +
          this.padding.bottom,
      },
      {
        x: this.position.x + this.getTextWidth() + this.padding.left + this.padding.right,
        y:
          this.position.y +
          this.getTextHeight() -
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
  onClickOutside(): void {}
  onHover(): void | HoverLeaveCallback {}
}
