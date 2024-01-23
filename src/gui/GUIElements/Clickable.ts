export interface Clickable {
  onClick(): void;
  onClickOutside(): void
  onHover(): void;
  isCoordInElement(x: number, y: number): boolean;
  width: number;
  height: number;
}