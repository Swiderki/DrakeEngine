import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";
// TODO: It should be added to Drake
import { Icon } from "./gui/guiElement";
import GUI from "./gui/Gui";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cube: Cube;
  axis;
  icon: Icon;
  constructor(canvas: HTMLCanvasElement) {
    
    super(canvas);
    this.cube = new Drake.Cube([10, 10, -14]);
    this.axis = new Drake.GameObject("objects/axis.obj");
    // Heart icon, problem with svg sizes @MrFishPL
    // What problem? ~MrFishPL
    this.icon = new Icon("M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181", 1050 ,1050, {x: 20, y: 20});
  }

  handleCameraMove(e: KeyboardEvent) {
    if (e.key === "w") this.currentScene!.sceneCamera!.move(0, 1, 0);
    if (e.key === "s") this.currentScene!.sceneCamera!.move(0, -1, 0);
    if (e.key === "a") this.currentScene!.sceneCamera!.move(-1, 0, 0);
    if (e.key === "d") this.currentScene!.sceneCamera!.move(1, 0, 0);
  }

  override Start(): void {
    const camera = new Drake.Camera(90, 0.1, 1000, [10, 10, -15], [0, 0, 1]);
    const mainSceneGUI = new GUI();
    mainSceneGUI.addElement(this.icon);

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

    
    this.setResolution(640, 480);
    document.addEventListener("keydown", this.handleCameraMove.bind(this));
  }

  override Update(): void {
    this.cube.rotate(1 * this.deltaTime, 0.5 * this.deltaTime, 0);
  }
}

const game = new MyGame(canvas);
game.run();
