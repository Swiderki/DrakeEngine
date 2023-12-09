// Klasa gui, jedno gui do sceny

import GuiElement from "./guiElement";

// I didn't touch it very much so it may require more review
// I will work on it tomorrow

// gui element (width, position, interface)
export default class GUI {
  elements: Array<GuiElement> = [];

  constructor() {
    this.addEventListeners();
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
