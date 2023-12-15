import IdGenerator from "../util/idGenerator";
import GuiElement from "./GUIElements/GuiElement";

export default class GUI {
  private _elements: Map<number, GuiElement> = new Map();
  private _idGenerator = new IdGenerator();
  private _hideCursor: boolean = false;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  get hideCursor() {
    return this._hideCursor;
  }

  set hideCursor(value: boolean) {
    this._hideCursor = value;
    if (value) this.canvas.style.cursor = "none";
    if (!value) this.canvas.style.cursor = "default";
  }

  get elements() {
    return this._elements;
  }

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  // Main methods
  addElement(element: GuiElement): number {
    const guiElementId = this._idGenerator.id;
    this._elements.set(guiElementId, element);

    return guiElementId;
  }

  removeElement(elementId: number) {
    if (!this._elements.has(elementId))
      throw new Error("A GUI element with the given id was not found.");
    this._elements.delete(elementId);
  }

  render() {
    this.elements.forEach((el) => {
      el.render(this.ctx);
    });
  }
}
