import GUIText from "./GUIText";

export default class Input extends GUIText implements GUIElement, Clickable {
  isFocused: boolean = false;
  private predefinedWidth: number;
  private predefinedHeight: number;
  border: GUIDirectionalProperty<{ color: string; width: number }> = {
    top: { color: "#f00", width: 6 },
    bottom: { color: "#f00", width: 6 },
    left: { color: "#fff", width: 6 },
    right: { color: "#fff", width: 6 },
  };

  padding: GUIDirectionalProperty<number> = { top: 0, bottom: 0, left: 0, right: 0 };

  constructor(
    text: string,
    fontSize: number,
    fontFamily: string,
    color: string,
    fontWeight: number = 400,
    predefiniedHeight: number,
    predefinedWidth: number
  ) {
    super(text, fontSize, fontFamily, color, fontWeight);
    this.predefinedHeight = predefiniedHeight;
    this.predefinedWidth = predefinedWidth;
    const textHeight = this.fontSize;
    const totalVerticalPadding = this.predefinedHeight - textHeight;
    this.padding.top = totalVerticalPadding / 2;
    this.padding.bottom = totalVerticalPadding / 2;
    const textWidth = 100;
    this.padding.left = (this.predefinedWidth - textWidth) / 2;
    this.padding.right = this.padding.left;
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  override render(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    let textToDisplay = this.text;
    let textWidth = ctx.measureText(textToDisplay).width;

    ctx.fillStyle = this.color;

    // Check if the text exceeds the predefined width
    while (textWidth + 10 > this.predefinedWidth && textToDisplay.length > 0) {
      textToDisplay = textToDisplay.substring(0, textToDisplay.length - 1);
      textWidth = ctx.measureText(textToDisplay).width;
    }
    ctx.fillStyle = this.color;
    ctx.fillText(
      textToDisplay,
      this.position.x + 5, // Adjust the x position as needed
      this.position.y + this.padding.top + this.fontSize - 5 // Adjust the y position as needed
    );

    const borderBox = {
      left: this.position.x,
      top: this.position.y,
      right: this.position.x + this.predefinedWidth,
      bottom: this.position.y + this.predefinedHeight,
    };

    // Left
    this.drawLine(
      ctx,
      { x: borderBox.left, y: borderBox.top },
      { x: borderBox.left, y: borderBox.bottom },
      this.border.left.color,
      this.border.left.width
    );

    // Right
    this.drawLine(
      ctx,
      { x: borderBox.right - this.border.left.width, y: borderBox.top },
      { x: borderBox.right - this.border.left.width, y: borderBox.bottom },
      this.border.right.color,
      this.border.right.width
    );

    // Top
    this.drawLine(
      ctx,
      { x: borderBox.left - this.border.top.width / 2, y: borderBox.top },
      { x: borderBox.right - this.border.top.width / 2, y: borderBox.top },
      this.border.top.color,
      this.border.top.width
    );

    // Bottom
    this.drawLine(
      ctx,
      { x: borderBox.left - this.border.top.width / 2, y: borderBox.bottom },
      { x: borderBox.right - this.border.top.width / 2, y: borderBox.bottom },
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

  handleKeyDown(event: KeyboardEvent) {
    if (!this.isFocused) return;

    if (event.key === "Backspace") {
      this.text = this.text.slice(0, -1);
    } else if (event.key.length === 1) {
      this.text += event.key;
    }
  }

  onClick(): void {
    this.isFocused = true;
    console.log("clicked");
  }
  onClickOutside(): void {
    this.isFocused = false;
  }

  onHover(): void {}
}
