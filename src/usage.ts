import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";
import { QuaternionUtils } from "@/src/util/quaternions";
import { Howl } from "howler";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cubes: Cube[] = [];
  axis;
  pyramide;
  rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };
  vixa;

  constructor(canvas: HTMLCanvasElement) {
    const camera = new Drake.Camera(69, 0.1, 1000, [10, 10, -15], [0, 0, 1]);
    super(canvas, camera);
    [...Array(1400)].forEach((_, i) => {
      this.cubes.push(new Cube([i * 5, 0, 0]));
    });
    this.axis = new Drake.GameObject("objects/axis_wire.obj");
    this.pyramide = new Drake.Piramide([20, 10, 0]);
    this.addSceneMesh(this.pyramide);
    this.cubes.forEach((cube) => this.addSceneMesh(cube));

    [...Array(100)].map((_, i) => this.addSceneMesh(new Drake.Cube([i * 0.1, 0, 0])));

    this.vixa = new Howl({
      src: ["./public/sounds/rave_digger.mp3"],
    });
  }

  handleCameraMove(e: KeyboardEvent) {
    this.vixa.play();
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
    const rotationSpeed = Math.PI / 2; // Obrót o 360 stopni na sekundę

    // Aktualizacja kwaternionu rotacji
    QuaternionUtils.setFromAxisAngle(
      this.rotationQuaternion,
      { x: 0, y: 1, z: 0 }, // Oś obrotu
      rotationSpeed * this.deltaTime // Kąt obrotu
    );

    // Normalizacja kwaternionu
    QuaternionUtils.normalize(this.rotationQuaternion);

    // Zastosowanie kwaternionu do obrotu kostek, piramidy i osi
    this.cubes.forEach((cube) => cube.applyQuaternion(this.rotationQuaternion));
    this.axis.applyQuaternion(this.rotationQuaternion);
    this.pyramide.applyQuaternion(this.rotationQuaternion);
  }
}

// Super kod 123
const game = new MyGame(canvas);
game.run();
