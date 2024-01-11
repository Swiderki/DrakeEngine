import { Overlap } from "./behavior/Overlap";
import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";
import GameObject from "./entities/game-objects/GameObject";

class MyOverlap extends Overlap {
  constructor(obj1: GameObject, obj2: GameObject) {
    super(obj1, obj2);
  }

  override onOverlap(): void {
    console.log("xd");
  }
}

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cube: Cube;
  cube2: Cube;
  axis;
  v: number = -1;
  ov: Overlap;

  constructor(canvas: HTMLCanvasElement) {
    const camera = new Drake.Camera(90, 0.1, 1000, [10, 10, -15], [0, 0, 1]);
    super(canvas, camera);
    this.cube = new Drake.Cube([10, 10, 0]);
    this.cube2 = new Drake.Cube([20, 10, 0]);
    this.axis = new Drake.GameObject("objects/axis_wire.obj");

    this.addSceneMesh(this.cube);
    this.addSceneMesh(this.cube2);
    this.addSceneMesh(this.axis);

    this.cube2.boxCollider = [{x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1}];
    this.cube.boxCollider = [{x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1}];

    this.ov = new MyOverlap(this.cube, this.cube2);
    console.log(this.cube.size.x)
    const ovID = this.addOverlap(this.ov);
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
    this.cube2.move(this.v/50, 0, 0);
    if (this.cube2.position.x < -1 || this.cube2.position.x > 20) this.v *= -1;
  }
}

// Super kod 123
const game = new MyGame(canvas);
game.run();
