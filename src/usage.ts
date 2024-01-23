import { Overlap } from "./behavior/Overlap";
import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";

import { QuaternionUtils } from "@/src/util/quaternions";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyOverlap extends Overlap {
  override onOverlap(): void {
    console.log("Dzieje się!");
  }
}

class MyGame extends Drake.Engine {
  cube: Cube;
  axis;
  hue: number = 0;
  vec: number = 1;
  cubes: Cube[] = [];
  rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.cube = new Drake.Cube([10, 10, -14]);
    this.axis = new Drake.GameObject("objects/axis.obj");

    const c1 = new Cube([0, 0, 0], [1, 1, 1]);
    const c2 = new Cube([5, 0, 0], [1, 1, 1]);

    c1.boxCollider = [{x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1}]
    c2.boxCollider = [{x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1}]

    this.cubes.push(c1);
    this.cubes.push(c2);
  }

  handleCameraMove(e: KeyboardEvent) {
    if (!this.mainCamera) return;
    if (e.key === "w") this.mainCamera.move(0, 1, 0);
    if (e.key === "s") this.mainCamera.move(0, -1, 0);
    if (e.key === "a") this.mainCamera.move(-1, 0, 0);
  }

  override Start(): void {
    this.setResolution(1280, 720);
    const camera = new Drake.Camera(90, 0.1, 1000, [10, 10, -15], [0, 0, 1]);

    const mainScene = new Drake.Scene(
      this.width,
      this.height,
      this.idGenerator.id
    );

    mainScene.setCamera(camera);

    const mainSceneId = this.addScene(mainScene);
    this.setCurrentScene(mainSceneId);

    this.cubes.forEach((cube) => mainScene.addSceneMesh(cube));

    const ov = new MyOverlap(this.cubes[0], this.cubes[1]);
    mainScene.addOverlap(ov);

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

    this.cubes[1]!.move(0.2 * this.vec, 0, 0);
    if (this.cubes[1].position.x > 20 || this.cubes[1].position.x < -5) this.vec *= -1;
  }
}

const game = new MyGame(canvas);
game.run();
