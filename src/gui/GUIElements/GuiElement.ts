export default interface GuiElement {
  height: number;
  width: number;
  position: { x: number; y: number };

  render(ctx: CanvasRenderingContext2D): void;
}
