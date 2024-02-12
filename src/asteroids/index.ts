import Drake from "../index";
import { QuaternionUtils } from "@/src/util/quaternions";

const canvas = document.getElementByID("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class Asteroids extends Drake.Engine {
  rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };

  constructor(canvas: HTMLCanvasElement) {
    const camera = new Drake.Camera(69, 0.1, 1000, [10, 10, -15], [0, 0, 1]);
    super(canvas, camera);
  }

  handleCameraMove(e: KeyboardEvent) {
    if (e.key === "w") this.mainCamera.move(0, 1, 0);
    if (e.key === "s") this.mainCamera.move(0, -1, 0);
    if (e.key === "a") this.mainCamera.move(-1, 0, 0);
    if (e.key === "d") this.mainCamera.move(0.1, 0, 0);
  }

  override Start(): void {
    this.setResolution(640, 480);
    document.addEventListener("keydown", this.handleCameraMove.bind(this));
  }

  override Update(): void {
    // const rotationSpeed = Math.PI / 2;
    // QuaternionUtils.setFromAxisAngle(
    //   this.rotationQuaternion,
    //   { x: 0, y: 1, z: 0 },
    //   rotationSpeed * this.deltaTime
    // );
    // QuaternionUtils.normalize(this.rotationQuaternion);
  }
}

const game = new Asteroids(canvas);
game.run();
