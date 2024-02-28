export type GUIComponent = {
  render(ctx: CanvasRenderingContext2D): void;
};

export type GUIElement = GUIComponent & {
  height: number;
  width: number;
  position: { x: number; y: number };
};

export type HoverLeaveCallback = () => unknown;

export type Clickable = {
  onClick(): void;
  onClickOutside(): void;
  _isHoverActive: boolean;
  _hoverLeaveCallback?: HoverLeaveCallback;
  onHover(): void | HoverLeaveCallback;
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
