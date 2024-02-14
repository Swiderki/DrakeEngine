import Overlap from "./behavior/Overlap";
import PhysicalGameObject from "./entities/game-objects/PhysicalGameObject";
import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";

import { QuaternionUtils } from "@/src/util/quaternions";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyOverlap extends Overlap {
  override onOverlap(): void {}
}

class MyGame extends Drake.Engine {
  cube: Cube;
  axis;
  hue: number = 0;
  vec: number = 1;
  cubes: Cube[] = [];
  physicalCube: PhysicalGameObject;
  rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };
  plane;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.cube = new Drake.Cube([10, 10, -14]);
    this.axis = new Drake.Piramide();

    const c1 = new Cube([0, 0, 0], [1, 1, 1]);
    const c2 = new Cube([5, 0, 0], [1, 1, 1]);

    c1.boxCollider = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
    ];
    c2.boxCollider = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
    ];

    this.plane = new Drake.Cube([0, 0, 0], [10, 0.1, 10], undefined, "#0f0");

    this.cubes.push(c1);
    this.cubes.push(c2);
    // this.physicalCube = new PhysicalObject("objects/cube_wire.obj", {position: [0, 3, 0]});
    this.physicalCube = PhysicalGameObject.createFromGameObject(new Cube([0, 3, 0]), {
      // acceleration: { x: 0, y: 1, z: 0 },
    });
  }

  handleCameraMove(e: KeyboardEvent) {
    if (!this.mainCamera) return;
    if (e.key === "w") this.mainCamera.move(0, 1, 0);
    if (e.key === "s") this.mainCamera.move(0, -1, 0);
    if (e.key === "a") this.mainCamera.move(-1, 0, 0);
    if (e.key === "d") this.mainCamera.move(1, 0, 0);
    if (e.key === "q") this.mainCamera.rotate({ x: 0, y: 1, z: 0 }, (Math.PI / 180) * -5);
    if (e.key === "e") this.mainCamera.rotate({ x: 0, y: 1, z: 0 }, (Math.PI / 180) * 5);
  }

  override Start(): void {
    const camera = new Drake.Camera(60, 0.1, 1000, [0, 3, -15], [0, 0, 1]);

    const mainScene = new Drake.Scene();

    mainScene.setMainCamera(camera, this.width, this.height);

    const mainSceneID = this.addScene(mainScene);
    this.setCurrentScene(mainSceneID);

    // this.cubes.forEach((cube) => mainScene.addGameObject(cube));
    mainScene.addGameObject(this.physicalCube);
    // mainScene.addGameObject(this.axis);
    mainScene.addGameObject(this.plane);
    // this.physicalCube.applyForce({x: 5, y: 0, z: 0});
    // this.physicalCube.velocity = Vector.fromArray([8, 0, 0]);

    const ov = new MyOverlap(this.cubes[0], this.cubes[1]);
    mainScene.addOverlap(ov);

    this.currentScene.animatedObjectDestruction(this.physicalCube.id);

    this.setResolution(640, 480);
    document.addEventListener("keydown", this.handleCameraMove.bind(this));

    // setTimeout(() => (this.plane.color = "#f00"), 200);
    this.plane.setScale(1, 1, 1);
    setTimeout(() => this.plane.setLineColor(1, "#00f"), 300);
  }

  override Update(): void {
    // this.plane.scale(1.1 * this.deltaTime, 1, 1.1 * this.deltaTime);
    const rotationSpeed = Math.PI / 2; // Obrót o 360 stopni na sekundę

    // Aktualizacja kwaternionu rotacji
    QuaternionUtils.setFromAxisAngle(
      this.rotationQuaternion,
      { x: 0, y: 1, z: 0 }, // Oś obrotu
      rotationSpeed * this.deltaTime // Kąt obrotu
    );

    // Normalizacja kwaternionu
    QuaternionUtils.normalize(this.rotationQuaternion);

    this.physicalCube?.updatePhysics(this.deltaTime);

    // Zastosowanie kwaternionu do obrotu kostek, piramidy i osi
    // this.cubes.forEach((cube) => cube.applyQuaternion(this.rotationQuaternion));

    // this.cubes[1]!.move(0.2 * this.vec, 0, 0);
    // if (this.cubes[1].position.x > 20 || this.cubes[1].position.x < -5) this.vec *= -1;
  }
}

const game = new MyGame(canvas);
game.run();
