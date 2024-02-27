import { GUIComponent } from "@/types/gui";
import IDGenerator from "../util/idGenerator";

export default class GUI {
  private _elements: Map<number, GUIComponent> = new Map();
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
  addElement(element: GUIComponent): number {
    const GUIComponentID = IDGenerator.new();
    this._elements.set(GUIComponentID, element);
    return GUIComponentID;
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
