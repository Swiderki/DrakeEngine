import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cube: Cube;
  axis;

  constructor(canvas: HTMLCanvasElement) {
    
    super(canvas);
    this.cube = new Drake.Cube([10, 10, -14]);
    this.axis = new Drake.GameObject("objects/axis.obj");
  }

  handleCameraMove(e: KeyboardEvent) {
    if (e.key === "w") this.currentScene!.sceneCamera!.move(0, 1, 0);
    if (e.key === "s") this.currentScene!.sceneCamera!.move(0, -1, 0);
    if (e.key === "a") this.currentScene!.sceneCamera!.move(-1, 0, 0);
    if (e.key === "d") this.currentScene!.sceneCamera!.move(1, 0, 0);
  }

  override Start(): void {
     
    const camera = new Drake.Camera(90, 0.1, 1000, [10, 10, -15], [0, 0, 1]);
    const mainScene = new Drake.Scene(      
      this.width,
      this.height,
      this.idGenerator.id
    );

    mainScene.setCamera(camera);
    
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
