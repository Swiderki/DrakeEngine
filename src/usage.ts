import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cube: Cube;
  axis;

  constructor(canvas: HTMLCanvasElement) {
    const camera = new Drake.Camera(90, 0.1, 1000, [10, 10, -15], [0, 0, 1]);
    super(canvas, camera);
    this.cube = new Drake.Cube([10, 10, -14]);
    this.axis = new Drake.GameObject("objects/axis.obj");

    this.addSceneMesh(this.cube);
    this.addSceneMesh(this.axis);
  }

  handleCameraMove(e: KeyboardEvent) {
    if (e.key === "w") this.mainCamera.move(0, 1, 0);
    if (e.key === "s") this.mainCamera.move(0, -1, 0);
    if (e.key === "a") this.mainCamera.move(-1, 0, 0);
    if (e.key === "d") this.mainCamera.move(1, 0, 0);
  }

  override Start(): void {
    this.setResolution(640, 480);
    document.addEventListener("keydown", this.handleCameraMove.bind(this));
  }

  override Update(): void {
    this.cube.rotate(1 * this.deltaTime, 0.5 * this.deltaTime, 0);
  }
}

const game = new MyGame(canvas);
game.run();
