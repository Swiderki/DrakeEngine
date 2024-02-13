export type GUIElement = {
  height: number;
  width: number;
  position: { x: number; y: number };

  render(ctx: CanvasRenderingContext2D): void;
};

export type Clickable = {
  onClick(): void;
  onClickOutside(): void;
  onHover(): void;
  isCoordInElement(x: number, y: number): boolean;
  width: number;
  height: number;
};

export type GUIDirectionalProperty<T> = {
  top: T;
  bottom: T;
  left: T;
  right: T;
};
