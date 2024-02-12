import IDGenerator from "../util/IDGenerator";

export default class GUI {
  private _elements: Map<number, GUIElement> = new Map();
  private _isCursorHidden: boolean = false;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  get isCursorHidden() { return this._isCursorHidden; } // prettier-ignore
  set isCursorHidden(value: boolean) {
    this._isCursorHidden = value;
    if (value) this.canvas.style.cursor = "none";
    if (!value) this.canvas.style.cursor = "default";
  }
  get elements() { return this._elements; } // prettier-ignore

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  // Main methods
  addElement(element: GUIElement): number {
    const guiElementID = IDGenerator.new();
    this._elements.set(guiElementID, element);
    return guiElementID;
  }

  removeElement(elementID: number) {
    if (!this._elements.has(elementID)) throw new Error("A GUI element with the given id was not found.");
    this._elements.delete(elementID);
  }

  render() {
    this.elements.forEach((el) => {
      el.render(this.ctx);
    });
  }
}
