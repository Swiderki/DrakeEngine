// Klasa gui, jedno gui do sceny

import IdGenerator from "../util/idGenerator";
import GuiElement from "./guiElement";

// I didn't touch it very much so it may require more review
// I will work on it tomorrow

// gui element (width, position, interface)
export default class GUI {
  private _elements: Map<number, GuiElement> = new Map();
  private _idGenerator = new IdGenerator();

  get elements() { return this._elements };

  constructor() {
    this.addEventListeners();
  }

  // Main methods

  addElement(element: GuiElement): number {
    const guiElementId = this._idGenerator.id;
    this._elements.set(guiElementId, element);

    return guiElementId;
  }

  removeElement(elementId: number) {
    if (!this._elements.has(elementId)) throw new Error("A GUI element with the given id was not found.");
    this._elements.delete(elementId);
  }

  // Render logic is implemented in Engine class
  // For example GameObject does not have render function
  // So it shoud not have also
  // renderGui() {  }
  handleEvent() {}

  // It shoud be private
  // Using it by the user may couse some unexpected errors
  private addEventListeners() {}
}
