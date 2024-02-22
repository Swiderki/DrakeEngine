import Overlap from "./behavior/Overlap";
import PhysicalGameObject from "./entities/game-objects/PhysicalGameObject";
import Cube from "./entities/game-objects/built-in/Cube";
import Drake, { GameObject, Sphere } from "./index";

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
    this.axis = new Drake.Piramide([0, 0, 60], [30, 30, 30]);
    this.axis.showBoxcollider = true;
    this.axis.autoupdateBoxCollider = true;
    this.axis.Start = () => this.axis.generateBoxCollider();
    this.axis.Update = () => {
      this.axis.rotate(0, 0, this.deltaTime);
    };

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
    if (e.key === "w") this.mainCamera.move(0, 0, 1);
    if (e.key === "s") this.mainCamera.move(0, 0, -1);
    if (e.key === "a") this.mainCamera.move(-1, 0, 0);
    if (e.key === "d") this.mainCamera.move(1, 0, 0);
    if (e.key === "z") this.mainCamera.move(0, 0, 1);
    if (e.key === "x") this.mainCamera.move(0, 0, -1);
    if (e.key === "q") this.mainCamera.rotate({ x: 0, y: 1, z: 0 }, (Math.PI / 180) * -5);
    if (e.key === "e") this.mainCamera.rotate({ x: 0, y: 1, z: 0 }, (Math.PI / 180) * 5);
  }

  override Start(): void {
    this.setResolution(640, 480);

    const camera = new Drake.Camera(60, 0.1, 1000, [0, 3, -15], [0, 0, 1]);

    const bg = new GameObject("objects/background.obj");
    bg.Update = () => {
      bg.rotate(this.deltaTime * 0.1, 0, 0);
    };
    const mainScene = new Drake.Scene({
      object: bg,
      position: { x: 100, y: this.canvas.height / 2 + 50 },
      repeat: true,
      rotationLikeCameraSpeed: 3,
    });

    mainScene.setMainCamera(camera, this.width, this.height);

    const mainSceneID = this.addScene(mainScene);
    this.setCurrentScene(mainSceneID);

    // this.cubes.forEach((cube) => mainScene.addGameObject(cube));
    // mainScene.addGameObject(this.physicalCube);
    // mainScene.addGameObject(this.axis);
    mainScene.addGameObject(this.plane);
    this.plane.Start = () => this.plane.setLineColor(14, "#f00");
    // this.physicalCube.applyForce({x: 5, y: 0, z: 0});
    // this.physicalCube.velocity = Vector.fromArray([8, 0, 0]);

    const ov = new MyOverlap(this.cubes[0], this.cubes[1]);
    mainScene.addOverlap(ov);

    // this.currentScene.animatedObjectDestruction(this.physicalCube.id);

    document.addEventListener("keydown", this.handleCameraMove.bind(this));

    // setTimeout(() => (this.plane.color = "#f00"), 200);
    this.plane.setScale(1, 1, 1);
    setTimeout(() => {
      const g = PhysicalGameObject.createFromGameObject(new Sphere([0, 1, 0]));
      g.Start = () => console.log("start");
      g.Update = () => console.log("update");
      this.currentScene.addGameObject(g);
    }, 1000);
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

    // this.physicalCube?.updatePhysics(this.deltaTime);

    // Zastosowanie kwaternionu do obrotu kostek, piramidy i osi
    // this.cubes.forEach((cube) => cube.applyQuaternion(this.rotationQuaternion));

    // this.cubes[1]!.move(0.2 * this.vec, 0, 0);
    // if (this.cubes[1].position.x > 20 || this.cubes[1].position.x < -5) this.vec *= -1;
  }
}

const game = new MyGame(canvas);
game.run();
