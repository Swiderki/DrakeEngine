import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";
import { QuaternionUtils } from "@/src/util/quaternions";


const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cube: Cube;
  axis;

  constructor(canvas: HTMLCanvasElement) {
    const camera = new Drake.Camera(90, 0.1, 1000, [10, 10, -15], [0, 0, 1]);
    super(canvas, camera);
    this.cube = new Drake.Cube([10, 10, 0]);
    this.axis = new Drake.GameObject("objects/axis_wire.obj");
    this.addSceneMesh(this.cube);
    console.log(this.cube.vertecies)
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
  // Tworzenie kwaternionu reprezentującego obrót
  const rotationSpeed = Math.PI / 2; // obrót o 360 stopni na sekundę
  let rotationQuaternion = QuaternionUtils.setFromAxisAngle(
    { x: 1, y: 0, z: 1 }, // Oś obrotu
    rotationSpeed * this.deltaTime // Kąt obrotu
  );
  
  // Normalizacja kwaternionu
  rotationQuaternion = QuaternionUtils.normalize(rotationQuaternion);

  // Zastosowanie kwaternionu do obrotu kostki
  if (this.cube.applyQuaternion) {
    this.cube.applyQuaternion(rotationQuaternion);
  }
  this.axis.applyQuaternion(rotationQuaternion);
}

}

// Super kod 123
const game = new MyGame(canvas);
game.run();
