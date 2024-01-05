import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";
import { GUIText } from "./gui/GUIElements/GUIText";
import { Button } from "./gui/GUIElements/Button";
import { Input } from "./gui/GUIElements/Input";
import { Icon } from "./gui/GUIElements/Icon";
import GUI from "./gui/Gui";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");


class MyInput extends Input{
  constructor() {
    super("Test btn", 30, "Arial", "#00ff00", 400, canvas!, 80, 200);
    this.position.x = 300;
    this.position.y = 100;
  }
}
class MyButton extends Button {
  constructor() {
    super("Input", 30, "Arial", "#00ff00", 400);
    this.position.x = 100;
    this.position.y = 100;
  }

  override onClick(): void {
    if (this.color == "#ffffff") this.color = "#00ff00";
    else this.color = "#ffffff";
  }
}

class MyGame extends Drake.Engine {
  cube: Cube;
  axis;
  icon: Icon;
  ranbowText: GUIText | undefined;
  hue: number = 0;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.cube = new Drake.Cube([10, 10, -14]);
    this.axis = new Drake.GameObject("objects/axis.obj");
    // Heart icon, problem with svg sizes @MrFishPL
    // What problem? ~MrFishPL
    this.icon = new Icon(
      "M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181",
      1050,
      1050,
      { x: 20, y: 20 }
    );
  }

  handleCameraMove(e: KeyboardEvent) {
    if (e.key === "w") this.currentScene!.sceneCamera!.move(0, 1, 0);
    if (e.key === "s") this.currentScene!.sceneCamera!.move(0, -1, 0);
    if (e.key === "a") this.currentScene!.sceneCamera!.move(-1, 0, 0);
    if (e.key === "d") this.currentScene!.sceneCamera!.move(1, 0, 0);
  }

  override Start(): void {
    this.setResolution(640, 480);
    const camera = new Drake.Camera(90, 0.1, 1000, [10, 10, -15], [0, 0, 1]);
    const mainSceneGUI = new GUI(this.getCanvas, this.getCanvas.getContext("2d")!);
    // mainSceneGUI.hideCursor = true;
    mainSceneGUI.addElement(this.icon);

    const exampleText = new GUIText(
      "Hihihihihihihahi",
      24,
      "monospace",
      "#00ff00",
      900
    );
    const exampleText2 = new GUIText(
      "Lorem ipsum dolor sit amet",
      24,
      "monospace",
      "#0000ff",
      900
    );
    // this.ranbowText = new RainboxText();

    // To create click event you must extend Button class

    exampleText.position.x = this.width - exampleText.width - 20;
    exampleText.position.y = 20;
    // this.ranbowText.position.x = 20;
    // this.ranbowText.position.y = this.height - 20;

    exampleText2.position.x = this.width - exampleText2.width - 20;
    exampleText2.position.y = 30 + exampleText.height;

    mainSceneGUI.addElement(exampleText);
    mainSceneGUI.addElement(exampleText2);
    // mainSceneGUI.addElement(this.ranbowText);
    const btn = new MyButton();
    mainSceneGUI.addElement(btn);
    const input = new MyInput();
    mainSceneGUI.addElement(input);
    const mainScene = new Drake.Scene(
      this.width,
      this.height,
      this.idGenerator.id
    );

    const mainSceneGUIId = mainScene.addGUI(mainSceneGUI);
    mainScene.setCamera(camera);
    mainScene.setCurrentGUI(mainSceneGUIId);

    const mainSceneId = this.addScene(mainScene);
    this.setCurrentScene(mainSceneId);

    this.currentScene.addSceneMesh(this.cube);
    this.currentScene.addSceneMesh(this.axis);

    document.addEventListener("keydown", this.handleCameraMove.bind(this));
  }

  override Update(): void {
    this.cube.rotate(1 * this.deltaTime, 0.5 * this.deltaTime, 0);
  }
}

const game = new MyGame(canvas);
game.run();
